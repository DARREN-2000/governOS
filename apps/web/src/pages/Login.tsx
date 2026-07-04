import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (import.meta.env.VITE_API_URL) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          navigate('/dashboard');
        } else {
          setError(data.error || 'Login failed');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    } else {
      // Simulate network delay for demo purposes
      setTimeout(() => {
        if (email && password) {
          localStorage.setItem('token', 'mock_token_for_demo_' + Date.now());
          navigate('/dashboard');
        } else {
          setError('Please enter both email and password');
        }
        setLoading(false);
      }, 800);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center text-foreground bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">GovernOS</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full bg-muted text-foreground p-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full bg-muted text-foreground p-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full mt-6">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
