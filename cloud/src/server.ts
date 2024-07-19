import { serve } from '@hono/node-server'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import httpProxy from 'http-proxy'
import { z } from 'zod'

import { jwt } from './jwt.js'
import { tunnelService } from './service.js'

const app = new Hono()
const service = tunnelService()
const proxy = httpProxy.createProxyServer({})

const schema = z.object({
  url: z.string().url(),
})

app.post('/projects', zValidator('json', schema), async (c) => {
  const url = c.req.valid('json').url
  if (!url) {
    return c.json({ error: 'Missing tunnel URL' }, 400)
  }
  const { projectId, secret } = service.createProject(url)
  return c.json({ projectId, secret }, 201)
})

app.post(
  '/projects/:projectId',
  bearerAuth({
    verifyToken: async (token, c) => {
      return !!jwt.verify(token)?.projectId
    },
  }),
  zValidator('json', schema),
  async (c) => {
    const projectId = c.req.param('projectId')
    const url = c.req.valid('json').url

    if (!url) {
      return c.json({ error: 'Missing tunnel URL' }, 400)
    }
    const success = service.setTunnelURL(projectId, url)
    if (!success) {
      return c.json({ error: 'Project not found' }, 404)
    }
    return c.json({ message: 'Project updated successfully' })
  }
)

app.all('/*', async (c) => {
  return new Promise((resolve) => {
    const projectId = c.req.header().host?.split('.')[0]
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
  const projectId = req.headers.host?.split('.')[0]
  if (!projectId) return
  const tunnelURL = service.getTunnelURL(projectId)
  proxy.ws(req, socket, head, {
    target: `ws://${tunnelURL}`,
  })
})
