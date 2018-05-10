# multi-paste2

An [Atom](https://atom.io) package that enhances Atoms pasting operations in combination with multiple selections. This was inspired by the [Text Pastry plugin for Sublime Text](https://github.com/duydao/Text-Pastry) and [multi-paste](https://github.com/bsaendig/multi-paste).

## Features
* Paste a range of numbers into multiple selections
  * 0 to X
  * 1 to X
  * Paste custom range of the form: **start_value [step_value [padding]]**

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

There was already a [Text Pastry package](https://atom.io/packages/text-pastry) for Atom, but it was implemented on an old Atom version and seemed discontinued. So I started my own.

As multi-paste worked like a charm I wanted to implement the padding option that it is present in the corresponding package of Sublime Text.

## Future Features
* paste dates with custom format
* paste cycling list
