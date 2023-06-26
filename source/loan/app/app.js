{
	angular.module("LoanApp", ["loan.form", "loan.head", "loan.table", "loan.templates"])

   .filter('reverse', function() {
      return function(items) {
        return (items?items:[]).slice().reverse();
      };
    })

   .factory('loanService', ['$http', '$rootScope', function ($http, $rootScope) {
      var service = {};
      var getter;

      getter = $http.get('data').then(function (response) {
         let data = response.data;
         data.interest.forEach(interest => interest.start = new Date(interest.start));
         data.journal.forEach(item => {
            item.date = new Date(item.date);
            if(item.type === 'W') {
               if(item.amount > 0) {
                  item.amount *= -1;
               }
            } else if(item.type === 'D') {
               if(item.amount < 0) {
                  item.amount *= -1;
               }
            }
         });
         data.start = new Date(data.start);
         //console.log(data)
         return data;
      });

      service.data = function () {
         return getter;
      };

      return service;
   }]);
}