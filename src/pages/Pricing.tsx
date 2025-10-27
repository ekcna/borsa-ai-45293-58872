import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for beginners exploring the Turkish market',
    paymentLink: undefined as string | undefined,
    features: [
      'Basic stock data access',
      'Daily market overview',
      'Up to 5 watchlist stocks',
      'Simple price charts',
      'Community support',
    ],
    buttonText: 'Get Started',
    plan: 'free' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'Advanced analytics for serious investors',
    paymentLink: 'https://nowpayments.io/payment/?iid=6146657761&source=button',
    features: [
      'Everything in Free',
      'AI-powered predictions',
      'Advanced technical analysis',
      'Unlimited watchlist',
      'Real-time alerts',
      'Sentiment analysis',
      'Priority support',
    ],
    buttonText: 'Upgrade to Pro',
    plan: 'pro' as const,
    popular: true,
  },
  {
    name: 'Ultimate',
    price: '$49',
    period: 'per month',
    description: 'Complete market intelligence suite',
    paymentLink: 'https://nowpayments.io/payment/?iid=4707645921&source=button',
    features: [
      'Everything in Pro',
      'AI Trader - Automated trading',
      'Real-time news tracking',
      'Lifetime data history',
      'Custom AI strategies',
      'Portfolio optimization',
      'API access',
      'Dedicated account manager',
      '24/7 premium support',
    ],
    buttonText: 'Upgrade to Ultimate',
    plan: 'ultimate' as const,
    popular: false,
  },
];

const Pricing = () => {
  const { user, userPlan, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [lifetimeCode, setLifetimeCode] = useState('');
  const [applyingCode, setApplyingCode] = useState(false);

  const handlePlanSelect = async (plan: 'free' | 'pro' | 'ultimate') => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (plan === 'free') {
      // Free plan - immediate upgrade
      const { error } = await supabase
        .from('profiles')
        .update({ plan })
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to update plan');
        return;
      }

      await refreshProfile();
      toast.success('Switched to Free plan');
      navigate('/');
    } else {
      // Paid plans - create payment request
      const { error } = await supabase
        .from('payment_requests')
        .insert({
          user_id: user.id,
          requested_plan: plan,
          status: 'pending'
        });

      if (error) {
        toast.error('Failed to create payment request');
        return;
      }

      toast.success('Payment request created! Please follow the payment instructions below.');
    }
  };

  const handleApplyLifetimeCode = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    if (!lifetimeCode.trim()) {
      toast.error('Please enter a lifetime code');
      return;
    }

    setApplyingCode(true);

    try {
      const { error } = await supabase.rpc('apply_lifetime_code', {
        code: lifetimeCode.trim(),
      });

      if (error) throw error;

      await refreshProfile();
      toast.success('Lifetime Ultimate access activated! 🎉');
      setLifetimeCode('');
      navigate('/');
    } catch (error) {
      toast.error('Invalid or expired lifetime code');
    } finally {
      setApplyingCode(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your investment journey. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? 'border-primary shadow-glow scale-105'
                  : 'border-border/50 shadow-elevated'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-hero text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.plan === 'free' ? (
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    onClick={() => handlePlanSelect(plan.plan)}
                    disabled={userPlan === plan.plan}
                  >
                    {userPlan === plan.plan ? 'Current Plan' : plan.buttonText}
                  </Button>
                ) : (
                  <a
                    href={plan.paymentLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="block w-full"
                  >
                    <Button
                      variant={plan.popular ? 'hero' : 'default'}
                      size="lg"
                      className="w-full"
                      disabled={userPlan === plan.plan}
                    >
                      {userPlan === plan.plan ? 'Current Plan' : 'Pay with Crypto'}
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Instructions */}
        <Card className="max-w-2xl mx-auto border-border/50 shadow-elevated mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-center">Payment Instructions</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred payment method to activate your Pro or Ultimate plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bank Transfer */}
            <div>
              <h3 className="font-semibold mb-3">Bank Transfer</h3>
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Bank Name</p>
                  <p className="text-base font-medium">Turkish Bank</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Account Holder</p>
                  <p className="text-base font-medium">Borsa AI</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">IBAN</p>
                  <p className="text-base font-mono">TR00 0000 0000 0000 0000 0000 00</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Reference</p>
                  <p className="text-base">Your email address</p>
                </div>
              </div>
            </div>

            {/* Crypto Payment */}
            <div>
              <h3 className="font-semibold mb-3">Cryptocurrency</h3>
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Bitcoin (BTC)</p>
                  <p className="text-xs font-mono break-all">bc1q5aee3as6ncn89j3qm0udyl76tekzunnc3yvuhe</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Ethereum (ETH)</p>
                  <p className="text-xs font-mono break-all">0x6fc50ed75c1c9d585f4b04e12fabef62df82fcb0</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">USDT (ERC20)</p>
                  <p className="text-xs font-mono break-all">0x6fc50ed75c1c9d585f4b04e12fabef62df82fcb0</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Reference</p>
                  <p className="text-base">Send your email address after payment</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              After payment, your account will be upgraded within 24 hours. Please include your email as reference.
            </p>
          </CardContent>
        </Card>

        {/* Lifetime Code Section */}
        <Card className="max-w-md mx-auto border-border/50 shadow-elevated">
          <CardHeader>
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Have a Lifetime Code?</CardTitle>
            </div>
            <CardDescription className="text-center">
              Enter your exclusive lifetime access code to unlock Ultimate plan forever
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lifetimeCode">Lifetime Access Code</Label>
              <Input
                id="lifetimeCode"
                type="text"
                placeholder="Enter your code"
                value={lifetimeCode}
                onChange={(e) => setLifetimeCode(e.target.value)}
                disabled={applyingCode}
              />
            </div>
            <Button
              onClick={handleApplyLifetimeCode}
              disabled={applyingCode || !lifetimeCode.trim()}
              className="w-full"
              variant="success"
            >
              {applyingCode ? 'Activating...' : 'Activate Lifetime Access'}
            </Button>
          </CardContent>
        </Card>

        {/* Creator Credit */}
        <div className="text-center mt-12 pb-8">
          <p className="text-sm text-muted-foreground">
            Creator: <span className="font-semibold">Emir Kaan CAF</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
