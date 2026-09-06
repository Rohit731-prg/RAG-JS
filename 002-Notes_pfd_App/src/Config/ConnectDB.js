import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});
export const index = pc.index('pdf-rag-index');

export const connectPinecone = async () => {
  try {
    const stats = await index.describeIndexStats();
    console.log('Connected to Pinecone Index successfully!');
    console.log(`Total Vectors Stored: ${stats.totalRecordCount}`);
  } catch (error) {
    console.error('Failed to connect to Pinecone:', error.message);
  }
};