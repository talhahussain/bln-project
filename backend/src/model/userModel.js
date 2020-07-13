const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { generateOneTimeToken } = require("../utils/helpers");

// name, email, phone, password, confirmpassword, role
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please tell us your name!"]
	},
	email: {
		type: String,
		required: [true, "Please provide your email"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "Please provide a valid email"]
	},
	role: {
		type: String,
		enum: ["rider", "driver"],
		default: "rider"
	},
	password: {
		type: String,
		required: [true, "Please provide a password"],
		minlength: 8,
		select: false
	},
	confirmPassword: {
		type: String,
		required: [true, "Please confirm your password"],
		validate: {
		// This only works on CREATE and SAVE!!!
			validator: function(el) {
				return el === this.password;
			},
			message: "Passwords are not the same!"
		}
	},
	status: {
		type: String,
		enum: ["active", "busy"],
		default: "active"

	},
	address: {
		type: String,
		required: true
	},
	emailConfirmationToken: String,
	confirmationTokenExpires: Date,
	isVerified: {
		type: Boolean,
		default: false,
		select: false
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		select: false
	}
});


// @desc      This query middleware pre-function will encrypt password before creating/saving documents in MongoDB.
userSchema.pre("save", async function(next) {
	// Only run this function if password was actually modified
	if (!this.isModified("password")) return next();

	// Hash the password with cost of 13
	this.password = await bcrypt.hash(this.password, 13);

	// Delete confirmPassword field
	this.confirmPassword = undefined;
	next();
});

// @desc      This Instance method will compare encrypted password with the user provided password on login request.
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

// @desc      This Instance method create email confirmation token for a signedup user.
userSchema.methods.createEmailConfirmationToken = function() {

	// const confirmationToken = crypto.randomBytes(32).toString("hex");
	const confirmationToken = generateOneTimeToken();

	this.emailConfirmationToken = crypto.createHash("sha512").update(confirmationToken).digest("hex");
	console.log({ confirmationToken }, this.emailConfirmationToken);

	// Set ConfirmationTokenExpires time to 01 day for a link
	this.confirmationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

	return confirmationToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
