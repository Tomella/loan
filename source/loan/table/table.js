{
   angular.module("loan.table", [])

   .directive('loanTable', ['$rootScope', 'loanService', function($rootScope, loanService) {
      return {
         restrict: 'AE',
         templateUrl: "loan/table/table.html",
         link: function(scope) {
            loanService.data().then(data => {
               scope.data = data;
               run();
            });

            $rootScope.$on("updated.interest", run);

            function run() {
               let interest = new Interest(scope.data);
               scope.journal = interest.run().journal;
               scope.payout = scope.journal[scope.journal.length -1].balance;
               scope.now = new Date();
               console.log("After run", scope.journal);
            }
         }
      };
   }]);
}