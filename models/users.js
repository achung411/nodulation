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
	hidden: Boolean
});
UserSchema.path('first_name').required(true, 'User name cannot be blank');
UserSchema.path('last_name').required(true, 'User name cannot be blank');
UserSchema.path('email').required(true, 'User email cannot be blank');
mongoose.model('User', UserSchema);