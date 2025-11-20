import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Package, Info, MapPin, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface Recommendation {
  medicineName: string;
  potency: string;
  dosage: string;
  description: string;
  benefits: string[];
  considerations: string[];
  amazonUrl: string;
}

interface LocalStore {
  name: string;
  address: string;
  rating?: number;
  openNow?: boolean;
}

interface RecommendationResultsProps {
  recommendations: Recommendation[];
  localStores?: LocalStore[];
  onNewSearch: () => void;
}

export const RecommendationResults = ({ recommendations, localStores, onNewSearch }: RecommendationResultsProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">
          {recommendations.length} Recommended Options
        </h2>
        <Button variant="outline" onClick={onNewSearch}>
          New Search
        </Button>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-6 pb-4">
          {recommendations.map((recommendation, index) => (
            <Card key={index} className="shadow-medium border-primary/20 flex flex-col min-w-[350px] max-w-[350px]">
              <CardHeader className="bg-gradient-hero">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Package className="h-6 w-6 text-primary flex-shrink-0" />
                      <span className="break-words">{recommendation.medicineName}</span>
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-sm px-3 py-1 w-fit">
                    {recommendation.potency}
                  </Badge>
                  {index === 0 && (
                    <Badge className="bg-primary text-primary-foreground w-fit">
                      Best Match
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    About This Remedy
                  </h3>
                  <div className="text-sm text-muted-foreground leading-relaxed max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                    {recommendation.description}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">Dosage</h3>
                  <div className="text-xs text-foreground bg-muted px-3 py-2 rounded-lg max-h-20 overflow-y-auto scrollbar-thin">
                    {recommendation.dosage}
                  </div>
                </div>

                {recommendation.benefits.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Key Benefits</h3>
                    <ul className="space-y-1 max-h-32 overflow-y-auto pr-2 scrollbar-thin">
                      {recommendation.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-secondary text-sm">•</span>
                          <span className="text-xs text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recommendation.considerations.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900">
                    <h3 className="font-semibold text-sm mb-2 text-amber-900 dark:text-amber-100">
                      Considerations
                    </h3>
                    <ul className="space-y-1 max-h-32 overflow-y-auto pr-2 scrollbar-thin">
                      {recommendation.considerations.map((consideration, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600 dark:text-amber-400 text-sm">•</span>
                          <span className="text-amber-800 dark:text-amber-200 text-xs">
                            {consideration}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  variant="hero"
                  size="sm"
                  className="w-full mt-auto"
                  onClick={() => window.open(recommendation.amazonUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Amazon
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {localStores && localStores.length > 0 && (
        <Card className="mt-8 shadow-medium">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <CardTitle>Local Homeopathic Stores</CardTitle>
            </div>
            <CardDescription>
              Stores near your location that carry homeopathic medicines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                {localStores.map((store, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{store.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{store.address}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {store.rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="text-foreground">{store.rating}</span>
                            </div>
                          )}
                          {store.openNow !== undefined && (
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="w-4 h-4" />
                              <span className={store.openNow ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                                {store.openNow ? "Open now" : "Closed"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <div className="text-center text-sm text-muted-foreground bg-card p-4 rounded-lg border">
        <p>
          <strong>Disclaimer:</strong> These recommendations are for informational purposes only. Always consult with a
          qualified healthcare professional before starting any new treatment.
        </p>
      </div>
    </div>
  );
};
