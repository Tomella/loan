// Change the data location to the appropriate loan
// Just pipe the output to a useful location.
class Interest {
   constructor({name, journal, interest}) {
      this.name = name;
      this.journal = journal;
      this.interest = interest;
   }

   run() {
      const today = new Date();
      let interest = this.interest[0];
      let nextInterestIndex = 1;
      let nextInterest = this.interest[nextInterestIndex];

      nextInterest = nextInterest ? nextInterest :
      {
         start: new Date(today.getFullYear() + 10,0,1) // Arbitrarily long time in the future
      };

      let nextIndex = 1;
      let journal = this.journal;


      let current = this.journal[0];
      let balance = current.amount;
      let currentDate = new Date(current.date.getTime());
      let dayRate = interest.rate / 36500;
      let accumulated = 0;

      let first = Object.assign({}, current);
      first.balance = first.amount;
      let report = [first];
      while(compareDay(currentDate, today) < 1) {
         let next = journal[nextIndex];

         // Check for an update of interest
         if(nextInterest && compareDay(currentDate, nextInterest.start) === 0) {
            interest = nextInterest;
            nextInterest = this.interest[++nextInterestIndex];
            report.push({
               type: "CHG",
               description: "Change of interest to " + interest.rate * 100 + "%",
               date: new Date(currentDate)
            });
         }


         // Process transactions that have come
         while(next && compareDay(currentDate, next.date) === 0) {
            current = next;
            nextIndex++;
            next = journal[nextIndex];
            balance = ((Math.round(balance * 100) + Math.round(current.amount * 100)) * 0.01);

            report.push(Object.assign({balance: +balance.toFixed(2)}, current));
      //      console.log("Tranny: ", dateFormat(current.date), current.amount.toFixed(2), balance.toFixed(2));
         }

         // Add the interest
         accumulated += balance * dayRate;
      //   console.log("Acc", balance, accumulated)
         if(currentDate.getDate() === 1) {
            balance += accumulated;
            //console.log("Interest: ", dateFormat(current.date), accumulated.toFixed(2), balance.toFixed(2));
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
      }

      //console.log("Accumulated interest for current month $" + (-accumulated).toFixed(2));
      if(accumulated) {
         report.push({
            balance: +(+balance + accumulated).toFixed(2),
            type: "INT",
            date: today,
            amount: +(accumulated.toFixed(2)),
            description: "Interest accumulated so far this month"
         });
      }
      return {
         name: this.name,
         interest: this.interest,
         journal: report
      };
   }
}

// End
function compareDay(start, end) {
   let comparison = (start.getFullYear() * 400 + start.getMonth() * 31 + start.getDate())  -
         (end.getFullYear() * 400 + end.getMonth() * 31 + end.getDate());
   return comparison;
}

function dateFromReverse(str) {
   let year =  +str.substring(0, 4);
   let month =  lead(str.substring(4, 6)) - 1;
   let day =  +lead(str.substring(6));
   return new Date(
      year,
      month,
      day,
      12
   );

   function lead(num) {
      if(num.substring(0,1) === "0")
        return num.substring(1);
      return num;
   }
}

function dateFormat(date) {
   return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}