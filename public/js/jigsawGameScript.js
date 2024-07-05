//Array of elements on the grid class and piece class
var grids = new Array();
var pieces = new Array();

//Puzzle piece currently selected by the user's mouse and keyboard
var mousePiece = null;
var keyPiece = null;

//Index number of keyPiece
var keyIndex = null;

//Boolean value, true = keyboard use is in Select Piece mode, false = keyboard use is in Move Piece mode
var selectMode = true;

//Horizontal distance in pixels between the left edge of mousePiece and the mouse pointer
var diffX = null;
//Vertical distance in pixels between the top edge of mousePiece and the mouse pointer
var diffY = null;

//Int representing the highest z-index value on the page
var maxZ = 1;
var hoverGrid = null;
window.onload = init;

//Reloads current page, re-arranging the puzzle
function jumbleIt() {
  window.location.reload();
}

//Places the puzzle images in the current order as background images for the grid squares
function solveIt() {
  for (var i = 0; i < grids.length; i++) {
    pieces[i].style.backgroundImage = "";
    grids[i].style.backgroundImage = "url(images/jigsaw/piece" + i + ".png)";
  }
}


//Set up and initialize the page, define grid and pieces array, and apply event handlers to mouse and keyboard
function init() {

  var allElem = document.getElementsByTagName("*");

  for (var i = 0; i < allElem.length; i++) {
    if (allElem[i].className == "grid") grids.push(allElem[i]);
    if (allElem[i].className == "pieces") pieces.push(allElem[i]);
  }

  var randomIntegers = randomArray(pieces.length);

  for (i = 0; i < pieces.length; i++) {
    pieces[i].style.backgroundImage = "url(images/jigsaw/piece" + randomIntegers[i] + ".png)";
    pieces[i].style.top = getStyle(pieces[i], "top");
    pieces[i].style.left = getStyle(pieces[i], "left");
    pieces[i].style.width = getStyle(pieces[i], "width");
    pieces[i].style.height = getStyle(pieces[i], "height");
    pieces[i].style.cursor = "pointer";

    addEvent(pieces[i], "mousedown", mouseGrab, false);
  }

  for (var i = 0; i < grids.length; i++) {
    grids[i].style.top = getStyle(grids[i], "top");
    grids[i].style.left = getStyle(grids[i], "left");
    grids[i].style.width = getStyle(grids[i], "width");
    grids[i].style.height = getStyle(grids[i], "height");
  }
  document.onkeydown = keyGrab;
  keyPiece = pieces[0];
  keyIndex = 0;

  document.getElementById("jumble").onclick = jumbleIt;
  document.getElementById("solve").onclick = solveIt;
}

//Function for keyboard 
function keyGrab(e) {
  var evt = e || window.event;
  if (evt.keyCode == 32) { toggleMode(); return false }
}

//Function returns Boolean value indicating whether valid to drop the object
function dropValid(object) {
  for (var i = 0; i < pieces.length; i++) {
    if (withinIt(object, pieces[i])) return false;
  }
  return true;
}

//If object is over a grid square, aligns object with the top-left corner of the square
function alignPiece(object) {
  for (var i = 0; i < grids.length; i++) {
    if (withinIt(object, grids[i])) {
      object.style.left = grids[i].style.left;
      object.style.top = grids[i].style.top;
      break;
    }
  }
}

//Function if object is over a grid square, sets background color of square to light green
function highlightGrid(object) {
  if (hoverGrid) hoverGrid.style.backgroundColor = "";

  for (var i = 0; i < grids.length; i++) {
    if (withinIt(object, grids[i])) {
      hoverGrid = grids[i];
      hoverGrid.style.backgroundColor = "rgb(75, 88, 98)";
      break;
    }
  }
}

//Function that grabs a puzzle piece using mouse and sets the value of mousePiece.
function mouseGrab(e) {
  var evt = e || window.event;
  mousePiece = evt.target || evt.srcElement;
  maxZ++;

  //Place the piece above other objects
  mousePiece.style.zIndex = maxZ;
  mousePiece.style.cursor = "move";

  //x-coordinate  of  pointer
  var mouseX = evt.clientX;
  //y-coordinate  of  pointer
  var mouseY = evt.clientY;

  //Calculate  the  distance  from  the  pointer  to  the  piece
  diffX = parseInt(mousePiece.style.left) - mouseX;
  diffY = parseInt(mousePiece.style.top) - mouseY;

  //Add  event  handlers  for  mousemove  and  mouseup  events
  addEvent(document, "mousemove", mouseMove, false);
  addEvent(document, "mouseup", mouseDrop, false);
}

//Move mousePiece across the Web page, keeping a constant distance from the mouse pointer
function mouseMove(e) {
  var evt = e || window.event;

  var mouseX = evt.clientX;
  var mouseY = evt.clientY;

  mousePiece.style.left = mouseX + diffX + "px";
  mousePiece.style.top = mouseY + diffY + "px";
  highlightGrid(mousePiece);
}

//Drop mousePiece on the page, then aligns the piece with the grid
function mouseDrop(e) {

  if (dropValid(mousePiece)) {

    alignPiece(mousePiece);
    removeEvent(document, "mousemove", mouseMove, false);
    removeEvent(document, "mouseup", mouseDrop, false);
    mousePiece.style.cursor = "pointer";
  }
}

//Returns the computed style value for a specified styleName applied to an object.
function getStyle(object, styleName) {
  if (window.getComputedStyle) {
    return document.defaultView.getComputedStyle(object, null).getPropertyValue(styleName);
  } else if (object.currentStyle) {
    return object.currentStyle[styleName]
  }
}

//Returns a Boolean value indicating whether the top-left corner of object1 lies within the boundaries of object2
function withinIt(object1, object2) {
  var within = false;
  var x1 = parseInt(object1.style.left);
  var y1 = parseInt(object1.style.top);

  var left = parseInt(object2.style.left);
  var top = parseInt(object2.style.top);
  var width = parseInt(object2.style.width);
  var height = parseInt(object2.style.height);

  var bottom = top + height;
  var right = left + width;

  if ((x1 > left && x1 < right) && (y1 > top && y1 < bottom)) within = true;

  return within;
}

//Returns an array of integers from 0 up to size-1 sorted in random order
function randomArray(size) {
  var ra = new Array(size);
  for (var i = 0; i < ra.length; i++) ra[i] = i;
  ra.sort(randOrder);
  return ra;
}

function randOrder() {
  return 0.5 - Math.random();
}

//Assigns an event handers to object
function addEvent(object, evName, fnName, cap) {
  if (object.attachEvent)
    object.attachEvent("on" + evName, fnName);
  else if (object.addEventListener)
    object.addEventListener(evName, fnName, cap);
}

//Removes an event handers from object
function removeEvent(object, evName, fnName, cap) {
  if (object.detachEvent)
    object.detachEvent("on" + evName, fnName);
  else if (object.removeEventListener)
    object.removeEventListener(evName, fnName, cap);
}
