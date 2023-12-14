/* - - Follow Mouse - - */

/* - - Setup - - */
function setup() {

  createCanvas(windowWidth, windowHeight);

  // styling
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(20);
  fill('white');
  noCursor();

}


/* - - Draw - - */
function draw() {

  background('blue');

  ellipse(mouseX, mouseY, 50, 50);
  text("Mouse", mouseX + 30, mouseY);

}


// function: window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

