const express = require('express');
const midtransClient = require('midtrans-client');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const blockchain = require('../utils/blockchain');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Initialize Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-DUMMY',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-DUMMY'
});

// Create transaction and payment
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod } = req.body;

    // Validate products and calculate total
    let totalAmount = 0;
    const productDetails = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product || product.status !== 'active') {
        return res.status(400).json({ error: `Product ${item.productId} not available` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      productDetails.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });
    }

    // Create order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get buyer info
    const buyer = await User.findById(req.userId);

    // Create transaction
    const transaction = new Transaction({
      orderId,
      buyer: req.userId,
      seller: productDetails[0].product.seller, // First product's seller
      products: productDetails,
      totalAmount,
      paymentMethod,
      shippingAddress
    });

    // Create Midtrans payment
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: buyer.name,
        email: buyer.email,
        phone: buyer.phone
      },
      item_details: await Promise.all(productDetails.map(async (detail) => {
        const product = await Product.findById(detail.product);
        return {
          id: product._id.toString(),
          price: detail.price,
          quantity: detail.quantity,
          name: product.name
        };
      }))
    };

    const midtransTransaction = await snap.createTransaction(parameter);

    transaction.midtransToken = midtransTransaction.token;
    transaction.midtransOrderId = orderId;
    await transaction.save();

    // Add to blockchain
    const block = await blockchain.addBlock({
      type: 'transaction_created',
      orderId,
      buyer: req.userId,
      totalAmount,
      timestamp: new Date()
    }, transaction._id);

    transaction.blockchainHash = block.hash;
    await transaction.save();

    res.json({
      transaction,
      paymentUrl: midtransTransaction.redirect_url,
      token: midtransTransaction.token
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Midtrans notification webhook
router.post('/notification', async (req, res) => {
  try {
    const notification = req.body;

    const statusResponse = await snap.transaction.notification(notification);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    const transaction = await Transaction.findOne({ midtransOrderId: orderId });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        transaction.paymentStatus = 'paid';
      }
    } else if (transactionStatus === 'settlement') {
      transaction.paymentStatus = 'paid';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      transaction.paymentStatus = 'failed';
    } else if (transactionStatus === 'pending') {
      transaction.paymentStatus = 'pending';
    }

    transaction.updatedAt = new Date();
    await transaction.save();

    // Add payment status to blockchain
    if (transaction.paymentStatus === 'paid') {
      await blockchain.addBlock({
        type: 'payment_completed',
        orderId,
        status: 'paid',
        timestamp: new Date()
      }, transaction._id);

      // Update product stock
      for (const item of transaction.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Payment notification error:', error);
    res.status(500).json({ error: 'Failed to process notification' });
  }
});

// Get user transactions
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ buyer: req.userId })
      .populate('products.product')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Get single transaction
router.get('/transactions/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      $or: [{ buyer: req.userId }, { seller: req.userId }]
    })
      .populate('products.product')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Get blockchain info
    const block = await blockchain.getBlockByTransaction(transaction._id);

    res.json({
      transaction,
      blockchain: block ? {
        hash: block.hash,
        index: block.index,
        timestamp: block.timestamp
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get transaction' });
  }
});

module.exports = router;
