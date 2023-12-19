const mongoose = require('mongoose');

const cardModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlegnth: 2,
    maxlength: 30,
  },

  link: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'owner',
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardModel);
