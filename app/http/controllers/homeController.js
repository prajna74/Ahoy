const User=require("./../../models/user");
const otp=require("./../../models/otp");
const otpGenerator=require("otp-generator");
const nodemailer=require("nodemailer");
const bcrypt=require("bcrypt");
const passwordChecker=require("./../Methods/passwordChecker");
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
                   req.flash("name",name);
                   req.flash("email",email);
                   res.redirect("/");
               }
               else if(await User.findOne({email:email}))
                   {
                       req.flash("error","Email already exists");
                       req.flash("name",name);
                      
                       res.redirect("/");
                   }
                else if(!passwordChecker(password)){
                       req.flash("error","Password not valid!");
                       req.flash("name",name);
                       req.flash("email",email);
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
                    const otpp=otpGenerator.generate(6,{digits:true,lowerCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false});
                    const newOtp=new otp({
                        otp:otpp,
                        userId:user._id
                    });
                    newOtp.save().then(async ()=>{
                     const transporter = nodemailer.createTransport({
                         host: 'smtp.gmail.com',
                         port: 465,
                         secure: true,
                         auth: {
                           user: `${process.env.EMAIL_ADDRESS}`,
                           pass: `${process.env.EMAIL_PASSWORD}`
                         },
                       });
                       const email_message=`Hello ${user.name}!Here is your otp. Please enter the otp to continue.<br>${newOtp.otp}`;
                       const mailOptions = {
                        from: `"Prajna Holla"<${process.env.EMAIL_ADDRESS}>`,
                        to: `${user.email}`,
                        subject: "Email confirmation",
                        text: email_message ,
                      };
                  
                      await transporter.verify();
                      
                      //Send Email
                      await transporter.sendMail(mailOptions, (err, response) => {
                        if (err) {
                            return res.status(400).send({"Status":"Failure","Details": err });
                        } else {
                            //console.log(newOtp.otp);
                            res.render("emailotp",{layout:"emailotp",registeredUser:user});
                          return res.send({"Status":"Success","Details":encoded});
                        }
                      });
                    });
                   }).catch((err)=>{
                       req.flash("error","Something went wrong");
                   })
               }
          },
          verifyotp:async(req,res)=>{
                const registeredUserid=req.body.registeredUserid;
                const enteredOtp=req.body.otp;
                const confirm=await otp.findOne({userId:registeredUserid})
                if(confirm)
                {
                    if(confirm.otp===enteredOtp)
                    {
                        res.render("login",{layout:"login"});
                    }
                    else{

                        console.log("Wrong otp!");
                    }
                }
                else{
                   console.log("Otp not sent!");
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