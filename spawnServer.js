const {spawn} = require('child_process')
const server = spawn('python', ['-m', 'SimpleHTTPServer'])

server.stdout.on('data', (data) => {
    console.log(data.toString().replace("\n", ""))
})

server.stderr.on('data', (data) => {
    console.log(data.toString().replace("\n", ""))
})

server.on('close', () => {
    console.log('shutting down server')
})
