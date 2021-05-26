"use strict";

class CanvasADSR {
/*
	A JavaScript class to draw an ADSR envelope in a Canvas window of supplied 
	pixel dimensions. The lines will scale to supplied canvas size.
	Two styles available: Linear and Exponential.
	
	Class requires:
		canvas object name: (canvas object)
		canvasHeight: (value in pixels)
		canvasWidth: (value in pixels)
		attack: (ADSR attack value: 0 to 127) 
		decay: (ADSR decay value: 0 to 127)
		sustain:(ADSR sustain value: 0 to 127)
		release :(ADSR release value: 0 to 127)

	Optional:
		adsrEnvelopeType: 'Linear' or 'Expenential'  (default: 'Linear')
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
		adsrEnvelopeType: 'Linear',
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

		if(arr.attack >= 0 && arr.attack<=127) this.attack = arr.attack;
		if(arr.decay >= 0 && arr.decay<=127) this.decay = arr.decay;
		if(arr.sustain >= 0 && arr.sustain<=127) this.sustain = arr.sustain;
		if(arr.release >= 0 && arr.release<=127) this.release = arr.release;

		this.ratioHeight = 0;
		this.ratioWidth = 0;

		this.pixAtk = 0;
		this.pixDec = 0;
		this.pixSus = 0;
		this.pixRel = 0;
		this.leftover = 0;

		if(typeof arr.lineColour !== 'undefined') this.lineColour = arr.lineColour;
		if(typeof arr.pixelWidth !== 'undefined') this.pixelWidth = arr.pixelWidth;
		if(typeof arr.axisColour !== 'undefined') this.axisColour = arr.axisColour;

		this.calcHold();
		this.calcRatioHeight();
		this.calcRatioWidth();
		this.calcPixelVals();

		if(typeof arr.includeAxis !== 'undefined'){
			if(arr.includeAxis === true) this.drawAxis();
		} else {
			this.drawAxis();
		}

		if(arr.adsrEnvelopeType !== 'undefined'){ 
			(arr.adsrEnvelopeType === 'Exponential')?this.drawADSREnvelopeExp():
			this.drawADSREnvelopeLinear();
		} else{
			this.drawADSREnvelopeLinear();
		}
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

	drawADSREnvelopeLinear(){

		this.ctx.strokeStyle = this.lineColour;
		this.ctx.lineWidth = this.pixelWidth;

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

	drawADSREnvelopeExp(){

		this.ctx.strokeStyle = this.lineColour;
		this.ctx.lineWidth = this.pixelWidth;

		this.ctx.beginPath();
		this.ctx.moveTo(0, this.canvasHeight); // start point
		this.ctx.quadraticCurveTo(this.pixAtk, this.canvasHeight, this.pixAtk, 0);
		this.ctx.stroke();
		this.ctx.quadraticCurveTo(this.pixAtk, this.pixDec, 
			this.pixAtk + this.pixDec, (this.canvasHeight-this.pixSus));
		this.ctx.stroke();
		this.ctx.lineTo(this.pixAtk + this.pixDec + (this.leftover), 
			(this.canvasHeight-this.pixSus));
		this.ctx.stroke();
		this.ctx.quadraticCurveTo(this.pixAtk + this.pixDec + this.leftover, 
			this.canvasHeight, 
			this.pixAtk + this.pixDec + this.leftover + this.pixRel, 
			this.canvasHeight);
		this.ctx.stroke();	
	}

}




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
	adsrEnvelopeType: 'Linear',
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
	release : 120,
	adsrEnvelopeType: 'Exponential'
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
	adsrEnvelopeType: 'Linear',
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
	adsrEnvelopeType: 'Linear',
	lineColour: 'orange',
	pixelWidth: 2,
	includeAxis: false
});