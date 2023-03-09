let typeSelectScene, customizationScene, launchScene;
let currentScene = 0; // typeSelect = 0, customizationScene = 1, launchScene = 2;
let font;

// Return data from typeSelect
let fwk_type = -1; // 0 = high, 1 = mid, 2 = low

// Return data from customizationScene
let fwk_shape = -1; // In order as they appear on the shape select screen 
let fwk_hue = 0; // [0, 1]

// Return data from launchScene
let fwk_scale = 0; // [0, 1]
let fwk_NormXPos = 0; // [0, 1]
let fwk_NormYPos = 0; // [0, 1]


// Return data from Launch Scene

function preload(){
  font = loadFont('assets/Metropolis-Regular.otf');
}

function setup(){
	createCanvas(windowWidth, windowHeight);
	background(0);

	typeSelectScene = new TypeSelectScene();
	typeSelectScene.setup();
	customizationScene = new CustomizationScene();
	customizationScene.setup();
	launchScene = new LaunchScene();
	launchScene.setup();

	typeSelectScene.show();
}

function draw(){
	if(currentScene == 0){
		typeSelectScene.draw();
	}else if(currentScene == 1){
		customizationScene.draw();
	}else if(currentScene == 2){
		launchScene.draw();
	}else{
		print("ERROR - unknown scene #"+currentScene);
	}
}

function mousePressed(){
	if(currentScene == 0){
		typeSelectScene.mousePressedDelegate();
	}else if(currentScene == 1){
		customizationScene.mousePressedDelegate();
	}else if(currentScene == 2){
		launchScene.mousePressedDelegate();
	}else{
		print("ERROR - unknown scene #"+currentScene);
	}
}

function mouseReleased(){
	if(currentScene == 1){
		customizationScene.mouseReleasedDelegate();
	}else if(currentScene == 2){
		launchScene.mouseReleasedDelegate();
	}
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  aspect = windowWidth/windowHeight;
}

function navigateToScene(targetScene){
	if(currentScene == 0){
		typeSelectScene.hide();
	}else if(currentScene == 1){
		customizationScene.hide();
	}else if(currentScene == 2){
		launchScene.hide();
	}

	if(targetScene == 0){
		typeSelectScene.show();
	}else if(targetScene == 1){
		customizationScene.show();
	}else if(targetScene == 2){
		launchScene.show();
	}
	
	currentScene = targetScene;
}

/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling
 * the page.
 */


function touchStarted(){
	mousePressed();
  return false;
}

function touchMoved(){
	// print("touch moved");
  return false;
}

function touchEnded(){
	mouseReleased();
  return false;
}