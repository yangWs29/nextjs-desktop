import { Socket } from 'socket.io-client'
import io from 'socket.io-client'

let socket: typeof Socket

export const connectSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '/', {
      // path: '/explorer/api/socket',
      path: '/api/terminal-socket',
      // transports: ['websocket'],
      reconnection: true,
    })
  }
  return socket
}

export const getSocket = () => {
  if (!socket) throw new Error('Socket not initialized')
  return socket
}
