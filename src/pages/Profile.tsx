import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, History } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    conditions: "",
    location: "",
    additional_info: "",
  });

  useEffect(() => {
    checkUserAndLoadProfile();
  }, []);

  const checkUserAndLoadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          conditions: data.conditions || "",
          location: data.location || "",
          additional_info: data.additional_info || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          conditions: profile.conditions,
          location: profile.location,
          additional_info: profile.additional_info,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Manage your health information. This data will be used to pre-fill your symptom search forms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="conditions">
                  Existing Health Conditions
                </Label>
                <Textarea
                  id="conditions"
                  placeholder="e.g., Diabetes, High blood pressure, Asthma..."
                  value={profile.conditions}
                  onChange={(e) =>
                    setProfile({ ...profile, conditions: e.target.value })
                  }
                  className="min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground">
                  List any chronic conditions or allergies
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., New York, USA"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Your location helps provide region-specific recommendations
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_info">
                  Additional Information
                </Label>
                <Textarea
                  id="additional_info"
                  placeholder="e.g., Age, lifestyle factors, medications..."
                  value={profile.additional_info}
                  onChange={(e) =>
                    setProfile({ ...profile, additional_info: e.target.value })
                  }
                  className="min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground">
                  Any other relevant health information
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Search History</CardTitle>
            <CardDescription>
              View your past symptom searches and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => navigate("/history")}
              className="w-full gap-2"
            >
              <History className="h-4 w-4" />
              View Search History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
