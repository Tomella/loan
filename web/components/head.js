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

<h3><span id="header_name"></span>'s loan commenced <span id="header_start"></span> with an interest
   rate of <span id="header_interest"></span>%</h3>
</div>
`;

export default class HeadElement extends HTMLElement {

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
   
   set start(value) {
      this.$("#header_start").innerHTML = value.toLocaleDateString("en-AU");
   }

   set interest(value) {
      let v = value?+value.toFixed(2) : 0

      this.$("#header_interest").innerHTML = value.toFixed(2);
   }

   set name(value) {
      this.$("#header_name").innerHTML = value;
   }
}

customElements.define('loan-head', HeadElement);

