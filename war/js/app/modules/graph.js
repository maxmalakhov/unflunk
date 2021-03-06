/**
 * Created with IntelliJ IDEA.
 * User: max
 * Date: 3/25/13
 * Time: 3:17 PM
 * To change this template use File | Settings | File Templates.
 */

var GraphPreview = {
    sleep: 150,        // delay after keystroke before updating

    preview: null,     // filled in by Init below
    buffer: null,      // filled in by Init below
    bufferCount: 1,

    mathProcessor: null,

    timeout: null,     // store setTimout id
    mjRunning: false,  // true when MathJax is processing
    oldText: null,     // used to check if an update is needed

    //
    //  Get the preview and buffer DIV's
    //
    Init: function () {
        this.preview = document.getElementById("GraphPreview");
        this.buffer = document.getElementById("GraphBuffer");
        this.mathProcessor = new MathProcessor();
    },

    //
    //  Switch the buffer and preview, and display the right one.
    //  (We use visibility:hidden rather than display:none since
    //  the results of running MathJax are more accurate that way.)
    //
    SwapBuffers: function () {
        var buffer = this.preview, preview = this.buffer;
        this.buffer = buffer; this.preview = preview;
        buffer.style.visibility = "hidden";
        buffer.style.position = "absolute";

        preview.style.visibility = "";
        preview.style.position = "";
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
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.CreatePreview(this),this.sleep);
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
        if (that.mjRunning) { return; }
        var text = document.getElementById("GraphInput").value;
        if (text === that.oldtext) {
            return;
        }
        that.oldtext = text;

        var humanFunction = that.ClearFunction(text);

        that.preview.innerHTML = '';
        that.mjRunning = true;

        JXG.Options.renderer = 'svg';
        JXG.Options.text.useMathJax = true;
        var brd = JXG.JSXGraph.initBoard(that.preview.id, {
            boundingbox:[-10,20,10,-5],
            //keepaspectratio: true,
            axis:true,
            //grid:true,
            showNavigation:true,
            showCopyright:false
        });
        brd.create('functiongraph', [function(x) {
            try {
                var formula = humanFunction.replace(/[xX]/g,'('+x+')');
                //console.debug('Formula:'+formula);
                return that.mathProcessor.parse(formula);
            } catch(e) {
                //console.error(e);
                // TODO: Display the error message
                return 0;
            }
        }],{ strokeColor: '#ff0000' });

        brd.create('text',[-4.5,18,
            function() {
                return '\\[f(x) = {' + humanFunction + '}\\]';
            }]);

        that.PreviewDone();
    },

    RenderGraph: function(humanFunction) {
        console.debug('Function: '+humanFunction);

        var processor = new MathProcessor();

        var box = dojo.clone(this.buffer);
        //var box = this.buffer;
        dojo.attr(box,'id',this.buffer.id+(++this.bufferCount));
        dojo.place(box, dojo.byId('graphBox'));
        box.innerHTML = '';

        JXG.Options.renderer = 'svg';
        JXG.Options.text.useMathJax = true;
        var brd = JXG.JSXGraph.initBoard(box.id, {
            boundingbox:[-10,20,10,-5],
            //keepaspectratio: true,
            axis:false,
            //grid:true,
            showNavigation:false,
            showCopyright:false
        });
        brd.create('functiongraph', [function(x) {
            try {
                var formula = humanFunction.replace(/[xX]/g,'('+x+')');
                //console.debug('Formula: '+formula);
                return processor.parse(formula);
            } catch(e) {
                //console.error(e);
                // TODO: Display the error message
                return 0;
            }
        }],{ strokeColor: '#ff0000' });

//        brd.create('text',[-4.5,18,
//            function() {
//                return '\\[f(x) = {' + humanFunction + '}\\]';
//            }]);

        var pathNode = dojo.query('path',box)[0];
        var pathRaw = dojo.attr(pathNode,'d');
        console.debug('Raw Path: "'+pathRaw+'"');

        //var pathCropped = this.CropPath(pathRaw);
        var pathCropped = this.PathToPoints(pathRaw);
        console.dir(pathCropped);

        //console.debug('Cropped Path: "'+pathCropped);

        return pathCropped;
    },

    //
    //  Indicate that MathJax is no longer running,
    //  and swap the buffers to show the results.
    //
    PreviewDone: function () {
        this.mjRunning = false;
        //this.SwapBuffers();
    },

    getSize: function() {
        return { width: this.preview.offsetWidth, height: this.preview.offsetHeight };
    },

    ClearFunction: function (humanFunction) {

        // remove spaces and tabs
        humanFunction = humanFunction.replace(/[ \t\r]+/g,"");
        // discard the left part
        humanFunction = humanFunction.replace(/.*=/g,"");
        console.debug('Function:'+humanFunction);

        return humanFunction;
    },

    CropPath: function(rawPath) {
        var croppedPath;
        var slippedPath = rawPath.split('L');
        if(slippedPath.length > 2) {
            var highLimit = 700;
            var lowLimit = -100;
            var first = true;
            var x, y;
            for(var i = 1; i < slippedPath.length; i++) {
                x = slippedPath[i].split(' ')[1];
                y = slippedPath[i].split(' ')[2];
                if (x > lowLimit && x < highLimit &&
                    y > lowLimit && y < highLimit) {

                    if(first) {
                        croppedPath = 'M '+x+' '+y;
                        first = false;
                    }
                    croppedPath = croppedPath + ' L ' + slippedPath[i];
                }
            }
        } else {
            croppedPath = rawPath;
        }
        return croppedPath;
    },

    PathToPoints: function(rawPath) {
        var Points = function(){
            var xValues = [], yValues = [],
                minX = 0, minY = 0, maxX = 0, maxY = 0;
            this.add = function(x,y) {
                x = parseFloat(x);
                y = parseFloat(y);

                xValues.push(x);
                yValues.push(y);

                if (xValues.length === 1 &&
                    xValues.length === 1) {

                    minX = maxX = x;
                    minY = maxY = y;
                } else {
                    if(x < minX) { minX=x; }
                    if(x > maxX) { maxX=x; }
                    if(y < minY) { minY=y; }
                    if(y > maxY) { maxY=y; }
                }
            },
            this.get = function() {
                return {
                    xValues: xValues,
                    yValues: yValues,
                    center: {
                        x: (maxX + minX)/2,
                        y: (maxY + minY)/2
                    }
                };
            };
        };
        var points = new Points();
        var slippedPath = rawPath.split('L');
        if(slippedPath.length > 2) {
            var highLimit = 700;
            var lowLimit = -100;
            var x, y;
            for(var i = 1; i < slippedPath.length; i++) {
                x = slippedPath[i].split(' ')[1];
                y = slippedPath[i].split(' ')[2];
                if (x > lowLimit && x < highLimit &&
                    y > lowLimit && y < highLimit) {

                    points.add(x,y);
                }
            }
        } else {
            points.add(slippedPath[0].split(' ')[2],slippedPath[0].split(' ')[3]);
            points.add(slippedPath[1].split(' ')[1],slippedPath[1].split(' ')[2]);
        }
        return points.get();
    }
};

//
//  Cache a callback to the CreatePreview action
//
//CurvePreview.callback = //MathJax.Callback(["CreatePreview",Preview]);
//CurvePreview.callback.autoReset = true;  // make sure it can run more than once