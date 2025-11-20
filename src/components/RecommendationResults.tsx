import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Package, Info, MapPin, Star, Clock, Phone, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface Recommendation {
  medicineName: string;
  potency: string;
  potencyExplanation: string;
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
  phoneNumber?: string;
  website?: string;
  distanceKm?: number;
}

interface RecommendationResultsProps {
  recommendations: Recommendation[];
  localStores?: LocalStore[];
  onNewSearch: () => void;
  onEditSearch: () => void;
}

export const RecommendationResults = ({ recommendations, localStores, onNewSearch, onEditSearch }: RecommendationResultsProps) => {
  const [openPotencyExplanations, setOpenPotencyExplanations] = useState<Record<number, boolean>>({});

  const togglePotencyExplanation = (index: number) => {
    setOpenPotencyExplanations(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">
          {recommendations.length} Recommended Options
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEditSearch}>
            Edit Search
          </Button>
          <Button variant="outline" onClick={onNewSearch}>
            New Search
          </Button>
        </div>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-6 pb-4 items-stretch">
          {recommendations.map((recommendation, index) => (
            <Card key={index} className="shadow-medium border-primary/20 flex flex-col w-[350px]">
              <CardHeader className="bg-gradient-hero shrink-0">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl flex items-center gap-2 min-h-[64px]">
                      <Package className="h-6 w-6 text-primary flex-shrink-0" />
                      <span className="break-words">{recommendation.medicineName}</span>
                    </CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-sm px-3 py-1 w-fit">
                      {recommendation.potency}
                    </Badge>
                    {index === 0 && (
                      <Badge className="bg-primary text-primary-foreground w-fit">
                        Best Match
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4 flex-1 flex flex-col overflow-hidden">
                <Collapsible
                  open={openPotencyExplanations[index]}
                  onOpenChange={() => togglePotencyExplanation(index)}
                  className="bg-accent/10 border border-accent/20 rounded-lg shrink-0"
                >
                  <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-accent/5 transition-colors">
                    <h3 className="font-semibold text-sm text-accent">Why This Potency?</h3>
                    <ChevronDown 
                      className={`h-4 w-4 text-accent transition-transform duration-200 ${
                        openPotencyExplanations[index] ? 'transform rotate-180' : ''
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 pb-3">
                    <p className="text-xs text-foreground leading-relaxed">
                      {recommendation.potencyExplanation}
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                <div className="shrink-0">
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    About This Remedy
                  </h3>
                  <div className="text-sm text-muted-foreground leading-relaxed max-h-[100px] overflow-y-auto pr-2 scrollbar-thin">
                    {recommendation.description}
                  </div>
                </div>

                <div className="shrink-0">
                  <h3 className="font-semibold text-sm mb-2">Dosage</h3>
                  <div className="text-xs text-foreground bg-muted px-3 py-2 rounded-lg max-h-[60px] overflow-y-auto scrollbar-thin">
                    {recommendation.dosage}
                  </div>
                </div>

                <div className="shrink-0">
                  <h3 className="font-semibold text-sm mb-2">Key Benefits</h3>
                  <ul className="space-y-1 max-h-[100px] overflow-y-auto pr-2 scrollbar-thin">
                    {recommendation.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-secondary text-sm">•</span>
                        <span className="text-xs text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900 shrink-0">
                  <h3 className="font-semibold text-sm mb-2 text-amber-900 dark:text-amber-100">
                    Considerations
                  </h3>
                  <ul className="space-y-1 max-h-[100px] overflow-y-auto pr-2 scrollbar-thin">
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

                <Button
                  variant="hero"
                  size="sm"
                  className="w-full mt-auto shrink-0"
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
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            {store.distanceKm !== undefined && (
                              <div className="flex items-center gap-1 text-sm font-medium text-primary">
                                <MapPin className="w-4 h-4" />
                                <span>{store.distanceKm} km ({(store.distanceKm * 0.621371).toFixed(1)} mi)</span>
                              </div>
                            )}
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
                            {store.phoneNumber && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="w-4 h-4 text-primary" />
                                <a href={`tel:${store.phoneNumber}`} className="text-primary hover:underline">
                                  {store.phoneNumber}
                                </a>
                              </div>
                            )}
                            {store.website && (
                              <div className="flex items-center gap-1 text-sm">
                                <ExternalLink className="w-4 h-4 text-primary" />
                                <a 
                                  href={store.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-primary hover:underline"
                                >
                                  Visit Website
                                </a>
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
