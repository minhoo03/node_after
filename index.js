const express = require("express");
const app = express();
const session = require('express-session')
const {User} = require('./models/User')
const Post = require('./models/Post')
const methodOverride = require('method-override')

require('./lib/mongoose')
const crypto = require('crypto')
const port = 3001;

// 1번째 인자 없을 시에 기본 주소에 뜸
// app.use('/public',express.static("./public"));
app.use(express.json())
app.use(express.urlencoded())
// _method를 던져주면 그 쿼리로 이해하겠다 (html은 method가 get, post밖에 없으니까 생성하기 위해)
app.use(methodOverride('_method'))
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

// GET : 게시글 작성 page
// session 없을 시...
app.get('/posts/create', (req, res) => {
  if(!req.session.user) return res.redirect('/')
  res.render('createPost')
  console.log(req.session.user)
})

app.get('/posts', async (req, res) => {
  const posts = await Post.find()
  res.render('posts', {posts, user:req.session.user})
})
// :aaa 는 무슨 값이 오든 aaa라는 변수에 담음
// req.body, query, params
app.get('/posts/:postId', async (req, res) => {
  const postId = req.params.postId

  // 값 조회                                              // 기존 DB + 1      // 조회한 후 새로 변경된 값을 가져옴
  const post = await Post.findOneAndUpdate({_id:postId}, {$inc: {hit : 1}}, {new: true })
  res.render('postDetail', {post, user:req.session.user})
})

app.get('/registry', (req, res) => {
  res.render('registry')
})

// POST : page에서 작성한 data, DB에 저장
// postman 같은 program 사용시.. 보안
app.post('/posts', (req, res) => {

  if(!req.session.user) return res.redirect('/')

  const {body: { title, content} } = req
  Post.create({title, content, writer: req.session.user._id})
  res.redirect('/posts')
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

app.delete('/posts/:postId', async (req,res) => {
  const postId = req.params.postId
  await Post.deleteOne({_id:postId})
  res.redirect('/posts')
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
