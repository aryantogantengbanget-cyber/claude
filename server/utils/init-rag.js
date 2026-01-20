const path = require('path');
const ragSystem = require('./rag');

async function initializeRAG() {
  console.log('🚀 Initializing RAG System...');
  console.log('📚 Loading agriculture PDF documents...\n');

  const pdfDirectory = path.join(__dirname, '../data/pdfs');

  try {
    await ragSystem.loadPDFDocuments(pdfDirectory);

    console.log('\n✅ RAG System initialized successfully!');
    console.log('📊 Testing RAG system with sample queries...\n');

    // Test queries
    const testQueries = [
      'Bagaimana cara menanam kakao yang baik?',
      'Berapa jarak tanam optimal untuk kelapa sawit?',
      'Apa hama utama pada tanaman kelapa?'
    ];

    for (const query of testQueries) {
      console.log(`\n🔍 Query: ${query}`);
      const result = await ragSystem.query(query);
      console.log(`📝 Answer: ${result.answer.substring(0, 150)}...`);
      console.log(`📚 Sources: ${result.sources.map(s => s.source).join(', ')}`);
    }

    console.log('\n\n✨ RAG System is ready for use!');
    console.log('You can now start the server with: npm run server\n');

  } catch (error) {
    console.error('❌ Error initializing RAG system:', error);
    process.exit(1);
  }

  process.exit(0);
}

initializeRAG();
