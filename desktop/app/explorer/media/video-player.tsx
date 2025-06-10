'use client'
import React, { useRef, useEffect } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

interface VideoProps {
  src: string
  type?: string
}

const VideoPlayer: React.FC<VideoProps> = ({ src, type = 'video/mp4' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<any>(null)

  // 快捷键处理函数
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!playerRef.current) return

    const player = playerRef.current
    const isPaused = player.paused()

    switch (e.key) {
      case 'ArrowLeft': // ← 快退 5 秒
        e.preventDefault()
        player.currentTime(Math.max(0, player.currentTime() - 5))
        break

      case 'ArrowRight': // → 快进 5 秒
        e.preventDefault()
        player.currentTime(player.currentTime() + 5)
        break

      case ',': // 上一帧（需暂停）
        e.preventDefault()
        if (!isPaused) {
          player.pause()
        }

        player.currentTime(Math.max(0, player.currentTime() - 0.04)) // 约一帧（24fps）
        break

      case '.': // 下一帧（需暂停）
        e.preventDefault()
        if (!isPaused) {
          player.pause()
        }

        player.currentTime(player.currentTime() + 0.04) // 约一帧
        break

      case ' ': // 空格键 播放/暂停切换
        e.preventDefault()
        if (isPaused) {
          player.play()
        } else {
          player.pause()
        }
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (!videoRef.current) return

    const options = {
      html5: {
        hls: {
          overrideNative: true,
        },
      },
      sources: [
        {
          src,
          type,
        },
      ],
    }

    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current, options, () => {
        console.log('Player is ready')
      })
    } else {
      playerRef.current.src(options.sources)
    }

    // 添加键盘事件监听
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [src, type])

  return (
    <video
      ref={videoRef}
      className="video-js vjs-big-play-centered"
      controls
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default VideoPlayer
