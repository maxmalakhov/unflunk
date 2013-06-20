/**
 * Created with IntelliJ IDEA.
 * User: max
 * Date: 6/19/13
 * Time: 7:43 PM
 * To change this template use File | Settings | File Templates.
 */

var moduleSerializer = new (function() {

    //first point should be upper left of rect
    var normalizeBounds = function(bounds){
        if(bounds.x2 < bounds.x1){
            var tempX1 = bounds.x1;
            bounds.x1 = bounds.x2;
            bounds.x2 = tempX1;
        }
        if(bounds.y2 < bounds.y1){
            var tempY1 = bounds.y1;
            bounds.y1 = bounds.y2;
            bounds.y2 = tempY1;
        }
        return bounds;
    };
    var addTimeRand = function(geom){
        geom.cTime = new Date().getTime();
        geom.cRand = Math.round(100000000000 * Math.random());
        geom.fromUser = userName; // userName is global var
        return geom;
    };

    this.createVideoJSON = function(x,y,src) {
        var geom = {
            xPts: [ x ],
            yPts: [ y ],
            shapeType : 'video'
        };
        geom.text = src;
        return addTimeRand(geom);
    };
    this.createPdfJSON = function(x,y,src) {
        var geom = {
            xPts: [ x ],
            yPts: [ y ],
            shapeType : 'pdf'
        };
        geom.text = src;
        return addTimeRand(geom);
    };
    this.createImageJSON = function(bounds,textData){
        bounds = normalizeBounds(bounds);
        var geom = {
            xPts: [bounds.x1,bounds.x2],
            yPts: [bounds.y1,bounds.y2],
            shapeType: 'image'
        };
        geom.dataStr = textData;
        geom.text = textData;

        return addTimeRand(geom);
    };

})();