import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema({
    fullName : {
        type : "String",
        required : [true, "Name is required"],
        minLength : [5, " Name must be atleast 5 character"],
        maxLength : [30, " Name should be less than 30 characters"],
        lowercase : true,
        trim : true
    },
    email : {
        type : "String",
        required : [true, "Email is required"],
        lowercase : true,
        trim : true,
        unique : true,
        match : [
            /^\S+@\S+\.\S+$/, "Please use a valid email"
        ]    
    },
    password : {
        type : "String",
        required : [true, "Password is required"],
        minLength : [5, " Password must be atleast 5 character"],
        select : false
    },
    avatar : {
        public_id : {
            type : "String"
        },
        secure_url : {
            type : "String"
        }
    },
    role:{
        type : "String",
        enum : ["USER","ADMIN"],
        default : "USER"
    },

    forgotPasswordToken : String,
    forgotPasswordExpiry : Date
},{
    timestamps : true
});

userSchema.pre("save",async function() {
    if(!this.isModified("password")){
        return ;
    }

    this.password = await bcrypt.hash(this.password,10);
    
})

userSchema.methods = {
    generateJWTToken : function(){
        return jwt.sign(
            {id:this._id, email:this.email, subscription:this.subscription, role:this.role},
            process.env.JWT_SECRET,
            {
                expiresIn : process.env.JWT_EXPIRY,
            }
        )
    },

    comparePassword : async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword, this.password);
    },

    generatePasswordResetToken : async function() {
        const resetToken = crypto.randomBytes(20).toString("hex");

        this.forgotPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex")
        ;    

        this.forgotPasswordExpiry = Date.now()+ 15*60*1000 // 15 min from now

        return resetToken;
    }
}

const User = model("User", userSchema);

export default User;