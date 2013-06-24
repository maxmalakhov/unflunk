/**
 * Created with IntelliJ IDEA.
 * User: max
 * Date: 6/24/13
 * Time: 10:18 AM
 * To change this template use File | Settings | File Templates.
 */
function Drawer(worksheet) {
    this.worksheet = worksheet;
    this.penLines = [];
}

Drawer.prototype.draw = function(geom, board) {
    // private methods
    var getShapeFromGeom = function(geom, board){
            var retVal = null;
            dojo.every(board.children, function(shape){
                if((shape.cRand === geom.cRand) && (shape.cTime === geom.cTime)){
                    retVal = shape;
                    return false;
                }
                return true; // keep going until we find one that isn't
            });
            return retVal;
        },
        removeShape = function(geom, board){
            var shape = getShapeFromGeom(geom,board);
            if(shape){
                board.remove(shape);
            }
        },
        moveShape = function(geom, board){
            var shape = getShapeFromGeom(geom,board);
            if(shape){
                var scale = geom.scale || 1;
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
        },
        moveShapeUp = function(geom, board){
            var shape = getShapeFromGeom(geom,board);
            if(shape){
                shape.moveToFront();
            }
        },
        moveShapeDown = function(geom, board){
            var shape = getShapeFromGeom(geom,board);
            if(shape){
                shape.moveToBack();
            }
        },
        getBoundingBox = function(geom){
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
        }; // vars definition

    console.debug("Draw a shape",geom.shapeType);

    if(geom && geom.shapeType){
        var shape = false;
        var line = false;
        var stroke = {color: geom.lineColor, width: geom.lineStroke};

        if(geom.shapeType === 'rect'){
            shape = board.createRect({x: geom.xPts[0], y: geom.yPts[0], width: (geom.xPts[1] - geom.xPts[0]), height: (geom.yPts[1] - geom.yPts[0]) });
        } else if(geom.shapeType === 'image'){
            shape = board.createImage({src:geom.text, x:geom.xPts[0], y:geom.yPts[0], width: (geom.xPts[1] - geom.xPts[0]), height: (geom.yPts[1] - geom.yPts[0]) });
        } else if(geom.shapeType === 'pdf'){
            shape = board.createPdf({src:geom.text, x:geom.xPts[0], y:geom.yPts[0]});
        } else if ( geom.shapeType === 'video' ) {
            shape = board.createVideo({src:geom.text, x:geom.xPts[0], y:geom.yPts[0]});
        } else if(geom.shapeType === 'line') {
            shape = board.createLine(geom.xPts, geom.yPts);
            stroke.cap = 'round';
        } else if(geom.shapeType === 'text'){
            shape = board.createText({ x:geom.xPts[0], y:geom.yPts[0] + geom.lineStroke, text:geom.text});
            shape.setFont({ size:(geom.lineStroke + "pt"), weight:"normal", family:"Arial" });
            shape.setFill(geom.lineColor);
        } else if(geom.shapeType === 'ellipse'){
            shape = board.createEllipse({cx: ((geom.xPts[1] - geom.xPts[0])/2) + geom.xPts[0],
                cy: ((geom.yPts[1] - geom.yPts[0])/2) + geom.yPts[0],
                rx: (geom.xPts[1] - geom.xPts[0])/2,
                ry: (geom.yPts[1] - geom.yPts[0])/2 });
        } else if(geom.shapeType === 'pen'){
            if(geom.xPts){
                if(geom.xPts.length > 1){
                    //console.debug("num pen points board:",geom.xPts.length);
                    //shape = board.createGroup();
                    shape = board.createPenLine(geom.xPts, geom.yPts, !this.worksheet.process);
//                    for(var i = 0; i < (geom.xPts.length - 1); i++){
//                        var lineShape = board.createPenLine({x1: geom.xPts[i], y1: geom.yPts[i], x2: geom.xPts[i + 1], y2: geom.yPts[i + 1]});
//                        //stroke.cap = 'round';
//                        lineShape.setStroke(stroke);
//                        //shape.add(lineShape);
//                    }
                    this.penLines.push(shape);
                }
            }
        } else if(geom.shapeType === 'clear'){
            board.clear();
            this.worksheet.initEvent();
        } else if(geom.shapeType === 'delete'){
            removeShape(geom,board);
        } else if(geom.shapeType === 'move'){
            moveShape(geom,board);
        } else if(geom.shapeType === 'moveUp'){
            moveShapeUp(geom,board);
        } else if(geom.shapeType === 'moveDown'){
            moveShapeDown(geom,board);
        } else if(geom.shapeType === 'select'){
            shape = board.createRect({x: geom.xPts[0] - 3, y: geom.yPts[0] - 3, width: (geom.xPts[1] - geom.xPts[0] + 6), height: (geom.yPts[1] - geom.yPts[0] + 6) });
            shape.setStroke({color: new dojo.Color([0,0,255,0.75]), width: 2});
            shape.setFill(new dojo.Color([0,0,255,0.25]));

            return shape;
        } else if(geom.shapeType === 'deleteOverlay'){
            shape = board.createRect({x: geom.xPts[0] - 3, y: geom.yPts[0] - 3, width: (geom.xPts[1] - geom.xPts[0] + 6), height: (geom.yPts[1] - geom.yPts[0] + 6) });
            shape.setStroke({color: new dojo.Color([255,0,0,0.75]), width: 2});
            shape.setFill(new dojo.Color([255,0,0,0.25]));

            line = board.createLine({x1: geom.xPts[0] - 3, y1: geom.yPts[0] - 3, x2: geom.xPts[1] + 3, y2: geom.yPts[1] + 3});
            line.setStroke({color: "#FF0000", width: 2});

            line = board.createLine({x1: geom.xPts[1] + 3, y1: geom.yPts[0] - 3, x2: geom.xPts[0] - 3, y2: geom.yPts[1] + 3});
            line.setStroke({color: "#FF0000", width: 2});

            return shape;
        } else if(geom.shapeType === 'moveOverlay'){
            shape = board.createRect({x: geom.xPts[0] - 3, y: geom.yPts[0] - 3, width: (geom.xPts[1] - geom.xPts[0] + 6), height: (geom.yPts[1] - geom.yPts[0] + 6) });
            shape.setStroke({color: new dojo.Color([0,0,255,0.75]), width: 2});
            shape.setFill(new dojo.Color([0,0,255,0.25]));

            return shape;
        } else if(geom.shapeType === 'moveUpOverlay'){
            shape = board.createRect({x: geom.xPts[0] - 3, y: geom.yPts[0] - 3, width: (geom.xPts[1] - geom.xPts[0] + 6), height: (geom.yPts[1] - geom.yPts[0] + 6) });
            //shape.setStroke({color: new dojo.Color([0,0,255,0.75]), width: 2});
            shape.setFill(new dojo.Color([0,0,255,0.15]));

            line = board.createLine({x1: geom.xPts[0] - 5, y1: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2), x2: geom.xPts[1] + 3, y2: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2)});
            line.setStroke({color: "#0000FF", width: 2});

            line = board.createLine({x1: geom.xPts[0] - 5, y1: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2), x2: geom.xPts[0] + ((geom.xPts[1] - geom.xPts[0]) / 2), y2: geom.yPts[0] -5});
            line.setStroke({color: "#0000FF", width: 2});

            line = board.createLine({x1: geom.xPts[0] + ((geom.xPts[1] - geom.xPts[0]) / 2), y1: geom.yPts[0] -5, x2: geom.xPts[1] + 5, y2: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2)});
            line.setStroke({color: "#0000FF", width: 2});

            return shape;
        } else if(geom.shapeType === 'moveDownOverlay'){
            shape = board.createRect({x: geom.xPts[0] - 3, y: geom.yPts[0] - 3, width: (geom.xPts[1] - geom.xPts[0] + 6), height: (geom.yPts[1] - geom.yPts[0] + 6) });
            //shape.setStroke({color: new dojo.Color([0,0,255,0.75]), width: 2});
            shape.setFill(new dojo.Color([0,0,255,0.15]));

            line = board.createLine({x1: geom.xPts[0] - 5, y1: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2), x2: geom.xPts[1] + 3, y2: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2)});
            line.setStroke({color: "#0000FF", width: 2});

            line = board.createLine({x1: geom.xPts[0] - 5, y1: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2), x2: geom.xPts[0] + ((geom.xPts[1] - geom.xPts[0]) / 2), y2: geom.yPts[1] + 5});
            line.setStroke({color: "#0000FF", width: 2});

            line = board.createLine({x1: geom.xPts[0] + ((geom.xPts[1] - geom.xPts[0]) / 2), y1: geom.yPts[1] + 5, x2: geom.xPts[1] + 5, y2: geom.yPts[0] + ((geom.yPts[1] - geom.yPts[0]) / 2)});
            line.setStroke({color: "#0000FF", width: 2});

            return shape;
        } else if (geom.shapeType === 'triangle') {
            shape = board.createTriangle(geom.xPts, geom.yPts);
        } else if (geom.shapeType === 'quadrangle') {
            //console.debug('Draw quadrangle: x='+geom.xPts[0]+','+geom.xPts[1]+', y='+geom.yPts[0]+','+geom.yPts[1]);
            var scale = 2;
            var distance = Math.sqrt((Math.pow(geom.xPts[1] - geom.xPts[0],2)) + (Math.pow(geom.yPts[0] - geom.yPts[1],2)));
            var edgeLength = distance/scale;

            shape = board.createPolyline(
                [ geom.xPts[0], geom.xPts[0], (geom.xPts[0]+edgeLength), (geom.xPts[0]+edgeLength) ],
                [ geom.yPts[1], (geom.yPts[1]-edgeLength), (geom.yPts[1]-edgeLength), geom.yPts[1] ]
            );
        } else if (geom.shapeType === 'circle') {
            //console.debug('Draw circle: x='+geom.xPts[0]+','+geom.xPts[1]+', y='+geom.yPts[0]+','+geom.yPts[1]);
            var scale = 2;
            var distance = Math.sqrt((Math.pow(geom.xPts[1] - geom.xPts[0],2)) + (Math.pow(geom.yPts[0] - geom.yPts[1],2)));
            var diameter = distance/scale;

            shape = board.createEllipse({
                cx: ((geom.xPts[1] - geom.xPts[0])/2) + geom.xPts[0],
                cy: ((geom.yPts[1] - geom.yPts[0])/2) + geom.yPts[0],
                rx: (diameter)/2,
                ry: (diameter)/2
            });

        } else if (geom.shapeType === 'equation' && geom.data) {
            shape = board.createEquation({x: geom.xPts[0], y: geom.yPts[0], data: geom.data});
        } else if(geom.shapeType === 'graph' && geom.data){
//            var data = dojox.html.entities.decode(geom.data.value || geom.data);
//            var points = GraphPreview.RenderGraph(data);
            shape = board.createGraph({x: geom.xPts[0], y: geom.yPts[0], data: geom.data});
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
//            shape = board.createPath(path);
//            shape.applyTransform(dojox.gfx.matrix.scale(1/scale,1/scale));
//            shape.applyTransform({ dx: location.x, dy: location.y });
//            shape.scale = scale;
        } else if(geom.shapeType === 'polygon'){
            shape = board.createPolyline(geom.xPts, geom.yPts);
        } else if(geom.shapeType === 'update') {
            var shapeToUpdate = getShapeFromGeom(geom,board);
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
            shape.worksheet = this.worksheet;
        }
        return shape;
    }
};