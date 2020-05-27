const express = require('express')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
require('dotenv').config()

// Serve static files....
app.use(express.static(__dirname + '/dist/GenealogyFrontEnd'))

app.use(function(req, res, next) {
  res.setHeader("Cache-Control", "public, must-revalidate, max-age=600");
  return next();
});

app.get('/env', (req, res) => {
  res.send(
    {
      Environnement: process.env.NODE_ENV,
      GENEALOGY_API: process.env.GENEALOGY_API
    })
})

// Send all requests to index.html
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/GenealogyFrontEnd/index.html'))
})

const documents = {}

io.on('connection', socket => {
  var clientIp = socket.request.connection.remoteAddress

  // console.log('a user connected')
  // io.emit('message-received', 'User connected: ' + clientIp)

  // socket.on('disconnect', () => {
  //   console.log('user disconnected')
  //   io.emit('message-received', 'User disconnected: ' + clientIp)
  // })

  socket.on('message', (msg) => {
    io.emit('message-received', msg)
  })

  socket.on('message-received', (msg) => {
    console.log('message - ' + msg)
  })
})

const PORT = process.env.PORT
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
  console.log(`Env: ${process.env.NODE_ENV}`)
})
