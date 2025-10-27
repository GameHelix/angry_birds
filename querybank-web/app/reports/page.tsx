'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  BarChart3,
  MessageSquare,
  LogOut,
  Award,
  Terminal,
  AlertTriangle,
  TrendingDown,
  PieChart,
  Activity,
  Shield,
  Target,
} from 'lucide-react';
import DataChart from '@/components/DataChart';
import StatsCard from '@/components/StatsCard';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex space-x-2 justify-center mb-4">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-slate-600 font-medium">Analitika yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Analitika Paneli
                  </h1>
                  <p className="text-sm text-slate-600">Məlumat təhlili və hesabatlar</p>
                </div>
              </div>
              <nav className="flex space-x-2">
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition flex items-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Çat</span>
                </button>
                <button className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium flex items-center space-x-2">
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
                onClick={handleLogout}
                className="text-sm text-slate-600 hover:text-slate-900 flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Çıxış</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Key Metrics */}
        {stats && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Əsas Göstəricilər</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Aktiv Müştərilər"
                value={stats.customers.toLocaleString()}
                icon={Users}
                trend="+12.5%"
                trendUp={true}
                color="blue"
              />
              <StatsCard
                title="Aktiv Kreditlər"
                value={stats.loans.toLocaleString()}
                icon={FileText}
                trend="+8.2%"
                trendUp={true}
                color="green"
              />
              <StatsCard
                title="Ümumi Kredit Balansı"
                value={`${(stats.totalLoanBalance / 1000).toFixed(0)}K ₼`}
                icon={TrendingUp}
                trend="-2.3%"
                trendUp={false}
                color="purple"
              />
              <StatsCard
                title="Ümumi Depozitlər"
                value={`${(stats.totalDeposits / 1000).toFixed(0)}K ₼`}
                icon={DollarSign}
                trend="+15.7%"
                trendUp={true}
                color="indigo"
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <PieChart className="h-4 w-4" />
                <span>Ümumi Baxış</span>
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 ${
                  activeTab === 'customers'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Müştərilər</span>
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 ${
                  activeTab === 'loans'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                <span>Kreditlər</span>
              </button>
              <button
                onClick={() => setActiveTab('risk')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 ${
                  activeTab === 'risk'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
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
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <Award className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Yüksək Dəyərli Müştərilər</h3>
                      <p className="text-sm text-slate-600 mb-3">
                        50,000 ₼-dən çox balansa malik müştərilər
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-600">Müştəri Sayı</p>
                          <p className="text-2xl font-bold text-slate-900">{analytics.highValueCustomers.count}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Ümumi Balans</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {(analytics.highValueCustomers.total_balance / 1000).toFixed(0)}K ₼
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Orta Kredit Reytinqi</p>
                          <p className="text-2xl font-bold text-slate-900">
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
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <h3 className="text-md font-semibold text-slate-900 mb-4">Kredit Reytinqi Bölgüsü</h3>
                    <div className="h-80">
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
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <h3 className="text-md font-semibold text-slate-900 mb-4">Kredit Status Bölgüsü</h3>
                    <div className="h-80">
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
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-md font-semibold text-slate-900 mb-4">Müştəri Seqmentasiyası</h3>
                  <div className="h-80">
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
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-md font-semibold text-slate-900 mb-4">Ən Yüksək Balansa Malik Müştərilər (Top 10)</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Müştəri</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Hesab Növü</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Balans</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Kredit Reytinqi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {analytics.topCustomers.map((customer, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">
                              {customer.customer_name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                              {customer.account_type}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-slate-900">
                              {customer.account_balance.toLocaleString()} ₼
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-slate-700">
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
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-md font-semibold text-slate-900 mb-4">Ən Yüksək Əməliyyat Həcminə Malik Müştərilər</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Müştəri</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Əməliyyat Sayı</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Ümumi Həcm</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Balans</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {analytics.topRevenueCustomers.map((customer, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">
                              {customer.customer_name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-slate-600">
                              {customer.transaction_count}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-slate-900">
                              {customer.total_transaction_volume.toLocaleString()} ₼
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-slate-700">
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
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-md font-semibold text-slate-900 mb-4">Kredit Növlərinə Görə Bölgü</h3>
                  <div className="h-80">
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
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-md font-semibold text-slate-900 mb-4">Kredit Performansı</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Kredit Növü</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Ümumi</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Aktiv</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Ödənilib</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Defolt</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Defolt Dərəcəsi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {analytics.loanPerformance.map((loan, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">
                              {loan.loan_type}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-slate-600">
                              {loan.total_loans}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-green-600">
                              {loan.active_loans}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-blue-600">
                              {loan.paid_loans}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-red-600">
                              {loan.defaulted_loans}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right font-semibold">
                              <span className={loan.default_rate > 10 ? 'text-red-600' : 'text-green-600'}>
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
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h3 className="text-md font-semibold text-slate-900">Yüksək Riskli Müştərilər</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Aşağı kredit reytinqi və yüksək kredit balansı olan müştərilər
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Müştəri</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Kredit Reytinqi</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Balans</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Ümumi Kredit</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Risk Səviyyəsi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {analytics.riskAnalysis.map((customer, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">
                              {customer.customer_name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <span className={customer.credit_score < 650 ? 'text-red-600 font-semibold' : 'text-slate-700'}>
                                {customer.credit_score}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-slate-700">
                              {customer.account_balance.toLocaleString()} ₼
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-slate-900">
                              {customer.total_loans.toLocaleString()} ₼
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  customer.risk_level === 'Yüksək'
                                    ? 'bg-red-100 text-red-700'
                                    : customer.risk_level === 'Orta'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-green-100 text-green-700'
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
  );
}
