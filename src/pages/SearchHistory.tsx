import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Trash2, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

interface SearchHistoryItem {
  id: string;
  symptoms: string;
  severity: string;
  conditions: string;
  additional_info: string;
  location: string;
  recommendations: any;
  created_at: string;
}

export default function SearchHistory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("search_history")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setHistory(data || []);
    } catch (error) {
      console.error("Error loading search history:", error);
      toast({
        title: "Error",
        description: "Failed to load search history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("search_history")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setHistory(history.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Search history deleted",
      });
    } catch (error) {
      console.error("Error deleting search history:", error);
      toast({
        title: "Error",
        description: "Failed to delete search history",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "moderate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "severe":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
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
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search History</h1>
          <p className="text-muted-foreground">
            Review your past symptom searches and recommendations
          </p>
        </div>

        {history.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No search history yet</h3>
              <p className="text-muted-foreground mb-4">
                Your symptom searches will appear here
              </p>
              <Button onClick={() => navigate("/")}>Start a Search</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(item.created_at), "PPp")}
                        </span>
                        <Badge className={getSeverityColor(item.severity)}>
                          {item.severity}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {item.symptoms.length > 100
                          ? `${item.symptoms.substring(0, 100)}...`
                          : item.symptoms}
                      </CardTitle>
                      {item.location && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="mb-3"
                  >
                    {expandedId === item.id ? "Hide Details" : "View Recommendations"}
                  </Button>

                  {expandedId === item.id && (
                    <div className="space-y-4 mt-4 pt-4 border-t">
                      {item.conditions && (
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Conditions:</h4>
                          <p className="text-sm text-muted-foreground">{item.conditions}</p>
                        </div>
                      )}
                      
                      {item.additional_info && (
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Additional Info:</h4>
                          <p className="text-sm text-muted-foreground">{item.additional_info}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-3">Recommendations:</h4>
                        <div className="space-y-3">
                          {item.recommendations?.recommendations?.map((rec: any, idx: number) => (
                            <div key={idx} className="bg-muted/50 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-semibold">{rec.name}</h5>
                                <Badge variant="outline">{rec.potency}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                              <div className="text-xs text-muted-foreground">
                                <strong>Dosage:</strong> {rec.dosage}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
