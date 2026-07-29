const mongoose=require("mongoose");
const studentschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    age:{
       type:Number,
       required:true
    },
    course:{
        type:String,
        required:true,
        trim:true
    }
},
    {
        timestamps:true
    }
)
const Students=mongoose.model("Students",studentschema);
module.exports=Students;
