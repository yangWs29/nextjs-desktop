'use client'
import dynamic from 'next/dynamic'

const TerminalClient = dynamic(() => import('@/app/explorer/terminal'), { ssr: false })

export default TerminalClient
