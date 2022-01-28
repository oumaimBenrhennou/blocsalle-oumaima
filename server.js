require("./models/db");

const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
var app = express();
//----------socket--------------
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const bodyparser = require("body-parser");
//Swagger
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const blocController = require("./controllers/blocController");
const salleController = require("./controllers/salleController");
const apibController = require("./controllers/apibController");
const apisController = require("./controllers/apisController");
const crenauController = require("./controllers/crenauController");
const occupationController = require("./controllers/occupationController");

const mongoose = require("mongoose");
const Crenau = mongoose.model("Crenau");
const Salle = mongoose.model("Salle");
const Occupation = mongoose.model("Occupation");

//added
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
//

// app.set('port', (process.env.PORT || 5000));
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(bodyparser.json());
app.set("views", path.join(__dirname, "/views/"));
//app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set("view engine", "hbs");
//Added
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "mainLayout",
    layoutsDir: __dirname + "/views/layouts/",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
// -----------------------------------SOCKET-----------------------------------

io.on("connection", (socket) => {
  socket.on("addcrenau", async (data) => {
    const _creno = await Crenau.find({
      hrdebut: data.hrdebut,
      hrfin: data.hrfin,
    });
    /*if (_creno.length == 0) {
      console.log("non exist");
      console.log("inserting new creno");
      var crenau = new Crenau();
      crenau.hrdebut = data.hrdebut;
      crenau.hrfin = data.hrfin;
      crenau.save((err, doc) => {
        if (!err) {
          io.emit("carenoadded", { user: data.id, complete: 1 });
        } else {
          io.emit("carenoadded", { user: data.id, complete: -1 });
        }
      });
    } else {
      io.emit("carenoadded", { user: data.id, complete: 0 });
    }*/
  });
  socket.on("getcrenau", async (data) => {
    Crenau.find({}, function (err, _list) {
      if (err) {
        io.emit("information", {
          id: data.id,
          message: "error getting crenaux",
        });
      } else {
        io.emit("crenolist", _list);
      }
    });
  });

  socket.on("getsalleinfo", async (data) => {
    Salle.findById(data.salleid, (err, doc) => {
      if (!err) {
        io.emit("salleinfo", doc);
      } else {
        io.emit("information", {
          id: data.id,
          message: "error getting salle info",
        });
      }
    });
  });

  socket.on("addoccupation", async (data) => {
    var occupation = new Occupation();
    console.log(data.sallename);
    console.log(data.date);
    console.log(data.hrdebut);
    console.log(data.hrfin);

    occupation.namesalle = data.sallename;
    occupation.date = data.date;
    occupation.crenauhr = data.hrdebut + " to " + data.hrfin;
    const _salle = await Salle.find({ id: data.salleid });
    const _creno = await Crenau.find({
      hrdebut: data.hrdebut,
      hrfin: data.hrfin,
    });
    occupation.salle = _salle[0];
    occupation.crenau = _creno[0];
    console.log(_salle[0]);
    console.log(_creno[0]);
    occupation.save((err, doc) => {
      if (!err) {
        io.emit("information", { id: data.id, message: "Occupation Added :)" });
      } else {
        console.log(err);
        io.emit("information", {
          id: data.id,
          message: "Error while adding Occupation",
        });
      }
    });
  });

  //io.emit("documents", Object.keys(documents));
});

///
const port = process.env.PORT || 3000;
// app.listen(app.get('port'), () => {
//   console.log("Express server started at port : "+app.get('port'));

// });
http.listen(port, () => {
  console.log("Node app is running on port", port);
});

app.use("/bloc", blocController);
app.use("/salle", salleController);
app.use("/apib", apibController);
app.use("/apis", apisController);
app.use("/crenau", crenauController);
app.use("/occupation", occupationController);

//app.use("/api", require("./api"));
//Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Salle API",
      version: "1.0.0",
    },
  },
  apis: ["api.js"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.get("/", (req, res) => {
  res.render("bloc/list");
});
