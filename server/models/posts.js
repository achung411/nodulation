var mongoose = require('mongoose');
var PostSchema = new mongoose.Schema({
	wall_id: String,
	author_id: String,
	content: String,
	pic: String,
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	hidden: Boolean
});
mongoose.model('Post', PostSchema);