const express = require('express');
const cors = require('cors');
const passport = require('./controllers/auth/passport');
const session = require('express-session');
const morgan = require('morgan');
const routes = require('./routes/routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors_config = {
    origin: "*",
};
app.use(cors(cors_config));

const morgan_config = morgan(
    ":method :url :status :res[content-length] - :response-time ms"
  );

// Express session
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(morgan_config)

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use  routes
app.use(routes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
