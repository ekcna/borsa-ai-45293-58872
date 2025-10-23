import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName, username);
      }
    } catch (error) {
      // Error is handled in useAuth
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset code sent to your email! Please check your inbox and spam folder.');
        setIsVerifyingOtp(true);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
      });

      if (error) {
        toast.error(error.message);
      } else {
        // Now update the password
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (updateError) {
          toast.error(updateError.message);
        } else {
          toast.success('Password updated successfully!');
          setIsForgotPassword(false);
          setIsVerifyingOtp(false);
          setOtp('');
          setNewPassword('');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="flex items-center gap-3 justify-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl text-foreground">Stock AI</span>
        </Link>

        <Card className="border-border/50 shadow-elevated">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isForgotPassword 
                ? (isVerifyingOtp ? 'Enter Reset Code' : 'Reset Password')
                : (isLogin ? 'Welcome Back' : 'Create Account')
              }
            </CardTitle>
            <CardDescription className="text-center">
              {isForgotPassword
                ? (isVerifyingOtp 
                    ? 'Enter the code sent to your email and your new password'
                    : 'Enter your email to receive a password reset code')
                : (isLogin
                    ? 'Sign in to access your Turkish stock insights'
                    : 'Start your journey with AI-powered stock analysis')
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isForgotPassword ? (
              isVerifyingOtp ? (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={5}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    variant="hero"
                    size="lg"
                    disabled={loading || otp.length !== 5}
                  >
                    {loading ? 'Loading...' : 'Reset Password'}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setIsVerifyingOtp(false);
                        setOtp('');
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="emir@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    variant="hero"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Send Reset Code'}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-primary hover:underline font-medium"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Emir Yılmaz"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="emiryilmaz"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="emir@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  variant="hero"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline font-medium"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
