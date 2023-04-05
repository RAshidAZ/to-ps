let mongoose = require('./db');

// grab the things we need
let Schema = mongoose.Schema;

// create a schema
let postSchema = new Schema({

    content: String,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
    isDelete: { type: Boolean, default: false }

}, { minimize: false, timestamps: true }); // Minimize : false --> It stores empty objects.

// we need to create a model using it
let post = mongoose.model('post', postSchema);

module.exports = post;