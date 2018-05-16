// 
ready(function(){

  var s = Snap("#svgmap");
  var map = Snap.load("./images/usa.svg", function ( loadedFragment ) {
                                                s.append( loadedFragment );
                                        } );
//document.querySelector('form').onsubmit = formSubmit
document.querySelector('form').onsubmit = ajaxPost
});

/**
 * Takes a form node and sends it over AJAX.
 * @param {HTMLFormElement} form - Form node to send
 * @param {function} callback - Function to handle onload. 
 *                              this variable will be bound correctly.
 */

function ajaxPost (form, callback) {
    var url = form.action,
        xhr = new XMLHttpRequest();

    //This is a bit tricky, [].fn.call(form.elements, ...) allows us to call .fn
    //on the form's elements, even though it's not an array. Effectively
    //Filtering all of the fields on the form
    var params = [].filter.call(form.elements, function(el) {
        //Allow only elements that don't have the 'checked' property
        //Or those who have it, and it's checked for them.
        return typeof(el.checked) === 'undefined' || el.checked;
        //Practically, filter out checkboxes/radios which aren't checekd.
    })
    .filter(function(el) { return !!el.name; }) //Nameless elements die.
    .filter(function(el) { return el.disabled; }) //Disabled elements die.
    .map(function(el) {
        //Map each field into a name=value string, make sure to properly escape!
        return encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value);
    }).join('&'); //Then join all the strings by &

    xhr.open("GET", url);
    // Changed from application/x-form-urlencoded to application/x-form-urlencoded
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    //.bind ensures that this inside of the function is the XHR object.
    xhr.onload = callback.bind(xhr); 

    //All preperations are clear, send the request!
    xhr.send(params);
}


function formSubmit (submitEvent) {
  var name = document.querySelector('input').value
  Request({
    uri: "./routes",
    body: name,
    method: "GET"
  }, postResponse)
}

function postResponse (err, response, body) {
  var statusMessage = document.querySelector('.status')
  console.log(response)
  if (err) return statusMessage.value = err
  statusMessage.value = body
}

// Checks readystate for a state of uninitialized or loading and if present 
// sets a 5ms timeout before calling ready again. 
function ready(f) {
  var badState = /uninitialized|loading/;
  badState.test(document.readyState) ? setTimeout('ready('+f+')',5):f();
}

