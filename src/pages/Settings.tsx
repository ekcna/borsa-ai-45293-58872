import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Settings as SettingsIcon, Mail, Lock, User, CreditCard, Gift } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const Settings = () => {
  const { user, refreshProfile } = useAuth();
  const { profile, refetch } = useProfile();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState("");

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
    }
  }, [profile]);

  useEffect(() => {
    const fetchPlanExpiration = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('plan_expires_at')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setPlanExpiresAt(data.plan_expires_at);
      }
    };
    
    fetchPlanExpiration();
  }, [user]);

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: username.trim() || null })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Username updated successfully!");
      await refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update username");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;
      
      toast.success("Email update initiated! Please check your new email for confirmation.");
    } catch (error: any) {
      toast.error(error.message || "Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleDowngradeToPro = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: 'pro' })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Downgraded to Pro plan successfully!");
      await refreshProfile();
      await refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to downgrade plan");
    } finally {
      setLoading(false);
    }
  };

  const handleDowngradeToFree = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: 'free' })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Downgraded to Free plan successfully!");
      await refreshProfile();
      await refetch();
      setPlanExpiresAt(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to downgrade plan");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !accessCode.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('redeem-access-code', {
        body: { code: accessCode.trim() }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(data.message);
        setAccessCode("");
        await refreshProfile();
        await refetch();
      } else {
        toast.error(data.error || "Failed to redeem code");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to redeem access code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          </div>

          {/* Redeem Access Code Section */}
          <Card className="p-6">
            <form onSubmit={handleRedeemCode} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Redeem Access Code</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessCode">Access Code</Label>
                <Input
                  id="accessCode"
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter your access code"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a lifetime access code to upgrade your account
                </p>
              </div>

              <Button type="submit" disabled={loading || !accessCode.trim()}>
                {loading ? "Redeeming..." : "Redeem Code"}
              </Button>
            </form>
          </Card>

          {/* Plan Management Section */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Subscription Plan</h2>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-lg font-semibold capitalize">{profile?.subscription_plan || 'Free'}</p>

                {planExpiresAt && (
                  <p className="text-sm text-muted-foreground">
                    Expires: {new Date(planExpiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {profile?.subscription_plan === 'ultimate' && (
                  <>
                    <Button onClick={handleDowngradeToPro} disabled={loading} variant="outline">
                      {loading ? "Processing..." : "Downgrade to Pro"}
                    </Button>
                    <Button onClick={handleDowngradeToFree} disabled={loading} variant="outline">
                      {loading ? "Processing..." : "Downgrade to Free"}
                    </Button>
                  </>
                )}

                {profile?.subscription_plan === 'pro' && (
                  <Button onClick={handleDowngradeToFree} disabled={loading} variant="outline">
                    {loading ? "Processing..." : "Downgrade to Free"}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Username Update Section */}
          <Card className="p-6">
            <form onSubmit={handleUsernameUpdate} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Update Username</h2>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Username"}
              </Button>
            </form>
          </Card>

          {/* Email Update Section */}
          <Card className="p-6">
            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Update Email</h2>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <Button type="submit" disabled={loading || email === user?.email}>
                {loading ? "Updating..." : "Update Email"}
              </Button>
            </form>
          </Card>

          {/* Password Update Section */}
          <Card className="p-6">
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Change Password</h2>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
