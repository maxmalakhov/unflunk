/**
 * Created with IntelliJ IDEA.
 * User: max
 * Date: 6/25/13
 * Time: 6:20 PM
 * To change this template use File | Settings | File Templates.
 */
dojo.require("dojo.request");

// single instance only
function Workspace(id, roomIdList) {
    this.id = id;

    this.roomCount = 0;
    this.roomList = {};
    this.roomIdList = roomIdList || [];

    this.addRoom = function(room) {
        this.roomList[room.id] = room;
    };

    this.removeRoom = function(roomId) {
        var workspace = this;
        console.debug('removeRoom()');
        dojo.request.del("/workspace/"+workspace.id+"/room/"+roomId, {
            handleAs: "json",
            preventCache: true
        }).then(function(resp){
                if(resp.error){
                    console.error(resp.error);
                } else {
                    // ok
                }
            },function(ex){
                console.error(ex.message);
            });
    };

    this.newRoom = function(roomId, show) {
        var workspace = this;
        console.debug('newRoom()');
        var roomTabs = dijit.byId("viewContainer"); //rooms");
        try {
            dojo.request.post("/workspace/"+workspace.id+"/room/"+(roomId || ''), {
                handleAs: "json",
                preventCache: true
            }).then(function(resp){
                    if(resp.error){
                        console.error(resp.error);
                    } else {
                        workspace.roomCount = workspace.roomCount+1;
                        var view = new dojox.mobile.View({
                            //id: 'room_'+roomId
                        });
                        var roomTab = new dojox.mobile.ContentPane({
                            id: resp.roomId,
                            href: "/workspace/"+workspace.id+"/room/"+resp.roomId,
                            onLoad: function() {
                                var room = new Room(resp.roomId, resp.token, resp.messages, resp.worksheets);
                                if (room.token) {
                                    room.openChannel();
                                    setTimeout(function() {
                                        room.init();
                                    }, 500);
                                }
                                workspace.addRoom(room);
                                if(!roomId || show) {
                                    console.debug("Goto",'room_'+room.id);
                                    var vc = dojox.mobile.ViewController.getInstance();
                                    var main = vc.findTransitionViews('main')[0];
                                    setTimeout(function() {
                                        main.performTransition('worksheet_'+room.currentWorksheet.id);
                                    }, 1000);
                                }
                            }
                        });
                        view.addChild(roomTab);
                        roomTabs.addChild(view);
                        if(!roomId) {
                            //roomTabs.selectChild(roomTab);
                        }
                    }
                }, function(ex){
                    console.error(ex.message);
                });
        } catch(ex) {
            console.error(ex.message);
        }
    };
    this.exit = function() {
        dojo.request.post("/workspace/logout", {
            handleAs: "json",
            preventCache: true
        }).then(function(resp){
                window.location.href = "/";
            }, function(e){
                console.info("post error",e);
            });
    };
}
Workspace.prototype.init = function() {
    var workspace = this;
    var first = true;
    dojo.forEach(workspace.roomIdList, function(roomId){
        workspace.newRoom(roomId,first);
        first = false;
    });

    dojo.connect(dijit.byId('mainmenu.new'),'onClick',function() {
        workspace.newRoom();
    });

    dojo.connect(dijit.byId('mainmenu.join'),'onClick', function() {
        var roomKey= dijit.byId('joinRoomId').get('value');//prompt("Please enter room key","");
        if (roomKey !== null && roomKey !== "") {
            workspace.newRoom(roomKey, true);
        }
    });
    dojo.connect(dijit.byId('mainmenu.exit'),'onClick',function() {
        workspace.exit();
    });
    dojo.connect(dijit.byId('wbEquation'),'onkeyup',function() {
        Preview.Update();
    });
    dojo.connect(dijit.byId('wbGraph'),'onkeyup',function() {
        GraphPreview.Update();
    });

    Preview.Init();
    Preview.Update();

    GraphPreview.Init();

    dojo.subscribe("/dojox/mobile/afterTransitionIn",
        function(view, moveTo, dir, transition, context, method){
            console.debug("global afterTransitionIn", moveTo);
        });

    dojo.subscribe("/dojox/mobile/beforeTransitionIn",
        function(view, moveTo, dir, transition, context, method){
            console.debug("global beforeTransitionIn", moveTo);
        });
};

// drag and drop common method
function DNDFileController(el_) {
    var createImageJSON = function(bounds,textData){
        bounds = normalizeBounds(bounds);
        var geom = {
            xPts: [bounds.x1,bounds.x2],
            yPts: [bounds.y1,bounds.y2],
            shapeType: 'image'
        };
        geom.dataStr = textData;

        return addTimeRand(geom);
    };
    var thumbnails_ = document.getElementById('thumbnails');

    this.dragenter = function(e) {
        e.stopPropagation();
        e.preventDefault();
        el_.classList.add('rounded');
    };
    this.dragover = function(e) {
        e.stopPropagation();
        e.preventDefault();
    };
    this.dragleave = function(e) {
        e.stopPropagation();
        e.preventDefault();
        el_.classList.remove('rounded');
    };
    this.drop = function(e) {
        try{
            //console.log('dropevent',e);
            var pt = getGfxMouse(e);
            e.stopPropagation();
            e.preventDefault();
            el_.classList.remove('rounded');

            var files = e.dataTransfer.files;
            for (var i = 0, file; file = files[i]; i++) {
                var imageType = /image.*/;
                if (!file.type.match(imageType)) {
                    continue;
                }
                // FileReader
                var reader = new FileReader();

                reader.onerror = function(evt) {
                    alert('Error code: ' + evt.target.error.code);
                };
                reader.onload = (function(aFile) {
                    return function(evt) {
                        if (evt.target.readyState === FileReader.DONE) {

                            console.log('rawImg',evt.target.result.length);
                            var img = new Image();
                            img.src = evt.target.result;
                            var imgData = img.src;
                            var newH, newW;

                            img.onload = function(){
                                console.log(img.height, img.width);
                                var maxDim = 75;
                                //console.log(whiteboard);
                                if(img.height > maxDim || img.width > maxDim){
                                    //need to scale
                                    if(img.width > img.height){
                                        newW = maxDim;
                                        newH = Math.round((maxDim * img.height) / img.width);
                                    }else{
                                        newH = maxDim;
                                        newW = Math.round((maxDim * img.width) / img.height);
                                    }
                                }else{
                                    newH = img.height;
                                    newW = img.width;
                                }
                                var tempCanvas = document.createElement("canvas");
                                tempCanvas.height = newH;
                                tempCanvas.width = newW;
                                var tempContext = tempCanvas.getContext("2d");
                                tempContext.drawImage(img,0,0,newW,newH);
                                var bounds = {x1:pt.x, y1:pt.y, x2: pt.x + newW, y2: pt.y + newH};
                                var imgJSON = createImageJSON(bounds,tempCanvas.toDataURL());

                                //console.log(imgJSON);
                                // TODO:
                                //whiteboard.drawFromJSON(imgJSON,whiteboard.drawing);
                                //whiteboard.sendMessage({geometry:imgJSON});
                            };
                        }
                    };
                })(file);
                reader.readAsDataURL(file);
            }
            return false;
        }catch(dropE){
            console.error('DnD error',dropE.message);
        }
    };
    el_.addEventListener("dragenter", this.dragenter, false);
    el_.addEventListener("dragover", this.dragover, false);
    el_.addEventListener("dragleave", this.dragleave, false);
    el_.addEventListener("drop", this.drop, false);
}

dojo.addOnLoad(function() {
    console.log('onLoad');
    workspace = new Workspace(workspaceId, roomIdList);
    workspace.init();
});