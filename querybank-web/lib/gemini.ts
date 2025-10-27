import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SCHEMA_DOC = `Schema: demo_bank
Tables: customers(customer_id, first_name, last_name, account_type, account_balance, account_status, credit_score), loans(loan_id, customer_id FK, loan_type, outstanding_balance, loan_status), transactions(transaction_id, customer_id FK, amount, transaction_type, transaction_date)`;

export interface QueryResponse {
  query: string;
  needs_chart: boolean;
  chart_type: 'bar' | 'line' | 'pie' | 'scatter' | null;
  chart_config?: {
    x_column: string;
    y_column: string;
    title: string;
    xlabel: string;
    ylabel: string;
  };
  explanation: string;
}

export async function generateQuery(userQuestion: string): Promise<QueryResponse> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024,
    }
  });

  const prompt = `You are a SQL query generator for a PostgreSQL banking database.

User Question: "${userQuestion}"

IMPORTANT: Only reject the question if it is:
1. A greeting (salam, hello, hi, etc.)
2. Random gibberish with no meaning (asdfjkl, sfgdsa, etc.)
3. Not related to banking data at all

If it's ANY question about customers, loans, transactions, balances, credit scores, or banking data (even if using words like "worst", "bad", "lowest"), you MUST generate a valid SQL query. Do NOT reject business questions just because they use negative words.

Database Schema (demo_bank):
- Table: customers
  Columns: customer_id, first_name, last_name, account_type, account_balance, account_status, credit_score

- Table: loans
  Columns: loan_id, customer_id (FK), loan_type, outstanding_balance, loan_status

- Table: transactions
  Columns: transaction_id, customer_id (FK), amount, transaction_type, transaction_date

Generate a response in this EXACT JSON format:
{
  "query": "SET search_path TO demo_bank; SELECT customer_id FROM customers LIMIT 10",
  "needs_chart": false,
  "chart_type": null,
  "chart_config": {
    "x_column": "column_name",
    "y_column": "column_name",
    "title": "Chart Title",
    "xlabel": "X axis label",
    "ylabel": "Y axis label"
  },
  "explanation": "Sorğu nəticəsinin izahı Azərbaycan dilində"
}

Important Rules:
1. Start SQL with "SET search_path TO demo_bank;"
2. After SET search_path, use table names WITHOUT schema prefix (write "customers", not "demo_bank.customers")
3. Use PostgreSQL syntax (not MySQL)
4. If the query returns data suitable for a chart (multiple rows with numeric values), set needs_chart to true
5. For charts: use "bar" for comparisons, "pie" for distributions, "line" for trends
6. In chart_config, use the EXACT column names from your SELECT query
7. Write explanation in Azerbaijani language
8. Return ONLY the JSON object, no additional text

Example 1 - Valid question: "Ən yüksək balansa malik müştərilər"
Response:
{
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
  "explanation": "Ən yüksək hesab balansına malik 10 müştəri göstərilir."
}

Example 2 - Invalid input (greeting, gibberish): "salam" or "asdfjkl"
Response:
{
  "query": "ERROR",
  "needs_chart": false,
  "chart_type": null,
  "chart_config": null,
  "explanation": "Daxil etdiyiniz sorğu anlaşıqlı deyil. Zəhmət olmasa bank məlumatları haqqında konkret sual verin."
}

Example 3 - Valid question with negative words: "en pis musteri" or "lowest credit score"
Response:
{
  "query": "SET search_path TO demo_bank; SELECT first_name, last_name, credit_score, account_balance FROM customers ORDER BY credit_score ASC LIMIT 10",
  "needs_chart": true,
  "chart_type": "bar",
  "chart_config": {
    "x_column": "first_name",
    "y_column": "credit_score",
    "title": "Ən Aşağı Kredit Reytinqinə Malik Müştərilər",
    "xlabel": "Müştəri",
    "ylabel": "Kredit Reytinqi"
  },
  "explanation": "Ən aşağı kredit reytinqinə malik 10 müştəri göstərilir."
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI Response:', text.substring(0, 200)); // Debug

    // Extract JSON from response - try multiple patterns
    let jsonText = '';

    // Pattern 1: JSON in markdown code block
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
        }
      }
    }

    if (!jsonText) {
      console.error('Failed to extract JSON from response:', text);
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonText.trim());

    return parsed as QueryResponse;
  } catch (error) {
    console.error('Error generating query:', error);
    throw error;
  }
}
