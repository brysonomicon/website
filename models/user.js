const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 12;

const userSchema = new Schema({
  googleId: { type: String, unique: true, sparse: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  pfp: { type: String, required: false, unique: true },
});

userSchema.statics.saveResetToken = async function(email, token) {
  const expiry = Date.now() + 3600000; 
  return this.findOneAndUpdate(
    { email: email },
    { resetToken: token, resetTokenExpiry: expiry },
    { new: true }
  );
};

userSchema.statics.resetPassword = async function(token, newPassword) {
  const user = await this.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }, 
  });

  if (!user) {
    throw new Error('Token is invalid or has expired');
  }

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();
};

/**
 * The User model.
 * 
 * Contains a username, an email, a password, and an array of User friends.
 * The password reset process connects a token to the User object that allows
 * the server to know which password to update in the database.
 */
const User = mongoose.model("User", userSchema);
module.exports = User;

