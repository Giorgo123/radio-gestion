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
    endDate: { type: Date },
  },
  { timestamps: true }
);

const toValidDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getMonthDiffInclusive = (startDate, endDate) => {
  const startYear = startDate.getUTCFullYear();
  const startMonth = startDate.getUTCMonth();
  const endYear = endDate.getUTCFullYear();
  const endMonth = endDate.getUTCMonth();
  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
};

function normalizeMonthlyRange(doc) {
  const startDate = toValidDate(doc.startDate);
  const rawEndDate = toValidDate(doc.endDate) || startDate;

  if (!startDate || !rawEndDate) return;

  const normalizedStart = new Date(
    Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1, 0, 0, 0, 0)
  );
  const normalizedEnd = new Date(
    Date.UTC(rawEndDate.getUTCFullYear(), rawEndDate.getUTCMonth() + 1, 0, 23, 59, 59, 999)
  );

  if (normalizedEnd < normalizedStart) {
    doc.invalidate('endDate', 'El mes de fin no puede ser anterior al mes de inicio');
    return;
  }

  doc.startDate = normalizedStart;
  doc.endDate = normalizedEnd;
  doc.passesCount = getMonthDiffInclusive(normalizedStart, normalizedEnd);
}

function calculateTotal(doc) {
  normalizeMonthlyRange(doc);
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
