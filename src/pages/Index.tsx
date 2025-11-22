import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SymptomForm, type SymptomData } from "@/components/SymptomForm";
import { RecommendationResults, type Recommendation } from "@/components/RecommendationResults";
import { Sparkles, Heart, Leaf, User, LogOut } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-homeopathy.jpg";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchData, setLastSearchData] = useState<SymptomData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setUserProfile(data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  const handleSubmit = async (data: SymptomData) => {
    setIsLoading(true);
    setLastSearchData(data);

    // Save to profile if user is logged in
    if (session) {
      const { error } = await supabase
        .from("profiles")
        .update({
          conditions: data.conditions,
          location: data.location,
          additional_info: data.additionalInfo,
        })
        .eq("id", session.user.id);

      if (error) {
        console.error("Error saving profile:", error);
      } else {
        toast.success("Health information saved");
      }
    }
    
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'recommend-medicine',
        {
          body: {
            symptoms: data.symptoms,
            severity: data.severity,
            existingConditions: data.conditions,
            additionalInfo: data.additionalInfo,
            location: data.location,
            age: 'Not specified',
            gender: 'Not specified'
          }
        }
      );

      if (functionError) {
        console.error('Function error:', functionError);
        toast.error("Failed to get recommendations. Please try again.");
        return;
      }

      setRecommendations(functionData);
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    setRecommendations(null);
    setLastSearchData(null);
  };

  const handleEditSearch = () => {
    setRecommendations(null);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="absolute top-4 right-4 z-10">
        {session ? (
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        ) : (
          <Button variant="outline" onClick={() => navigate("/auth")} className="gap-2">
            <User className="h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>

      {/* Hero Section */}
      {!recommendations && (
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src={heroImage}
              alt="Natural homeopathic remedies"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-6xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              AI-Powered Homeopathic Recommendations
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Find Your Perfect
              <br />
              <span className="text-primary">Homeopathic Remedy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get personalized homeopathic medicine recommendations based on your symptoms and health profile, 
              powered by advanced AI analysis.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft">
                <Heart className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Natural Healing</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft">
                <Leaf className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Personalized Care</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12 px-4">
        {recommendations ? (
          <RecommendationResults 
            recommendations={recommendations.recommendations} 
            localStores={recommendations.localStores}
            onNewSearch={handleNewSearch}
            onEditSearch={handleEditSearch}
          />
        ) : (
          <SymptomForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            initialData={lastSearchData || (userProfile ? {
              symptoms: "",
              severity: "moderate",
              conditions: userProfile.conditions || "",
              additionalInfo: userProfile.additional_info || "",
              location: userProfile.location || "",
            } : undefined)}
          />
        )}
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-muted-foreground border-t border-border mt-20">
        <p>© 2025 HomeoRemedies. For informational purposes only. Not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
};

export default Index;
