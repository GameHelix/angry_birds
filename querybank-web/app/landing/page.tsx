'use client';

import { useRouter } from 'next/navigation';
import {
  Sparkles, Terminal, Shield, Zap,
  TrendingUp, Users, DollarSign, Clock, Award, Brain,
  LineChart, PieChart, Activity, ArrowRight, CheckCircle2, Star
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Təbii dildə suallar verin. AI avtomatik SQL yaradır və nəticələri saniyələrdə gətirir',
      color: 'from-blue-600 to-indigo-600',
      badge: 'Gemini 2.5 Flash',
    },
    {
      icon: LineChart,
      title: '15+ Real-Time Analytics',
      description: 'Risk analizi, müştəri seqmentasiyası, kredit performansı - hamısı bir paneldə',
      color: 'from-purple-600 to-pink-600',
      badge: 'Instant Results',
    },
    {
      icon: Terminal,
      title: 'Advanced SQL Console',
      description: 'Təcrübəli istifadəçilər üçün professional SQL interfeysi. Query history və schema reference',
      color: 'from-green-600 to-emerald-600',
      badge: 'Power Users',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'JWT authentication, bcrypt encryption, SQL injection protection, read-only database access',
      color: 'from-red-600 to-orange-600',
      badge: 'Bank-Grade',
    },
  ];

  const metrics = [
    {
      value: '91.5%',
      label: 'Daha Sürətli',
      subtitle: 'AI sorğu optimizasiyası',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      value: '1.5s',
      label: 'Yükləmə Vaxtı',
      subtitle: '15 parallel SQL query',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      value: '15+',
      label: 'Analitik Modullar',
      subtitle: 'Hazır business insights',
      icon: PieChart,
      color: 'from-purple-500 to-pink-500'
    },
    {
      value: '100%',
      label: 'Mobil Uyğun',
      subtitle: 'Responsive design',
      icon: Activity,
      color: 'from-green-500 to-emerald-500'
    },
  ];

  const useCases = [
    {
      icon: Users,
      title: 'Müştəri Analizi',
      items: [
        'Top 10 ən yüksək balansa malik müştərilər',
        'Müştəri seqmentasiyası (Premium/Gold/Silver)',
        'Kredit reytinqi bölgüsü və trend',
      ]
    },
    {
      icon: TrendingUp,
      title: 'Risk Menecmenti',
      items: [
        'Yüksək riskli müştərilərin identifikasiyası',
        'Kredit defolt dərəcəsi analizi',
        'Portfolio risk bölgüsü',
      ]
    },
    {
      icon: DollarSign,
      title: 'Kredit Performansı',
      items: [
        'Kredit növlərinə görə balans',
        'Aktiv/ödənilmiş/defolt statistikaları',
        'Ən çox əməliyyat edən müştərilər',
      ]
    },
  ];

  const testimonials = [
    {
      quote: 'Data analizi üçün sərf etdiyimiz vaxt 70% azaldı. İndi real-time insights alırıq.',
      author: 'Bank Manager',
      role: 'Risk Menecmenti',
      rating: 5,
    },
    {
      quote: 'Təbii dildə sual vermək oyunu dəyişdi. SQL bilməyən komanda üzvləri də analiz edir.',
      author: 'Operations Director',
      role: 'Business Operations',
      rating: 5,
    },
    {
      quote: 'Mobil versiya çox güclüdür. Hər yerdə, istənilən vaxt məlumata çıxışım var.',
      author: 'Executive',
      role: 'C-Level Management',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">QueryBank AI</h2>
                <p className="text-xs text-blue-300">Enterprise Banking Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="hidden sm:block px-5 py-2 text-white/80 hover:text-white transition font-medium"
              >
                Daxil Ol
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold shadow-lg shadow-blue-500/50"
              >
                Demo Başlat
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-5 py-2 backdrop-blur-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-blue-300 font-medium">Powered by Google Gemini 2.5 Flash</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none">
                Bank Məlumatlarını
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Saniyələrdə Təhlil Edin
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
                AI-powered analytics platform. Təbii dildə sual verin, real-time insights alın.
                <br className="hidden sm:block" />
                <span className="text-blue-400 font-semibold">91.5% daha sürətli</span> məlumat analizi.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button
                onClick={() => router.push('/login')}
                className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all font-bold text-lg shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105 flex items-center space-x-3"
              >
                <span>Pulsuz Başlayın</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => {
                  document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all font-semibold text-lg hover:scale-105"
              >
                Demo Baxın
              </button>
            </div>

            {/* Demo Credentials Box */}
            <div className="inline-block bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Shield className="h-4 w-4 text-green-400" />
                <p className="text-sm text-blue-300 font-semibold">Instant Demo Access</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-blue-400 text-xs mb-1">Email</p>
                  <p className="text-white font-mono font-semibold">demo@querybank.az</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-blue-400 text-xs mb-1">Password</p>
                  <p className="text-white font-mono font-semibold">demo123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="relative py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 group-hover:border-white/20 transition-all">
                  <div className={`inline-block bg-gradient-to-br ${metric.color} p-3 rounded-2xl mb-4`}>
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-5xl font-black text-white mb-2">{metric.value}</div>
                  <div className="text-lg font-semibold text-slate-200 mb-1">{metric.label}</div>
                  <div className="text-sm text-slate-400">{metric.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="demo-section" className="relative py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-sm text-blue-400 font-semibold">FEATURES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
              Enterprise-Grade Analytics
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Professional banking insights. Real-time data. AI-powered intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 group-hover:border-white/20 transition-all h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-2xl`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="relative py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-sm text-purple-400 font-semibold">USE CASES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
              Nə Edə Bilərsiniz?
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Real business scenarios. Instant insights. Actionable data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all"
              >
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-2xl inline-block mb-6">
                  <useCase.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-6">{useCase.title}</h3>
                <ul className="space-y-3">
                  {useCase.items.map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-sm text-yellow-400 font-semibold">IMPACT</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Real Results, Real Impact
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-yellow-500/30 transition-all"
              >
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-200 text-lg mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-bold text-white">{testimonial.author}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative py-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
            Gələcək Hazırdır.
            <br />
            Siz Hazırsınız?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            QueryBank AI ilə bank analitikasında yeni səviyyəyə keçin.
            Demo hesabla 2 dəqiqədə başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button
              onClick={() => router.push('/login')}
              className="group px-12 py-6 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all font-black text-xl shadow-2xl hover:scale-105 inline-flex items-center space-x-3"
            >
              <span>İndi Başlayın</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="text-white/80 text-sm">
              ✓ Credit card tələb olunmur  ✓ Instant access  ✓ Full features
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-950 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-lg">QueryBank AI</span>
                <p className="text-xs text-slate-500">Enterprise Banking Analytics</p>
              </div>
            </div>
            <div className="text-slate-500 text-sm">
              © 2025 QueryBank AI. All rights reserved.
            </div>
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-yellow-400" />
              <span className="text-slate-400 text-sm">Powered by <span className="text-blue-400 font-semibold">Google Gemini 2.5 Flash</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
