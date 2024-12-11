const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  
  EName: { type: String, required: true },
  Age: { type: Number, required: true },
  Address: { type: String, required: true },
  Position: { type: String, required: true },
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
