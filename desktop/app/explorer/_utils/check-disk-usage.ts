import { exec } from 'child_process'
import util from 'util'
import path from 'path'
import { app_config } from '@/app-config.mjs'

const execAsync = util.promisify(exec)

export type MountPointInfo = {
  filesystem: string
  size: string
  used: string
  avail: string
  usePercent: string
  mountedOn: string
}

/**
 * 获取所有挂载点信息
 */
export const getAllMountPoints = async (): Promise<MountPointInfo[]> => {
  if (process.platform === 'win32') {
    return []
  }

  const { stdout } = await execAsync(`df`)
  const lines = stdout.trim().split(/\r?\n/)
  // const headers = lines[0].split(/\s+/)
  const dataLines = lines.slice(1)

  return dataLines.map((line) => {
    const cols = line.trim().split(/\s+/)
    return {
      filesystem: cols[0],
      size: cols[1],
      used: cols[2],
      avail: cols[3],
      usePercent: cols[4],
      mountedOn: cols[5],
    }
  })
}

/**
 * 获取指定挂载点的磁盘信息
 * @param mountPoint 挂载点路径，如 '/' 或 '/home/node/mnt/hdd-cache'
 */
export const getMountPointInfo = async (mountPoint: string): Promise<MountPointInfo | null> => {
  const mountPoints = await getAllMountPoints()

  // 先尝试查找非根目录匹配
  const nonRootMountPoints = mountPoints.filter((mp) => mp.mountedOn !== '/')
  const matched = nonRootMountPoints
    .filter((mp) => mountPoint.startsWith(mp.mountedOn))
    .reduce(
      (bestMatch, current) => {
        return bestMatch ? (current.mountedOn.length > bestMatch.mountedOn.length ? current : bestMatch) : current
      },
      null as MountPointInfo | null,
    )
  // 如果没有找到匹配项，则使用根目录信息
  return matched || mountPoints.find((mp) => mp.mountedOn === '/') || null
}

/**
 * 获取当前路径所在挂载点的空间（兼容旧逻辑）
 */
export const checkDiskUsage = async (dir: string = '/'): Promise<{ total: number; free: number }> => {
  if (process.platform === 'win32') {
    const { stdout } = await execAsync(
      `wmic logicaldisk where DeviceID="%SystemDrive%" get FreeSpace,Size /format:value`,
    )
    const lines = stdout.trim().split(/\r?\n/)
    const size = parseInt(lines[0].split('=')[1], 10)
    const free = parseInt(lines[1].split('=')[1], 10)
    return { total: size, free }
  } else {
    const fullPath = path.join(app_config.explorer_base_path, dir)

    const mountPointInfo = await getMountPointInfo(fullPath)

    if (mountPointInfo) {
      return {
        total: parseInt(mountPointInfo.size, 10),
        free: parseInt(mountPointInfo.avail, 10),
      }
    }

    const { stdout } = await execAsync(`df -k "${fullPath}"`)
    const lines = stdout.trim().split(/\r?\n/)
    if (lines.length < 2) {
      throw new Error('无法获取磁盘信息')
    }

    const cols = lines[1].trim().split(/\s+/)
    const totalBlocks = parseInt(cols[1], 10)
    const freeBlocks = parseInt(cols[3], 10)

    const blockSize = 1024
    const totalBytes = totalBlocks * blockSize
    const freeBytes = freeBlocks * blockSize

    return {
      total: totalBytes,
      free: freeBytes,
    }
  }
}
