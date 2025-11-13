import axios from "axios";

// Create API service for Groq
const createGroqService = () => {
  // Using environment variable or a secure method to store the API key
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  // Create axios instance with base configuration
  const groqInstance = axios.create({
    baseURL: "https://api.groq.com/v1",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  // Function to generate movie recommendation
  const generateMovie = async (genre) => {
    try {
      const response = await groqInstance.post("/chat/completions", {
        model: "llama-3.1-8b-instant", // Using the fastest model with good price/performance
        messages: [
          {
            role: "system",
            content:
              "You are a movie recommendation expert. Provide accurate information about real movies only. Avoid hallucinations.",
          },
          {
            role: "user",
            content: `Suggest one real movie in the "${genre}" genre. Return the response in JSON format with the following structure: 
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
        temperature: 0.2, // Low temperature for more factual responses
        max_tokens: 500,
      });

      // Extract the JSON response from the text
      const content = response.data.choices[0].message.content;
      // Parse the JSON string to an object
      return JSON.parse(content);
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
