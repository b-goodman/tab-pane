import style from "./index.scss";

enum TabPosition {
    TOP = "top",
    LEFT = "left",
    RIGHT = "right",
}

export default class TabPane extends HTMLElement {

    static get observedAttributes() {
        return ["selected", "tab-position", "background"];
    }

    constructor() {
        super();

        const lightPages = Array.from(this.children) as HTMLElement[];

        const template = document.createElement('template');
        template.innerHTML = `
            <style>${style}</style>
            <div class="wrapper" data-tab-position="${this.tabPosition}">
                <div class="tabs">
                    ${lightPages.map( (el, index) => {
                        const disabled = el.hasAttribute("disabled");
                        return `<div class="tab-btn" data-index="${index}" data-selected="${this.selectedPane === index}" data-disabled="${disabled}">${el.dataset.tab}</div>`
                    }).join('')}
                </div>
                <div class="pages">
                    <slot></slot>
                </div>
            </div>
        `;

        // ${lightPages.map( (el, index) => {
        //     return `<div class="page" data-index="${index}" data-visible="${this.selectedPane === index}">${el.innerHTML}</div>`
        // }).join('')}

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));

        this.wrapper = this.shadowRoot!.querySelector<HTMLDivElement>(".wrapper")!;
        this.tabBtns = shadowRoot!.querySelectorAll<HTMLDivElement>(".tab-btn");
        this.pages = shadowRoot!.querySelector<HTMLSlotElement>("slot")!.assignedElements() as HTMLElement[];

        this.pages.forEach( (el, index) => {
            el.dataset.index=`${index}`;
            el.dataset.visible=`${this.selectedPane === index}`;
            el.classList.add("page");
        });

        this.tabBtns.forEach( (btn) => {
            btn.addEventListener("click", this.handleTabClick)
        })
    }

    get tabPosition(): TabPosition {
        return this.getAttribute("tab-position") as TabPosition || TabPosition.TOP
    }

    set tabPosition(newPosition: TabPosition) {
        this.setAttribute("tab-position", newPosition)
    }

    public attributeChangedCallback(name: string, _oldVal: string, newVal: string) {
        if (name === "tab-position" && _oldVal !== newVal) {
            this.wrapper.dataset.tabPosition = newVal;
        }
        if (name === "background") {
            this.style.setProperty("--content-bg-color", newVal);
        }
    }

    private selectedPane:number = 0;
    private tabBtns: NodeListOf<HTMLDivElement>;
    private pages: HTMLElement[];
    private wrapper: HTMLDivElement;

    private handleTabClick = (event: MouseEvent) => {
        const el = event.currentTarget! as HTMLDivElement;
        if (!JSON.parse(el.dataset.disabled!)) {
            const newIndex = parseInt(el.dataset.index!);
            this.setVisiblePage(newIndex);
        }
    };

    private setVisiblePage(newIndex: number) {
        this.pages.forEach( (el, pageIndex) => {
            el.dataset.visible = JSON.stringify(pageIndex === newIndex)
        });
        this.tabBtns.forEach( (el, pageIndex) => {
            el.dataset.selected = JSON.stringify(pageIndex === newIndex)
        });
    };

}

window.customElements.define('tab-pane', TabPane);