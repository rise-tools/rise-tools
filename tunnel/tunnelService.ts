import jsonwebtoken from 'jsonwebtoken'
import { uuid } from 'uuidv4'

export const jwt = {
  sign(projectId: string) {
    return jsonwebtoken.sign({ projectId }, process.env.SECRET_KEY || '')
  },
  verify(secret: string) {
    return jsonwebtoken.verify(secret, process.env.SECRET_KEY || '') as { projectId: string }
  },
}

export const tunnelService = () => {
  const projects = new Map<string, string>()

  return {
    createProject(tunnelURL: string) {
      const projectId = uuid()
      const secret = jwt.sign(projectId)
      projects.set(projectId, tunnelURL)
      return { projectId, secret }
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
