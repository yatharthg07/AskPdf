import { OpenAI } from 'openai';  // Import the standard OpenAI class

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    // Make the API call to get embeddings
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text.replace(/\n/g, ' '),
    });

    const embeddings = response.data[0].embedding as number[];
    return embeddings;
  } catch (error) {
    console.error('Error calling OpenAI embeddings API:', error);
    throw error;
  }
}
