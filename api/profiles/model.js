const mongoose = require('mongoose');
const { Schema } = mongoose;

const experienceSchema = new Schema({
  title: String,
  company: String,
  startDate: Date,
  endDate: Date,
  description: String
});

const profileSchema = new Schema({
  name: String,
  email: String,
  experiences: [experienceSchema],
  skills: [String],
  information: {
    type: Object,
    default: {}
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);