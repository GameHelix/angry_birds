import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface QueryResponse {
  response_type: 'text_only' | 'query_with_data' | 'query_with_chart' | 'conversational' | 'error';
  message: string;
  query?: string;
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

export async function generateQuery(userQuestion: string, retryCount: number = 0): Promise<QueryResponse> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  });

  const prompt = `You are a friendly banking AI assistant. Respond naturally to user questions.

User: "${userQuestion}"

Database: demo_bank
Tables:
- customers(customer_id, first_name, last_name, account_type, account_balance, account_status, credit_score)
- loans(loan_id, customer_id, loan_type, outstanding_balance, loan_status)
- transactions(transaction_id, customer_id, amount, transaction_type, transaction_date)

Instructions:
1. If it's a greeting/thanks → Be friendly, don't query database
2. If asking "what is X?" → Explain the concept
3. If asking for data → Generate PostgreSQL query

Language: Accept informal Azerbaijani (chox=çox, musteri=müştəri, odeyen=ödəyən, etc.)

Response Format (JSON only):
{
  "response_type": "conversational|text_only|query_with_data|query_with_chart",
  "message": "Your response in Azerbaijani",
  "query": "SET search_path TO demo_bank; SELECT ...",
  "needs_chart": true/false,
  "chart_type": "bar|line|pie|null",
  "chart_config": {"x_column": "...", "y_column": "...", "title": "...", "xlabel": "...", "ylabel": "..."},
  "explanation": "Technical note"
}

Examples:

"salam" →
{"response_type":"conversational","message":"Salam! 👋 Bank məlumatlarınız haqqında sual verə bilərsiniz.","query":null,"needs_chart":false,"chart_type":null,"explanation":"Greeting"}

"CLV nədir?" →
{"response_type":"text_only","message":"CLV (Customer Lifetime Value) - müştərinin həyat boyu dəyəri. Bütün əməliyyatlarının cəmidir.\\n\\nHesablamaq istəyirsiniz?","query":null,"needs_chart":false,"chart_type":null,"explanation":"Concept explanation"}

"en chox kredit odeyen musteri" or "ən çox kredit ödəyən müştəri" →
{"response_type":"query_with_chart","message":"Ən yüksək kredit balansı olan müştərilər","query":"SET search_path TO demo_bank; SELECT c.first_name, c.last_name, l.outstanding_balance FROM customers c JOIN loans l ON c.customer_id=l.customer_id ORDER BY l.outstanding_balance DESC LIMIT 10","needs_chart":true,"chart_type":"bar","chart_config":{"x_column":"first_name","y_column":"outstanding_balance","title":"Kredit Balansı","xlabel":"Müştəri","ylabel":"Balans"},"explanation":"Loan query"}

Return ONLY valid JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    const text = aiResponse.text();

    if (!text || text.trim().length === 0) {
      console.error('Empty AI response for:', userQuestion);
      if (aiResponse.candidates?.[0]) {
        console.error('Candidate:', JSON.stringify(aiResponse.candidates[0], null, 2));
      }

      // Simple retry once
      if (retryCount === 0) {
        console.log('Retrying...');
        return generateQuery(userQuestion, 1);
      }

      throw new Error('AI returned empty response after retry');
    }

    // Extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      if (retryCount === 0) {
        return generateQuery(userQuestion, 1);
      }
      throw new Error('No JSON in response');
    }

    const parsed = JSON.parse(jsonMatch[0].trim());

    return {
      response_type: parsed.response_type || 'error',
      message: parsed.message || 'Cavab alındı',
      query: parsed.query || undefined,
      needs_chart: parsed.needs_chart || false,
      chart_type: parsed.chart_type || null,
      chart_config: parsed.chart_config,
      explanation: parsed.explanation || ''
    };
  } catch (error) {
    console.error('Error generating query:', error);
    return {
      response_type: 'error',
      message: 'Üzr istəyirəm, xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.',
      query: undefined,
      needs_chart: false,
      chart_type: null,
      explanation: String(error)
    };
  }
}
