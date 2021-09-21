const mongoose = require("mongoose");
const Contact = mongoose.model("Contact", {
  profile: {
    type: String,
    default: "default",
  },
  nama: {
    type: String,
    required: true,
  },
  namaPanggilan: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  jenisKelamin: {
    type: String,
    require: true,
    default: "-",
  },
});
module.exports = Contact;
