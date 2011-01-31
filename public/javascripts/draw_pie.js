/* 
 * draw pie
 */

var pieUnits;
var pieRadius;
var pieOpacity;
var pieMarker;
var pie;

function drawPie(unit, radius,opacity,startAngle,endAngle,position) {
    pieUnits = unit ? unit : "mi";
    pieRadius = radius ? radius : 1;
    pieOpacity = opacity ? opacity : 0.2;
    
    position = position ? position : map.getCenter();
    var bounds = new GLatLngBounds();
    var piePoints = Array();
    
    pieMarker = new GMarker(position,{draggable:true});
    GEvent.addListener(pieMarker,'dragend',reDrawPie);
    map.addOverlay(pieMarker);

    with (Math) {
        if (pieUnits == 'km') {
            //KM
            var d = pieRadius/6378.8;	// radians
        }
        else { 
            //miles
            var d = pieRadius/3963.189;	// radians
        }

        var lat1 = (PI/180)* position.lat();      // radians
        var lng1 = (PI/180)* position.lng();      // radians

        piePoints.push(position); //start point
        for (var a = startAngle - 90 ; a < endAngle - 90 ; a++ ) {
            var tc = (PI/180)*a;
            var y = asin(sin(lat1)*cos(d)+cos(lat1)*sin(d)*cos(tc));
            var dlng = atan2(sin(tc)*sin(d)*cos(lat1),cos(d)-sin(lat1)*sin(y));
            var x = ((lng1-dlng+PI) % (2*PI)) - PI ; // MOD function
            var point = new GLatLng(parseFloat(y*(180/PI)),parseFloat(x*(180/PI)));
            piePoints.push(point);
            bounds.extend(point);
        }
        piePoints.push(position); //end point

        if (d < 1.5678565720686044) {
            pie = new GPolygon(piePoints, '#000000', 2, 1, '#000000', pieOpacity);	
        }
        else {
            pie = new GPolygon(piePoints, '#000000', 2, 1);	
        }
        
        map.addOverlay(pie);
        map.setZoom(map.getBoundsZoomLevel(bounds));
    }
}

function reDrawPie(position) {
    //delete center marker
    if(pieMarker) {
        map.removeOverlay(pieMarker);
    }
    
    //delete the pie
    if(pie) {
        map.removeOverlay(pie);
    }
    
    drawPie(pieUnits, pieRadius, pieOpacity, position);
}