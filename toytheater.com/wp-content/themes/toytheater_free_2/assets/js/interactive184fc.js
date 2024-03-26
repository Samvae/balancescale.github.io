var stage;var stagePointer;var svgStage;var canvasStage;var canvasInUse=false;var canvasPointer;var context;var dragElement;var dragOffsetX;var dragOffsetY;var dragStopX;var dragStopY;function setInteractiveParameters(){stage=document.getElementById("stage");stagePointer=stage.createSVGPoint();if(canvasInUse){svgStage=new MovieClip(document.getElementById('svgStage').cloneNode(true));svgStage.area=svgStage.instance.querySelector("#area");stage.appendChild(svgStage.instance);canvasStage=document.getElementById("canvasStage");canvasPointer=stage.createSVGPoint();context=canvasStage.getContext("2d");context.lineCap="round";}}
function MovieClip(symbol){this.instance=symbol;this.instance.setAttribute('display','inline');this.x=0;this.y=0;this.hitX=0;this.hitY=0;this.hitWidth=0;this.hitHeight=0;this.scale=1;this.scaleX=1;this.scaleY=1;this.rotation=0;this.opacity=1;this.transform=transform;this.onStage=false;this.currentFrame=1;this.animationTitle="title";this.animationTimerValue=50;this.animationTimer;this.animationEndIndex;this.animationCounter;this.frames;this.frameSet=new Array;this.playFrames=playFrames;this.animationHandler=animationHandler;this.animationComplete=animationComplete;this.tweenTitle="title";this.tweening=false;this.tweenX;this.tweenY;this.tweenScale;this.tweenRotation;this.tweenOpacity;this.tweenTargetX;this.tweenTargetY;this.tweenTargetScale;this.tweenTargetRotation;this.tweenTargetOpacity;this.tweenCounter;this.tweenTargetCount;this.tweenTimer;this.tweenStart=tweenStart;this.tweenHandler=tweenHandler;this.tweenComplete=tweenComplete;this.tweenTimerValue=50;this.physics_name='physics_name';this.dragRestricted=false;this.dragFront=false;}
function playFrames(pass){clearTimeout(this.animationTimer);this.frameSet=pass;this.animationCounter=0;this.animationEndIndex=pass.length-1;this.frames[this.currentFrame].setAttribute("display","none");this.animationHandler();}
function animationHandler(){if(this.animationCounter>0&&this.animationCounter<=this.animationEndIndex){this.frames[this.frameSet[this.animationCounter-1]].setAttribute("display","none");}
if(this.animationCounter<=this.animationEndIndex){this.frames[this.frameSet[this.animationCounter]].setAttribute("display","inline");this.currentFrame=this.frameSet[this.animationCounter];}
if(this.animationCounter>this.animationEndIndex){this.animationComplete();}else{this.animationCounter++;var self=this;this.animationTimer=setTimeout(function(){self.animationHandler();},this.animationTimerValue);}}
function animationComplete(){}
function transform(){this.instance.setAttribute("transform","translate("+this.x+","+this.y+")scale("+this.scale+")rotate("+this.rotation+")");this.instance.setAttribute("opacity",this.opacity);}
function tweenStart(pass1,pass2,pass3,pass4,pass5,pass6){if(pass2=='current'){pass2=this.x;}
if(pass3=='current'){pass3=this.y;}
if(pass4=='current'){pass4=this.scale;}
if(pass5=='current'){pass5=this.rotation;}
if(pass6=='current'){pass6=this.opacity;}
this.tweenTargetCount=Math.floor(pass1/this.tweenTimerValue);this.tweenTargetX=pass2;this.tweenTargetY=pass3;this.tweenTargetScale=pass4;this.tweenTargetRotation=pass5;this.tweenTargetOpacity=pass6;var Value;Value=Math.abs(this.x-this.tweenTargetX);this.tweenX=Value/this.tweenTargetCount;if(this.x>this.tweenTargetX){this.tweenX*=-1;}
Value=Math.abs(this.y-this.tweenTargetY);this.tweenY=Value/this.tweenTargetCount;if(this.y>this.tweenTargetY){this.tweenY*=-1;}
Value=Math.abs(this.scale-this.tweenTargetScale);this.tweenScale=Value/this.tweenTargetCount;if(this.scale>this.tweenTargetScale){this.tweenScale*=-1;}
Value=Math.abs(this.rotation-this.tweenTargetRotation);this.tweenRotation=Value/this.tweenTargetCount;if(this.rotation>this.tweenTargetRotation){this.tweenRotation*=-1;}
Value=Math.abs(this.opacity-this.tweenTargetOpacity);this.tweenOpacity=Value/this.tweenTargetCount;if(this.opacity>this.tweenTargetOpacity){this.tweenOpacity*=-1;}
this.tweenCounter=0;this.tweening=true;this.tweenHandler();}
function tweenHandler(){if(this.tweenCounter<this.tweenTargetCount){this.x+=this.tweenX;this.y+=this.tweenY;this.rotation+=this.tweenRotation;this.scale+=this.tweenScale;this.opacity+=this.tweenOpacity;this.transform();this.instance.setAttribute("opacity",this.opacity);var self=this;if(this.tweening){this.tweenTimer=setTimeout(function(){self.tweenHandler();},this.tweenTimerValue);}
this.tweenCounter++;}else{this.tweening=false;this.x=this.tweenTargetX;this.y=this.tweenTargetY;this.rotation=this.tweenTargetRotation;this.scale=this.tweenTargetScale;this.opacity=this.tweenTargetOpacity;this.transform();this.instance.setAttribute("opacity",this.opacity);this.tweenComplete();}}
function tweenComplete(){}
function dragPointerStart(event){event.preventDefault();if(event.isPrimary){if(dragElement.dragFront){stage.appendChild(dragElement.instance);}
stagePointer.x=event.clientX;stagePointer.y=event.clientY;var m=stage.getScreenCTM();stagePointer=stagePointer.matrixTransform(m.inverse());dragOffsetX=stagePointer.x-dragElement.x;dragOffsetY=stagePointer.y-dragElement.y;dragPointerAddListeners();}}
function dragPointerTrack(event){event.preventDefault();if(event.isPrimary){stagePointer.x=event.clientX;stagePointer.y=event.clientY;var m=stage.getScreenCTM();stagePointer=stagePointer.matrixTransform(m.inverse());dragElement.x=stagePointer.x-dragOffsetX;dragElement.y=stagePointer.y-dragOffsetY;if(dragElement.dragRestricted){if(dragElement.x<dragElement.dragMinimumX){dragElement.x=dragElement.dragMinimumX;}else if(dragElement.x>dragElement.dragMaximumX){dragElement.x=dragElement.dragMaximumX;}
if(dragElement.y<dragElement.dragMinimumY){dragElement.y=dragElement.dragMinimumY;}else if(dragElement.y>dragElement.dragMaximumY){dragElement.y=dragElement.dragMaximumY;}}
dragElement.transform();dragElement.dragMoveHandler();}}
function dragPointerAddListeners(){document.addEventListener("pointermove",dragPointerTrack,false);document.addEventListener("pointerup",dragPointerRemoveListeners,false);}
function dragPointerRemoveListeners(){dragStopX=stagePointer.x;dragStopY=stagePointer.y;document.removeEventListener("pointermove",dragPointerTrack,false);document.removeEventListener("pointerup",dragPointerRemoveListeners,false);dragElement.dragStopHandler();}
function drawPointerStart(event){event.preventDefault();if(event.isPrimary){stagePointer.x=event.clientX;stagePointer.y=event.clientY;var m=stage.getScreenCTM();stagePointer=stagePointer.matrixTransform(m.inverse());drawStartPath();drawPointerAddListeners();}}
function drawPointerTrack(event){event.preventDefault();if(event.isPrimary){stagePointer.x=event.clientX;stagePointer.y=event.clientY;var m=stage.getScreenCTM();stagePointer=stagePointer.matrixTransform(m.inverse());drawPath();}}
function drawStartPath(){context.beginPath();context.moveTo(stagePointer.x,stagePointer.y);}
function drawPath(){context.lineTo(stagePointer.x,stagePointer.y);context.stroke();context.closePath();context.beginPath();context.moveTo(stagePointer.x,stagePointer.y);}
function drawClear(){context.clearRect(0,0,780,750);}
function drawPointerAddListeners(){document.addEventListener("pointermove",drawPointerTrack,false);document.addEventListener("pointerup",drawPointerRemoveListeners,false);}
function drawPointerRemoveListeners(){document.removeEventListener("pointermove",drawPointerTrack,false);document.removeEventListener("pointerup",drawPointerRemoveListeners,false);}
function hitTestPointBoundingBox(pass1,pass2,pass3){var distanceX=pass3.hitWidth*pass3.scale;var distanceY=pass3.hitHeight*pass3.scale;if(Math.abs(pass1-(pass3.x+pass3.hitX*pass3.scale))>distanceX){return false;}else if(Math.abs(pass2-(pass3.y+pass3.hitY*pass3.scale))>distanceY){return false;}
return true;}
function hitTestBoundingBox(pass1,pass2){var distanceX=pass1.hitWidth*pass1.scale+pass2.hitWidth*pass2.scale;var distanceY=pass1.hitHeight*pass1.scale+pass2.hitHeight*pass2.scale;if(Math.abs((pass1.x+pass1.hitX*pass1.scale)-(pass2.x+pass2.hitX*pass2.scale))>distanceX){return false;}else if(Math.abs((pass1.y+pass1.hitY*pass1.scale)-(pass2.y+pass2.hitY*pass2.scale))>distanceY){return false;}
return true;}
function hitTestDistance(pass1,pass2){var distance=pass1.hitRadius*pass1.scale+pass2.hitRadius*pass2.scale;if(Math.abs(pass1.x-pass2.x)>distance){return false;}else if(Math.abs(pass1.y-pass2.y)>distance){return false;}
return true;}
function generateRandom(low,high){var extra_holder=1+high-low;return Math.floor(Math.random()*extra_holder)+low;}
function getDirection(p1,p2,p3,p4,use_radians){if(use_radians===undefined){use_radians=true;}
var dx=p1-p2;var dy=p3-p4;var radians=Math.atan2(dy,dx);if(use_radians){return radians;}else{var angle=radians*180/Math.PI;return angle;}}
function getDistance(p1,p2,p3,p4){var dx=p1-p2;var dy=p3-p4;var dist=Math.sqrt(dx*dx+dy*dy);return dist;}