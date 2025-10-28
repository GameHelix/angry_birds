import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SCHEMA_DOC = `Schema: demo_bank
Tables: customers(customer_id, first_name, last_name, account_type, account_balance, account_status, credit_score), loans(loan_id, customer_id FK, loan_type, outstanding_balance, loan_status), transactions(transaction_id, customer_id FK, amount, transaction_type, transaction_date)`;

export interface QueryResponse {
  response_type: 'text_only' | 'query_with_data' | 'query_with_chart' | 'conversational' | 'error';
  message: string; // Always present - the main response to user
  query?: string; // Optional - only if SQL query is needed
  needs_chart: boolean;
  chart_type: 'bar' | 'line' | 'pie' | 'scatter' | null;
  chart_config?: {
    x_column: string;
    y_column: string;
    title: string;
    xlabel: string;
    ylabel: string;
  };
  explanation: string; // Technical explanation of what was done
}

export async function generateQuery(userQuestion: string, retryCount: number = 0): Promise<QueryResponse> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: retryCount > 0 ? 0.1 : 0.5, // Higher temperature for better informal language understanding
      maxOutputTokens: 1024,
    }
  });

  const prompt = `You are QueryBank AI - an intelligent banking data assistant that understands natural human conversation.
${retryCount > 0 ? '\n⚠️ CRITICAL: Your previous response was not valid JSON. You MUST return ONLY a JSON object. NO explanations, NO text before or after, ONLY JSON.\n' : ''}

User Question: "${userQuestion}"

Database Schema (demo_bank):
- customers: customer_id, first_name, last_name, account_type, account_balance, account_status, credit_score
- loans: loan_id, customer_id (FK), loan_type, outstanding_balance, loan_status
- transactions: transaction_id, customer_id (FK), amount, transaction_type, transaction_date

CRITICAL LANGUAGE NOTE: Users OFTEN write in informal Azerbaijani (without special characters).
You MUST understand and accept BOTH forms:

Informal → Formal:
- "chox", "cox" → "çox" (much/many)
- "en chox", "en cox" → "ən çox" (most)
- "odeyen", "ödəyən" → paying
- "odenis", "ödəniş" → payment
- "musteri", "müsteri" → "müştəri" (customer)
- "kredit" → loan
- "gosterir", "göstərir" → show

Common queries with informal spelling:
- "en chox kredit odeyen musteri" = customers with most loans
- "en cox balans" = highest balance
- "musteri sayi" = customer count

IMPORTANT: NEVER reject queries just because they use informal spelling!
Treat "en chox kredit odeyen musteri" EXACTLY the same as "ən çox kredit ödəyən müştəri"

=== STEP 1: UNDERSTAND USER INTENT ===

Classify the user's intent into ONE of these categories:

1. **GREETING/SOCIAL** - Hello, hi, salam, how are you, thank you, bye
   → response_type: "conversational"
   → NO query needed, just friendly response

2. **DATA_QUERY** - Questions that need data from database
   → response_type: "query_with_data" or "query_with_chart"
   → SQL query required

3. **ANALYTICAL_QUESTION** - Business metrics without needing raw data (CLV, RFM, churn rate concepts)
   → response_type: "text_only" or "query_with_data"
   → Explain the metric, optionally show example query

4. **META_QUESTION** - Questions about the system itself (what can you do, how do you work)
   → response_type: "text_only"
   → NO query needed, just explanation

5. **CLARIFICATION** - Unclear request, needs more context
   → response_type: "conversational"
   → Ask user for clarification

6. **INVALID** - Random gibberish (asdfjkl, !@#$%^)
   → response_type: "error"

=== STEP 2: DETERMINE RESPONSE TYPE ===

**text_only**: Use when:
- User asks "What is CLV?" (explaining a concept)
- User asks "What can you do?" (meta question)
- User asks "How does RFM work?" (analytical explanation)
- NO database query needed, just text explanation

**conversational**: Use when:
- User says "salam", "hello", "thanks"
- User needs clarification
- Friendly acknowledgment needed

**query_with_data**: Use when:
- User wants data but visualization would NOT be helpful
- Simple counts, single values
- Example: "How many customers?" → returns one number

**query_with_chart**: Use when:
- User wants data AND visualization would be helpful
- Multiple rows with numeric comparisons
- Example: "Top 10 customers by balance"

**error**: Only for truly random gibberish

=== STEP 3: CONSTRUCT RESPONSE ===

Response JSON Format:
{
  "response_type": "text_only" | "query_with_data" | "query_with_chart" | "conversational" | "error",
  "message": "Main response to user in Azerbaijani",
  "query": "SQL query (only if response_type is query_with_data or query_with_chart, otherwise null)",
  "needs_chart": true/false,
  "chart_type": "bar" | "line" | "pie" | null,
  "chart_config": { /* only if needs_chart is true */ },
  "explanation": "Technical explanation of what was done"
}

=== EXAMPLES ===

Example 1 - Greeting:
User: "salam"
{
  "response_type": "conversational",
  "message": "Salam! 👋 Mən QueryBank AI-am. Bank məlumatlarınızı təhlil etməkdə sizə kömək edə bilərəm. Müştərilər, kreditlər və əməliyyatlar haqqında sual verə bilərsiniz.",
  "query": null,
  "needs_chart": false,
  "chart_type": null,
  "explanation": "Greeting response - no database query needed"
}

Example 2 - Meta question:
User: "Sən nə edə bilərsən?"
{
  "response_type": "text_only",
  "message": "Mən bank məlumatlarınızı təbii dildə təhlil edə bilərəm. Məsələn:\\n\\n✅ Müştəri məlumatları (ən yüksək balans, kredit reytinqi, və s.)\\n✅ Kredit təhlili (kredit növləri, statuslar)\\n✅ Əməliyyat təhlili (ən aktiv müştərilər)\\n✅ Biznes metriklər (CLV, RFM, ARPU)\\n\\nSadəcə sualınızı verin, qalanını mən edəcəyəm!",
  "query": null,
  "needs_chart": false,
  "chart_type": null,
  "explanation": "Meta question about system capabilities - no database query needed"
}

Example 3 - Analytical concept explanation:
User: "CLV nədir?"
{
  "response_type": "text_only",
  "message": "CLV (Customer Lifetime Value) - Müştərinin Həyat Boyu Dəyəri deməkdir.\\n\\n📊 **Tərifəsi**: Bir müştərinin bütün əməliyyatlarının ümumi dəyəri.\\n\\n💡 **Niyə vacibdir**: Ən dəyərli müştərilərinizi müəyyən etməyə kömək edir.\\n\\n📈 **Necə hesablanır**: SUM(transactions.amount) per customer\\n\\nİstəyirsiniz ki, sizin ən yüksək CLV-li müştərilərinizi göstərim?",
  "query": null,
  "needs_chart": false,
  "chart_type": null,
  "explanation": "Explaining CLV concept - offering to run query if user wants"
}

Example 4 - Simple data query (no chart needed):
User: "Neçə aktiv müştərimiz var?"
{
  "response_type": "query_with_data",
  "message": "Aktiv müştəri sayı hesablanır...",
  "query": "SET search_path TO demo_bank; SELECT COUNT(*) as active_customers FROM customers WHERE account_status = 'active'",
  "needs_chart": false,
  "chart_type": null,
  "explanation": "Counting active customers - single number result, no chart needed"
}

Example 5 - Data query with visualization:
User: "Ən yüksək balansa malik müştərilər"
{
  "response_type": "query_with_chart",
  "message": "Ən yüksək hesab balansına malik müştərilər",
  "query": "SET search_path TO demo_bank; SELECT first_name, last_name, account_balance FROM customers ORDER BY account_balance DESC LIMIT 10",
  "needs_chart": true,
  "chart_type": "bar",
  "chart_config": {
    "x_column": "first_name",
    "y_column": "account_balance",
    "title": "Ən Yüksək Balansa Malik Müştərilər",
    "xlabel": "Müştəri",
    "ylabel": "Balans (₼)"
  },
  "explanation": "Showing top 10 customers by balance with bar chart visualization"
}

Example 6 - Business metric with data:
User: "CLV hesabla" or "müştərilərin həyat boyu dəyərini göstər"
{
  "response_type": "query_with_chart",
  "message": "Müştərilərin Həyat Boyu Dəyəri (CLV) hesablanır - hər müştərinin bütün əməliyyatlarının ümumi dəyəri",
  "query": "SET search_path TO demo_bank; SELECT c.customer_id, c.first_name, c.last_name, COALESCE(SUM(t.amount), 0) as lifetime_value FROM customers c LEFT JOIN transactions t ON c.customer_id = t.customer_id GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY lifetime_value DESC LIMIT 20",
  "needs_chart": true,
  "chart_type": "bar",
  "chart_config": {
    "x_column": "first_name",
    "y_column": "lifetime_value",
    "title": "Customer Lifetime Value (CLV)",
    "xlabel": "Müştəri",
    "ylabel": "Həyat Boyu Dəyər (₼)"
  },
  "explanation": "Calculating CLV for top 20 customers by summing all their transaction amounts"
}

Example 7 - RFM Analysis:
User: "RFM analizi göstər"
{
  "response_type": "query_with_chart",
  "message": "RFM (Recency, Frequency, Monetary) analizi - müştəri seqmentasiyası üçün istifadə olunan metod",
  "query": "SET search_path TO demo_bank; SELECT c.customer_id, c.first_name, c.last_name, COUNT(t.transaction_id) as frequency, COALESCE(SUM(t.amount), 0) as monetary, COALESCE(CURRENT_DATE - MAX(t.transaction_date), 9999) as recency_days FROM customers c LEFT JOIN transactions t ON c.customer_id = t.customer_id GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY frequency DESC, monetary DESC LIMIT 20",
  "needs_chart": true,
  "chart_type": "bar",
  "chart_config": {
    "x_column": "first_name",
    "y_column": "monetary",
    "title": "RFM Analizi - Monetary (Ümumi Dəyər)",
    "xlabel": "Müştəri",
    "ylabel": "Ümumi Məbləğ (₼)"
  },
  "explanation": "RFM analysis showing Frequency, Monetary value, and Recency for top 20 customers"
}

Example 8 - Thank you:
User: "təşəkkürlər" or "thank you" or "sağol"
{
  "response_type": "conversational",
  "message": "Xahiş edirəm! 😊 Başqa sualınız varsa, hər zaman hazıram kömək etməyə.",
  "query": null,
  "needs_chart": false,
  "chart_type": null,
  "explanation": "Polite acknowledgment - no query needed"
}

Example 9 - Loan query with INFORMAL spelling (VERY COMMON):
User: "en chox kredit odeyen musteri" (NO special characters!)
{
  "response_type": "query_with_chart",
  "message": "Ən çox kredit balansı olan müştərilər",
  "query": "SET search_path TO demo_bank; SELECT c.first_name, c.last_name, l.loan_type, l.outstanding_balance FROM customers c JOIN loans l ON c.customer_id = l.customer_id ORDER BY l.outstanding_balance DESC LIMIT 10",
  "needs_chart": true,
  "chart_type": "bar",
  "chart_config": {
    "x_column": "first_name",
    "y_column": "outstanding_balance",
    "title": "Ən Çox Kredit Olan Müştərilər",
    "xlabel": "Müştəri",
    "ylabel": "Kredit Balansı (₼)"
  },
  "explanation": "Showing customers with highest outstanding loan balances - informal spelling accepted"
}

Example 9b - Same query with proper spelling:
User: "ən çox kredit ödəyən müştəri"
{
  "response_type": "query_with_chart",
  "message": "Ən çox kredit balansı olan müştərilər",
  "query": "SET search_path TO demo_bank; SELECT c.first_name, c.last_name, l.loan_type, l.outstanding_balance FROM customers c JOIN loans l ON c.customer_id = l.customer_id ORDER BY l.outstanding_balance DESC LIMIT 10",
  "needs_chart": true,
  "chart_type": "bar",
  "chart_config": {
    "x_column": "first_name",
    "y_column": "outstanding_balance",
    "title": "Ən Çox Kredit Olan Müştərilər",
    "xlabel": "Müştəri",
    "ylabel": "Kredit Balansı (₼)"
  },
  "explanation": "Showing customers with highest outstanding loan balances"
}

Example 10 - Gibberish:
User: "asdfjkl" or "!@#$%"
{
  "response_type": "error",
  "message": "Üzr istəyirəm, sorğunuzu başa düşə bilmədim. 🤔\\n\\nMəsələn, belə suallar verə bilərsiniz:\\n• Neçə aktiv müştərimiz var?\\n• Ən yüksək balansa malik müştərilər\\n• CLV hesabla\\n• RFM analizi göstər",
  "query": null,
  "needs_chart": false,
  "chart_type": null,
  "explanation": "Invalid input - providing example questions"
}

=== SQL RULES ===
1. Always start with "SET search_path TO demo_bank;"
2. Use table names WITHOUT schema prefix after SET search_path
3. PostgreSQL syntax only
4. Use COALESCE for null handling
5. Column names in chart_config must match SELECT query EXACTLY

=== CHART DECISION RULES ===
- needs_chart = true ONLY when:
  ✅ Multiple rows (2+) with numeric data
  ✅ Comparisons or trends to visualize

- needs_chart = false when:
  ❌ Single value result (COUNT, SUM of one number)
  ❌ Text-only explanation
  ❌ Conversational response

BUSINESS METRICS TO RECOGNIZE:
- **CLV/LTV**: Customer Lifetime Value (sum of all transactions per customer)
- **RFM**: Recency, Frequency, Monetary (customer segmentation)
- **ARPU**: Average Revenue Per User (avg transaction amount per customer)
- **AOV**: Average Order Value (avg transaction amount)
- **Churn**: Inactive customers analysis

IMPORTANT:
- Be conversational and friendly
- Accept greetings and respond warmly
- Explain concepts when asked
- Only generate SQL when actual data is needed
- NEVER reject valid business questions
- Return ONLY valid JSON, no markdown, no extra text`;

  try {
    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    const text = aiResponse.text();

    // Check if response is empty
    if (!text || text.trim().length === 0) {
      console.error('AI returned empty response!');
      console.error('User question:', userQuestion);
      console.error('Result:', JSON.stringify(result, null, 2));
      console.error('Response candidates:', aiResponse.candidates);

      // Check for safety blocks or other issues
      if (aiResponse.candidates && aiResponse.candidates.length > 0) {
        const candidate = aiResponse.candidates[0];
        console.error('Candidate:', JSON.stringify(candidate, null, 2));
      }

      // FALLBACK: Try to handle common patterns when AI fails
      const lowerQuestion = userQuestion.toLowerCase();

      // Pattern: loan-related queries (kredit)
      if ((lowerQuestion.includes('kredit') || lowerQuestion.includes('loan')) &&
          (lowerQuestion.includes('chox') || lowerQuestion.includes('cox') || lowerQuestion.includes('çox') || lowerQuestion.includes('yuksek') || lowerQuestion.includes('yüksek'))) {
        console.log('Fallback: Detected loan query, using predefined response');
        return {
          response_type: 'query_with_chart',
          message: 'Ən yüksək kredit balansına malik müştərilər',
          query: 'SET search_path TO demo_bank; SELECT c.first_name, c.last_name, l.loan_type, l.outstanding_balance FROM customers c JOIN loans l ON c.customer_id = l.customer_id ORDER BY l.outstanding_balance DESC LIMIT 10',
          needs_chart: true,
          chart_type: 'bar',
          chart_config: {
            x_column: 'first_name',
            y_column: 'outstanding_balance',
            title: 'Ən Yüksək Kredit Balansı',
            xlabel: 'Müştəri',
            ylabel: 'Kredit Balansı (₼)'
          },
          explanation: 'Fallback response for loan query - AI returned empty'
        };
      }

      // If no pattern matched, return helpful error
      return {
        response_type: 'error',
        message: 'AI xidməti cavab vermədi. Zəhmət olmasa sualınızı bir az fərqli şəkildə yazın.\n\nMəsələn:\n• "Ən yüksək kredit balansı olan müştərilər"\n• "Kredit növlərinə görə balans"\n• "Müştərilərin kredit məlumatları"',
        query: undefined,
        needs_chart: false,
        chart_type: null,
        explanation: 'AI returned empty response - no fallback pattern matched'
      };
    }

    console.log('AI Response:', text.substring(0, 300)); // Debug

    // Extract JSON from response - try multiple patterns
    let jsonText = '';

    // Pattern 1: JSON in markdown code block with json tag
    const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownMatch) {
      jsonText = markdownMatch[1];
    } else {
      // Pattern 2: JSON in plain code block
      const codeMatch = text.match(/```\s*([\s\S]*?)\s*```/);
      if (codeMatch) {
        jsonText = codeMatch[1];
      } else {
        // Pattern 3: Raw JSON (find first { to last })
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        } else {
          // Pattern 4: JSON might be after some text, look for { ... } more aggressively
          const aggressiveMatch = text.match(/(\{[^{}]*\{[^{}]*\}[^{}]*\}|\{[^{}]*\})/);
          if (aggressiveMatch) {
            jsonText = aggressiveMatch[0];
          }
        }
      }
    }

    if (!jsonText) {
      console.error('Failed to extract JSON from response:', text);
      console.error('Full AI response:', text);

      // RETRY LOGIC: Try one more time with stricter instructions
      if (retryCount === 0) {
        console.warn('No JSON found, retrying with stricter prompt...');
        return generateQuery(userQuestion, 1);
      }

      // FALLBACK: If AI didn't return JSON after retry, return a helpful error
      return {
        response_type: 'error',
        message: 'Üzr istəyirəm, cavab formatı düzgün deyil. Zəhmət olmasa sorğunu yenidən cəhd edin.',
        query: undefined,
        needs_chart: false,
        chart_type: null,
        explanation: 'AI response format invalid after retry'
      };
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Attempted to parse:', jsonText);

      // RETRY on parse error too
      if (retryCount === 0) {
        console.warn('JSON parse failed, retrying with stricter prompt...');
        return generateQuery(userQuestion, 1);
      }

      return {
        response_type: 'error',
        message: 'Üzr istəyirəm, cavab formatı düzgün deyil. Zəhmət olmasa sorğunu yenidən cəhd edin.',
        query: undefined,
        needs_chart: false,
        chart_type: null,
        explanation: 'JSON parse failed after retry'
      };
    }

    // Ensure response has all required fields
    const queryResponse: QueryResponse = {
      response_type: parsed.response_type || 'error',
      message: parsed.message || parsed.explanation || 'Cavab alındı',
      query: parsed.query || undefined,
      needs_chart: parsed.needs_chart || false,
      chart_type: parsed.chart_type || null,
      chart_config: parsed.chart_config,
      explanation: parsed.explanation || parsed.message || ''
    };

    return queryResponse;
  } catch (error) {
    console.error('Error generating query:', error);
    throw error;
  }
}
