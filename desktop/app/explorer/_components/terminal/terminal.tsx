'use client'
import { useEffect, useRef } from 'react'
import { Terminal as XTerminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { connectSocket } from '@/app/explorer/_utils/socket'
import { useTerminal } from '@/app/explorer/_components/terminal/terminal-context'

export default function Terminal({ currentPath }: { currentPath: string }) {
  const terminalRef = useRef<HTMLDivElement>(null)
  // const terminal = useRef<XTerminal | null>(null)
  const terminal = useTerminal()

  useEffect(() => {
    if (!terminalRef.current) return

    const term = new XTerminal({
      cursorBlink: true,
      fontFamily: 'monospace',
      fontSize: 14,
    })

    const container = terminalRef.current

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(container)

    // 延迟执行 fit()，确保 DOM 尺寸已计算好
    requestAnimationFrame(() => {
      socket.emit('change-directory', { path: currentPath })

      fitAddon.fit()

      socket.emit('reset-terminal-size', { cols: term.cols, rows: term.rows })
    })

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit()
    })

    resizeObserver.observe(container)

    term.focus()

    const socket = connectSocket()

    term.onData((data) => {
      socket.emit('terminal-input', data)
    })

    socket.on('terminal-output', (data: any) => {
      term.write(data)
    })

    //监听 socket.emit('terminal-error', 'Failed to resize terminal')
    socket.on('terminal-error', (error: any) => {
      console.log(error)
    })

    terminal && (terminal.current = term)

    return () => {
      resizeObserver.unobserve(container!)
      socket.off('terminal-output')
      term.dispose()
    }
  }, [])

  return <div id="terminal" style={{ display: 'flex', flex: '1', overflow: 'hidden' }} ref={terminalRef} />
}
