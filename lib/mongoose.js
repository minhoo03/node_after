// mongoDB 연결
// 스키마 : 규칙, 이를 기준으로 데이터를 DB에 넣기전 검사함
const mongoose = require('mongoose')


// 'mongodb://localhost/blog' 라고 설정 후 회원가입하면 'blog' Database 생성
mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log('MongoDB is connected...')
}).catch(err => {
  console.error(err)
})
