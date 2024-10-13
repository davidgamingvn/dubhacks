import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GENERATE_ENDPOINT = process.env.GENERATE_ENDPOINT || '';

// CustomLLM class to interact with the LLM API
class CustomLLM {
  async generate(prompts: string[]): Promise<string[]> {
    return Promise.all(prompts.map(async prompt => {
      const response = await axios.post(GENERATE_ENDPOINT, {
        model: "llama3",
        prompt: prompt,
        format: "json",
        stream: false
      });
      return response.data.response;
    }));
  }

  async call(prompt: string): Promise<string> {
    const [result] = await this.generate([prompt]);
    return result;
  }
}

export default CustomLLM;