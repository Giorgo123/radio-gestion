// models/Client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true },
    agency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency' },
    email:  { type: String },
    phone:  { type: String },
    balance:{ type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Client', clientSchema);
