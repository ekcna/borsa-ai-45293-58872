import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Settings as SettingsIcon, Mail, Lock, User } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const Settings = () => {
  const { user } = useAuth();
  const { profile, refetch } = useProfile();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
    }
  }, [profile]);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          </div>

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
