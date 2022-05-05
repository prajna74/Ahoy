const express=require("express");
const app=express();
const ejs=require("ejs");
const expressLayouts=require("express-ejs-layouts");
const mongoose=require("mongoose");
const session=require("express-session");
const mongoStore=require("connect-mongo");

const flash=require("express-flash");

app.set("view engine","ejs");
app.set("views","./resources/views");
app.use(expressLayouts);
app.set("layout","layouts/layout.ejs");
app.use(express.static("public"));
app.set("layout home",false);
app.set("layout login", false);

mongoose.connect("mongodb://localhost/Ahoy");

app.use(session({
       secret:"heyy",
       resave:false,
       saveUninitialized:false,
       store:mongoStore.create({
           mongoUrl:"mongodb://localhost/Ahoy",
           ttl:24*60*60*1000
       }),
       cookie:{maxAge:24*60*60*1000}
}));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.user=req.session.user;
    next();
});
   

const initRoutes=require("./routes/web");
initRoutes(app);



app.listen(3000);