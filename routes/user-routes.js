require('dotenv').config()
const express = require("express");
const router = express.Router();
const db = require("../models");
const jwt = require('jsonwebtoken')
const acl = require('express-acl');
var bcrypt = require("bcrypt");

// Token
function verifyToken(req, res, next) {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

///Config ACL
let configObject = {
  filename: 'nacl.json',
  path: 'config',
  baseUrl: 'api',
  JSON: true,
  defaultRole: 'user',
  decodedObjectName: 'user',
  denyCallback: (res) => {
    return res.status(403).json({
      status: 'Access Denied',
      success: false,
      message: 'You are not authorized to access this resource'
    });
  }
};


acl.config(configObject);


router.post("/register", (req, res) => {

  db.User.create({
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 8)
  }).then(user =>
    res.send({ user, msg: "account created successfully" })
  );
});

router.post("/login",verifyToken, (req, res) => {
  db.User.findOne({
    where: {
      name: req.body.name
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });

      } else {
        var token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '180s'
        });

        res.status(200).send({
          message: " LOgin successful",
          accessToken: token

        });
      }



    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});
router.get("/all",verifyToken, (req, res) => {
  db.User.findAll({

  }).then(user => {
    res.send(user);
  });
});
router.get("/find/:id", verifyToken, (req, res) => {
  db.User.findAll({
    where: {
      id: req.params.id
    },

  }).then(user => {
    res.send(user);
  });
});

router.delete("/delete/:id", verifyToken, (req, res) => {
  db.User.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => res.send("success"));
});


router.put("/edit", verifyToken, (req, res) => {
  db.User.update(
    {
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password, 8)
    },
    {
      where: { id: req.body.id }
    }
  ).then(() => res.send("success"));
});

module.exports = router;