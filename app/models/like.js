const mongoose=require("mongoose");
const likeSchema=mongoose.Schema({
    postId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"post"
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true});

module.exports=mongoose.model("like",likeSchema);