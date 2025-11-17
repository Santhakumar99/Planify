import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken"
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Name is required'],
        trim:true,
        minlength:2
    },
    email:{
         type:String, 
         required:[true, 'Email is required'] ,
         unique:true,
         lowercase: true,
         validate: {
         validator: v => validator.isEmail(v),
         message: props => `${props.value} is not a valid email`
    }},
    password:{
         type:String, 
         required:[true, 'Password is required'] ,
         minlength:8,
         select:false
        },
    role:{
      type:String,
      enum:['user','admin'],
      default:'user'
    },
    isBlocked :{
        type:Boolean,
        default:false
    }},
    {
        timestamps:true
    })

// Pre-save hook to hash password if modified
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Optionally: generate JWT (uses jsonwebtoken)
// const jwt = require('jsonwebtoken');
UserSchema.methods.generateJWT = function() {
  const payload = { id: this._id, role: this.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', {
    expiresIn: '7d'
  });
  return token;
};


    const User = mongoose.model('User', UserSchema)
    // module.exports = User;
    export default User;
