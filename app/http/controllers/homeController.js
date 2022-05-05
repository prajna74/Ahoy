const User=require("./../../models/user");
const bcrypt=require("bcrypt");
function homeController(){
    return{
          index:(req,res)=>{
              res.render("home",{layout:"home"});
          },
          login:(req,res)=>{
              res.render("login",{layout:"login"});
          },
          postRegister:async (req,res)=>{
               const {name,email,password}=req.body;
               if(!name || !email || !password)
               {
                   req.flash("error","All fields required");
                   res.redirect("/");
               }
               else{
                   const hashedPassword=await bcrypt.hash(password,10);
                   const user=new User({
                      name:name,
                      email:email,
                      password:hashedPassword
                   });
                   user.save().then((result)=>{
                       res.redirect("/login");
                   }).catch((err)=>{
                       req.flash("error","Something went wrong");
                   })
               }
          },
          postLogin:async (req,res)=>{
               const {email,password}=req.body;
               if(!email || !password)
               {
                   req.flash("error","All fields required");
                   res.redirect("/login");
               }
               else{
               const user=await User.findOne({email:email});
               if(user==null)
               {
                   req.flash("error","Email not registered!");
                   res.redirect("/login");
               }
               else{
                   if(await bcrypt.compare(password,user.password))
                   {
                       req.session.user={user:user};
                       res.redirect("/home");
                   }
                   else{
                       req.flash("error","Wrong password!");
                       res.redirect("/login");
                   }
               }
          }
        },
        logout:(req,res)=>{
            req.session.user="";
            req.session.destroy();
            res.redirect("/");
        }
    }
}

module.exports=homeController;