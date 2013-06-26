// multiple instances
function Room(id, token, messages, worksheets) {
    this.id = id;
    this.token = token;

    this.worksheetIdList = worksheets;
    this.worksheetList = {};
    this.currentWorksheet = false;
    this.chatMessageList = [];
    this.geomMessageList = [];
    this.messageList = messages;
    this.messageMax = 200;
    this.lastMessage = '';
    this.userList = [];
    this.messageListObj = null;
    this.pingInterval = 180000;
    this.userCheckInterval = 600000;

    this.addWorksheet = function(worksheet) {
        this.worksheetList[worksheet.id] = worksheet;
    };

    this.newWorksheet = function(worksheetId, show) {
        var room = this;
        console.debug("newWorksheet() "+"/room/"+room.id+"/worksheet/"+worksheetId);
        var worksheetTabs = room.getWidget('worksheets');
        var view = new dojox.mobile.View({
            id: 'worksheet_'+worksheetId,
            onAfterTransitionIn: function(evt) {
                console.debug("Focus1");
            },
            onAfterTransitionOut: function(evt) {
                console.debug("Focu2s");
            }
        });
        var heading = new dojox.mobile.Heading({
            back: 'Worksheets',
            moveTo: 'room_'+room.id,
            label: 'Worksheet #'+worksheetId
        });
        view.addChild(heading);
        var worksheetTab = new dojox.mobile.ContentPane({
            id: worksheetId,
            title: worksheetId,
            href: "/room/"+room.id+"/worksheet/"+worksheetId,
            onLoad: function() {
                var worksheet = new Worksheet(worksheetId, room);
                worksheet.init();
                worksheet.initGfx();
                room.addWorksheet(worksheet);
                if(Object.keys(room.worksheetList).length === 1 || show) {
                    room.currentWorksheet = worksheet;
                }
                view.startup();
            }
        });
        view.addChild(worksheetTab);
        worksheetTabs.addChild(view);
        if(show) {
            //worksheetTabs.selectChild(worksheetTab);
        }
    };
}
// --------------- Entity methods -------------------
Room.prototype = {
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
Room.prototype.init = function(){
    var room = this;
    // private methods
    var sendEmail = function() {
        console.debug('sendEmail()');
        dojo.request.post('/wbmail', {
            handleAs: "json",
            preventCache: true,
            data: {
                wbId: room.id,
                email: room.getWidget("email").getValue()
            }
        }).then(function(resp){
            if(resp.error) {
                console.debug("error on email server", resp.error);
            }
        }, function(ex){
            console.error(ex);
        });
    };
    var createWorksheet = function() {
        console.debug('newWorksheet()');
        dojo.request.post("/room/"+room.id+"/worksheet/new", {
            handleAs: "json",
            preventCache: true
        }).then(function(resp){
            if(resp.error) {
                console.debug("error on new worksheet",resp.error);
            }
            room.newWorksheet(resp.worksheetId, true);
        }, function(ex) {
            console.error(ex);
        });
    };
    var call = function(){
        try{
            var call = new Call(room.id);
            call.new();
        }catch(ex) {
            console.error(ex.message);
        }
    };
    // method body
    dojo.connect(room.getWidget('callBtn'),'onClick',function(){
        call();
    });
    dojo.connect(room.getWidget('sendMailButton'),'onClick',sendEmail);

    dojo.connect(room.getWidget('newWorksheetButton'),'onClick', createWorksheet);

    if(room.worksheetIdList.length > 0) {
        dojo.forEach(room.worksheetIdList, function(worksheetId) {
            room.newWorksheet(worksheetId, false);
        });
    } else {
        createWorksheet();
    }

    dojo.connect(dijit.byId(room.id),'onClose', function() {
        workspace.removeRoom(room.id);
    });

    getDocs(room);
};
Room.prototype.drawOnWorksheet = function(worksheetId, geom) {
    if(this.worksheetList[worksheetId]) {
        this.worksheetList[worksheetId].drawer.draw(geom, this.worksheetList[worksheetId].drawing);
    } else {
        this.newWorksheet(worksheetId);
    }
};
Room.prototype.sendMessage = function(message){
    var room = this;
    var clearChatUI = function(){
        try{
            //room.getNode('chatText').setAttribute('disabled',false);
//            room.getWidget('chatText').set('value','');
            //room.getNode('chatBtn').setAttribute('disabled',false);
//            room.getNode('chatWaitMessage').innerHTML = '';
        }catch(ex){
            console.error(ex.message);
        }
    };
    dojo.request.post("/room/"+room.id+"/message",{
        data: dojo.toJson(message),
        headers: { "Content-Type": "application/json"},
        handleAs: "json",
        preventCache: true
    }).then(function(resp){
        console.debug("post response",resp);
        if(resp.message){
            room.messageList.push(resp.message);
        }
        clearChatUI();
    }, function(ex){
        clearChatUI();
        console.error(ex);
    });
};
Room.prototype.pingServer = function() {
    console.debug('pingServer()');
    var room = this;
    dojo.request.get("/room/"+room.id+"/ping", {
        handleAs: "json",
        preventCache: true
    }).then(function(resp){
        if(resp.error) {
            console.debug("error pinging server",resp.error);
        }
        setTimeout(function(){
            room.pingServer();
        }, room.pingInterval);
   }, function(ex){
        console.error(ex);
        setTimeout(room.pingServer, room.pingInterval);
   });
};
Room.prototype.getUserList = function() {
    console.debug('getUserList()');
    var room = this;
    dojo.request.get("/room/"+room.id+"/users", {
        handleAs: "json",
        preventCache: true
    }).then(function(resp){
        if(resp.error) {
            console.debug("error getting users",resp.error);
        }
        room.populateUserList(resp.userList);
        setTimeout(function() {
            room.getUserList();
        },room.userCheckInterval);
   },function(ex){
        console.error(ex);
        setTimeout(function() {
            room.getUserList();
        },room.userCheckInterval);
   });
};
Room.prototype.populateUserList = function(userList){
    try{
        var output = '';
        dojo.forEach(userList,function(user){
            output += ('<span class=\"userListItem' + user + '\" style=\"background-color: #FFFFFF;\">' + user + '</span>');
            output += ('<br>');
        });
        //TODO this.getNode("userListDiv").innerHTML = output;
    }catch(ex){
        console.error(ex.message);
    }
};
Room.prototype.openChannel = function() {
    var room = this;
    // private methods
    var onOpened = function() {
        //whiteboard.sendMessage({chatMessage:'I\'m here!'});
        dojo.connect(room.getWidget('chatBtn'),'onClick',sendChatMessage);

        //display any saved messages
        dojo.forEach(room.messageList,function(message){
            if(message.chatMessage){
                printChatMessage(message);
            }
        });
        room.pingServer();
        room.getUserList();
    };
    var onMessage = function(message) {
        console.debug("onMessage", message);

        var obj = dojo.fromJson(message.data);
        console.debug(obj);
        if(obj.chatMessage){
            printChatMessage(obj);
        }
        if(obj.geometry && obj.geometry.shapeType){
            obj.geometry.fromUser = obj.fromUser;
            if(obj.fromUser !== userName){
                room.drawOnWorksheet(obj.worksheetId, obj.geometry);
            }
        }
        if(obj.chatMessage || obj.geometry) {
            room.messageList.push(obj);
        }
        if(obj.userList && (obj.userList.length > 0)){
            room.populateUserList(obj.userList);
        }
        if(obj.fromUser){
            //animateUserItem(obj.fromUser);
        }
    };
    var printChatMessage = function(message){
        room.chatMessageList.push('<pre class=\"chatMessage\"><span class=\"chatFrom\">' + message.fromUser + '</span>: ' + message.chatMessage + '</pre>');
        if(room.chatMessageList.length > room.messageMax){
            room.chatMessageList.shift();
        }
        var messageListStr = '';
        for(var i=0; i < room.chatMessageList.length; i++){
            var text = room.chatMessageList[i].split('###')[0];

            messageListStr += text;

            var roomKey = room.chatMessageList[i].split('###')[1];
            // little hack if roomKey exists
            if(roomKey) {
                messageListStr += '</pre><br>';
            }
            // set answer action
            var sender = text.match('<span.*>(.*)</span>')[1];
            var answerBtn = room.getNode('answerBtn'+userName);
            if(roomKey && answerBtn) {
                if (sender.toLowerCase() !== userName.toLowerCase()) {
                    answerBtn.setAttribute('style','color: red;');
                    answerBtn.setAttribute('onclick','answer("'+roomKey.replace('</pre><br>', '')+'")');
                } else {
                    // TODO: mark red color user call button
                }
            }
            console.debug('from: '+sender+', to: '+userName);
            console.debug('text: '+text+', roomKey: '+roomKey);
        }
        var outputWidget = room.getNode('output');
        outputWidget.innerHTML= messageListStr;
        outputWidget.scrollTop = outputWidget.scrollHeight;
    };
    var  sendChatMessage = function(){
        var cwm = room.getNode('chatWaitMessage');
        var ct = room.getWidget('chatText');
        var cb = room.getNode('chatBtn');
        var msg = dojo.trim('' + ct.getValue());
        if(msg === '')
        {
            cwm.innerHTML = 'Cat got your tongue?';
        }else if(msg === room.lastMessage){
            cwm.innerHTML = 'That\'s what you said last time.';
        }else{
            //ct.setAttribute('disabled',true);
            //cb.setAttribute('disabled',true);
            room.lastMessage = msg;
            room.getNode('chatWaitMessage').innerHTML = 'sending...';
            room.sendMessage({chatMessage:msg});
        }
    };
    var animateUserItem = function(user){
        try{
            var userNode = this.getNode("userListItem" + user);
            if(userNode){
                dojo.animateProperty({
                    node: userNode,
                    duration: 750,
                    properties: {
                        backgroundColor: {
                            start: "red",
                            end: "white"
                        },
                        color: {
                            start: "white",
                            end: "black"
                        }
                    }
                }).play();
            }
        }catch(ex) {
            console.error(ex.message);
        }
    };
    // method body
    var channel = new goog.appengine.Channel(room.token);
    var handler = {
        'onopen': onOpened,
        'onmessage': onMessage,
        'onerror': function(e) {
            console.debug("channel error",e);
        },
        'onclose': function(c) {
            console.debug("channel close",c);
        }
    };
    var socket = channel.open(handler);
    console.debug(socket);
    socket.onopen = onOpened;
    socket.onmessage = onMessage;
};