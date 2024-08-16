import OpenAI from 'openai';

export default async function runAssistant(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { threadId, assistantId } = req.body;

  try {
    const run = await openai.beta.threads.runs.createAndPoll(
      threadId,
      { 
        assistant_id: assistantId,
      }
    );

    res.status(200).json({ result: run });
  } catch (error) {
    console.error("Error running assistant:", error);
    res.status(500).json({ error: "Failed to run assistant" });
  }
}
