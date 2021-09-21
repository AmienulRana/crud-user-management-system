const express = require("express");
const multer = require("multer");
const path = require("path");
require("./utils/db.js");
const Contact = require("./model/contact");

const {
  check,
  body,
  validationResult
} = require("express-validator");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

const imageStorage = multer.diskStorage({
  // destination to share image
  destination: "./public/images",
  filename: (req, file, cb) => {
    cb(null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});
// menampilkann semua data
app.get("/", async (req, res) => {
  // const contacts = await Contact.find();
  // res.render("index", {
  //   allUser: contacts,
  // });
  res.redirect('/add')
});
app.post("/add", upload.single("profile"), (req, res) => {
  const contact = new Contact({
    profile: req.file ? req.file.filename : "default",
    nama: req.body.nama,
    namaPanggilan: req.body.namaPanggilan,
    email: req.body.email,
    jenisKelamin: req.body.jenisKelamin,
  });
  contact.save();
  res.redirect("/");
});
app.get("/add", (req, res) => {
  res.render("add-user");
});
// detail user
app.get("/detail-user", (req, res) => {
  const contacts = Contact.findOne({
    _id: req.query.id
  }, (err, result) => {
    res.render("detail-user", {
      result,
    });
  });
});
app.get("/delete-user", (req, res) => {
  Contact.deleteOne({
    _id: req.query.id
  }, (err, result) => result);
  res.redirect("/");
});
app.get("/update-user", (req, res) => {
  const contact = Contact.findOne({
    _id: req.query.id
  }, (err, result) => {
    res.render("update-user", {
      user: result,
    });
  });
});
app.post("/update-user", upload.single("profile"), (req, res) => {
  Contact.updateOne({
    _id: req.body.id
  }, {
    $set: {
      profile: req.file ? req.file.filename : req.body.profileOld,
      nama: req.body.nama,
      namaPanggilan: req.body.namaPanggilan,
      email: req.body.email,
      jenisKelamin: req.body.jenisKelamin,
    },
  }).then((result) => {
    res.redirect('/');
    console.log(result);

  });
});

app.use((req, res, next) => {
  res.status(404).send("<h1>404, File Not Found</h1>");
  next();
});

app.listen(3000);