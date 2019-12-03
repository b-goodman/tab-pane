declare enum TabPosition {
    TOP = "top",
    LEFT = "left"
}
export default class TabPane extends HTMLElement {
    static get observedAttributes(): string[];
    tabChangeEvent: Event;
    constructor();
    get tabPosition(): TabPosition;
    set tabPosition(newPosition: TabPosition);
    get selectedPane(): number;
    set selectedPane(newPaneIndex: number);
    attributeChangedCallback(name: string, _oldVal: string, newVal: string): void;
    private tabBtns;
    private pages;
    private wrapper;
    private handleTabClick;
    private setVisiblePage;
}
export {};
