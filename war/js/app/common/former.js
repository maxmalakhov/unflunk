/**
 * Created with IntelliJ IDEA.
 * User: max
 * Date: 6/19/13
 * Time: 7:43 PM
 * To change this template use File | Settings | File Templates.
 */

function Former() {

    this.stroke = {
        fillColor: "#FFFFFF",
        lineColor: "#000000",
        lineWidth: 3,
        highlighterColor: "#FFFF00", // Yellow
        highlighterWidth: 5,
        fontSize: 12
    };

}

Former.prototype.normalizeBounds = function(bounds){
    //first point should be upper left of rect
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
Former.prototype.addTimeRand = function(geom){
    geom.cTime = new Date().getTime();
    geom.cRand = Math.round(100000000000 * Math.random());
    geom.fromUser = userName; // userName is global var
    return geom;
};
Former.prototype.createVideo = function(x,y,src) {
    var geom = {
        xPts: [ x ],
        yPts: [ y ],
        shapeType : 'video'
    };
    geom.text = src;
    return this.addTimeRand(geom);
};
Former.prototype.createPdf = function(x,y,src) {
    var geom = {
        xPts: [ x ],
        yPts: [ y ],
        shapeType : 'pdf'
    };
    geom.text = src;
    return this.addTimeRand(geom);
};
Former.prototype.createImage = function(bounds,textData){
    bounds = this.normalizeBounds(bounds);
    var geom = {
        xPts: [bounds.x1,bounds.x2],
        yPts: [bounds.y1,bounds.y2],
        shapeType: 'image'
    };
    geom.dataStr = textData;
    geom.text = textData;

    return this.addTimeRand(geom);
};
Former.prototype.createTriangle = function(bounds,filled){
    bounds = this.normalizeBounds(bounds);
    var geom = {
        xPts: [bounds.x1,bounds.x2,bounds.x2],
        yPts: [bounds.y1,bounds.y1, bounds.y2]
    };
    geom.shapeType = 'triangle';
    geom.filled = filled;
    if(filled){
        geom.fillColor = this.stroke.fillColor;
    }
    geom.lineColor = this.stroke.lineColor;
    geom.lineStroke = this.stroke.lineWidth;

    return this.addTimeRand(geom);
};
Former.prototype.createQuadrangle = function(bounds,filled){
    bounds = this.normalizeBounds(bounds);
    var geom = {
        xPts: [bounds.x1,bounds.x2],
        yPts: [bounds.y1,bounds.y2]
    };
    geom.shapeType = 'quadrangle';
    geom.filled = filled;
    if(filled){
        geom.fillColor = this.stroke.fillColor;
    }
    geom.lineColor = this.stroke.lineColor;
    geom.lineStroke = this.stroke.lineWidth;

    return this.addTimeRand(geom);
};
Former.prototype.createCircle = function(bounds,filled){
    bounds = this.normalizeBounds(bounds);
    var geom = {
        xPts: [bounds.x1,bounds.x2],
        yPts: [bounds.y1,bounds.y2]
    };
    geom.shapeType = 'circle';
    geom.filled = filled;
    if(filled){
        geom.fillColor = this.stroke.fillColor;
    }
    geom.lineColor = this.stroke.lineColor;
    geom.lineStroke = this.stroke.lineWidth;

    return this.addTimeRand(geom);
};
Former.prototype.createSelect = function(bounds){
    bounds = this.normalizeBounds(bounds);
    var geom = {
        xPts: [bounds.x1,bounds.x2],
        yPts: [bounds.y1,bounds.y2]
    };
    geom.shapeType = 'select';
    return geom;
};
Former.prototype.createDeleteOverlay = function(bounds){
    bounds = this.normalizeBounds(bounds);
    var geom = {
        xPts: [bounds.x1,bounds.x2],
        yPts: [bounds.y1,bounds.y2]
    };
    geom.shapeType = 'deleteOverlay';
    return geom;
};
Former.prototype.createMoveOverlay = function(bounds){
    bounds = this.normalizeBounds(bounds);
    var geom = {
        xPts: [bounds.x1,bounds.x2],
        yPts: [bounds.y1,bounds.y2]
    };
    geom.shapeType = 'moveOverlay';
    return geom;
};
Former.prototype.createMoveUpOverlay = function(bounds){
    var geom = this.createMoveOverlay(bounds);
    geom.shapeType = 'moveUpOverlay';
    return geom;
};
Former.prototype.createMoveDownOverlay = function(bounds){
    var geom = this.createMoveOverlay(bounds);
    geom.shapeType = 'moveDownOverlay';
    return geom;
};
Former.prototype.createMove = function(shape, ptDelta){
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
Former.prototype.createMoveUp = function(shape, ptDelta){
    var geom = {};
    geom.shapeType = 'moveUp';
    geom.cTime = shape.cTime;
    geom.cRand = shape.cRand;
    geom.fromUser = shape.fromUser;
    return geom;
};
Former.prototype.createMoveDown = function(shape, ptDelta){
    var geom = {};
    geom.shapeType = 'moveDown';
    geom.cTime = shape.cTime;
    geom.cRand = shape.cRand;
    geom.fromUser = shape.fromUser;
    return geom;
};
Former.prototype.createDelete = function(shape){
    var geom = {};
    geom.shapeType = 'delete';
    geom.cTime = shape.cTime;
    geom.cRand = shape.cRand;
    geom.fromUser = shape.fromUser;
    return geom;
};
Former.prototype.createEllipse = function(bounds, filled){
    bounds = this.normalizeBounds(bounds);
    var geom = {
        xPts: [bounds.x1,bounds.x2],
        yPts: [bounds.y1,bounds.y2]
    };
    geom.shapeType = 'ellipse';
    geom.filled = filled;
    if(filled){
        geom.fillColor = this.stroke.fillColor;
    }
    geom.lineColor = this.stroke.lineColor;
    geom.lineStroke = this.stroke.lineWidth;

    return this.addTimeRand(geom);
};
Former.prototype.createLine = function(bounds, myStroke){
    var stroke = myStroke || {};
    var geom = {
        xPts: [bounds.x1,bounds.x2],
        yPts: [bounds.y1,bounds.y2]
    };
    geom.shapeType = 'line';
    geom.fillColor = this.stroke.fillColor;
    geom.lineColor = stroke.color || this.stroke.lineColor;
    geom.lineStroke = stroke.width || this.stroke.lineWidth;

    return this.addTimeRand(geom);
};
Former.prototype.createPen = function(points, myStroke){
    var stroke = myStroke || {};
    var xPts = [];
    var yPts = [];
    dojo.forEach(points, function(point){
        xPts.push(point.x);
        yPts.push(point.y);
    });
    var geom = {shapeType: 'pen',
        fillColor: this.stroke.fillColor,
        lineColor: stroke.color || this.stroke.lineColor,
        lineStroke: stroke.width || this.stroke.lineWidth,
        xPts: xPts,
        yPts: yPts
    };
    return this.addTimeRand(geom);
};

Former.prototype.createRect = function(bounds,filled){
    bounds = this.normalizeBounds(bounds);
    var geom = {
        xPts: [bounds.x1,bounds.x2],
        yPts: [bounds.y1,bounds.y2]
    };
    geom.shapeType = 'rect';
    geom.filled = filled;
    if(filled){
        geom.fillColor = this.stroke.fillColor;
    }
    geom.lineColor = this.stroke.lineColor;
    geom.lineStroke = this.stroke.lineWidth;

    return this.addTimeRand(geom);
};

Former.prototype.createClearDrawing = function(){
    var geom = {shapeType: 'clear'};
    return geom;
};
Former.prototype.createText = function(pt,text){
    var geom = {
        xPts: [pt.x],
        yPts: [pt.y]
    };
    geom.shapeType = 'text';
    geom.text = text;
    geom.lineStroke = this.stroke.fontSize;
    geom.lineColor = this.stroke.lineColor;

    return this.addTimeRand(geom);
};
Former.prototype.createEquation = function(pt,size,data){
    var geom = {
        xPts: [pt.x, size.width],
        yPts: [pt.y, size.height]
    };
    geom.shapeType = 'equation';
    geom.data = dojox.html.entities.encode(data);
    geom.lineStroke = this.stroke.fontSize;
    geom.lineColor = this.stroke.lineColor;

    return this.addTimeRand(geom);
};
Former.prototype.createGraph = function(pt,size,data){
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
    geom.lineStroke = this.stroke.fontSize;
    geom.lineColor = this.stroke.lineColor;

    return this.addTimeRand(geom);
};
Former.prototype.createVOPen = function(pt,shape){
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
        fillColor: this.stroke.fillColor,
        lineColor: this.stroke.lineColor,
        lineStroke: this.stroke.lineWidth,
        xPts: xPts,
        yPts: yPts
    };
    return this.addTimeRand(geom);
};