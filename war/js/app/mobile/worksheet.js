var tools = [{name: 'hand'}
            ,{name: 'line', showLineColor: true, showLineThickness: true}
            ,{name: 'pen', showLineColor: true, showLineThickness: true}
//            ,{name: 'rect', showLineColor: true, showLineThickness: true}
//            ,{name: 'ellipse', showLineColor: true, showLineThickness: true}
//            ,{name: 'filledRect', showFillColor: true, showLineColor: true, showLineThickness: true}
//            ,{name: 'filledEllipse', showFillColor: true, showLineColor: true, showLineThickness: true}
            ,{name: 'text', showLineColor: true, showFontSize: true}
//            ,{name: 'delete'}
//            ,{name: 'move'}
//            ,{name: 'moveUp'}
//            ,{name: 'moveDown'}
            ,{name: 'triangle', showLineColor: true, showLineThickness: true}
            ,{name: 'quadrangle', showLineColor: true, showLineThickness: true}
            ,{name: 'circle', showLineColor: true, showLineThickness: true}
            ,{name: 'equation', showLineColor: true}
            ,{name: 'graph', showLineColor: true, showLineThickness: true}
            ,{name: 'visionobjects', showLineColor: true, showLineThickness: true}
            ,{name: 'highlighter', showLineColor: true, showLineThickness: true}
            ,{name: 'document'}
            ];

// multiple instances
function Worksheet(id, room) {
    // parents
    this.room = room;
    this.id = id;

    // params
    this.width = 700;
    this.height = 400;
    this.container = false;
    this.board = false;
    this.tool = 'pen';

    // services
    this.former = new Former(this);
    this.drawer = new Drawer(this);
    this.events = new BoardEvents(this);
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
    }
};
Worksheet.prototype.sendMessage = function(message){
    delete message.geometry.scale;
    delete message.geometry.key;
    this.room.sendMessage(dojo.mixin(message, { worksheetId: this.id }));
};
Worksheet.prototype.getGfxMouse = function(evt){
    var worksheet = this;
    var coordsM = dojo.position(worksheet.container);
    var coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [Math.round(evt.changedTouches[0].clientX - coordsM.x), Math.round(evt.changedTouches[0].clientY - coordsM.y)], worksheet.board._board);

    console.debug("mouse",coords.usrCoords[0], coords.usrCoords[1], coords.usrCoords[2]);
//    var coords = worksheet.board.getUsrCoordsOfMouse(evt);
//    return coords ? { x : coords[0], y : coords[1] } : null;
    return coords ? { x : coords.usrCoords[1], y : coords.usrCoords[2] } : null;
};
Worksheet.prototype.initEvent = function(board) {
    var worksheet = this;
    var events = [
        { name: "touchstart", func: function(event) { worksheet.events.doGfxMouseDown(event); }  },
        { name: "touchmove", func: function(event) { worksheet.events.doGfxMouseMove(event); } },
        { name: "touchend", func: function(event) { worksheet.events.doGfxMouseUp(event); }  }
    ];
    this.board.initEvents(events);
};
Worksheet.prototype.initGfx = function(){
    var worksheet = this;

    // method body
    worksheet.container = worksheet.getNode("whiteboardContainer");
//    worksheet.container.style.width = worksheet.width + 'px';
//    console.debug("Board Height",worksheet.getNode("container").offsetHeight + 'px');
    worksheet.container.style.height = worksheet.getNode("container").offsetHeight + 'px';
    worksheet.container.style.cursor="pointer";

    // create a board board
    worksheet.container.style.height = worksheet.getNode("container").offsetHeight + 'px';
    worksheet.board = new Whiteboard("whiteboardContainer_" + worksheet.id, {boundingbox:[0,100,100,0], axis: true});
    worksheet.initEvent();

    setTimeout(function() {
        worksheet.container.style.top = '0px';
        worksheet.container.style.left = '0px';
    }, 500);

    //for playback
//TODO
//    worksheet.movieContainer = dojo.byId("movieWhiteboardContainer");
//    worksheet.movieContainer.style.width = worksheet.width + 'px';
//    worksheet.movieContainer.style.height = worksheet.height + 'px';
//    worksheet.movieDrawing = new Whiteboard("movieWhiteboardContainer");

    //draw any saved objects
    dojo.forEach(worksheet.room.messageList, function(message){
        if(message.geometry){
            message.geometry.fromUser = message.fromUser;
            if (worksheet.id === message.worksheetId) {
                try {
                    worksheet.drawer.draw(message.geometry, worksheet.board);
                } catch(ex) {
                    console.error(ex.message);
                }
            }
        }
    });

    var c = dojo.getMarginBox(worksheet.container); //dojo.coords(worksheet.container);
    console.dir(c);
    dojo.style(worksheet.container,"top", (c.t + 'px'));
    dojo.style(worksheet.container,"left", (c.l + 'px'));

    console.debug("topov",dojo.style(worksheet.container,"top"));

    if(Modernizr.draganddrop){
        console.debug('supports drag and drop!');
        //var dndc = new DNDFileController(worksheet.getNode('whiteboardOverlayContainer'));
    }
};

Worksheet.prototype.openTextDialog  = function(pt) {
    this.former.textPoint = pt;
    dijit.byId('textDialog').show();
    dijit.byId('wbText').focus();
};

Worksheet.prototype.openEquationtDialog = function(pt) {
    this.former.textPoint = pt;
    dijit.byId('equationDialog').show();
    dijit.byId('MathInput').focus();
};

Worksheet.prototype.openGraphDialog = function(pt) {
    this.former.textPoint = pt;
    dijit.byId('graphDialog').show();
    dijit.byId('GraphInput').focus();
    GraphPreview.Update();
};

Worksheet.prototype.init = function(){
    var worksheet = this;
    // private methods
    var chooseColor = function(type) {
        var cp = worksheet.getDialogWidget(type + 'ColorPaletteWidget');
        //console.debug(cp);
        dojo.style(worksheet.getNode(type + 'Swatch'),{backgroundColor: cp.value});
        if (worksheet.tool === 'highlighter') {
            worksheet.former.stroke.highlighterColor = cp.value;
        } else {
            worksheet.former.stroke[type + 'Color'] = cp.value;
        }
        dijit.popup.close(worksheet.getDialogWidget(type + "ColorPaletteDialog"));
    };
    var cancelChooseColor = function(type) {
        dijit.popup.close(worksheet.getDialogWidget(type + "ColorPaletteDialog"));
    };
    var exportImage = function(){
        try{                                      //dojo.query('canvas',worksheet.getNode('movieDialog'))[0].toDataURL();
            dojo.byId("exportedImg").src = dojo.query('canvas',dojo.byId(worksheet.id))[0].toDataURL();
            dijit.byId("imgDialog").show();
        }catch(ex){
            console.error(ex.message);
        }
    };
    var exportMovieImage = function(){
        try{
            dojo.byId("exportedImg").src = dojo.query('canvas',dojo.byId('movieDialog'))[0].toDataURL();
            dijit.byId("imgDialog").show();
        }catch(ex){
            console.error(ex.message);
        }
    };
    var hide = function(id){
        try{
            worksheet.getNode(id).style.display = 'none';
        }catch(ex) {
            console.error(ex.message);
        }
    };
    var show = function(id){
        try{
            worksheet.getNode(id).style.display = '';
        }catch(ex) {
            console.error(ex.message);
        }
    };
    var selectTool = function(toolName) {
        if(worksheet.container) {
            if (toolName === 'hand') {
                worksheet.board.drawMode = false;
                worksheet.container.style.cursor="pointer";
            } else {
                worksheet.board.drawMode = true;
                worksheet.container.style.cursor="crosshair";
            }
            if (toolName === 'highlighter') {
//                worksheet.getWidget('lineStrokeSelect').set('value',worksheet.former.stroke.highlighterWidth);
//                worksheet.getDialogWidget('lineColorPaletteWidget').set('value',worksheet.former.stroke.highlighterColor);
//                dojo.style(worksheet.getNode('lineSwatch'),{backgroundColor: worksheet.former.stroke.highlighterColor});
            } else {
//                worksheet.getWidget('lineStrokeSelect').set('value',worksheet.former.stroke.lineWidth);
//                worksheet.getDialogWidget('lineColorPaletteWidget').set('value',worksheet.former.stroke.lineColor);
//                dojo.style(worksheet.getNode('lineSwatch'),{backgroundColor: worksheet.former.stroke.lineColor});
            }
        }
//TODO
//        hide("lineColorDisplay");
//        hide("fillColorDisplay");
//        hide("lineStrokeSelect");
//        hide("fontSizeSelect");

        var tool = null;
        dojo.forEach(tools,function(aTool){
            if(aTool.name === toolName){
                tool = aTool;
            }
            //dojo.style(this.byClass(aTool.name + 'ToolBtn').domNode,'border','0px');
            //dojo.addClass(dojo.style(this.byClass(aTool.name + 'ToolBtn').domNode, "selected");

//TODO
//            dojo.removeClass(worksheet.getNode(aTool.name + 'ToolBtn'), "selected");
//            dojo.style(dojo.query("span",worksheet.getNode(aTool.name + 'ToolBtn'))[0],"background-color","");
            dojo.query(worksheet.getNode(aTool.name + 'ToolBtn')).addClass("whiteBtn");
            dojo.query(worksheet.getNode(aTool.name + 'ToolBtn')).removeClass("orangeBtn");
        });


        //dojo.style(this.byClass(tool.name + 'ToolBtn').domNode,'border','2px solid black');

//TODO
//        dojo.addClass(worksheet.getNode(tool.name + 'ToolBtn'), "selected");
//        dojo.style(dojo.query("span",worksheet.getNode(tool.name + 'ToolBtn'))[0],"background-color","rgb(226, 94, 152)");
        dojo.query(worksheet.getNode(tool.name + 'ToolBtn')).removeClass("whiteBtn");
        dojo.query(worksheet.getNode(tool.name + 'ToolBtn')).addClass("orangeBtn");
        worksheet.tool = tool.name;

//TODO
//        if(tool.showLineColor){
//            show("lineColorDisplay");
//        }
//        if(tool.showFillColor){
//            show("fillColorDisplay");
//        }
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
            mSlider.setAttribute('maximum', worksheet.room.geomMessageList.length);
            mSlider.setAttribute('discreteValues', worksheet.room.geomMessageList.length);

            mSlider.set('value',0);
        }catch(ex){
            console.error(ex.message);
        }
    };
    var incrementMovie = function(){
        var indexEnd = Math.round(dijit.byId('movieSlider').get('value'));
        worksheet.movieDrawing.clear();
        for(var i =0; i < indexEnd; i++){
            worksheet.drawer.draw(worksheet.room.geomMessageList[i].geometry, worksheet.movieDrawing);
        }
        if(indexEnd > 0){
            dojo.byId('movieUser').innerHTML = worksheet.room.geomMessageList[indexEnd - 1].fromUser;
        }
    };
    var doAddText = function(){
        var text = dijit.byId('wbText').get('value');
        if(worksheet.events.doAddText(text)){
            dijit.byId('textDialog').hide();
        }
    };
    var doIncrementalText = function(){
        var text = dijit.byId('wbText').get('value');
        worksheet.events.doIncrementalText(text);
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
    
    dojo.connect(worksheet.getWidget('lineStrokeSelect'),'onChange',function(){
        if (worksheet.tool === 'highlighter') {
            worksheet.former.stroke.highlighterWidth = Math.floor(1.0 * worksheet.getWidget('lineStrokeSelect').get('value'));
        } else {
            worksheet.former.stroke.lineWidth = Math.floor(1.0 * worksheet.getWidget('lineStrokeSelect').get('value'));
        }
    });
    dojo.connect(worksheet.getNode('fontSizeSelect'),'onChange',function(){
        worksheet.former.stroke.fontSize = Math.floor(1.0 * worksheet.getWidget('fontSizeSelect').get('value'));
    });
    dojo.connect(worksheet.getDialogWidget('clearDrawingNoBtn'),'onClick',function(){
        dijit.popup.close(worksheet.getWidget("clearDrawingDialog"));
    });
    dojo.connect(worksheet.getDialogWidget('clearDrawingYesBtn'),'onClick',function(){
        worksheet.events.doClearBoard();
        dijit.popup.close(worksheet.getDialogWidget("clearDrawingDialog"));
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
        dijit.byId('wbText').set('value','');
        dijit.byId('textDialog').hide();
        worksheet.events.resetTextPoint();
    });
    dojo.connect(worksheet.getWidget("wbText"), 'onKeyUp', function(evt) {
        doIncrementalText();
    });
    dojo.connect(worksheet.getWidget("wbText"), 'onChange', function(evt) {
        doIncrementalText();
    });
    dojo.connect(worksheet.getWidget("textDialog"), 'onClose', function(evt) {
        worksheet.getWidget("wbText").set('value','');
    });
    dojo.connect(worksheet.getWidget("textDialog"), 'onHide', function(evt) {
        worksheet.getWidget("wbText").set('value','');
    });
    dojo.connect(dijit.byId("okTextBtn"), 'onClick', function(evt) {
        doAddText();
    });
    dojo.connect(dijit.byId("okEquationBtn"), 'onClick', function(evt) {
        var data = document.getElementById("MathInput").value;
        if(worksheet.events.doEquationInput(data)){
            dijit.byId('equationDialog').hide();
        }
    });
    dojo.connect(dijit.byId("cancelEquationBtn"), 'onClick', function(evt) {
        //dijit.byId('MathInput').set('value','');
        dijit.byId('equationDialog').hide();
        worksheet.events.resetTextPoint();
    });
    dojo.connect(dijit.byId("okGraphBtn"), 'onClick', function(evt) {
        var data = document.getElementById("GraphInput").value;
        if(worksheet.events.doGraphInput(data)){
            dijit.byId('graphDialog').hide();
        }
    });
    dojo.connect(dijit.byId("cancelGraphBtn"), 'onClick', function(evt) {
        dijit.byId('graphDialog').hide();
        worksheet.events.resetTextPoint();
    });

    dojo.connect(dijit.byId("clearToolBtn_"+worksheet.id), 'onClick', function(evt) {
        dijit.byId("clearDrawingDialog").show();
    });
    dojo.connect(dijit.byId("cancelClearBtn"), 'onClick', function(evt) {
        dijit.byId('clearDrawingDialog').hide();
    });
    dojo.connect(dijit.byId("okClearBtn"), 'onClick', function(evt) {
        worksheet.events.doClearBoard();
        dijit.byId('clearDrawingDialog').hide();
    });


    try{
        var reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('img').src = e.target.result;
        };

        function onDrop(e) {
            reader.readAsDataURL(e.dataTransfer.files[0]);
        };
    }catch(ex){
        console.error(ex.message);
    }
};