import type { NextApiRequest, NextApiResponse } from 'next';
import { Pinecone } from '@pinecone-database/pinecone';
import { pipeline } from '@xenova/transformers';

class PipelineSingleton {
    static task: 'feature-extraction' = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance: any = null;

    static async getInstance(progress_callback?: Function) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'method not allowed' });
    }
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'query missing or not a string' });
    }

     try {
        const apiKey = process.env.PINECONE_API_KEY;
        const indexName = process.env.PINECONE_INDEX_NAME;

        if (!apiKey || !indexName) {
            throw new Error('pinecone API key or index name not configured');
        }

        const pc = new Pinecone({
            apiKey: apiKey,
        });
        const index = pc.Index(indexName);

        const embedder = await PipelineSingleton.getInstance();
        const queryEmbedding = await embedder(query, {
            pooling: 'mean',
            normalize: true,
        });
        const vector = Array.from(queryEmbedding.data);
        
        const queryResponse = await index.query({
            topK: 50,
            vector: vector as number[],
            includeMetadata: true,
        });

        const results = queryResponse.matches.map((match) => ({
            id: match.id,
            score: match.score,
            ...match.metadata,
        }));

        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'something went wrong with the search.' });
    }
};

export default handler;