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
</style>

<div class="headContainer">
   <span for="form-interest">Interest rate:</span>
   <input id="form-interest" type="number"  />
   <button id="form-reset-button">Reset</button>
</div>
`;

export default class FormElement extends HTMLElement {

   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector);
   }

   constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(template.content.cloneNode(true));

      let interestInput = this.$("input");
      let interestReset = this.$("button");

      interestInput.addEventListener("change", e => {
         console.log("change", e, interestInput.value);
         sendEvent(interestInput.value);
      });

      interestReset.addEventListener("click", e => {
         console.log("reset", e, interestInput.value);
         if(this.defaultValue != interestInput.value) {
            interestInput.value = this.defaultValue;
            sendEvent(this.defaultValue);
         }

      });

      function sendEvent(value) {
         this.dispatchEvent(new CustomEvent("change", {
            detail: {value}
        }));
      }
   }

   connectedCallback() {
      //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
   }

   set interest(value) {
      let v = this.defaultValue = value?+value.toFixed(2) : 0
      
      this.$("input").value = v;
   }
}

customElements.define('loan-form', FormElement);

