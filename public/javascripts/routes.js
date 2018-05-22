ready(function(){
  // Draw the Map on the page
  var s = Snap("#svgmap");
  var map = Snap.load("./images/usa.svg", function(loadedFragment) {s.append( loadedFragment );});
  // Override the default form behavior 
  document.getElementById("routeForm").onsubmit = function(event) { 
    event.preventDefault();
    getRoutes();
    return false;
  }
});

function ready(f) {
  var badState = /uninitialized|loading/;
  badState.test(document.readyState) ? setTimeout('ready('+f+')',5):f();
}

function drawLine(x1, y1, x2, y2) {
  var s = Snap("#svgmap");
  s.line(x1, y1, x2, y2);
  // Added aitport dots here for now as well, may move out to a separate 
  // function if I add hover over details.
  s.circle(x1, y1, 5);
  s.circle(x2, y2, 5);
}

// Take values, perform gremlin query and draw snapsvg lines
function getRoutes() {
  // query /routes with the params recieved from the form
  var url = '/routes?start=' + start.value + '&dest=' + dest.value + '&limit=' + limit.value;
  // Remove any lines that are already drawn on the page
  clearLines();
  // Loop through the array of routes and draw the route segments
  loadRoutes(url, routeWriter);
}

function clearLines() {
  var lines = document.getElementsByTagName('line');
  while (lines[0]) {
    lines[0].parentNode.removeChild(lines[0]);
  }
}

function loadRoutes(url, cb) {
  var xhttp;
  xhttp=new XMLHttpRequest();
//  xhttp.responseType = "json";
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      cb(this.response);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('Content-Type', 'application/json')
  xhttp.responseType = "json";
  xhttp.send();
}

function routeWriter(routes) {
//  let routes = xhttp.response;
//  console.log(routes[1]);
  var i, j;
  for ( i = 0; i < routes.length; i++) {
//    console.log(routes);
    for (j = 0; j + 1 < routes[i]["objects"].length; j++) {

      //convert coords to pixels
      let x1 = lonToPx(routes[i]["objects"][j]["lon"][0]);
      let x2 = lonToPx(routes[i]["objects"][j + 1]["lon"][0]);
      let y1 = latToPx(routes[i]["objects"][j]["lat"][0]);
      let y2 = latToPx(routes[i]["objects"][j + 1]["lat"][0]);
      drawLine(x1, y1, x2, y2);
    }
  }
}

function latToPx(lat) {
  // northern boundary for svg image aka pixel 0
  const nb = 50.54828705652597;
  // const south = 24.215873369454947;
  // total latitude in map is 26.332413687071023 total pixels are 318.2870370370371
  // total latitude / total pixels gives us a scale to work with
  const latScale = 0.082731656093198;
  lat = (nb - lat) / latScale;
  return lat;
}

function lonToPx(lon) {
  // western boundary for svg image aka pixel 0
  const wb = -127.55272679845754;
  // const east = -64.54920772895363;
  lonScale = 0.106177717403653;
  lon =  (lon - wb) / lonScale;
  return lon;
}
