const path=require("path");
const moment=require("moment");
const Users=require("./../../models/user");
const follows=require("./../../models/follow");
const comments=require("./../../models/comment");
const posts=require("./../../models/post");
const likes=require("./../../models/like");
const axios=require("axios");
const { type } = require("os");
function userController(){
    return{
        home:async (req,res)=>{
          const post=await posts.aggregate( [
            {
                 $match:{userId:{$ne:req.session.user.user._id}}
            },
            {
              $lookup:
                {
                  from: "comments",
                  localField: "_id",
                  foreignField: "postId",
                  as: "postComments"
                }
           },
           {
            $lookup:
              {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userdetails"
              }
          },
         ]).sort({createdAt:-1});
         const po={}
         post.forEach((p)=>{
           po[p._id]=[]
            p.postComments.forEach((comment)=>{
              po[p._id].push(comment.commentBy);
            })
         });
         const answer={}
         for(const key in po){
           answer[key]=[]
           for(const v in po[key])
           {
             const d=await Users.findById(po[key][v]);
             answer[key].push(d);
           }
         }
         const like= await likes.find({likedBy:req.session.user.user._id}).lean();
         const likedPosts=[];
         like.forEach((li)=>{
           likedPosts.push(JSON.stringify(li.postId));
         });
         res.render("user/home",{posts:post,moment:moment,commentUser:answer,likedPosts:likedPosts});        
        },
        viewProfile:async (req,res)=>{
          const user=await Users.findById(req.params.id);
          const following=await follows.find({follower:req.params.id}).count();
          const followers=await  follows.find({followed:req.params.id}).count();
          const post=await posts.find({userId:req.params.id});
          res.render("user/viewProfile",{
             users:user,
             followers:followers,
             following:following,
             posts:post
            });
        },
        editProfile:async (req,res)=>{
          const user=await Users.findById(req.session.user.user._id);
            res.render("user/editProfile",{users:user});
        },
        editpostProfile:async (req,res)=>{
          const fileName=req.file==null?"":req.file.filename;
          const user=await Users.findById(req.session.user.user._id);
          const {name,email,bio,phonenumber}=req.body;
          user.name=name;
          user.email=email;
          user.bio=bio;
          user.phonenumber=phonenumber;
          if(fileName=="")
          {
            // console.log("NULL");
          }
          else{
            user.profilePic=fileName;
          }
          user.save().then((result)=>{
              req.session.user.user.profilePic=user.profilePic;
              res.redirect(`/viewProfile/${req.session.user.user._id}`);
          }).catch((err)=>{
             console.log(err);
             res.redirect("/editProfile");
          })
        },
        allFriends:async (req,res)=>{
          var searchuser="";
          if(req.query.searchuser!=null && req.query.searchuser){
            searchuser=req.query.searchuser;
          }
          const following=await follows.find({follower:req.session.user.user._id},{followed:1}).lean();
          var followingList=[];
          following.forEach((follow)=>{
               followingList.push(follow.followed);
          });
          const users=await Users.find({ 
            _id:{$ne:req.session.user.user._id,$nin:followingList},
            name:{$regex:searchuser}
          });
           res.render("user/allFriends",
          {
             users:users
           });
        },
        follow:(req,res)=>{
          const followedid=req.body.followedid._id;
          const newFollow=new follows({
            follower:req.session.user.user._id,
            followed:followedid
          });
          newFollow.save().then((result)=>{
            return res.json({ans:true});
          }).catch((err)=>{
            return res.json({ans:false});
            console.log(err);
          })
        },
        following:async (req,res)=>{
            const following=await follows.find({follower:req.params.id},{followed:1}).lean();
            var followList=[];
            following.forEach((followw)=>{
              followList.push(followw.followed);
            });
            const users=await Users.find({_id:{$ne:req.session.user.user._id,$in:followList}});
            res.render("user/following",{users:users});
        } ,
        followers:async (req,res)=>{
          const followers=await follows.find({followed:req.params.id},{follower:1}).lean();
          var followersList=[];
          followers.forEach((followe)=>{
              followersList.push(followe.follower);
          });
          const userfollowing=await follows.find({follower:req.params.id,followed:{$in:followersList}},{followed:1}).lean();
          const ufollow=[];
          userfollowing.forEach((f)=>{
              ufollow.push(JSON.stringify(f.followed));
          });
          const users=await Users.find({_id:{$ne:req.session.user.user._id,$in:followersList}});
          res.render("user/followers",{users:users,ufollow:ufollow});
        },
        deleteAccount:async(req,res)=>{
          const userr=await Users.findById(req.session.user.user._id);
          userr.remove();
          req.session.user="";
          req.session.destroy();
          res.redirect("/");
        }
    }
  }
module.exports=userController;