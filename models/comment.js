let mongoose = require('./db');

// grab the things we need
let Schema = mongoose.Schema;

// create a schema
let commentSchema = new Schema({

    comment: String,
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    isDelete: { type: Boolean, default: false }

}, { minimize: false, timestamps: true }); // Minimize : false --> It stores empty objects.

// we need to create a model using it
let comment = mongoose.model('comment', commentSchema);

module.exports = comment;