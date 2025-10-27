'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Sparkles, LogOut, BarChart3, Terminal } from 'lucide-react';
import DataChart from '@/components/DataChart';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  data?: any[];
  chartConfig?: any;
  chartType?: string;
  query?: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Salam! Mən bank məlumatları üzrə AI köməkçisiyəm. Müştərilər, kreditlər və əməliyyatlar haqqında istənilən sual verə bilərsiniz.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      const result = await response.json();

      if (result.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: `Xəta: ${result.error}`,
          },
        ]);
        return;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.queryInfo.explanation,
        data: result.data,
        chartConfig: result.queryInfo.chart_config,
        chartType: result.queryInfo.needs_chart ? result.queryInfo.chart_type : null,
        query: result.queryInfo.query,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `Xəta baş verdi: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    'Neçə aktiv müştərimiz var?',
    'Kredit növlərinə görə ümumi kredit balansını göstər',
    'Ən yüksək balansa malik 5 müştərini göstər',
    'Hesab növlərinə görə orta kredit reytinqi göstər',
    'Kredit statuslarına görə müştəri sayını göstər',
    'Ən çox əməliyyat edən müştəriləri göstər',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    QueryBank AI
                  </h1>
                  <p className="text-sm text-slate-600">Bank Məlumat Analizi</p>
                </div>
              </div>
              <nav className="flex space-x-2">
                <button
                  className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium"
                >
                  <span>AI Çat</span>
                </button>
                <button
                  onClick={() => router.push('/reports')}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analitika</span>
                </button>
                <button
                  onClick={() => router.push('/sql')}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition flex items-center space-x-2"
                >
                  <Terminal className="h-4 w-4" />
                  <span>SQL Konsolu</span>
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-slate-700 font-medium">
                  {user.full_name}
                </span>
              )}
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  router.push('/login');
                }}
                className="text-sm text-slate-600 hover:text-slate-900 flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Çıxış</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[calc(100vh-300px)] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-2xl px-6 py-4 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>

                  {/* Data Table */}
                  {message.data && message.data.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50 rounded-t-lg">
                          <tr>
                            {Object.keys(message.data[0]).map((key) => (
                              <th
                                key={key}
                                className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {message.data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition">
                              {Object.values(row).map((value: any, i) => (
                                <td key={i} className="px-4 py-3 whitespace-nowrap text-slate-900">
                                  {typeof value === 'number' && value > 1000
                                    ? value.toLocaleString()
                                    : String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Chart */}
                  {message.chartType && message.data && (
                    <div className="mt-4 bg-white rounded-lg p-4">
                      <DataChart
                        data={message.data}
                        chartType={message.chartType}
                        config={message.chartConfig}
                      />
                    </div>
                  )}

                  {/* SQL Query */}
                  {message.query && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-700">
                        SQL Sorğusu
                      </summary>
                      <pre className="mt-2 text-xs bg-slate-800 text-slate-100 p-3 rounded-lg overflow-x-auto">
                        {message.query}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl px-6 py-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Example Questions */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
            <p className="text-xs text-slate-600 mb-2">Nümunə suallar:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(question)}
                  className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition text-slate-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-6 bg-white border-t border-slate-200">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Sualınızı yazın..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center space-x-2 font-medium"
              >
                <span>Göndər</span>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
