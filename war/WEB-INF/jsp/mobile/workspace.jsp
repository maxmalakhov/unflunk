<jsp:include page="../mobileheader.jsp"/>
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
    dojo.require("dojox.mobile.View");
    dojo.require("dojox.mobile.ScrollableView");
    dojo.require("dojox.mobile.Heading");
    dojo.require("dojox.mobile.RoundRect");
    dojo.require("dojox.mobile.RoundRectList");
    dojo.require("dojox.mobile.EdgeToEdgeList");
    dojo.require("dojox.mobile.ListItem");
    dojo.require("dojox.mobile.Button");
    dojo.require("dojox.mobile.TextBox");
    dojo.require("dojox.mobile.FormLayout");
    dojo.require("dojox.mobile.RadioButton");
    dojo.require("dojox.mobile.ToolBarButton");
    dojo.require("dojox.mobile.ContentPane");
    dojo.require("dojox.mobile.ViewController");
    dojo.require("dojox.mobile.ComboBox");
    dojo.require("dijit.form.DataList");
    dojo.require("dojox.mobile.TabBar");
    dojo.require("dojox.mobile.TabBarButton");
    dojo.require("dojox.mobile.SimpleDialog");
    dojo.require("dojox.mobile.ExpandingTextArea");
    dojo.require("dojox.mobile.TextArea");

</script>

<script src="/js/libs/pdf.js"></script>
<script src="/js/libs/compatibility.js"></script>

<!-- Call specific libs and styles -->
<script src="/js/azp/adapter.js"></script>
<script src="/js/workspace/call.js"></script>
<link rel="stylesheet" href="/css/mobile.css">
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
<script type="text/javascript" src="/js/libs/jsxgraphsrc-0.96.js"></script>
<%--<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.96/jsxgraphcore.js"></script>--%>

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

<script type="text/javascript" src="/js/app/mobile/worksheet.js"></script>
<script type="text/javascript" src="/js/app/mobile/room.js"></script>
<script type="text/javascript" src="/js/app/mobile/workspace.js"></script>

<div id="viewContainer" dojoType="dojox.mobile.Container">
    <div id="main" dojoType="dojox.mobile.View" selected="true">
        <h1 dojoType="dojox.mobile.Heading">Draw it Live !</h1>
        <ul dojoType="dojox.mobile.RoundRectList">
            <li id="mainmenu.new" dojoType="dojox.mobile.ListItem" icon="/images/mobile/spinner2.png" moveTo="facke">New Drawing</li>
            <li dojoType="dojox.mobile.ListItem" icon="/images/mobile/spinner.png" moveTo="open">Open Recent</li>
            <li dojoType="dojox.mobile.ListItem" icon="/images/mobile/target2.png" moveTo="join">Join Room</li>
            <li id="mainmenu.exit" dojoType="dojox.mobile.ListItem" icon="/images/mobile/switch2.png">Exit</li>
        </ul>
    </div>


    <div id="new" dojoType="dojox.mobile.View" style="display: none;">
        <h1 dojoType="dojox.mobile.Heading" back="Home" moveTo="main">
            <span data-dojo-type="dojox/mobile/ToolBarButton"data-dojo-props='arrow:"left",moveTo:"main",transition:"slide"'>Home</span>
        </h1>
        <div style="overflow: auto;">
            <div id="whiteboardContainer" style="border: 2px blue solid; background-color: white;"></div>
        </div>

        <div>
            <span id="toolDrawBtn" dojoType="dojox.mobile.Button" style="text-align: left"><span><img id="toolDrawImg" src="/images/pencil.png"></span> Tool</span>
            <span id="chatDrawBtn" dojoType="dojox.mobile.Button"  style="text-align: right">chat <span>i</span></span>
        </div>
    </div>

    <div id="open" dojoType="dojox.mobile.ScrollableView" style="display: none;">
        <h1 dojoType="dojox.mobile.Heading" back="Home" moveTo="main">Recent Rooms</h1>
        <ul dojoType="dojox.mobile.RoundRectList">
            <c:forEach items="${roomList}" var="room" varStatus="status">
                <li dojoType="dojox.mobile.ListItem" icon="/images/mobile/room.png" moveTo="room_${room}">Room #${status.index+1}</li>
            </c:forEach>
        </ul>
    </div>

    <%--<div id="rooms" dojoType="dojox.mobile.Container" style="display: none;"></div>--%>

<%--<c:forEach items="${roomList}" var="room" varStatus="status">--%>
    <%--&lt;%&ndash;<li dojoType="dojox.mobile.ListItem" icon="/images/search.png" moveTo="main">Room #${status.index+1}</li>&ndash;%&gt;--%>
    <%--<div id="room${status.index+1}" dojoType="dojox.mobile.View" style="display: none;">--%>
        <%--<h1 dojoType="dojox.mobile.Heading" back="Home" moveTo="main">--%>
            <%--<span data-dojo-type="dojox/mobile/ToolBarButton"data-dojo-props='arrow:"left",moveTo:"main",transition:"slide"'>Home</span>--%>
        <%--</h1>--%>
        <%--<div style="overflow: auto;">--%>
            <%--<div class="whiteboardContainer" style="border: 2px blue solid; background-color: white;"></div>--%>
        <%--</div>--%>
    <%--</div>--%>
<%--</c:forEach>--%>

    <div id="join" dojoType="dojox.mobile.View" style="display: none;">
        <h1 dojoType="dojox.mobile.Heading" back="Home" moveTo="main">Join Room</h1>
        <div dojoType="dojox.mobile.RoundRect">
        <div dojoType="dojox.mobile.FormLayout">
            <div>
                <label>Room Id</label>
                <fieldset>
                    <input id="joinRoomId" dojoType="dojox.mobile.TextBox">
                    <span id="mainmenu.join" id="joinSubmitBtn" dojoType="dojox.mobile.Button">Join</span>
                </fieldset>
            </div>
        </div>
        </div>
    </div>

    <div id="share" dojoType="dojox.mobile.View" style="display: none;">
        <h1 dojoType="dojox.mobile.Heading" back="home" moveTo="main">Share</h1>
    </div>

</div>  <%-- View Container --%>


<div id="textDialog" dojoType="dojox.mobile.SimpleDialog" style="display: none">
    <div class="mblSimpleDialogTitle">Add Text</div>
    <div class="mblSimpleDialogText">Type in some text.</div>
    <input type="text" dojoType="dojox.mobile.TextBox" id="wbText" name="wbText"/>
    <br><br>
    <button dojoType="dojox.mobile.Button" id="okTextBtn">OK</button>&nbsp;&nbsp;&nbsp;<button dojoType="dojox.mobile.Button" id="cancelTextBtn">Cancel</button>
</div>

<div id="equationDialog" dojoType="dojox.mobile.SimpleDialog" style="display: none; width:50%;">
    <div class="mblSimpleDialogTitle">Add Equation</div>
    <div class="mblSimpleDialogText">Type in some equation in LaTeX.</div>
    <textarea id="MathInput" data-dojo-type="dojox.mobile.TextArea" name="wbEquation" rows="10" cols="70"
        >\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)</textarea><br>
     <div id="MathPreview" dojoType="dojox.mobile.RoundRect" ></div>
    <div id="MathBuffer" dojoType="dojox.mobile.RoundRect" style="color: black; visibility:hidden; position:absolute;"></div>
    <button dojoType="dojox.mobile.Button" id="okEquationBtn">OK</button>&nbsp;&nbsp;&nbsp;<button dojoType="dojox.mobile.Button" id="cancelEquationBtn">Cancel</button>
</div>

<div id="graphBox" style="height: 520px; width: 520px;"></div>
<div id="graphDialog" dojoType="dojox.mobile.SimpleDialog" style="display: none; width:50%;">
    <div class="mblSimpleDialogTitle">Add Graph</div>
    <div class="mblSimpleDialogText">Type in some graph relation.</div>
    <div class="dijitDialogPaneContentArea">
        <input id="GraphInput" type="text" data-dojo-type="dojox.mobile.TextBox" name="wbGraph" value="x^2 + x - 2"/><br>
        <div id="GraphPreview" dojoType="dojox.mobile.RoundRect" style="border:1px solid; padding: 3px; height: 300px; width:400px !important; margin-top:5px;"></div>
        <div id="GraphBuffer" dojoType="dojox.mobile.RoundRect" style="border:1px solid; padding: 3px; height: 300px; width:400px !important; margin-top:5px; visibility:hidden; position:absolute;"></div>
    </div>
    <div class="dijitDialogPaneActionBar">
        <button dojoType="dojox.mobile.Button" id="okGraphBtn">OK</button>&nbsp;&nbsp;&nbsp;<button dojoType="dojox.mobile.Button" id="cancelGraphBtn">Cancel</button>
    </div>
</div>

<div id="clearDrawingDialog" dojoType="dojox.mobile.SimpleDialog" style="display: none">
    <div class="mblSimpleDialogTitle">Clear Drawing</div>
    <div class="mblSimpleDialogText">Are you sure you want to clear the board?</div>
    <button id="okClearBtn" dojoType="dojox.mobile.Button">Yes</button> &nbsp;&nbsp;&nbsp;<button id="cancelClearBtn" dojoType="dojox.mobile.Button">No</button>
</div>
</div>

<jsp:include page="../mobilefooter.jsp"/>