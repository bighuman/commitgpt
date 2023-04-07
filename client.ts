// Adapted from: https://github.com/wong2/chat-gpt-google-extension/blob/main/background/index.mjs

import { v4 as uuidv4 } from 'uuid';
import ExpiryMap from 'expiry-map';
import { Configuration, OpenAIApi } from 'openai';

export const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);


export class ChatGPTClient {
  constructor(public conversationId: string = uuidv4()) {}

  async getAnswer(question: string): Promise<string> {
    console.log(question);
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
    }, {
      timeout: 1000 * 60 * 5, // 5 minutes
    });

    return response.data.choices[0].message.content;
  }
}
