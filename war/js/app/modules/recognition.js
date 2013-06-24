/**
 * Created with IntelliJ IDEA.
 * User: max
 * Date: 6/15/13
 * Time: 11:43 PM
 * To change this template use File | Settings | File Templates.
 */

var moduleRecognition = new (function() {

    var url = "https://myscript-webservices.visionobjects.com/api/myscript/v2.0/shape/doSimpleRecognition.json";
    var apiKey = "1d913fe7-b0aa-442a-aaeb-d8a49b508f95";//"582017cd-5564-4dd2-8cc6-85380a64ebb7";
    var appName = "unflunk";
    var board = false;
    var geom = false;

    var recognizeCallBack = function(data) {
        displayResult(data);
    };

    var displayResult = function(jsonResult) {
        //$("#voCanvas").setColor(ctx, "red");
        /** iterating on segments  */
        var strokes = { xPts: [], yPts: [] };
        for(var i=0; i<jsonResult.result.segments.length; i++) {
            var segment = jsonResult.result.segments[i];
            if (segment.elementType === "shape") {
                /** taking selected candidate */
                var candidate = segment.candidates[segment.selectedCandidateIndex];
                if (candidate.type === "recognizedShape") {
                    var primitive;
                    for(var j=0; j<candidate.primitives.length; j++) {
                        primitive = candidate.primitives[j];
                        strokes.type = primitive.type;
                        if(primitive.type === "line") {
                            strokes.xPts.push(primitive.firstPoint.x);
                            strokes.yPts.push(primitive.firstPoint.y);
                        } else if(primitive.type === "ellipse") {
//                            center: Object
//                              x: 372.919
//                            y: 321.41785
//                            maxRadius: 117.57648
//                            minRadius: 78.98579
//                            orientation: -0.2835285
//                            startAngle: -2.1798127
//                            sweepAngle: -6.2831855
                            strokes.maxRadius = primitive.maxRadius;
                            strokes.minRadius = primitive.minRadius;
                        }
                    }
                    if (strokes.type === "line") {
                        if(strokes.xPts.length === 1) {
                            strokes.xPts.push(primitive.lastPoint.x);
                            strokes.yPts.push(primitive.lastPoint.y);
                        }
                        var shapeType;
                        switch(strokes.xPts.length) {
                            case 2:  shapeType = "line"; break;
                            case 3:  shapeType = "triangle"; break;
//                            case 4:  shapeType = "quadrangle"; break;
                            default: shapeType = "polygon"; break;
                        }
                        geom.shapeType = shapeType;
                        geom.xPts = strokes.xPts;
                        geom.yPts = strokes.yPts;
                    }
                }
//                else if (candidate.type === "notRecognized") {
//                    for (var j=0;j<segment.inkRanges.length;j++) {
//                        var inkRange = segment.inkRanges[j];
//                        for (strokeIdx = inkRange.firstStroke; strokeIdx <= inkRange.lastStroke;strokeIdx++) {
//                            firstPoint = (strokeIdx === inkRange.firstStroke)?inkRange.firstPoint:0;
//                            lastPoint = (strokeIdx === inkRange.lastStroke)?inkRange.lastPoint:strokes[strokeIdx].x.length -1;
//                            junkStroke = {
//                                "type":"stroke",
//                                "x" : strokes[strokeIdx].x.slice(firstPoint,lastPoint),
//                                "y" : strokes[strokeIdx].y.slice(firstPoint,lastPoint)
//                            };
//                            //$canvasResult.paintStroke(ctx, junkStroke);
//                        }
//                    }
//                }
            } else {
                continue;
            }
        }
    };

    var recognize = function(strokes) {
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
        /** Post request.   */
        try {
            dojo.request.post(url, {
                handleAs: "json",
                sync: true,
                data: data,
                headers: { "X-Requested-With": "" } // This is required to stop the server from rejecting the  POST request
            }).then(function(data){
                recognizeCallBack(data);
            }, function(err){
                console.error(err);
            }, function(evt){
                // Handle a progress event from the request if the browser supports XHR2
                console.debug('Support XHR2: '+event);
            });
        }catch(err){
            console.error(err);
        }
    };

    this.process = function(currentGeom,currentBoard) {
        console.debug("recognition process");
        geom = currentGeom;
        board = currentBoard;
        var stroke = {
            "type": "stroke",
            "x" : currentGeom.xPts,
            "y" : currentGeom.yPts
        };
        recognize([stroke]);
        return geom;
    };

})();