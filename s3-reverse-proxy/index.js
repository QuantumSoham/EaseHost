const express = require('express')
const httpProxy = require('http-proxy')

const app = express()
const PORT = 8000

const BASE_PATH = 'https://vercel-try.s3.us-east-1.amazonaws.com/_outputs'

const proxy = httpProxy.createProxy()

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];

    // Custom Domain - DB Query

    const resolvesTo = `${BASE_PATH}/${subdomain}`
    console.log('Proxying request to:', resolvesTo + req.url)
    return proxy.web(req, res, { target: resolvesTo, changeOrigin: true })

})

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html'
    console.log('Proxy Request:', proxyReq.path);

})

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`))