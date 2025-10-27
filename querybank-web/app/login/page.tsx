'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to chat page
        router.push('/chat');
      } else {
        setError(data.error || 'Giriş uğursuz oldu');
      }
    } catch (error) {
      setError('Giriş zamanı xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <button
          onClick={() => router.push('/')}
          className="mb-4 text-sm text-slate-600 hover:text-slate-900 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Əsas səhifəyə qayıt</span>
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            QueryBank AI
          </h1>
          <p className="text-slate-600 mt-2">Bank Məlumat Analizi Sistemi</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Daxil ol</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                placeholder="email@bank.az"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Parol
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2 font-medium"
            >
              {loading ? (
                <span>Yüklənir...</span>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Daxil ol</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 mb-3 font-medium">Demo hesab:</p>
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Email:</span> demo@querybank.az
              </p>
              <p className="text-sm text-slate-700 mt-1">
                <span className="font-semibold">Parol:</span> demo123
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          © 2025 QueryBank AI. Bütün hüquqlar qorunur.
        </p>
      </div>
    </div>
  );
}
