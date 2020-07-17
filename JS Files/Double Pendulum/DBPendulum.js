let r1=250,r2=150,m1=40,m2=40;
let a1=0;
let a2=0;
let cx,cy;

let slider1,slider2,button,checkbox,cnv;
let inp=[];

let traceArr1=[],traceArr2=[],trailColor1,trailColor2,sw1=0,sw2=0;
let simObject="none",num=1,pend=[];
function setup(){
	cnv=createCanvas(900,710);
	cnv.mousePressed(pressed);
	colorMode(HSB,255);
	pixelDensity(1);

	trailColor1=color(0,255,255);
	trailColor2=color(255,0,0);

  	a1 = PI ;
  	a2 = PI/2 ;
	cx = width / 2;
  	cy =-60+ height/2 ;
	
  	for(let i=0;i<num;i++){
  		pend[i]=new DBPendulum(a1+i/200,a2+i/200,cx,cy,r1,r2,m1,m2);
  		DBPendulum.num++;
  		DBPendulum.hsb2+=10;
  		if(DBPendulum.hsb2>255) DBPendulum.hsb2=0;
  	}
  	//DOM
	slider1=createSlider(0,255,200,1);
  	slider1.position(10,10);
  	slider2=createSlider(1,20,1,1);
  	slider2.position(160,10);

  	button=createButton("Play");
  	button.position(310,10);
  	button.size(100);
  	button.class("stat");
  	button.mousePressed(changeState);

  	checkbox=createCheckbox("Color for rods");
  	checkbox.position(430,10);
  	checkbox.class("checkbox");
  	checkbox.changed(colorForRods);

  	let p1=newP("g(m/s^2) : ",width+10,10);
  	inp[0]=createInput(DBPendulum.g.toString());
  	inp[0].position(width+10,40);

  	let p2=newP("L1(m):",width+10,80);
  	inp[1]=createInput(pend[0].r1.toString());
  	inp[1].position(width+10,110);

  	let p3=newP("L2(m):",width+10,150);
  	inp[2]=createInput(pend[0].r2.toString());
  	inp[2].position(width+10,180);

  	let p4=newP("M1(kg):",width+10,220);
  	inp[3]=createInput(pend[0].m1.toString());
  	inp[3].position(width+10,250);

  	let p5=newP("M2(kg):",width+10,290);
  	inp[4]=createInput(pend[0].m2.toString());
  	inp[4].position(width+10,320);

  	let p6=newP("Timestep : ",width+10,360);
  	inp[5]=createInput(DBPendulum.t.toString());
  	inp[5].position(width+10,390);

  	for(let i=0;i<inp.length;i++){
  		inp[i].class("stat");
  		inp[i].changed(updatePara);
  		inp[i].size(100);
  	}
  	//
}
function newP(text,x,y){
	let p=createP(text);
	p.position(x,y);
  	p.class("stat");
  	return p;
}

function draw(){
	background(slider1.value());
	DBPendulum.hsb1br=slider1.value();
	/*imageMode(CORNER);
	image(trace,0,0,width,height);*/
	num=slider2.value();
	for(let i=0;i<num;i++){
		if(pend[i]==null){
			if(i>0){
				pend[i]=new DBPendulum(pend[0].a1+i/200,pend[0].a2+i/200,cx,cy,r1,r2,m1,m2);
				pend[i].a1_a=pend[0].a1_a;
				pend[i].a2_a=pend[0].a2_a;
				pend[i].a1_v=pend[0].a1_v;
				pend[i].a2_v=pend[0].a2_v;
			}
			else pend[i]=new DBPendulum(a1+i/200,a2+i/200,cx,cy,r1,r2,m1,m2);
  			DBPendulum.num++;
  			DBPendulum.hsb2+=10;
  			if(DBPendulum.hsb2>255) DBPendulum.hsb2=0;
		}
		pend[i].update();
		pend[i].show();
	}
	for(let j=num;j<pend.length;j++){
		pend.pop();
		DBPendulum.num--;
  		DBPendulum.hsb2-=10;
  		if(DBPendulum.hsb2<0) DBPendulum.hsb2=255;

	}

	/*	if(abs(a2_v) > 100 || abs(a1_v)>100){
  		while(abs(a2_v) > 10 && abs(a1_v)>10){
  			a1_v*=0.99;    //air resistance
  			a2_v*=0.99;	//air resistance
  		}
	}*/
}
function updatePara(){
	DBPendulum.g=parseFloat(inp[0].value());
	DBPendulum.t=parseFloat(inp[5].value())
	r1=parseFloat(inp[1].value()); pend[0].r1=r1;
	r2=parseFloat(inp[2].value()); pend[0].r2=r2;
	m1=parseFloat(inp[3].value()); pend[0].m1=m1;
	m2=parseFloat(inp[4].value()); pend[0].m2=m2;
}

function pressed() {
	if(dist(pend[0].x1,pend[0].y1,mouseX-(width/2),mouseY-(-60+ height/2))<dist(pend[0].x2,pend[0].y2,mouseX-(width/2),mouseY-(-60+ height/2)) ) pend[0].simObject="bob1";
	else pend[0].simObject="bob2";
}

function changeState(){
	DBPendulum.isPaused=!DBPendulum.isPaused;
	button.html( DBPendulum.isPaused ? "Play" : "Pause");
}
function colorForRods(){
/*	if (this.checked()) {
   	 	DBPendulum.colorForRods=true;
 	} 
 	else{
    	DBPendulum.colorForRods=false;
 	}*/
	DBPendulum.colorForRods= (this.checked() ? true : false);
}
function mouseDragged(){
	if(pend[0].simObject=="bob1"){
		
		pend[0].a1+=Math.atan2(-mouseY-60+(height/2),mouseX-(width/2))-Math.atan2(-pmouseY-60+(height/2),pmouseX-(width/2));
		pend[0].a1_v=0;
		pend[0].a1_a=0;
	}
	if(pend[0].simObject=="bob2"){
		pend[0].a2+=Math.atan2(-mouseY-60+ (height/2)+pend[0].y1, mouseX-(width/2)-pend[0].x1)-Math.atan2(-pmouseY-60+(height/2)+pend[0].y1,pmouseX-(width/2)-pend[0].x1);
		pend[0].a2_v=0;
		pend[0].a2_a=0;
	}
}
function mouseReleased(){
	pend[0].simObject="none";
}
