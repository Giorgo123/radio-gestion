const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Agency', agencySchema);
