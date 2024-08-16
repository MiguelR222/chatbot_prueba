import OpenAI from "openai";

export default async function Thread(req, res) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const thread = await openai.beta.threads.create();
        res.status(200).json({ threadId: thread.id});
        console.log("Thread created successfully:", thread);
    } catch (error) {
        console.error("Error creating thread:", error);
        res.status(500).json({ error: "Failed to create thread" });
    }
}
