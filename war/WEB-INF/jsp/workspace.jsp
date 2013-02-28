<jsp:include page="basicheader.jsp"/>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
 String hostName=request.getServerName();
%>

<script src='/_ah/channel/jsapi'></script>
<script>
dojo.require('azp.BBCodeEditor');


var chatMessageList = [];
var geomMessageList = [];
var messageList = [];
var messageMax = 200;
var wbId = '${wbId}';
var token = '${token}';
var userName = '${userName}';
var lastMessage = '';
var userList = [];
var messageListObj = null;
<c:if test="${messageMapJSON != null}">
 messageListObj = ${messageMapJSON};
 if(messageListObj.messages && (messageListObj.messages.length > 0)){
	 messageList = messageListObj.messages;
 }
</c:if>
//dojo.require('azp.Whiteboard');

var error = '${errorMsg}';
</script>
<%--<script src="/js/azp/WBCommon.js"></script>--%>
<script src="/js/azp/whiteboard-chat.js"></script>

<!--<script src="/js/azp/BBCodeEditor.js"></script>-->

<script type="text/javascript">
    dojo.require("dijit.layout.TabContainer");
    dojo.require("dojox.layout.TableContainer");
    dojo.require("dijit.layout.ContentPane");
</script>

<!-- Call specific libs and styles -->
<script src="/js/azp/adapter.js"></script>
<script src="/js/azp/call-ext.js"></script>
<link rel="stylesheet" href="/css/call.css">

<style>
#header{
	font-size: 3em;
	text-align: center;

}

#setUserDiv{
	text-align: center;
}

._webstore_badge {
  width: 128px;
  height: 190px;
  top: 0px;
  right: 0px;
  position: absolute;
  margin: 0 50px 0 50px;
  padding: 5px;
  box-shadow: #000 0 0 5px;
  background-color: #eae88c;
  border: solid 1px #c9c778;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  display: inline;
  font-family: Arial;
  opacity: 1;
  -webkit-transition: all 0.5s ease-in-out;
}

</style>


<div id="setUserDiv" style="display: none; padding: 5px;">
	<div id="header"><h1>Collaborative Whiteboard</h1></div>
	
	<br>
	Choose any user name (no spaces or punctuation):<input id="userNameText" dojoType="dijit.form.ValidationTextBox"> <span id="userNameBtn" dojoType="dijit.form.Button">Start Drawing!</span><br>
	
	<span id="subitUserNameMessage"></span>
	<br><br>
<!--	<script src="/js/badge.js"></script>-->

</div>
<div id="imgDialog" dojoType="dijit.Dialog" title="Right-click on image to save it">
    <img id="exportedImg" name="exportedImg">
</div>


<div id="textDialog" dojoType="dijit.Dialog" title="Type in some text."  style="display: none">
    <input type="text" dojoType="dijit.form.ValidationTextBox" id="wbText" name="wbText"><br>
	<button dojoType="dijit.form.Button" id="okTextBtn">OK</button>&nbsp;&nbsp;&nbsp;<button dojoType="dijit.form.Button" id="cancelTextBtn">Cancel</button>
</div>

<div id="movieDialog" dojoType="dijit.Dialog" title="Move slider to see drawing steps."  style="display: none">
    <div id="movieWhiteboardContainer" style="border: 2px blue solid; background-color: white;"></div><br>
    <div id="movieSlider" dojoType="dijit.form.HorizontalSlider" value="0"
minimum="0" maximum="1" discreteValues="2" intermediateChanges="true"
showButtons="false" style="width:500px;"></div><br> <button dojoType="dijit.form.Button" id="exportMovieImgBtn"><img src="/images/export-icon.png"></button>
	    	<div dojoType="dijit.Tooltip" connectId="exportMovieImgBtn">Export this snapshot of the drawing surface.</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	    	user: <span id="movieUser">user</span><br>
</div>

<div id="applicationArea" style="width: 100%; height: 100%; display: none; position: absolute; top: 0; bottom: 0;"  dojoType="dijit.layout.TabContainer">

<jsp:include page="room.jsp"/>

</div> <!-- TabsArea -->

<jsp:include page="footer.jsp"/>