import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(
    cors({
      origin: ["https://home-decor-bice.vercel.app"],
      credentials: true,
    })
  );
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const ContactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  service: String,
  timeline: String,
  minBudget: Number,
  maxBudget: Number,
  description: String,
});

const Contact = mongoose.model("Contact", ContactSchema);

app.post("/api/contact", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: "Submission successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
