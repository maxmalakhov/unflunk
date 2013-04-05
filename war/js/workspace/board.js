function Whiteboard(name, params) {
	JXG.Options.renderer = 'canvas';
	
	this._name = name;
	
	params = params || {};
	params.axis = params.axis || false;
	params.showCopyright = params.showCopyright || false;
	params.boundingbox = params.boundingbox || [0, 70, 70, 0];
	params.showNavigation = !(params.hideNavigation || false);
	
	this._params = params;
	this._board = JXG.JSXGraph.initBoard(this._name, params);
	this.children = new Array();
}

Whiteboard.prototype.showNavigation = function(show) {
	this._board.setProperty({ showNavigation : show });
}

Whiteboard.prototype.clear = function() {
	JXG.JSXGraph.freeBoard(this._board);
	this._board = JXG.JSXGraph.initBoard(this._name, this._params);
}

Whiteboard.prototype.createImage = function(params) {
	var image = this._board.create('image', [params.src, [params.x, params.y], [params.width, params.height]]);
	return this._createElement(image);
}

Whiteboard.prototype.createVideo = function(params) {
	var id = "video" + Math.floor(Math.random()*100000);
	var text = this._board.create('text', [params.x, params.y, '<video id="' + id + '" width="640" controls><source src="' + params.src + '" type="video/mp4"/></canvas>'], { display : 'html' });
	return this._createElement(text);
}

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
}

Whiteboard.prototype.createLine = function(params) {
	var line = this._board.create('curve', [[params.x1, params.y1], [params.x2, params.y2]], { handDrawing : true });
	return this._createElement(line);
}
 
Whiteboard.prototype.createText = function(params) {
	var text = this._board.create('text', [params.x, params.y, params.text]);
	return this._createElement(text);
}

Whiteboard.prototype.createEllipse = function(params) {
	var c = Math.sqrt(Math.abs(params.rx - params.ry));
	var f1 = this._board.create('point', params.rx > params.ry ? [params.cx + c, params.cy] : [params.cx, params.cy + c]);
	var f2 = this._board.create('point', params.rx > params.ry ? [params.cx - c, params.cy] : [params.cx, paramx.cy - c]);
	var pt = this._board.create('point', [params.cx + params.rx, params.cy]);
	
	var ellipse = this._board.create('ellipse', [f1, f2, pt], { hasInnerPoints : true });
	return this._createElement(ellipse);
}

Whiteboard.prototype.createCurve = function(points, params) {
	params = params || {};
	params.handDrawing = true;
	var curve = this._board.create('curve', points, params);
	return this._createElement(curve);
}

Whiteboard.prototype.createTriangle = function(params) {
	var triangle = new Triangle(this._board, [params.x1, params.y1], [params.x2, params.y1], [params.x2, params.y2]);
	return this._createElement(triangle);
}

Whiteboard.prototype.createRect = function(params) {
	var p1 = this._board.create('point', [params.x, params.y]);
	var p2 = this._board.create('point', [params.x + params.width, params.y]);
	var p3 = this._board.create('point', [params.x + params.width, params.y + params.height]);
	var p4 = this._board.create('point', [params.x, params.y + params.height]);
	var rectangle = this._board.create('polygon', [p1, p2, p3, p4], { hasInnerPoints : true });
	return this._createElement(rectangle);
}

Whiteboard.prototype.getUsrCoordsOfMouse = function(evt) {
	return this._board.getUsrCoordsOfMouse(evt);
}

Whiteboard.prototype._createElement = function(element) {
	element.setStroke = function(stroke) {
		this.setProperty({"strokeColor" : stroke.color, "strokeWidth" : stroke.width});
	};
	element.setFill = function(fillColor) {
		this.setProperty({"fillColor" : fillColor});
	};
	element.setFont = function(font) {
	};
	element.applyTransform = function(points) {
		this.setPositionDirectly(JXG.COORDS_BY_USER, [points.dx, points.dy]);
	};
	element.moveToFront = function() { /* remove and recreate */ }
	element.moveToBack = function() { /* ??? */ }
	
	this.children.push(element);
	return element;
}