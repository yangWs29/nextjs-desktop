'use client'
import React, { useRef, useEffect } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

interface VideoProps {
  src: string
  type?: string // 可选类型，如 'application/x-mpegURL' 或 'video/mp4'
}

const VideoPlayer: React.FC<VideoProps> = ({ src, type = 'video/mp4' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<any>(null)

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

    // 初始化 player
    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current, options, () => {
        console.log('Player is ready')
      })
    }

    // 更新 source
    playerRef.current.src(options.sources)

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [src, type])

  return (
    <video
      ref={videoRef}
      className="video-js vjs-big-play-centered"
      controls
      style={{ width: '100%', height: '80vh' }}
    />
  )
}

export default VideoPlayer
