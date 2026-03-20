const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema(
  {
    advertiser: { type: String, required: true, trim: true },
    program: { type: String, required: true, trim: true },
    programDetail: { type: String, trim: true, default: '' },
    schedule: { type: String, required: true, trim: true },
    pricePerSlot: { type: Number, required: true, min: 0 },
    passesCount: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date }
  },
  { timestamps: true }
);

const toValidDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getMonthDiffInclusive = (startDate, endDate) => {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();

  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
};

function normalizeDateRange(doc) {
  const startDate = toValidDate(doc.startDate);
  const endDate = toValidDate(doc.endDate) || startDate;

  if (!startDate || !endDate) return;

  if (endDate < startDate) {
    doc.invalidate('endDate', 'La fecha de fin no puede ser anterior a la fecha de inicio');
    return;
  }

  doc.startDate = startDate;
  doc.endDate = endDate;

  doc.passesCount = getMonthDiffInclusive(startDate, endDate);
}

function calculateTotal(doc) {
  normalizeDateRange(doc);

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