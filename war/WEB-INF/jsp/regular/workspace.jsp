<jsp:include page="../basicheader.jsp"/>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
 String hostName=request.getServerName();
%>

<script src='/_ah/channel/jsapi'></script>
<script>

var userName = '${userName}';
var workspaceId = '${workspaceId}';
var roomIdList = [
    <c:forEach items="${roomList}" var="room">
    '${room}',
    </c:forEach>
];
var error = '${errorMsg}';
var workspace; // window scope

</script>

<script type="text/javascript">
    dojo.require("dijit.layout.TabContainer");
    dojo.require("dojox.layout.TableContainer");
    dojo.require("dijit.layout.ContentPane");
    dojo.require("dijit.Toolbar");
    dojo.require("dijit.form.Button");
    dojo.require("dijit.form.Textarea");
    dojo.require("dijit.form.ToggleButton");
    dojo.require("dijit.ToolbarSeparator");

    dojo.require('dijit.form.ValidationTextBox');
    dojo.require('dijit.form.Button');
    dojo.require('dijit.Dialog');
    dojo.require('dijit.layout.BorderContainer');
    dojo.require('dijit.layout.ContentPane');
    dojo.require("dojox.gfx");
    dojo.require("dojo.fx");
    dojo.require("dojox.gfx.move");
    dojo.require("dojox.gfx.utils");
    dojo.require("dojo.NodeList-fx");
    //dojo.require("dijit.ColorPalette");
    dojo.require("dojox.widget.ColorPicker");
    dojo.require("dijit.form.DropDownButton");
    dojo.require("dijit.TooltipDialog");
    dojo.require("dijit.form.RadioButton");
    dojo.require("dijit.form.Select");
    dojo.require("dijit.form.Form");
    dojo.require("dijit.form.Slider");
    dojo.require("dijit.form.TextBox");
    dojo.require("dijit.form.SimpleTextarea");
    dojo.require("dijit.form.Textarea");

</script>

<script src="/js/libs/pdf.js"></script>
<script src="/js/libs/compatibility.js"></script>

<!-- Call specific libs and styles -->
<script src="/js/azp/adapter.js"></script>
<script src="/js/workspace/call.js"></script>
<link rel="stylesheet" href="/css/call.css">
<link rel="stylesheet" href="/css/jsxgraph.css">

<%-- MathJax, http://www.mathjax.org --%>
<%--HTMLorMML TeX-AMS-MML_HTMLorMML--%>
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
    MathJax.Hub.Config({
        tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]},
        "HTML-CSS": { scale: 90 }
    });
</script>

<%-- JSXGraph, http://jsxgraph.uni-bayreuth.de --%>
<link rel="stylesheet" type="text/css" href="http://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css" />
<%--<script type="text/javascript" src="http://jsxgraph.uni-bayreuth.de/distrib/jsxgraphcore.js"></script>--%>
<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.96/jsxgraphcore.js"></script>

<script type="text/javascript" src="/js/app/common/former.js"></script>
<script type="text/javascript" src="/js/app/common/drawer.js"></script>
<script type="text/javascript" src="/js/app/common/events.js"></script>
<script type="text/javascript" src="/js/app/common/board.js"></script>

<script type="text/javascript" src="/js/app/shapes/triangle.js"></script>

<script type="text/javascript" src="/js/app/modules/graph.js"></script>
<script type="text/javascript" src="/js/app/modules/function.js"></script>
<script type="text/javascript" src="/js/app/modules/math-processor.js"></script>
<script type="text/javascript" src="/js/app/modules/recognition.js"></script>
<script type="text/javascript" src="/js/app/modules/equation.js"></script>
<script type="text/javascript" src="/js/app/modules/documents.js"></script>

<script type="text/javascript" src="/js/app/regular/worksheet.js"></script>
<script type="text/javascript" src="/js/app/regular/room.js"></script>
<script type="text/javascript" src="/js/app/regular/workspace.js"></script>

<style>

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
        <div data-dojo-type="dijit.ToolbarSeparator"></div>
        <input id="value1Box" dojoType="dijit.form.TextBox" readonly="readonly" width="300px" value="Current user: ${userName}"/>
    </div>
</div>
<div id="rooms" region="center" dojoType="dijit.layout.TabContainer">
<%--<jsp:include page="room.jsp"/>--%>
</div>

</div> <!-- TabsArea -->

<div id="imgDialog" dojoType="dijit.Dialog" title="Right-click on image to save it">
    <img id="exportedImg" name="exportedImg">
</div>

<div id="textDialog" dojoType="dijit.Dialog" title="Type in some text."  style="display: none">
    <input type="text" dojoType="dijit.form.ValidationTextBox" id="wbText" name="wbText"><br>
    <button dojoType="dijit.form.Button" id="okTextBtn">OK</button>&nbsp;&nbsp;&nbsp;<button dojoType="dijit.form.Button" id="cancelTextBtn">Cancel</button>
</div>

<div id="equationDialog" dojoType="dijit.Dialog" title="Type in some equation in LaTeX"  style="display: none;">
    <textarea id="MathInput" data-dojo-type="dijit.form.SimpleTextarea" name="wbEquation" rows="10" cols="100"
        >\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)</textarea><br>
    <div id="MathPreview" style="border:1px solid; padding: 3px; width:95%; margin-top:5px"></div>
    <div id="MathBuffer" style="border:1px solid; padding: 3px; width:95%; margin-top:5px; visibility:hidden; position:absolute; top:0; left: 0"></div>
    <button dojoType="dijit.form.Button" id="okEquationBtn">OK</button>&nbsp;&nbsp;&nbsp;<button dojoType="dijit.form.Button" id="cancelEquationBtn">Cancel</button>
</div>

<div id="graphDialog" dojoType="dijit.Dialog" title="Type in some graph relation"  style="display: none; height: 520px; width: 520px">
    <div class="dijitDialogPaneContentArea">
    <textarea id="GraphInput" data-dojo-type="dijit.form.Textarea" name="wbGraph" rows="10" cols="100" style="width:100%;"
        >y=x^2 + x - 2</textarea><br>
    <div id="GraphPreview" style="border:1px solid; padding: 3px; height: 400px; width:500px !important; margin-top:5px;"></div>
    <div id="GraphBuffer" style="border:1px solid; padding: 3px; height: 400px; width:500px !important; margin-top:5px; visibility:hidden; position:absolute;"></div>
    </div>
    <div class="dijitDialogPaneActionBar">
    <button dojoType="dijit.form.Button" id="okGraphBtn">OK</button>&nbsp;&nbsp;&nbsp;<button dojoType="dijit.form.Button" id="cancelGraphBtn">Cancel</button>
    </div>
</div>

<div id="graphBox" style="height: 520px; width: 520px;"></div>

<div id="movieDialog" dojoType="dijit.Dialog" title="Move slider to see drawing steps."  style="display: none">
    <div id="movieWhiteboardContainer" style="border: 2px blue solid; background-color: white;"></div><br>
    <div id="movieSlider" dojoType="dijit.form.HorizontalSlider" value="0"
         minimum="0" maximum="1" discreteValues="2" intermediateChanges="true"
         showButtons="false" style="width:500px;"></div><br> <button dojoType="dijit.form.Button" id="exportMovieImgBtn"><img src="/images/export-icon.png"></button>
    <div dojoType="dijit.Tooltip" connectId="exportMovieImgBtn">Export this snapshot of the drawing surface.</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    user: <span id="movieUser">user</span><br>
</div>

<jsp:include page="../footer.jsp"/>