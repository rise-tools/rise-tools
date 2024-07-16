import http from 'node:http'

import httpProxy from 'http-proxy'

// websocket?
const proxy = httpProxy.createProxyServer({})

http.createServer(function (req, res) {
  proxy.web(req, res, { target: 'http://mytarget.com:8080' })
})
