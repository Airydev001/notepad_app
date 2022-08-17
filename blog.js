const express = require("express");



const bodyParser=require("body-parser");

const app = express();


// the template to be a view engine
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

let bloggers = [];
app.get('/',(req,res)=>{
  res.render('blog', {
      message:bloggers,
  })
  console.log(bloggers);
})

app.post('/',(req,res)=>{
    const blogs = req.body.data;
    bloggers.push(blogs);
    res.redirect('/');
})

app.listen(3200,()=>{
    console.log('server is running');
})