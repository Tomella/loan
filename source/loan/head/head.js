{
	angular.module("loan.head", [])

	.directive('loanHead', ['loanService', function(loanService) {
      return {
         restrict: 'AE',
         templateUrl: "loan/head/head.html",
         link: function(scope) {
            loanService.data().then(data => {
               console.log("Data", data);
               scope.data = data;
            });
         }
      };
	}]);
}