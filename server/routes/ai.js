const express = require('express');
const ragSystem = require('../utils/rag');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Query RAG system
router.post('/query', authMiddleware, async (req, res) => {
  try {
    const { question, category } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await ragSystem.query(question, category);

    res.json(response);
  } catch (error) {
    console.error('AI query error:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

// Get AI recommendation based on sensor data
router.post('/recommend', authMiddleware, async (req, res) => {
  try {
    const { sensorData, crop } = req.body;

    if (!sensorData || !crop) {
      return res.status(400).json({ error: 'Sensor data and crop type are required' });
    }

    const recommendations = await ragSystem.getRecommendation(sensorData, crop);

    res.json(recommendations);
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Chat with AI assistant
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, context } = req.body;

    // This would integrate with a more sophisticated LLM in production
    const response = await ragSystem.query(message);

    res.json({
      message: response.answer,
      sources: response.sources,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

module.exports = router;
