var css = ".tabs {\n  display: flex;\n  flex-flow: row; }\n\n.tab-btn {\n  padding: 3px;\n  border: 1px solid black;\n  cursor: pointer;\n  box-shadow: 2px 2px #808080;\n  font-family: monospace;\n  font-weight: 400; }\n  .tab-btn:not(:last-of-type) {\n    margin: 0 3px 0 0; }\n  .tab-btn:hover {\n    box-shadow: unset;\n    font-weight: 600; }\n  .tab-btn:active {\n    box-shadow: inset 2px 2px #808080; }\n  .tab-btn[data-selected=\"true\"] {\n    font-weight: 600;\n    background: #00ffff;\n    box-shadow: inset 2px 2px #33cccc; }\n  .tab-btn[data-disabled=\"true\"] {\n    background-size: 3px 3px;\n    box-shadow: inset 2px 2px #808080;\n    font-weight: 400;\n    background: linear-gradient(90deg, #BDBDBD 2px, transparent 1%) center, linear-gradient(#BDBDBD 2px, transparent 1%) center, #000000;\n    background-size: 3px 3px; }\n\n.pages {\n  padding: 2px;\n  width: inherit;\n  border: 1px solid #000000; }\n\n.page {\n  display: none; }\n  .page[data-visible=\"true\"] {\n    display: block; }\n";

class TabPane extends HTMLElement {
    constructor() {
        super();
        this.selectedPane = 0;
        this.handleTabClick = (event) => {
            const el = event.currentTarget;
            if (!JSON.parse(el.dataset.disabled)) {
                const newIndex = parseInt(el.dataset.index);
                this.setVisiblePage(newIndex);
            }
        };
        const lightPages = Array.from(this.children);
        const template = document.createElement('template');
        template.innerHTML = `
            <style>${css}</style>
            <div class="wrapper">
                <div class="tabs">
                    ${lightPages.map((el, index) => {
            const disabled = el.hasAttribute("disabled");
            return `<div class="tab-btn" data-index="${index}" data-selected="${this.selectedPane === index}" data-disabled="${disabled}">${el.dataset.tab}</div>`;
        }).join('')}
                </div>
                <div class="pages">
                    ${lightPages.map((el, index) => {
            return `<div class="page" data-index="${index}" data-visible="${this.selectedPane === index}">${el.innerHTML}</div>`;
        }).join('')}
                </div>
            </div>
        `;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));
        this.tabBtns = shadowRoot.querySelectorAll(".tab-btn");
        this.pages = shadowRoot.querySelectorAll(".page");
        this.tabBtns.forEach((btn) => {
            btn.addEventListener("click", this.handleTabClick);
        });
    }
    static get observedAttributes() {
        return ["selected"];
    }
    setVisiblePage(newIndex) {
        this.pages.forEach((el, pageIndex) => {
            el.dataset.visible = JSON.stringify(pageIndex === newIndex);
        });
        this.tabBtns.forEach((el, pageIndex) => {
            el.dataset.selected = JSON.stringify(pageIndex === newIndex);
        });
    }
    ;
}
window.customElements.define('tab-pane', TabPane);

export default TabPane;