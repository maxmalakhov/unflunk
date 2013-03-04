<jsp:include page="../basicheader.jsp"/>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
 String hostName=request.getServerName();
%>

<script src='/_ah/channel/jsapi'></script>
<script>
//dojo.require('workspace.BBCodeEditor');

var userName = '${userName}';
var workspaceId = '${workspaceId}';
var error = '${errorMsg}';

</script>
<%--<script src="/js/azp/WBCommon.js"></script>--%>
<script src="/js/workspace/whiteboard.js"></script>

<script type="text/javascript">
    dojo.require("dijit.layout.TabContainer");
    dojo.require("dojox.layout.TableContainer");
    dojo.require("dijit.layout.ContentPane");
    dojo.require("dijit.Toolbar");
    dojo.require("dijit.form.Button");
    dojo.require("dijit.form.Textarea");
    dojo.require("dijit.form.ToggleButton");
    dojo.require("dijit.ToolbarSeparator");
</script>

<!-- Call specific libs and styles -->
<script src="/js/azp/adapter.js"></script>
<script src="/js/workspace/call.js"></script>
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

<div id="applicationArea" style="width: 100%; height: 100%; position: absolute; top: 0; bottom: 0; padding: 0;"  dojoType="dijit.layout.BorderContainer">

<div region="top" dojoType="dijit.layout.ContentPane" style="padding:0;">
    <div id="mainmenu" data-dojo-type="dijit.Toolbar">
        <div data-dojo-type="dijit.form.Button" id="mainmenu.new"
             data-dojo-props="iconClass:'dijitIcon dijitIconTask'">New</div>
        <div data-dojo-type="dijit.form.Button" id="mainmenu.join"
             data-dojo-props="iconClass:'dijitIcon dijitIconEdit'">Join</div>
        <div data-dojo-type="dijit.form.Button" id="mainmenu.exit"
             data-dojo-props="iconClass:'dijitEditorIcon dijitEditorIconRedo'">Exit</div>
    </div>
</div>
<div id="rooms" region="center" dojoType="dijit.layout.TabContainer">
<%--<jsp:include page="room.jsp"/>--%>
</div>

</div> <!-- TabsArea -->

<jsp:include page="../footer.jsp"/>