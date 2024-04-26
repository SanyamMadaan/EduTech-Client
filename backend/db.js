const mongoose=require('mongoose');

try{
    mongoose.connect('mongodb+srv://sanyam:Sanyam%407820@cluster0.h0ddjdt.mongodb.net/EduTech');
    console.log('database connected successfully');
}
catch(error){
    console.log('Error while connecting database',error);
}

const courseSchema=mongoose.Schema({
    Image:String,
    price:Number,
    title:String,
    description:String
})

const Course=mongoose.model('Course',courseSchema);

const userSchema=mongoose.Schema({
    email:String,
    contact:String,
    password:String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
})

const user=mongoose.model('user',userSchema);

module.exports={
    user,Course
}