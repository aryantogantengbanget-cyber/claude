const crypto = require('crypto');
const Block = require('../models/Block');

class Blockchain {
  constructor() {
    this.difficulty = 2;
  }

  // Create genesis block
  async createGenesisBlock() {
    const existingBlocks = await Block.countDocuments();
    if (existingBlocks === 0) {
      const genesisBlock = new Block({
        index: 0,
        timestamp: new Date(),
        data: { message: 'Genesis Block - AgriSmart AI' },
        previousHash: '0',
        hash: this.calculateHash(0, new Date(), { message: 'Genesis Block' }, '0', 0),
        nonce: 0
      });
      await genesisBlock.save();
      return genesisBlock;
    }
  }

  // Calculate hash
  calculateHash(index, timestamp, data, previousHash, nonce) {
    return crypto
      .createHash('sha256')
      .update(index + timestamp + JSON.stringify(data) + previousHash + nonce)
      .digest('hex');
  }

  // Proof of work
  async mineBlock(index, timestamp, data, previousHash) {
    let nonce = 0;
    let hash = this.calculateHash(index, timestamp, data, previousHash, nonce);

    while (!hash.startsWith('0'.repeat(this.difficulty))) {
      nonce++;
      hash = this.calculateHash(index, timestamp, data, previousHash, nonce);
    }

    return { hash, nonce };
  }

  // Get latest block
  async getLatestBlock() {
    const latestBlock = await Block.findOne().sort({ index: -1 });
    return latestBlock;
  }

  // Add new block
  async addBlock(data, transactionId = null) {
    const latestBlock = await this.getLatestBlock();
    const index = latestBlock ? latestBlock.index + 1 : 0;
    const timestamp = new Date();
    const previousHash = latestBlock ? latestBlock.hash : '0';

    const { hash, nonce } = await this.mineBlock(index, timestamp, data, previousHash);

    const newBlock = new Block({
      index,
      timestamp,
      data,
      previousHash,
      hash,
      nonce,
      transactionId
    });

    await newBlock.save();
    return newBlock;
  }

  // Verify blockchain integrity
  async verifyChain() {
    const blocks = await Block.find().sort({ index: 1 });

    for (let i = 1; i < blocks.length; i++) {
      const currentBlock = blocks[i];
      const previousBlock = blocks[i - 1];

      // Recalculate hash
      const calculatedHash = this.calculateHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.data,
        currentBlock.previousHash,
        currentBlock.nonce
      );

      // Check if hash is valid
      if (currentBlock.hash !== calculatedHash) {
        return { valid: false, error: `Invalid hash at block ${i}` };
      }

      // Check if previous hash matches
      if (currentBlock.previousHash !== previousBlock.hash) {
        return { valid: false, error: `Invalid chain at block ${i}` };
      }
    }

    return { valid: true, message: 'Blockchain is valid' };
  }

  // Get blockchain history
  async getBlockchain() {
    return await Block.find().sort({ index: 1 }).populate('transactionId');
  }

  // Get block by transaction
  async getBlockByTransaction(transactionId) {
    return await Block.findOne({ transactionId });
  }
}

module.exports = new Blockchain();
