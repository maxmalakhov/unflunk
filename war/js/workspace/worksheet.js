var tools = [{name: 'hand'}
            ,{name: 'line', showLineColor: true, showLineThickness: true}
            ,{name: 'pen', showLineColor: true, showLineThickness: true}
            ,{name: 'rect', showLineColor: true, showLineThickness: true}
            ,{name: 'ellipse', showLineColor: true, showLineThickness: true}
            ,{name: 'filledRect', showFillColor: true, showLineColor: true, showLineThickness: true}
            ,{name: 'filledEllipse', showFillColor: true, showLineColor: true, showLineThickness: true}
            ,{name: 'text', showLineColor: true, showFontSize: true}
            ,{name: 'delete'}
            ,{name: 'move'}
            ,{name: 'moveUp'}
            ,{name: 'moveDown'}
            ,{name: 'triangle', showLineColor: true, showLineThickness: true}
            ,{name: 'quadrangle', showLineColor: true, showLineThickness: true}
            ,{name: 'circle', showLineColor: true, showLineThickness: true}
            ,{name: 'equation', showLineColor: true}
            ,{name: 'graph', showLineColor: true, showLineThickness: true}
            ,{name: 'visionobjects', showLineColor: true, showLineThickness: true}
            ];

// multiple instances
function Worksheet(id, room) {
    this.room = room;
    this.id = id;

    this.width = 700;
    this.height = 400;
    this.container = null;
    this.drawing = null;
    this.overlayContainer = null;
    this.overlayDrawing = null;
    this.lineColor = "#000000";
    this.fillColor = "#FFFFFF";
    this.lineStroke = 3;
    this.fontSize = 12;
    this.tool = 'pen';
    this.points = [];
    this.mouseDown = false;
    this.overlayShape = false;

}
// Entity methods
Worksheet.prototype = {
    "getNode": function(clazz) {
        return dojo.query("."+clazz, this.id)[0];
    },
    "getWidget": function(clazz) {
        return dijit.getEnclosingWidget(this.getNode(clazz));
    },
    "getDialogWidget": function(clazz) {
        return dijit.getEnclosingWidget(dojo.query('.'+clazz+'.'+this.id)[0]);
    },
    "addTimeRand": function(geom){
        geom.cTime = new Date().getTime();
        geom.cRand = Math.round(100000000000 * Math.random());
        geom.fromUser = userName;
        return geom;
    }
};
Worksheet.prototype.drawFromJSON = function(geom,drawing,strong) {
    var worksheet = this;
    // private methods
    var removeShape = function(geom, drawing){
        var shape = getShapeFromGeom(geom,drawing);
        if(shape){
            drawing.remove(shape);
        }
    };
    var moveShape = function(geom, drawing){
        var shape = getShapeFromGeom(geom,drawing);
        if(shape){
            var scale = (geom.scale) ? geom.scale : 1;
            geom.xPts[0] *= scale;
            geom.yPts[0] *= scale;
            shape.applyTransform({dx: geom.xPts[0], dy: geom.yPts[0]});
            if(shape.wbbb){
                var shapeBounding = shape.getTransformedBoundingBox();
                if(shapeBounding) {
                    shape.wbbb = {
                        x1: shapeBounding[0].x,
                        y1: shapeBounding[0].y,
                        x2: shapeBounding[2].x,
                        y2: shapeBounding[2].y
                    };
                } else {
                    shape.wbbb.x1 += geom.xPts[0];
                    shape.wbbb.x2 += geom.xPts[0];
                    shape.wbbb.y1 += geom.yPts[0];
                    shape.wbbb.y2 += geom.yPts[0];
                }
            }
        }
    };
    var moveShapeUp = function(geom, drawing){
        var shape = getShapeFromGeom(geom,drawing);
        if(shape){
            shape.moveToFront();
        }
    };
    var moveShapeDown = function(geom, drawing){
        var shape = getShapeFromGeom(geom,drawing);
        if(shape){
            shape.moveToBack();
        }
    };
    var getShapeFromGeom = function(geom, drawing){
        var retVal = null;
        dojo.every(drawing.children, function(shape){
            if((shape.cRand === geom.cRand) && (shape.cTime === geom.cTime)){
                retVal = shape;
                return false;
            }
            return true; // keep going until we find one that isn't
        });
        return retVal;
    };
    var getBoundingBox = function(geom){
        if(geom.xPts && geom.yPts){
            var xs = geom.xPts;
            var ys = geom.yPts;
            var bb = {x1: 0, x2: -1, y1: 0, y2: -1 };

            if(xs.length > 1){
                bb.x1 = xs[0];
                bb.x2 = xs[1];
                dojo.forEach(xs, function(x){
                    if(x < bb.x1){
                        bb.x1 = x;
                    }
                    else if(x > bb.x2){
                        bb.x2 = x;
                    }
                });
            }
            if(ys.length > 1){
                bb.y1 = ys[0];
                bb.y2 = ys[1];
                dojo.forEach(ys, function(y){
                    if(y < bb.y1){
                        bb.y1 = y;
                    }
                    else if(y > bb.y2){
                        bb.y2 = y;
                    }
                });
            }
            return bb;
        } else {
            return null;
        }
    };
    // method body
    //console.debug("Render a shape - "+geom.shapeType);
    if(geom && geom.shapeType){
        var shape = false;
        var line = false;
        var stroke = {color: geom.lineColor, width: geom.lineStroke};
        if(geom.shapeType === 'rect'){
            shape = drawing.createRect({x: geom.xPts[0], y: geom.yPts[0], width: (geom.xPts[1] - geom.xPts[0]), height: (geom.yPts[1] - geom.yPts[0]) });
        } else if(geom.shapeType === 'image'){
            var imgData = geom.dataStr || ((geom.data) ? geom.data.value : null);
            if(imgData && strong){
                window.URL = window.URL || window.webkitURL;

                var href2 = "/images/save.png";

                // TODO: It's work fine
                try {
                    var img = new Image();
                    img.type = "image/svg+xml";
                    img.addEventListener("load", function(){
                        shape = drawing.createImage({
                            x:xSize[0],
                            y:ySize[0],
                            width: xSize[1],
                            height: ySize[1],
                            src: href2
                        });
                        //window.URL.revokeObjectURL(href);
                    });
                    img.src = href2;
                } catch(ex) {
                    console.error(ex);
                    console.trace();
                }
            }
        } else if(geom.shapeType === 'pdf'){
            shape = drawing.createPdf({src:geom.text, x:geom.xPts[0], y:geom.yPts[0]});
        } else if ( geom.shapeType === 'video' ) {
            shape = drawing.createVideo({src:geom.text, x:geom.xPts[0], y:geom.yPts[0]});
        } else if(geom.shapeType === 'line') {
            shape = drawing.createLine(geom.xPts, geom.yPts);
            stroke.cap = 'round';
        } else if(geom.shapeType === 'text'){
            shape = drawing.createText({ x:geom.xPts[0], y:geom.yPts[0] + geom.lineStroke, text:geom.text});
            shape.setFont({ size:(geom.lineStroke + "pt"), weight:"normal", family:"Arial" });
            shape.setFill(geom.lineColor);
        } else if(geom.shapeType === 'ellipse'){
            shape = drawing.createEllipse({cx: ((geom.xPts[1] - geom.xPts[0])/2) + geom.xPts[0],
                cy: ((geom.yPts[1] - geom.yPts[0])/2) + geom.yPts[0],
                rx: (geom.xPts[1] - geom.xPts[0])/2,
                ry: (geom.yPts[1] - geom.yPts[0])/2 });
        } else if(geom.shapeType === 'pen'){
            if(geom.xPts){
                if(geom.xPts.length > 1){
                    //console.log("num pen points drawing:",geom.xPts.length);
                    //shape = drawing.createGroup();
                    for(var i = 0; i < (geom.xPts.length - 1); i++){
                        var lineShape = drawing.createPenLine({x1: geom.xPts[i], y1: geom.yPts[i], x2: geom.xPts[i + 1], y2: geom.yPts[i + 1]});
                        //stroke.cap = 'round';
                        lineShape.setStroke(stroke);
                        //shape.add(lineShape);
                    }
                }
            }
        } else if(geom.shapeType === 'clear'){
            drawing.clear();
        } else if(geom.shapeType === 'delete'){
            removeShape(geom,drawing);
        } else if(geom.shapeType === 'move'){
            moveShape(geom,drawing);
        } else if(geom.shapeType === 'moveUp'){
            moveShapeUp(geom,drawing);
        } else if(geom.shapeType === 'moveDown'){
            moveShapeDown(geom,drawing);
        } else if(geom.shapeType === 'select'){
            shape = drawing.createRect({x: geom.xPts[0] - 3, y: geom.yPts[0] - 3, width: (geom.xPts[1] - geom.xPts[0] + 6), height: (geom.yPts[1] - geom.yPts[0] + 6) });
            shape.setStroke({color: new dojo.Color([0,0,255,0.75]), width: 2});
            shape.setFill(new dojo.Color([0,0,255,0.25]));

            return shape;
        } else if(geom.shapeType === 'deleteOverlay'){
            shape = drawing.createRect({x: geom.xPts[0] - 3, y: geom.yPts[0] - 3, width: (geom.xPts[1] - geom.xPts[0] + 6), height: (geom.yPts[1] - geom.yPts[0] + 6) });
            shape.setStroke({color: new dojo.Color([255,0,0,0.75]), width: 2});
            shape.setFill(new dojo.Color([255,0,0,0.25]));

            line = drawing.createLine({x1: geom.xPts[0] - 3, y1: geom.yPts[0] - 3, x2: geom.xPts[1] + 3, y2: geom.yPts[1] + 3});
            line.setStroke({color: "#FF0000", width: 2});

            line = drawing.createLine({x1: geom.xPts[1] + 3, y1: geom.yPts[0] - 3, x2: geom.xPts[0] - 3, y2: geom.yPts[1] + 3});
            line.setStroke({color: "#FF0000", width: 2});

            return shape;
        } else if(geom.shapeType === 'moveOverlay'){
            shape = drawing.createRect({x: geom.xPts[0] - 3, y: geom.yPts[0] - 3, width: (geom.xPts[1] - geom.xPts[0] + 6), height: (geom.yPts[1] - geom.yPts[0] + 6) });
            shape.setStroke({color: new dojo.Color([0,0,255,0.75]), width: 2});
            shape.setFill(new dojo.Color([0,0,255,0.25]));

            return shape;
        } else if(geom.shapeType === 'moveUpOverlay'){
            shape = drawing.createRect({x: geom.xPts[0] - 3, y: geom.yPts[0] - 3, width: (geom.xPts[1] - geom.xPts[0] + 6), height: (geom.yPts[1] - geom.yPts[0] + 6) });
            //shape.setStroke({color: new dojo.Color([0,0,255,0.75]), width: 2});
            shape.setFill(new dojo.Color([0,0,255,0.15]));

            line = drawing.createLine({x1: geom.xPts[0] - 5, y1: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2), x2: geom.xPts[1] + 3, y2: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2)});
            line.setStroke({color: "#0000FF", width: 2});

            line = drawing.createLine({x1: geom.xPts[0] - 5, y1: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2), x2: geom.xPts[0] + ((geom.xPts[1] - geom.xPts[0]) / 2), y2: geom.yPts[0] -5});
            line.setStroke({color: "#0000FF", width: 2});

            line = drawing.createLine({x1: geom.xPts[0] + ((geom.xPts[1] - geom.xPts[0]) / 2), y1: geom.yPts[0] -5, x2: geom.xPts[1] + 5, y2: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2)});
            line.setStroke({color: "#0000FF", width: 2});

            return shape;
        } else if(geom.shapeType === 'moveDownOverlay'){
            shape = drawing.createRect({x: geom.xPts[0] - 3, y: geom.yPts[0] - 3, width: (geom.xPts[1] - geom.xPts[0] + 6), height: (geom.yPts[1] - geom.yPts[0] + 6) });
            //shape.setStroke({color: new dojo.Color([0,0,255,0.75]), width: 2});
            shape.setFill(new dojo.Color([0,0,255,0.15]));

            line = drawing.createLine({x1: geom.xPts[0] - 5, y1: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2), x2: geom.xPts[1] + 3, y2: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2)});
            line.setStroke({color: "#0000FF", width: 2});

            line = drawing.createLine({x1: geom.xPts[0] - 5, y1: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2), x2: geom.xPts[0] + ((geom.xPts[1] - geom.xPts[0]) / 2), y2: geom.yPts[1] + 5});
            line.setStroke({color: "#0000FF", width: 2});

            line = drawing.createLine({x1: geom.xPts[0] + ((geom.xPts[1] - geom.xPts[0]) / 2), y1: geom.yPts[1] + 5, x2: geom.xPts[1] + 5, y2: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2)});
            line.setStroke({color: "#0000FF", width: 2});

            return shape;
        }
        // new code
        else if (geom.shapeType === 'triangle') {
            shape = drawing.createTriangle({x1: geom.xPts[0], y1: geom.yPts[0], x2: geom.xPts[1], y2: geom.yPts[1]});
            //console.debug('Draw triangle: x='+geom.xPts[0]+','+geom.xPts[1]+', y='+geom.yPts[0]+','+geom.yPts[1]);
            /*var scale = 2;
            var distance = Math.sqrt((Math.pow(geom.xPts[1] - geom.xPts[0],2)) + (Math.pow(geom.yPts[0] - geom.yPts[1],2)));
            var horizontalCathetus = distance / scale;//geom.yPts[1]-geom.yPts[0];
            var verticalCathetus = (horizontalCathetus*4)/3;

            shape = drawing.createPolyline([
                {x: geom.xPts[0], y: geom.yPts[1]},
                {x: geom.xPts[0], y: (geom.yPts[1]-verticalCathetus)},
                {x: (geom.xPts[0]+horizontalCathetus), y: geom.yPts[1]},
                {x: geom.xPts[0], y: geom.yPts[1]}
            ]);*/
        } else if (geom.shapeType === 'quadrangle') {
            //console.debug('Draw quadrangle: x='+geom.xPts[0]+','+geom.xPts[1]+', y='+geom.yPts[0]+','+geom.yPts[1]);
            var scale = 2;
            var distance = Math.sqrt((Math.pow(geom.xPts[1] - geom.xPts[0],2)) + (Math.pow(geom.yPts[0] - geom.yPts[1],2)));
            var edgeLength = distance/scale;

            shape = drawing.createPolyline(
                [ geom.xPts[0], geom.xPts[0], (geom.xPts[0]+edgeLength), (geom.xPts[0]+edgeLength) ],
                [ geom.yPts[1], (geom.yPts[1]-edgeLength), (geom.yPts[1]-edgeLength), geom.yPts[1] ]
            );
        } else if (geom.shapeType === 'circle') {
            //console.debug('Draw circle: x='+geom.xPts[0]+','+geom.xPts[1]+', y='+geom.yPts[0]+','+geom.yPts[1]);
            var scale = 2;
            var distance = Math.sqrt((Math.pow(geom.xPts[1] - geom.xPts[0],2)) + (Math.pow(geom.yPts[0] - geom.yPts[1],2)));
            var diameter = distance/scale;

            shape = drawing.createEllipse({
                cx: ((geom.xPts[1] - geom.xPts[0])/2) + geom.xPts[0],
                cy: ((geom.yPts[1] - geom.yPts[0])/2) + geom.yPts[0],
                rx: (diameter)/2,
                ry: (diameter)/2 });

        } else if (geom.shapeType === 'equation' && geom.data) {
            shape = drawing.createEquation({x: geom.xPts[0], y: geom.yPts[0], data: geom.data});
        } else if(geom.shapeType === 'graph' && geom.data){
//            var data = dojox.html.entities.decode(geom.data.value || geom.data);
//            var points = GraphPreview.RenderGraph(data);
            shape = drawing.createGraph({x: geom.xPts[0], y: geom.yPts[0], data: geom.data});
//            shape.setStroke({
//                color: geom.lineColor,
//                width: geom.lineStroke/(1/2)}
//            );
//            var data = dojox.html.entities.decode(geom.data.value || geom.data);
//            var scale = 3;
//            var location = { x: geom.xPts[0]*scale, y: geom.yPts[0]*scale };
//            var path = GraphPreview.RenderGraph(data);
//
            stroke = {
                width: geom.lineStroke*0.25,
                color: geom.lineColor
            };
//
//            shape = drawing.createPath(path);
//            shape.applyTransform(dojox.gfx.matrix.scale(1/scale,1/scale));
//            shape.applyTransform({ dx: location.x, dy: location.y });
//            shape.scale = scale;
        } else if(geom.shapeType === 'polygon'){
            shape = drawing.createPolyline(geom.xPts, geom.yPts);
        } else if(geom.shapeType === 'update') {
            var shapeToUpdate = getShapeFromGeom(geom,drawing);
            if(shapeToUpdate){
                shapeToUpdate.moveTo(geom.xPts, geom.yPts);
            }
        }

        if(shape){
            shape.cRand = geom.cRand;
            shape.cTime = geom.cTime;
            if(!shape.wbbb){
                var shapeBounding = shape.getTransformedBoundingBox();
                if(shapeBounding) {
                    shape.wbbb = {
                        x1: shapeBounding[0].x,
                        y1: shapeBounding[0].y,
                        x2: shapeBounding[2].x,
                        y2: shapeBounding[2].y
                    };
                } else {
                    shape.wbbb = getBoundingBox(geom);
                }
            }
            shape.fromUser = geom.fromUser;

            if(geom.filled && shape.setFill){
                shape.setFill(geom.fillColor);
            }
            if(shape.setStroke && (geom.shapeType !== 'text')){
                shape.setStroke(stroke);
            }
            // for shape updating
            shape.geom = geom;
            shape.worksheet = worksheet;
        }
        return shape;
    }
};
Worksheet.prototype.sendMessage = function(message){
    delete message.geometry.scale;
    delete message.geometry.key;
    this.room.sendMessage(dojo.mixin(message, { worksheetId: this.id }));
};
Worksheet.prototype.initGfx = function(){
    var worksheet = this;
    // private methods
    var getGfxMouse = function(evt){
        var coordsM = dojo.position(worksheet.container);//dojo.coords(worksheet.container);
        //TODO: SXGraph
        var coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [Math.round(evt.clientX - coordsM.x), Math.round(evt.clientY - coordsM.y)], worksheet.drawing._board);
          //console.dir(coords);
        return coords ? { x : coords.usrCoords[1], y : coords.usrCoords[2] } : null;
//        return {x: Math.round(evt.clientX - coordsM.x), y: Math.round(evt.clientY - coordsM.y)};
    };
    var doGfxMouseDown = function(evt) {
        if (worksheet.tool === 'hand') {
            return;
        }

        var pt = getGfxMouse(evt);
        //console.dir(pt);
        if(pointInDrawing(pt)){
            worksheet.mouseDownPt = pt;
            worksheet.points = [pt];
            worksheet.mouseDown = true;
            worksheet.overlayShape = false;

            worksheet.selectedShape = getHoveredShape(worksheet.drawing,pt);
        }
    };
    var doGfxMouseMove = function(evt) {
        if (worksheet.tool === 'hand') {
            return;
        }

        var pt = getGfxMouse(evt);
        var geom = false;
        var shape = false;
        var board = worksheet.drawing; // overlayDrawing drawing

        if(worksheet.mouseDown){
            if((worksheet.tool === 'pen') && pointInDrawing(pt) && !worksheet.selectedShape ){
                if((worksheet.points[worksheet.points.length - 1].x !== pt.x) || (worksheet.points[worksheet.points.length - 1].y !== pt.y)){
                    worksheet.points.push(pt);

                    if(worksheet.points.length > 1){
                        //make sure its not the same point as last time
                        geom = createLineJSON(
                            {x1: worksheet.points[worksheet.points.length - 2].x,
                                y1: worksheet.points[worksheet.points.length - 2].y,
                                x2: worksheet.points[worksheet.points.length - 1].x,
                                y2: worksheet.points[worksheet.points.length - 1].y }
                        );
                        geom.shapeType = 'pen';
                    }
                }
            }else{
                var bounds = {x1:worksheet.mouseDownPt.x, y1:worksheet.mouseDownPt.y, x2: pt.x, y2: pt.y};
                if(worksheet.tool !== 'pen'){
                    board.remove(worksheet.overlayShape);
                }
                if(worksheet.tool === 'rect' && !worksheet.selectedShape ){
                    geom  = createRectJSON(bounds,false);
                }else if(worksheet.tool === 'filledRect' && !worksheet.selectedShape ){
                    geom  = createRectJSON(bounds,true);
                }else if(worksheet.tool === 'ellipse' && !worksheet.selectedShape ){
                    geom  = createEllipseJSON(bounds,false);
                }else if(worksheet.tool === 'filledEllipse' && !worksheet.selectedShape ){
                    geom  = createEllipseJSON(bounds,true);
                }else if(worksheet.tool === 'line' && !worksheet.selectedShape ){
                    geom  = createLineJSON(bounds);
                }else if(worksheet.tool === 'move'){
                    if(worksheet.selectedShape && worksheet.mouseDownPt){
                        geom = createMoveOverlayJSON(worksheet.selectedShape.wbbb);

                        var offBB = createOffsetBB(worksheet.selectedShape.wbbb,worksheet.mouseDownPt,pt);
                        //console.dir(offBB);
                        var geom2 = createMoveOverlayJSON(offBB);

                        worksheet.drawFromJSON(geom2,board);
                    }
                }else if(worksheet.tool === 'triangle' && !worksheet.selectedShape ){
                    geom  = createTriangleJSON(bounds,false);
                }else if(worksheet.tool === 'quadrangle' && !worksheet.selectedShape ){
                    geom  = createQuadrangleJSON(bounds,false);
                }else if(worksheet.tool === 'circle' && !worksheet.selectedShape ){
                    geom  = createCircleJSON(bounds,false);
                }
            }
        } else {
            if(worksheet.tool === 'move'){
                shape = getHoveredShape(worksheet.drawing,pt);
                if(shape){
                    geom = createMoveOverlayJSON(shape.wbbb);
                }
            }
        }
        //mouse up or down doesn't matter for the select and delete tools
        if(worksheet.tool === 'delete'){
            shape = getHoveredShape(worksheet.drawing,pt);
            if(shape){
                geom = createDeleteOverlayJSON(shape.wbbb);
            }
        }else if(worksheet.tool === 'moveUp'){
            shape = getHoveredShape(worksheet.drawing,pt);
            if(shape){
                geom = createMoveUpOverlayJSON(shape.wbbb);
            }
        }else if(worksheet.tool === 'moveDown'){
            shape = getHoveredShape(worksheet.drawing,pt);
            if(shape){
                geom = createMoveDownOverlayJSON(shape.wbbb);
            }
        }
        // draw overlay geom
        if(geom) {
            worksheet.overlayShape = worksheet.drawFromJSON(geom,board);
        }
    };
    var pointInDrawing = function(pt){
        return pt;
    };
    var doGfxMouseUp = function(evt) {
        if (worksheet.tool === 'hand') {
            return;
        }

        var pt = getGfxMouse(evt);
        worksheet.mouseDown = false;
        //console.dir(pt);
        var geom = false;
        var shape = false;
        var board = worksheet.drawing;

        //always clear the overlay
        //worksheet.overlayDrawing.clear();
        board.remove(worksheet.overlayShape);

        if(worksheet.mouseDownPt){
            //make sure mouse was released inside of drawing area
            if(pointInDrawing(pt)){
                //console.dir(worksheet.mouseDownPt);

                var bounds = {x1:worksheet.mouseDownPt.x, y1:worksheet.mouseDownPt.y, x2: pt.x, y2: pt.y};
                //worksheet.mouseDownPt = null;
                if(worksheet.tool === 'rect'){
                    geom  = createRectJSON(bounds,false);
                }else if(worksheet.tool === 'filledRect'){
                    geom  = createRectJSON(bounds,true);
                }else if(worksheet.tool === 'ellipse'){
                    geom  = createEllipseJSON(bounds,false);
                }else if(worksheet.tool === 'filledEllipse'){
                    geom  = createEllipseJSON(bounds,true);
                }else if(worksheet.tool === 'line'){
                    geom  = createLineJSON(bounds);
                }else if(worksheet.tool === 'pen'){
                    geom = createPenJSON(worksheet.points);
                    console.log("num pen points sending:",geom.xPts.length);
                }else if(worksheet.tool === 'delete'){
                    shape = getHoveredShape(worksheet.drawing,pt);
                    if(shape){
                        geom = createDeleteJSON(shape);
                    }
                }else if(worksheet.tool === 'move'){
                    //console.log(worksheet.selectedShape,worksheet.mouseDownPt,bounds);
                    if(worksheet.selectedShape && worksheet.mouseDownPt) {
                        var ptDelta = {x: (pt.x - worksheet.mouseDownPt.x),y: (pt.y - worksheet.mouseDownPt.y)};
                        geom = createMoveJSON(worksheet.selectedShape, ptDelta);
                    }
                }else if(worksheet.tool === 'moveUp'){
                    shape = getHoveredShape(worksheet.drawing,pt);
                    if(shape){
                        geom = createMoveUpJSON(shape);
                    }
                }else if(worksheet.tool === 'moveDown'){
                    shape = getHoveredShape(worksheet.drawing,pt);
                    if(shape){
                        geom = createMoveDownJSON(shape);
                    }
                }else if(worksheet.tool === 'text'){
                    worksheet.textPoint = pt;
                    dijit.byId('textDialog').show();
                    dijit.byId('wbText').focus();
                }else if(worksheet.tool === 'triangle'){
                    geom  = createTriangleJSON(bounds,false);
                }else if(worksheet.tool === 'quadrangle'){
                    geom  = createQuadrangleJSON(bounds,false);
                }else if(worksheet.tool === 'circle'){
                    geom  = createCircleJSON(bounds,false);
                }else if(worksheet.tool === 'equation'){
                    worksheet.textPoint = pt;
                    dijit.byId('equationDialog').show();
                    dijit.byId('MathInput').focus();
                }else if(worksheet.tool === 'graph'){
                    worksheet.textPoint = pt;
                    dijit.byId('graphDialog').show();
                    dijit.byId('GraphInput').focus();
                    GraphPreview.Update();
                }else if(worksheet.tool === 'visionobjects'){
                    worksheet.textPoint = pt;
                    dijit.byId('visionobjectsDialog').show();
                    visionObjects.init();
                }
                //worksheet.points = [];
                if(geom){
                    console.debug("sendMessage");
                    worksheet.sendMessage({geometry:geom});
                }
            }else{
                worksheet.mouseDownPt = null;
                console.log("mouse released outside of drawing area");
            }
        }

        // draw geom
        if(geom) {
            worksheet.drawFromJSON(geom,board);
        }
        //clear everything
        worksheet.mouseDownPt = null;
        worksheet.selectedShape = null;
        worksheet.points = [];
    };
    var createRectJSON = function(bounds,filled){
        bounds = normalizeBounds(bounds);
        var geom = {
                xPts: [bounds.x1,bounds.x2],
                yPts: [bounds.y1,bounds.y2]
        };
        geom.shapeType = 'rect';
        geom.filled = filled;
        if(filled){
            geom.fillColor = worksheet.fillColor;
        }
        geom.lineColor = worksheet.lineColor;
        geom.lineStroke = worksheet.lineStroke;

        return worksheet.addTimeRand(geom);
    };
    var createTriangleJSON = function(bounds,filled){
        bounds = normalizeBounds(bounds);
        var geom = {
            xPts: [bounds.x1,bounds.x2],
            yPts: [bounds.y1,bounds.y2]
        };
        geom.shapeType = 'triangle';
        geom.filled = filled;
        if(filled){
            geom.fillColor = worksheet.fillColor;
        }
        geom.lineColor = worksheet.lineColor;
        geom.lineStroke = worksheet.lineStroke;

        return worksheet.addTimeRand(geom);
    };
    var createQuadrangleJSON = function(bounds,filled){
        bounds = normalizeBounds(bounds);
        var geom = {
            xPts: [bounds.x1,bounds.x2],
            yPts: [bounds.y1,bounds.y2]
        };
        geom.shapeType = 'quadrangle';
        geom.filled = filled;
        if(filled){
            geom.fillColor = worksheet.fillColor;
        }
        geom.lineColor = worksheet.lineColor;
        geom.lineStroke = worksheet.lineStroke;

        return worksheet.addTimeRand(geom);
    };
    var createCircleJSON = function(bounds,filled){
        bounds = normalizeBounds(bounds);
        var geom = {
            xPts: [bounds.x1,bounds.x2],
            yPts: [bounds.y1,bounds.y2]
        };
        geom.shapeType = 'circle';
        geom.filled = filled;
        if(filled){
            geom.fillColor = worksheet.fillColor;
        }
        geom.lineColor = worksheet.lineColor;
        geom.lineStroke = worksheet.lineStroke;

        return worksheet.addTimeRand(geom);
    };
    var createVideoJSON = function(x,y,src) {
        var geom = {
                xPts: [ x ],
                yPts: [ y ],
                shapeType : 'video'
        };
        geom.text = src;
        return addTimeRand(geom);
    }
    
    var createPdfJSON = function(x,y,src) {
        var geom = {
                xPts: [ x ],
                yPts: [ y ],
                shapeType : 'pdf'
        };
        geom.text = src;
        return addTimeRand(geom);
    }
    var createImageJSON = function(bounds,textData){
        bounds = normalizeBounds(bounds);
        var geom = {
                xPts: [bounds.x1,bounds.x2],
                yPts: [bounds.y1,bounds.y2],
                shapeType: 'image'
        };
        geom.dataStr = textData;
        geom.text = textData;
        
        return addTimeRand(geom);
    };
    var createSelectJSON = function(bounds){
        bounds = normalizeBounds(bounds);
        var geom = {
                xPts: [bounds.x1,bounds.x2],
                yPts: [bounds.y1,bounds.y2]
        };
        geom.shapeType = 'select';
        return geom;
    };
    var createDeleteOverlayJSON = function(bounds){
        bounds = normalizeBounds(bounds);
        var geom = {
                xPts: [bounds.x1,bounds.x2],
                yPts: [bounds.y1,bounds.y2]
        };
        geom.shapeType = 'deleteOverlay';
        return geom;
    };
    var createMoveOverlayJSON = function(bounds){
        bounds = normalizeBounds(bounds);
        var geom = {
                xPts: [bounds.x1,bounds.x2],
                yPts: [bounds.y1,bounds.y2]
        };
        geom.shapeType = 'moveOverlay';
        return geom;
    };
    var createMoveUpOverlayJSON = function(bounds){
        var geom = createMoveOverlayJSON(bounds);
        geom.shapeType = 'moveUpOverlay';
        return geom;
    };
    var createMoveDownOverlayJSON = function(bounds){
        var geom = createMoveOverlayJSON(bounds);
        geom.shapeType = 'moveDownOverlay';
        return geom;
    };
    var createMoveJSON = function(shape,ptDelta){
        var geom = {
                xPts: [ptDelta.x],
                yPts: [ptDelta.y]
        };
        geom.shapeType = 'move';
        geom.scale = shape.scale;
        geom.cTime = shape.cTime;
        geom.cRand = shape.cRand;
        geom.fromUser = shape.fromUser;
        return geom;
    };
    var createMoveUpJSON = function(shape,ptDelta){
        var geom = {};
        geom.shapeType = 'moveUp';
        geom.cTime = shape.cTime;
        geom.cRand = shape.cRand;
        geom.fromUser = shape.fromUser;
        return geom;
    };
    var createMoveDownJSON = function(shape,ptDelta){
        var geom = {};
        geom.shapeType = 'moveDown';
        geom.cTime = shape.cTime;
        geom.cRand = shape.cRand;
        geom.fromUser = shape.fromUser;
        return geom;
    };
    var createDeleteJSON = function(shape){
        var geom = {};
        geom.shapeType = 'delete';
        geom.cTime = shape.cTime;
        geom.cRand = shape.cRand;
        geom.fromUser = shape.fromUser;
        return geom;
    };
    var createEllipseJSON = function(bounds,filled){
        bounds = normalizeBounds(bounds);
        var geom = {
                xPts: [bounds.x1,bounds.x2],
                yPts: [bounds.y1,bounds.y2]
        };
        geom.shapeType = 'ellipse';
        geom.filled = filled;
        if(filled){
            geom.fillColor = worksheet.fillColor;
        }
        geom.lineColor = worksheet.lineColor;
        geom.lineStroke = worksheet.lineStroke;

        return worksheet.addTimeRand(geom);
    };
    var createLineJSON = function(bounds){
        var geom = {
                xPts: [bounds.x1,bounds.x2],
                yPts: [bounds.y1,bounds.y2]
        };
        geom.shapeType = 'line';
        geom.fillColor = worksheet.fillColor;
        geom.lineColor = worksheet.lineColor;
        geom.lineStroke = worksheet.lineStroke;

        return worksheet.addTimeRand(geom);
    };
    var createPenJSON = function(points){
          var xPts = [];
          var yPts = [];
          dojo.forEach(points, function(point){
             xPts.push(point.x);
             yPts.push(point.y);
          });
        var geom = {shapeType: 'pen',
                    fillColor: worksheet.fillColor,
                    lineColor: worksheet.lineColor,
                    lineStroke: worksheet.lineStroke,
                    xPts: xPts,
                    yPts: yPts
                };
        return worksheet.addTimeRand(geom);
    };
    var createOffsetBB = function(origBB, pointInBB, newPt){
        //console.log('offset',origBB, pointInBB, newPt);

        var xDelta = Math.abs(pointInBB.x - origBB.x1);
        var yDelta = Math.abs(pointInBB.y - origBB.y1);

        //console.log('deltas',xDelta,yDelta);
        var bounds = {
            x1: (newPt.x - xDelta),
            y1: (newPt.y - yDelta)
        };

        bounds.x2 = bounds.x1 + (origBB.x2 - origBB.x1);
        bounds.y2 = bounds.y1 + (origBB.y2 - origBB.y1);

        return bounds;
    };
    //first point should be upper left of rect
    var  normalizeBounds = function(bounds){
            if(bounds.x2 < bounds.x1){
                var tempX1 = bounds.x1;
                bounds.x1 = bounds.x2;
                bounds.x2 = tempX1;
            }
            if(bounds.y2 < bounds.y1){
                var tempY1 = bounds.y1;
                bounds.y1 = bounds.y2;
                bounds.y2 = tempY1;
            }
            return bounds;
    };
    var getHoveredShape = function(drawing, pt){
        try{
            var children = drawing.children;
            if(children){
                for(var i = children.length; i > 0; i--){
                    var child = children[i - 1];
                    if(ptInBox(pt,child.wbbb)){
                        return child;
                    }
                }
            }
        }catch(e){
            console.log('error finding shape',e);
        }
        return null;
    };
    var ptInBox = function(pt, box){
        if(pt && box){
            if((pt.x >= box.x1) && (pt.x <= box.x2) && (pt.y >= box.y1) && (pt.y <= box.y2)){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    };

    // method body
    worksheet.container = worksheet.getNode("whiteboardContainer");
    worksheet.container.style.width = worksheet.width + 'px';
    worksheet.container.style.height = worksheet.height + 'px';
//    worksheet.container.style.cursor="pointer";

    worksheet.overlayContainer = worksheet.getNode("whiteboardContainer");
    worksheet.overlayContainer.style.cursor="pointer";

//    worksheet.overlayContainer = worksheet.getNode("whiteboardOverlayContainer");
//    worksheet.overlayContainer.style.width = worksheet.width + 'px';
//    worksheet.overlayContainer.style.height = worksheet.height + 'px';
//    worksheet.overlayContainer.style.position = 'absolute';
//    worksheet.overlayContainer.style.zIndex = 1;
//    worksheet.overlayContainer.style.cursor="pointer";

    // create a drawing board
    var events = [
        { name: "down", func: doGfxMouseDown },
        { name: "move", func: doGfxMouseMove },
        { name: "up", func: doGfxMouseUp }
    ];
    worksheet.drawing = new Whiteboard("whiteboardContainer_" + worksheet.id, {boundingbox:[0,100,100,0], axis: true});
    worksheet.drawing.initEvents(events);


//    worksheet.overlayDrawing = new Whiteboard("whiteboardOverlayContainer_" + worksheet.id,  {boundingbox:[0,100,100,0], axis:true, hideNavigation : true });
//    worksheet.overlayDrawing = dojox.gfx.createSurface(worksheet.overlayContainer, worksheet.width, worksheet.height);

    //for playback
    worksheet.movieContainer = dojo.byId("movieWhiteboardContainer");
    worksheet.movieContainer.style.width = worksheet.width + 'px';
    worksheet.movieContainer.style.height = worksheet.height + 'px';

//    worksheet.movieDrawing = new Whiteboard("movieWhiteboardContainer");
    worksheet.movieDrawing = dojox.gfx.createSurface(worksheet.movieContainer, worksheet.width, worksheet.height);

    //draw any saved objects
    dojo.forEach(worksheet.room.messageList, function(message){
        if(message.geometry){
            message.geometry.fromUser = message.fromUser;
            if (worksheet.id === message.worksheetId) {
                try {
                    worksheet.drawFromJSON(message.geometry, worksheet.drawing);
                } catch(ex) {
                    console.error(ex);
                }
            }
        }
    });

    var c = dojo.getMarginBox(worksheet.container); //dojo.coords(worksheet.container);
    console.dir(c);
    dojo.style(worksheet.overlayContainer,"top", (c.t + 'px'));
    dojo.style(worksheet.overlayContainer,"left", (c.l + 'px'));

    //dojo.connect(dojo.body(),'onmouseup',doGfxMouseUp); //mouse release can happen anywhere in the container
    //dojo.connect(worksheet.overlayContainer,'onmousedown',doGfxMouseDown);
    //dojo.connect(dojo.body(),'onmousemove',doGfxMouseMove);
    //dojo.connect(worksheet.overlayContainer,'onmousemove',doGfxMouseMove);
    console.log("topov",dojo.style(worksheet.overlayContainer,"top"));

    if(Modernizr.draganddrop){
        console.log('supports drag and drop!');
        //var dndc = new DNDFileController(worksheet.getNode('whiteboardOverlayContainer'));
    }
};
Worksheet.prototype.init = function(){
    var worksheet = this;
    // private methods
    var chooseColor = function(type) {
        var cp = worksheet.getDialogWidget(type + 'ColorPaletteWidget');
        //console.log(cp);
        dojo.style(worksheet.getNode(type + 'Swatch'),{backgroundColor: cp.value});
        worksheet[type + 'Color'] = cp.value;
        dijit.popup.close(worksheet.getDialogWidget(type + "ColorPaletteDialog"));
    };
    var cancelChooseColor = function(type) {
        dijit.popup.close(worksheet.getDialogWidget(type + "ColorPaletteDialog"));
    };
    var exportImage = function(){
        try{                                      //dojo.query('canvas',worksheet.getNode('movieDialog'))[0].toDataURL();
            dojo.byId("exportedImg").src = dojo.query('canvas',dojo.byId(worksheet.id))[0].toDataURL();
            dijit.byId("imgDialog").show();
        }catch(e){
            console.info("canvas not supported",e);
        }
    };
    var exportMovieImage = function(){
        try{
            dojo.byId("exportedImg").src = dojo.query('canvas',dojo.byId('movieDialog'))[0].toDataURL();
            dijit.byId("imgDialog").show();
        }catch(e){
            console.info("canvas not supported",e);
        }
    };
    var selectTool = function(toolName) {
        if(worksheet.overlayContainer) {
            if (toolName === 'hand') {
                worksheet.drawing.drawMode = false;
                worksheet.overlayContainer.style.cursor="pointer";
            } else {
                worksheet.drawing.drawMode = true;
                worksheet.overlayContainer.style.cursor="crosshair";
            }
        }
        hide("lineColorDisplay");
        hide("fillColorDisplay");
//        hide("lineStrokeSelect");
//        hide("fontSizeSelect");

        var tool = null;
        dojo.forEach(tools,function(aTool){
            if(aTool.name === toolName){
                tool = aTool;
            }
            //dojo.style(this.byClass(aTool.name + 'ToolBtn').domNode,'border','0px');
            //dojo.addClass(dojo.style(this.byClass(aTool.name + 'ToolBtn').domNode, "selected");
            dojo.removeClass(worksheet.getNode(aTool.name + 'ToolBtn'), "selected");
        });

        //dojo.style(this.byClass(tool.name + 'ToolBtn').domNode,'border','2px solid black');
        dojo.addClass(worksheet.getNode(tool.name + 'ToolBtn'), "selected");
        worksheet.tool = tool.name;

        if(tool.showLineColor){
            show("lineColorDisplay");
        }
        if(tool.showFillColor){
            show("fillColorDisplay");
        }
//        if(tool.showLineThickness){
//            show("lineStrokeSelect");
//        }
//        if(tool.showFontSize){
//            show("fontSizeSelect");
//        }
    };
    var showMovie = function(){
        try{
            dijit.byId("movieDialog").show();

            if(worksheet.room.messageList){
                worksheet.geomMessageList = [];
                dojo.forEach(worksheet.room.messageList,function(message){
                    if(message.geometry && message.worksheetId === worksheet.id){
                        worksheet.room.geomMessageList.push(message);
                    }
                });
            }
            var mSlider = dijit.byId('movieSlider');
            mSlider.setAttribute('maximum',worksheet.room.geomMessageList.length);
            mSlider.setAttribute('discreteValues',worksheet.room.geomMessageList.length);

            mSlider.set('value',0);
        }catch(e){
            console.info("canvas not supported",e);
        }
    };
    var incrementMovie = function(){
        var indexEnd = Math.round(dijit.byId('movieSlider').getValue());
        worksheet.movieDrawing.clear();
        for(var i =0; i < indexEnd; i++){
            worksheet.drawFromJSON(worksheet.room.geomMessageList[i].geometry, worksheet.movieDrawing);
        }
        if(indexEnd > 0){
            dojo.byId('movieUser').innerHTML = worksheet.room.geomMessageList[indexEnd - 1].fromUser;
        }
    };
    var doCancelAddText = function(){
        dijit.byId('wbText').set('value','');
        dijit.byId('textDialog').hide();
        worksheet.textPoint = null;
    };
    var doAddText = function(){
        var text = dijit.byId('wbText').getValue();
        if((text !== '') && (worksheet.textPoint)){
            dijit.byId('textDialog').hide();
            var geom = createTextJSON(worksheet.textPoint,text);
            worksheet.drawFromJSON(geom,worksheet.drawing);
            worksheet.textPoint = null;
            worksheet.sendMessage({geometry:geom});
        }
    };
    var doCancelEquationInput = function(){
        //dijit.byId('MathInput').set('value','');
        dijit.byId('equationDialog').hide();
        worksheet.textPoint = null;
    };
    var doEquationInput = function(){
        var data = document.getElementById("MathInput").value;
        data = dojo.string.trim(data);
        if((data !== '') && worksheet.textPoint){
            var geom = createEquationJSON(worksheet.textPoint, Preview.getSize(), data);
            worksheet.drawFromJSON(geom,worksheet.drawing, true);
            worksheet.textPoint = null;
            worksheet.sendMessage({geometry:geom});
            dijit.byId('equationDialog').hide();
        }
    };
    var doCancelGraphInput = function(){
        dijit.byId('graphDialog').hide();
        //worksheet.overlayDrawing.clear();
        worksheet.textPoint = null;
    };
    var doGraphInput = function(){
        var data = document.getElementById("GraphInput").value;
        data = dojo.string.trim(data);
        if((data !== '') && worksheet.textPoint){
            var geom = createGraphJSON(worksheet.textPoint, Preview.getSize(), data);
            worksheet.drawFromJSON(geom,worksheet.drawing, true);
            worksheet.textPoint = null;
            worksheet.sendMessage({geometry:geom});
            dijit.byId('graphDialog').hide();
        }
    };
    var doCancelVisionObjectInput = function(){
        dijit.byId('visionobjectsDialog').hide();
        worksheet.textPoint = null;
        visionObjects.clear();
    };
    var doVisionObjectInput = function(){
        dijit.byId('visionobjectsDialog').hide();
        var shapes = visionObjects.getShapes();
        for(var i=0; i < shapes.length; i++) {
            console.dir(shapes[i]);
            var geom = createVOPenJSON(worksheet.textPoint, shapes[i]);

            worksheet.drawFromJSON(geom,worksheet.drawing, true);
            worksheet.sendMessage({geometry:geom});
        }
        worksheet.textPoint = null;
        visionObjects.clear();
    };

    var doIncrementalText = function(){
        //worksheet.overlayDrawing.clear();
        var text = dijit.byId('wbText').getValue();
        if((text !== '') && (worksheet.textPoint)){
            var geom = createTextJSON(worksheet.textPoint,text);
            worksheet.drawFromJSON(geom,worksheet.overlayDrawing);
        }
    };
    var hide = function(id){
        try{
            worksheet.getNode(id).style.display = 'none';
        }catch(e) {
            console.error(e);
        }
    };
    var show = function(id){
        try{
            worksheet.getNode(id).style.display = '';
        }catch(e) {
            console.error(e);
        }
    };
    var  createClearDrawingJSON = function(){
        var geom = {shapeType: 'clear'};
        return geom;
    };
    var createTextJSON = function(pt,text){
        var geom = {
            xPts: [pt.x],
            yPts: [pt.y]
        };
        geom.shapeType = 'text';
        geom.text = text;
        geom.lineStroke = worksheet.fontSize;
        geom.lineColor = worksheet.lineColor;

        return worksheet.addTimeRand(geom);
    };
    var createEquationJSON = function(pt,size,data){
        var geom = {
            xPts: [pt.x, size.width],
            yPts: [pt.y, size.height]
        };
        geom.shapeType = 'equation';
        geom.data = dojox.html.entities.encode(data);
        geom.lineStroke = worksheet.fontSize;
        geom.lineColor = worksheet.lineColor;

        return worksheet.addTimeRand(geom);
    };
    var createGraphJSON = function(pt,size,data){
        // remove spaces and tabs
        data = data.replace(/[ \t\r]+/g,"");
        // discard the left part
        data = data.replace(/.*=/g,"");

        var geom = {
            xPts: [pt.x, size.width],
            yPts: [pt.y, size.height]
        };
        geom.shapeType = 'graph';
        geom.data = dojox.html.entities.encode(data);
        geom.lineStroke = worksheet.fontSize;
        geom.lineColor = worksheet.lineColor;

        return worksheet.addTimeRand(geom);
    };
    var createVOPenJSON = function(pt,shape){
        var xPts= [], yPts = [];
//        var offset = {
//            x: ((shape.max.x-shape.min.x+pt.x > 100)?100-shape.max.x-shape.min.x:pt.x),
//            y: ((shape.max.y-shape.min.y+pt.y > 100)?100-shape.max.y-shape.min.y:pt.y)
//        };
        for(var i=0; i < shape.xPts.length && i < shape.yPts.length; i++) {
            xPts.push(shape.xPts[i]+pt.x-shape.min.x);
            yPts.push(shape.yPts[i]+pt.y-shape.min.y);
        }
        var geom = {shapeType: 'polygon',
            fillColor: worksheet.fillColor,
            lineColor: worksheet.lineColor,
            lineStroke: worksheet.lineStroke,
            xPts: xPts,
            yPts: yPts
        };
        return worksheet.addTimeRand(geom);
    };

    // method body
    // binding events
    dojo.connect(worksheet.getDialogWidget('lineColorPaletteOkBtn'),'onClick',function(){
        chooseColor('line');
    });    
    dojo.connect(worksheet.getDialogWidget('lineColorPaletteCancelBtn'),'onClick',function(){
        cancelChooseColor('line');
    });
    dojo.connect(worksheet.getDialogWidget('fillColorPaletteOkBtn'),'onClick',function(){
        chooseColor('fill');
    });    
    dojo.connect(worksheet.getDialogWidget('fillColorPaletteCancelBtn'),'onClick',function(){
        cancelChooseColor('fill');
    });
    
    if(Modernizr.canvas) {
        dojo.connect(worksheet.getWidget('exportImgBtn'),'onClick',exportImage);
        dojo.connect(dijit.byId('exportMovieImgBtn'),'onClick',exportMovieImage);
    } else {
        dojo.style(worksheet.getWidget('exportImgBtn'), {'visibility': 'hidden', 'display': 'none'});
        dojo.style(dijit.byId('exportMovieImgBtn'), {'visibility': 'hidden', 'display': 'none'});
    }
    dojo.connect(worksheet.getWidget('showMovieBtn'),'onClick',showMovie);
    dojo.connect(dijit.byId('movieSlider'),'onChange',incrementMovie);
    
//    dojo.connect(worksheet.getWidget('lineStrokeSelect'),'onChange',function(){
//        worksheet.lineStroke = Math.floor(1.0 * worksheet.getWidget('lineStrokeSelect').getValue());
//    });
//    dojo.connect(worksheet.getNode('fontSizeSelect'),'onChange',function(){
//        worksheet.fontSize = Math.floor(1.0 * worksheet.getWidget('fontSizeSelect').getValue());
//    });
    dojo.connect(worksheet.getDialogWidget('clearDrawingNoBtn'),'onClick',function(){
        dijit.popup.close(worksheet.getWidget("clearDrawingDialog"));
    });
    dojo.connect(worksheet.getDialogWidget('clearDrawingYesBtn'),'onClick',function(){
        dijit.popup.close(worksheet.getDialogWidget("clearDrawingDialog"));
        var geom = createClearDrawingJSON();
        worksheet.sendMessage({geometry: geom });
        worksheet.drawFromJSON(geom,worksheet.drawing);
        
    });
    selectTool('hand');
    
    dojo.forEach(tools,function(tool){
        dojo.connect(worksheet.getWidget(tool.name + 'ToolBtn'),'onClick',function(){
            selectTool(tool.name);
        });
    });
    dojo.connect(worksheet.getWidget("wbText"), 'onKeyDown', function(evt) {
        if(evt.keyCode === dojo.keys.ENTER) {
            doAddText();
        }
    });
    dojo.connect(dijit.byId("cancelTextBtn"), 'onClick', function(evt) {
        doCancelAddText();
    });
    dojo.connect(worksheet.getWidget("wbText"), 'onKeyUp', function(evt) {
        doIncrementalText();
    });
    dojo.connect(worksheet.getWidget("wbText"), 'onChange', function(evt) {
        doIncrementalText();
    });
    dojo.connect(worksheet.getWidget("textDialog"), 'onClose', function(evt) {
        //worksheet.overlayDrawing.clear();
        worksheet.getWidget("wbText").set('value','');
    });
    dojo.connect(worksheet.getWidget("textDialog"), 'onHide', function(evt) {
        //worksheet.overlayDrawing.clear();
        worksheet.getWidget("wbText").set('value','');
    });
    dojo.connect(dijit.byId("okTextBtn"), 'onClick', function(evt) {
        doAddText();
    });
    dojo.connect(dijit.byId("okEquationBtn"), 'onClick', function(evt) {
        doEquationInput();
    });
    dojo.connect(dijit.byId("cancelEquationBtn"), 'onClick', function(evt) {
        doCancelEquationInput();
    });
    dojo.connect(dijit.byId("okGraphBtn"), 'onClick', function(evt) {
        doGraphInput();
    });
    dojo.connect(dijit.byId("cancelGraphBtn"), 'onClick', function(evt) {
        doCancelGraphInput();
    });
    dojo.connect(dijit.byId("cancelVisionobjectsBtn"), 'onClick', function(evt) {
        doCancelVisionObjectInput();
    });
    dojo.connect(dijit.byId("okVisionobjectsBtn"), 'onClick', function(evt) {
        doVisionObjectInput();
    });

    try{
        var reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('img').src = e.target.result;
        };

        function onDrop(e) {
            reader.readAsDataURL(e.dataTransfer.files[0]);
        };
    }catch(imgE){
        console.error(e);
    }
};