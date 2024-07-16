import jwt from 'jsonwebtoken'
import { uuid } from 'uuidv4'

export const createCloudService = () => {
  const projectURL = new Map<string, string>()

  return {
    createProject(tunnelURL: string) {
      const projectId = uuid()
      const secret = jwt.sign({ foo: 'bar' }, process.env.SECRET_KEY || '')
      projectURL.set(projectId, tunnelURL)
      return { projectId, secret }
    },

    getTunnelURL(projectId: string) {
      return projectURL.get(projectId)
    },

    setTunnelURL(projectId: string, tunnelURL: string, secret: string): boolean {
      const token = jwt.verify(secret, process.env.SECRET_KEY || '') as { projectId: string }
      if (token.projectId === projectId) {
        projectURL.set(projectId, tunnelURL)
        return true
      } else {
        return false
      }
    },
  }
}
