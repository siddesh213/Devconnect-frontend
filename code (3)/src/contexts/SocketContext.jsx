import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '../utils/constants';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // ✅ Production-ready socket configuration
    const socketURL = BASE_URL || "https://devconnect-bacckend-1ive-1.onrender.com";
    
    console.log(`🔌 Connecting to WebSocket at: ${socketURL}`);

    const newSocket = io(socketURL, {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'], // Fallback for deployment
      upgrade: true,
      rememberUpgrade: true,
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected from server:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setConnectionError(error.message);
    });

    newSocket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      setConnectionError(error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinRoom = (userId) => {
    if (socket && isConnected) {
      socket.emit('join', userId);
      console.log(`Joined room: ${userId}`);
    } else {
      console.warn('Socket not connected');
    }
  };

  const sendConnectionRequest = (fromUserId, toUserId) => {
    if (socket && isConnected) {
      socket.emit('send-connection-request', { fromUserId, toUserId });
    } else {
      console.warn('Socket not connected - cannot send connection request');
    }
  };

  const acceptConnection = (fromUserId, toUserId) => {
    if (socket && isConnected) {
      socket.emit('accept-connection', { fromUserId, toUserId });
    } else {
      console.warn('Socket not connected - cannot accept connection');
    }
  };

  const value = {
    socket,
    isConnected,
    connectionError,
    joinRoom,
    sendConnectionRequest,
    acceptConnection,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};