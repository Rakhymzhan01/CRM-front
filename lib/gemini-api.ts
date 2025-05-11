// This is a mock Gemini API service for demo purposes
// In a real implementation, you would need to use the actual Gemini API

class GeminiApiService {
    private API_KEY: string | null = null;
    private API_URL = "https://generativelanguage.googleapis.com/v1beta";
    private MODEL = "gemini-pro";
    
    constructor() {
      // In a real implementation, you would get the API key from environment variables
      // this.API_KEY = process.env.GEMINI_API_KEY;
      
      // For demo purposes, we'll set a dummy key
      this.API_KEY = "YOUR_API_KEY";
    }
    
    async generateResponse(prompt: string): Promise<string> {
      // Check if we're in a demo/mock environment
      if (process.env.NODE_ENV !== "production" || !this.API_KEY || this.API_KEY === "YOUR_API_KEY") {
        // Return mock responses for demonstration purposes
        console.log("Using mock Gemini API responses");
        return this.getMockResponse(prompt);
      }
      
      try {
        const response = await fetch(`${this.API_URL}/models/${this.MODEL}:generateContent?key=${this.API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        });
        
        const data = await response.json();
        
        // Extract the response text from the Gemini API response
        if (data.candidates && data.candidates.length > 0) {
          const candidateContent = data.candidates[0].content;
          if (candidateContent.parts && candidateContent.parts.length > 0) {
            return candidateContent.parts[0].text;
          }
        }
        
        throw new Error("Failed to get a valid response from Gemini API");
      } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
      }
    }
    
    private getMockResponse(prompt: string): Promise<string> {
      // Simulate network delay
      return new Promise((resolve) => {
        setTimeout(() => {
          const lowercasePrompt = prompt.toLowerCase();
          
          // Provide mock responses related to shop management based on keywords
          if (lowercasePrompt.includes("inventory") || lowercasePrompt.includes("stock")) {
            resolve("I recommend implementing a just-in-time inventory system to reduce storage costs while ensuring you don't run out of popular items. You can use the Inventory Management module in the Shop CRM to set up automatic reorder points based on historical sales data.");
          } else if (lowercasePrompt.includes("sales") || lowercasePrompt.includes("revenue")) {
            resolve("Based on your recent sales data, I notice that accessories have a higher profit margin than main products. Consider creating bundle deals that pair main products with accessories to increase your average order value. You can track the performance of these bundles in the Sales Analytics dashboard.");
          } else if (lowercasePrompt.includes("customer") || lowercasePrompt.includes("client")) {
            resolve("Customer retention is often more cost-effective than acquisition. Consider implementing a loyalty program that rewards repeat purchases. The Shop CRM can help you identify your most valuable customers so you can target them with special offers.");
          } else if (lowercasePrompt.includes("employee") || lowercasePrompt.includes("staff")) {
            resolve("To improve employee productivity, consider implementing performance metrics tied to incentives. You can use the Employee Management module to track key performance indicators and automatically calculate bonuses based on sales targets or customer satisfaction scores.");
          } else if (lowercasePrompt.includes("marketing") || lowercasePrompt.includes("advertis")) {
            resolve("For small retail shops, localized marketing often yields the highest return on investment. Consider partnering with nearby complementary businesses for cross-promotions, or setting up targeted social media ads with a 3-5 mile radius around your store location.");
          } else if (lowercasePrompt.includes("cost") || lowercasePrompt.includes("expense")) {
            resolve("I've analyzed your expense patterns, and I noticed your packaging costs are higher than industry benchmarks. Consider sourcing from alternative suppliers or buying in bulk to negotiate better rates. You might also explore eco-friendly options which can be both cost-effective and appealing to environmentally conscious customers.");
          } else {
            resolve("I'm here to help with any aspect of your shop management! I can assist with inventory optimization, sales strategies, customer relationship management, employee scheduling, marketing ideas, or cost reduction. Just let me know what specific area you'd like insights on.");
          }
        }, 1000);
      });
    }
  }
  
  // Export a singleton instance
  export const geminiApiService = new GeminiApiService();