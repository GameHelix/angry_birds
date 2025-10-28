'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  BarChart3,
  Brain,
  LogOut,
  Award,
  Terminal,
  AlertTriangle,
  PieChart,
  Shield,
  Menu,
  X,
  Home,
} from 'lucide-react';
import DataChart from '@/components/DataChart';

interface Stats {
  customers: number;
  loans: number;
  totalLoanBalance: number;
  totalDeposits: number;
}

interface AnalyticsData {
  loansByType: any[];
  customersByAccountType: any[];
  creditScoreDistribution: any[];
  topCustomers: any[];
  transactionTrends: any[];
  loanStatusDistribution: any[];
  customerStatusDistribution: any[];
  highValueCustomers: any;
  customersWithLoans: any[];
  recentLargeTransactions: any[];
  riskAnalysis: any[];
  balanceGrowth: any[];
  loanPerformance: any[];
  customerSegmentation: any[];
  topRevenueCustomers: any[];
}

type TabType = 'overview' | 'customers' | 'loans' | 'risk';

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/analytics'),
      ]);

      const statsData = await statsRes.json();
      setStats(statsData);

      const analyticsData = await analyticsRes.json();
      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="flex space-x-2 justify-center mb-4">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-slate-400 font-medium">Analitika yüklənir...</p>
        </div>
      </div>
    );
  }

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
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Analitika
                </h1>
                <p className="text-xs text-slate-400">Məlumat təhlili və hesabatlar</p>
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
                <button
                  onClick={() => router.push('/chat')}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-2"
                >
                  <Brain className="h-4 w-4" />
                  <span>AI Çat</span>
                </button>
                <button className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 rounded-lg font-medium flex items-center space-x-2">
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
                  onClick={handleLogout}
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
              <button onClick={() => { router.push('/'); setMobileMenuOpen(false); }} className="w-full px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Əsas Səhifə</span>
              </button>
              <button onClick={() => { router.push('/chat'); setMobileMenuOpen(false); }} className="w-full px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>AI Çat</span>
              </button>
              <button onClick={() => setMobileMenuOpen(false)} className="w-full px-4 py-3 text-sm bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 rounded-lg font-medium text-left flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analitika</span>
              </button>
              <button onClick={() => { router.push('/sql'); setMobileMenuOpen(false); }} className="w-full px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-2">
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
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Çıxış</span>
                </button>
              </div>
            </div>
          )}
        </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Key Metrics */}
          {stats && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Əsas Göstəricilər</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat Card 1 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-3 rounded-xl border border-blue-500/30 group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-green-400 flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12.5%</span>
                  </span>
                </div>
                <h3 className="text-sm text-slate-400 mb-1">Aktiv Müştərilər</h3>
                <p className="text-2xl font-bold text-white">{stats.customers.toLocaleString()}</p>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-3 rounded-xl border border-green-500/30 group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6 text-green-400" />
                  </div>
                  <span className="text-xs font-medium text-green-400 flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+8.2%</span>
                  </span>
                </div>
                <h3 className="text-sm text-slate-400 mb-1">Aktiv Kreditlər</h3>
                <p className="text-2xl font-bold text-white">{stats.loans.toLocaleString()}</p>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-3 rounded-xl border border-purple-500/30 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <span className="text-xs font-medium text-red-400 flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 rotate-180" />
                    <span>-2.3%</span>
                  </span>
                </div>
                <h3 className="text-sm text-slate-400 mb-1">Ümumi Kredit Balansı</h3>
                <p className="text-2xl font-bold text-white">{`${(stats.totalLoanBalance / 1000).toFixed(0)}K ₼`}</p>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 p-3 rounded-xl border border-indigo-500/30 group-hover:scale-110 transition-transform">
                    <DollarSign className="h-6 w-6 text-indigo-400" />
                  </div>
                  <span className="text-xs font-medium text-green-400 flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+15.7%</span>
                  </span>
                </div>
                <h3 className="text-sm text-slate-400 mb-1">Ümumi Depozitlər</h3>
                <p className="text-2xl font-bold text-white">{`${(stats.totalDeposits / 1000).toFixed(0)}K ₼`}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 overflow-x-auto">
            <nav className="flex space-x-2 min-w-max sm:min-w-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center space-x-2 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <PieChart className="h-4 w-4" />
                <span>Ümumi Baxış</span>
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center space-x-2 ${
                  activeTab === 'customers'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Müştərilər</span>
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center space-x-2 ${
                  activeTab === 'loans'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                <span>Kreditlər</span>
              </button>
              <button
                onClick={() => setActiveTab('risk')}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center space-x-2 ${
                  activeTab === 'risk'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Risk Analizi</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && analytics && (
            <>
              {/* High-Value Customer Insight */}
              {analytics.highValueCustomers && (
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-3 rounded-xl border border-amber-500/30">
                      <Award className="h-6 w-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">Yüksək Dəyərli Müştərilər</h3>
                      <p className="text-sm text-slate-400 mb-3">
                        50,000 ₼-dən çox balansa malik müştərilər
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-400">Müştəri Sayı</p>
                          <p className="text-xl sm:text-2xl font-bold text-white">{analytics.highValueCustomers.count}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Ümumi Balans</p>
                          <p className="text-xl sm:text-2xl font-bold text-white">
                            {(analytics.highValueCustomers.total_balance / 1000).toFixed(0)}K ₼
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Orta Kredit Reytinqi</p>
                          <p className="text-xl sm:text-2xl font-bold text-white">
                            {Math.round(analytics.highValueCustomers.avg_credit_score)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Credit Score Distribution */}
                {analytics.creditScoreDistribution && analytics.creditScoreDistribution.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-sm sm:text-md font-semibold text-white mb-4">Kredit Reytinqi Bölgüsü</h3>
                    <div className="h-64 sm:h-80">
                      <DataChart
                        data={analytics.creditScoreDistribution}
                        chartType="pie"
                        config={{
                          x_column: 'score_range',
                          y_column: 'customer_count',
                          title: 'Müştərilərin Kredit Reytinqi Bölgüsü',
                          xlabel: 'Reytinq Aralığı',
                          ylabel: 'Müştəri Sayı',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Loan Status Distribution */}
                {analytics.loanStatusDistribution && analytics.loanStatusDistribution.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all">
                    <h3 className="text-sm sm:text-md font-semibold text-white mb-4">Kredit Status Bölgüsü</h3>
                    <div className="h-64 sm:h-80">
                      <DataChart
                        data={analytics.loanStatusDistribution}
                        chartType="pie"
                        config={{
                          x_column: 'loan_status',
                          y_column: 'count',
                          title: 'Kredit Statuslarının Paylanması',
                          xlabel: 'Status',
                          ylabel: 'Sayı',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && analytics && (
            <>
              {/* Customer Segmentation */}
              {analytics.customerSegmentation && analytics.customerSegmentation.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all">
                  <h3 className="text-sm sm:text-md font-semibold text-white mb-4">Müştəri Seqmentasiyası</h3>
                  <div className="h-64 sm:h-80">
                    <DataChart
                      data={analytics.customerSegmentation}
                      chartType="bar"
                      config={{
                        x_column: 'segment',
                        y_column: 'customer_count',
                        title: 'Balansa Görə Müştəri Seqmentləri',
                        xlabel: 'Seqment',
                        ylabel: 'Müştəri Sayı',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Top Customers Table */}
              {analytics.topCustomers && analytics.topCustomers.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
                  <h3 className="text-sm sm:text-md font-semibold text-white mb-4">Ən Yüksək Balansa Malik Müştərilər (Top 10)</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10 text-sm">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Müştəri</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Hesab Növü</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Balans</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Kredit Reytinqi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {analytics.topCustomers.map((customer, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-white">
                              {customer.customer_name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                              {customer.account_type}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-white">
                              {customer.account_balance.toLocaleString()} ₼
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-slate-300">
                              {customer.credit_score}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Top Revenue Customers */}
              {analytics.topRevenueCustomers && analytics.topRevenueCustomers.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-md font-semibold text-white mb-4">Ən Yüksək Əməliyyat Həcminə Malik Müştərilər</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10 text-sm">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Müştəri</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Əməliyyat Sayı</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Ümumi Həcm</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Balans</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {analytics.topRevenueCustomers.map((customer, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-white">
                              {customer.customer_name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-slate-400">
                              {customer.transaction_count}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-white">
                              {customer.total_transaction_volume.toLocaleString()} ₼
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-slate-300">
                              {customer.account_balance.toLocaleString()} ₼
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Loans Tab */}
          {activeTab === 'loans' && analytics && (
            <>
              {/* Loans by Type */}
              {analytics.loansByType && analytics.loansByType.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all">
                  <h3 className="text-sm sm:text-md font-semibold text-white mb-4">Kredit Növlərinə Görə Bölgü</h3>
                  <div className="h-64 sm:h-80">
                    <DataChart
                      data={analytics.loansByType}
                      chartType="bar"
                      config={{
                        x_column: 'loan_type',
                        y_column: 'total_balance',
                        title: 'Kredit Növlərinə Görə Ümumi Balans',
                        xlabel: 'Kredit Növü',
                        ylabel: 'Ümumi Balans (₼)',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Loan Performance */}
              {analytics.loanPerformance && analytics.loanPerformance.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-md font-semibold text-white mb-4">Kredit Performansı</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10 text-sm">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Kredit Növü</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Ümumi</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Aktiv</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Ödənilib</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Defolt</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Defolt Dərəcəsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {analytics.loanPerformance.map((loan, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-white">
                              {loan.loan_type}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-slate-400">
                              {loan.total_loans}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-green-400">
                              {loan.active_loans}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-blue-400">
                              {loan.paid_loans}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-red-400">
                              {loan.defaulted_loans}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right font-semibold">
                              <span className={loan.default_rate > 10 ? 'text-red-400' : 'text-green-400'}>
                                {loan.default_rate}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Risk Tab */}
          {activeTab === 'risk' && analytics && (
            <>
              {/* Risk Analysis */}
              {analytics.riskAnalysis && analytics.riskAnalysis.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <h3 className="text-md font-semibold text-white">Yüksək Riskli Müştərilər</h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">
                    Aşağı kredit reytinqi və yüksək kredit balansı olan müştərilər
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10 text-sm">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Müştəri</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Kredit Reytinqi</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Balans</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Ümumi Kredit</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Risk Səviyyəsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {analytics.riskAnalysis.map((customer, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-white">
                              {customer.customer_name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <span className={customer.credit_score < 650 ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                                {customer.credit_score}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-slate-300">
                              {customer.account_balance.toLocaleString()} ₼
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-white">
                              {customer.total_loans.toLocaleString()} ₼
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  customer.risk_level === 'Yüksək'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : customer.risk_level === 'Orta'
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                                }`}
                              >
                                {customer.risk_level}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
