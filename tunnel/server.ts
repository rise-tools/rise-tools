import http from 'node:http'

import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import httpProxy from 'http-proxy'

import { tunnelService } from './tunnelService'

const app = new Hono()

// websocket?
const proxy = httpProxy.createProxyServer({})

const service = tunnelService()

app.post('/projects', async (c) => {
  const body = (await c.req.json()) as { url: string } | undefined

  if (!body || !body.url) {
    return c.json({ error: 'Missing tunnel URL' }, 400)
  }

  const { projectId, secret } = service.createProject(body.url)

  return c.json({ projectId, secret }, 201)
})

app.post(
  '/projects/:projectId',
  bearerAuth({
    verifyToken: async (token, c) => {
      return service.verifySecret(token)
    },
  }),
  async (c) => {
    const projectId = c.req.param('projectId')
    const body = (await c.req.json()) as { url: string } | undefined

    if (!body || !body.url) {
      return c.json({ error: 'Missing tunnel URL' }, 400)
    }

    const success = service.setTunnelURL(projectId, body.url)

    if (!success) {
      return c.json({ error: 'Project not found' }, 404)
    }

    return c.json({ message: 'Project updated successfully' })
  }
)

http
  .createServer(function (req, res) {
    const projectId = req.headers.host?.split('.')[0]
    if (!projectId) return
    const tunnelURL = service.getTunnelURL(projectId)
    proxy.web(req, res, { target: tunnelURL })
  })
  .listen(3000)
