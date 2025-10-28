'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, MessageSquare, BarChart3, LogOut, Play, Copy, Trash2, Clock, Database, Menu, X, Sparkles, Home } from 'lucide-react';

interface QueryResult {
  success: boolean;
  data?: any[];
  rowCount?: number;
  executionTime?: string;
  columns?: { name: string; dataType: number }[];
  error?: string;
  detail?: string;
  hint?: string;
}

export default function SQLConsolePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sql, setSql] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load query history from localStorage
    const savedHistory = localStorage.getItem('sql_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleExecute = async () => {
    if (!sql.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      });

      const data = await response.json();
      setResult(data);

      // Add to history if successful
      if (data.success && !history.includes(sql.trim())) {
        const newHistory = [sql.trim(), ...history].slice(0, 10); // Keep last 10 queries
        setHistory(newHistory);
        localStorage.setItem('sql_history', JSON.stringify(newHistory));
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const exampleQueries = [
    {
      title: 'Bütün müştərilər',
      sql: 'SELECT * FROM demo_bank.customers LIMIT 10;',
    },
    {
      title: 'Yüksək balans',
      sql: 'SELECT first_name, last_name, account_balance\nFROM demo_bank.customers\nWHERE account_balance > 50000\nORDER BY account_balance DESC;',
    },
    {
      title: 'Kredit növləri',
      sql: 'SELECT loan_type, COUNT(*) as count, SUM(outstanding_balance) as total\nFROM demo_bank.loans\nGROUP BY loan_type\nORDER BY total DESC;',
    },
    {
      title: 'Son əməliyyatlar',
      sql: 'SELECT t.transaction_date, c.first_name, c.last_name, t.transaction_type, t.amount\nFROM demo_bank.transactions t\nJOIN demo_bank.customers c ON t.customer_id = c.customer_id\nORDER BY t.transaction_date DESC\nLIMIT 20;',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-purple-950"></div>
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        {/* Moving Gradient Orbs */}
        <div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x / 20}px`,
            top: `${mousePosition.y / 20}px`,
            transition: 'all 0.3s ease-out'
          }}
        ></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-2xl">
                    <Terminal className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    SQL Konsolu
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400">Birbaşa verilənlər bazası sorğusu</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center space-x-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>Əsas Səhifə</span>
                  </button>
                  <button
                    onClick={() => router.push('/chat')}
                    className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>AI Çat</span>
                  </button>
                  <button
                    onClick={() => router.push('/reports')}
                    className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center space-x-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Analitika</span>
                  </button>
                  <button className="px-4 py-2 text-sm bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 border border-green-500/30 rounded-lg font-medium flex items-center space-x-2">
                    <Terminal className="h-4 w-4" />
                    <span>SQL Konsolu</span>
                  </button>
                </nav>
                <div className="flex items-center space-x-4 border-l border-white/10 pl-4">
                  {user && (
                    <span className="text-sm text-slate-300 font-medium">
                      {user.full_name}
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm text-slate-400 hover:text-white flex items-center space-x-2 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıxış</span>
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4 space-y-2">
                <button
                  onClick={() => {
                    router.push('/');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Əsas Səhifə</span>
                </button>
                <button
                  onClick={() => {
                    router.push('/chat');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Çat</span>
                </button>
                <button
                  onClick={() => {
                    router.push('/reports');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analitika</span>
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full px-4 py-3 text-sm bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 border border-green-500/30 rounded-lg font-medium text-left flex items-center space-x-2"
                >
                  <Terminal className="h-4 w-4" />
                  <span>SQL Konsolu</span>
                </button>
                <div className="pt-4 border-t border-white/10 space-y-2">
                  {user && (
                    <div className="px-4 py-2 text-sm text-slate-300 font-medium">
                      {user.full_name}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıxış</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Info Banner */}
          <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Database className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-300 mb-1">İstifadə Qaydaları</h3>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Yalnız SELECT sorğularına icazə verilir (təhlükəsizlik üçün)</li>
                  <li>• Cədvəl adlarını schema ilə birlikdə yazın: <code className="bg-slate-900/50 px-1.5 py-0.5 rounded text-green-400">demo_bank.customers</code></li>
                  <li>• Performans üçün LIMIT istifadə edin (məsələn: LIMIT 100)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* SQL Editor - Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Query Editor */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10">
                <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-semibold text-white">SQL Redaktoru</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSql('')}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition"
                      title="Təmizlə"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(sql)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition"
                      title="Kopyala"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <textarea
                    value={sql}
                    onChange={(e) => setSql(e.target.value)}
                    placeholder="SELECT * FROM demo_bank.customers LIMIT 10;"
                    className="w-full h-48 sm:h-64 bg-slate-900/50 text-green-400 font-mono text-xs sm:text-sm p-3 sm:p-4 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none backdrop-blur-xl placeholder-slate-500"
                    spellCheck={false}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-slate-500">
                      {sql.length} simvol
                    </div>
                    <button
                      onClick={handleExecute}
                      disabled={loading || !sql.trim()}
                      className="px-4 py-2 sm:px-6 sm:py-2.5 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center space-x-2 shadow-lg hover:shadow-green-500/50"
                    >
                      <Play className="h-4 w-4" />
                      <span>{loading ? 'İcra edilir...' : 'İcra Et'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              {result && (
                <div className="bg-white/5 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10">
                  <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Nəticə</span>
                    {result.success && (
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Database className="h-3.5 w-3.5" />
                          <span>{result.rowCount} sətir</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{result.executionTime}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {result.error ? (
                      <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-lg p-4">
                        <p className="text-sm font-semibold text-red-400 mb-2">Xəta:</p>
                        <p className="text-sm text-red-300">{result.error}</p>
                        {result.detail && (
                          <p className="text-xs text-red-400 mt-2">{result.detail}</p>
                        )}
                        {result.hint && (
                          <p className="text-xs text-slate-400 mt-2">💡 {result.hint}</p>
                        )}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10 text-sm">
                          <thead className="bg-white/5">
                            <tr>
                              {result.data && result.data.length > 0 &&
                                Object.keys(result.data[0]).map((key) => (
                                  <th
                                    key={key}
                                    className="px-4 py-3 text-left text-xs font-semibold text-green-400 uppercase tracking-wider"
                                  >
                                    {key}
                                  </th>
                                ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {result.data?.map((row, idx) => (
                              <tr key={idx} className="hover:bg-white/5 transition">
                                {Object.values(row).map((value: any, i) => (
                                  <td key={i} className="px-4 py-3 whitespace-nowrap text-slate-300">
                                    {value === null ? (
                                      <span className="text-slate-500 italic">null</span>
                                    ) : typeof value === 'number' && value > 1000 ? (
                                      value.toLocaleString()
                                    ) : typeof value === 'object' ? (
                                      JSON.stringify(value)
                                    ) : (
                                      String(value)
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {result.data?.length === 0 && (
                          <p className="text-center text-slate-500 py-8">Nəticə yoxdur</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Right Column (1/3 width) */}
            <div className="space-y-4 sm:space-y-6">
              {/* Example Queries */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10">
                <div className="border-b border-white/10 px-4 py-3">
                  <span className="text-sm font-semibold text-white">Nümunə Sorğular</span>
                </div>
                <div className="p-4 space-y-2">
                  {exampleQueries.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSql(example.sql)}
                      className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/50 rounded-lg transition text-xs"
                    >
                      <div className="font-semibold text-green-400 mb-1">{example.title}</div>
                      <div className="font-mono text-slate-400 text-[10px] line-clamp-2">
                        {example.sql}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Query History */}
              {history.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10">
                  <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Tarixçə</span>
                    <button
                      onClick={() => {
                        setHistory([]);
                        localStorage.removeItem('sql_history');
                      }}
                      className="text-xs text-slate-400 hover:text-red-400 transition"
                    >
                      Təmizlə
                    </button>
                  </div>
                  <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                    {history.map((query, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSql(query)}
                        className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/50 rounded-lg transition"
                      >
                        <div className="font-mono text-xs text-slate-300 line-clamp-3">
                          {query}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Schema Reference */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10">
                <div className="border-b border-white/10 px-4 py-3">
                  <span className="text-sm font-semibold text-white">Schema İstinadı</span>
                </div>
                <div className="p-4 text-xs space-y-3">
                  <div>
                    <div className="font-semibold text-green-400 mb-1">demo_bank.customers</div>
                    <div className="text-slate-400 font-mono space-y-0.5">
                      <div>• customer_id</div>
                      <div>• first_name, last_name</div>
                      <div>• account_type, account_balance</div>
                      <div>• account_status, credit_score</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-400 mb-1">demo_bank.loans</div>
                    <div className="text-slate-400 font-mono space-y-0.5">
                      <div>• loan_id, customer_id</div>
                      <div>• loan_type, outstanding_balance</div>
                      <div>• loan_status</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-400 mb-1">demo_bank.transactions</div>
                    <div className="text-slate-400 font-mono space-y-0.5">
                      <div>• transaction_id, customer_id</div>
                      <div>• amount, transaction_type</div>
                      <div>• transaction_date</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
