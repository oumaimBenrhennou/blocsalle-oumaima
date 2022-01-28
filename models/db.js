const mongoose = require("mongoose");

// mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }, (err) => {
mongoose.connect(
  "mongodb+srv://oumaima:pass@clustersallebloc.h3gtx.mongodb.net/test",

  { useNewUrlParser: true },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection : " + err);
    }
  }
);

require("./bloc.model");
require("./salle.model");
require("./crenau.model");
require("./occupation.model");
