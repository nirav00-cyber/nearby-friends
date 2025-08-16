import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import friendRoutes from './routes/friendRoutes.js';
import userRoutes from './routes/userRoutes.js';



dotenv.config(); 
const app = express();

app.use(cors()); 
app.use(express.json()); 

//Simple test route
app.get("/",(req,res)=>{
    res.send("Nearby Friends API is running"); 
});




// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

//Routes

app.use("/api/friends", friendRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));