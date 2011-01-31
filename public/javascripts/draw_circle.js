/* 
 * draw circle
 */

var circleUnits;
var circleRadius;
var circleOpacity;
var circleMarker;
var circle;

function drawCircle(unit, radius, opacity,position) {
        circleUnits = unit ? unit : "mi";
        circleRadius = radius ? radius : 1;
        circleOpacity = opacity ? opacity : 0.2;
    
        position = position ? position : map.getCenter();
        var bounds = new GLatLngBounds();
        var circlePoints = Array();
        
        circleMarker = new GMarker(position,{
                draggable:true
        });

        GEvent.addListener(circleMarker,'dragend',reDrawCircle)
        GEvent.addListener(circleMarker,'click',removeDrawCircle)
        map.addOverlay(circleMarker);

        with (Math) {
                if (circleUnits == 'km') {
                        //KM
                        var d = circleRadius/6378.8;	// radians
                }
                else {
                        //miles
                        var d = circleRadius/3963.189;	// radians
                }

                var lat1 = (PI/180)* position.lat();      // radians
                var lng1 = (PI/180)* position.lng();      // radians

                for (var a = 0 ; a < 361 ; a++ ) {
                        var tc = (PI/180)*a;
                        var y = asin(sin(lat1)*cos(d)+cos(lat1)*sin(d)*cos(tc));
                        var dlng = atan2(sin(tc)*sin(d)*cos(lat1),cos(d)-sin(lat1)*sin(y));
                        var x = ((lng1-dlng+PI) % (2*PI)) - PI ; // MOD function
                        var point = new GLatLng(parseFloat(y*(180/PI)),parseFloat(x*(180/PI)));
                        circlePoints.push(point);
                        bounds.extend(point);
                }

                if (d < 1.5678565720686044) {
                        circle = new GPolygon(circlePoints, '#000000', 2, 1, '#000000', circleOpacity);
                }
                else {
                        circle = new GPolygon(circlePoints, '#000000', 2, 1);
                }
        
                map.addOverlay(circle);
                map.setZoom(map.getBoundsZoomLevel(bounds));
                }
}

function removeDrawCircle(marker) {
        //delete center marker
        if(circleMarker) {
                map.removeOverlay(circleMarker);
        }

        //delete the circle
        if(circle) {
                map.removeOverlay(circle);
        }
}

function reDrawCircle(position) {
        //delete center marker
        if(circleMarker) {
                map.removeOverlay(circleMarker);
        }
    
        //delete the circle
        if(circle) {
                map.removeOverlay(circle);
        }
    
        drawCircle(circleUnits, circleRadius, circleOpacity, position);
}