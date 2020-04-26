const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config()

// Serve static files....
app.use(express.static(__dirname + '/dist/GenealogyFrontEnd'));

app.get('/info/api', (req, res) => {
  res.send({"GENEALOGY_API" : process.env.GENEALOGY_API})
});

app.get('/info/env', (req, res) => {
  res.send({"Environnement" : process.env.NODE_ENV})
});

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/GenealogyFrontEnd/index.html'));
});

let PORT = process.env.PORT 
app.listen(PORT, () =>
{
  console.log(`Server is running on port ${PORT}...`);
  console.log(`Env: ${process.env.NODE_ENV}`);
});
