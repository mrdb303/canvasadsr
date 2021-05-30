## ADSR Graphic Class for JavaScript

A JavaScript class to draw a linear ADSR envelope in a Canvas window of supplied pixel dimensions.  
The lines will scale to supplied canvas size.  
	
###Class requires:

canvas object name: (canvas object)  
canvasHeight: (value in pixels)  
canvasWidth: (value in pixels)  
attack: (ADSR attack value: 0 to 127)   
decay: (ADSR decay value: 0 to 127)  
sustain:(ADSR sustain value: 0 to 127)  
release :(ADSR release value: 0 to 127)  

###Optional:
		
lineColour: hex or css value (default: '#000000')  
pixelWidth: line pixel value (default: 2)  
includeAxis: true or false (default: true)  
axisColour: hex or css value (default: '#000000')  


			



###Example - All options:

```JS
let modulationADSR = new CanvasADSR(ctx,{ 
	canvasHeight: 130, 
	canvasWidth: 215,
	attack: 30, 
	decay: 10,
	sustain: 100, 
	release : 60,
	lineColour: '#000000',
	pixelWidth: 1,
	includeAxis: true,
	axisColour: '#e1e1e1'
});
```

###Example - Minimum options:

```JS
let modulationADSR = new CanvasADSR(ctx,{
	canvasHeight: 130, 
	canvasWidth: 215,
	attack: 30, 
	decay: 10,
	sustain: 100, 
	release : 60
});
```


###Example HTML code
			
```html
<canvas id="canvas" height="70" width="120"></canvas>  
<script src="js/canvasadsr.js"></script>
```