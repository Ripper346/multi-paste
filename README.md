# multi-paste

An [Atom](https://atom.io) package that enhances Atoms pasting operations in combination with multiple selections. This was inspired by the [Text Pastry plugin for Sublime Text](https://github.com/duydao/Text-Pastry).

## Features
* Paste a range of numbers into multiple selections
  * 0 to X
  * 1 to X
  * Paste custom range of the form: **start_value step_value**

![screenshot of multi-paste](https://raw.githubusercontent.com/bsaendig/multi-paste/master/multi-paste.gif)

## Keybindings

The commands are:
  * 'multi-paste:0-to-X'
  * 'multi-paste:1-to-X'
  * 'multi-paste:custom-range'

Add them in your keymap.cson like:
```python
'atom-workspace':
  # Key bindings for multi-paste
  'alt-v':        'multi-paste:0-to-X'
  'ctrl-alt-v':   'multi-paste:custom-range'
```

There was already a [Text Pastry package](https://atom.io/packages/text-pastry) for Atom, but it was implemented on an old Atom version and seemed discontinued. So i started my own.
