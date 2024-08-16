import OpenAI from "openai";

export default async function handler(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { threadId } = req.query;

  try {
    const threadMessages = await openai.beta.threads.messages.list(threadId);
    const latestMessage = threadMessages.data[0]; 
    const textValue = latestMessage.content.find((content) => content.type === "text").text.value;

    res.status(200).json({ result: textValue });
  } catch (error) {
    console.error("Error retrieving thread messages:", error);
    res.status(500).json({ error: "Failed to retrieve thread messages." });
  }
}
