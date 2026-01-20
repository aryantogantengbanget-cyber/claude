const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const OpenAI = require('openai');

// Simple in-memory vector store (for offline use)
class SimpleVectorStore {
  constructor() {
    this.documents = [];
    this.embeddings = [];
  }

  async addDocument(text, metadata = {}) {
    const chunks = this.splitText(text, 500);

    for (const chunk of chunks) {
      this.documents.push({
        content: chunk,
        metadata: metadata
      });

      // Generate simple embedding (word frequency vector)
      const embedding = this.generateSimpleEmbedding(chunk);
      this.embeddings.push(embedding);
    }
  }

  splitText(text, chunkSize) {
    const words = text.split(/\s+/);
    const chunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }

    return chunks;
  }

  generateSimpleEmbedding(text) {
    // Simple word frequency embedding
    const words = text.toLowerCase().split(/\s+/);
    const freq = {};

    words.forEach(word => {
      freq[word] = (freq[word] || 0) + 1;
    });

    return freq;
  }

  cosineSimilarity(freq1, freq2) {
    const allWords = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    allWords.forEach(word => {
      const f1 = freq1[word] || 0;
      const f2 = freq2[word] || 0;
      dotProduct += f1 * f2;
      mag1 += f1 * f1;
      mag2 += f2 * f2;
    });

    return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2) || 1);
  }

  async search(query, topK = 3) {
    const queryEmbedding = this.generateSimpleEmbedding(query);

    const similarities = this.embeddings.map((embedding, idx) => ({
      index: idx,
      similarity: this.cosineSimilarity(queryEmbedding, embedding)
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);

    return similarities.slice(0, topK).map(item => ({
      content: this.documents[item.index].content,
      metadata: this.documents[item.index].metadata,
      similarity: item.similarity
    }));
  }
}

class RAGSystem {
  constructor() {
    this.vectorStore = new SimpleVectorStore();
    this.openai = null;

    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }

  async loadPDFDocuments(pdfDirectory) {
    try {
      const files = await fs.readdir(pdfDirectory);
      const pdfFiles = files.filter(file => file.endsWith('.pdf'));

      for (const file of pdfFiles) {
        const filePath = path.join(pdfDirectory, file);
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdf(dataBuffer);

        await this.vectorStore.addDocument(data.text, {
          source: file,
          type: this.getCategoryFromFilename(file)
        });

        console.log(`✅ Loaded PDF: ${file}`);
      }

      console.log(`📚 Total documents loaded: ${this.vectorStore.documents.length}`);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    }
  }

  getCategoryFromFilename(filename) {
    const lower = filename.toLowerCase();
    if (lower.includes('kakao') || lower.includes('cocoa')) return 'kakao';
    if (lower.includes('kelapa') || lower.includes('coconut')) return 'coconut';
    if (lower.includes('sawit') || lower.includes('palm')) return 'palm_oil';
    return 'general';
  }

  async query(question, category = null) {
    // Search relevant documents
    const relevantDocs = await this.vectorStore.search(question, 3);

    // Build context from relevant documents
    const context = relevantDocs
      .map(doc => doc.content)
      .join('\n\n');

    // If OpenAI is configured, use it for better responses
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Anda adalah asisten AI untuk pertanian Indonesia, khususnya tentang kakao, kelapa sawit, dan kelapa. Berikan jawaban yang informatif dan praktis berdasarkan konteks yang diberikan.'
            },
            {
              role: 'user',
              content: `Konteks:\n${context}\n\nPertanyaan: ${question}\n\nJawaban:`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        });

        return {
          answer: response.choices[0].message.content,
          sources: relevantDocs.map(doc => doc.metadata),
          method: 'openai'
        };
      } catch (error) {
        console.error('OpenAI error:', error);
      }
    }

    // Fallback: Rule-based response
    const answer = this.generateFallbackResponse(question, context, relevantDocs);

    return {
      answer,
      sources: relevantDocs.map(doc => doc.metadata),
      method: 'rule-based'
    };
  }

  generateFallbackResponse(question, context, relevantDocs) {
    if (!context || relevantDocs.length === 0) {
      return 'Maaf, saya tidak menemukan informasi yang relevan untuk pertanyaan Anda. Silakan coba pertanyaan lain tentang kakao, kelapa sawit, atau kelapa.';
    }

    // Extract most relevant snippet
    const bestDoc = relevantDocs[0];
    const sentences = bestDoc.content.split(/[.!?]+/);
    const relevantSentences = sentences.slice(0, 3).join('. ') + '.';

    return `Berdasarkan data yang tersedia:\n\n${relevantSentences}\n\nSumber: ${bestDoc.metadata.source || 'Database Pertanian'}`;
  }

  async getRecommendation(sensorData, crop) {
    const { temperature, humidity, soilMoisture, pH, nitrogen, phosphorus, potassium } = sensorData;

    // Query knowledge base for crop-specific information
    const query = `${crop} optimal conditions temperature humidity soil`;
    const relevantDocs = await this.vectorStore.search(query, 2);

    // Generate recommendation based on sensor data
    const recommendations = [];

    // Temperature check
    if (crop === 'kakao') {
      if (temperature < 21 || temperature > 32) {
        recommendations.push({
          type: 'warning',
          message: 'Suhu tidak optimal untuk kakao. Suhu ideal: 21-32°C',
          action: 'Pertimbangkan penanaman naungan atau sistem irigasi'
        });
      }
    } else if (crop === 'palm_oil') {
      if (temperature < 24 || temperature > 32) {
        recommendations.push({
          type: 'warning',
          message: 'Suhu tidak optimal untuk kelapa sawit. Suhu ideal: 24-32°C',
          action: 'Pastikan sistem drainase berfungsi baik'
        });
      }
    } else if (crop === 'coconut') {
      if (temperature < 20 || temperature > 30) {
        recommendations.push({
          type: 'warning',
          message: 'Suhu tidak optimal untuk kelapa. Suhu ideal: 20-30°C',
          action: 'Monitor kesehatan tanaman secara berkala'
        });
      }
    }

    // Soil moisture check
    if (soilMoisture < 30) {
      recommendations.push({
        type: 'critical',
        message: 'Kelembaban tanah rendah',
        action: 'Lakukan penyiraman segera'
      });
    } else if (soilMoisture > 80) {
      recommendations.push({
        type: 'warning',
        message: 'Kelembaban tanah terlalu tinggi',
        action: 'Periksa sistem drainase'
      });
    }

    // pH check
    if (pH < 5.5 || pH > 7.0) {
      recommendations.push({
        type: 'warning',
        message: 'pH tanah tidak optimal',
        action: pH < 5.5 ? 'Aplikasi kapur untuk menaikkan pH' : 'Aplikasi sulfur untuk menurunkan pH'
      });
    }

    // NPK check
    if (nitrogen < 20) {
      recommendations.push({
        type: 'info',
        message: 'Nitrogen rendah',
        action: 'Aplikasi pupuk urea atau organik tinggi nitrogen'
      });
    }

    if (phosphorus < 15) {
      recommendations.push({
        type: 'info',
        message: 'Fosfor rendah',
        action: 'Aplikasi pupuk SP-36 atau pupuk kandang'
      });
    }

    if (potassium < 15) {
      recommendations.push({
        type: 'info',
        message: 'Kalium rendah',
        action: 'Aplikasi pupuk KCl atau abu kayu'
      });
    }

    return {
      recommendations,
      knowledgeBase: relevantDocs.map(doc => ({
        content: doc.content.substring(0, 200) + '...',
        source: doc.metadata.source
      })),
      overallStatus: recommendations.some(r => r.type === 'critical') ? 'critical' :
                     recommendations.some(r => r.type === 'warning') ? 'warning' : 'good'
    };
  }
}

// Create singleton instance
const ragSystem = new RAGSystem();

module.exports = ragSystem;
