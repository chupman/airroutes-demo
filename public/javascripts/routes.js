
function drawLine() {
  var s = Snap("#svgmap");
//  s.line(x1, y1, x2, y2);
  s.line(27, 33, 445, 308);
}

document.getElementById("routeForm").onsubmit = function(event) { 
  event.preventDefault();
  getRoutes();
  return false;
}

function getRoutes() {
  // Take values, perform gremlin query and draw snapsvg lines
  clearLines();
  drawLine(); 
//  alert("The form receieved a start of " + start.value + " a dest of " + dest.value + " and a limit of  "+ limit.value);
}

function clearLines() {
  var lines = document.getElementsByTagName('line');
  while (lines[0]) {
    lines[0].parentNode.removeChild(lines[0]);
  }
}
