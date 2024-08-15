import OpenAI from 'openai';

export default async function handler(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Error retrieving response from OpenAI' });
  }
}
