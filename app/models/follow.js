const mongoose=require("mongoose");
const followSchema=mongoose.Schema({
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    followed:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true});

module.exports=mongoose.model("followList",followSchema);