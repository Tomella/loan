const config = require("./lib/config");
const Loans = require("./lib/loans");
const express = require("express");
const mysql = require("mysql");
const port = 4000;

async function main(con) {

   var app = express();

   app.use('/ella', express.static("web"));
   //app.use('/tom', express.static("dist"));
   app.use('/tom', express.static("web"));


   app.get('/ella/data', function (req, res, next) {
      getData(config.loanId.ella, res);
   });


   app.get('/tom/data', function (req, res, next) {
      getData(config.loanId.tom, res);
   });


   app.listen(port, function (err) {
      console.log("running server on port " + port);
   });
}

main();

async function getData(id, res) {
   let connection = await getConnection(config.connection);
   let loans = new Loans(connection);
   loans.data(id).then(result => {
      res.send(result);
      connection.end();
   }).catch(e => {
      res.status(500).send(e);
      connection.end();
   });
}

async function getConnection(config) {
   return new Promise(async (resolve) => {
      let con = mysql.createConnection(config);
      con.connect(async function (err) {
         resolve(con);
      });
   });
}