$(document).ready(function() {
  var s = Snap("#svgmap");
  var map = Snap.load("./images/usa.svg", function ( loadedFragment ) {
                                                s.append( loadedFragment );
                                        } );

});
