import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const EMBEDDINGS_ENDPOINT = process.env.EMBEDDINGS_ENDPOINT || '';


class CustomEmbeddings {
  async embedDocuments(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map(text => this.embedQuery(text)));
  }

  async embedQuery(text: string): Promise<number[]> {
    try {
      const response = await axios.post(EMBEDDINGS_ENDPOINT, {
        model: "mxbai-embed-large",
        prompt: text
      });
      return response.data.embedding;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw new Error(`Failed to generate embeddings${error}`);
    }
  }
}

export default CustomEmbeddings;
