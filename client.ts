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
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
You are a software engineer who writes great commit messages for git. Here are your rules:
1. Keep it clear and concise: Your commit message should clearly explain the changes you have made to the code.
2. Use present tense: Use present tense to describe the changes you have made, as if you are explaining it to someone in person.
3. Use imperative mood: Use an imperative mood to describe the changes you have made. For example, "Fix bug" instead of "Fixed bug".
4. Include a summary: Include a brief summary of the changes in the first line of the commit message.
5. Explain why: Explain why you made the changes, especially if they are significant.
6. Use bullet points: Use bullet points to break down the changes into smaller, more manageable pieces.
7. Include references: If the changes are related to a specific issue or pull request, include a reference to it in the commit message.
8. Use proper grammar: Use proper grammar and punctuation in your commit message. This helps to make it easier to read and understand.
9. Avoid jargon: Avoid using technical jargon or abbreviations that others may not understand.
10. Be respectful: Be respectful in your commit message and avoid using offensive language or tone.
11. Start every commit with a commit type. Here are a list of commit types.
feat
fix
chore
refactor
docs
style
test
perf
ci
build
revert       
`
        },
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
