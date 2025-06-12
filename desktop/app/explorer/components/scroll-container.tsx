'use client'
import React, { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// 自定义 Hook
function useScrollRestore(containerId: string, deps: any[] = []) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 恢复滚动位置
    const savedPosition = sessionStorage.getItem(`scrollPos_${containerId}`)
    if (savedPosition) {
      container.scrollTop = parseInt(savedPosition)
    }

    // 监听滚动事件
    const handleScroll = () => {
      sessionStorage.setItem(`scrollPos_${containerId}`, String(container.scrollTop))
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, deps)

  return containerRef
}

export function ScrollContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '10086'
  const scrollRef = useScrollRestore(pathname, [pathname])

  return (
    <div ref={scrollRef} style={{ flex: 1, overflow: 'auto' }}>
      {children}
    </div>
  )
}
