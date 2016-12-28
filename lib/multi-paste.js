'use babel';

import MultiPasteView from './multi-paste-view';
import { CompositeDisposable } from 'atom';

export default {

  multiPasteView: null,
  bottomPanel: null,
  subscriptions: null,

  activate(state) {
    // this.multiPasteView = new MultiPasteView(state.multiPasteViewState);
    // this.bottomPanel = atom.workspace.addBottomPanel({
    //   item: this.multiPasteView.getElement(),
    //   visible: false
    // });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'multi-paste:0-to-X': () => this.paste_range(0,1)
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'multi-paste:1-to-X': () => this.paste_range(1,1)
    }));
    // this.subscriptions.add(atom.commands.add('atom-workspace', {
    //   'multi-paste:custom-range': () => this.toggle_paste_view()
    // }));
  },

  deactivate() {
    this.bottomPanel.destroy();
    this.subscriptions.dispose();
    this.multiPasteView.destroy();
  },

  serialize() {
    return {
      multiPasteViewState: this.multiPasteView.serialize()
    };
  },

  toggle_paste_view() {
   return (
     this.bottomPanel.isVisible() ?
     this.bottomPanel.hide() :
     this.bottomPanel.show()
   );
 },

  paste_range(start, step) {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      checkpoint = editor.createCheckpoint()
      // delete content before reading ranges of selections
      editor.insertText('')
      // Get all the selected ranges (each multiple selection)
      var selections = editor.getSelectedBufferRanges()
      // atom.notifications.addInfo(selections.toString())
      var count = start
      for (var s = 0; s < selections.length; s++) {
        editor.setSelectedBufferRange(selections[s])
        // atom.notifications.addInfo(s.toString() + selections[s].toString())
        editor.insertText(count.toString())
        // multiple cursors in the same row (and further right) need to be moved
        // by the inserted characters
        for (var i = s+1; i < selections.length; i++) {
          if (selections[i].coversSameRows(selections[s]) && selections[i].compare(selections[s]) >= 0) {
            selections[i].traverse([0,count.toString().length])
          }
        }
        count += step
      }
      editor.groupChangesSinceCheckpoint(checkpoint)
    }
  }

};
