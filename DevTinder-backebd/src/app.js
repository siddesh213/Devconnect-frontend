require('dotenv').config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");

const { conncectdb } = require("./config/database");

const { authRouter } = require("./Routers/Auth");
const { ProfileRouter } = require("./Routers/profile");
const { RequestRouter } = require("./Routers/sendrequest");
const { getuserrequest } = require("./Routers/getuserrequest");

const app = express();

const PORT = process.env.PORT || 3001;

// ✅ Configure allowed origins for CORS & WebSocket
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.PRODUCTION_FRONTEND_URL,
].filter(Boolean); // Remove undefined values

const server = createServer(app);

// ✅ WebSocket configuration with fallback transports for better deployment compatibility
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps)
      if (!origin) {
        return callback(null, true);
      }

      // In development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // In production, check allowedOrigins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS rejected origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ['websocket', 'polling'], // Fallback for deployment environments
  pingInterval: 25000,
  pingTimeout: 60000,
});

// ✅ Express CORS middleware
const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
};

if (process.env.NODE_ENV !== 'production') {
  corsOptions.origin = true; // Allow all origins in development
} else {
  corsOptions.origin = function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  };
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/", authRouter);
app.use("/", ProfileRouter);
app.use("/", RequestRouter);
app.use("/", getuserrequest);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  
  // Store userId-to-socketId mapping for tracking
  let connectedUserId = null;

  // Join user to their own room for private messages
  socket.on('join', (userId) => {
    connectedUserId = userId;
    const userIdString = userId.toString(); // Convert ObjectId to string
    
    socket.join(userIdString);
    console.log(`👤 User ${userIdString} joined room. Socket ID: ${socket.id}`);
    console.log(`📋 Socket rooms:`, socket.rooms);
  });

  // ✅ SEND MESSAGE
  socket.on('send-message', (data) => {
    const { fromUserId, toUserId, message, timestamp } = data;
    
    const fromUserIdString = fromUserId.toString();
    const toUserIdString = toUserId.toString();
    
    console.log(`\n💬 ===== MESSAGE EVENT =====`);
    console.log(`📤 Message from: ${fromUserIdString}`);
    console.log(`📥 Message to: ${toUserIdString}`);
    console.log(`📝 Message: "${message}"`);
    console.log(`🔍 Sending to room: ${toUserIdString}`);
    console.log(`📋 Active rooms on this socket:`, socket.rooms);

    // Send message to recipient's room
    io.to(toUserIdString).emit('receive-message', {
      fromUserId: fromUserIdString,
      toUserId: toUserIdString,
      message,
      timestamp: timestamp || new Date(),
    });
    
    console.log(`✅ Message emitted to room: ${toUserIdString}`);

    // Also send back to sender for confirmation
    socket.emit('message-sent', {
      success: true,
      message: message,
      timestamp: timestamp || new Date(),
    });
    
    console.log(`💬 ===== END MESSAGE =====\n`);
  });

  // Handle connection requests
  socket.on('send-connection-request', (data) => {
    const { fromUserId, toUserId } = data;
    console.log(`🤝 Connection request from ${fromUserId} to ${toUserId}`);
    
    // Notify the recipient
    io.to(toUserId.toString()).emit('connection-request-received', {
      fromUserId,
      message: 'You have a new connection request!'
    });
  });

  // Handle connection acceptance
  socket.on('accept-connection', (data) => {
    const { fromUserId, toUserId } = data;
    
    // Notify both users
    io.to(fromUserId.toString()).emit('connection-accepted', {
      fromUserId: toUserId,
      message: 'Your connection request was accepted!'
    });
    io.to(toUserId.toString()).emit('connection-accepted', {
      fromUserId,
      message: 'Connection request accepted!'
    });
  });

  socket.on('disconnect', () => {
    console.log('⚠️ User disconnected:', socket.id);
    if (connectedUserId) {
      console.log(`👤 User ${connectedUserId} disconnected`);
    }
  });
});

// ✅ Health check endpoint (useful for monitoring services)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// ✅ Root API endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "✅ DevTinder Backend API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
  });
});

// ✅ Start server
conncectdb().then(() => {
  console.log("✅ Database connected");
  server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║    🚀 DevTinder Server Started         ║
╠════════════════════════════════════════╣
║  Server: http://localhost:${PORT}       
║  Environment: ${process.env.NODE_ENV || 'development'}
║  WebSocket: Enabled (WebSocket + Poll) ║
╚════════════════════════════════════════╝
    `);
  });
}).catch(err => {
  console.error("❌ Database connection failed:", err.message);
  process.exit(1);
});
