

voInit = function() {
    $(function() {
        var apiKey = "f3469740-d247-11e1-acbf-0025648c5362";
        var appName = "webdemo.shape";

        $("#loading").hide();
        var strokes = [];
        var strokesSave = [];

        var recognizeCallBack = function(data) {
        displayResult(strokes,data);
        }

    $("#voCanvas").addWriteHandlers(strokes, strokesSave, recognizeCallBack, apiKey, appName);
        controllerButtons(strokes, strokesSave, apiKey, appName);
    });
};

/** This function creates the JSON object, sends it and retrieves the result. */
recognize = function(strokes, handler, apiKey, appName, url) {
    if(!url) url = "https://myscript-webservices.visionobjects.com/api/myscript/v2.0/shape/doSimpleRecognition.json";

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

/** These controls handle the canvas clearance and undo/redo capabilities, which are available as buttons in the HTML file. */
controllerButtons = function(strokes, strokesSave, apiKey, url) {

       var recognizeCallBack = function(data) {
              displayResult(strokes,data);
       }

       $("#undo").on("click", function() {
          if(strokes.length > 1) {              
             strokesSave.push(strokes.pop());
             var i;
             var ctx = init($("#canvas"));
             for(i=0; i<strokes.length; i++) {
                $("#canvas").paintStroke(ctx, strokes[i]);
             }
             $("#redo").attr("src", "/images/redo.png");
             recognize(strokes, recognizeCallBack, apiKey, url);
          }
          else if(strokes.length > 0) {              
             strokesSave.push(strokes.pop());
             //init($("#canvasResult"));
             init($("#voCanvas"));
             $("#undo").attr("src", "/images/undo_disabled.png");
             $("#redo").attr("src", "/images/redo.png");
          }
       });
       
       $("#redo").on("click", function() {
          if(strokesSave.length > 0) {
             strokes.push(strokesSave.pop());
             var i;
             var ctx = init($("#voCanvas"));
             for(i=0; i<strokes.length; i++) {
                $("#voCanvas").paintStroke(ctx, strokes[i]);
             }
             recognize(strokes, recognizeCallBack, apiKey, url);
             $("#undo").attr("src", "/images/undo.png");
             if(strokesSave.length == 0)
                $("#redo").attr("src", "/images/redo_disabled.png");
          }
       });

       $("#clear").on("click", function() {
          while(strokes.length != 0) strokes.pop();
          while(strokesSave.length != 0) strokesSave.pop();
          //init($("#canvasResult"));
          init($("#voCanvas"));
          $("#redo").attr("src", "/images/redo_disabled.png");
          $("#undo").attr("src", "/images/undo_disabled.png");
       });
};



/** Draw strokes in the canvas, as specified in the accompanying HTML file. */
$.fn.addWriteHandlers = function(strokes, strokesSave, handler, apiKey, url) {
       var stroke;
       var canvas = this.get(0);
       var ctx = init(this);
       var drawing = false;
       var lastX, lastY;



       var recognizeCallBack = function(data) {
              displayResult(strokes,data);
       }


       var methods = {
          start: function(x, y) {
             stroke = {
             "type":"stroke",
             "x" : [x],
             "y" : [y]
             };
             lastX = x;
             lastY = y;
             drawing = true;
          },
          move: function(x, y) {
             if (drawing) {
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.stroke();
                stroke.x.push(x);
                stroke.y.push(y);
                lastX = x;
                lastY = y;
             }
          },
          end: function() {
             if (drawing) {
                drawing = false;
                strokes.push(stroke);
                while(strokesSave.length != 0) strokesSave.pop();
                $("#undo").attr("src", "/images/undo.png");
                $("#redo").attr("src", "/images/redo_disabled.png");
                recognize(strokes, recognizeCallBack, apiKey, url);
             }
          }
       };

/** Describes the writing events on the canvas, for mouse and touchscreen. */       
       $(canvas).on("touchstart", function(event) {
          event.preventDefault();
          var offset = $(this).first().offset();
          var touch = event.originalEvent.touches[0];
          var x = touch.pageX - offset.left;
          var y = touch.pageY - offset.top;
          methods.start(x, y);
       });
       $(canvas).on("touchmove", function(event) {
          event.preventDefault();
          var offset = $(this).first().offset();
          var touch = event.originalEvent.touches[0];
          var x = touch.pageX - offset.left;
          var y = touch.pageY - offset.top;
          methods.move(x, y);
       });
       $("*").on("touchend", function(event) {
          event.preventDefault();
          methods.end();
       });
       $(canvas).on("gesturestart", function(event) {
          event.preventDefault();
       });
       $(canvas).on("gesturechange", function(event) {
          event.preventDefault();
       });
       $(canvas).on("gestureend", function(event) {
          event.preventDefault();
       });
       $(canvas).on("mousedown", function(event) {
          event.preventDefault();
          var offset = $(this).first().offset();
          var x = event.pageX - offset.left;
          var y = event.pageY - offset.top;
          methods.start(x, y);
       });
       $(canvas).on("mousemove", function(event) {
          event.preventDefault();
          var offset = $(this).first().offset();
          var x = event.pageX - offset.left;
          var y = event.pageY - offset.top;
          methods.move(x, y);
       });
       $("*").on("mouseup", function(event) {
          event.preventDefault();
          methods.end();
       });



};

/** The HTML file has two canvases in fact, one that captures the drawn shapes and
* another that holds the resulting geometrical objects. */
displayResult = function(strokes, jsonResult) {
        var  $canvasResult = $("#voCanvas");
       var ctx = init($canvasResult,"red");
       var i;
       /** iterating on segments  */
       for(i=0; i<jsonResult.result.segments.length; i++) {
              var segment = jsonResult.result.segments[i];
              if (segment.elementType == "shape")
              {
                     /** taking selected candidate */
                     var candidate = segment.candidates[segment.selectedCandidateIndex];
                     if (candidate.type == "recognizedShape")
                     {
                            var j;
                            for(j=0; j<candidate.primitives.length; j++) {
                                   if(candidate.primitives[j].type == "line") {
                                          $canvasResult.paintLine(ctx, candidate.primitives[j]);
                                   }
                                   else if(candidate.primitives[j].type == "ellipse") {
                                          $canvasResult.paintEllipse(ctx, candidate.primitives[j]);
                                   }
                            }
                     }
                     /** junk segment 
                     * drawing from original strokes with inkRanges
                     */
                     else if (candidate.type == "notRecognized") 
                     {                            
                            for (j=0;j<segment.inkRanges.length;j++)
                            {
                                   var inkRange = segment.inkRanges[j];


                                   for (strokeIdx = inkRange.firstStroke; strokeIdx <= inkRange.lastStroke;strokeIdx++)
                                   {
                                          firstPoint = (strokeIdx == inkRange.firstStroke)?inkRange.firstPoint:0;
                                          lastPoint = (strokeIdx == inkRange.lastStroke)?inkRange.lastPoint:strokes[strokeIdx].x.length -1;


                                           junkStroke = {
                                                          "type":"stroke",
                                                          "x" : strokes[strokeIdx].x.slice(firstPoint,lastPoint),
                                                          "y" : strokes[strokeIdx].y.slice(firstPoint,lastPoint)
                                                          };
                                           $canvasResult.paintStroke(ctx, junkStroke);
                                   }

                                   
                            }
                     }
              }
              else
              {
                     continue;
              }
       }


       $("#loading").hide();
};
