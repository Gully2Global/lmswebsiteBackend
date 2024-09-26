const mongoose=require("mongoose");

const payoutSchema=new mongoose.Schema({
    teacher_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Teacher",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    is_pending:{
        type:Boolean,
        default:true
    },
    is_paid:{
        type:Boolean,
        default:false
     },
      

});

module.exports=mongoose.model("Payout",payoutSchema);
