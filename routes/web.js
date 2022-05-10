const path=require("path");
const Users=require("./../app/models/user");
const posts=require("./../app/models/post");
const homeController=require("./../app/http/controllers/homeController");
const userController=require("./../app/http/controllers/userController");
const postController=require("../app/http/controllers/postController");
const multer=require("multer");
const uploadPath=path.join("public",Users.profilePics);
const uploadPathPost=path.join("public",posts.postImages);
const imageMimeTypes=["image/jpeg","image/png","image/gif"];
const uploads1=multer({
    dest:uploadPath,
    fileFilter:(req,file,callback)=>{
        callback(null,imageMimeTypes.includes(file.mimetype));
    }
});

const uploads2=multer({
    dest:uploadPathPost,
    fileFilter:(req,file,callback)=>{
        callback(null,imageMimeTypes.includes(file.mimetype));
    }
});


function initRoutes(app)
{
    app.get("/",homeController().index);
    app.get("/login",homeController().login);
    app.post("/register",homeController().postRegister);
    app.post("/login",homeController().postLogin);
    app.post("/verifyotp",homeController().verifyotp);
    app.get("/home",userController().home);
    app.get("/logout",homeController().logout)
    app.get("/deleteAccount",userController().deleteAccount)
    app.get("/viewProfile/:id",userController().viewProfile);
    app.get("/editProfile",userController().editProfile);
    app.get("/allFriends",userController().allFriends);
    app.get("/followers/:id",userController().followers);
    app.get("/following/:id",userController().following);
    app.post("/editProfile",uploads1.single("profilePic"),userController().editpostProfile);
    app.post("/follow",userController().follow);
    app.get("/newPost",postController().newPost);
    app.post("/post",uploads2.single("postPic"),postController().post);
    app.post("/like",postController().like);
    app.post("/comment",postController().comment)
}
module.exports=initRoutes;