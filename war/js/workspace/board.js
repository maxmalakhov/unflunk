function Whiteboard(name, params) {
    JXG.Options.renderer = 'canvas';
    JXG.Options.text.useMathJax = true;

    this._name = name;

    params = params || {};
    params.axis = params.axis || false;
    params.showCopyright = params.showCopyright || false;
    params.boundingbox = params.boundingbox || [0, 70, 70, 0];
    params.keepaspectratio = params.keepaspectratio || true;
    params.showNavigation = !(params.hideNavigation || false);

    this._params = params;
    this._board = JXG.JSXGraph.initBoard(this._name, params);
    this.children = []; // geom, shape
}

Whiteboard.prototype.initEvents = function(events) {
    if(events) {
        for(var i= 0; i < events.length; i++) {
            this._board.on(events[i].name, events[i].func);
        }
    }
};

Whiteboard.prototype.showNavigation = function(show) {
    this._board.setProperty({ showNavigation : show });
};

Whiteboard.prototype.clear = function() {
    var viewBox = this._board.getBoundingBox();
    JXG.JSXGraph.freeBoard(this._board);
    this._board = JXG.JSXGraph.initBoard(this._name, this._params);
    this._board.setBoundingBox(viewBox);
};

Whiteboard.prototype.remove = function(shape) {
    var board = this._board;
    if(shape) {
        if(shape.pointList) {
            dojo.forEach(shape.pointList, function(point){
                board.removeObject(point);
            });
        }
        board.removeObject(shape);
    }
};

Whiteboard.prototype.createEquation = function(params) {
    var data = '$'+dojox.html.entities.decode(params.data.value || params.data)+'$';
    var equation = this._board.create('text', [params.x, params.y, function () { return data; }]);
    return this._createElement(equation);
};

Whiteboard.prototype.createGraph = function(params) {
    var board = this._board;
    var data = dojox.html.entities.decode(params.data.value || params.data);
    var points = GraphPreview.RenderGraph(data);
    var factor = { x: 0.065, y: 0.1, degrees: 180, xOffset: 3/2, yOffset: 3/2 };
    if (points.xValues.length === 2 ) {
        factor.degrees = 90;
    }
    var graph = board.create('curve', [points.xValues, points.yValues], { handDrawing : false });
    var rotationCenter = board.create('point', [factor.x*points.center.x,factor.y*points.center.y], {style:6, name:''});
    var rotator = board.create('transform', [factor.degrees*Math.PI/180.0,rotationCenter], {type:'rotate'});
    var scaller = board.create('transform', [factor.x,factor.y], {type:'scale'});
    var mover = board.create('transform', [params.x/factor.xOffset,params.y/factor.yOffset], {type:'translate'});
    // normalize a graph
    scaller.bindTo(graph);
    rotator.bindTo(graph);
    mover.bindTo(graph);

    board.removeObject(rotationCenter);

    board.update();

//    var graph = this._board.create('functiongraph', [function(x) {
//        try {
//            var formula = data.replace(/[xX]/g,'('+x+')');
//            //console.debug('Formula:'+formula);
//            return GraphPreview.mathProcessor.parse(formula);
//        } catch(e) {
//            //console.error(e);
//            // TODO: Display the error message
//            return 0;
//        }
//    }],{ strokeColor: '#ff0000' });

    return this._createElement(graph);
}


Whiteboard.prototype.createImage = function(params) {
    var image = this._board.create('image', [params.src, [params.x, params.y], [params.width, params.height]]);
    return this._createElement(image);
};

Whiteboard.prototype.createVideo = function(params) {
    var id = "video" + Math.floor(Math.random()*100000);
    var text = this._board.create('text', [params.x, params.y, '<video id="' + id + '" width="640" controls><source src="' + params.src + '" type="video/mp4"/></canvas>'], { display : 'html' });
    return this._createElement(text);
};

Whiteboard.prototype.createPdf = function(params) {
    var id = "pdf" + Math.floor(Math.random()*100000);
    var text = this._board.create('text', [0, 70, '<canvas id="' + id + '"></canvas>'], { display : 'html' });

    PDFJS.disableWorker = true;
    PDFJS.getDocument(params.src).then(function getPdfHelloWorld(pdf) {
          //
          // Fetch the first page
          //
          pdf.getPage(1).then(function getPageHelloWorld(page) {
            var scale = 1.0;
            var viewport = page.getViewport(scale);
            if ( viewport.width > viewport.height ) {
                scale = 700 / viewport.width;
            } else {
                scale = 700 / viewport.height;
            }
            viewport = page.getViewport(scale);
            //
            // Prepare canvas using PDF page dimensions
            //
            var canvas = dojo.query("#" + id)[0];//.getElementById('the-canvas');
            canvas.parentElement.style.zIndex = -1;
            
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            //
            // Render PDF page into canvas context
            //
            page.render({canvasContext: context, viewport: viewport});
          });
          
          return this._createElement(text);
    });
    
    return this._createElement(text);
};

Whiteboard.prototype.createLine = function(xPts, yPts) {
    var board = this._board;
    var stroke = {};
    stroke.handDrawing = false;
    stroke.straightFirst = false;
    stroke.straightLast = false;

    // points of the shape
    var pointList = [];
    // create the points
    for(var i = 0; i < xPts.length && i < yPts.length; i++) {
        pointList.push(board.create('point', [xPts[i], yPts[i]], {size:0.5,name:''}));
    }
    var line = board.create('line', pointList, stroke);
    line.pointList = pointList;

    return this._createElement(line);
};

Whiteboard.prototype.createPenLine = function(xPts, yPts, withPoints) {
    var stroke = { handDrawing: false };
    var pointList = [];
    var penLine = this._board.create('curve', [xPts, yPts], stroke);

    return this._createElement(penLine);
};

Whiteboard.prototype.createText = function(params) {
    var text = this._board.create('text', [params.x, params.y, params.text]);

    return this._createElement(text);
};

Whiteboard.prototype.createEllipse = function(params) {
    var c = Math.sqrt(Math.abs(params.rx - params.ry));
    var f1 = this._board.create('point', params.rx > params.ry ? [params.cx + c, params.cy] : [params.cx, params.cy + c], {size:0.5,name:''});

    //var f2 = this._board.create('point', params.rx > params.ry ? [params.cx - c, params.cy] : [params.cx, params.cy - c], {size:0.5,name:''});
    var pt = this._board.create('point', [params.cx + params.rx, params.cy], {size:0.5,name:''});
    
    var ellipse = this._board.create('ellipse', [f1, f1, pt], { hasInnerPoints : true });
    ellipse.pointList = [f1, pt];
    return this._createElement(ellipse);
};

Whiteboard.prototype.createCurve = function(points, params) {
    params = params || {};
    params.handDrawing = true;
    var curve = this._board.create('curve', points, params);
    return this._createElement(curve);
};

Whiteboard.prototype.createTriangle = function(xPts,yPts) {
    var triangle = new Triangle(this._board, [xPts[0], yPts[0]], [xPts[1], yPts[1]], [xPts[2], yPts[2]]);
    if(triangle.bounds === 'undefined') {
        triangle.bounds = {};
    }
    return this._createElement(triangle);
};

Whiteboard.prototype.createRect = function(params) {
    var p1 = this._board.create('point', [params.x, params.y], {size:0.5,name:''});
    var p2 = this._board.create('point', [params.x + params.width, params.y], {size:0.5,name:''});
    var p3 = this._board.create('point', [params.x + params.width, params.y + params.height], {size:0.5,name:''});
    var p4 = this._board.create('point', [params.x, params.y + params.height], {size:0.5,name:''});
    var rectangle = this._board.create('polygon', [p1, p2, p3, p4], { hasInnerPoints : true });
    rectangle.pointList = [p1, p2, p3, p4];
    return this._createElement(rectangle);
};

Whiteboard.prototype.createPolyline = function(xPts, yPts) {
    var pointList = [];
    for ( var i = 0; i < xPts.length && i < yPts.length; i++ ) {
        var point = this._board.create('point', [xPts[i], yPts[i]],{size:0.5,name:''});
        pointList.push(point);
    }
    var polyline = this._board.create('polygon', pointList, { hasInnerPoints : true });
    polyline.pointList = pointList;
    return this._createElement(polyline);
};

Whiteboard.prototype.getUsrCoordsOfMouse = function(evt) {
    return this._board.getUsrCoordsOfMouse(evt);
};

Whiteboard.prototype._createElement = function(element) {
    var drawing = this;
    var board = this._board;
    element.setStroke = function(stroke) {
        if(this.borders) {
            dojo.forEach(this.borders, function(border){
                border.setProperty({"strokeColor" : stroke.color, "strokeWidth" : stroke.width});
            });
        } else {
            this.setProperty({"strokeColor" : stroke.color, "strokeWidth" : stroke.width});
        }
    };
    element.setFill = function(fillColor) {
        this.setProperty({"fillColor" : fillColor});
    };
    element.setFont = function(font) {
    };
    element.applyTransform = function(points) {
        this.setPositionDirectly(JXG.COORDS_BY_USER, [points.dx, points.dy]);
    };
    element.moveToFront = function() { /* remove and recreate */ };
    element.moveToBack = function() { /* ??? */ };
    element.getTransformedBoundingBox = function() {
        if (typeof this.bounds === 'function') {
            var bounds = this.bounds();
            if(bounds) {
                return [ { x: bounds[0], y: bounds[1] }, { x: 0, y: 0 }, { x: bounds[2], y: bounds[3] } ];
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    element.moveTo = function(xPts, yPts) {
        //var pointList = (element.elType === 'text') ? [element] : element.pointList;
        if(element.pointList) {
            for(var i = 0; i<xPts.length && i<yPts.length && i<element.pointList.length; i++) {
                element.pointList[i].setPosition(JXG.COORDS_BY_USER, [xPts[i],yPts[i]]);
            }
        } else {
            if(element.elType === 'text') {
//                var offset = board.create('transform', [xPts[0],yPts[0]], {type:'translate'});
//                offset.bindTo(element);
                element.coords.usrCoords[1] = xPts[0];
                element.coords.usrCoords[2] = yPts[0];
                element.coords.usr2screen();
            }
        }
        board.update();
    };

    var callback = function(evt) {
        var newXPts = [], newYPts = [];
        var pointList = (element.elType === 'text') ? [element] : element.pointList;
        dojo.forEach(pointList, function(point){
            newXPts.push(point.X());
            newYPts.push(point.Y());
        });
        var newGeom = dojo.clone(element.geom);
        newGeom.shapeType = 'update';
        newGeom.xPts = newXPts;
        newGeom.yPts = newYPts;
        element.worksheet.sendMessage({geometry:newGeom});
    };
    // add an event to the shape and its points
    dojo.forEach(element.pointList, function(point){
        if(point.coords){
            point.on("up", callback);
            point.coords.on('update', function (ou, os) {
                if(drawing.drawMode) {
                    this.usrCoords = ou;
                    this.usr2screen();
                }
            });
        }
    });
    element.on("up", callback);
    
    this.children.push(element);
    return element;
};