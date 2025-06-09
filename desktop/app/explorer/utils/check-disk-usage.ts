import { exec } from 'child_process'
import util from 'util'
import path from 'path'
import { app_config } from '@/app-config.mjs'

const execAsync = util.promisify(exec)

export const checkDiskUsage = async (dir: string = '/'): Promise<{ total: number; free: number }> => {
  if (process.platform === 'win32') {
    // Windows 系统
    const { stdout: wmicOutput } = await execAsync(
      `wmic logicaldisk where DeviceID="%SystemDrive%" get FreeSpace,Size /format:value`,
    )
    const lines = wmicOutput.trim().split(/\r?\n/)
    const size = parseInt(lines[0].split('=')[1], 10)
    const free = parseInt(lines[1].split('=')[1], 10)
    return { total: size, free }
  } else {
    // Linux / macOS / BSD 系统兼容版
    const { stdout: dfOutput } = await execAsync(`df -k "${path.join(app_config.explorer_base_path, dir)}"`)
    const lines = dfOutput.trim().split(/\r?\n/)

    // 第一行是表头，从第二行开始找当前挂载点
    if (lines.length < 2) {
      throw new Error('无法获取磁盘信息')
    }

    let matchedLine: string[] | null = null

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].trim().split(/\s+/)
      const mountedOn = cols[cols.length - 1]

      // 匹配挂载点路径（处理可能的软链接或空格）
      if (mountedOn === '/' || path.join(app_config.explorer_base_path, dir).startsWith(mountedOn)) {
        matchedLine = cols
        break
      }
    }

    if (!matchedLine) {
      throw new Error(`未找到目录 ${dir} 所在的磁盘挂载点`)
    }

    // 格式：Filesystem 1K-blocks Used Available Use% Mounted on
    const totalBlocks = parseInt(matchedLine[1], 10)
    const freeBlocks = parseInt(matchedLine[3], 10) // 可用空间是第4个字段（Available）

    const blockSize = 1024
    const totalBytes = totalBlocks * blockSize
    const freeBytes = freeBlocks * blockSize

    return {
      total: totalBytes,
      free: freeBytes,
    }
  }
}
