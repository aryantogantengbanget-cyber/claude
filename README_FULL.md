# 🌾 AgriSmart AI - Complete Agriculture Platform with 3D AI Assistant

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-orange)](https://threejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)](https://www.mongodb.com/)

## 📋 Overview

AgriSmart AI is a comprehensive agriculture platform for Indonesian farmers, featuring:
- **3D AI Virtual Assistant** with custom avatar and voice interaction
- **RAG (Retrieval Augmented Generation)** powered by agriculture knowledge base (Kakao, Palm Oil, Coconut)
- **E-commerce Marketplace** for buying/selling agricultural products
- **Payment Integration** with Midtrans (Indonesian payment gateway)
- **Offline Blockchain** for transaction tracking and transparency
- **IoT Sensor Dashboard** for real-time monitoring
- **User Authentication** with JWT

---

## 🎯 Key Features

### 1. 🤖 3D AI Virtual Assistant
- Custom-built 3D humanoid avatar with animations
- Text and voice chat interface (Indonesian language)
- RAG-powered responses using agriculture PDF knowledge base
- Real-time voice synthesis
- Interactive 3D scene with React Three Fiber

### 2. 📚 RAG System
- PDF document processing for agriculture knowledge
- Vector-based semantic search
- Knowledge base includes:
  - Kakao (Cocoa) cultivation in Indonesia
  - Kelapa Sawit (Palm Oil) plantation guide
  - Kelapa (Coconut) farming techniques
- Integration with OpenAI (optional) for enhanced responses

### 3. 🛒 E-commerce Marketplace
- Product listings (Kakao, Palm Oil, Coconut, Seeds, Equipment, Fertilizer)
- Shopping cart functionality
- Product search and filtering
- Seller and buyer accounts
- Product ratings and reviews

### 4. 💳 Payment System
- Midtrans payment gateway integration
- Multiple payment methods:
  - Bank Transfer
  - GoPay, OVO, DANA
  - Credit Card
  - QRIS
- Secure transaction handling

### 5. ⛓️ Offline Blockchain
- Transaction immutability
- Proof-of-work mining
- Blockchain verification
- Transaction transparency
- Distributed ledger for agriculture supply chain

### 6. 🌡️ IoT Sensor Dashboard
- Real-time sensor data visualization
- Temperature, Humidity, Soil Moisture monitoring
- Rover and Drone integration
- WebSocket for live updates
- AI-powered recommendations based on sensor data

### 7. 🔐 Authentication System
- User registration and login
- JWT token-based authentication
- Role-based access (Farmer, Buyer, Admin)
- Secure password hashing with bcrypt

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **3D Graphics**: Three.js + React Three Fiber + Drei
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + bcryptjs
- **Payment**: Midtrans Client
- **Real-time**: Socket.IO
- **AI/ML**: OpenAI API (optional)
- **PDF Processing**: pdf-parse

### DevOps
- **Process Manager**: Nodemon
- **Concurrent Tasks**: Concurrently
- **Environment**: dotenv

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd claude
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/agriculture-ai

# JWT Secret (Change in production!)
JWT_SECRET=your-secure-random-secret-key-here

# OpenAI (Optional - for better AI responses)
OPENAI_API_KEY=sk-your-openai-key-here

# Midtrans Payment Gateway
# Get sandbox keys from https://dashboard.sandbox.midtrans.com/
MIDTRANS_SERVER_KEY=SB-Mid-server-YOUR_KEY_HERE
MIDTRANS_CLIENT_KEY=SB-Mid-client-YOUR_KEY_HERE
```

### Step 4: Initialize RAG System
```bash
npm run init-rag
```

This will load all agriculture PDF documents into the RAG vector database.

### Step 5: Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

### Step 6: Run Application

#### Option A: Run Frontend and Backend Separately
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

#### Option B: Run Everything Concurrently
```bash
npm run dev:all
```

### Step 7: Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

---

## 📱 Application Pages

### Public Pages
- **Landing Page**: `/` - Overview and features
- **Login**: `/auth/login` - User authentication
- **Register**: `/auth/register` - New user registration

### Protected Pages
- **Dashboard**: `/dashboard` - Main sensor monitoring dashboard
- **AI Assistant**: `/ai-assistant` - 3D AI chatbot for agriculture Q&A
- **Marketplace**: `/marketplace` - Product listings
- **Shopping Cart**: `/marketplace/cart` - Checkout and payment
- **Sensor Dashboard**: Real-time IoT data visualization

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login user
GET  /api/auth/me        - Get current user
PUT  /api/auth/profile   - Update profile
```

### Products
```
GET    /api/products           - Get all products
GET    /api/products/:id       - Get product details
POST   /api/products           - Create product (auth)
PUT    /api/products/:id       - Update product (auth)
DELETE /api/products/:id       - Delete product (auth)
POST   /api/products/:id/reviews - Add review (auth)
```

### AI Assistant
```
POST /api/ai/query      - Query RAG system
POST /api/ai/recommend  - Get AI recommendations
POST /api/ai/chat       - Chat with AI
```

### Payment
```
POST /api/payment/create           - Create transaction
POST /api/payment/notification     - Midtrans webhook
GET  /api/payment/transactions     - Get user transactions
GET  /api/payment/transactions/:id - Get transaction details
```

### Blockchain
```
GET  /api/blockchain              - Get entire blockchain
GET  /api/blockchain/verify       - Verify blockchain integrity
GET  /api/blockchain/block/:index - Get block by index
GET  /api/blockchain/latest/:count - Get latest blocks
POST /api/blockchain/init         - Initialize genesis block
```

### Sensors
```
GET  /api/sensors              - Get all sensors
GET  /api/sensors/:deviceId    - Get sensor details
POST /api/sensors              - Register new sensor
POST /api/sensors/:deviceId/readings - Add sensor reading
GET  /api/sensors/:deviceId/stats    - Get sensor statistics
```

---

## 🎨 Features Showcase

### 1. 3D AI Avatar
The custom 3D avatar is built with:
- Geometric primitives (spheres, cylinders, boxes)
- Smooth animations (floating, head rotation, blinking)
- Talking animation synchronized with speech
- Interactive camera controls
- Beautiful lighting and particle effects

### 2. RAG Knowledge Base
Comprehensive agriculture guides:
- **Kakao**: Optimal conditions, planting, fertilization, pests, harvesting
- **Kelapa Sawit**: Climate requirements, cultivation, productivity, economics
- **Kelapa**: Varieties, planting, maintenance, products, sustainability

### 3. Marketplace Features
- Product categories and filtering
- Real-time search
- Shopping cart with quantity controls
- Shipping address management
- Multiple payment methods
- Order tracking

### 4. Blockchain Transparency
- Each transaction creates a block
- Proof-of-work mining (difficulty 2)
- SHA-256 hashing
- Chain verification
- Immutable transaction history

---

## 🔧 Development

### Adding New Products (via API)
```javascript
const token = 'your-jwt-token';

fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Kakao Premium Grade A',
    category: 'kakao',
    price: 45000,
    unit: 'kg',
    stock: 1000,
    description: 'Kakao fermentasi berkualitas tinggi',
    location: {
      province: 'Sulawesi Selatan',
      city: 'Makassar'
    },
    quality: 'premium'
  })
});
```

### Registering IoT Sensors
```javascript
const token = 'your-jwt-token';

fetch('http://localhost:5000/api/sensors', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    deviceId: 'ROVER-001',
    type: 'rover',
    location: 'Kebun A - Blok 1'
  })
});

// Send sensor readings
fetch('http://localhost:5000/api/sensors/ROVER-001/readings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    temperature: 28.5,
    humidity: 75,
    soilMoisture: 60,
    lightIntensity: 800,
    pH: 6.5,
    nitrogen: 25,
    phosphorus: 20,
    potassium: 30
  })
});
```

---

## 📚 Knowledge Base (RAG)

The RAG system includes comprehensive guides on:

### Kakao (Cocoa)
- Optimal growing conditions
- Planting techniques
- Fertilization schedules
- Pest and disease management
- Harvesting and post-harvest processing
- Productivity optimization

### Kelapa Sawit (Palm Oil)
- Climate and soil requirements
- Nursery management
- Land preparation
- Planting density
- Maintenance practices
- Harvesting standards
- Economic analysis

### Kelapa (Coconut)
- Coconut varieties
- Seed selection
- Planting systems
- Fertilization programs
- Pest control
- Harvesting methods
- Product diversification

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Railway/Heroku)
```bash
# Add Procfile
web: node server/index.js

# Deploy
git push heroku main
```

### Database (MongoDB Atlas)
1. Create cluster at https://cloud.mongodb.com
2. Get connection string
3. Update `MONGODB_URI` in `.env`

---

## 🔒 Security Best Practices

1. **Change JWT Secret** in production
2. **Use HTTPS** for all endpoints
3. **Validate user input** on both frontend and backend
4. **Rate limit** API endpoints
5. **Sanitize MongoDB queries**
6. **Use environment variables** for sensitive data
7. **Implement CORS** properly
8. **Hash passwords** with bcrypt (salt rounds: 10)

---

## 🧪 Testing

### Test RAG System
```bash
npm run init-rag
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test User"}'
```

---

## 📖 User Guide

### For Farmers:
1. **Register** as a farmer
2. **Add products** to sell
3. **Monitor sensors** via dashboard
4. **Ask AI assistant** for farming advice
5. **Track transactions** on blockchain

### For Buyers:
1. **Register** as a buyer
2. **Browse marketplace** products
3. **Add to cart** and checkout
4. **Pay via Midtrans** (multiple methods)
5. **Track orders**

### For Admins:
1. **Manage users** and products
2. **Verify blockchain** integrity
3. **Monitor system** health
4. **Approve certifications**

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this for your agriculture projects!

---

## 👨‍💻 Credits

Built with ❤️ for Indonesian agriculture using:
- Next.js, React, Three.js
- Node.js, Express, MongoDB
- OpenAI, Midtrans
- Socket.IO, JWT, bcrypt

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@agrismart.ai
- Documentation: [Full Guide](./docs/)

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Machine learning model for yield prediction
- [ ] Weather API integration
- [ ] Drone image analysis
- [ ] Multi-language support
- [ ] Export data to Excel/PDF
- [ ] Cooperative features
- [ ] Insurance integration
- [ ] Government subsidy integration

---

**AgriSmart AI** - Bringing technology to Indonesian agriculture for a more productive and sustainable future. 🌾🚀
