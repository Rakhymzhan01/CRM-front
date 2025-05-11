// OpenAI API service using environment variables for secure API key management

class OpenAIApiService {
    private API_URL = "https://api.openai.com/v1/chat/completions";
    private MODEL = "gpt-4o";
    
    constructor() {
      // No API key stored in the constructor
      // We'll access it directly from process.env when needed
    }
    
    async generateResponse(prompt: string): Promise<string> {
      try {
        console.log("Calling OpenAI API with prompt:", prompt);
        
        // Get the API key from environment variables
        const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        
        // Check if API key is available
        if (!apiKey) {
          console.error("OpenAI API key is not defined in environment variables");
          return "Error: API key is not configured. Please check your environment variables.";
        }
        
        const response = await fetch(this.API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: this.MODEL,
            messages: [
              {
                role: "system",
                content: "You are a helpful AI assistant for a shop management system. Provide concise, practical advice about inventory management, sales strategies, customer relations, employee management, and other retail business topics. Limit responses to 2-3 paragraphs maximum."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI API error:", errorData);
          throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
          return data.choices[0].message.content;
        }
        
        throw new Error("Failed to get a valid response from OpenAI API");
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        // Provide a useful error message to the user
        if (error instanceof Error) {
          return `I encountered an error while trying to process your request: ${error.message}. Please try again or contact support if the issue persists.`;
        }
        return "I encountered an unexpected error while trying to process your request. Please try again or contact support if the issue persists.";
      }
    }
  }
  
  // Export a singleton instance
  export const openAIApiService = new OpenAIApiService();