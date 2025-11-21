  /**
 * useWebSocket Hook
 * React hook untuk menggunakan WebSocket dengan mudah
 */

import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { wsService } from '../services/websocket';

export function useWebSocket() {
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('access_token');
      if (token) {
        console.log('🔌 useWebSocket: Connecting...');
        wsService.connect(token);
      } else {
        console.warn('⚠️ useWebSocket: No token found');
      }
    }
  }, [isAuthenticated]);

  const subscribe = useCallback((event, callback) => {
    wsService.on(event, callback);
    return () => wsService.off(event, callback);
  }, []);

  const send = useCallback((data) => {
    wsService.send(data);
  }, []);

  return { subscribe, send, isConnected: wsService.isConnected() };
}
