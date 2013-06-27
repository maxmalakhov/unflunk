<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div id="room_${roomId}" dojoType="dojox.mobile.ScrollableView"  style="display: none;">
    <h1 dojoType="dojox.mobile.Heading" back="Rooms" moveTo="open">Recent Worksheet</h1>
    <ul dojoType="dojox.mobile.RoundRectList">
        <c:forEach items="${worksheetList}" var="worksheet" varStatus="status">
            <li dojoType="dojox.mobile.ListItem" icon="/images/search.png" moveTo="worksheet_${worksheet}">Worksheet #${worksheet}</li>
        </c:forEach>
    </ul>
</div>

<%--<div class="worksheets" dojoType="dojox.mobile.Container"></div>--%>
