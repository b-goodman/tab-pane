var css = ":host {\n  --content-bg-color: #ffffff;\n  --bg-color: #BDBDBD;\n  --font-black: #212121;\n  --font-weight: 400;\n  --font-weight-selected: 400;\n  display: block; }\n\n.wrapper {\n  height: inherit;\n  display: flex;\n  flex-direction: column; }\n  .wrapper[data-tab-position=\"left\"] {\n    flex-direction: row; }\n    .wrapper[data-tab-position=\"left\"] .tabs {\n      border-radius: 4px 0 0 4px;\n      padding: 5px 0 5px 10px;\n      flex-flow: column; }\n      .wrapper[data-tab-position=\"left\"] .tabs .tab-btn {\n        border-radius: 5px 0 0 5px;\n        padding: 5px 10px 5px 5px; }\n        .wrapper[data-tab-position=\"left\"] .tabs .tab-btn:hover:not([data-disabled=\"true\"]):not([data-selected=\"true\"]) {\n          background: #e0e0e0;\n          border-radius: 5px 0 0 5px; }\n        .wrapper[data-tab-position=\"left\"] .tabs .tab-btn:not(:last-of-type) {\n          margin: 0 0 1em 0; }\n  .wrapper[data-tab-position=\"top\"] .tabs {\n    border-radius: 4px 4px 0 0;\n    padding: 10px 5px 0 5px; }\n    .wrapper[data-tab-position=\"top\"] .tabs .tab-btn {\n      border-radius: 5px 5px 0 0;\n      padding: 5px 5px 10px 5px; }\n      .wrapper[data-tab-position=\"top\"] .tabs .tab-btn:hover:not([data-disabled=\"true\"]):not([data-selected=\"true\"]) {\n        border-radius: 5px 5px 0 0; }\n      .wrapper[data-tab-position=\"top\"] .tabs .tab-btn:not(:last-of-type) {\n        margin: 0 1em 0 0; }\n  .wrapper[data-tab-position=\"right\"] {\n    flex-direction: row-reverse; }\n    .wrapper[data-tab-position=\"right\"] .tabs {\n      flex-flow: column; }\n\n.tabs {\n  display: flex;\n  flex-flow: row;\n  background: #bdbdbd;\n  padding: 10px 5px 0 5px;\n  border-radius: 4px 4px 0 0; }\n\n.tab-btn {\n  font-family: Arial, \"Helvetica Neue\", Helvetica, sans-serif;\n  font-size: 14px;\n  font-style: normal;\n  font-variant: normal;\n  font-weight: var(--font-weight);\n  color: var(--font-black);\n  padding: 5px 5px 10px 5px;\n  cursor: pointer; }\n  .tab-btn:hover:not([data-disabled=\"true\"]):not([data-selected=\"true\"]) {\n    background: #e0e0e0; }\n  .tab-btn[data-selected=\"true\"] {\n    font-weight: var(--font-weight-selected);\n    background: var(--content-bg-color);\n    white-space: nowrap;\n    overflow: hidden;\n    border-radius: 5px 5px 0 0; }\n  .tab-btn[data-disabled=\"true\"] {\n    font-weight: var(--font-weight);\n    color: gray; }\n\n.pages {\n  width: inherit;\n  height: inherit; }\n\n::slotted(.page) {\n  display: none;\n  height: inherit;\n  background: var(--content-bg-color); }\n\n::slotted(.page[data-visible=\"true\"]) {\n  display: block; }\n";

var TabPosition;
(function (TabPosition) {
    TabPosition["TOP"] = "top";
    TabPosition["LEFT"] = "left";
    TabPosition["RIGHT"] = "right";
})(TabPosition || (TabPosition = {}));
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
            <div class="wrapper" data-tab-position="${this.tabPosition}">
                <div class="tabs">
                    ${lightPages.map((el, index) => {
            const disabled = el.hasAttribute("disabled");
            return `<div class="tab-btn" data-index="${index}" data-selected="${this.selectedPane === index}" data-disabled="${disabled}">${el.dataset.tab}</div>`;
        }).join('')}
                </div>
                <div class="pages">
                    <slot></slot>
                </div>
            </div>
        `;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));
        this.wrapper = this.shadowRoot.querySelector(".wrapper");
        this.tabBtns = shadowRoot.querySelectorAll(".tab-btn");
        this.pages = shadowRoot.querySelector("slot").assignedElements();
        this.pages.forEach((el, index) => {
            el.dataset.index = `${index}`;
            el.dataset.visible = `${this.selectedPane === index}`;
            el.classList.add("page");
        });
        this.tabBtns.forEach((btn) => {
            btn.addEventListener("click", this.handleTabClick);
        });
    }
    static get observedAttributes() {
        return ["selected", "tab-position", "background"];
    }
    get tabPosition() {
        return this.getAttribute("tab-position") || TabPosition.TOP;
    }
    set tabPosition(newPosition) {
        this.setAttribute("tab-position", newPosition);
    }
    attributeChangedCallback(name, _oldVal, newVal) {
        if (name === "tab-position" && _oldVal !== newVal) {
            this.wrapper.dataset.tabPosition = newVal;
        }
        if (name === "background") {
            this.style.setProperty("--content-bg-color", newVal);
        }
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
