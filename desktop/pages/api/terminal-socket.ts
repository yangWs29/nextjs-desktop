import { Server } from 'socket.io'
import { spawn } from 'node-pty'
import { join } from 'path'
import { app_config } from '@/app-config.mjs'

const SocketHandler = (req: any, res: any) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io')
    const io = new Server(res.socket.server, { path: '/api/terminal-socket', addTrailingSlash: false })

    io.on('connection', (socket) => {
      const pty = spawn('sh', [], { name: 'xterm-color', cwd: process.env.HOME })

      pty.onData((data) => {
        socket.emit('terminal-output', data)
      })

      socket.on('change-directory', ({ path }) => {
        const dir_path = join(app_config.explorer_base_path, path || '')

        console.log(`Changing directory to ${dir_path}`)
        pty.write(`cd "${dir_path}"\n`) // 模拟用户输入 cd 命令
      })

      // 监听 reset-terminal-size 事件，并重置终端大小
      socket.on('reset-terminal-size', (data: { cols: number; rows: number }) => {
        pty.resize(data.cols, data.rows)
      })

      socket.on('terminal-input', (data) => {
        pty.write(data)
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
