const mongoose=require("mongoose");
const path=require("path");
const postImages="uploads/postImage";
const postSchema=mongoose.Schema({
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
    },
    caption:{
        type:String,
    },
    postImage:{
        type:String,
        required:true
    }
},{timestamps:true})
postSchema.virtual("postpicPath").get(function(){
    if(this.postImage!=null){
    return path.join("/",postImages,this.postImage)
    }
});


module.exports=mongoose.model("postImage",postSchema);
module.exports.postImages=postImages;
