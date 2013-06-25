<html>
	<head> 
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/> 
		<meta name="apple-mobile-web-app-capable" content="yes" /> 
		<title>Draw It Live!</title> 
		<link href="http://ajax.googleapis.com/ajax/libs/dojo/1.9.0/dojox/mobile/themes/${mobileTheme}/${mobileTheme}.css" rel="stylesheet"/>
        <script TYPE="text/javascript" src="http://ajax.googleapis.com/ajax/libs/dojo/1.9.0/dojo/dojo.js" data-dojo-config="isDebug: true, parseOnLoad: true, baseUrl: '/js/', modulePaths:{azp:'azp', workspace:'workspace'}, gfxRenderer:'canvas,svg,vml,silverlight',defaultDuration:1"></script>
		<%--<script src="http://ajax.googleapis.com/ajax/libs/dojo/1.6/dojo/dojo.xd.js" type="text/javascript" djConfig="parseOnLoad: true"></script>--%>
 
		<script language="JavaScript" type="text/javascript"> 
			//dojo.require("dojo.parser"); // Use the lightweight parser.
			dojo.require("dojox.mobile");
			dojo.require("dojox.mobile.parser");
 
			dojo.requireIf(!dojo.isWebKit, "dojox.mobile.compat");
			dojo.require('dojo.io.script');
		</script>
</head>
<body>

