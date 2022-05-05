import axios from "axios";
import { set } from "date-fns";
const profileInfo=document.getElementById("profileInfo");
const sidenav=document.getElementById("sidenav");

if(profileInfo){
profileInfo.addEventListener("click",()=>{
    if(sidenav.style.display=="block"){
    sidenav.style.display="none";
    }
    else{
        sidenav.style.display="block";
    }
})
}
const btn_uploadPic=document.getElementById("btn_uploadPic");
if(btn_uploadPic){
btn_uploadPic.addEventListener("click",()=>{
    document.getElementById("profilePic").click();
});
}

const postPicLink=document.getElementById("postPicLink");
if(postPicLink){
postPicLink.addEventListener("click",()=>{
   document.getElementById("postPic").click();
   postPicLink.innerText="Edit picture";
});
}

function followFriend(followid,btn_follow){
        axios.post("/follow",{followedid:followid}).then((result)=>{
            if(result.data.ans==true){
            btn_follow.style.background="gray";
            btn_follow.style.color="black";
            btn_follow.disabled=true;
            btn_follow.innerHTML="Following";
            }
            else{
                alert("somethign went wrong!!");
            }
        }).catch((err)=>{
            console.log(err);
        });
}
const btn_follw=document.querySelectorAll(".btn-follow");
if(btn_follw){
    btn_follw.forEach((btn_follow)=>{
        btn_follow.addEventListener("click",()=>{
            const followid=JSON.parse(btn_follow.dataset.id);
            followFriend(followid,btn_follow);
    });
    })
}
const likeimg=document.querySelectorAll(".likeimg");

function likePost(postId,likedBy,indexx)
{   
    axios.post("/like",{postId:postId,likedBy:likedBy}).then((result)=>{
      if(result.data.ans)
      {
         
         likeimg[indexx].src="/images/heart-red.png";
         likeimg[indexx].disabled=true;
      }
      else{
          alert("Something went wrong!!");
      }
    }).catch((err)=>{
        console.log(err);
    })
}


const likes=document.querySelectorAll(".like");
if(likes)
{
    likes.forEach((like)=>{
        like.addEventListener("click",()=>{
            const postId=JSON.parse(like.dataset.postid);
            const likedBy=JSON.parse(like.dataset.likedby);
            const index=like.dataset.indexx;
            likePost(postId,likedBy,index);
        })
    })
}

const commentSection=document.querySelectorAll(".medium-modal");

const comments=document.querySelectorAll(".comment");
if(comments)
{
    comments.forEach((comment)=>{
        const postindex=comment.dataset.indexx;
        comment.addEventListener("click",()=>{
            commentSection[postindex].style.display="block";
        })
    })
    
}
