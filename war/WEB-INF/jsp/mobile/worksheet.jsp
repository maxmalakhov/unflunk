<%--<div dojoType="dijit.layout.ContentPane" style="padding:0; height: 800px;" closable="true" id="${worksheetId}">--%>
<!-- Draw Area -->
    <%--<div style="position: relative">--%>
<div dojoType="dojox.mobile.RoundRect">
        <div class="whiteboardContainer" id="whiteboardContainer_${worksheetId}" style="border: 1px #B5BCC7 solid; background-color: white; z-index: 1;"></div>
        <%--<div class="whiteboardOverlayContainer" id="whiteboardOverlayContainer_${worksheetId}" style="border: 1px indianred solid; background: transparent"></div>--%>
    <%--</div>--%>
    <%--<form onsubmit="return false" dojoType="dijit.form.Form" class="toolForm">--%>

        <button id="handToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="handToolBtn"><img border="0" src="/images/hand-point.png"></button>
        <%--<div dojoType="dijit.Tooltip" connectId="handToolBtn_${worksheetId}" position="above" showDelay="0">Hand</div>--%>

        <button id="penToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="penToolBtn"><img border="0" src="/images/pencil.png"></button>
        <%--<div dojoType="dijit.Tooltip" connectId="penToolBtn_${worksheetId}" position="above" showDelay="0">Pencil<br>(freehand drawing)</div>--%>

        <button id="highlighterToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="highlighterToolBtn"><img border="0" src="/images/highlighter.png" height="16" width="16"></button>
        <%--<div dojoType="dijit.Tooltip" connectId="highlighterToolBtn_${worksheetId}" position="above" showDelay="0">Highlighter</div>--%>

        <button id="textToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="textToolBtn"><img border="0" src="/images/text.png"></button>
        <%--<div dojoType="dijit.Tooltip" connectId="textToolBtn_${worksheetId}" position="above" showDelay="0">Text</div>--%>

        <button id="lineToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="lineToolBtn"><img border="0" src="/images/line.png"></button>
        <%--<div dojoType="dijit.Tooltip" connectId="lineToolBtn_${worksheetId}" position="above" showDelay="0">Line</div>--%>

        <button id="triangleToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="triangleToolBtn"><img border="0" src="/images/icon_triangle2.png"></button>
        <%--<div dojoType="dijit.Tooltip" connectId="triangleToolBtn_${worksheetId}" position="above" showDelay="0">Triangle</div>--%>

        <button id="quadrangleToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="quadrangleToolBtn"><img border="0" src="/images/icon-rectangle.png"></button>
        <%--<div dojoType="dijit.Tooltip" connectId="quadrangleToolBtn_${worksheetId}" position="above" showDelay="0">Quadrangle</div>--%>

        <button id="circleToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="circleToolBtn"><img border="0" src="/images/icon-elipse.png"></button>
        <%--<div dojoType="dijit.Tooltip" connectId="circleToolBtn_${worksheetId}" position="above" showDelay="0">Circle</div>--%>

        <button id="equationToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="equationToolBtn"><img border="0" src="/images/edit-mathematics.png"></button>
        <%--<div dojoType="dijit.Tooltip" connectId="equationToolBtn_${worksheetId}" position="above" showDelay="0">Equation</div>--%>

        <button id="graphToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="graphToolBtn"><img border="0" src="/images/chart_curve.png"></button>
        <%--<div dojoType="dijit.Tooltip" connectId="graphToolBtn_${worksheetId}" position="above" showDelay="0">Graph</div>--%>

        <%--<div class="clearDrawingDisplay" dojoType="dijit.form.DropDownButton">--%>
            <%--<span class="colorText">clear</span>--%>
            <%--<div dojoType="dijit.TooltipDialog" class="clearDrawingDialog ${worksheetId}" title="Clear Drawing">--%>
                <%--Clear Drawing?<br>--%>
                <%--<button class="clearDrawingYesBtn  ${worksheetId}" dojoType="dojox.mobile.Button">Yes</button> &nbsp;&nbsp;&nbsp;--%>
                <%--<button class="clearDrawingNoBtn  ${worksheetId}" dojoType="dojox.mobile.Button">No</button>--%>
            <%--</div>--%>
        <%--</div>--%>

        <%--<button id="exportImgBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="exportImgBtn"><img src="/images/export-icon.png"></button>--%>
        <%--<div dojoType="dijit.Tooltip" connectId="exportImgBtn_${worksheetId}" position="below" showDelay="0">Export the drawing surface.</div>--%>

        <%--<button id="showMovieBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="showMovieBtn"><img src="/images/movie-icon.png"></button>--%>
        <%--<div dojoType="dijit.Tooltip" connectId="showMovieBtn_${worksheetId}" position="below" showDelay="0">View all steps that made this drawing.</div>--%>

        <button id="visionobjectsToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="visionobjectsToolBtn"><img border="0" src="/images/visionobjects.png" height="16" width="16"></button>
        <%--<div dojoType="dijit.Tooltip" connectId="visionobjectsToolBtn_${worksheetId}" position="above" showDelay="0">Recognition</div>--%>

        <%--<button id="documentToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="documentToolBtn"><img border="0" src="/images/open-share.png" height="16" width="16"></button>--%>
        <%--<div dojoType="dijit.Tooltip" connectId="documentToolBtn_${worksheetId}" position="above" showDelay="0">Document</div>--%>

    <%--&lt;%&ndash;<button id="rectToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="rectToolBtn"><img border="0" src="/images/rect.png"></button>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<div dojoType="dijit.Tooltip" connectId="rectToolBtn_${worksheetId}" position="above" showDelay="0">Rectangle</div>&ndash;%&gt;--%>

        <%--&lt;%&ndash;<button id="filledRectToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="filledRectToolBtn"><img border="0" src="/images/filledRect.png"></button>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<div dojoType="dijit.Tooltip" connectId="filledRectToolBtn_${worksheetId}" position="above" showDelay="0">Filled Rectangle</div>&ndash;%&gt;--%>

        <%--&lt;%&ndash;<button id="ellipseToolBtn_${worksheetId}"dojoType="dojox.mobile.Button" class="ellipseToolBtn"><img border="0" src="/images/ellipse.png"></button>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<div dojoType="dijit.Tooltip" connectId="ellipseToolBtn_${worksheetId}" position="above" showDelay="0">Ellipse</div>&ndash;%&gt;--%>

        <%--&lt;%&ndash;<button id="filledEllipseToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="filledEllipseToolBtn"><img border="0" src="/images/filledEllipse.png"></button>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<div dojoType="dijit.Tooltip" connectId="filledEllipseToolBtn_${worksheetId}" position="above" showDelay="0">Filled Ellipse</div>&ndash;%&gt;--%>

        <%--&lt;%&ndash;<button id="moveToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="moveToolBtn"><img border="0" src="/images/move.png"></button>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<div dojoType="dijit.Tooltip" connectId="moveToolBtn_${worksheetId}" position="above" showDelay="0">Move a shape</div>&ndash;%&gt;--%>

        <%--&lt;%&ndash;<button id="moveUpToolBtn_${worksheetId}"  dojoType="dojox.mobile.Button" class="moveUpToolBtn"><img border="0" src="/images/moveUp.png"></button>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<div dojoType="dijit.Tooltip" connectId="moveUpToolBtn_${worksheetId}" position="above" showDelay="0">Pull a shape forward</div>&ndash;%&gt;--%>

        <%--&lt;%&ndash;<button id="moveDownToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="moveDownToolBtn"><img border="0" src="/images/moveDown.png"></button>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<div dojoType="dijit.Tooltip" connectId="moveDownToolBtn_${worksheetId}" position="above" showDelay="0">Push a shape back</div>&ndash;%&gt;--%>

        <%--&lt;%&ndash;<button id="deleteToolBtn_${worksheetId}" dojoType="dojox.mobile.Button" class="deleteToolBtn"><img border="0" src="/images/delete.png"></button>&ndash;%&gt;--%>
        <%--&lt;%&ndash;<div dojoType="dijit.Tooltip" connectId="deleteToolBtn_${worksheetId}" position="above" showDelay="0">Delete a shape</div>&ndash;%&gt;--%>

        <%--&lt;%&ndash;<br>&ndash;%&gt;--%>
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
<div>
<%--</div>--%>