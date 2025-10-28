'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Sparkles, LogOut, BarChart3, Terminal, Menu, X, Brain, Zap, Home, Code2, TrendingUp } from 'lucide-react';
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

export default function ChatPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Salam! 👋 Mən QueryBank AI köməkçisiyəm. Bank məlumatlarınızı təbii dildə təhlil etməyə hazıram. Müştərilər, kreditlər və əməliyyatlar haqqında istənilən sual verə bilərsiniz.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            content: `⚠️ Xəta: ${result.error}`,
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
          content: `⚠️ Xəta baş verdi: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    { icon: '👥', text: 'Neçə aktiv müştərimiz var?', color: 'from-blue-500 to-cyan-500' },
    { icon: '💰', text: 'Kredit növlərinə görə ümumi kredit balansını göstər', color: 'from-purple-500 to-pink-500' },
    { icon: '⭐', text: 'Ən yüksək balansa malik 5 müştərini göstər', color: 'from-yellow-500 to-orange-500' },
    { icon: '📊', text: 'Hesab növlərinə görə orta kredit reytinqi göstər', color: 'from-green-500 to-emerald-500' },
    { icon: '📈', text: 'Kredit statuslarına görə müştəri sayını göstər', color: 'from-indigo-500 to-purple-500' },
    { icon: '🔥', text: 'Ən çox əməliyyat edən müştəriləri göstər', color: 'from-red-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-2xl">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    AI Çat
                  </h1>
                  <p className="text-xs text-slate-400">Powered by Gemini 2.5</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-4">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>Əsas Səhifə</span>
                  </button>
                  <button className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 rounded-lg font-medium flex items-center space-x-2">
                    <Brain className="h-4 w-4" />
                    <span>AI Çat</span>
                  </button>
                  <button
                    onClick={() => router.push('/reports')}
                    className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Analitika</span>
                  </button>
                  <button
                    onClick={() => router.push('/sql')}
                    className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-2"
                  >
                    <Terminal className="h-4 w-4" />
                    <span>SQL Konsolu</span>
                  </button>
                </nav>
                <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
                  {user && (
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-lg">
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-300 font-medium">{user.full_name}</span>
                    </div>
                  )}
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      router.push('/login');
                    }}
                    className="px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıxış</span>
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4 space-y-2">
                <button
                  onClick={() => { router.push('/'); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Əsas Səhifə</span>
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full px-4 py-3 text-sm bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 rounded-lg font-medium text-left flex items-center space-x-2"
                >
                  <Brain className="h-4 w-4" />
                  <span>AI Çat</span>
                </button>
                <button
                  onClick={() => { router.push('/reports'); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analitika</span>
                </button>
                <button
                  onClick={() => { router.push('/sql'); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-2"
                >
                  <Terminal className="h-4 w-4" />
                  <span>SQL Konsolu</span>
                </button>
                <div className="pt-4 border-t border-white/10 space-y-2">
                  {user && (
                    <div className="px-4 py-2 text-sm text-slate-300 font-medium flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>{user.full_name}</span>
                    </div>
                  )}
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      router.push('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıxış</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Chat Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Chat Messages */}
            <div className="h-[calc(100vh-340px)] sm:h-[calc(100vh-320px)] overflow-y-auto p-4 sm:p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-3xl rounded-2xl overflow-hidden ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 backdrop-blur-xl border border-white/10 text-white'
                    }`}
                  >
                    {/* Message Avatar & Header */}
                    <div className={`px-4 sm:px-6 pt-4 flex items-center space-x-3 ${message.type === 'assistant' ? 'pb-2' : 'pb-4'}`}>
                      {message.type === 'assistant' && (
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                          <Brain className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${message.type === 'user' ? 'text-blue-100' : 'text-slate-300'}`}>
                          {message.type === 'user' ? 'Siz' : 'QueryBank AI'}
                        </p>
                      </div>
                      {message.type === 'assistant' && (
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Zap className="h-3 w-3" />
                          <span>Gemini 2.5</span>
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="px-4 sm:px-6 pb-4">
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>

                      {/* Data Table */}
                      {message.data && message.data.length > 0 && (
                        <div className="mt-4 overflow-x-auto bg-slate-950/50 rounded-xl border border-white/10">
                          <table className="min-w-full divide-y divide-white/10 text-sm">
                            <thead className="bg-white/5">
                              <tr>
                                {Object.keys(message.data[0]).map((key) => (
                                  <th
                                    key={key}
                                    className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider"
                                  >
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                              {message.data.map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition">
                                  {Object.values(row).map((value: any, i) => (
                                    <td key={i} className="px-4 py-3 whitespace-nowrap text-slate-200">
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
                        <div className="mt-4 bg-white rounded-xl p-4">
                          <DataChart
                            data={message.data}
                            chartType={message.chartType}
                            config={message.chartConfig}
                          />
                        </div>
                      )}

                      {/* SQL Query */}
                      {message.query && (
                        <details className="mt-4 bg-slate-950/50 rounded-xl border border-white/10">
                          <summary className="cursor-pointer px-4 py-3 text-xs text-slate-400 hover:text-slate-300 transition flex items-center space-x-2">
                            <Code2 className="h-4 w-4" />
                            <span>SQL Sorğusu</span>
                          </summary>
                          <pre className="px-4 pb-4 text-xs text-green-400 font-mono overflow-x-auto">
                            {message.query}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading Animation */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                        <Brain className="h-4 w-4 text-white animate-pulse" />
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-sm text-slate-400">AI təhlil edir...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Example Questions */}
            <div className="px-4 sm:px-6 py-4 bg-slate-950/30 border-t border-white/10">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <p className="text-xs text-slate-400 font-semibold">Populyar Suallar:</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {exampleQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(question.text)}
                    className="group text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all text-sm text-slate-300 hover:text-white"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{question.icon}</span>
                      <span className="flex-1 line-clamp-2">{question.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 bg-slate-950/50 border-t border-white/10">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Bank məlumatlarınız haqqında sualınızı yazın..."
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="group px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center space-x-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105"
                >
                  <span className="hidden sm:inline">Göndər</span>
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
