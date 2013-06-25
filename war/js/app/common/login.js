/**
 * Created with IntelliJ IDEA.
 * User: max
 * Date: 3/3/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
dojo.require("dojo.request");

var submitUserName = function(){
    //var whiteboard = this;

    var unm = dojo.byId('submitUserNameMessage');
    var unt = dijit.byId('userNameText');
    var unt2 = dojo.byId('userNameText');
    var unb = dojo.byId('userNameBtn');
    if((unt.isValid !== undefined && !unt.isValid()) ||
        unt.get('value') === ""){
        unm.innerHTML = 'Invalid user name';
    }else{
        unb.setAttribute('disabled',true);
        unt2.setAttribute('disabled',true);
        unm.innerHTML = 'sending...';

        dojo.request.post("/workspace/login", {
            handleAs: "json",
            preventCache: true,
            data: { userName: unt.get('value') }
        }).then(function(resp){
            console.debug("post response",resp);
            if(resp.error){
                unm.innerHTML = '<b>Error: ' + resp.error + '</b><br>Please try again.';
                unb.setAttribute('disabled',false);
                unt2.setAttribute('disabled',false);
            }else{
                window.location.href = "/workspace/"+resp.workspaceId;
            }
        }, function(e){
            console.info("post error",e);
            unm.innerHTML = '<b>Error: ' + e + '</b><br>Please try again.';
            unb.setAttribute('disabled',false);
            unt2.setAttribute('disabled',false);
        });
    }
};

dojo.addOnLoad(function() {
    console.log('onLoad');

    if (userName) {
        dijit.byId("userNameText").set('value',userName);
        submitUserName();
    } else {
        dojo.connect(dijit.byId('userNameBtn'),'onClick',submitUserName);
        dojo.byId('setUserDiv').style.display = '';
        dojo.connect(dijit.byId("userNameText"), 'onKeyDown', function(evt) {
            if(evt.keyCode === dojo.keys.ENTER) {
                submitUserName();
            }
        });
    }
});