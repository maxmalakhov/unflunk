<jsp:include page="../mobileheader.jsp"/>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
 String hostName=request.getServerName();
%>
<script type="text/javascript">
    dojo.require("dojox.mobile.View");
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

<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
    MathJax.Hub.Config({
        tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]},
        "HTML-CSS": { scale: 90 }
    });
</script>
<link rel="stylesheet" type="text/css" href="http://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css" />
<script type="text/javascript" src="/js/libs/jsxgraphsrc-0.96.js"></script>
<script type="text/javascript" src="/js/app/common/board.js"></script>

    <div id="main" dojoType="dojox.mobile.View" selected="true">
        <h1 dojoType="dojox.mobile.Heading">Draw it Live !</h1>
        <ul dojoType="dojox.mobile.RoundRectList">
            <li dojoType="dojox.mobile.ListItem" icon="/images/search.png" moveTo="drawing1">Drawing 1</li>
            <li dojoType="dojox.mobile.ListItem" icon="/images/search.png" moveTo="drawing2">Drawing 2</li>
        </ul>
    </div>

    <div id="drawing1" dojoType="dojox.mobile.View"
            data-dojo-props="onAfterTransitionIn:afterLoad">
        <h1 dojoType="dojox.mobile.Heading" back="Home" moveTo="main">
            Drawing 1
        </h1>
        <%--<div dojoType="dojox.mobile.RoundRect">--%>
                <div data-dojo-type="dojox/mobile/ContentPane"
                     data-dojo-props='href:"/room/agxtYXhzLXNhbmRib3hyEQsSCldoaXRlQm9hcmQY7yoM/worksheet/WS_1516139",onLoad:afterFocus'></div>
        <%--</div>--%>
        <%--<div data-dojo-type="dojox/mobile/TabBar" data-dojo-props='barType:"slimTab"'>--%>
            <%--<button dojoType="dojox.mobile.Button" class="handToolBtn"><img border="0" src="/images/hand-point.png"></button>--%>
            <%--<button dojoType="dojox.mobile.Button" class="penToolBtn"><img border="0" src="/images/pencil.png"></button>--%>
            <%--<button dojoType="dojox.mobile.Button" class="highlighterToolBtn"><img border="0" src="/images/highlighter.png" height="16" width="16"></button>--%>
            <%--<button dojoType="dojox.mobile.Button" class="textToolBtn"><img border="0" src="/images/text.png"></button>--%>
            <%--<button dojoType="dojox.mobile.Button" class="lineToolBtn"><img border="0" src="/images/line.png"></button>--%>
            <%--<button dojoType="dojox.mobile.Button" class="triangleToolBtn"><img border="0" src="/images/icon_triangle2.png"></button>--%>
            <%--<button dojoType="dojox.mobile.Button" class="quadrangleToolBtn"><img border="0" src="/images/icon-rectangle.png"></button>--%>
            <%--<button dojoType="dojox.mobile.Button" class="circleToolBtn"><img border="0" src="/images/icon-elipse.png"></button>--%>
            <%--<button dojoType="dojox.mobile.Button" class="equationToolBtn"><img border="0" src="/images/edit-mathematics.png"></button>--%>
            <%--<button dojoType="dojox.mobile.Button" class="graphToolBtn"><img border="0" src="/images/chart_curve.png"></button>--%>
        <%--</div>--%>
    </div>

    <div id="drawing2" dojoType="dojox.mobile.View">
        <h1 dojoType="dojox.mobile.Heading" back="Home" moveTo="main">
            Drawing 2
        </h1>
        <div dojoType="dojox.mobile.RoundRect">
            <div id="whiteboardContainer" style="border: 2px blue solid; background-color: white;"></div>
        </div>
    </div>

<script type="text/javascript">

var container1 = dojo.byId("whiteboardContainer");
container1.style.width = 700 + 'px';
container1.style.height = 400 + 'px';
container1.style.cursor="pointer";

var board1 = new Whiteboard("whiteboardContainer", {boundingbox:[0,100,100,0], axis: true});

function afterFocus() {
    console.debug("After Focus");
}

function afterLoad() {
    var container2 = dojo.query(".whiteboardContainer")[0];
//    container2.style.width = 700 + 'px';
    container2.style.height = dojo.byId("container_WS_1516139").offsetHeight + 'px';
    container2.style.cursor="pointer";

    var board2 = new Whiteboard("whiteboardContainer_WS_1516139", {boundingbox:[0,100,100,0], axis: true});
}
</script>

<jsp:include page="../mobilefooter.jsp"/>