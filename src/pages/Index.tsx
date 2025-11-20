import { useState } from "react";
import { SymptomForm, type SymptomData } from "@/components/SymptomForm";
import { RecommendationResults, type Recommendation } from "@/components/RecommendationResults";
import { Sparkles, Heart, Leaf } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-homeopathy.jpg";

const Index = () => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: SymptomData) => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual AI backend call
      // Simulating API call for now
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock recommendation
      const mockRecommendation: Recommendation = {
        medicineName: "Arnica Montana 30C",
        potency: "30C Potency",
        dosage: "Take 3-5 pellets under the tongue, 3 times daily. Allow pellets to dissolve completely. Avoid eating or drinking 15 minutes before and after taking.",
        description:
          "Arnica Montana is a widely used homeopathic remedy derived from the Arnica flower, traditionally used for bruising, muscle soreness, and recovery from physical trauma. It's known for its anti-inflammatory properties in homeopathic practice.",
        benefits: [
          "May help reduce bruising and swelling",
          "Traditionally used for muscle aches and soreness",
          "Supports recovery from minor physical trauma",
          "Natural approach to inflammation management",
        ],
        considerations: [
          "Consult a healthcare provider if symptoms persist or worsen",
          "Not a replacement for emergency medical care",
          "Keep away from strong odors (coffee, mint, camphor) which may reduce effectiveness",
          "Store in a cool, dry place away from direct sunlight",
        ],
        amazonUrl: "https://www.amazon.com/s?k=arnica+montana+30c+homeopathic",
      };
      
      setRecommendation(mockRecommendation);
      toast.success("Recommendation ready!");
    } catch (error) {
      toast.error("Failed to get recommendation. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    setRecommendation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      {!recommendation && (
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
        {recommendation ? (
          <RecommendationResults recommendation={recommendation} onNewSearch={handleNewSearch} />
        ) : (
          <SymptomForm onSubmit={handleSubmit} isLoading={isLoading} />
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
