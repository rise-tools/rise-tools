import { uuid } from 'uuidv4'

import { jwt } from './jwt.js'

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
