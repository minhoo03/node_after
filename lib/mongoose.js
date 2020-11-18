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
// 몽구스 연결
const userSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  age: { type: Number, default: 18 },
  gender: { type: String },
  isMarried: { type: Boolean, default: false }
})

// 모델화.. users라는 table 생성 (s가 붙음)
const User = mongoose.model('user', userSchema)
// 모듈 내보내기
module.exports = { 
  User
}