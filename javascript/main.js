//Setting up the scenes
var scene = new THREE.Scene();
var overlayScene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.5, 1000 );

camera.rotation.order = "YXZ";//Changing rotation order for proper camera controls.

var renderer = new THREE.WebGLRenderer({"alpha" : true});
var overlayRenderer = new THREE.WebGLRenderer({"alpha" : true});

renderer.setSize( window.innerWidth, window.innerHeight );
overlayRenderer.setSize( window.innerWidth, window.innerHeight );

var bgColor = new THREE.Color(0x000000);

renderer.setClearColor(bgColor,0);//Setting render background to transparent
overlayRenderer.setClearColor(bgColor,0);

document.getElementById("display").appendChild( renderer.domElement );//Adding the model display
document.getElementById("display").appendChild( overlayRenderer.domElement );//Adding the overlayed display

//Post Processing

var attributes = {};
var uniforms = {
	time: {type: "f", value:0.0},
	zoom: {type: "f", value:0.30},
	offsetX: {type: "f", value: 0.0},
	offsetY: {type: "f", value: 0.0},
	offsetZ: {type: "f", value: 1.0},
	details: {type: "f", value: 1.0},
	seedX: {type: "f", value: 0.75},
	seedY: {type: "f", value: 0}
};
var vertexShader = document.getElementById("vShader").innerHTML;
var fragmentShader = document.getElementById("fShader").innerHTML;

var shader = {
	"attributes":{},
	"uniforms" : uniforms,
	"vertexShader": vertexShader,
	"fragmentShader": fragmentShader,
	"transparent": true
};

var composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, camera ) );

var effect = new THREE.ShaderPass( shader );
effect.renderToScreen = true;
composer.addPass( effect );

//Key handling

var keys = 
{
	left:false,
	right:false,
	bottom:false,
	top:false,
	zoomIn:false,
	zoomOut:false,
	seedXplus:false,
	seedXminus:false,
	seedYplus:false,
	seedYminus:false,
	detailMinus:false,
	detailPlus:false,
	offsetZplus:false,
	offsetZminus:false,
	shift:false
}

function keyHandler(key,state)
{
	console.log(key);
	switch(key)
	{
		case 37:keys.right = state;break;
		case 38:keys.top = state;break;
		case 39:keys.left = state;break;
		case 40:keys.bottom = state;break;
		case 68:keys.offsetZminus = state;break;
		case 69:keys.offsetZplus = state;break;
		case 107:keys.zoomIn = state;break;
		case 109:keys.zoomOut = state;break;
		case 81:keys.seedXplus = state;break;
		case 65:keys.seedXminus = state;break;
		case 87:keys.seedYplus = state;break;
		case 83:keys.seedYminus = state;break;
		case 90:keys.detailMinus = state;break;
		case 88:keys.detailsPlus = state;break;
		case 16:keys.shift = state;break;
	}
}

addEventListener("keydown",function(e){ keyHandler(e.keyCode,true); });
addEventListener("keyup",function(e){ keyHandler(e.keyCode,false); });

//Loops

function render()
{
    renderer.render(scene, camera);//Renders the scene in which the models reside
    overlayRenderer.render(overlayScene,camera);//Renders the scene in which the overlay resides
	composer.render();
}

function commandHandler()
{
	var enhancer = 1;
	
	if(keys.shift)enhancer = 2;

	var moveScale =  1 / effect.uniforms.zoom.value / 100;
	if(keys.left)
		effect.uniforms.offsetX.value += 1 * moveScale * enhancer;
	else if(keys.right)
		effect.uniforms.offsetX.value -= 1 * moveScale * enhancer;
	
	if(keys.top)
		effect.uniforms.offsetY.value += 1 * moveScale * enhancer;
	else if(keys.bottom)
		effect.uniforms.offsetY.value -= 1 * moveScale * enhancer;
		
	if(keys.offsetZplus)
		effect.uniforms.offsetZ.value /= Math.pow(0.99 , enhancer);
	else if(keys.offsetZminus)
		effect.uniforms.offsetZ.value *= Math.pow(0.99 , enhancer);
		
	if(keys.zoomIn)
		effect.uniforms.zoom.value /= Math.pow(0.99 , enhancer);
	else if(keys.zoomOut)
		effect.uniforms.zoom.value *= Math.pow(0.99 , enhancer);
		
	var seedSpeed = Math.pow(0.01 * moveScale , 1/ enhancer);
		
	if(keys.seedXplus)
		effect.uniforms.seedX.value += seedSpeed;
	else if(keys.seedXminus)
		effect.uniforms.seedX.value -= seedSpeed;
		
	if(keys.seedYplus)
		effect.uniforms.seedY.value += seedSpeed;
	else if(keys.seedYminus)
		effect.uniforms.seedY.value -= seedSpeed;
		
	if(keys.detailPlus)
		effect.uniforms.details.value += Math.pow(0.01 , 1/enhancer);
	if(keys.detailMinus)
		effect.uniforms.details.value -= Math.pow(0.01 , 1/enhancer);
}

function main()
{
	commandHandler();
    render();//Triggers the render
    requestAnimationFrame(main);//Loop main at optimal speed
	
	var d = (new Date()).getTime()/1000;
	
	
}

//Initiations
	
	//var a = new THREE.Mesh(new THREE.SphereGeometry(3, 10, 10),shaderMaterial);

function init()//Initiate what need to be initiated
{
	//scene.add(a);
	
	var distF = 10;
	
	camera.position.z = 10;
	camera.position.y = 0.5;
	
    main();//Starts the main loop.
    //Temporary debug for fancyness and demonstration.
    //importModel(sledgeHammer);//Import the demo model
}

init();//Begins the application