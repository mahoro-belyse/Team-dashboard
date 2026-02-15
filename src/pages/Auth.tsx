import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/services/fakeApi';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AuthView = 'login' | 'signup' | 'forgot';

const Auth: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lastAction, setLastAction] = useState<(() => Promise<void>) | null>(null);

  const validate = (): string | null => {
    if (view === 'signup' && !name.trim()) return 'Name is required.';
    if (!email.trim() || !email.includes('@')) return 'Valid email is required.';
    if (view !== 'forgot' && password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);
    setSuccess(null);
    setLoading(true);

    const action = async () => {
      try {
        if (view === 'login') {
          await login(email, password);
          navigate('/dashboard');
        } else if (view === 'signup') {
          await signup(name, email, password);
          navigate('/dashboard');
        } else {
          const msg = await api.forgotPassword(email);
          setSuccess(msg);
        }
      } catch (e: any) {
        setError(e.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    setLastAction(() => action);
    await action();
  };

  const retry = async () => {
    if (lastAction) {
      setLoading(true);
      setError(null);
      await lastAction();
    }
  };

  const switchView = (v: AuthView) => {
    setView(v);
    setError(null);
    setSuccess(null);
  };

  const titles = { login: 'Sign in to your account', signup: 'Create your account', forgot: 'Reset your password' };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">TC</div>
            <h1 className="text-xl font-bold text-foreground">{titles[view]}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {view === 'login' && 'Enter your credentials to access your dashboard.'}
              {view === 'signup' && 'Fill in the details below to get started.'}
              {view === 'forgot' && 'Enter your email and we\'ll send a reset link.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
              <button onClick={retry} className="ml-auto shrink-0"><RefreshCw className="h-4 w-4" /></button>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
              <div>
                <Label htmlFor="name" className="text-sm">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="pl-10" />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" />
              </div>
            </div>
            {view !== 'forgot' && (
              <div>
                <Label htmlFor="password" className="text-sm">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" />
                </div>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
            {view === 'login' && (
              <>
                <p>
                  <button onClick={() => switchView('forgot')} className="text-primary hover:underline">Forgot password?</button>
                </p>
                <p>Don't have an account? <button onClick={() => switchView('signup')} className="text-primary hover:underline font-medium">Sign Up</button></p>
              </>
            )}
            {view === 'signup' && (
              <p>Already have an account? <button onClick={() => switchView('login')} className="text-primary hover:underline font-medium">Sign In</button></p>
            )}
            {view === 'forgot' && (
              <p><button onClick={() => switchView('login')} className="text-primary hover:underline inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Back to Sign In</button></p>
            )}
          </div>

          {view === 'login' && (
            <div className="mt-4 rounded-lg bg-muted px-4 py-3 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Demo credentials:</p>
              <p>Email: alex@teamcollab.com</p>
              <p>Password: password123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
