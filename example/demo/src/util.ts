import fs from 'fs'
import path from 'path'

export function isProcessRunning() {
  const file = path.join(process.cwd(), '.rise', 'process.pid')
  if (fs.existsSync(file)) {
    const isSame = fs.readFileSync(file, { encoding: 'utf-8' }) === process.ppid.toString()
    if (!isSame) fs.writeFileSync(file, process.ppid.toString())
    return isSame
  } else {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, process.ppid.toString())
    return false
  }
}
