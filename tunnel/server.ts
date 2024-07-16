import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import httpProxy from 'http-proxy'

import { jwt, tunnelService } from './tunnelService'

const app = new Hono()

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
      return !!jwt.verify(token)?.projectId
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

app.all('/*', async (c) => {
  return new Promise((resolve) => {
    const projectId = c.req.headers.host?.split('.')[0]
    if (!projectId) return
    const tunnelURL = service.getTunnelURL(projectId)
    proxy.web(
      c.req.raw,
      c.res.raw,
      {
        target: tunnelURL,
        ws: true,
      },
      (err) => {
        if (err) {
          console.error('Proxy error:', err)
          resolve(c.text('Proxy error', 500))
        }
      }
    )
  })
})

const PORT = 3000

const server = serve({
  fetch: app.fetch,
  port: PORT,
})

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, {
    target: 'ws://destination-server.com',
  })
})
