// models/Agency.js
const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Agency', agencySchema);
