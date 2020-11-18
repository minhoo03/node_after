const express = require("express");
const app = express();
const {User} = require('./lib/mongoose')
const crypto = require('crypto')
const port = 3001;

// 1번째 인자 없을 시에 기본 주소에 뜸
// app.use('/public',express.static("./public"));
app.use(express.json())
app.use(express.urlencoded())
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  console.log(`[${req.method}] ${req.path} ${ip}`)
  next()
})
app.use(express.static("./public"));

app.post('/login', async (req, res) => {
  const { body: { id, password } } = req
  const epw = crypto.createHash('sha512').update(id + 'digitech' + password).digest('base64')
  const data = await User.find({id, password:epw})
  
  res.json(data)
  console.log(newPw)
})

app.post('/registry', (req, res) => {
  const { id, password, name } = req.body
  const epw = crypto.createHash('sha512').update(id + 'digitech' + password).digest('base64')

  User.create({id, password : epw, name})
  res.redirect('/')
})

app.get('/users', async (req, res) => { // find{조건, }
  const data = await User.find({})
  console.log(123)
  res.json(data)
})

app.listen(port, () => {
  console.log(`Server Open! -> http://localhost:${port}`);
});
