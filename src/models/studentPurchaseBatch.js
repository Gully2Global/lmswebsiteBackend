const mongoose=require("mongoose");
const studentPurchasePackageSchema=new mongoose.Schema({
    student_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },
    package_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Package",
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    expiry_date:{
        type:Date
    },
    is_active:{
        type:Boolean
    },
    payment_completed:{
        type:Boolean
    },
    payment_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Payment"
    }

})