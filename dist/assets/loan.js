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

{
  angular.module("LoanApp", ["loan.form", "loan.head", "loan.table", "loan.templates"]).filter('reverse', function () {
    return function (items) {
      return (items ? items : []).slice().reverse();
    };
  }).factory('loanService', ['$http', '$rootScope', function ($http, $rootScope) {
    var service = {};
    var getter;
    getter = $http.get('data').then(function (response) {
      var data = response.data;
      data.interest.forEach(function (interest) {
        return interest.start = new Date(interest.start);
      });
      data.journal.forEach(function (item) {
        item.date = new Date(item.date);

        if (item.type === 'W') {
          if (item.amount > 0) {
            item.amount *= -1;
          }
        } else if (item.type === 'D') {
          if (item.amount < 0) {
            item.amount *= -1;
          }
        }
      });
      data.start = new Date(data.start); //console.log(data)

      return data;
    });

    service.data = function () {
      return getter;
    };

    return service;
  }]);
}
"use strict";

{
  angular.module("loan.form", []).directive('loanForm', ['$rootScope', 'loanService', function ($rootScope, loanService) {
    return {
      restrict: 'AE',
      templateUrl: "loan/form/form.html",
      link: function link(scope) {
        loanService.data().then(function (data) {
          scope.resetValue = data.interest[0].rate;
          scope.interest = data.interest[0];
        });

        scope.setRate = function (rate) {
          $rootScope.$broadcast("updated.interest");
        };

        scope.reset = function () {
          scope.interest.rate = scope.resetValue;
          $rootScope.$broadcast("updated.interest");
        };
      }
    };
  }]);
}
"use strict";

{
  angular.module("loan.table", []).directive('loanTable', ['$rootScope', 'loanService', function ($rootScope, loanService) {
    return {
      restrict: 'AE',
      templateUrl: "loan/table/table.html",
      link: function link(scope) {
        loanService.data().then(function (data) {
          scope.data = data;
          run();
        });
        $rootScope.$on("updated.interest", run);

        function run() {
          var interest = new Interest(scope.data);
          scope.journal = interest.run().journal;
          scope.payout = scope.journal[scope.journal.length - 1].balance;
          scope.now = new Date();
          console.log("After run", scope.journal);
        }
      }
    };
  }]);
}
"use strict";

{
  angular.module("loan.head", []).directive('loanHead', ['loanService', function (loanService) {
    return {
      restrict: 'AE',
      templateUrl: "loan/head/head.html",
      link: function link(scope) {
        loanService.data().then(function (data) {
          console.log("Data", data);
          scope.data = data;
        });
      }
    };
  }]);
}
angular.module('loan.templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('loan/form/form.html','<div class="headContainer">\r\n   <span for="interest">Interest rate:</span>\r\n   <input id="interest" type="number" ng-model="interest.rate" ng-change="setRate()">\r\n   <button ng-click="reset()">Reset</button>\r\n</div>');
$templateCache.put('loan/table/table.html','<div class="headContainer">Payout figure: <strong class="money">{{-payout | currency}}</strong> as at <strong>{{now | date : \'dd/MM/yyyy\'}}</strong></div>\r\n<table class="center">\r\n   <thead>\r\n      <th>Date</th>\r\n      <th>Description</th>\r\n      <th>Amount</th>\r\n      <th>Balance</th>\r\n   </thead>\r\n   <tbody>\r\n      <tr ng-repeat="transaction in journal | reverse" ng-class="{odd: $odd}">\r\n         <td>\r\n            {{transaction.date | date : \'dd/MM/yyyy\'}}\r\n         </td>\r\n         <td>{{transaction.description}}</td>\r\n         <td class="money" ng-class="{\'red-num\': transaction.type !== \'D\' }">{{transaction.amount | currency}}</td>\r\n         <td class="money">{{-transaction.balance | currency}}</td>\r\n      </tr>\r\n   </tbody>\r\n</table>\r\n');
$templateCache.put('loan/head/head.html','<div class="headContainer">\r\n\r\n<h3>{{data.name}}\'s loan commenced {{data.start | date : \'d/M/yyyy\'}} with an interest\r\n   rate of {{data.interest[0].rate | number : 2}}%</h3>\r\n</div>');}]);