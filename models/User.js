const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    id:{type:String, required:true, unique:true},
    pw:{type:String, required:true},
    name:{type:String},
    age:{type:Number, default: 18},
    gender:{type: String, default:'아파치공격헬리콥터'},
    isMarried:{type:Boolean, default: false}
  })
  // 저 이름의 table 만듦
  const User = mongoose.model('user', userSchema)
  // 모듈 내보냄
  module.exports = {
      User
  }