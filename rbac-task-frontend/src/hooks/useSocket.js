import { useEffect } from 'react';

export default function useSocket(onNotification) {
  useEffect(() => {
    const socket = window._socket;
    if (!socket) return;
    const handler = (payload) => onNotification && onNotification(payload);
    socket.on('notification', handler);
    return () => socket.off('notification', handler);
  }, [onNotification]);
}
