<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div id="room_${roomId}" dojoType="dojox.mobile.ScrollableView"  style="display: none;">
    <h1 dojoType="dojox.mobile.Heading" back="Rooms" moveTo="open">Recent Worksheet
        <span dojoType="dojox.mobile.ToolBarButton" data-dojo-props='moveTo:"chat_${roomId}"'>Chat</span>
    </h1>
    <ul dojoType="dojox.mobile.RoundRectList">
        <c:forEach items="${worksheetList}" var="worksheet" varStatus="status">
            <li dojoType="dojox.mobile.ListItem" icon="/images/mobile/worksheet.png" moveTo="worksheet_${worksheet}">Worksheet #${worksheet}</li>
        </c:forEach>
    </ul>
</div>

<div id="chat_${roomId}" dojoType="dojox.mobile.ScrollableView"  style="display: none;">
    <h1 dojoType="dojox.mobile.Heading" moveTo="room_${roomId}" back="Worksheets">Room Chat</h1>

    <div class="output" style="overflow: auto; width: 37em;  padding:0;" region="center" dojoType="dojox.mobile.RoundRect" >
    </div>
    <%--<div style="width: 37em; border: 1px solid #888888; padding:0;" region="bottom" dojoType="dijit.layout.ContentPane" >--%>
        <table border="0" cellspacing="5">
            <tr><td>
                <%--<textarea dojoType="workspace.BBCodeEditor" cols="40" rows="3" class="chatText"></textarea>--%>

                <div><span>
                            <button dojoType="dojox.mobile.Button" showLabel="false" dojoAttachEvent="onClick: bClick"><img border="0" src="/images/mobile/bold.png"></button>
                            <button dojoType="dojox.mobile.Button" showLabel="false" dojoAttachEvent="onClick: iClick"><img border="0" src="/images/mobile/italic.png"></button>
                            <button dojoType="dojox.mobile.Button" showLabel="false" dojoAttachEvent="onClick: uClick"><img border="0" src="/images/mobile/underline.png"></button>
                            <button dojoType="dojox.mobile.Button" showLabel="false" dojoAttachEvent="onClick: sClick"><img border="0" src="/images/mobile/strikethrough.png"></button>
                            <button dojoType="dojox.mobile.Button" showLabel="false" dojoAttachEvent="onClick: supClick"><img border="0" src="/images/mobile/arrow-up.png"></button>
                            <button dojoType="dojox.mobile.Button" showLabel="false" dojoAttachEvent="onClick: subClick"><img border="0" src="/images/mobile/arrow-down.png"></button>
                            <button dojoType="dojox.mobile.Button" showLabel="false" dojoAttachEvent="onClick: quoteClick"><img border="0" src="/images/mobile/quotes-left.png"></button>
                            </span>
                    <br>
                    <textarea class="chatText" name="" dojoType="dojox.mobile.TextArea" rows="3" cols="50"></textarea>
                </div>

                <span class="chatBtn" dojoType="dojox.mobile.Button" style="font-size: 32px;"><img border="0" src="/images/mobile/bubble.png"></span><span class="chatWaitMessage"></span>
            </td>
                <td>
                    Users:<br>
                    <div class="userListDiv"></div>
                </td>
            </tr></table>
</div>
