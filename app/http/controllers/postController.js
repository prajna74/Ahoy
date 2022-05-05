const path=require("path");
const moment=require("moment");
const Users=require("./../../models/user");
const follows=require("./../../models/follow");
const posts=require("./../../models/post");
const likes=require("./../../models/like");
const comments=require("./../../models/comment");
function postController(){
    return{
        newPost:(req,res)=>{
            res.render("user/post");
          },
          post:async(req,res)=>{
           const filename=req.file==null?"":req.file.filename;
           const newPost=new posts({
             userId:req.session.user.user._id,
             postImage:filename,
             caption:req.body.caption
           });
           await newPost.save().then(()=>{
             res.redirect("/home");
           }).catch((err)=>{
             console.log(err);
           })
          },
          like:async (req,res)=>{
              const postId=req.body.postId;
              const likedBy=req.session.user.user._id;
              const newLike=new likes({
                  postId:postId,
                  likedBy:likedBy
              })
              newLike.save().then((result)=>{
               res.json({ans:true})
              }).catch((err)=>{
                  console.log(err);
                res.json({ans:false});
              });
          },
          comment:async (req,res)=>{
              const postid=req.body.postId;
              const commentcontent=req.body.commentContent;
              const newComment=new comments({
                postId:postid,
                commentContent:commentcontent,
                commentBy:req.session.user.user._id
              });
              await newComment.save().then(()=>{
                res.redirect("/home");
              }).catch((err)=>{
                console.log(err);
              })
          }
      }
}


module.exports=postController;