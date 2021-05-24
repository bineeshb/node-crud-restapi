const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: {
    type: String,
    required: [ true, 'User name is required' ],
    unique: [ true, 'User name already exists']
  },
  password: {
    type: String,
    required: [ true, 'Password is required' ],
    minlength: [ 4, 'Password length must be greater than or equal to 4' ]
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: [
      'admin',
      'user'
    ]
  }
});

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function(username, password) {
  const user = await this.findOne({ username });

  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return user;
    }
  }

  throw Error('Invalid Credentials');
};

const User = model('User', userSchema);

module.exports = User;
