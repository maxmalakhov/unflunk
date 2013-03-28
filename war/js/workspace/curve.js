/**
 * Created with IntelliJ IDEA.
 * User: max
 * Date: 3/25/13
 * Time: 3:17 PM
 * To change this template use File | Settings | File Templates.
 */

var CurvePreview = {
    delay: 150,        // delay after keystroke before updating

    preview: null,     // filled in by Init below
    buffer: null,      // filled in by Init below

    timeout: null,     // store setTimout id
    mjRunning: false,  // true when MathJax is processing
    oldText: null,     // used to check if an update is needed

    //
    //  Get the preview and buffer DIV's
    //
    Init: function () {
        this.preview = document.getElementById("GraphPreview");
        this.buffer = document.getElementById("GraphBuffer");
    },

    //
    //  Switch the buffer and preview, and display the right one.
    //  (We use visibility:hidden rather than display:none since
    //  the results of running MathJax are more accurate that way.)
    //
    SwapBuffers: function () {
        var buffer = this.preview, preview = this.buffer;
        this.buffer = buffer; this.preview = preview;
        buffer.style.visibility = "hidden"; buffer.style.position = "absolute";
        preview.style.position = ""; preview.style.visibility = "";
    },

    //
    //  This gets called when a key is pressed in the textarea.
    //  We check if there is already a pending update and clear it if so.
    //  Then set up an update to occur after a small delay (so if more keys
    //    are pressed, the update won't occur until after there has been
    //    a pause in the typing).
    //  The callback function is set up below, after the Preview object is set up.
    //
    Update: function () {
        if (this.timeout) {clearTimeout(this.timeout)}
        this.timeout = setTimeout(this.CreatePreview(this),this.delay);
    },

    //
    //  Creates the preview and runs MathJax on it.
    //  If MathJax is already trying to render the code, return
    //  If the text hasn't changed, return
    //  Otherwise, indicate that MathJax is running, and start the
    //    typesetting.  After it is done, call PreviewDone.
    //
    CreatePreview: function (that) {
        Preview.timeout = null;
        //if (that.mjRunning) return;
        var text = document.getElementById("GraphInput").value;
        if (text === that.oldtext) return;
        that.oldtext = text;
        var compFunction = that.FunctionConvert(text);

        that.preview.innerHTML = '';
        that.mjRunning = true;

        JXG.Options.text.useMathJax = true;
        var brd = JXG.JSXGraph.initBoard(that.preview.id, {
            boundingbox:[-5,20,5,-5],
            //keepaspectratio: true,
            axis:true,
            //grid:true,
            showNavigation:true,
            showCopyright:false
        });
        var k = 1;
        brd.create('functiongraph', [function(x) {
            return JXG.Math.pow(Math.E,x*k);
        }],{ strokeColor:'#ff0000' });

        brd.create('text',[-4.5,18,
            function() {
                return '\\[f(x) = e^{' + k + 'x}\\]';
            }]);

        //that.PreviewDone();
    },

    //
    //  Indicate that MathJax is no longer running,
    //  and swap the buffers to show the results.
    //
    PreviewDone: function () {
        this.mjRunning = false;
        this.SwapBuffers();
    },

    getSize: function() {
        return { width: this.preview.offsetWidth, height: this.preview.offsetHeight };
    },

    FunctionConvert: function (humanFunction) {

        function clear(humanFunction) {
            // remove spaces and tabs
            humanFunction = humanFunction.replace(/[ \t\r]+/g,"");
            // discard the left part
            humanFunction = humanFunction.replace(/.*=/g,"");
            console.debug('Function:'+humanFunction);
            return humanFunction;
        }

        humanFunction = clear(humanFunction);
        function parse(string) {
            var array = [];
            var length = string.length;
            var i = 0;
            var value = "";

            for ( i=0; i<length; i++ ) {
                var prevChar = string.charAt(i-1);
                var currChar = string.charAt(i);
                var nextChar = string.charAt(i+1);
                if(isSymbol(prevChar) && isSymbol(currChar)) {
                    value = value + currChar;
                } else if (!isSymbol(prevChar) && !isSymbol(currChar)) {
                    value = value + currChar;
                } else {
                    array.push(value);
                    value = '';
                }
            }

            //compFunction = compFunction.replace(/e/g,"");
        }

        function isSymbol(symbol) {
            if (symbol.length === 1) {
                return /[xX\d]/g.test(symbol);
            }
            return true;
        }
        function isOpertator(operator) {
            if (operator.length === 1) {
                return /[\+\-\\\*\^e]/g.test(operator);
            }
            return true;
        }

        function isPow(symbol) {
            return /[\^]/g.test(symbol);
        }

        function complementMathObject(string) {
            if(/e/g.test(string)) {
                if(/[xX\d]+e[xX\d]+/.test(string)) {
                    result = string.replace(/e/g,"*$0*");
                } else if(/[xX\d]+e[xX\d]+/.test(string)) {}}
        }


        function isE(string) {
            var result = string;
            if(/e/g.test(string)) {
               if(/[xX\d]+e[xX\d]+/.test(string)) {
                  result = string.replace(/e/g,"*Math.E*");
               } else if(/[xX\d]+e[xX\d]+/.test(string)) {

               }
            }
            return compFunction.replace(/e/g,"Math.E");
        }


        function convertMathConstants(string) {
            //var mathConstants = ['e','ln2','ln10','log2e','log10e','pi','sqrt1_2','sqrt2'];
            return string.replace(/(e|ln2|ln10|log2e|log10e|pi|sqrt1_2|sqrt2)/g,"Math."+"$1".toUpperCase());
        }

        function convertMathFunctions(string) {
            //var mathFunctions = ['abs','acos','asin','atan','atan2','ceil','cos','exp','log','max','min','pow','sin','sqrt','tan'];
            return string.replace(/(abs|acos|asin|atan|atan2|ceil|cos|exp|log|max|min|pow|sin|sqrt|tan)/g,"Math.$1");
        }

        // body methods


        // e^(1x)
        //JXG.Math.pow(Math.E,x*k);
    }
};

//
//  Cache a callback to the CreatePreview action
//
//CurvePreview.callback = //MathJax.Callback(["CreatePreview",Preview]);
//CurvePreview.callback.autoReset = true;  // make sure it can run more than once