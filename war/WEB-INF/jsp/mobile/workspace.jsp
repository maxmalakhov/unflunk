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
<script type="text/javascript" src="/js/libs/jsxgraphsrc-0.96.js"></script>
<%--<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.96/jsxgraphcore.js"></script>--%>

<script type="text/javascript" src="/js/app/common/former.js"></script>
<script type="text/javascript" src="/js/app/common/drawer.js"></script>
<script type="text/javascript" src="/js/app/common/events.js"></script>
<script type="text/javascript" src="/js/app/common/board.js"></script>

<script type="text/javascript" src="/js/app/shapes/triangle.js"></script>

<%--<script type="text/javascript" src="/js/app/modules/graph.js"></script>--%>
<script type="text/javascript" src="/js/app/modules/function.js"></script>
<script type="text/javascript" src="/js/app/modules/math-processor.js"></script>
<script type="text/javascript" src="/js/app/modules/recognition.js"></script>
<%--<script type="text/javascript" src="/js/app/modules/equation.js"></script>--%>
<script type="text/javascript" src="/js/app/modules/documents.js"></script>

<script type="text/javascript" src="/js/app/mobile/worksheet.js"></script>
<script type="text/javascript" src="/js/app/mobile/room.js"></script>
<script type="text/javascript" src="/js/app/mobile/workspace.js"></script>

<div id="viewContainer" dojoType="dojox.mobile.Container">
    <div id="main" dojoType="dojox.mobile.View" selected="true">
        <h1 dojoType="dojox.mobile.Heading">Draw it Live !</h1>
        <ul dojoType="dojox.mobile.RoundRectList">
            <%--<ul dojoType="dojox.mobile.EdgeToEdgeList">--%>
                <li id="mainmenu.new" dojoType="dojox.mobile.ListItem" icon="/images/search.png" moveTo="facke">New Drawing</li>
                <li dojoType="dojox.mobile.ListItem" icon="/images/collection.png" moveTo="open">Open Recent</li>
                <li dojoType="dojox.mobile.ListItem" icon="/images/collection.png" moveTo="join">Join Room</li>
                <li id="mainmenu.exit" dojoType="dojox.mobile.ListItem" icon="/images/collection.png">Exit</li>
            <%--</ul>--%>
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
                <li dojoType="dojox.mobile.ListItem" icon="/images/search.png" moveTo="room_${room}">Room #${status.index+1}</li>
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
                    <span id="joinSubmitBtn" dojoType="dojox.mobile.Button">Join</span>
                </fieldset>
            </div>
        </div>
        </div>
    </div>
    
    <div id="tools" dojoType="dojox.mobile.View" style="display: none;">
        <h1 dojoType="dojox.mobile.Heading" back="Drawing" moveTo="drawing">Drawing Tools</h1>
        
        <button dojoType="dojox.mobile.Button" id="penToolBtn"><img border="0" src="/images/pencil.png"> Pencil</button>
           <button dojoType="dojox.mobile.Button" id="lineToolBtn"><img border="0" src="/images/line.png">Line</button>
           <button dojoType="dojox.mobile.Button" id="rectToolBtn"><img border="0" src="/images/rect.png">Rectangle</button>
           <button dojoType="dojox.mobile.Button" id="filledRectToolBtn"><img border="0" src="/images/filledRect.png">Filled Rectangle</button>
           <button dojoType="dojox.mobile.Button" id="ellipseToolBtn"><img border="0" src="/images/ellipse.png">Ellipse</button>
           <button dojoType="dojox.mobile.Button" id="filledEllipseToolBtn"><img border="0" src="/images/filledEllipse.png">Filled Ellipse</button>
           <button dojoType="dojox.mobile.Button" id="textToolBtn"><img border="0" src="/images/text.png">Text</button>
           <button dojoType="dojox.mobile.Button" id="moveToolBtn"><img border="0" src="/images/move.png">Move a shape</button>
           <button dojoType="dojox.mobile.Button" id="moveUpToolBtn"><img border="0" src="/images/moveUp.png">Pull a shape</button>
           <button dojoType="dojox.mobile.Button" id="moveDownToolBtn"><img border="0" src="/images/moveDown.png">Push a shape</button>
           <button dojoType="dojox.mobile.Button" id="deleteToolBtn"><img border="0" src="/images/delete.png">Delete a shape</button>
        <ul dojoType="dojox.mobile.EdgeToEdgeList">
            <li dojoType="dojox.mobile.ListItem" moveTo="drawing"  icon="/images/m_drawing.png">Drawing</li>
        </ul>
        <ul dojoType="dojox.mobile.EdgeToEdgeList">
            <li dojoType="dojox.mobile.ListItem" moveTo="main"  icon="/images/m_drawing.png">home</li>
        </ul>
    </div>
        
    <div id="chat" dojoType="dojox.mobile.View" style="display: none;">
        <h1 dojoType="dojox.mobile.Heading" back="home" moveTo="main">Chat</h1>
        ...
        <ul dojoType="dojox.mobile.EdgeToEdgeList">
            <li dojoType="dojox.mobile.ListItem" moveTo="main"  icon="/images/home.png">Home</li>
        </ul>
        <ul dojoType="dojox.mobile.EdgeToEdgeList" style="display: none;">
            <li dojoType="dojox.mobile.ListItem" moveTo="drawing"  icon="/images/home.png">Drawing</li>
        </ul>
    </div>
    
    <div id="share" dojoType="dojox.mobile.View" style="display: none;">
        <h1 dojoType="dojox.mobile.Heading" back="home" moveTo="main">Share</h1>
        
    </div>

    <div id="about" dojoType="dojox.mobile.View" style="display: none;">
        <h1 dojoType="dojox.mobile.Heading" back="home" moveTo="main">About</h1>
        
        The drawitlive.com Collaborative Whiteboard was created by Luis Montes<br><br>
        Follow Luis on twitter <a href="http://twitter.com/monteslu">@monteslu</a> for updates.
    </div>
</div>

<jsp:include page="../mobilefooter.jsp"/>