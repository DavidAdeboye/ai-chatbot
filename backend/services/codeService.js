import { GoogleGenerativeAI } from '@google/generative-ai';

class CodeService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateCode(prompt, language) {
    const result = await this.model.generateContent(`Generate ${language} code for: ${prompt}`);
    return result.response.text();
  }

  async debugCode(code, language) {
    const result = await this.model.generateContent(`Debug this ${language} code:\n${code}`);
    return result.response.text();
  }

  async explainCode(code, language) {
    const result = await this.model.generateContent(`Explain this ${language} code:\n${code}`);
    return result.response.text();
  }
}

export default new CodeService(); 