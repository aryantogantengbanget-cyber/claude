const express = require('express');
const blockchain = require('../utils/blockchain');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get entire blockchain
router.get('/', authMiddleware, async (req, res) => {
  try {
    const chain = await blockchain.getBlockchain();
    res.json(chain);
  } catch (error) {
    console.error('Get blockchain error:', error);
    res.status(500).json({ error: 'Failed to get blockchain' });
  }
});

// Verify blockchain integrity
router.get('/verify', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await blockchain.verifyChain();
    res.json(result);
  } catch (error) {
    console.error('Verify blockchain error:', error);
    res.status(500).json({ error: 'Failed to verify blockchain' });
  }
});

// Get block by index
router.get('/block/:index', authMiddleware, async (req, res) => {
  try {
    const chain = await blockchain.getBlockchain();
    const block = chain.find(b => b.index === parseInt(req.params.index));

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    res.json(block);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get block' });
  }
});

// Get latest blocks
router.get('/latest/:count?', authMiddleware, async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const chain = await blockchain.getBlockchain();
    const latestBlocks = chain.slice(-count).reverse();

    res.json(latestBlocks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get latest blocks' });
  }
});

// Initialize blockchain (create genesis block)
router.post('/init', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const genesisBlock = await blockchain.createGenesisBlock();
    res.json({
      message: 'Blockchain initialized',
      genesisBlock
    });
  } catch (error) {
    console.error('Init blockchain error:', error);
    res.status(500).json({ error: 'Failed to initialize blockchain' });
  }
});

module.exports = router;
