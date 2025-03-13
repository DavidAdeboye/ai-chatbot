class MemoryService {
  constructor() {
    this.conversations = new Map();
  }

  addToMemory(sessionId, message, role) {
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, []);
    }
    this.conversations.get(sessionId).push({ role, content: message });
  }

  getConversation(sessionId) {
    return this.conversations.get(sessionId) || [];
  }
}

export default new MemoryService(); 