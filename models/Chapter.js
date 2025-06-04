const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  class: { type: String, required: true },
  unit: { type: String, required: true },
  yearWiseQuestionCount: {
    type: Map,
    of: Number,
    required: true,
    validate: {
      validator: (map) => {
        const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
        return Array.from(map.keys()).every((key) => years.includes(key));
      },
      message: 'Invalid year in yearWiseQuestionCount',
    },
  },
  questionSolved: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    required: true,
  },
  isWeakChapter: { type: Boolean, required: true },
});

module.exports = mongoose.model('Chapter', chapterSchema);