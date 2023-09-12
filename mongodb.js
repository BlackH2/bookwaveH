const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/login")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e) => {
    console.log('Connection error:', e.message);
});

const logInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const LogInCollection=new mongoose.model('login_details',logInSchema)

module.exports=LogInCollection

