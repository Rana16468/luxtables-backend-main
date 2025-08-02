const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  locationAlias: {
    type: String,
    required: true,
  },
  globalATRank: {
    type: String,
    required: true,
  },
  localATRank: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  locationCategoryName: {
    type: String,
    required: true,
  },
  locationCategoryID: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
