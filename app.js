const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const _= require("lodash");
const date = require(path.join(__dirname,'date.js'));


const bodyParser=require("body-parser");

const app = express();


// the template to be a view engine
app.set('view engine','ejs');

app.use(express.static('Public'));
app.use(bodyParser.urlencoded({extended:true}));

//Connect our mongoose 
mongoose.connect('mongodb+srv://Japhethino:olamide1234@cluster0.p9en3nh.mongodb.net/todolistDB',{useNewUrlParser:true});

const itemsSchema = {
   name:String
}
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item ({
   name: "Welcome to your todoList!",
})
const item2 = new Item ({
   name: "Hit the + button to aff a new item.",
})

const item3 = new Item ({
   name: "<-- Hit this to delete an item.",
})

//create a new array 
const defaultItems = [item1,item2,item3];


//create a new schema for our category 
const listSchema = {
   name:String,
   items:[itemsSchema]
}

//create a model for it 
const List = mongoose.model("List",listSchema);
//Item.insertMany(defaultItems, (err)=>{
 //if(err){
   //console.log(err);
 //} else {
   //console.log("success")
 //}
//})


app.get('/',(req,res)=>{
    let day = date.getDate();
   //console.log(day)
   Item.find({},(err,results)=>{
      if (results.length ===0){
         Item.insertMany(defaultItems, (err)=>{
          if(err){
            console.log(err);
          } else {
            console.log("Successfully saved default items DB")
          }
          
         });
         res.redirect('/');
      }else { 
         res.render('list',{
         listTitle:"Today",
         newListItem:results,
      })
   }
       });
     })
  
  
  //console.log(creed);
  app.get("/:categoryList",(req,res)=>{
   // WE make use of lodash to change the the first letter of route path to be upper case
   const categoryListName =_.capitalize(req.params.categoryList);
   
   List.findOne({name:categoryListName},(err,foundList)=>{
   if(!err){
      if(!foundList){
        //create a new List
        const list = new List ({
         name:categoryListName,
         items:defaultItems
      });
      list.save();
      res.redirect(`/${categoryListName}`);
      } else {
         //Show the List
         res.render('list',{
            listTitle:foundList.name,
            newListItem:foundList.items,

         })
      }
      
   }
   })
})
  


app.post('/',(req,res)=>{
 //res.send("Its working");
 const itemName  = req.body.todo;
 const listName = req.body.list;
 const item = new Item (
   {
      name : itemName
   }
 ) 
 if (listName === "Today"){

 item.save();
res.redirect('/'); 
 } else {
   List.findOne({name: listName},(err,foundList)=>{
    foundList.items.push(item);
    foundList.save();
    res.redirect(`/${listName}`)
   })
 }
})

console.log("netx");

app.post('/delete',(req,res)=>{
 const userId = req.body.checkbox;
 const listName = req.body.listName;

 if (listName === "Today") {
Item.findByIdAndRemove(userId,(err)=>{
if (!err){
   console.log("sucessfully Deleted");
}
res.redirect('/');
})
 } else {
 //the below pull the items from list with corresponding id using pull lodash method in the mongo
   List.findOneAndUpdate({name: listName},{$pull:{items:{_id:userId}}},(err,foundList)=>{
    if(!err){
    res.redirect(`/${listName}`)
    }
   })

 }
 
});


app.post('/work',(req,res)=>{
   const newWork = req.body.todo;
   items.push(newWork);
   res.redirect("/work");

})

app.get('/sport',(req,res)=>{
   res.render('list',{
      listTitle:'Sport List',
      newListItem:sportyItems,
   })
})
app.post('/sport', (req,res)=>{
   const newSport = req.body.todo;
   sportyItems.push(newSport);
   res.redirect('/sport')
     
})
let port = process.env.PORT
if(port == null || port ==""){
   port = 3000;
}


app.listen(port,()=>{
   console.log("Server has started sucessfully on port 3000")
})


