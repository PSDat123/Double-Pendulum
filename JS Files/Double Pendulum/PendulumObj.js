class DBPendulum{
	static num=0;
	static hsb2=126;
	static hsb1br=255;
	static t=0.25;
	static g=9.8;
	static isPaused=true;
	static colorForRods=false;

	constructor(a1,a2,cx,cy,r1,r2,m1,m2){
		this.a1=a1;
		this.a2=a2;
		this.cx=cx;
		this.cy=cy;
		this.a1_a=0; this.x1=0;
		this.a2_a=0; this.x2=0;
		this.a1_v=0; this.y1=0;
		this.a2_v=0; this.y2=0;
		this.r1=r1;
		this.r2=r2;
		this.m1=m1;
		this.m2=m2;
		this.traceArr1=[];
		this.traceArr2=[];
		this.trailColor1=color(0,255,DBPendulum.hsb1br);
		this.trailColor2=color(DBPendulum.hsb2,255,255);
		
		this.simObject='none';
	}

	update(){
		if(!DBPendulum.isPaused){
			let num1 = -DBPendulum.g * (2 * this.m1 + this.m2) * sin(this.a1);
			let num2 = -this.m2 * DBPendulum.g * Math.sin(this.a1 - 2 * this.a2);
	  		let num3 = -2 * Math.sin(this.a1 - this.a2) * this.m2;
		  	let num4 = this.a2_v * this.a2_v * this.r2 + this.a1_v * this.a1_v * this.r1 * Math.cos(this.a1 - this.a2);
		  	let denom= this.r1 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.a1 - 2 * this.a2));
		  	this.a1_a = (num1+num2+num3*num4)/denom;

		 	num1 = 2 * Math.sin(this.a1 - this.a2);
		  	num2 = this.a1_v * this.a1_v * this.r1 * (this.m1 + this.m2);
		  	num3 = DBPendulum.g * (this.m1 + this.m2) * Math.cos(this.a1);
		  	num4 = this.a2_v * this.a2_v * this.r2 * this.m2 * Math.cos(this.a1 - this.a2);
		  	denom = this.r2 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.a1 - 2 * this.a2));
		  	this.a2_a = (num1 * (num2 + num3 + num4)) / denom;

		  	if(this.simObject=="none"){ 
			  	this.a1_v += this.a1_a*DBPendulum.t;
		  		this.a2_v += this.a2_a*DBPendulum.t;
		  		this.a1 += this.a1_v*DBPendulum.t;
		  		this.a2 += this.a2_v*DBPendulum.t;

		  		this.a1_v*=0.999 ;    //air resistance
		  		this.a2_v*=0.999;

	  		}

  		}
	  	this.x1=this.r1*Math.sin(this.a1);
		this.y1=this.r1*Math.cos(this.a1);
		this.x2=this.x1+this.r2*Math.sin(this.a2);
		this.y2=this.y1+this.r2*Math.cos(this.a2);

		this.traceArr1.unshift([this.x1,this.y1])
		this.traceArr2.unshift([this.x2,this.y2]);
		if(this.traceArr1.length>=50) this.traceArr1.pop();
		if(this.traceArr2.length>=50) this.traceArr2.pop();
	}
	show(){
		push();
		translate(this.cx,this.cy);

		if (frameCount > 1) {  	
	  		stroke(this.trailColor2);	
	  		for(let i=1;i<this.traceArr2.length;i++){
	  			let sw1=map(i,1,this.traceArr2.length,0,4);
	  			//trailColor.setAlpha(255-a);
	  			strokeWeight(4-sw1);	
	  			beginShape();
	  			vertex(this.traceArr2[i-1][0], this.traceArr2[i-1][1]);
	  			vertex(this.traceArr2[i][0], this.traceArr2[i][1]);
				endShape();
			}
			if(num<2){
				this.trailColor1=color(0,255,255);
				stroke(this.trailColor1);	
				for(let i=1;i<this.traceArr1.length;i++){
		  			let sw2=map(i,1,this.traceArr1.length,0,4);
		  			//trailColor.setAlpha(255-a);
		  			strokeWeight(4-sw2);	
		  			beginShape();
		  			vertex(this.traceArr1[i-1][0], this.traceArr1[i-1][1]);
		  			vertex(this.traceArr1[i][0], this.traceArr1[i][1]);
					endShape();
				}
			}
			else{
				this.trailColor1=color(0,255,DBPendulum.hsb1br);
			}
 		}

 		
 		stroke(DBPendulum.colorForRods ? this.trailColor2:0);
		strokeWeight(4);

		line(0,0,this.x1,this.y1);
		line(this.x1,this.y1,this.x2,this.y2);
		
		fill(this.trailColor1);
		ellipse(this.x1,this.y1,this.m1/1,this.m1/1);
		fill(this.trailColor2);
		ellipse(this.x2,this.y2,this.m2/1,this.m2/1);

		pop();
	}
}