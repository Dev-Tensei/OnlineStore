const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('asdfasdfasdfasdfasd', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// DATA MODEL

const itemSchema = mongoose.Schema({
  item_name: {
    type: String,
    required: true,
  },
  item_price: {
    type: String,
    required: true
  },
  item_points: {
    type: String,
    required: true
  },
  item_quantity: {
    type: String,
    required: true
  },
  img_url: {
    type: String,
    required: true
  },
  dateSubmitted: {
    type: Date
  }
});

const shippingSchema = mongoose.Schema({
  product: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  ship_email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  suite: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  dateSubmitted: {
    type: Date
  }
});

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  cellNumber: {
    type: String
  },
  admin: {
    type: Boolean,
    required: true
  },
  encryptedPassword: {
    type: String,
    required: true
  }
});

const leadSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  dateSubmitted: {
    type: Date
  }
});
// this blacklists the password from showing up in any google inspect tools on client.
userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.encryptedPassword;
  return obj;
};

userSchema.methods.setEncryptedPassword = function (plainPassword, callback) {
  bcrypt.hash(plainPassword, 12).then(hash => {
    this.encryptedPassword = hash;
    callback();
  });
};

userSchema.methods.verifyPassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
    callback(result);
  });
};



const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);
const Shipping = mongoose.model('Shipping', shippingSchema);
const Lead = mongoose.model('Lead', leadSchema);

module.exports = {
  Item: Item,
  User: User,
  Shipping: Shipping,
  Lead: Lead
};