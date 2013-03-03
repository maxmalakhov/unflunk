
<script>
dojo.require('workspace.BBCodeEditor');
</script>

<div dojoType="dijit.layout.ContentPane" style="padding:0;" closable="true" id="${wbId}">
<!-- Room Area -->
<div style="width: 100%; height: 100%;" dojoType="dijit.layout.BorderContainer" liveSplitters="true" >
<!-- Left Panel -->

<div class="callArea" region="leading" style="width: 40%; height: 100%;" dojoType="dijit.layout.BorderContainer" liveSplitters="true" splitter="true">
    <!-- Call Area -->
    <div region="top"  style="height: 50%;  padding:0;" dojoType="dijit.layout.ContentPane" splitter="true" >
        <div style="width: 100%; height: 100%;  padding:0;" dojoType="dijit.layout.BorderContainer" gutters="false" >
            <div region="center" dojoType="dijit.layout.ContentPane" splitter="true" ondblclick="enterFullScreen()" class="call">
                <div class="card">
                    <div class="local">
                        <video width="100%" height="100%" class="localVideo" autoplay="autoplay" muted="true"/>
                    </div>
                    <div class="remote">
                        <video width="100%" height="100%" class="remoteVideo" autoplay="autoplay">
                        </video>
                        <div class="mini">
                            <video width="100%" height="100%" class="miniVideo" autoplay="autoplay" muted="true"/>
                        </div>
                    </div>
                </div>
            </div>
            <div region="bottom" class="toolbar" style="overflow: auto; width: 37em; padding:0;" dojoType="dijit.layout.ContentPane" >
                <span class="callBtn" dojoType="dijit.form.Button" onclick="answer('${wbId}')">Call</span><span class="callWaitMessage"></span>
            </div>
        </div>
    </div>
    <!-- Chat Area -->
    <div region="center"  style="width: 40em; height: 50%;  padding:0;" dojoType="dijit.layout.ContentPane" splitter="true" >
        <div class="chatArea" style="width: 100%; height: 100%;  padding:0;" dojoType="dijit.layout.BorderContainer" gutters="false" >

            <div class="output" style="overflow: auto; width: 37em;  padding:0;" region="center" dojoType="dijit.layout.ContentPane" >
            </div>
            <div style="width: 37em; border: 1px solid #888888; padding:0;" region="bottom" dojoType="dijit.layout.ContentPane" >
                <table border="0" cellspacing="5">
                    <tr><td>
                        <textarea dojoType="workspace.BBCodeEditor" cols="40" rows="3" class="chatText"></textarea>
                        <span class="chatBtn" dojoType="dijit.form.Button">Say</span><span class="chatWaitMessage"></span>
                    </td>
                        <td>
                            Users:<br>
                            <div class="userListDiv"></div>
                        </td>
                    </tr></table>
            </div>
        </div>
    </div>
</div>

<!-- Center Panel -->
<!-- Draw Area -->
<div region="center" dojoType="dijit.layout.ContentPane"  splitter="true">
    draw: 
    
    <div>
    <div class="whiteboardContainer" style="border: 2px blue solid; background-color: white;"></div>
    <div class="whiteboardOverlayContainer"  style="border: 2px black solid; z-index : 1;"></div>
    </div>
            <form onsubmit="return false" dojoType="dijit.form.Form" class="toolForm">

           <button dojoType="dijit.form.Button" class="penToolBtn"><img border="0" src="/images/pencil.png"></button>
           <div dojoType="dijit.Tooltip" connectId="penToolBtn" position="above" showDelay="0">Pencil<br>(freehand drawing)</div>
           
           <button dojoType="dijit.form.Button" class="lineToolBtn"><img border="0" src="/images/line.png"></button>
           <div dojoType="dijit.Tooltip" connectId="lineToolBtn" position="above" showDelay="0">Straight Line</div>
           
           <button dojoType="dijit.form.Button" class="rectToolBtn"><img border="0" src="/images/rect.png"></button>
           <div dojoType="dijit.Tooltip" connectId="rectToolBtn" position="above" showDelay="0">Rectangle</div>
           
           <button dojoType="dijit.form.Button" class="filledRectToolBtn"><img border="0" src="/images/filledRect.png"></button>
           <div dojoType="dijit.Tooltip" connectId="filledRectToolBtn" position="above" showDelay="0">Filled Rectangle</div>
           
           <button dojoType="dijit.form.Button" class="ellipseToolBtn"><img border="0" src="/images/ellipse.png"></button>
           <div dojoType="dijit.Tooltip" connectId="ellipseToolBtn" position="above" showDelay="0">Ellipse</div>
           
           <button dojoType="dijit.form.Button" class="filledEllipseToolBtn"><img border="0" src="/images/filledEllipse.png"></button>
           <div dojoType="dijit.Tooltip" connectId="filledEllipseToolBtn" position="above" showDelay="0">Filled Ellipse</div>
           
           
           <button dojoType="dijit.form.Button" class="textToolBtn"><img border="0" src="/images/text.png"></button>
           <div dojoType="dijit.Tooltip" connectId="textToolBtn" position="above" showDelay="0">Draw Text</div>

           <button dojoType="dijit.form.Button" class="moveToolBtn"><img border="0" src="/images/move.png"></button>
           <div dojoType="dijit.Tooltip" connectId="moveToolBtn" position="above" showDelay="0">Move a shape</div>
           
           <button dojoType="dijit.form.Button" class="moveUpToolBtn"><img border="0" src="/images/moveUp.png"></button>
           <div dojoType="dijit.Tooltip" connectId="moveUpToolBtn" position="above" showDelay="0">Pull a shape forward</div>
           
           <button dojoType="dijit.form.Button" class="moveDownToolBtn"><img border="0" src="/images/moveDown.png"></button>
           <div dojoType="dijit.Tooltip" connectId="moveDownToolBtn" position="above" showDelay="0">Push a shape back</div>
           
           <button dojoType="dijit.form.Button" class="deleteToolBtn"><img border="0" src="/images/delete.png"></button>
           <div dojoType="dijit.Tooltip" connectId="deleteToolBtn" position="above" showDelay="0">Delete a shape</div>
           
           <br>
           
           <div class="lineColorDisplay" style="background-color: #FFFFFF; border-color: black; border-width: 1px;" dojoType="dijit.form.DropDownButton">
               <span class="colorText">color <span class="lineSwatch" style="height: 10px; width: 10px; border: 1px solid black; background-color: black;">&nbsp;&nbsp;</span></span>
               <div dojoType="dijit.TooltipDialog" class="lineColorPaletteDialog" title="Color Palette">
                   <div dojoType="dojox.widget.ColorPicker" class="lineColorPaletteWidget"></div>
                   <button dojoType="dijit.form.Button" class="lineColorPaletteOkBtn">OK</button>
                   <button dojoType="dijit.form.Button" class="lineColorPaletteCancelBtn">Cancel</button>
               </div>
           </div>
           <div class="fillColorDisplay" style="background-color: #FFFFFF; border-color: black; border-width: 1px;" dojoType="dijit.form.DropDownButton">
               <span class="colorText">fill <span class="fillSwatch" style="height: 10px; width: 10px; border: 1px solid black; background-color: white;">&nbsp;&nbsp;</span></span>
               <div dojoType="dijit.TooltipDialog" class="fillColorPaletteDialog" title="Color Palette">
                   <div dojoType="dojox.widget.ColorPicker" class="fillColorPaletteWidget"></div>
                   <button dojoType="dijit.form.Button" class="fillColorPaletteOkBtn">OK</button>
                   <button dojoType="dijit.form.Button" class="fillColorPaletteCancelBtn">Cancel</button>
               </div>
           </div>
           <select name="select" dojoType="dijit.form.Select" class="lineStrokeSelect">
                <option value="1">
                Line Thicknes:  1
                </option>
                <option value="2">
                Line Thicknes:  2
                </option>
                <option value="3" selected="selected">
                Line Thicknes:  3
                </option>
                <option value="4">
                Line Thicknes:  4
                </option>
                <option value="5">
                Line Thicknes:  5
                </option>
                <option value="6">
                Line Thicknes:  6
                </option>
                <option value="7">
                Line Thicknes:  7
                </option>
                <option value="8">
                Line Thicknes:  8
                </option>
                <option value="9">
                Line Thicknes:  9
                </option>
                <option value="10">
                Line Thicknes: 10
                </option>
                <option value="15">
                Line Thicknes: 15
                </option>
                <option value="20">
                Line Thicknes: 20
                </option>
                <option value="30">
                Line Thicknes: 30
                </option>
                <option value="50">
                Line Thicknes: 50
                </option>
                <option value="75">
                Line Thicknes: 75
                </option>
                <option value="100">
                Line Thicknes:100
                </option>
            </select>
            
            <select name="select" dojoType="dijit.form.Select" class="fontSizeSelect">
                <option value="5">
                Font:  5pt
                </option>
                <option value="6">
                Font:  6pt
                </option>
                <option value="7">
                Font:  7pt
                </option>
                <option value="8">
                Font:  8pt
                </option>
                <option value="9">
                Font:  9pt
                </option>
                <option value="10">
                Font: 10pt
                </option>
                <option value="12" selected="selected">
                Font: 12pt
                </option>
                <option value="14">
                Font: 14pt
                </option>
                <option value="16">
                Font: 16pt
                </option>
                <option value="20">
                Font: 20pt
                </option>
                <option value="24">
                Font: 24pt
                </option>
                <option value="32">
                Font: 32pt
                </option>
                <option value="48">
                Font: 48pt
                </option>
                <option value="64">
                Font: 64pt
                </option>
            </select>
            
            <button dojoType="dijit.form.Button" class="exportImgBtn"><img src="/images/export-icon.png"></button>
            <div dojoType="dijit.Tooltip" connectId="exportImgBtn" position="below" showDelay="0">Export the drawing surface.</div>
            
            <button dojoType="dijit.form.Button" class="showMovieBtn"><img src="/images/movie-icon.png"></button>
            <div dojoType="dijit.Tooltip" connectId="showMovieBtn" position="below" showDelay="0">View all steps that made this drawing.</div>
            
            
            <div class="clearDrawingDisplay" dojoType="dijit.form.DropDownButton">
               <span class="colorText">clear</span>
               <div dojoType="dijit.TooltipDialog" class="clearDrawingDialog" title="Clear Drawing">
                       Clear Drawing?<br>
                    <button class="clearDrawingYesBtn" dojoType="dijit.form.Button">Yes</button> &nbsp;&nbsp;&nbsp;
                    <button class="clearDrawingNoBtn" dojoType="dijit.form.Button">No</button>
               </div>
           </div>
        </form>
    <BR><BR>
    Share this link with your friends to have them join:<br>
<a href="http://${hostName}/whiteboard/${wbId}">http:/${hostName}/whiteboard/${wbId}</a><br>
or send them an email:<input dojoType="dijit.form.ValidationTextBox" style="width:20em;" class="email"
                                                             regExp="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
                                                             maxlength="128" placeHolder="enter an email address"/><button class="sendMailButton" dojoType="dijit.form.Button">send</button><br><br>
Or start a new whiteboard: <a href="http://${hostName}/whiteboard">http://${hostName}/whiteboard</a><br>
<a href="http://twitter.com/monteslu">@monteslu</a>
</div>

<div id="imgDialog" dojoType="dijit.Dialog" title="Right-click on image to save it">
    <img id="exportedImg" name="exportedImg">
</div>

<div id="textDialog" dojoType="dijit.Dialog" title="Type in some text."  style="display: none">
    <input type="text" dojoType="dijit.form.ValidationTextBox" id="wbText" name="wbText"><br>
    <button dojoType="dijit.form.Button" id="okTextBtn">OK</button>&nbsp;&nbsp;&nbsp;<button dojoType="dijit.form.Button" id="cancelTextBtn">Cancel</button>
</div>

<div id="movieDialog" dojoType="dijit.Dialog" title="Move slider to see drawing steps."  style="display: none">
    <div id="movieWhiteboardContainer" style="border: 2px blue solid; background-color: white;"></div><br>
    <div id="movieSlider" dojoType="dijit.form.HorizontalSlider" value="0"
         minimum="0" maximum="1" discreteValues="2" intermediateChanges="true"
         showButtons="false" style="width:500px;"></div><br> <button dojoType="dijit.form.Button" id="exportMovieImgBtn"><img src="/images/export-icon.png"></button>
    <div dojoType="dijit.Tooltip" connectId="exportMovieImgBtn">Export this snapshot of the drawing surface.</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    user: <span id="movieUser">user</span><br>
</div>

</div> <!-- RoomArea -->
</div> <!-- Room1 -->
