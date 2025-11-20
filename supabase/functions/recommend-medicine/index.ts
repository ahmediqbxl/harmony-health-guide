import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, existingConditions, additionalInfo, age, gender } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are an expert homeopathic consultant with deep knowledge of homeopathic remedies, materia medica, and constitutional prescribing. Your role is to analyze patient symptoms and recommend multiple appropriate homeopathic medicines.

Important guidelines:
- Provide 3-5 different homeopathic remedy options
- Consider the totality of symptoms, not just isolated complaints
- Match symptom patterns to remedy pictures
- Consider constitutional factors (age, gender, temperament)
- Recommend classical single remedies
- Provide appropriate potencies (typically 6C, 30C, or 200C)
- Include clear dosage instructions
- Emphasize safety and when to seek professional care
- Order recommendations by best match to symptoms

Always structure each recommendation with:
- Remedy name (Latin name + common name if applicable)
- Potency recommendation
- Detailed dosage instructions
- Clear description of why this remedy matches
- Expected benefits
- Important considerations and safety notes`;

    const userPrompt = `Please analyze these symptoms and recommend 3-5 appropriate homeopathic medicines:

Symptoms: ${symptoms}
${existingConditions ? `Existing conditions: ${existingConditions}` : ''}
${additionalInfo ? `Additional information: ${additionalInfo}` : ''}
Age: ${age}
Gender: ${gender}

Provide 3-5 homeopathic medicine recommendations, ordered by best match.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'recommend_homeopathic_medicines',
              description: 'Recommend multiple homeopathic medicines based on symptom analysis',
              parameters: {
                type: 'object',
                properties: {
                  recommendations: {
                    type: 'array',
                    description: 'List of 3-5 homeopathic medicine recommendations, ordered by best match',
                    items: {
                      type: 'object',
                      properties: {
                        medicineName: {
                          type: 'string',
                          description: 'The full name of the recommended homeopathic medicine (Latin name + potency)'
                        },
                        potency: {
                          type: 'string',
                          description: 'The recommended potency (e.g., 6C, 30C, 200C)'
                        },
                        dosage: {
                          type: 'string',
                          description: 'Detailed dosage instructions including frequency and duration'
                        },
                        description: {
                          type: 'string',
                          description: 'Comprehensive description of the remedy and why it matches the symptoms'
                        },
                        benefits: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'List of expected benefits (3-5 items)'
                        },
                        considerations: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'Important safety considerations and guidance (3-5 items)'
                        }
                      },
                      required: ['medicineName', 'potency', 'dosage', 'description', 'benefits', 'considerations'],
                      additionalProperties: false
                    },
                    minItems: 3,
                    maxItems: 5
                  }
                },
                required: ['recommendations'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'recommend_homeopathic_medicines' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service requires payment. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data, null, 2));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'recommend_homeopathic_medicines') {
      throw new Error('Invalid AI response format');
    }

    const result = JSON.parse(toolCall.function.arguments);
    
    // Generate Amazon search URLs for each medicine
    const recommendationsWithUrls = result.recommendations.map((rec: any) => {
      const searchQuery = encodeURIComponent(rec.medicineName.replace(/\s+/g, '+'));
      const amazonUrl = `https://www.amazon.com/s?k=${searchQuery}+homeopathic`;
      return {
        ...rec,
        amazonUrl
      };
    });

    return new Response(
      JSON.stringify({ recommendations: recommendationsWithUrls }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in recommend-medicine function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate recommendation'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
