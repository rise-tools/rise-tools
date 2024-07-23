import fs from 'fs'
import path from 'path'

export function isProcessRunning() {
  const file = path.join(process.cwd(), '.rise', 'process.pid')
  const pid = process.ppid.toString()
  if (fs.existsSync(file)) {
    const isSameProcess = fs.readFileSync(file, { encoding: 'utf-8' }) === pid
    if (!isSameProcess) fs.writeFileSync(file, pid)
    return isSameProcess
  } else {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, pid)
    return false
  }
}
