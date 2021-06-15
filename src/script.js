const template = document.createElement("template");
template.innerHTML = `
  <style>
  .user-card {
		font-family: 'Arial', sans-serif;
		background: #f4f4f4;
		max-width: 1000px;
		display: grid;
		grid-template-columns: 200px 2fr;
		grid-gap: 10px;
		margin-bottom: 15px;
    box-shadow: 0 0.75rem 1.5rem rgba(18, 38, 63, 0.03);
    transition: all 0.3s ease-out;
    transform: translateZ(0);
    margin-bottom: 15px;
	}

  @media (max-width: 767px) {
    .user-card {
      grid-template-columns: none;
    }

    .user-card img {
      padding-top: 15px;
      margin: auto;
    }
  }
  
  

  .user-card:hover {
    box-shadow: rgba(45, 45, 45, 0.05) 0px 2px 2px,
      rgba(49, 49, 49, 0.05) 0px 4px 4px, rgba(42, 42, 42, 0.05) 0px 8px 8px,
      rgba(32, 32, 32, 0.05) 0px 16px 16px, rgba(49, 49, 49, 0.05) 0px 32px 32px,
      rgba(35, 35, 35, 0.05) 0px 64px 64px;
    transform: translate(0, -4px);
  }

	.user-card img {
    width: 200px;
    height: 200px;
    objectFit: cover;
	}

  .user-card-details {
    padding: 10px;
  }

  .call-action {
    padding-top: 15px;
    display: block;
  }


  </style>
  <div>
   
  </div>
`;

class DevoleumSteps extends HTMLElement {
  constructor() {
    super();
    this.lang = (navigator.language).substring(0, 2);
    this.showInfo = true;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.historyId = this.getAttribute("historyId");
    this.apiPath = this.getAttribute("apiPath");
    this.steps = [];
    this.populate();
    this.steps.sort(function (a, b) {
      var c = new Date(a.date);
      var d = new Date(b.date);
      return c - d;
    });
  }

  selLang = async (obj) => {
    if (obj[this.lang]  === undefined) {
      obj.en;
    } 
    return obj[this.lang]
  }

  populate = async () => {
    const response = await fetch(
      `${this.apiPath}api/steps/history/${this.historyId}/steps`
    );
    this.steps = await response.json();
    this.steps.forEach(async (el) => {
      const response = await fetch(el.uri);
      const stepFullJson = await response.json();
      const step = await this.selLang(stepFullJson);
      let divCard = document.createElement("div");
      let img = document.createElement("img");
      img.src = step.image;
      divCard.appendChild(img);
      let divDetails = document.createElement("div");
      divCard.appendChild(divDetails);
      divCard.classList.add("user-card");
      divDetails.classList.add("user-card-details");
      let h = document.createElement("H3"); // Create a <h1> element
      let t = document.createTextNode(step.name); // Create a text node
      let desc = document.createTextNode(`${step.date} - ${step.description}`); // Create a text node
      h.appendChild(t);
      // Create anchor element.
      var callToAction = document.createElement("a");
      callToAction.classList.add("call-action");
      // Create the text node for anchor element.
      var link = document.createTextNode(this.lang === "it" ? "Scopri di più" : "Read more");
      // Append the text node to anchor element.
      callToAction.appendChild(link);
      // Set the title.
      callToAction.title = this.lang === "it" ? "Scopri di più" : "Read more";
      // Set the href property.
      callToAction.href = `https://app.devoleum.com/step/${el._id}`;
      callToAction.setAttribute("target", "_blank");
      divDetails.appendChild(h);
      divDetails.appendChild(desc);
      divDetails.appendChild(callToAction);
      this.shadowRoot.appendChild(divCard);
    });
  };

  toggleInfo() {
    this.showInfo = !this.showInfo;

    const info = this.shadowRoot.querySelector(".info");
    const toggleBtn = this.shadowRoot.querySelector("#toggle-info");

    if (this.showInfo) {
      info.style.display = "block";
      toggleBtn.innerText = "Hide Info";
    } else {
      info.style.display = "none";
      toggleBtn.innerText = "Show Info";
    }
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector("#toggle-info")
      .addEventListener("click", () => this.toggleInfo());
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("#toggle-info").removeEventListener();
  }
}

window.customElements.define("devoleum-steps", DevoleumSteps);
