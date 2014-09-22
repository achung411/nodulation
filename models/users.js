var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: String,
	password: String,
	work: String,
	hometown: String,
	user_level: { type: Number, default: 1 },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	status: String,
	status_created_at: { type: Date },
	pic: String,
	cover: String,
	hidden: Boolean
});
UserSchema.path('first_name').required(true, 'Please fill out your first name.');
UserSchema.path('last_name').required(true, 'Please fill out your last name.');
UserSchema.path('email').required(true, 'You must enter a valid email address.');
mongoose.model('User', UserSchema);