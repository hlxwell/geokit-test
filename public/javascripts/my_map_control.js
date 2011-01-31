// A MyMapControl is a GControl that displays textual "Zoom In"
// and "Zoom Out" buttons (as opposed to the iconic buttons used in
// Google Maps).
function MyMapControl() {}

MyMapControl.prototype = new GControl();

// Creates a one DIV for each of the buttons and places them in a container
// DIV which is returned as our control element. We add the control to
// to the map container and return the element for the map class to
// position properly.
MyMapControl.prototype.initialize = function(map) {
        var container = document.createElement("div");
    
<<<<<<< .mine
    var distanceDiv = document.createElement("div");
    this.setButtonStyle_(distanceDiv);
    container.appendChild(distanceDiv);
    distanceDiv.appendChild(document.createTextNode("量距离"));
=======
        var distanceDiv = document.createElement("div");
        this.setButtonStyle_(distanceDiv);
        container.appendChild(distanceDiv);
        distanceDiv.appendChild(document.createTextNode("测距离"));
>>>>>>> .r105

<<<<<<< .mine
    var areaDiv = document.createElement("div");
    this.setButtonStyle_(areaDiv);
    container.appendChild(areaDiv);
    areaDiv.appendChild(document.createTextNode("测面积"));
=======
        var areaDiv = document.createElement("div");
        this.setButtonStyle_(areaDiv);
        container.appendChild(areaDiv);
        areaDiv.appendChild(document.createTextNode("测面积"));
>>>>>>> .r105
    
        var circleDiv = document.createElement("div");
        this.setButtonStyle_(circleDiv);
        container.appendChild(circleDiv);
        circleDiv.appendChild(document.createTextNode("查周边"));
    GEvent.addDomListener(zoomInDiv, "click", function() {
        map.zoomIn();
    });

        GEvent.addDomListener(distanceDiv, "click", function(){
                startLine();
        });

        GEvent.addDomListener(areaDiv, "click", function() {
                startShape();
        });

        GEvent.addDomListener(circleDiv, "click", function() {
                if(circleDiv.innerHTML=="取消查找") {
                        GEvent.clearListeners(map,"click");
                        circleDiv.innerHTML="查周边";
                }  else {
                        GEvent.addDomListener(map, "click",create_marker);
                        circleDiv.innerHTML="取消查找";
                }
        });


        map.getContainer().appendChild(container);
        return container;
}

function create_marker(marker, point)  {
        if(marker == null)
        {
                drawCircle('mi',1,0.2,point) ;
        }
}

// By default, the control will appear in the top left corner of the
// map with 7 pixels of padding.
MyMapControl.prototype.getDefaultPosition = function() {
        return new GControlPosition(G_ANCHOR_BOTTOM_LEFT, new GSize(7, 7));
}

// Sets the proper CSS for the given button element.
MyMapControl.prototype.setButtonStyle_ = function(button) {
        button.style.textDecoration = "underline";
        button.style.color = "#0000cc";
        button.style.backgroundColor = "white";
        button.style.font = "small Arial";
        button.style.border = "1px solid black";
        button.style.padding = "2px";
        button.style.marginBottom = "3px";
        button.style.textAlign = "center";
        button.style.width = "60px";
        button.style.cursor = "pointer";
}
