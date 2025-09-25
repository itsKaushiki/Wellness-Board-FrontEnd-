import { UserProfile, WellnessTip } from './types';

// Gemini AI service for generating wellness tips
class AIService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY || '';
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    console.log('Checking API key:', this.apiKey ? 'Present' : 'Missing');
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured. Please set REACT_APP_GEMINI_API_KEY environment variable.');
    }

    const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No content received from Gemini API');
    }
    
    return text;
  }

  private createTipsPrompt(profile: UserProfile): string {
    const goalsText = profile.goals.join(', ');
    
    return `Generate exactly 5 personalized wellness tips for a ${profile.age}-year-old ${profile.gender} with goals: ${goalsText}.

Return ONLY a valid JSON array with this exact structure (no markdown formatting):
[
  {
    "title": "Short catchy title (max 30 chars)",
    "description": "Brief description (max 60 chars)", 
    "icon": "relevant emoji",
    "category": "wellness category",
    "detailedExplanation": "2-3 sentences about benefits",
    "steps": [
      "Step 1 instruction",
      "Step 2 instruction",
      "Step 3 instruction"
    ]
  }
]

Make tips specific to their age, gender and goals. Use actionable, science-based advice.`;
  }

  private createDetailPrompt(tip: WellnessTip): string {
    return `Expand this wellness tip with detailed information:

Title: ${tip.title}
Description: ${tip.description}

Return ONLY valid JSON (no markdown formatting):
{
  "detailedExplanation": "3-4 sentences about scientific benefits and importance",
  "steps": [
    "Detailed step 1 with specific instructions",
    "Detailed step 2 with specific instructions", 
    "Detailed step 3 with specific instructions",
    "Detailed step 4 with specific instructions",
    "Detailed step 5 with specific instructions"
  ]
}`;
  }

  async generateWellnessTips(profile: UserProfile): Promise<WellnessTip[]> {
    console.log('Generating wellness tips for profile:', profile);
    const prompt = this.createTipsPrompt(profile);
    console.log('Calling Gemini API with prompt:', prompt.substring(0, 100) + '...');
    const response = await this.callGeminiAPI(prompt);
    
    // Clean and parse the JSON response
    const cleanResponse = response.replace(/```json|```|`/g, '').trim();
    
    let tipsData;
    try {
      tipsData = JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Failed to parse Gemini response:', cleanResponse);
      throw new Error('Invalid JSON response from Gemini API');
    }
    
    if (!Array.isArray(tipsData)) {
      throw new Error('Gemini API did not return an array of tips');
    }

    return tipsData.map((tip: any, index: number) => ({
      id: `gemini-tip-${Date.now()}-${index}`,
      title: tip.title || `Wellness Tip ${index + 1}`,
      description: tip.description || 'AI-generated wellness advice',
      icon: tip.icon || '💡',
      category: tip.category || 'general',
      detailedExplanation: tip.detailedExplanation || '',
      steps: Array.isArray(tip.steps) ? tip.steps : []
    }));
  }

  async generateDetailedTip(tip: WellnessTip): Promise<WellnessTip> {
    // If tip already has detailed info, return it
    if (tip.detailedExplanation && tip.steps && tip.steps.length > 3) {
      return tip;
    }

    const prompt = this.createDetailPrompt(tip);
    const response = await this.callGeminiAPI(prompt);
    
    // Clean and parse the JSON response
    const cleanResponse = response.replace(/```json|```|`/g, '').trim();
    
    let detailData;
    try {
      detailData = JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Failed to parse detailed tip response:', cleanResponse);
      // Return original tip if parsing fails
      return tip;
    }
    
    return {
      ...tip,
      detailedExplanation: detailData.detailedExplanation || tip.detailedExplanation,
      steps: Array.isArray(detailData.steps) ? detailData.steps : tip.steps || []
    };
  }
}

export const aiService = new AIService();
