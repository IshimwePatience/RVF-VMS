require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { sequelize } = require('./models');
const { authenticate } = require('./middleware/auth.middleware');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Routes

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const stockRoutes = require('./routes/stock.routes');
const supplierRoutes = require('./routes/supplier.routes');
const vaccineRoutes = require('./routes/vaccine.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const requestRoutes = require('./routes/request.routes');
const transferRoutes = require('./routes/transfer.routes');
const reportRoutes = require('./routes/report.routes');
const settingsRoutes = require('./routes/settings.routes');
const administrationRoutes = require('./routes/administration.routes');
const notificationRoutes = require('./routes/notification.routes');
const searchRoutes = require('./routes/search.routes');
const veterinaryRoutes = require('./routes/veterinary.routes');
const veterinaryPortalRoutes = require('./routes/veterinaryPortal.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/vaccines', vaccineRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/administrations', administrationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/veterinaries', veterinaryRoutes);
app.use('/api/veterinary-portal', veterinaryPortalRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RVF VMS API is running' });
});

// WebSocket Connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-key');
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username}`);
  
  // Join a room specific to this user for direct notifications
  socket.join(`user_${socket.user.id}`);

  // Join a room specific to their stock_id to receive targeted notifications
  if (socket.user.stock_id) {
    socket.join(`stock_${socket.user.stock_id}`);
  }

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.username}`);
  });
});

// Pass io to request context
app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Sync DB
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
    
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
