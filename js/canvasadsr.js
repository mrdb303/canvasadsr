"use strict";

class CanvasADSR {
/*
	A JavaScript class to draw a linear ADSR envelope in a Canvas window of 
	supplied pixel dimensions. The lines will scale to supplied canvas size.
	
	Class requires:
		canvas object name: (canvas object)
		canvasHeight: (value in pixels)
		canvasWidth: (value in pixels)
		attack: (ADSR attack value: 0 to 127) 
		decay: (ADSR decay value: 0 to 127)
		sustain:(ADSR sustain value: 0 to 127)
		release :(ADSR release value: 0 to 127)

	Optional:
		lineColour: hex or css value (default: '#000000')
		pixelWidth: line pixel value (default: 2)
		includeAxis: true or false (default: true)
		axisColour: hex or css value (default: '#000000')


	Example - All options:

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


	Example - Minimum options:

	let modulationADSR = new CanvasADSR(ctx,{
		canvasHeight: 130, 
		canvasWidth: 215,
		attack: 30, 
		decay: 10,
		sustain: 100, 
		release : 60
	});
	D Brien 2021

*/

	constructor(ctx, arr ) {
				
		this.ctx = ctx;
		this.arr = arr;
		
		this.canvasHeight = arr.canvasHeight;
		this.canvasWidth = arr.canvasWidth;
		
		this.lineColour = '#000000';
		this.axisColour = '#000000';
		this.pixelWidth = 2;
		
		this.attack = 0;
		this.decay = 0;
		this.sustain = 0;
		this.release = 0;
		this.hold = 0;

		this.ratioHeight = 0;
		this.ratioWidth = 0;

		this.pixAtk = 0;
		this.pixDec = 0;
		this.pixSus = 0;
		this.pixRel = 0;
		this.leftover = 0;

		this.validateADSRValues();
		this.setExtraOptions();
		this.calcHold();
		this.calcRatioHeight();
		this.calcRatioWidth();
		this.calcPixelVals();
		this.processAxis();
		this.drawADSREnvelopeLinear()
		
	}

	processAxis(){
		if(typeof this.arr.includeAxis !== 'undefined'){
			if(this.arr.includeAxis === true) this.drawAxis();
		} else {
			this.drawAxis();
		}
	}

	validateADSRValues(){
		if(this.arr.attack >= 0 && this.arr.attack<=127)
			this.attack = this.arr.attack;
		if(this.arr.decay >= 0 && this.arr.decay<=127) 
			this.decay = this.arr.decay;
		if(this.arr.sustain >= 0 && this.arr.sustain<=127)
			this.sustain = this.arr.sustain;
		if(this.arr.release >= 0 && this.arr.release<=127)
			this.release = this.arr.release;
	}

	setExtraOptions(){
		if(typeof this.arr.lineColour !== 'undefined') this.lineColour = this.arr.lineColour;
		if(typeof this.arr.pixelWidth !== 'undefined') this.pixelWidth = this.arr.pixelWidth;
		if(typeof this.arr.axisColour !== 'undefined') this.axisColour = this.arr.axisColour;
	}

	calcHold(){
		let maximum = 127 * 4;
		this.hold =  maximum - (this.attack + this.decay + this.release);
	}
	
	calcRatioHeight(){
		this.ratioHeight = this.canvasHeight / 127;
	}
	
	calcRatioWidth(){
		this.ratioWidth = this.canvasWidth / 
			(this.attack + this.decay + this.release + this.hold);
	}

	calcPixelVals(){
		this.pixAtk = this.attack * this.ratioWidth;
		this.pixDec = this.decay * this.ratioWidth;
		this.pixSus = this.sustain * this.ratioHeight;
		this.pixRel = this.release * this.ratioWidth;
		this.leftover = this.hold * this.ratioWidth; 
	}

	drawAxis(){
		this.ctx.strokeStyle = this.axisColour;
		this.ctx.lineWidth = this.pixelWidth;
		this.ctx.beginPath();
		this.ctx.moveTo(0, 0); 
		this.ctx.lineTo(0, this.canvasHeight);
		this.ctx.stroke();
		this.ctx.lineTo(this.canvasWidth, this.canvasHeight);
		this.ctx.stroke();
	}

	assignLineColourAndPixelWidth(){
		this.ctx.strokeStyle = this.lineColour;
		this.ctx.lineWidth = this.pixelWidth;
	}

	drawADSREnvelopeLinear(){
		this.assignLineColourAndPixelWidth();
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.canvasHeight); // start point
		this.ctx.lineTo(this.pixAtk, 0);
		this.ctx.stroke();
		this.ctx.lineTo(this.pixAtk + this.pixDec, (this.canvasHeight-this.pixSus));
		this.ctx.stroke();
		this.ctx.lineTo(this.pixAtk + this.pixDec + (this.leftover), 
			(this.canvasHeight-this.pixSus));
		this.ctx.stroke();
		this.ctx.lineTo(this.pixAtk + this.pixDec + this.leftover + this.pixRel, this.canvasHeight);
		this.ctx.stroke();
	}

}  // CanvasADSR class ends





let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

// pass canvas object and array settings into CanvasADR() instance
let outputADSR1 = new CanvasADSR(ctx,{ 
	canvasHeight: 70, 
	canvasWidth: 120,
	attack: 80, 
	decay: 10,
	sustain: 100, 
	release : 60,
	lineColour: '#000000',
	pixelWidth: 2,
	includeAxis: true
});



let canvas2 = document.querySelector('#canvas2');
let ctx2 = canvas2.getContext('2d');

let outputADSR2 = new CanvasADSR(ctx2,{
	canvasHeight: 100, 
	canvasWidth: 150,
	attack: 60, 
	decay: 30,
	sustain: 90, 
	release : 120
});


let canvas3 = document.querySelector('#canvas3');
let ctx3 = canvas3.getContext('2d');


let outputADSR3 = new CanvasADSR(ctx3,{ 
	canvasHeight: 50, 
	canvasWidth: 80,
	attack: 120, 
	decay: 10,
	sustain: 100, 
	release : 60,
	lineColour: '#000000',
	pixelWidth: 2,
	includeAxis: true,
	axisColour: 'green'
});

let canvas4 = document.querySelector('#canvas4');
let ctx4 = canvas4.getContext('2d');


let outputADSR4 = new CanvasADSR(ctx4,{ 
	canvasHeight: 50, 
	canvasWidth: 80,
	attack: 120, 
	decay: 10,
	sustain: 100, 
	release : 60,
	lineColour: 'orange',
	pixelWidth: 2,
	includeAxis: false
});