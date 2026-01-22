const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let server

module.exports.handler = async (event, context) => {
  if (!server) {
    await app.prepare()
    
    // Create a local server for Next.js
    server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true)
        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error('Error occurred handling', req.url, err)
        res.statusCode = 500
        res.end('internal server error')
      }
    })
  }

  // Convert API Gateway event to HTTP request
  const { httpMethod, path, headers, body, queryStringParameters } = event
  
  return new Promise((resolve, reject) => {
    const req = {
      method: httpMethod,
      url: path + (queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''),
      headers: headers || {},
      body: body,
    }

    const res = {
      statusCode: 200,
      headers: {},
      body: '',
      writeHead: function(statusCode, headers) {
        this.statusCode = statusCode
        this.headers = { ...this.headers, ...headers }
      },
      write: function(chunk) {
        this.body += chunk
      },
      end: function(chunk) {
        if (chunk) this.body += chunk
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: this.body,
        })
      },
      setHeader: function(name, value) {
        this.headers[name] = value
      },
    }

    server.emit('request', req, res)
  })
}
