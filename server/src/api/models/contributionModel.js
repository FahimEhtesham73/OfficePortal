const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const DateAndContributionSchema = new Schema({
  date: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Validate date format: mm-dd-yyyy
        return /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid date format!`
    }
  },
  contribution: {
    type: String,
    required: true
  }
});

const contributionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  projectCode: { type: String},
  subProjectCode: { type: String},
  dateAndContribution: {
    type: [DateAndContributionSchema],
    required: true
  },
  month: {
    type: String,
    required: true
  }
});

module.exports = model('Contribution', contributionSchema);