'use client'
import React, { createContext, useContext, useRef } from 'react'
import { Terminal as XTerminal } from 'xterm'

const TerminalContext = createContext<{ current: XTerminal | null } | null>(null)

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const term = useRef<XTerminal | null>(null)

  return <TerminalContext.Provider value={term}>{children}</TerminalContext.Provider>
}

export function useTerminal() {
  return useContext(TerminalContext)
}
