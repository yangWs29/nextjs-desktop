import { exec } from 'child_process'
import util from 'util'
import path from 'path'
import { app_config } from '@/app-config.mjs'

const execAsync = util.promisify(exec)

export const checkDiskUsage = async (dir: string = '/'): Promise<{ total: number; free: number }> => {
  if (process.platform === 'win32') {
    // Windows 保持不变
    const { stdout } = await execAsync(
      `wmic logicaldisk where DeviceID="%SystemDrive%" get FreeSpace,Size /format:value`,
    )
    const lines = stdout.trim().split(/\r?\n/)
    const size = parseInt(lines[0].split('=')[1], 10)
    const free = parseInt(lines[1].split('=')[1], 10)
    return { total: size, free }
  } else {
    // 使用 df 直接查询当前路径所在的挂载点
    const fullPath = path.join(app_config.explorer_base_path, dir)
    const { stdout } = await execAsync(`df -k "${fullPath}"`)

    console.log(`df -kh "${fullPath}"`)

    const lines = stdout.trim().split(/\r?\n/)
    if (lines.length < 2) {
      throw new Error('无法获取磁盘信息')
    }

    const cols = lines[1].trim().split(/\s+/)
    // 格式：Filesystem 1K-blocks Used Available Use% Mounted on
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
