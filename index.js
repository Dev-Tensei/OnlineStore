const stripe = require("stripe")("asdfasdfasdf");
const express = require('express');
const cors = require('cors');
const model = require('./model');

const session = require('express-session');
const passport = require('passport');
const passportlocal = require('passport-local');

const app = express();
var port = process.env.PORT || 2000;
const YOUR_DOMAIN = 'http://localhost:4242';

app.use(express.urlencoded({extended: false}));
// app.use(cors());

// var allowedOrigins = ['http://localhost:3000',
//                       'http://d00263190.altervista.org/client/table.html'];

app.use(cors({ credentials: true, origin: 'null'}));

// if using altervista use https::/altervista but use the appropriate client origin
// app.use(cors({ credentials: true, origin: 'http://d00263190.altervista.org/client/table.html}))
app.use(express.static('public'));
// passport middlewares
app.use(session({ secret: 'a;lskdfj;laskdfj', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

path = '/items';
user_path = '/users';
shipping_path = '/shippings';

// app.use(express.static("."));
app.use(express.json());

const calculateOrderAmount = items => {
  // console.log(items.id);
  const quantity = 399 * items.amount;
  console.log(quantity);
  return quantity;
};

app.post("/create-payment-intent", async (req, res) => {
  // console.log(req.body.items.amount);
  const { items } = req.body;
  console.log(items.amount);
  // const itemsJson = JSON.parse(req.body);
  // console.log((req.items));
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

// PASSPORT implementation below:

//1. local strategy implementation
passport.use(new passportlocal.Strategy({
  // some configs go here
  usernameField: "email",
  passwordField: "plainPassword"
}, function (email, plainPassword, done) {
  // done is a function, call when done
  model.User.findOne({ email: email }).then(function (user) {
    // verify that the user exists
    if (!user) {
      //fail: user does not exist
      done(null, false);
      return;
    }

    // verify user's password
    user.verifyPassword(plainPassword, function(result) {
      if (result) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }).catch(function(err) {
    done(err);
  });
}));

//2. serialize user to session
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

//3. deserialize user from session
passport.deserializeUser(function (userId, done) {
  model.User.findOne({ _id: userId }).then(function (user) {
    done(null, user);
  }).catch(function(err) {
    done(err);
  });
});

//4. authenticate endpoint
app.post("/session", passport.authenticate("local"), function (req, res) {
  //this function is called if authentication succeeds
  res.sendStatus(201);
});

//5. "me" endpoint
app.get("/session", function (req, res) {
  if (req.user) {
    // send user details
    res.json(req.user);
  } else {
    // send 401
    res.sendStatus(401);
  }
});

app.delete('/session', function(req, res) {
  req.logout();
  res.sendStatus(200);
});


app.get('/items', (req, res) => {
  model.Item.find().then((items) => {
		console.log("we in there, from db:", items);
		res.json(items);
	});

});

app.get(`/items/:itemId`, (req, res) => {
  model.Item.findOne({ _id: req.params.itemId }).then((item) => {
    if (item) {
      res.json(item);
    } else {
      res.sendStatus(404);
    }
  }).catch((err) => {
    res.sendStatus(400);
  })
})

app.get('/shippings', (req, res) => {
  // if (!req.user) {
  //   res.sendStatus(401);
  //   return;
  // }

  // if (path != '/items') {
  //  res.sendStatus(404);
  // }

  // var filter = {
  //   user: req.user._id
  // };

  // res.set("Access-Control-Allow-Origin", "*");
  // model.Lead.find(filter).then((items) => {
  model.Shipping.find().then((shippings) => {
    console.log("we in there, from db:", shippings);
    res.json(shippings);
  });

});

app.post(shipping_path, (req, res) => {

  // this is how it checks if you are logged in first
  // if (!req.user) {
  //   res.sendStatus(401);
  //   return;
  // }

  // if (path != '/items') {
  //  res.sendStatus(404);
  // }
  var shipping = new model.Shipping({
  product: req.body.product,
  full_name: req.body.full_name,
  ship_email: req.body.ship_email,
  address: req.body.address,
  suite: req.body.suite,
  city: req.body.city,
  state: req.body.state,
  zip: req.body.zip,
  amount: req.body.amount,
  dateSubmitted: new Date(),
  });

  shipping.save().then((shipping) => {
    console.log('Shipping created!');
    res.status(201).json(shipping);
  }).catch(function (err) {
    if (err.errors) {
      // mongoose validation faliure!
      var messages = {};
      for (var e in err.errors) {
        messages[e] = err.errors[e].message;
      }
      res.status(422).json(messages);
    } else {
      // some other (probably worse) failure.
      res.sendStatus(500);
    }
  });
});

app.post(path, (req, res) => {

  // this is how it checks if you are logged in first
  // if (!req.user) {
  //   res.sendStatus(401);
  //   return;
  // }

	// if (path != '/items') {
	// 	res.sendStatus(404);
	// }
  var item = new model.Item({
	item_name: req.body.item_name,
	item_price: req.body.item_price,
	item_points: req.body.item_points,
	item_quantity: req.body.item_quantity,
  img_url: req.body.img_url,
	dateSubmitted: new Date(),
  });

  item.save().then((item) => {
    console.log('Item created!');
    res.status(201).json(item);
  }).catch(function (err) {
    if (err.errors) {
      // mongoose validation faliure!
      var messages = {};
      for (var e in err.errors) {
        messages[e] = err.errors[e].message;
      }
      res.status(422).json(messages);
    } else {
      // some other (probably worse) failure.
      res.sendStatus(500);
    }
  });
});


app.get('/leads', (req, res) => {
  model.Lead.find().then((leads) => {
    console.log("we in there, from db:", leads);
    res.json(leads);
  });

});

app.post('/leads', (req, res) => {
  var lead = new model.Lead({
  email: req.body.email,
  dateSubmitted: new Date(),
  });

  lead.save().then((lead) => {
    console.log('Lead created!');
    res.status(201).json(lead);
  }).catch(function (err) {
    if (err.errors) {
      // mongoose validation faliure!
      var messages = {};
      for (var e in err.errors) {
        messages[e] = err.errors[e].message;
      }
      res.status(422).json(messages);
    } else {
      // some other (probably worse) failure.
      res.sendStatus(500);
    }
  });
});

app.put('/items/:id', (req, res) => {
  //if not logged in get tf outta here
  // if (!req.user) {
  //   res.sendStatus(401);
  //   return;
  // }

  model.Item.findOneAndUpdate({ _id: req.params.id }).then((item) => {

      if (item) {
        item.item_name = req.body.item_name;
        item.item_price = req.body.item_price;
        item.item_points = req.body.item_points;
        item.item_quantity = req.body.item_quantity;
        item.img_url = req.body.img_url;
  
        item.save().then(() => {
          console.log('Item updated!');
          res.sendStatus(200);
        }).catch((err) => {
          // problem saving
          console.log(err);
          res.sendStatus(500);
        });
      } else {
        res.sendStatus(404);
      }
  }).catch((err) => {

    res.sendStatus(400);
  })
});

app.post(user_path, (req, res) => {
	// if (user_path == '/users') {
 //    console.log("hey made it");
	// 	res.sendStatus(404);
	// }

  var user = new model.User({
	email: req.body.email,
	firstName: req.body.firstName,
	lastName: req.body.lastName,
  cellNumber: req.body.cellNumber,
  admin: true
  });

  user.setEncryptedPassword(req.body.plainPassword, function() {
	  user.save().then((user) => {
	    console.log('User created!');
	    res.status(201).json(user);
	  }).catch(function (err) {
	    if (err.errors) {
	      // mongoose validation faliure!
	      var messages = {};
	      for (var e in err.errors) {
	        messages[e] = err.errors[e].message;
	      }
	      res.status(422).json(messages);
	    } else if (err.code == 11000){
        console.log("For some reason it thinks it exists");
	    	res.status(422).json({
	    		email: "Already registered"
	    	});
	    } else {
	      // some other (probably worse) failure.
	      res.sendStatus(500);
	      console.log('Unknown error occured:', err);
	    }
	  });
  });
});

app.delete("/items/:id", (req, res) => {
  model.Item.findOneAndDelete({ _id: req.params.id }).then((item) => {
  if ( item ) {
    console.log('Item removed')
    res.sendStatus(200)
  } else {
    res.sendStatus(404);
  }
  }).catch((err) => {
    res.sendStatus(400);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// app.listen(process.env.PORT || 3000);

