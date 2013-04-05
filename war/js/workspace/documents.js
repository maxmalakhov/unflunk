dojo.addOnLoad(function() {
	dojo.xhrPost({
       url: '/doc',
       load: function(resp){
        	dojo.byId("documents").innerHTML = resp;
        	dojo.query("#documents li").forEach(function(node) {
        		dojo.connect(node, "mousedown", function(evt) {
	        		var x = evt.clientX;
	        		var y = evt.clientY;
	        		var thumbnail = document.createElement("DIV");
	        		thumbnail.style.opacity = ".2";
	        		thumbnail.style.position = "absolute";
	        		thumbnail.style.left = (x-10) + "px";
	        		thumbnail.style.top = (y-10) + "px";
	        		thumbnail.style.width = "100px";
	        		thumbnail.style.height = "100px";
	        		thumbnail.style.zIndex = 100;
	        		thumbnail.style.borderColor = "#000";
	        		thumbnail.style.borderWidth = "1px";
	        		thumbnail.style.borderStyle = "solid";
	        		
	        		
	        		var mimeType = this.getAttribute("data-mime-type");
	        		var url = this.getAttribute("data-url") + "&mimeType=" + mimeType;
	        		
	        		var thumbnailImage = document.createElement("IMG");
	        		thumbnailImage.src = url + "&thumbnail=true";
	        		thumbnailImage.width = 100;
	        		thumbnailImage.height = 100;
	        		thumbnail.appendChild(thumbnailImage);
	
					thumbnail.onmousemove = function(evt) {
						evt.preventDefault();
						thumbnail.style.left = (evt.clientX-10) + "px";
						thumbnail.style.top = (evt.clientY-10) + "px";
						return false;
					}
					thumbnail.onmouseup = function(evt) {
						document.body.removeChild(thumbnail);
						var coords = whiteboard.drawing.getUsrCoordsOfMouse(evt);
						if ( mimeType == "application/pdf" ) {
							geom = createPdfJSON(coords[0], coords[1], url);
						} else if ( mimeType == "video/mp4") {
							geom = createVideoJSON(coords[0], coords[1], url);
						} else {
							geom = createImageJSON({x1 : coords[0], y1 : coords[1], x2 : coords[0] + 30, y2 : coords[1] - 30}, url);
						}
						drawFromJSON(geom, whiteboard.drawing);			
						whiteboard.sendMessage({geometry:geom});
					}
					document.body.appendChild(thumbnail);
        		});
        	});
       },
       error: function(e){
    	   console.log("an error occurred: " + e);
       },
       preventCache: true
    });
});