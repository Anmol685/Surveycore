import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Helper to get Google Gen AI client with lazy initialization
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required to generate surveys with AI.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Inteligent Survey Builder Endpoint
  app.post("/api/generate-survey", async (req, res) => {
    try {
      const { topic, channel = "Email", surveyType = "CSAT" } = req.body;
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      // Check if API key is present, if not, fail-safely return a predefined template
      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is not defined. Falling back to rule-based fallback survey generator.");
        return res.json(getFallbackSurvey(topic, surveyType, channel));
      }

      const ai = getAiClient();
      
      const prompt = `You are a professional Customer Success and CSAT/NPS Architect. 
Generate a high-converting survey structure for: "${topic}".
Survey Type requested: ${surveyType}
Channel: ${channel}

Provide suitable details including Title, Subtitle (briefly reassuring), rating type ("stars" or "numbers"), standard feedback tags suitable for this topic (list of 3 tags), and a set of starting logical survey questions (up to 3 questions).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You generate custom survey designs in structured JSON. Always structure output strictly according to the requested JSON schema. Make sure the survey elements sound elite, enterprise-grade, clean, and focus on capturing actionable feedback insights.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "The primary survey heading, e.g. 'How was your delivery experience?'"
              },
              subtitle: {
                type: Type.STRING,
                description: "Brief reassuring subtitle, e.g. 'Your feedback helps us level up our service.'"
              },
              ratingType: {
                type: Type.STRING,
                description: "Strictly either 'stars' or 'numbers'"
              },
              allowComments: {
                type: Type.BOOLEAN,
                description: "Whether text comments should be enabled"
              },
              submitButtonText: {
                type: Type.STRING,
                description: "The text on the submit button, e.g. 'Submit Feedback'"
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of exactly 3 relevant quick action tags, e.g. ['Fast Delivery', 'Great Quality', 'Easy Setup']"
              },
              questions: {
                type: Type.ARRAY,
                description: "List of 1 to 3 core questions",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "Unique short string, e.g. 'q1', 'q_csat'" },
                    type: { type: Type.STRING, description: "Type of question: 'NPS', 'CSAT', or 'MultipleChoice'" },
                    text: { type: Type.STRING, description: "The question prompt text" },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "List of options for MultipleChoice or sub-labels, otherwise empty array"
                    }
                  },
                  required: ["id", "type", "text"]
                }
              }
            },
            required: ["title", "subtitle", "ratingType", "allowComments", "submitButtonText", "tags", "questions"]
          }
        }
      });

      const responseText = response.text || "{}";
      const resultObj = JSON.parse(responseText);
      res.json(resultObj);
    } catch (error: any) {
      console.error("Gemini Survey Generation Error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to generate survey with AI.",
        fallback: true 
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SurveyCore] Server is listening on http://localhost:${PORT}`);
  });
}

// Solid fallback generator in case Gemini API key isn't provided
function getFallbackSurvey(topic: string, surveyType: string, channel: string) {
  const t = topic.toLowerCase();
  
  // Default values
  let title = `How is your experience with ${topic}?`;
  let subtitle = "We appreciate your time. Let us know how we're doing so we can improve.";
  let ratingType = "stars";
  let tags = ["Quick Response", "Smooth Process", "Friendly Service"];
  let submitButtonText = "Submit Feedback";
  let questions = [
    {
      id: "q_csat",
      type: "CSAT",
      text: `Overall, how satisfied are you with ${topic}?`,
      options: []
    }
  ];

  if (t.includes("checkout") || t.includes("purchase") || t.includes("pay")) {
    title = "How was your checkout experience?";
    subtitle = "We're always looking to optimize our payment and checkout purchase flow.";
    ratingType = "stars";
    tags = ["Fast Payment", "Secure Checkout", "Clear Options"];
    submitButtonText = "Complete Survey";
    questions = [
      {
        id: "q1",
        type: "CSAT",
        text: "How would you rate the speed of the checkout process?",
        options: []
      },
      {
        id: "q2",
        type: "MultipleChoice",
        text: "Did you encounter any friction during payment?",
        options: ["No, it was seamless", "Yes, checkout loaded slowly", "Yes, card got declined initially"]
      },
      {
        id: "q3",
        type: "NPS",
        text: "Based on this purchase, likelyhood of recommending us to a colleague?",
        options: []
      }
    ];
  } else if (t.includes("support") || t.includes("ticket") || t.includes("help") || t.includes("chat")) {
    title = "Help us improve our Support!";
    subtitle = "Your feedback directly helps us coach our support engineers and resolve issues faster.";
    ratingType = "numbers";
    tags = ["Expert Help", "Quick Solution", "Caring Attitude"];
    submitButtonText = "Submit Evaluation";
    questions = [
      {
        id: "q1",
        type: "CSAT",
        text: "How satisfied are you with the resolution of your support request?",
        options: []
      },
      {
        id: "q2",
        type: "MultipleChoice",
        text: "Was your customer support prompt and helpful?",
        options: ["Extremely prompt", "Somewhat prompt", "Slow and unresponsive"]
      }
    ];
  } else if (t.includes("onboard") || t.includes("setup") || t.includes("start")) {
    title = "How was your setup experience?";
    subtitle = "We value your onboarding experience. Let us know if we got you started smoothly.";
    ratingType = "stars";
    tags = ["Easy Setup", "Intuitive Flow", "Great Guidance"];
    submitButtonText = "Send Feedback";
    questions = [
      {
        id: "q1",
        type: "CSAT",
        text: "How easy was it to complete the onboarding setup process?",
        options: []
      },
      {
        id: "q2",
        type: "MultipleChoice",
        text: "Which setup resources did you find the most helpful?",
        options: ["interactive Guide", "Video Tutorial", "Documentation Docs", "Chat Support"]
      }
    ];
  }

  return {
    title,
    subtitle,
    ratingType,
    allowComments: true,
    submitButtonText,
    tags,
    questions
  };
}

startServer();
