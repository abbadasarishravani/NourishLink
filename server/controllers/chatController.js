const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");

const dialogflowCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
const projectId = process.env.DIALOGFLOW_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;

let sessionClient;

if (dialogflowCredentials) {
  try {
    sessionClient = new dialogflow.SessionsClient({
      credentials: JSON.parse(dialogflowCredentials),
    });
  } catch (err) {
    console.error("Failed to parse Dialogflow credentials:", err);
  }
}

exports.chat = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "The 'message' field is required." });
  }

  if (!projectId) {
    return res.status(500).json({ error: "Dialogflow project ID is not configured on the server." });
  }

  if (!sessionClient) {
    return res.status(500).json({ error: "Dialogflow credentials are missing or invalid." });
  }

  try {
    const sessionId = uuid.v4();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message.trim(),
          languageCode: "en-US",
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    return res.json({
      message: result.fulfillmentText || "Sorry, I couldn't understand that.",
    });
  } catch (error) {
    console.error("Dialogflow error:", error);
    return res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
};