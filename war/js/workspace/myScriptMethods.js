
var visionObjects = new function() {

    var url = "https://myscript-webservices.visionobjects.com/api/myscript/v2.0/shape/doSimpleRecognition.json";
    var apiKey = "1d913fe7-b0aa-442a-aaeb-d8a49b508f95";//"582017cd-5564-4dd2-8cc6-85380a64ebb7";
    var appName = "unflunk";

    var events = [
        { name: "down", func: function(event) {
            event.preventDefault();
            drawing.start(getJxgMouse(event));
        }},
        { name: "move", func: function(event) {
            drawing.move(getJxgMouse(event));
        }},
        { name: "up", func: function(event) {
            event.preventDefault();
            drawing.end();
        }}
    ];

    var board;
    var strokes = [];
    var strokesSave = [];
    var shape = { xPts: [], yPts: [], min: {x:70, y:70}, max: {x:0, y:0} };

    var getJxgMouse = function(evt){
        var gfxCoords = dojo.position(dojo.byId("voCanvas"));
        var jxgCoords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [Math.round(evt.clientX - gfxCoords.x), Math.round(evt.clientY - gfxCoords.y)], board._board);
        return jxgCoords ? { x : jxgCoords.usrCoords[1], y : jxgCoords.usrCoords[2] } : null;
    };

    /** This function creates the JSON object, sends it and retrieves the result. */
    var recognize = function(strokes, handler) {
        var jsonPost =    {
            "components" : strokes
        };
        /** Send data to POST. Give your API key as supplied on registration, or the
         * server will not recognize you as a valid user. */
        var data = {
            "apiKey" : apiKey,
            "application" : appName,
            "shapeInput" : JSON.stringify(jsonPost)
        };
        /** Display the "wait" symbol while processing is underway. */
        $("#loading").show();
        /** Post request.   */
        $.post(url, data, handler, "json")
            .error(function(XMLHttpRequest, textStatus) {
                $("#result").text(textStatus +" : "+ XMLHttpRequest.responseText);
                $("#loading").hide();
            });
    };

    var drawing = new function() {
        var stroke;
        var drawing = false;
        var lastX, lastY;

        var recognizeCallBack = function(data) {
            displayResult(strokes,data);
        };

        this.start = function(pts) {
            stroke = {
                "type":"stroke",
                "x" : [pts.x],
                "y" : [pts.y]
            };
            shape = { xPts: [], yPts: [], min: {x:70, y:70}, max: {x:0, y:0} }; // clear

            if (pts.x < shape.min.x) { shape.min.x = pts.x; }
            if (pts.y < shape.min.y) { shape.min.y = pts.y; }
            if (pts.x > shape.max.x) { shape.max.x = pts.x; }
            if (pts.y > shape.max.y) { shape.max.y = pts.y; }

            lastX = pts.x;
            lastY = pts.y;
            drawing = true;
        };
        this.move = function(pts) {
            if (drawing) {
                board.createLine({
                    x1:lastX, y1:lastY,
                    x2:pts.x, y2:pts.y,
                    stroke: { strokeColor:'blue', strokeWidth:2 }
                });

                stroke.x.push(pts.x);
                stroke.y.push(pts.y);
                if (pts.x < shape.min.x) { shape.min.x = pts.x; }
                if (pts.y < shape.min.y) { shape.min.y = pts.y; }
                if (pts.x > shape.max.x) { shape.max.x = pts.x; }
                if (pts.y > shape.max.y) { shape.max.y = pts.y; }

                lastX = pts.x;
                lastY = pts.y;
            }
        };
        this.end = function() {
            if (drawing) {
                drawing = false;
                strokes.push(stroke);
                while(strokesSave.length !== 0) { strokesSave.pop(); }
                $("#undo").attr("src", "/images/undo.png");
                $("#redo").attr("src", "/images/redo_disabled.png");
                recognize(strokes, recognizeCallBack);
            }
        };
    }();

    var displayResult = function(strokes, jsonResult) {
        //$("#voCanvas").setColor(ctx, "red");
        /** iterating on segments  */
        for(var i=0; i<jsonResult.result.segments.length; i++) {
            var segment = jsonResult.result.segments[i];
            if (segment.elementType === "shape") {
                /** taking selected candidate */
                var candidate = segment.candidates[segment.selectedCandidateIndex];
                if (candidate.type === "recognizedShape") {
                    board.clear();
                    board.initEvents(events);

                    var primitive;
                    for(var j=0; j<candidate.primitives.length; j++) {
                        primitive = candidate.primitives[j];
                        shape.type = primitive.type;
                        console.dir(primitive);
                        if(primitive.type === "line") {
                            shape.xPts.push(primitive.firstPoint.x);
                            shape.yPts.push(primitive.firstPoint.y);
                            board.createLine({
                                x1: primitive.firstPoint.x,
                                y1: primitive.firstPoint.y,
                                x2: primitive.lastPoint.x,
                                y2: primitive.lastPoint.y,
                                stroke: { strokeColor:'red', strokeWidth:2 }
                            });
                        } else if(primitive.type === "ellipse") {
//                            center: Object
//                            x: 372.919
//                            y: 321.41785
//                            maxRadius: 117.57648
//                            minRadius: 78.98579
//                            orientation: -0.2835285
//                            startAngle: -2.1798127
//                            sweepAngle: -6.2831855
                            shape.maxRadius = primitive.maxRadius;
                            shape.minRadius = primitive.minRadius;
                            //board.paintEllipse();
                        }
                    }
                    if (shape.type === "line") {
                        shape.xPts.push(primitive.lastPoint.x);
                        shape.yPts.push(primitive.lastPoint.y);
                    }
                }
                /** junk segment
                 * drawing from original strokes with inkRanges
                 */
                else if (candidate.type === "notRecognized") {
                    for (var j=0;j<segment.inkRanges.length;j++) {
                        var inkRange = segment.inkRanges[j];
                        for (strokeIdx = inkRange.firstStroke; strokeIdx <= inkRange.lastStroke;strokeIdx++) {
                            firstPoint = (strokeIdx === inkRange.firstStroke)?inkRange.firstPoint:0;
                            lastPoint = (strokeIdx === inkRange.lastStroke)?inkRange.lastPoint:strokes[strokeIdx].x.length -1;
                            junkStroke = {
                                "type":"stroke",
                                "x" : strokes[strokeIdx].x.slice(firstPoint,lastPoint),
                                "y" : strokes[strokeIdx].y.slice(firstPoint,lastPoint)
                            };
                            //$canvasResult.paintStroke(ctx, junkStroke);
                        }
                    }
                }
            } else {
                continue;
            }
        }
        $("#loading").hide();
    };

    this.init = function() {
        $("#loading").hide();
        strokes = [];
        strokesSave = [];

        board = new Whiteboard("voCanvas", { boundingbox:[0,70,70,0] });
        board.initEvents(events);
    };

    this.getShapes = function() {
        return [ shape ];
    };

    this.clear = function() {
        JXG.JSXGraph.freeBoard(board._board);
    };
}();