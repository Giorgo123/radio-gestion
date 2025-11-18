const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema(
  {
    advertiser: { type: String, required: true, trim: true },
    program: { type: String, required: true, trim: true },
    schedule: { type: String, required: true, trim: true },
    pricePerSlot: { type: Number, required: true, min: 0 },
    passesCount: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
  },
  { timestamps: true }
);

function calculateTotal(doc) {
  if (doc.pricePerSlot != null && doc.passesCount != null) {
    doc.total = Number(doc.pricePerSlot) * Number(doc.passesCount);
  }
}

contractSchema.pre('validate', function (next) {
  calculateTotal(this);
  next();
});

contractSchema.methods.recalculateTotal = function () {
  calculateTotal(this);
};

module.exports = mongoose.model('Contract', contractSchema);
