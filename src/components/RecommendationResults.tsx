import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Package, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Recommendation {
  medicineName: string;
  potency: string;
  dosage: string;
  description: string;
  benefits: string[];
  considerations: string[];
  amazonUrl: string;
}

interface RecommendationResultsProps {
  recommendation: Recommendation;
  onNewSearch: () => void;
}

export const RecommendationResults = ({ recommendation, onNewSearch }: RecommendationResultsProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      <Card className="shadow-medium border-primary/20">
        <CardHeader className="bg-gradient-hero">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl flex items-center gap-2">
                <Package className="h-8 w-8 text-primary" />
                {recommendation.medicineName}
              </CardTitle>
              <CardDescription className="text-base">
                Recommended homeopathic remedy based on your symptoms
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {recommendation.potency}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              About This Remedy
            </h3>
            <p className="text-muted-foreground leading-relaxed">{recommendation.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Recommended Dosage</h3>
            <p className="text-foreground bg-muted px-4 py-3 rounded-lg">{recommendation.dosage}</p>
          </div>

          {recommendation.benefits.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Key Benefits</h3>
              <ul className="space-y-2">
                {recommendation.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-secondary text-xl">•</span>
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendation.considerations.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
              <h3 className="font-semibold text-lg mb-3 text-amber-900 dark:text-amber-100">
                Important Considerations
              </h3>
              <ul className="space-y-2">
                {recommendation.considerations.map((consideration, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 text-xl">•</span>
                    <span className="text-amber-800 dark:text-amber-200 text-sm">{consideration}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              variant="hero"
              size="lg"
              className="flex-1"
              onClick={() => window.open(recommendation.amazonUrl, "_blank")}
            >
              <ExternalLink className="h-5 w-5" />
              Purchase on Amazon
            </Button>
            <Button variant="outline" size="lg" onClick={onNewSearch}>
              New Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground bg-card p-4 rounded-lg border">
        <p>
          <strong>Disclaimer:</strong> This recommendation is for informational purposes only. Always consult with a
          qualified healthcare professional before starting any new treatment.
        </p>
      </div>
    </div>
  );
};
