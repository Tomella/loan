import Interest from "../util/interest.js";

const template = document.createElement('template');
template.innerHTML = `
<style>
@media only screen and (min-width: 900px) and (max-width: 1199px) {
   .headContainer {
     margin-left: 200px;
   }
 }

 @media only screen and (min-width:1200px) {
   .headContainer {
     margin-left: 400px;
   }
 }
.odd {
   background-color: #e8e8e0;
}
th {
   background-color: #e0e0e0;
}
td {
   padding-left: 12px;
   padding-right: 12px;
}
.money {
   text-align: right;
   font-family: 'Courier New', Courier, monospace;
}

.red-num {
   color: red;
}
</style>
<div class="headContainer">
   Payout figure: <strong class="money" id="payout"></strong> as at <strong id="today"></strong>
</div>
<table class="headContainer">
   <thead>
      <tr>
         <th>Date</th>
         <th>Description</th>
         <th>Amount</th>
         <th>Balance</th>
      </tr>
   </thead>
   <tbody></tbody>
</table>
`;

const rowTemplate = document.createElement('template');
rowTemplate.innerHTML = `
<tr class="row">
   <td id="date"></td>
   <td id="description"></td>
   <td class="money" id="amount"></td>
   <td class="money" id="balance"></td>
</tr>`;

export default class LoanTableElement extends HTMLElement {

   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector);
   }

   constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(template.content.cloneNode(true));
   }

   connectedCallback() {
      //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
   }
   
   set data(value) { 
      this._data = value;
      this.refresh();
   }

   refresh() {
      let data = this._data;
      this.today = new Date();

//      this.$(".money").innerHTML = amount.toFixed(2);
      this.$("#today").innerHTML = this.today.toLocaleDateString("en-AU");

      let interest = new Interest(data);
      this.journal = interest.run().journal;
      this.$("#payout").innerHTML = dollars( -this.journal[this.journal.length -1].balance);
      console.log("After run", this.journal);

      let tbody = this.$("tbody");
      tbody.innerHTML = "";

      this.journal.reverse().forEach((line, index) => {
         let clone = rowTemplate.content.cloneNode(true);
         let amountEl = clone.querySelector("#amount");
         amountEl.innerHTML = dollars(line.amount);
         if(line.amount < 0) amountEl.classList.add("red-num")
         clone.querySelector("#description").innerHTML = line.description;
         clone.querySelector("#balance").innerHTML = dollars(-line.balance);
         clone.querySelector("#date").innerHTML = line.date.toLocaleDateString("en-AU");

         if(index % 2) {
            clone.querySelector("tr").classList.add("odd");
         }

         tbody.appendChild(clone);
      });

   }
}

customElements.define('loan-table', LoanTableElement);


let formatter = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
function dollars(value) {
   return formatter.format(value?value:0); // Strange, I know. We were getting things like -$0.00 and I didn't want sign on zero.
}