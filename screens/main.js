class MainScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {     
    }

    attributeChangedCallback(name, oldValue, newValue) {
    }

    connectedCallback() {
        const template = `
            <link rel="stylesheet" href="style.css">
            <h1>Hello World</h1>
            <card-entry></card-entry>
            `;
        this.shadowRoot.innerHTML = template;
    }
}

// export module
window.customElements.define("main-panel", MainScreen);