import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Trash2, Heart } from "lucide-react";

interface FavoriteRemedy {
  id: string;
  name: string;
  potency: string;
  description: string;
  dosage: string;
  created_at: string;
}

export default function FavoriteRemedies() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteRemedy[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("favorite_remedies")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setFavorites(data || []);
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast({
        title: "Error",
        description: "Failed to load favorite remedies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("favorite_remedies")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setFavorites(favorites.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Removed from favorites",
      });
    } catch (error) {
      console.error("Error deleting favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
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
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/profile")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Favorite Remedies</h1>
          <p className="text-muted-foreground">
            Quick reference to your saved homeopathic remedies
          </p>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-4">
                Save remedies from your recommendations to access them quickly
              </p>
              <Button onClick={() => navigate("/")}>Find Remedies</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {favorites.map((remedy) => (
              <Card key={remedy.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{remedy.name}</CardTitle>
                      <Badge variant="outline" className="mt-2">
                        {remedy.potency}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(remedy.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Description:</h4>
                    <p className="text-sm text-muted-foreground">{remedy.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Dosage:</h4>
                    <p className="text-sm text-muted-foreground">{remedy.dosage}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
