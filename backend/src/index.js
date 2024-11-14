import dotenv from "dotenv"

dotenv.config({
    path:'./.env'
})
import connectDB from "./db/Dbconnect.js";
import app from'./app.js'
const port=process.env.PORT || 4000;
connectDB()
.then(()=>{
    
    app.listen(port,()=>{
        console.log("server is running at port ",port)
    })
    app.on("error",(error)=>{
        console.log("error",error)
    })
})
.catch((error)=>{
    console.log("MONGODB connection failed !! ",error)
})