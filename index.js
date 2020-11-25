const express = require("express");
const app = express();
const session = require('express-session')
const {User} = require('./models/User')
require('./lib/mongoose')
const crypto = require('crypto')
const port = 3001;

// 1번째 인자 없을 시에 기본 주소에 뜸
// app.use('/public',express.static("./public"));
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("./public"));
app.set('view engine', 'ejs')
// session을 함수로 실행 : secret = salt
app.use(session({
  secret: '($YA)@#12asd^%#',
  resave: false,
  saveUninitialized: true
}))

app.get('/', (req, res) => {
  console.log(req.session.user)
  res.render('main', { user: req.session.user })
})

app.get('/registry', (req, res) => {
  res.render('registry')
})

app.post('/login', async (req, res) => {
  const { body: { id, pw }} = req
  const epw = crypto.createHash('sha512').update(id+'lib'+pw+'salt').digest('base64')
  const data = await User.findOne({ id, pw: epw })
  if (data) {
    req.session.user = data
    res.redirect('/')
  } else {
    res.send('로그인에 실패하셨습니다.')
  }
})

app.post('/registry', (req, res) => {
  const { id, pw, name } = req.body
  const epw = crypto.createHash('sha512').update(id+'lib'+pw+'salt').digest('base64')

  User.create({id, pw : epw, name})
  res.redirect('/')
})

app.get('/logout', (req, res) => {
  delete req.session.user
  res.redirect('/')
})

app.get('/users', async (req, res) => { // find{조건, }
  const data = await User.find({})
  res.json(data)
})

app.listen(port, () => {
  console.log(`Server Open! -> http://localhost:${port}`);
});
