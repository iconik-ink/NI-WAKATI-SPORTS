import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  page: { 
    type: String, 
    unique: true,       // Only one entry per page
    required: true
  },
  data: {
    type: Object,       // Flexible structure: title, body, images, etc.
    default: {}
  },
  updatedAt: { 
    type: Date, 
    default: Date.now   // Automatically set/update timestamp
  }
});

export default mongoose.model("Content", contentSchema);
