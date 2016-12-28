'use babel';

export default class MultiPasteView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('multi-paste');
    this.element.tabIndex = "-1"

    const header = document.createElement('header');
    header.classList.add('header');
    this.element.appendChild(header)
    const span = document.createElement('span');
    span.classList.add('header-item');
    span.classList.add('description');
    header.appendChild(span)
    var node = document.createTextNode("Enter paste range in the form: start step");
    span.appendChild(node)

    const section = document.createElement('section');
    section.classList.add('input-block');
    this.element.appendChild(section)
    const input_block = document.createElement('div');
    input_block.classList.add('input-block-item');
    input_block.classList.add('input-block-item--flex');
    input_block.classList.add('editor-container');
    section.appendChild(input_block)
    // Create input element
    const input = document.createElement('atom-text-editor');
    input.classList.add('editor');
    input.classList.add('mini');
    input.tabIndex = "-1"
    input.dataGrammar = "text plain null-grammar"
    node = document.createTextNode("2 2");
    input.appendChild(node)
    input_block.appendChild(input);
    const btn_div = document.createElement('div');
    input.classList.add('input-block-item');
    section.appendChild(btn_div);
    const btn_input = document.createElement('button');
    input.classList.add('btn');
    node = document.createTextNode("Paste");
    btn_input.appendChild(node)
    btn_div.appendChild(btn_input);

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
