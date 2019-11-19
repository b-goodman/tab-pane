declare enum TabPosition {
    TOP = "top",
    LEFT = "left",
    RIGHT = "right"
}
export default class TabPane extends HTMLElement {
    static get observedAttributes(): string[];
    constructor();
    get tabPosition(): TabPosition;
    set tabPosition(newPosition: TabPosition);
    attributeChangedCallback(name: string, _oldVal: string, newVal: string): void;
    private selectedPane;
    private tabBtns;
    private pages;
    private wrapper;
    private handleTabClick;
    private setVisiblePage;
}
export {};
