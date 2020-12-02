const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    // required : 필수값
    title:{type:String, required:true, unique:true},
    createAt:{type:Date, required:true, default: () => {
        return new Date()
    }},
    // 화살표 함수 특징 {} 없으면 return.. 매 시간을 저장
    updateAt:{type:Date, required:true, default: () => new Date()},
    content:{type:String, required:true},
    writer:{type: String, required:true},
    hit:{type:Number, default: 0, required:true},
    // 댓글 여러 개 작성하니 배열, 댓글에 작성자나 쓴 날짜
    comment:[{
        content: {type: String, required: true},
        createAt: {type: String, required: true, default: () => new Date()},
        // 수정 되었나요?? ㅋㅋ 아뇨
        isEdited: {type: Boolean, required: true, default: false},
    }]
})

const Post = mongoose.model('post', postSchema)

module.exports = Post