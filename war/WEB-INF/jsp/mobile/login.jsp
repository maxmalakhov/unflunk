<jsp:include page="../mobileheader.jsp"/>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
 String hostName=request.getServerName();
%>

<script type="text/javascript">
    var userName = '${userName}';

    dojo.require("dojox.mobile.View");
    dojo.require("dojox.mobile.Heading");
    dojo.require("dojox.mobile.Button");
    dojo.require("dojox.mobile.TextBox");
</script>

<script src="/js/app/common/login.js"></script>

<style>
#header{
    text-align: center;
}
#setUserDiv{
    text-align: center;
}
</style>

    <div id="main" dojoType="dojox.mobile.View" selected="true">
        <h1 dojoType="dojox.mobile.Heading">
            Draw it Live !
        </h1>
        <div id="setUserDiv" style="padding: 5px;">
            <div id="header"><h1>Collaborative Whiteboard</h1></div>
            
            <br>
            Choose any user name (no spaces or punctuation):
            <input id="userNameText" type="text" dojoType="dojox.mobile.TextBox"> <span id="userNameBtn" dojoType="dojox.mobile.Button">Start Drawing!</span><br>

            <span id="submitUserNameMessage"></span>
            <br><br>

        </div>
    </div>

<jsp:include page="../mobilefooter.jsp"/>