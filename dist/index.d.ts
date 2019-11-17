export default class TabPane extends HTMLElement {
    static get observedAttributes(): string[];
    constructor();
    private selectedPane;
    private tabBtns;
    private pages;
    private handleTabClick;
    private setVisiblePage;
}
