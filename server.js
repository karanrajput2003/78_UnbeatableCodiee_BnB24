const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser')
const dbConfig = require("./app/config/db.config");
const session = require('express-session');

// var popup = require('popups');


const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(bodyParser.json());

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');

app.use(cors(corsOptions));

app.use("/images", express.static('images'));
app.use("/css", express.static('css'));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Mongoose connection to MongoDB database
const db = require("./app/models");
const Role = db.role;


db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// simple route
app.get("/", (req, res) => {
  // res.json({ message: "Welcome" });
  res.sendFile(__dirname + '/home.html');
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + '/login/login.html');
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + '/login/register.html');
});

app.get("/api/auth/signin", (req, res) => {
  res.render("userhome", {foundUser});

});

app.get("/api/auth/home", (req, res) => {
  res.render("userhome", {foundUser});
});

const db1 = require("./app/models");
const Patients = db1.patient;
const User = db1.user;

app.get("/api/auth/consultStatus", async (req, res) => {

  try {
    
    const user = foundUser.id;
    if (!user) {
      return res.status(404).send("User not found");
    }
    const patients = await Patients.find({ id: user._id });

    res.render("userstatus", { patients });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/auth/pastconsult", (req, res) => {
  res.render("userpastconsultation", {foundUser});
});

app.get("/api/auth/doctorhome", (req, res) => {
  res.render("doctorhome", {foundUser});
});
app.get("/api/auth/consultnow", (req, res) => {
    res.render("consultnow", { foundUser });
});
// app.get("/api/auth/pastconsultdoctor", (req, res) => {
//   res.render("pastconsultdoctor", {foundUser});
// });
app.get("/api/auth/doctorprofile", (req, res) => {
  res.render("doctorprofile", {foundUser});
});


app.get("/api/auth/consultpatient", async (req, res) => {
  try {
    const patients = await Patients.find({ approved: "No" });

    res.render("consultpatient", { patients });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
  // res.render("consultpatient", {foundUser});
});

app.get("/api/auth/pastconsultdoctor", async (req, res) => {
  try {
    const patients = await Patients.find({ approved: "Yes" });

    res.render("pastconsultdoctor", { patients });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
  // res.render("consultpatient", {foundUser});
});

app.get("/api/auth/viewdetails", async (req, res) => {
  try {
    const userId = req.query.id;
    console.log(userId);
    if(!userId) {
      console.log("error");
    }
    const patients = await Patients.find({ _id: userId });

    res.render("viewdetails", { patients });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
  // res.render("consultpatient", {foundUser});
});

app.get("/api/auth/approve", async (req, res) => {
  try {
    const userId = req.query.id;
    console.log(userId);
    if(!userId) {
      console.log("error");
    }
    // const patients = await Patients.find({ _id: userId });
    const patients = await Patients.findByIdAndUpdate(
      userId,
      { approved: "Yes" }
    );
    if (!patients) {
      return res.status(404).send("Patient not found");
    }

    res.render("doctorhome", { patients });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
  // res.render("consultpatient", {foundUser});
});


app.get("/api/auth/userprofile", (req, res) => {
  res.render("userprofile", {foundUser});

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
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}





