import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Later we can hash this
    location: {
      type: {
        type: String,
            enum: ["Point"], // GeoJSON type
        default: "Point",
       
      },
      coordinates: {
          type: [Number], // [longitude, latitude]
            index: "2dsphere", // For geospatial queries
        required: true
      }
        }, 
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Array of friend IDs 
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" }); // For geospatial queries

export default mongoose.model("User", userSchema);
