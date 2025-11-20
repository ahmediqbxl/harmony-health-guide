import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SymptomFormProps {
  onSubmit: (data: SymptomData) => Promise<void>;
  isLoading: boolean;
}

export interface SymptomData {
  symptoms: string;
  conditions: string;
  additionalInfo: string;
}

export const SymptomForm = ({ onSubmit, isLoading }: SymptomFormProps) => {
  const [formData, setFormData] = useState<SymptomData>({
    symptoms: "",
    conditions: "",
    additionalInfo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medium">
      <CardHeader>
        <CardTitle className="text-2xl">Tell Us About Your Symptoms</CardTitle>
        <CardDescription>
          Please provide detailed information to help us recommend the right homeopathic remedy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="symptoms">Current Symptoms *</Label>
            <Textarea
              id="symptoms"
              placeholder="Describe your symptoms in detail (e.g., headache, fatigue, nausea...)"
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              required
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conditions">Existing Health Conditions</Label>
            <Textarea
              id="conditions"
              placeholder="List any existing health conditions or chronic illnesses"
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Any other relevant information (allergies, medications, lifestyle factors...)"
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              rows={3}
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={isLoading || !formData.symptoms.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              "Get Recommendation"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
