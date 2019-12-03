import style from "./index.scss";

enum TabPosition {
    TOP = "top",
    LEFT = "left",
    // RIGHT = "right",
}

export default class TabPane extends HTMLElement {

    static get observedAttributes() {
        return ["selected-pane", "tab-position", "background"];
    }

    public tabChangeEvent: Event = new Event("tab-change", {composed: true});

    constructor() {
        super();

        const initialSelectedPane = this.getAttribute("selected-pane");
        if (!initialSelectedPane) {
            this.setAttribute("selected-pane", (this.selectedPane).toString() )
        }

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
        const validPositions = Object.keys(TabPosition);
        if (validPositions.indexOf(newPosition)) {
            this.setAttribute("tab-position", newPosition)
        } else {
            throw new Error(`Attribute "tab-position" must be one of: ${validPositions}`);
        }
    }

    get selectedPane() {
        const attr = this.getAttribute("selected-pane");
        return attr ? parseInt(attr, 10) : 0;
    }

    set selectedPane(newPaneIndex: number) {
        if (newPaneIndex < this.pages.length ) {
            this.setAttribute("selected-pane", newPaneIndex.toString())
        } else {
            throw new Error(`Value of 'selectedPane' must be within range [0, ${this.pages.length - 1}].`);
        }
    }

    public attributeChangedCallback(name: string, _oldVal: string, newVal: string) {
        if (name === "tab-position" && _oldVal !== newVal) {
            const validPositions = Object.keys(TabPosition);
            if (validPositions.indexOf(newVal)) {
                this.wrapper.dataset.tabPosition = newVal;
            } else {
                throw new Error(`Attribute "tab-position" must be one of: ${validPositions}`);
            }
        }
        if (name === "background") {
            this.style.setProperty("--content-bg-color", newVal);
        }
        if (name === "selected-pane" && _oldVal !== newVal) {
            this.setVisiblePage(parseInt(newVal))
        }
    }

    // private selectedPane:number = 0;
    private tabBtns: NodeListOf<HTMLDivElement>;
    private pages: HTMLElement[];
    private wrapper: HTMLDivElement;

    private handleTabClick = (event: MouseEvent) => {
        const el = event.currentTarget! as HTMLDivElement;
        if (!JSON.parse(el.dataset.disabled!)) {
            const newIndex = parseInt(el.dataset.index!);
            // this.setVisiblePage(newIndex);
            this.selectedPane = newIndex;
        }
    };

    private setVisiblePage(newIndex: number) {
        this.pages.forEach( (el, pageIndex) => {
            el.dataset.visible = JSON.stringify(pageIndex === newIndex)
        });
        this.tabBtns.forEach( (el, pageIndex) => {
            el.dataset.selected = JSON.stringify(pageIndex === newIndex)
        });
        this.dispatchEvent(this.tabChangeEvent)
    };

}

window.customElements.define('tab-pane', TabPane);