const mongoose = require("mongoose");

const patient = mongoose.model(
  "patient",
  new mongoose.Schema({
    username: String,
    first_time: String,
    disease_type: String,
    allergy_type: String,
    allergy_severity: String,
    allergy_exists: String,
    medication_type:String,
    medication_duration:String,
    medication_dosage:String,
    query:String,
    approved:String,
    id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  })
);

module.exports = patient;