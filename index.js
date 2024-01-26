import express from "express";
import mongoose, { Schema } from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
const app = express();
app.use(cors());
app.use(express.json());

const userSchema = new Schema({
  email: String,
  role: {
    type: String,
    default: "user",
  },
  password: String,
});

const userModel = mongoose.model("user", userSchema);

app.get("/user", async (req, res) => {
  const user = await userModel.find({});
  res.send(user);
});

app.post("/user", async (req, res) => {
  const { email, password } = req.body;
  const newUser = new userModel({ email, password });
  await newUser.save();
  res.send("Got a POST request");
});

app.put("/user", async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  const user = await userModel.findByIdAndUpdate(id, { email, password });
  res.send("Got a PUT request at /user");
});

app.delete("/user", async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndDelete(id);
  res.send("Got a DELETE request at /user");
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = bcrypt.hashSync(password, 12);
    var token = jwt.sign({ email: email, role: "user" }, "tgtutygvgvbujn");
    const newUser = new userModel({ email, password: hash });
    await newUser.save();
    res.status(200).json(token);
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new userModel({ email, password });
    await newUser.save();
    res.send("Got a POST request");  
  } catch (error) {
    console.log(error.message);
  }
});

mongoose
  .connect(process.env.KEY)
  .then(() => console.log("Connected!"))
  .catch(() => console.log("Not Connected!"));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
