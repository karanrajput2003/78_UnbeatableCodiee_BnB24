const config = require("../config/auth.config");
const db = require("../models");
const express = require("express");



const User = db.user;
const Role = db.role;
const Patients = db.patient;


var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { role } = require("../models"); 
const { application, query } = require("express");
const app = express();

exports.signup = (req, res) => {
  const password = req.body.password;
  if (!password) {
    return res.status(400).json({ error: true, message: "Password is required." });
  }
    console.log(req.body.username);
    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      full_name: req.body.full_name,
      age: req.body.age,
      mobile: req.body.mobile,
      email: req.body.email,
      address: req.body.address,
      pincode: req.body.pincode,
    });

    console.log("Request Body:", req.body);
    console.log("Password:", password);

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.redirect('/login');
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.redirect('/login');
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

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
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      console.log(authorities);
      // res.status(200).send({
      //   id: user._id,
      //   username: user.username,
      //   email: user.email,
      //   roles: authorities,
      //   accessToken: token
      // });
      foundUser = {
        id: user._id,
        username: user.username,
        full_name: user.full_name,
        age: user.age,
        mobile: user.mobile,
        email: user.email,
        address: user.address,
        pincode: user.pincode,
        roles: authorities,
        accessToken: token
      }
      if(foundUser.roles == 'ROLE_USER') {
      res.render("userhome",{foundUser});
      }
      else if(foundUser.roles == 'ROLE_ADMIN') {
        res.render("adminhome",{foundUser});
      }
      else if(foundUser.roles == 'ROLE_MODERATOR') {
        res.render("doctorhome",{foundUser});
      }

      app.get("/api/auth/pastconsult", (req, res) => {
        res.render("userpastconsultation",{foundUser});
      });
      app.get("/api/auth/consultnow", (req, res) => {
        res.render("consultnow",{foundUser});
      });
      app.get("/api/auth/signin", (req, res) => {
        res.render("userhome", {foundUser});
      
      });
      app.get("/api/auth/userprofile", (req, res) => {
        res.render("userhome", {foundUser});
      });

      app.get("/api/auth/adminhome", (req, res) => {
        res.render("adminhome", {foundUser});
      });
      app.get("/api/auth/adminadddoctor", (req, res) => {
        res.render("adminadddoctor", {foundUser});
      });
      app.get("/api/auth/allpatients", (req, res) => {
        res.render("allpatients", {foundUser});
      });
      app.get("/api/auth/alldoctors", (req, res) => {
        res.render("alldoctors", {foundUser});
      });

      // Redirect to /api/test/user with user data
      // res.redirect(`/api/test/admin?${new URLSearchParams(userData).toString()}`);
      // res.redirect('/api/test/admin', { userData });
      // res.redirect(`/api/test/user?id=${user._id}&username=${user.username}&email=${user.email}&roles=${user.roles.join(',')}&accessToken=${user.accessToken}`);
    });
};


exports.dsignup = (req, res) => {
  const password = req.body.password;
  if (!password) {
    return res.status(400).json({ error: true, message: "Password is required." });
  }
    console.log(req.body.username);
    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      full_name: req.body.full_name,
      age: req.body.age,
      mobile: req.body.mobile,
      email: req.body.email,
      address: req.body.address,
      pincode: req.body.pincode,
    });

    console.log("Request Body:", req.body);
    console.log("Password:", password);

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.redirect('/login');
          });
        }
      );
    } else {
      Role.findOne({ name: "moderator" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.redirect('/api/auth/adminhome');
        });
      });
    }
  });
};


exports.consult = (req, res) => {
    console.log(req.body.username);
    const patients = new Patients({
      username: req.body.username,
      id: req.body.id,
      first_time: req.body.first_time,
      // password: bcrypt.hashSync(req.body.password, 8),
      disease_type: req.body.disease_type,
      allergy_type: req.body.allergy_type,
      allergy_severity: req.body.allergy_severity,
      allergy_exists: req.body.allergy_exists,
      medication_type: req.body.medication_type,
      medication_duration: req.body.medication_duration,
      medication_dosage: req.body.medication_dosage,
      query: req.body.query,
      approved: "No"
    });

  patients.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    else {
      res.redirect('/api/auth/userprofile');
    }
  });
};