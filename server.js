// load .env data into process.env
require("dotenv").config();

// Web server config
const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const PORT = process.env.PORT || 8080;
const app = express();

app.set("view engine", "ejs");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// Allowing express to parse JSON -- using for postman
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["abcdefg"],
  })
);

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require("./routes/users-api");
const widgetApiRoutes = require("./routes/widgets-api");
const usersRoutes = require("./routes/users");
const resourcesRoutes = require("./routes/resources.js");
const resourcesApiRoutes = require("./routes/resources-api");
const profileRoutes = require("./routes/profile");
const createResourceRoutes = require("./routes/create");
const indexRoutes = require("./routes/index");

const likesApiRoutes = require('./routes/likes-api');
const ratingApiRoutes = require('./routes/ratings-api');
const singleCardViewRoutes = require('./routes/cardview.js');

const indexApiRoutes = require('./routes/index-api');
const commentsApiRoutes = require("./routes/comments.js");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use("/api/users", userApiRoutes);
app.use("/api/widgets", widgetApiRoutes);
app.use("/users", usersRoutes);
// Note: mount other resources here, using the same pattern above
app.use("/api/resources", resourcesApiRoutes);

app.use('/resources', resourcesRoutes);
app.use('/profile', profileRoutes);
app.use('/create', createResourceRoutes);
app.use('/api/likes', likesApiRoutes);
app.use('/api/ratings', ratingApiRoutes);


app.use("/api/comments", commentsApiRoutes);
// Home page
app.use('/api/index', indexApiRoutes);
app.use("/", indexRoutes);
app.use("/", singleCardViewRoutes);

// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// app.get('/', (req, res) => {
//   res.render('index');
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
