import mongoose from 'mongoose'

const connectDB = async()=>{
    try{
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongo DB Connected Successfully  `)
    }
    catch(e)
    {
         console.error(`Error: ${e.message}`);
    }
}
export default connectDB;