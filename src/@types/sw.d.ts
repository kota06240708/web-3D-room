declare var env: string;

interface Document {
  createStyleSheet: any;
  cssText: string;
  attachEvent: any;
}

interface EventTarget {
  getAttribute: any;
  parentNode: HTMLElement;
  nextElementSibling: HTMLElement;
  currentTarget: any;
}

interface Element {
  style: any;
  parentNode: any;
  attachEvent: any;
  nextElementSibling: any;
}

interface HTMLElement {
  attachEvent: any;
}
