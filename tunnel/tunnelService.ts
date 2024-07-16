import jwt from 'jsonwebtoken'
import { uuid } from 'uuidv4'

export const tunnelService = () => {
  const projects = new Map<string, string>()

  return {
    createProject(tunnelURL: string) {
      const projectId = uuid()
      const secret = jwt.sign({ foo: 'bar' }, process.env.SECRET_KEY || '')
      projects.set(projectId, tunnelURL)
      return { projectId, secret }
    },

    verifySecret(secret: string) {
      const token = jwt.verify(secret, process.env.SECRET_KEY || '') as { projectId: string }
      return !!token?.projectId
    },

    getTunnelURL(projectId: string) {
      return projects.get(projectId)
    },

    setTunnelURL(projectId: string, tunnelURL: string) {
      if (!projects.has(projectId)) {
        projects.set(projectId, tunnelURL)
        return true
      }
      return false
    },
  }
}
