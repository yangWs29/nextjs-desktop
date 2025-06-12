import { Server } from 'socket.io'
import { spawn } from 'node-pty'
import { join } from 'path'
import { app_config } from '@/app-config.mjs'
import { quote } from 'shell-quote'

const SocketHandler = (req: any, res: any) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io')
    const io = new Server(res.socket.server, { path: '/api/terminal-socket', addTrailingSlash: false })

    io.on('connection', (socket) => {
      const pty = spawn('sh', [], { name: 'xterm-color', cwd: process.cwd() })

      pty.onData((data) => {
        socket.emit('terminal-output', data)
      })

      socket.on('change-directory', ({ path }) => {
        const dir_path = join(app_config.explorer_base_path, path || '')

        console.log(`Changing directory to ${dir_path}`)
        pty.write('\x03') // 发送 Ctrl+C 取消当前操作
        setTimeout(() => {
          pty.write(`cd "${quote([dir_path])}"\n`) // 执行 cd 命令
        }, 100)
      })

      // 监听 reset-terminal-size 事件，并重置终端大小
      socket.on('reset-terminal-size', (data: { cols: number; rows: number }) => {
        pty.resize(data.cols, data.rows)
      })

      socket.on('terminal-input', (data) => {
        pty.write(data)
      })

      socket.on('terminal-cmd', (data: string[]) => {
        pty.write('\x03')
        setTimeout(() => {
          pty.write(quote(data))
        }, 100)
      })

      socket.on('disconnect', () => {
        pty.kill()
      })
    })

    res.socket.server.io = io
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default SocketHandler
