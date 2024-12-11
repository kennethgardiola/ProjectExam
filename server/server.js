const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
require("dotenv").config();
const User = require("./models/users.model");
const Employee = require("./models/add.product.model");


app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected Successfully");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server started on port ${port}`));
  })
  .catch((error) => console.log(error));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ message: "Token is required for authentication" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Routes that require authentication
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
});

// Routes for User Management
app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No User Data existed" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.json({ message: "Success", token });
    } else {
      res.status(400).json({ message: "The password is incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});




// Routes for Employee Management
app.post("/addEmployee", authenticateToken, async (req, res) => {
  const { EName, Age, Address, Position } = req.body;

  if (!EName || !Age || !Address || !Position) {
    return res
      .status(400)
      .json({ message: "Employee, Age, Address, and Position are required" });
  }

  try {
    const newEmployee = new Employee({ EName, Age, Address, Position });
    console.log(newEmployee);
    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    console.error("Error in /addEmployee route:", error);
    res.status(500).json({ message: "Error adding employee", error });
  }
});

app.get("/employees", authenticateToken, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error("Error retrieving employees", error);
    res.status(500).json({ message: "Error retrieving employees", error });
  }
});

app.put("/updateEmployee/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { EName, Age, Address, Position } = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { EName, Age, Address, Position },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee updated successfully", updatedEmployee });
  } catch (error) {
    console.error("Error updating employee", error);
    res.status(500).json({ message: "Error updating employee", error });
  }
});

/* Routes for Deleting employee */

app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Employee.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send({ message: 'Employee not found' });
    }
    res.status(200).send({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting employee', error });
  }
});


