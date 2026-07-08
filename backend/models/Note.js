const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    content: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      default: 'General',
      trim: true,
      maxlength: 40
    },

    color: {
      type: String,
      default: '#00f5ff',
      match: /^#[0-9A-Fa-f]{6}$/
    },

    isPinned: {
      type: Boolean,
      default: false
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Note', noteSchema);