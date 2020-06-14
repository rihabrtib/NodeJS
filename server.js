const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000
;
const db = require("./models");
const acl = require('express-acl');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(acl.authorize);


const utilisaRoutes = require("./routes/user-routes");
app.use("/api/user", utilisaRoutes);


app.get(acl.authorize);
app.use(acl.authorize.unless({ path: ['/auth/google'] }));



db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
  });

});