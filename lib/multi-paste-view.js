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
    this.input = document.createElement('atom-text-editor');
    this.input.classList.add('editor');
    this.input.classList.add('mini');
    this.input.tabIndex = "-1"
    this.input.id = "input"
    this.input.setAttribute("mini","")
    this.input.dataGrammar = "text plain null-grammar"
    this.input_model = this.input.getModel()
    this.input_model.setText("2 2")
    this.input.addEventListener("keydown",  this);

    input_block.appendChild(this.input);
    const btn_div = document.createElement('div');
    btn_div.classList.add('input-block-item');
    section.appendChild(btn_div);
    // const btn_input = document.createElement('button');
    // btn_input.classList.add('btn');
    // node = document.createTextNode("Paste");
    // btn_input.appendChild(node)
    // btn_div.appendChild(btn_input);

  }

  handleEvent = function(e){
    if (e.keyCode === 13) {
      var params = this.input_model.getText().split(" ")
      this.paste_custom_range(parseFloat(params[0]),parseFloat(params[1]))
      this.parentPanel.hide()
      this.editorPane.activate()
    }
    if (e.keyCode === 27) {
      this.parentPanel.hide()
      this.editorPane.activate()
    }
  }
  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  setEditor(editor) {
    this.editor=editor
  }
  setPanel(panel) {
    this.parentPanel=panel
  }
  setPane(pane) {
    this.editorPane=pane
  }

  getEditor() {
    return this.editor
  }

  getElement() {
    return this.element;
  }

  getInputElement() {
    return this.input;
  }

  paste_custom_range(start, step) {
    if(this.editor){
      checkpoint = this.editor.createCheckpoint()
      // delete content before reading ranges of selections
      this.editor.insertText('')
      // Get all the selected ranges (each multiple selection)
      var selections = this.editor.getSelectedBufferRanges()
      // cloning selections array to have a virtual representation where cursors will be later
      var selections_after = selections.slice(0)
      var count = start
      for (var s = 0; s < selections.length; s++) {
        this.editor.setSelectedBufferRange(selections[s])
        // atom.notifications.addInfo(s.toString() + selections[s].toString())
        this.editor.insertText(count.toString())
        selections_after[s]=selections_after[s].traverse([0,count.toString().length])
        // multiple cursors in the same row (and further right) need to be moved
        // by the inserted characters
        for (var i = s+1; i < selections.length; i++) {
          if (selections[i].coversSameRows(selections[s]) && selections[i].compare(selections[s]) >= 0) {
            selections[i]=selections[i].traverse([0,count.toString().length])
            selections_after[i]=selections_after[i].traverse([0,count.toString().length])
          }
        }
        count += step
        //because of weird float accuracy errors
        count = +count.toFixed(5)
      }
      this.editor.setSelectedBufferRanges(selections_after)
      this.editor.groupChangesSinceCheckpoint(checkpoint)
    }
  }
}
