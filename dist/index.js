export default class TabPane extends HTMLElement {
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
        const style = `

        :host {
            --selected-color: #00ffff;
            --box-shadow-color: #808080;
            --box-shadow-selected-color: #33cccc;
            --bg-color: #BDBDBD;
            --black: #000000;
            --dot-color: #000000;
            --dot-size: 1px;
            --dot-space: 3px;
            --font-weight: 400;
            --font-weight-selected: 600;
        }

        .tabs {
            display: flex;
            flex-flow: row;
        }

        .tab-btn {
            padding: 3px;
            border: 1px solid black;
            cursor: pointer;
            box-shadow: 2px 2px var(--box-shadow-color);
            font-family: monospace;
            font-weight: var(--font-weight);
        }

        .tab-btn:not(:last-of-type) {
            margin: 0 3px 0 0;
        }

        .tab-btn:hover {
            box-shadow: unset;
            font-weight: var(--font-weight-selected);
        }

        .tab-btn:active {
            box-shadow: inset 2px 2px var(--box-shadow-color);
        }

        .tab-btn[data-selected="true"] {
            font-weight: var(--font-weight-selected);
            background: var(--selected-color);
            box-shadow: inset 2px 2px var(--box-shadow-selected-color);
        }

        .tab-btn[data-disabled="true"], .tab-btn[data-disabled="true"]:hover {
            background: linear-gradient(90deg, var(--bg-color) calc( var(--dot-space) - var(--dot-size) ), transparent 1%) center, linear-gradient(var(--bg-color) calc( var(--dot-space) - var(--dot-size) ), transparent 1%) center, var(--dot-color);
            background-size: var(--dot-space) var(--dot-space);
            box-shadow: inset 2px 2px var(--box-shadow-color);
            font-weight: var(--font-weight);
        }

        .pages {
            padding: 2px;
            width: inherit;
            border: 1px solid var(--black);
        }

        .page {
            display: none;
        }

        .page[data-visible="true"] {
            display: block;
        }
        `;
        const template = document.createElement('template');
        template.innerHTML = `
            <style>${style}</style>
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
//# sourceMappingURL=index.js.map