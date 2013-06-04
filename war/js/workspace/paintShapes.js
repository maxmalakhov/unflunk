
$.fn.extend({
       paintLine: function(ctx, primitive) {
          ctx.beginPath();
          ctx.moveTo(primitive.firstPoint.x, primitive.firstPoint.y);
          ctx.lineTo(primitive.lastPoint.x, primitive.lastPoint.y);
          ctx.stroke();
          if (primitive.beginDecoration == "ARROW_HEAD") {
             arrowHead(ctx, primitive.firstPoint, primitive.beginTangentAngle, 12);             
          }
          if (primitive.endDecoration == "ARROW_HEAD") {
             arrowHead(ctx, primitive.lastPoint, primitive.endTangentAngle, 12);     
          }
       },
       
       paintEllipse: function(ctx, primitive) {
          var angle, diffAngle, i, n, twoPI = Math.PI*2;

          if (primitive.firstAngle == primitive.lastAngle) {
             primitive.firstAngle = 0;
             diffAngle = twoPI;
          } else {
             diffAngle = primitive.clockwise ? - phiTwoPi(primitive.firstAngle - primitive.lastAngle, twoPI) : phiTwoPi(primitive.lastAngle - primitive.firstAngle, twoPI);
          }
          var firstPoint = null, lastPoint = null;
          n = Math.abs(diffAngle) / 0.02;
          
          ctx.beginPath();
          for (i = 0; i <= n; i++) {
             angle = primitive.firstAngle + (i/n) * diffAngle;
             var p = getEllipsePoint(primitive.center, primitive.minRadius, primitive.maxRadius, primitive.orientation, angle);
             if (firstPoint == null) {
                firstPoint = p;
                ctx.moveTo(p.x, p.y);
             } else {
                ctx.lineTo(p.x, p.y);
             }
             lastPoint = p;
          }
          ctx.stroke();
          
          if (primitive.beginDecoration == "ARROW_HEAD") {
             arrowHead(ctx, firstPoint, primitive.beginTangentAngle, 12);             
          }
          if (primitive.endDecoration == "ARROW_HEAD") {
             arrowHead(ctx, lastPoint, primitive.endTangentAngle, 12);     
          }
       },
       
       paintStroke: function(ctx, stroke) {
          ctx.beginPath();
          var lastX = stroke.x[0], lastY = stroke.y[0];
          ctx.moveTo(stroke.x[0],stroke.y[0]);
          
          var i;
          for(i=1; i<stroke.x.length; i++) {
             ctx.lineTo(stroke.x[i],stroke.y[i]);
             ctx.moveTo(stroke.x[i],stroke.y[i]);             
             lastX = stroke.x[i];
             lastY = stroke.y[i];             
          }
          ctx.stroke();
       }
});

arrowHead = function(ctx, point, angle, length) { 
       var alpha = Phi(angle + Math.PI - Math.PI / 8);
       var beta = Phi(angle - Math.PI + Math.PI / 8);

       ctx.moveTo(point.x, point.y);
       ctx.beginPath();
       {
          ctx.lineTo(point.x + (length * Math.cos(alpha)), point.y + (length * Math.sin(alpha)));
          ctx.lineTo(point.x + (length * Math.cos(beta)), point.y + (length * Math.sin(beta)));
          ctx.lineTo(point.x, point.y);
       }
       ctx.fill();
};

phiTwoPi = function(angle, twoPI) {
       angle = angle % twoPI;
       if (angle < 0)
          angle += twoPI;
       return angle;
};

Phi = function(angle) {
       angle = ((angle + Math.PI) % (Math.PI*2)) - Math.PI;
       if (angle < -Math.PI)
          angle += Math.PI*2;
       return angle;
};

getEllipsePoint = function(center, minRadius, maxRadius, orientation, angle) {
       var alpha = Math.atan2(Math.sin(angle) / minRadius, Math.cos(angle) / maxRadius);
       var x = center.x + maxRadius * Math.cos(alpha) * Math.cos(orientation) - minRadius * Math.sin(alpha) * Math.sin(orientation);
       var y = center.y + maxRadius * Math.cos(alpha) * Math.sin(orientation) + minRadius * Math.sin(alpha) * Math.cos(orientation);
       
       var point = { "x" : x, "y" : y};
       return point;
};

init = function(canvasId, color) {
       var canvas = canvasId.get(0);
       var ctx = canvas.getContext("2d");
       
       canvas.width = canvasId.first().width();
       canvas.height = canvasId.first().height();

       ctx.lineWidth = 2;
       ctx.lineCap = "round";
       ctx.lineJoin = "round";
       ctx.fillStyle = color || "blue";
       ctx.strokeStyle = color || "blue";
       
       return ctx;
};