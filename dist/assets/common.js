/**
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Change the data location to the appropriate loan
// Just pipe the output to a useful location.
var Interest =
/*#__PURE__*/
function () {
  function Interest(_ref) {
    var name = _ref.name,
        journal = _ref.journal,
        interest = _ref.interest;

    _classCallCheck(this, Interest);

    this.name = name;
    this.journal = journal;
    this.interest = interest;
  }

  _createClass(Interest, [{
    key: "run",
    value: function run() {
      var today = new Date();
      var interest = this.interest[0];
      var nextInterestIndex = 1;
      var nextInterest = this.interest[nextInterestIndex];
      nextInterest = nextInterest ? nextInterest : {
        start: new Date(today.getFullYear() + 10, 0, 1) // Arbitrarily long time in the future

      };
      var nextIndex = 1;
      var journal = this.journal;
      var current = this.journal[0];
      var balance = current.amount;
      var currentDate = new Date(current.date.getTime());
      var dayRate = interest.rate / 36500;
      var accumulated = 0;
      var first = Object.assign({}, current);
      first.balance = first.amount;
      var report = [first];

      while (compareDay(currentDate, today) < 1) {
        var next = journal[nextIndex]; // Check for an update of interest

        if (nextInterest && compareDay(currentDate, nextInterest.start) === 0) {
          interest = nextInterest;
          nextInterest = this.interest[++nextInterestIndex];
          report.push({
            type: "CHG",
            description: "Change of interest to " + interest.rate * 100 + "%",
            date: new Date(currentDate)
          });
        } // Process transactions that have come


        while (next && compareDay(currentDate, next.date) === 0) {
          current = next;
          nextIndex++;
          next = journal[nextIndex];
          balance = (Math.round(balance * 100) + Math.round(current.amount * 100)) * 0.01;
          report.push(Object.assign({
            balance: +balance.toFixed(2)
          }, current)); //      console.log("Tranny: ", dateFormat(current.date), current.amount.toFixed(2), balance.toFixed(2));
        } // Add the interest


        accumulated += balance * dayRate; //   console.log("Acc", balance, accumulated)

        if (currentDate.getDate() === 1) {
          balance += accumulated; //console.log("Interest: ", dateFormat(current.date), accumulated.toFixed(2), balance.toFixed(2));

          report.push({
            balance: +balance.toFixed(2),
            type: "INT",
            date: new Date(currentDate),
            amount: +accumulated.toFixed(2),
            description: "Interest"
          });
          accumulated = 0;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      } //console.log("Accumulated interest for current month $" + (-accumulated).toFixed(2));


      if (accumulated) {
        report.push({
          balance: +(+balance + accumulated).toFixed(2),
          type: "INT",
          date: today,
          amount: +accumulated.toFixed(2),
          description: "Interest accumulated so far this month"
        });
      }

      return {
        name: this.name,
        interest: this.interest,
        journal: report
      };
    }
  }]);

  return Interest;
}(); // End


function compareDay(start, end) {
  var comparison = start.getFullYear() * 400 + start.getMonth() * 31 + start.getDate() - (end.getFullYear() * 400 + end.getMonth() * 31 + end.getDate());
  return comparison;
}

function dateFromReverse(str) {
  var year = +str.substring(0, 4);
  var month = lead(str.substring(4, 6)) - 1;
  var day = +lead(str.substring(6));
  return new Date(year, month, day, 12);

  function lead(num) {
    if (num.substring(0, 1) === "0") return num.substring(1);
    return num;
  }
}

function dateFormat(date) {
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var query = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("="); // If first entry with this name

    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]); // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr; // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }

  return query_string;
}();

var UrlParameters =
/*#__PURE__*/
function () {
  function UrlParameters() {
    _classCallCheck(this, UrlParameters);
  }

  _createClass(UrlParameters, null, [{
    key: "parameters",
    value: function parameters() {
      return query;
    }
  }]);

  return UrlParameters;
}();