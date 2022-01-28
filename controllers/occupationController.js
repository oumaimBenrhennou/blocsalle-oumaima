const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Occupation = mongoose.model("Occupation");
const Salle = mongoose.model("Salle");
const Crenau = mongoose.model("Crenau");

router.get("/api", function (req, res, next) {
  Crenau.find((err, docs) => {
    Salle.find((err, docs) => {
      Occupation.find({})
        .then(function (occupation) {
          res.send(occupation);
        })
        .catch(next);
    });
  });
});

router.post("/api", function (req, res, next) {
  Occupation.create(req.body)
    .then(function (occupation) {
      res.send(occupation);
    })
    .catch(next);
});

router.get("/", (req, res) => {
  Crenau.find((err, docss) => {
    Salle.find((err, docs) => {
      if (!err) {
        console.log(docs);
        console.log(docss);
        res.render("occupation/addOrEdit", {
          salles: docs,
          crenaus: docss,
          viewTitle: "Ajouter une occupation",
        });
      } else {
        console.log("Error in retrieving salles list :" + err);
      }
    });
  });
});

router.post("/", (req, res) => {
  if (req.body._id == "") insertRecord(req, res);
  else updateRecord(req, res);
});

function insertRecord(req, res) {
  var ouma = [];
  var d = false;

  var occupation = new Occupation();

  occupation.date = req.body.date;
  console.log(req.body.crenau + "fggh");
  Crenau.findById(req.body.crenau, function (err, docss) {
    Salle.findById(req.body.salle, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        occupation.namesalle = docs.name;
        occupation.crenauhr = docss.hrdebut + " to " + docss.hrfin;

        occupation.salle = docs;
        occupation.crenau = docss;
        Occupation.find((err, docss) => {
          ouma = JSON.parse(JSON.stringify(docss));
          console.log("ouma" + ouma);

          /* but the problem here we don't start the for loop to start the check
                because ouma.length = 0 and the condition i < ouma.length to satrt the loop
                ouma.length already = 0 the loop will skip
                */
          // here because the loop doesn't work when ouma.length = 0
          if (ouma.length === 0) {
            // if = 0 we will change the d to true to save the data
            d = true;
          } else {
            // if ouma.length != 0 we need the loop to check if data already exsist we will edit not add new
            for (var i = 0; i < ouma.length; i++) {
              var counter = ouma[i];
              console.log(occupation.date + "nohh");
              if (counter.salle == req.body.salle) {
                d = false;
                console.log(req.body.date + "date");

                if (counter.date == req.body.date) {
                  d = false;
                  console.log(occupation.crenauhr);
                  if (
                    occupation.crenauhr.substring(0, 5) >
                      counter.crenauhr.substring(8, 14) ||
                    occupation.crenauhr.substring(8, 14) <
                      counter.crenauhr.substring(0, 5)
                  ) {
                    console.log("counter" + counter.crenauhr.substring(8, 14));

                    d = true;
                  } else {
                    d = false;
                    break;
                  }
                } else {
                  console.log("break");
                  d = true;
                }
              } else {
                // here you can make d = true
                d = true;
              }
            }
          }

          console.log(d + "fin");
          // at first to save the occupation the d should be true
          if (d == true) {
            // the next line save the result to db
            occupation.save((err, doc) => {
              if (!err) res.redirect("occupation/list");
              else {
                if (err.name == "ValidationError") {
                  handleValidationError(err, req.body);
                  res.render("occupation/addOrEdit", {
                    viewTitle: "Insert occupation",
                    occupation: req.body,
                  });
                } else console.log("Error during record insertion : " + err);
              }
            });
          } else {
            res.render("occupation/addOrEdit", {
              viewTitle: "Insert occupation",
              occupation: req.body,
            });
          }
        });

        console.log("occupation : ", docs);
      }
    });
  });

  console.log("Salle.findById(req.body.hall)");

  occupation.salle = Salle.findById(req.body.hall);
  occupation.crenau = Crenau.findById(req.body.hall);
}

function updateRecord(req, res) {
  Occupation.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("occupation/list");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.render("occupation/addOrEdit", {
            viewTitle: "Update occupation",
            occupation: req.body,
          });
        } else console.log("Error during record update : " + err);
      }
    }
  );
}

router.get("/list", (req, res) => {
  Occupation.find((err, docs) => {
    if (!err) {
      res.render("occupation/list", {
        list: docs,
      });
    } else {
      console.log("Error in retrieving occupation list :" + err);
    }
  });
});

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "date":
        body["dateError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

router.get("/:id", (req, res) => {
  Occupation.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("occupation/addOrEdit", {
        viewTitle: "Update occupation",
        occupation: doc,
      });
    }
  });
});

router.get("/delete/:id", (req, res) => {
  Occupation.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/occupation/list");
    } else {
      console.log("Error in occupation delete :" + err);
    }
  });
});

router.put("/api/:id", function (req, res, next) {
  Occupation.findOneAndUpdate({ _id: req.params.id }, req.body).then(function (
    occupation
  ) {
    Occupation.findOne({ _id: req.params.id }).then(function (occupation) {
      res.send(occupation);
    });
  });
});

router.delete("/api/:id", function (req, res, next) {
  Occupation.findOneAndDelete({ _id: req.params.id }).then(function (
    occupation
  ) {
    res.send(occupation);
  });
});

module.exports = router;
