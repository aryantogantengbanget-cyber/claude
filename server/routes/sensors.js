const express = require('express');
const Sensor = require('../models/Sensor');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all sensors for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sensors = await Sensor.find({ owner: req.userId });
    res.json(sensors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sensors' });
  }
});

// Get single sensor
router.get('/:deviceId', authMiddleware, async (req, res) => {
  try {
    const sensor = await Sensor.findOne({
      deviceId: req.params.deviceId,
      owner: req.userId
    });

    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }

    res.json(sensor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sensor' });
  }
});

// Register new sensor
router.post('/', authMiddleware, async (req, res) => {
  try {
    const sensor = new Sensor({
      ...req.body,
      owner: req.userId
    });

    await sensor.save();
    res.status(201).json(sensor);
  } catch (error) {
    console.error('Register sensor error:', error);
    res.status(500).json({ error: 'Failed to register sensor' });
  }
});

// Add sensor reading
router.post('/:deviceId/readings', authMiddleware, async (req, res) => {
  try {
    const sensor = await Sensor.findOne({
      deviceId: req.params.deviceId,
      owner: req.userId
    });

    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }

    sensor.readings.push(req.body);
    sensor.lastActive = new Date();

    // Keep only last 1000 readings
    if (sensor.readings.length > 1000) {
      sensor.readings = sensor.readings.slice(-1000);
    }

    await sensor.save();

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    io.emit('sensor-data', {
      deviceId: sensor.deviceId,
      reading: req.body,
      timestamp: new Date()
    });

    res.json(sensor);
  } catch (error) {
    console.error('Add reading error:', error);
    res.status(500).json({ error: 'Failed to add reading' });
  }
});

// Get sensor statistics
router.get('/:deviceId/stats', authMiddleware, async (req, res) => {
  try {
    const sensor = await Sensor.findOne({
      deviceId: req.params.deviceId,
      owner: req.userId
    });

    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }

    const readings = sensor.readings.slice(-100); // Last 100 readings

    const stats = {
      temperature: calculateStats(readings.map(r => r.temperature)),
      humidity: calculateStats(readings.map(r => r.humidity)),
      soilMoisture: calculateStats(readings.map(r => r.soilMoisture)),
      lightIntensity: calculateStats(readings.map(r => r.lightIntensity)),
      totalReadings: sensor.readings.length,
      lastReading: readings[readings.length - 1]
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

function calculateStats(values) {
  const filtered = values.filter(v => v != null);
  if (filtered.length === 0) return null;

  const sum = filtered.reduce((a, b) => a + b, 0);
  const avg = sum / filtered.length;
  const min = Math.min(...filtered);
  const max = Math.max(...filtered);

  return { avg, min, max };
}

module.exports = router;
