'use client'
import dynamic from 'next/dynamic'

const TerminalClient = dynamic(() => import('@/app/explorer/_components/terminal/terminal'), { ssr: false })

export default TerminalClient
