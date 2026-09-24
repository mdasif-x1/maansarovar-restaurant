import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/SEO';
import { Shield, Lock, User, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login | The Maansarovar Restaurant" noindex={true} />
      
      <div className="min-h-[75vh] bg-cream-100 flex items-center justify-center py-14 px-4 font-sans">
        <div className="max-w-sm w-full bg-cream-50 rounded-lg border border-cream-300/80 p-7 sm:p-8 shadow-subtle">
          
          <div className="w-11 h-11 rounded-lg bg-forest-800 text-saffron-400 mx-auto flex items-center justify-center mb-4 border border-forest-700/60 shadow-subtle">
            <Shield className="w-5 h-5" />
          </div>

          <h2 className="font-serif text-2xl font-medium text-center text-charcoal-900 mb-1">
            Admin Authentication
          </h2>
          <p className="text-[11px] text-center text-charcoal-800/60 font-sans mb-6">
            Sign in to access management dashboard.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-sans">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-widest text-charcoal-800 mb-1.5 font-sans">
                Username
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-charcoal-800/40 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-cream-100/90 border border-cream-300/80 rounded-md text-xs text-charcoal-900 focus:outline-none focus:border-forest-800 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-widest text-charcoal-800 mb-1.5 font-sans">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-charcoal-800/40 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-10 py-2.5 bg-cream-100/90 border border-cream-300/80 rounded-md text-xs text-charcoal-900 focus:outline-none focus:border-forest-800 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-2.5 text-charcoal-800/40 hover:text-charcoal-900 focus:outline-none transition-colors p-0.5 rounded"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-md bg-forest-800 text-cream-50 font-medium text-xs uppercase tracking-widest hover:bg-forest-700 transition-colors shadow-subtle flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

        </div>
      </div>
    </>
  );
};


