import axios from "axios";
import { API_CONFIG } from "../utils/config";

// Create API service for Groq
const createGroqService = () => {
  // Using environment variable to store the API key
  const apiKey = API_CONFIG.GROQ_API_KEY;

  // Create axios instance with base configuration
  const groqInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  // Function to generate movie recommendation
  const generateMovie = async (genre) => {
    try {
      // Add randomization to prevent getting the same movie
      const randomSeed = Math.floor(Math.random() * 10000);

      const response = await groqInstance.post(
        API_CONFIG.ENDPOINTS.CHAT_COMPLETIONS,
        {
          model: API_CONFIG.DEFAULT_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a movie recommendation expert. Provide accurate information about real movies only. Avoid hallucinations.",
            },
            {
              role: "user",
              content: `Suggest one real movie in the "${genre}" genre that I might not have seen before. Make it somewhat random and different each time. Seed: ${randomSeed}. Return the response in JSON format with the following structure: 
            {
              "title": "Movie Title",
              "year": "Year of Release",
              "director": "Director Name",
              "synopsis": "Brief synopsis of the movie (2-3 sentences)",
              "rating": "IMDB rating (e.g., 8.5/10)",
              "starring": ["Actor 1", "Actor 2", "Actor 3"]
            }`,
            },
          ],
          temperature: 0.7, // Higher temperature for more variety
          max_tokens: 500,
        }
      );

      // Extract the JSON response from the text
      const content = response.data.choices[0].message.content;

      // Handle potential JSON parsing issues
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        // Attempt to extract JSON from the text if it contains other text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Invalid JSON response from API");
      }
    } catch (error) {
      console.error("Error generating movie recommendation:", error);
      throw error;
    }
  };

  return {
    generateMovie,
  };
};

export default createGroqService();
