import { Server } from 'socket.io'
import { spawn } from 'node-pty'
import { join } from 'path'
import { app_config } from '@/app-config.mjs'
import { existsSync } from 'node:fs'

const SocketHandler = (req: any, res: any) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io')
    const io = new Server(res.socket.server, { path: '/api/terminal-socket', addTrailingSlash: false })

    io.on('connection', (socket) => {
      const shell =
        process.platform === 'win32' ? 'cmd' : existsSync('/bin/zsh') ? 'zsh' : existsSync('/bin/bash') ? 'bash' : 'sh'

      const pty = spawn(shell, [], { name: 'xterm-color', cols: 80, rows: 24, cwd: process.env.HOME })

      pty.onData((data) => {
        socket.emit('terminal-output', data)
      })

      socket.on('change-directory', ({ path }) => {
        const dir_path = join(app_config.explorer_base_path, path || '')

        console.log(`Changing directory to ${dir_path}`)
        pty.write(`cd "${dir_path}"\n`) // 模拟用户输入 cd 命令
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
