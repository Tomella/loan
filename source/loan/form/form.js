{
	angular.module("loan.form", [])

	.directive('loanForm', ['$rootScope', 'loanService', function($rootScope, loanService) {
      return {
         restrict: 'AE',
         templateUrl: "loan/form/form.html",
         link: function(scope) {
            loanService.data().then(data => {
               scope.resetValue = data.interest[0].rate;
               scope.interest = data.interest[0];
            });

            scope.setRate = function(rate) {
               $rootScope.$broadcast("updated.interest");
            };

            scope.reset = function() {
               scope.interest.rate = scope.resetValue;
               $rootScope.$broadcast("updated.interest");
            };
         }
      };
	}]);
}