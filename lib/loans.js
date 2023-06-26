class Loans {
   constructor(con) {
      this.con = con;
   }

   data(loanId) {
      return new Promise((resolve, reject) => {
         this.con.query("select loan.*, customer.given_name from loan inner join customer on loan.customer_id = customer.id  where loan.id = ?", loanId, (error, results, fields) => {
            if (error) {
               reject(error);
            } else {
               let record = results[0];
               let response = {
                  name: record.given_name,
                  start: record.creation_time
               };

               this.con.query("select * from interest where loan_id = ?", loanId, (error, results, fields) => {
                  if (error) {
                     reject(error);
                  } else {
                     response.interest = results.map(interest => ({ start: interest.effect_date, rate: interest.rate }));

                     this.con.query("select * from transaction where loan_id = ? order by effect_date asc", loanId, (error, results, fields) => {
                        if (error) {
                           reject(error);
                        } else {
                           response.journal = results.map(tran => ({ date: tran.effect_date, amount: tran.amount, type: tran.transaction_type, description: tran.comment}));
                           resolve(response);
                        }
                     });
                  }
               });
            }
         });
      });
   }
}

module.exports = Loans;