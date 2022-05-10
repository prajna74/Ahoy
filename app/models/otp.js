const mongoose=require("mongoose");
const otpSchema=mongoose.Schema({
    otp:{
        type:String,
        required:true
    },
    expire_at: {
        type: Date,
        default: Date.now(),
        expires: 60
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
});

otpSchema.index({ "expire_at": 1 }, { expireAfterSeconds: 2400 });
module.exports=mongoose.model("emailotp",otpSchema);