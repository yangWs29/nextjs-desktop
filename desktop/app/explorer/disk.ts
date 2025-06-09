import { exec } from 'child_process'
import util from 'util'

const execAsync = util.promisify(exec)

export const checkDiskUsage = async (dir: string): Promise<{ total: number; free: number }> => {
  if (process.platform === 'win32') {
    const { stdout: wmicOutput } = await execAsync(
      `wmic logicaldisk where DeviceID="%SystemDrive%" get FreeSpace,Size /format:value`,
    )
    const lines = wmicOutput.trim().split(/\r?\n/)
    const size = parseInt(lines[0].split('=')[1], 10)
    const free = parseInt(lines[1].split('=')[1], 10)
    return { total: size, free }
  } else {
    const { stdout: dfOutput } = await execAsync(`df -k ${dir || '/'}`)
    const lines = dfOutput.trim().split('\n')
    const stats = lines[1].split(/\s+/)
    const total = parseInt(stats[1], 10) * 1024
    const free = parseInt(stats[3], 10) * 1024
    return { total, free }
  }
}
