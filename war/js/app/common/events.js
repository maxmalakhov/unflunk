/**
 * Created with IntelliJ IDEA.
 * User: max
 * Date: 6/24/13
 * Time: 11:13 AM
 * To change this template use File | Settings | File Templates.
 */

function BoardEvents(worksheet) {
    this.worksheet = worksheet;
    this.former = worksheet.former;
    this.drawer = worksheet.drawer;

    this.downPoint = false;
    this.textPoint = false;
    this.points = [];
    this.mouseDown = false;
    this.overlayShape = false;
    this.process = false;
    this.selectedShape = false;
}

BoardEvents.prototype.doGfxMouseDown = function(evt) {
    evt.preventDefault();

    if (this.worksheet.tool === 'hand') {
        return;
    }

    var pt = this.worksheet.getGfxMouse(evt);
    //console.dir(pt);
    this.downPoint = pt;
    this.textPoint = pt;
    this.points = [pt];
    this.mouseDown = true;
    this.overlayShape = false;
    this.process = true;
    this.drawer.penLines = [];

    this.selectedShape = this.worksheet.board.getHoveredShape(pt);
};

BoardEvents.prototype.doGfxMouseMove = function(evt) {
    evt.preventDefault();

    if (this.worksheet.tool === 'hand') {
        return;
    }

    var board = this.worksheet.board;
    var tool = this.worksheet.tool;
    var pt = this.worksheet.getGfxMouse(evt);
    var geom = false;
    var shape = false;

    var createOffsetBB = function(origBB, pointInBB, newPt){
        var xDelta = Math.abs(pointInBB.x - origBB.x1);
        var yDelta = Math.abs(pointInBB.y - origBB.y1);

        var bounds = {
            x1: (newPt.x - xDelta),
            y1: (newPt.y - yDelta)
        };

        bounds.x2 = bounds.x1 + (origBB.x2 - origBB.x1);
        bounds.y2 = bounds.y1 + (origBB.y2 - origBB.y1);

        return bounds;
    };

    if(this.mouseDown){
        if((tool === 'pen' || tool === 'visionobjects' || tool === 'highlighter') && !this.selectedShape ){

            if((this.points[this.points.length - 1].x !== pt.x) || (this.points[this.points.length - 1].y !== pt.y)){
                this.points.push(pt);

                var stroke = {};
                if (this.worksheet.tool === 'highlighter') {
                    stroke.width = this.former.stroke.highlighterWidth;
                    stroke.color = this.former.stroke.highlighterColor;
                }

                if(this.points.length > 1){
                    //make sure its not the same point as last time
                    geom = this.former.createLine(
                        {x1: this.points[this.points.length - 2].x,
                            y1: this.points[this.points.length - 2].y,
                            x2: this.points[this.points.length - 1].x,
                            y2: this.points[this.points.length - 1].y },
                        stroke
                    );
                    geom.shapeType = 'pen';
                }
            }
        }else{
            var bounds = { x1:this.downPoint.x, y1:this.downPoint.y, x2: pt.x, y2: pt.y};
            if(!(tool === 'pen' || tool === 'visionobjects' || tool === 'highlighter')){
                board.remove(this.overlayShape); // remove the prev. shape if it isn't freehand board
            }
            if(tool === 'rect' && !this.selectedShape ){
                geom  = this.former.createRect(bounds, false);
            }else if(tool === 'filledRect' && !this.selectedShape ){
                geom  = this.former.createRect(bounds, true);
            }else if(tool === 'ellipse' && !this.selectedShape ){
                geom  = this.former.createEllipse(bounds, false);
            }else if(tool === 'filledEllipse' && !this.selectedShape ){
                geom  = this.former.createEllipse(bounds, true);
            }else if(tool === 'line' && !this.selectedShape ){
                geom  = this.former.createLine(bounds);
            }else if(tool === 'move'){
                if(this.selectedShape && this.downPoint){
                    geom = this.former.createMoveOverlay(this.selectedShape.wbbb);

                    var offBB = createOffsetBB(this.selectedShape.wbbb, this.downPoint, pt);
                    //console.dir(offBB);
                    var geom2 = this.former.createMoveOverlay(offBB);

                    this.drawer.draw(geom2, board);
                }
            }else if(tool === 'triangle' && !this.selectedShape ){
                geom  = this.former.createTriangle(bounds, false);
            }else if(tool === 'quadrangle' && !this.selectedShape ){
                geom  = this.former.createQuadrangle(bounds, false);
            }else if(tool === 'circle' && !this.selectedShape ){
                geom  = this.former.createCircle(bounds, false);
            }
        }
    } else {
        if(tool === 'move'){
            shape = board.getHoveredShape(pt);
            if(shape){
                geom = this.former.createMoveOverlay(shape.wbbb);
            }
        }
    }
    //mouse up or down doesn't matter for the select and delete tools
    if(tool === 'delete'){
        shape = board.getHoveredShape(pt);
        if(shape){
            geom = this.former.createDeleteOverlay(shape.wbbb);
        }
    }else if(tool === 'moveUp'){
        shape = board.getHoveredShape(pt);
        if(shape){
            geom = this.former.createMoveUpOverlay(shape.wbbb);
        }
    }else if(tool === 'moveDown'){
        shape = board.getHoveredShape(pt);
        if(shape){
            geom = this.former.createMoveDownOverlay(shape.wbbb);
        }
    }
    // draw overlay geom
    if(geom) {
        this.overlayShape = this.drawer.draw(geom, board);
    }
};

BoardEvents.prototype.doGfxMouseUp = function(evt) {
    evt.preventDefault();

    if (this.worksheet.tool === 'hand') {
        return;
    }

    var board = this.worksheet.board;
    var tool = this.worksheet.tool;
    var pt = this.worksheet.getGfxMouse(evt);
    this.mouseDown = false;
    this.process = false;

    var geom = false;
    var shape = false;

    //always clear the overlay
    board.remove(this.overlayShape);
    dojo.forEach(this.drawer.penLines, function(overlayLine){
        board.remove(overlayLine);
    });

    if(this.downPoint){

        var bounds = { x1:this.downPoint.x, y1:this.downPoint.y, x2: pt.x, y2: pt.y };
        //worksheet.mouseDownPt = null;
        if(tool === 'rect'){
            geom  = this.former.createRect(bounds, false);
        }else if(tool === 'filledRect'){
            geom  = this.former.createRect(bounds, true);
        }else if(tool === 'ellipse'){
            geom  = this.former.createEllipse(bounds,false);
        }else if(tool === 'filledEllipse'){
            geom  = this.former.createEllipse(bounds,true);
        }else if(tool === 'line'){
            geom  = this.former.createLine(bounds);
        }else if(tool === 'pen'){
            geom = this.former.createPen(this.points);
            console.debug("num pen points sending:",geom.xPts.length);
        }else if(tool === 'delete'){
            shape = board.getHoveredShape(pt);
            if(shape){
                geom = this.former.createDelete(shape);
            }
        }else if(tool === 'move'){
            if(this.selectedShape && this.downPoint) {
                var ptDelta = {x: (pt.x - this.downPoint.x),y: (pt.y - this.downPoint.y)};
                geom = this.former.createMove(this.selectedShape, ptDelta);
            }
        }else if(tool === 'moveUp'){
            shape = board.getHoveredShape(pt);
            if(shape){
                geom = this.former.createMoveUp(shape);
            }
        }else if(tool === 'moveDown'){
            shape = board.getHoveredShape(pt);
            if(shape){
                geom = this.former.createMoveDown(shape);
            }
        }else if(tool === 'text'){
            this.worksheet.openTextDialog(pt);
        }else if(tool === 'triangle'){
            geom  = this.former.createTriangle(bounds, false);
        }else if(tool === 'quadrangle'){
            geom  = this.former.createQuadrangle(bounds, false);
        }else if(tool === 'circle'){
            geom  = this.former.createCircle(bounds,false);
        }else if(tool === 'equation'){
            this.worksheet.openEquationtDialog(pt);
        }else if(tool === 'graph'){
            this.worksheet.openGraphDialog(pt);
        }else if(tool === 'visionobjects'){
            geom = this.former.createPen(this.points);
            geom = moduleRecognition.process(geom, board);
        }else if(tool === 'highlighter') {
            geom = this.former.createPen(this.points,
                {width: this.former.stroke.highlighterWidth, color: this.former.stroke.highlighterColor});
        }else if(tool === 'document'){
//                    worksheet.textPoint = pt;
//                    dijit.byId('postmentDialog').show();
//                    dijit.byId('documents').show();
            //getDocs();
        }
        if(geom){
            console.debug("sendMessage");
            this.worksheet.sendMessage({geometry:geom});
        }
    }

    // draw geom
    if(geom) {
        this.drawer.draw(geom, board);
    }
    //clear everything
    this.downPoint = null;
    this.selectedShape = null;
    this.points = [];
};
BoardEvents.prototype.resetTextPoint = function() {
    this.textPoint = null;
};
BoardEvents.prototype.doIncrementalText = function(text) {
    if((text !== '') && (this.textPoint)){
        var geom = this.former.createText(this.textPoint,text);
        this.drawer.draw(geom, this.worksheet.board);
    }
};
BoardEvents.prototype.doGraphInput = function(data) {
    data = dojo.string.trim(data);
    if((data !== '') && this.textPoint){
        var geom = this.former.createGraph(this.textPoint, Preview.getSize(), data);
        this.drawer.draw(geom, this.worksheet.board);
        this.textPoint = null;
        this.worksheet.sendMessage({geometry:geom});
        return true;
    }
    return false;
};
BoardEvents.prototype.doEquationInput = function(data) {
    data = dojo.string.trim(data);
    if((data !== '') && this.textPoint){
        var geom = this.former.createEquation(this.textPoint, Preview.getSize(), data);
        this.drawer.draw(geom, this.worksheet.board);
        this.textPoint = null;
        this.worksheet.sendMessage({geometry:geom});
        return true;
    }
    return false;
};
BoardEvents.prototype.doAddText = function(text) {
    if((text !== '') && (this.textPoint)){
        dijit.byId('textDialog').hide();
        var geom = this.former.createText(this.textPoint,text);
        this.drawer.draw(geom, this.worksheet.board);
        this.textPoint = null;
        this.worksheet.sendMessage({geometry:geom});
        return true;
    }
    return false;
};
BoardEvents.prototype.doClearBoard = function() {
    var geom = this.former.createClearDrawing();
    this.drawer.draw(geom, this.worksheet.board);

    this.worksheet.sendMessage({geometry: geom });
};
BoardEvents.prototype.doAddDocument = function(mimeType, url, point) {
    var geom = false;
    if ( mimeType === "application/pdf" ) {
        geom = this.former.createPdf(point.x, point.y, url);
    } else if ( mimeType === "video/mp4") {
        geom = this.former.createVideo(point.x, point.y, url);
    } else {
        geom = this.former.createImage({x1 : point.x, y1 : point.y, x2 : point.x + 30, y2 : point.y - 30}, url);
    }
    this.drawer.draw(geom, this.worksheet.board);
    this.worksheet.sendMessage({geometry:geom});
};