import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["https://home-decor-bice.vercel.app", "https://dash-board-homedecor.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Define Contact Schema
const ContactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  service: String,
  timeline: String,
  minBudget: Number,
  maxBudget: Number,
  description: String,
  submittedAt: {
    type: Date,
    default: Date.now, // Automatically store the current timestamp if not provided
  },
});

// Create Contact Model
const Contact = mongoose.model("Contact", ContactSchema);

// API Endpoint to Submit Contact Form
app.post("/api/contact", async (req, res) => {
  try {
    const { submittedAt, ...rest } = req.body;

    // Use provided timestamp or generate the current date/time
    const newContact = new Contact({
      ...rest,
      submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
    });

    await newContact.save();
    res.status(201).json({ message: "Submission successful", contact: newContact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Endpoint to Get All Contacts (Sorted by Date Descending)
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 }); // Sort by latest first
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
