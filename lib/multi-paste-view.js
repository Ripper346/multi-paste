'use babel';

export default class MultiPasteView {

    constructor(serializedState) {

        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('multi-paste');
        this.element.tabIndex = "-1";

        const header = document.createElement('header');
        header.classList.add('header');
        this.element.appendChild(header);
        const span = document.createElement('span');
        span.classList.add('header-item');
        span.classList.add('description');
        header.appendChild(span);
        var node = document.createTextNode("Enter paste range in the form: start [step [length]]");
        span.appendChild(node);

        const section = document.createElement('section');
        section.classList.add('input-block');
        this.element.appendChild(section);
        const input_block = document.createElement('div');
        input_block.classList.add('input-block-item');
        input_block.classList.add('input-block-item--flex');
        input_block.classList.add('editor-container');
        section.appendChild(input_block)
        // Create input element
        this.input = document.createElement('atom-text-editor');
        this.input.classList.add('editor');
        this.input.classList.add('mini');
        this.input.tabIndex = "-1";
        this.input.id = "input";
        this.input.setAttribute("mini","");
        this.input.dataGrammar = "text plain null-grammar";
        this.input_model = this.input.getModel();
        this.input_model.setText("1 1 2");
        this.input.addEventListener("keydown", this);

        input_block.appendChild(this.input);
        const btn_div = document.createElement('div');
        btn_div.classList.add('input-block-item');
        section.appendChild(btn_div);
    }

    handleEvent = function(e) {
        if (e.keyCode === 13) {
            var params = this.input_model.getText().split(" ");
            if (params.length < 2) params[1] = 1.0;
            if (params.length < 3) params[2] = 0.0;
            this.paste_custom_range(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]));
            this.parentPanel.hide();
            this.editorPane.activate();
        }
        if (e.keyCode === 27) {
            this.parentPanel.hide();
            this.editorPane.activate();
        }
    }
    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    setEditor(editor) {
        this.editor = editor;
    }
    setPanel(panel) {
        this.parentPanel = panel;
    }
    setPane(pane) {
        this.editorPane = pane;
    }

    getEditor() {
        return this.editor;
    }

    getElement() {
        return this.element;
    }

    getInputElement() {
        return this.input;
    }

    paste_custom_range(start, step, numLength) {
        if (this.editor) {
            checkpoint = this.editor.createCheckpoint();
            // delete content before reading ranges of selections
            this.editor.insertText('');
            // Get all the selected ranges (each multiple selection) and order them
            var selections = this.editor.getSelectedBufferRanges().sort(this.orderSelection);
            // cloning selections array to have a virtual representation where cursors will be later
            var selections_after = selections.slice(0);
            var count = start;
            var multiplicator = this.intNumberConverter(start, step);
            var realNumLength = this.getRealLength(start, step, numLength, selections.length);
            for (var s = 0; s < selections.length; s++) {
                this.editor.setSelectedBufferRange(selections[s]);
                // atom.notifications.addInfo(s.toString() + selections[s].toString())
                var textToWrite = this.prepareText(count, realNumLength, multiplicator);
                this.editor.insertText(textToWrite);
                selections_after[s] = selections_after[s].traverse([0, textToWrite.length]);
                // multiple cursors in the same row (and further right) need to be moved
                // by the inserted characters
                for (var i = s + 1; i < selections.length; i++) {
                    if (selections[i].coversSameRows(selections[s]) && selections[i].compare(selections[s]) >= 0) {
                        selections[i] = selections[i].traverse([0, textToWrite.length]);
                        selections_after[i] = selections_after[i].traverse([0, textToWrite.length]);
                    }
                }
                count += step;
            }
            this.editor.setSelectedBufferRanges(selections_after);
            this.editor.groupChangesSinceCheckpoint(checkpoint);
        }
    }

    /**
     * getRealLength - check if the length provided is enough to align all the occurences. If not it calculates the optimal one.
     *
     * @param  {float} start       start number
     * @param  {float} step        number to sum to start
     * @param  {int} numLength     length of the integer part of the number
     * @param  {int} selectionSize count of the places to instert count
     * @return {int}               the optimal size of integer part
     */
    getRealLength(start, step, numLength, selectionSize) {
        if (!numLength) return 0;
        var realNumLength = numLength;
        if (numLength <= Math.round(selectionSize * step + start).toString().length)
            realNumLength = Math.round(selectionSize * step + start).toString().length;
        return realNumLength;
    }

    /**
     * prepareText - pad with zeros the number and round the decimal part to step decimals.
     *
     * @param  {float} count       result of the i-th sum
     * @param  {int} numLength     max length of the positive part of count
     * @param  {int} multiplicator number which if it's multiplied to any count it results an integer, so,
     *                             if casted to string it represents the length of decimal area including point
     * @return {string}            number to write
     */
    prepareText(count, numLength, multiplicator) {
        var text = Math.round(count).toString();
        if (numLength > 0) {
            while (text.length < numLength) {
                text = '0' + text;
            }
        }
        if ((count - Math.floor(count)) > 0) {
            var decimals = (Math.round((count - Math.floor(count)) * multiplicator) / multiplicator).toString().substr(1);
            if (numLength > 0)
                text += this.alignDecimals(multiplicator, decimals);
            else
                text += decimals;
        }
        else if (multiplicator > 1 && numLength > 0) {
            text += this.alignDecimals(multiplicator);
        }
        return text;
    }

    /**
     * intNumberConverter - find the largest multiplicator in which start, step and every count can be an integer.
     *
     * @param  {int} start number to start counting
     * @param  {int} step  number to add to start
     * @return {int}       largest multiple of 10
     */
    intNumberConverter(start, step) {
        var multiplicator = 1;
        while ((step - Math.floor(step)) > 0 || (start - Math.floor(start)) > 0) {
            step *= 10;
            start *= 10;
            multiplicator *= 10;
        }
        return multiplicator;
    }

    /**
     * alignDecimals - add zeros on the right to align decimal area.
     *
     * @param  {int} multiplicator number which if it's multiplied to any count it results an integer, so,
     *                             if casted to string it represents the length of decimal area including point
     * @param  {string} decimals   optional. Decimals to align
     * @return {string}            decimals plus zeros padded right
     */
    alignDecimals(multiplicator, decimals) {
        if (!decimals) decimals = '.';
        while (decimals.length < multiplicator.toString().length)
            decimals += '0';
        return decimals;
    }

    /**
     * orderSelection - order callback for an array of selections. See Array.prototype.sort() for help
     *
     * @param  {range} a first range to compare
     * @param  {range} b second range to compare
     * @return {int}
     */
    orderSelection(a, b) {
        if (a.start.row < b.start.row)
            return -1;
        else if (a.start.row > b.start.row)
            return 1;
        else if (a.start.column < b.start.column)
            return -1;
        else if (a.start.column > b.start.column)
            return 1;
        else
            return 0;
    }
}
