'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Sparkles, Terminal, Shield, Zap, TrendingUp,
  Users, Award, Brain, Play, MousePointerClick,
  PieChart, Activity, ArrowRight, CheckCircle2,
  MessageSquare, BarChart, Cpu, Database, Lock,
  Clock, Target, Star, Rocket
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-2xl">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    QueryBank AI
                  </h2>
                  <p className="text-xs text-slate-400">Powered by Gemini 2.5</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/login')}
                  className="hidden sm:block px-5 py-2 text-slate-300 hover:text-white transition font-medium"
                >
                  Daxil Ol
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold overflow-hidden transition-all hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center space-x-2">
                    <span>Pulsuz Sınayın</span>
                    <Rocket className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 py-3 mb-8 backdrop-blur-xl">
                <Star className="h-5 w-5 text-yellow-400 animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  #1 AI Bank Analytics Platform
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  SQL Bilməyə
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  Ehtiyac Yoxdur
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl sm:text-2xl md:text-3xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                Bank məlumatlarını <span className="text-blue-400 font-bold">təbii dildə</span> təhlil edin.
                <br className="hidden sm:block" />
                AI saniyələrdə cavab verir. <span className="text-purple-400 font-bold">Texniki bilik lazım deyil.</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
                <button
                  onClick={() => router.push('/login')}
                  className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center space-x-3">
                    <Play className="h-6 w-6" />
                    <span>Dərhal Başlayın</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('demo-video');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center space-x-3"
                >
                  <MousePointerClick className="h-5 w-5" />
                  <span>Demo Görün</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {[
                  { number: '91.5%', label: 'Daha Sürətli', icon: Zap },
                  { number: '2-5s', label: 'Cavab Müddəti', icon: Clock },
                  { number: '15+', label: 'Hazır Analitika', icon: BarChart },
                  { number: '100%', label: 'SQL-free', icon: CheckCircle2 },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105"
                  >
                    <stat.icon className="h-8 w-8 text-blue-400 mb-3 mx-auto" />
                    <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Demo Video Section */}
        <section id="demo-video" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-black mb-4">
                  Necə İşləyir?
                </h2>
                <p className="text-xl text-slate-300">
                  3 sadə addımda bank məlumatlarını təhlil edin
                </p>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    step: '01',
                    icon: MessageSquare,
                    title: 'Sualınızı Yazın',
                    desc: 'Azərbaycan dilində təbii sual',
                    example: '"Ən yüksək balansa malik müştərilər"',
                    color: 'from-blue-500 to-cyan-500'
                  },
                  {
                    step: '02',
                    icon: Brain,
                    title: 'AI İşləyir',
                    desc: 'Gemini 2.5 Flash SQL yaradır',
                    example: '2-3 saniyədə hazır',
                    color: 'from-purple-500 to-pink-500'
                  },
                  {
                    step: '03',
                    icon: BarChart,
                    title: 'Nəticə Hazırdır',
                    desc: 'Cədvəl + Qrafik + SQL',
                    example: 'Avtomatik vizuallaşdırma',
                    color: 'from-green-500 to-emerald-500'
                  },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                  >
                    <div className="absolute -top-4 -left-4 text-6xl font-black text-white/5">{step.step}</div>
                    <div className={`relative bg-gradient-to-br ${step.color} p-4 rounded-2xl inline-block mb-4`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-slate-400 mb-3">{step.desc}</p>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-sm text-slate-300 italic">{step.example}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Demo Credentials */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <Shield className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold mb-2">Pulsuz Demo Hesabı</h3>
                  <p className="text-slate-300">Qeydiyyat tələb olunmur. Dərhal başlayın.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                    <p className="text-slate-400 text-sm mb-2">Email</p>
                    <p className="text-white font-mono font-bold text-lg">demo@querybank.az</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                    <p className="text-slate-400 text-sm mb-2">Password</p>
                    <p className="text-white font-mono font-bold text-lg">demo123</p>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => router.push('/login')}
                    className="group px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:scale-105 transition-all inline-flex items-center space-x-3"
                  >
                    <span>İndi Sınayın</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem-Solution */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black mb-4">
                4 Saat → 8 Saniyə
              </h2>
              <p className="text-xl text-slate-300">
                Data analizi prosesi tamamilə dəyişdi
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Before */}
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border-2 border-red-500/30 rounded-3xl p-8">
                <div className="bg-red-500/20 p-4 rounded-2xl inline-block mb-6">
                  <Target className="h-10 w-10 text-red-400" />
                </div>
                <h3 className="text-3xl font-black text-red-400 mb-2">ƏVVƏL</h3>
                <p className="text-slate-300 mb-8 text-lg">Ənənəvi Yol (Texniki Asılılıq)</p>
                <div className="space-y-4">
                  {[
                    { time: '2-3 saat', task: 'IT komandası sorğu yazır' },
                    { time: '30 dəqiqə', task: 'Excel-ə export və təmizləmə' },
                    { time: '1 saat', task: 'Pivot table və qrafik yaratma' },
                    { time: '30 dəqiqə', task: 'PowerPoint-ə əlavə etmə' },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                      <div className="bg-red-500/20 text-red-400 rounded-lg px-4 py-2 text-sm font-bold whitespace-nowrap">
                        {step.time}
                      </div>
                      <p className="text-slate-300 flex-1 pt-1">{step.task}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t-2 border-red-500/30">
                  <p className="text-5xl font-black text-red-400 mb-2">~4 SAAT</p>
                  <p className="text-slate-400">+ Texniki komandadan asılılıq</p>
                </div>
              </div>

              {/* After */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border-2 border-green-500/30 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 text-9xl opacity-5">✓</div>
                <div className="bg-green-500/20 p-4 rounded-2xl inline-block mb-6">
                  <Zap className="h-10 w-10 text-green-400" />
                </div>
                <h3 className="text-3xl font-black text-green-400 mb-2">İNDİ</h3>
                <p className="text-slate-300 mb-8 text-lg">QueryBank AI ilə (Tam Müstəqil)</p>
                <div className="space-y-4">
                  {[
                    { time: '5 saniyə', task: 'Sualı təbii dildə yazın' },
                    { time: '2 saniyə', task: 'AI avtomatik SQL yaradır' },
                    { time: '1 saniyə', task: 'Nəticə və qrafik hazırdır' },
                    { time: '0 saniyə', task: 'Texniki biliyə ehtiyac yoxdur' },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                      <div className="bg-green-500/20 text-green-400 rounded-lg px-4 py-2 text-sm font-bold whitespace-nowrap">
                        {step.time}
                      </div>
                      <p className="text-slate-300 flex-1 pt-1">{step.task}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t-2 border-green-500/30">
                  <p className="text-5xl font-black text-green-400 mb-2">8 SANİYƏ</p>
                  <p className="text-slate-400">Tam müstəqil, real-time</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black mb-4">
                Enterprise-Grade Xüsusiyyətlər
              </h2>
              <p className="text-xl text-slate-300">
                Bank səviyyəsində texnologiya
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Brain, title: 'Google Gemini 2.5', desc: 'Ən yeni AI model ilə powered', color: 'from-blue-500 to-cyan-500' },
                { icon: Zap, title: '91.5% Faster', desc: 'Prompt optimizasiyası ilə', color: 'from-yellow-500 to-orange-500' },
                { icon: Shield, title: 'Bank Təhlükəsizliyi', desc: 'JWT, bcrypt, SQL injection qorunması', color: 'from-green-500 to-emerald-500' },
                { icon: Activity, title: 'Real-time Data', desc: 'Canlı PostgreSQL bağlantısı', color: 'from-purple-500 to-pink-500' },
                { icon: PieChart, title: '15+ Analytics', desc: 'Hazır risk və müştəri analizi', color: 'from-red-500 to-orange-500' },
                { icon: Terminal, title: 'SQL Console', desc: 'Power users üçün direkt access', color: 'from-indigo-500 to-purple-500' },
                { icon: Database, title: 'Neon PostgreSQL', desc: 'Cloud-native database', color: 'from-teal-500 to-cyan-500' },
                { icon: Lock, title: 'Secure Auth', desc: 'JWT tokens + HttpOnly cookies', color: 'from-rose-500 to-pink-500' },
                { icon: Cpu, title: 'Next.js 16', desc: 'Modern React framework', color: 'from-slate-500 to-gray-500' },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 hover:border-white/20"
                >
                  <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black mb-4">
                Real Menecer Ssenariləri
              </h2>
              <p className="text-xl text-slate-300">
                Sizin kimi menecerlər necə istifadə edir?
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  role: 'Risk Manager',
                  icon: Shield,
                  question: '"Kredit reytinqi 650-dən aşağı və krediti 20K-dan çox olan müştərilər"',
                  result: '2 saniyədə cavab + qrafik + risk səviyyəsi',
                  color: 'from-red-500 to-orange-500'
                },
                {
                  role: 'Branch Manager',
                  icon: Users,
                  question: '"Bu ay ən çox əməliyyat edən müştərilər kimdir?"',
                  result: 'Dərhal cavab, təkrar suallar üçün IT-yə müraciət lazım deyil',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  role: 'Credit Officer',
                  icon: TrendingUp,
                  question: '"Defolt dərəcəsi ən yüksək olan kredit növləri"',
                  result: 'Avtomatik qrafik, Excel-ə export lazım deyil',
                  color: 'from-purple-500 to-pink-500'
                },
              ].map((useCase, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                    <div className={`bg-gradient-to-br ${useCase.color} p-4 rounded-2xl flex-shrink-0`}>
                      <useCase.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <h3 className="text-2xl font-bold">{useCase.role}</h3>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-blue-400 italic text-lg">{useCase.question}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ArrowRight className="h-5 w-5 text-green-400" />
                        <p className="text-slate-300">{useCase.result}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <Award className="h-20 w-20 text-yellow-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SQL Öyrənməyə
                <br />
                Ehtiyac Yoxdur
              </span>
            </h2>
            <p className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              2 dəqiqədə başlayın. Qeydiyyat tələb olunmur.
              <br />
              <span className="text-blue-400 font-bold">Demo hesabla bütün funksiyalara tam giriş.</span>
            </p>
            <button
              onClick={() => router.push('/login')}
              className="group relative px-16 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-black text-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center space-x-4">
                <Rocket className="h-8 w-8" />
                <span>İndi Başlayın</span>
                <ArrowRight className="h-8 w-8 group-hover:translate-x-3 transition-transform" />
              </span>
            </button>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-slate-400">
              {[
                { icon: CheckCircle2, text: 'Kredit kartı lazım deyil' },
                { icon: CheckCircle2, text: 'Dərhal çıxış' },
                { icon: CheckCircle2, text: 'Bütün funksiyalar' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <item.icon className="h-5 w-5 text-green-400" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-white font-bold text-lg">QueryBank AI</span>
                  <p className="text-xs text-slate-400">SQL Bilməyə Ehtiyac Yoxdur</p>
                </div>
              </div>
              <div className="text-slate-400 text-sm">
                © 2025 QueryBank AI. Bütün hüquqlar qorunur.
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-sm">Powered by</span>
                <span className="text-blue-400 font-semibold">Google Gemini 2.5 Flash</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
