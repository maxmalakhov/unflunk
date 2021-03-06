var getDocs = function(room) {
    dojo.request.post('/doc',{})
        .then(function(resp){
            var docWidget = room.getNode("documents");
            var worksheet = room.currentWorksheet;
            docWidget.innerHTML = resp;
            dojo.forEach(docWidget.querySelectorAll("li"), function(node) {
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
                    };
                    thumbnail.onmouseup = function(evt) {
                        document.body.removeChild(thumbnail);
                        var point = worksheet.getGfxMouse(evt);
                        worksheet.events.doAddDocument(mimeType, url, point);
                    };
                    document.body.appendChild(thumbnail);
                });
            });
        },function(err){
            console.error(err);
        });
};