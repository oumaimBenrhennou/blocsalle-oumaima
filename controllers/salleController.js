const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Salle = mongoose.model("Salle");
const Bloc = mongoose.model("Bloc");
const Occupation = mongoose.model("Occupation");

const qr = require("qrcode");

router.get("/", (req, res) => {
  var ouma = [];

  Bloc.find((err, docs) => {
    if (!err) {
      ouma = JSON.parse(JSON.stringify(docs));
      console.log("ouma" + ouma);
      for (var i = 0; i < ouma.length; i++) {
        var counter = ouma[i];
        console.log(counter.name);
      }

      console.log(docs);
      res.render("salle/addOrEdit", {
        blocs: docs,
        viewTitle: "Ajouter une nouvelle Salle",
      });
    } else {
      console.log("Error in retrieving blocs list :" + err);
    }
  });
});

router.post("/", (req, res) => {
  if (req.body._id == "") insertRecord(req, res);
  else updateRecord(req, res);
});

function insertRecord(req, res) {
  var salle = new Salle();
  salle.name = req.body.name;
  salle.capacite = req.body.capacite;
  Bloc.findById(req.body.hall, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      salle.blocName = docs.name;
      console.log(docs.name);
      salle.bloc = docs;
      salle.save((err, doc) => {
        if (!err) res.redirect("salle/list");
        else {
          if (err.name == "ValidationError") {
            handleValidationError(err, req.body);
            res.render("salle/addOrEdit", {
              viewTitle: "Ajouter une nouvelle Salle",
              salle: req.body,
            });
          } else console.log("Error during record insertion : " + err);
        }
      });
      console.log("Result : ", docs);
    }
  });
  console.log("Bloc.findById(req.body.hall)");

  salle.bloc = Bloc.findById(req.body.hall);
}

function updateRecord(req, res) {
  Salle.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("salle/list");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.render("salle/addOrEdit", {
            viewTitle: "Modifier une Salle",
            salle: req.body,
          });
        } else console.log("Error during record update : " + err);
      }
    }
  );
}

router.get("/list", (req, res) => {
  let ouma = [];
  let oumai = [];
  Salle.find((err, docs) => {
    console.log(docs);
    if (!err) {
      res.render("salle/list", {
        list: docs,
        blocs: ouma,
      });
    } else {
      console.log("Error in retrieving salle list :" + err);
    }
  });
});

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "name":
        body["nameError"] = err.errors[field].message;
        break;
      case "capacite":
        body["capaciteError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

router.get("/:id", (req, res) => {
  Bloc.find((err, docss) => {
    Salle.findById(req.params.id, (err, doc) => {
      if (!err) {
        res.render("salle/addOrEdit", {
          viewTitle: "Modifier une Salle",
          salle: doc,
          blocs: docss,
        });
      }
    });
  });
});
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
router.get("/planing/:id", (req, res) => {
  var ouma = [];
  var oumai = [];
  var oumaima = [];
  var curr = new Date(); // get current date
  var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  for (var i = 0; i < 7; i++) {
    let date = new Date(curr.setDate(first)).toUTCString() + "";
    var lastday = new Date(curr.setDate(first + i)) + "";

    oumai.push(formatDate(lastday));
  }
  console.log(oumai);
  Occupation.find((err, docss) => {
    ouma = JSON.parse(JSON.stringify(docss));
    console.log("ouma" + ouma);

    for (var i = 0; i < ouma.length; i++) {
      var counter = ouma[i];
      if (counter.salle == req.params.id) {
        if (oumai.indexOf(counter.date) > -1) {
          oumaima.push(counter);
        }
      }
    }
    console.log("khadija " + oumaima);
    if (!err) {
      res.render("salle/planing", {
        viewTitle: "planing une Salle",
        blocs: oumaima,
      });
    }
  });
});

router.get("/delete/:id", (req, res) => {
  Salle.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/salle/list");
    } else {
      console.log("Error in salle delete :" + err);
    }
  });
});
//qr Code
router.get("/salleqr/:id", (req, res) => {
  qr.toDataURL(req.params.id, (err, src) => {
    if (err) console.error(err);
    console.log(src);
    res.render("salle/showQRCode", { qr_code: src });
  });
});

router.get("/planing/:id/:occupationId", (req, res) => {
  qr.toDataURL(req.params.occupationId, (err, src) => {
    if (err) console.error(err);
    console.log(src);
    res.render("salle/salleoccupationqr", { qr_code: src });
  });
});

module.exports = router;
