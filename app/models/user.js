const postSchema=require("./../models/post");
const mongoose=require("mongoose");
const path=require("path");
const profilePics="uploads/profilePics";
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        index:{unique:true}
    },
    profilePic:{
         type:String
    },
    bio:{
        type:String
    },
    phoneNumber:{
        type:Number
    }
},{timestamps:true});


userSchema.virtual("profilepicPath").get(function(){
    if(this.profilePic!=null){
    return path.join("/",profilePics,this.profilePic)
    }
    else{
        return "";
    }
});

userSchema.pre("remove",function(next){
   postSchema.deleteMany({userId:this._id}).exec();
   next();
});


module.exports=mongoose.model("user",userSchema);
module.exports.profilePics=profilePics;