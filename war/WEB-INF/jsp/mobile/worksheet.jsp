<%--<div dojoType="dijit.layout.ContentPane" style="padding:0; height: 800px;" closable="true" id="${worksheetId}">--%>
<!-- Draw Area -->

<div dojoType="dojox.mobile.Container" class="container" style="height: 90%">

    <%--<div style="position: relative">--%>
        <div class="whiteboardContainer" id="whiteboardContainer_${worksheetId}"style="border: 1px #B5BCC7 solid; background-color: white;"></div>
        <%--<div class="whiteboardOverlayContainer" id="whiteboardOverlayContainer_${worksheetId}" style="border: 1px indianred solid; background: transparent"></div>--%>
    <%--</div>--%>
    <%--<form onsubmit="return false" dojoType="dijit.form.Form" class="toolForm">--%>
</div>
<div data-dojo-type="dojox/mobile/TabBar" data-dojo-props='barType:"slimTab", center:false, fixed:"bottom"'>
        <button id="handToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="handToolBtn baseBtn whiteBtn"><img border="0" src="/images/hand-point.png"></button>
        <button id="penToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="penToolBtn baseBtn whiteBtn"><img border="0" src="/images/pencil.png"></button>
        <button id="highlighterToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="highlighterToolBtn baseBtn whiteBtn"><img border="0" src="/images/highlighter.png" height="16" width="16"></button>
        <button id="textToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="textToolBtn baseBtn whiteBtn"><img border="0" src="/images/text.png"></button>
        <button id="lineToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="lineToolBtn baseBtn whiteBtn"><img border="0" src="/images/line.png"></button>
        <button id="triangleToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="triangleToolBtn baseBtn whiteBtn"><img border="0" src="/images/icon_triangle2.png"></button>
        <button id="quadrangleToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="quadrangleToolBtn baseBtn whiteBtn"><img border="0" src="/images/icon-rectangle.png"></button>
        <button id="circleToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="circleToolBtn baseBtn whiteBtn"><img border="0" src="/images/icon-elipse.png"></button>
        <button id="equationToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="equationToolBtn baseBtn whiteBtn"><img border="0" src="/images/edit-mathematics.png"></button>
        <button id="graphToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="graphToolBtn baseBtn whiteBtn"><img border="0" src="/images/chart_curve.png"></button>

        <%--<div class="clearDrawingDisplay" dojoType="dijit.form.DropDownButton">--%>
            <%--<span class="colorText">clear</span>--%>
            <%--<div dojoType="dijit.TooltipDialog" class="clearDrawingDialog ${worksheetId}" title="Clear Drawing">--%>
                <%--Clear Drawing?<br>--%>
                <%--<button class="clearDrawingYesBtn  ${worksheetId}" dojoType="dojox.mobile.Button">Yes</button> &nbsp;&nbsp;&nbsp;--%>
                <%--<button class="clearDrawingNoBtn  ${worksheetId}" dojoType="dojox.mobile.Button">No</button>--%>
            <%--</div>--%>
        <%--</div>--%>

        <%--<button id="exportImgBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="exportImgBtn"><img src="/images/export-icon.png"></button>--%>

        <%--<button id="showMovieBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="showMovieBtn"><img src="/images/movie-icon.png"></button>--%>

        <button id="visionobjectsToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="visionobjectsToolBtn  baseBtn whiteBtn"><img border="0" src="/images/visionobjects.png" height="16" width="16"></button>
        <button id="clearToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="clearToolBtn baseBtn whiteBtn"><img border="0" src="/images/clear.png" height="16" width="16"></button>

        <%--<button id="documentToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="documentToolBtn"><img border="0" src="/images/open-share.png" height="16" width="16"></button>--%>
        <%--<br>--%>

        <%--<div class="lineColorDisplay" style="background-color: #FFFFFF; border-color: black; border-width: 1px;" dojoType="dijit.form.DropDownButton">--%>
            <%--<span class="colorText">color <span class="lineSwatch" style="height: 10px; width: 10px; border: 1px solid black; background-color: black;">&nbsp;&nbsp;</span></span>--%>
            <%--<div dojoType="dijit.TooltipDialog" class="lineColorPaletteDialog  ${worksheetId}" title="Color Palette">--%>
                <%--<div dojoType="dojox.widget.ColorPicker" class="lineColorPaletteWidget  ${worksheetId}"></div>--%>
                <%--<button dojoType="dojox.mobile.Button" class="lineColorPaletteOkBtn  ${worksheetId}">OK</button>--%>
                <%--<button dojoType="dojox.mobile.Button" class="lineColorPaletteCancelBtn  ${worksheetId}">Cancel</button>--%>
            <%--</div>--%>
        <%--</div>--%>
        <%--<div class="fillColorDisplay" style="background-color: #FFFFFF; border-color: black; border-width: 1px;" dojoType="dijit.form.DropDownButton">--%>
            <%--<span class="colorText">fill <span class="fillSwatch" style="height: 10px; width: 10px; border: 1px solid black; background-color: white;">&nbsp;&nbsp;</span></span>--%>
            <%--<div dojoType="dijit.TooltipDialog" class="fillColorPaletteDialog  ${worksheetId}" title="Color Palette">--%>
                <%--<div dojoType="dojox.widget.ColorPicker" class="fillColorPaletteWidget  ${worksheetId}"></div>--%>
                <%--<button dojoType="dojox.mobile.Button" class="fillColorPaletteOkBtn  ${worksheetId}">OK</button>--%>
                <%--<button dojoType="dojox.mobile.Button" class="fillColorPaletteCancelBtn  ${worksheetId}">Cancel</button>--%>
            <%--</div>--%>
        <%--</div>--%>
        <%--<select data-dojo-type="dijit.form.DataList" data-dojo-props='id:"lineStrokeSelect${worksheetId}"'>--%>
            <%--<option value="1">Line Thicknes:  1</option>--%>
            <%--<option value="2">Line Thicknes:  2</option>--%>
            <%--<option value="3" selected="selected">Line Thicknes:  3</option>--%>
            <%--<option value="4">Line Thicknes:  4</option>--%>
            <%--<option value="5">Line Thicknes:  5</option>--%>
            <%--<option value="6">Line Thicknes:  6</option>--%>
            <%--<option value="7">Line Thicknes:  7</option>--%>
            <%--<option value="8">Line Thicknes:  8</option>--%>
            <%--<option value="9">Line Thicknes:  9</option>--%>
            <%--<option value="10">Line Thicknes: 10</option>--%>
            <%--<option value="15">Line Thicknes: 15</option>--%>
            <%--<option value="20">Line Thicknes: 20</option>--%>
            <%--<option value="30">Line Thicknes: 30</option>--%>
            <%--<option value="50">Line Thicknes: 50</option>--%>
            <%--<option value="75">Line Thicknes: 75</option>--%>
            <%--<option value="100">Line Thicknes:100</option>--%>
        <%--</select>--%>
    <%--<input type="text" data-dojo-type="dojox.mobile.ComboBox"  class="lineStrokeSelect" data-dojo-props='list:"lineStrokeSelect${worksheetId}"'>--%>
        <%--<select dojoType="dijit.form.Select" class="fontSizeSelect">--%>
            <%--<option value="5">Font:  5pt</option>--%>
            <%--<option value="6">Font:  6pt</option>--%>
            <%--<option value="7">Font:  7pt</option>--%>
            <%--<option value="8">Font:  8pt</option>--%>
            <%--<option value="9">Font:  9pt</option>--%>
            <%--<option value="10">Font: 10pt</option>--%>
            <%--<option value="12" selected="selected">Font: 12pt</option>--%>
            <%--<option value="14">Font: 14pt</option>--%>
            <%--<option value="16">Font: 16pt</option>--%>
            <%--<option value="20">Font: 20pt</option>--%>
            <%--<option value="24">Font: 24pt</option>--%>
            <%--<option value="32">Font: 32pt</option>--%>
            <%--<option value="48">Font: 48pt</option>--%>
            <%--<option value="64">Font: 64pt</option>--%>
        <%--</select>--%>

    <%--</form>--%>
</div>
<%--</div>--%>