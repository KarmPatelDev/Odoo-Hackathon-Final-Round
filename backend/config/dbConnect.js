import mongoose from "mongoose";

const dbConnect = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database Connected To Host ${conn.connection.host}`);
    }
    catch(error){
        console.log(`Error: ${error}`);
    }
};

export default dbConnect;