const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const url = require("url");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const sessionExpiry = 24 * 60 * 60 * 1000;
const Joi = require("joi");
const mongoose = require("mongoose");
const initializeSocket = require("./socket");
const passResetRoutes = require("./routes/resetRoutes");
const chatRoutes = require("./routes/chatRoutes");
const friendRoutes = require("./routes/friendRoutes");
const MongoClient = require("mongodb").MongoClient;
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const eventRoutes = require('./routes/events');
const path = require('path');

const mongo_secret = process.env.MONGODB_SESSION_SECRET;
const node_secret = process.env.NODE_SESSION_SECRET;
const google_client_id = process.env.GOOGLE_CLIENT_ID;
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
const google_callback_url =
  process.env.NODE_ENV === "production"
    ? process.env.GOOGLE_CALLBACK_URL_PROD
    : process.env.GOOGLE_CALLBACK_URL_DEV;
const mongo_uri = process.env.MONGODB_URI;
const mongo_database = process.env.MONGODB_DATABASE;
mongoose.connect(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function catchAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

const client = new MongoClient(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = require("http").Server(app);

client.connect((err) => {
  if (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  } else {
    console.log("Connected to MongoDB");
  }
});

const userCollection = client.db(mongo_database).collection("users");

const User = require("./models/user");

const sessionCollection = MongoStore.create({
  mongoUrl: mongo_uri,
  collectionName: "sessions",
  crypto: {
    secret: mongo_secret,
  },
});

const sessionMiddleware = session({
  secret: node_secret,
  store: sessionCollection,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: sessionExpiry,
  },
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found");
      return done(null, false, { message: "User not found" });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: google_client_id,
      clientSecret: google_client_secret,
      callbackURL: google_callback_url,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        let user = await userCollection.findOne({ googleId: profile.id });
        if (!user) {
          const newUser = {
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            type: "user",
            bio: "",
          };
          const result = await userCollection.insertOne(newUser);
          user = result.ops[0];
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

const io = initializeSocket(server, sessionMiddleware);

const navLinks = [
  { name: "Video Call", link: "/videocall" },
  { name: "Calendar", link: "/calendar" },
  { name: "Logout", link: "/logout" },
];

app.locals.navLinks = navLinks;

app.use((req, res, next) => {
  // console.log(`Received request for ${req.url}`);
  app.locals.currentUrl = url.parse(req.url).pathname;
  res.locals.userId = req.session.userId;
  next();
});

app.use("/api/chat", chatRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/password", passResetRoutes);
app.use('/api/events', eventRoutes);

//Middleware to make the user object available to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user; 
  next();
});

app.get("/", (req, res) => {
  res.render("root", {
    session: req.session,
    userId: req.session.userId || null,
    userName: req.session.username,
  });
});

app.get("/resetPassword", (req, res) => {
  const token = req.query.token;
  console.log(`Rendering resetPassword with token: ${token}`);
  res.render("resetPassword", { token });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signupSubmit", catchAsync(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const userSchema = Joi.object({
    username: Joi.string().alphanum().max(25).required(),
    password: Joi.string().max(25).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
      })
      .required(),
  });

  const validateUser = userSchema.validate({ username, password, email });
  if (validateUser.error != null) {
    console.log(validateUser.error);
    return res.render("signup", { error: validateUser.error.details[0].message });
  }

  const hashedPass = await bcrypt.hash(password, saltRounds);

  try {
    await userCollection.insertOne({
      username: username,
      password: hashedPass,
      email: email,
      type: "user",
      bio: "",
    });

    console.log(`User ${username} successfully added to database.`);

    const user = await userCollection.findOne(
      { email: email },
      { projection: { _id: 1, username: 1, password: 1, email: 1 } }
    );

    req.session.authenticated = true;
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;
    res.redirect("/");
  } catch (err) {
    console.error("Error inserting user:", err);
    res.render("signup", { error: "An error occurred while creating your account. Please try again." });
  }
}));

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/loginSubmit", catchAsync(async (req, res) => {
  const inputEmail = req.body.email;
  const inputPass = req.body.password;

  const loginSchema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
      })
      .required(),
    password: Joi.string().max(25).required(),
  });

  const validateLogin = loginSchema.validate({
    email: inputEmail,
    password: inputPass,
  });

  if (validateLogin.error != null) {
    console.log(validateLogin.error);
    return res.render("login", { error: validateLogin.error.details[0].message });
  }

  const user = await userCollection.findOne(
    { email: inputEmail },
    { projection: { _id: 1, username: 1, password: 1, email: 1, googleId: 1 } }
  );

  if (!user) {
    console.log(`User not found.`);
    return res.render("login", { error: "User not found." });
  }

  console.log("Fetched User:", user);

  if (user.googleId) {
    console.log("Google user logged in");
    req.session.authenticated = true;
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email; 
    return res.redirect("/");
  }

  if (await bcrypt.compare(inputPass, user.password)) {
    console.log("Password is correct");
    req.session.authenticated = true;
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email; 
    res.redirect("/");
  } else {
    console.log("Password incorrect");
    res.render("login", { error: "Password is incorrect." });
  }
}));


app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.authenticated = true;
    req.session.userId = req.user._id;
    req.session.username = req.user.username;
    req.session.email = req.user.email;

    console.log("Session values after Google authentication:", req.session);

    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid", { path: "/" });
  res.render("logout");
});

app.get("/api/friends", catchAsync(async (req, res) => {
  try {
    const friendsCollection = client.db(mongo_database).collection("friendships");
    const friends = await friendsCollection.find().toArray();

    console.log("Begin mapping friends");
    const friendsWithPfp = await Promise.all(friends.map(async (friend) => {
      try {
        const user = await userCollection.findOne(
          { username: friend.username },
          { projection: { pfp: 1 } }
        );

        //attach pfp to friend object (in friends array)
        if (user && user.pfp) {
          friend.pfp = user.pfp;
          console.log(`Appended pfp for ${friend.username}: ${user.pfp}`);
        } else {
          console.log(`User not found or missing pfp for ${friend.username}`);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
      return friend;
    }));

    console.log("Final friends list with pfp:", friendsWithPfp);
    res.json(friendsWithPfp);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}));

app.get("/chat", catchAsync(async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.error(`User not found: ${req.session.userId}`);
      return res.redirect("/login");
    }

    console.log(`User ${user.email} accessing /chat`);

    res.render("chatroom", {
      loadChatScript: true,
    });
  } catch (error) {
    console.error("Error accessing chat:", error);
    res.status(500).send("Internal Server Error");
  }
}));

app.get("/calendar", (req, res) => {
  res.render('calendar', { userId: req.session.userId, userEmail: req.session.email });
});

app.get("/terms-of-service", (req, res) => {
  res.render("termsOfService");
});

app.get("/privacy-policy", (req, res) => {
  res.render("privacyPolicy");
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.get("*", (req, res) => {
  res.status(404);
  res.render("404");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error");
});

server.listen(PORT, () => {
  console.log(`Golden Gaming is listening on port: ${PORT}`);
});
