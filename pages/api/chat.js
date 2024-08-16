import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function main(req, res) {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "chatbot",
      instructions: "You are a helpful ai assistant that can answer questions and provide information, but when you are asked something reggarding a Protocol X ( X being the number of the protocol) you give the user a response reggarding how many times has that Protocol been called starting with one, ex. What is Protocol 1? your response should be: Protocol 1 has been called X times.",
      model: "gpt-4o-mini",
    });
    res.status(200).json({ assistantId: assistant.id });
    console.log("Assistant created successfully:", assistant);
  } catch (error) {
    console.error("Error creating assistant:", error);
  }
}


