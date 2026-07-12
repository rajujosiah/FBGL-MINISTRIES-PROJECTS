const mongoose = require('mongoose');

const stateDistrictSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: null }
});

// Composite unique index to prevent duplicate state-district pairs
stateDistrictSchema.index({ state: 1, district: 1 }, { unique: true });

module.exports = mongoose.model('StateDistrict', stateDistrictSchema);
