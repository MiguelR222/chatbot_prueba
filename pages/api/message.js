import OpenAI from 'openai';

export default async function handler(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { threadId, role, content } = req.body;

  try {
    const message = await openai.beta.threads.messages.create(
      threadId,
      {
        role: role,
        content: content,
      }
    );

    res.status(200).json({ result: message });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Error retrieving response from OpenAI' });
  }
}
