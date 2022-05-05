const mongoose=require("mongoose");
const commentSchema=mongoose.Schema({
    postId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"post"
    },
    commentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    commentContent:{
        type:String,
        required:true
    }
},{timestamps:true});

module.exports=mongoose.model("comment",commentSchema);