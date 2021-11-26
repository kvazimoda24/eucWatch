//watchdog
//setBusyIndicator(D27)
E.kickWatchdog();
function KickWd(){
	"ram";
  if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) E.kickWatchdog();
}
var wdint=setInterval(KickWd,3000);
E.enableWatchdog(30, false);
E.showMessage=print; //apploader suport
global.save = function() { throw new Error("You don't need to use save() on eucWatch!"); };
//d25.write(0)
ew={pin:{BAT:D31,CHRG:D19,BUZZ:D16,BL:D12,i2c:{SCL:D7,SDA:D6},touch:{RST:D13,INT:D28},disp:{CS:D25,DC:D18,RST:D26,BL:D14},acc:{INT:D8}}};
//devmode
if (BTN1.read() || Boolean(require("Storage").read("devmode"))) { 
  let mode=(require("Storage").read("devmode"));
  if ( mode=="loader"){ 
    digitalPulse(ew.pin.BUZZ,1,80);
  } else {
    require("Storage").write("devmode","done");
    NRF.setAdvertising({}, { name:"Espruino-devmode",connectable:true });
    digitalPulse(ew.pin.BUZZ,1,100);
	print("Welcome!\n*** DevMode ***\nShort press the side button\nto restart in WorkingMode");
  }
  setWatch(function(){
    "ram";
    require("Storage").erase("devmode");
	require("Storage").erase("devmode.info");
    NRF.setServices({},{uart:false});
    NRF.setServices({},{uart:true}); 
    NRF.disconnect();
    setTimeout(() => {
	 reset();
    }, 500);
  },BTN1,{repeat:false, edge:"rising"}); 
}else{ //working mode
var w;
var pal=[];
Modules.addCached("eucWatch",function(){
//screen driver
//
// MIT License (c) 2020 fanoush https://github.com/fanoush
// see full license text at https://choosealicense.com/licenses/mit/
// compiled with options LCD_BPP=12,SHARED_SPIFLASH,SPIFLASH_CS=(1<<5)
var SPI2 = (function(){
  var bin=atob("AAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////8QtQNMfEQigGCAoYDjgBC92P///wdLe0QbiUOxBEoTaAAr/NAAIxNgA0p6RBOBcEcYMQJAxv///7L///8t6fBHkEYZTBlO//fl/xlK3/hkwAAjASUTYE/w/w5TYKlGI2AQMh9G/ykA6wMKwvgAoIu//zMxYMb4AOAAIYi//znM+ACQuPEADwbQKbkLS3tEHYEAIL3o8IfU+ACguvEAD/rQJ2AAKd7R8+cYMQJASDUCQDQ1AkAQMAJAUP///y3p8E+bsBNGAJFOSXlEBkaR+ACwACgA8IyAAJoAKgDwiIAL8f8yByoA8oOAASIC+gvyATrSsgR4AZJCeD5NsfgEgETqAiSHHCAiPEgqYAciAmDKaBxBpLLN6QNQCrE4SQpgOUp6RBGoApIIqs3pBSBP8AAJSUYCmrL4AqAdRgGaXUTtsgctAuoEDACaiL8IPTL4HMCBvxf4ASvtssXxCA4C+g7yRPoL9E/qLC6IvxRDAPgB4EocAjEK8f86IymksgD4AsAf+or6C90BIgeT//dX/9nxAQkHmwu/BpgFmElGACG68QAPytEYSnpECPH/ONKIFkQf+oj4cng0eETqAiQcQbccpLK48QAPtNFxsUJG//c2/w5Le0TbaAuxA5oTYASbACAYYBuwvejwj//3FP/w50/w/zD25wgFAFAANQJADAUAUBT///+8/v//Nv7//wr+//8ZSnpE+LUGRhBpD0YQsxNME00gIyNgByMrYBJLGGDSaAKxGmAAIgEhMEb/9//+D0t7RAEvG2kjYATdACJ5HnAc//f0/gpLe0TbaAOxI2AAIChg+L1P8P8w++cAvwgFAFAANQJADAUAUMr9//+c/f//hv3//xO1ACge2wAppr+N+AUQAiQBJAAqpL8CqQkZjfgEAKS/ATQB+AQsACuivwKqEhkBNCFGAaiovwL4BDz/96f/IEYCsBC9ACT653C1BUaIsUYYACQoRhD4ARsZsUUYtUIC2WRCIEZwvf/3kf8AKPnRATTv5wRG9ecAAA1LG2gQtaO5DEsbaAuxDEoTYA5LC0p7RAAGXGkUYJxpVGDaaQhLSQAaYFhhWWQBIBC9T/D/MPvnADUCQAQzAkAIMwJACDUCQBA1AkDK/P//BUoAIxNgovV+chNgA0sbaAuxwvgAMnBHADUCQAQzAkAQtQZMfETE6QUBASEB+gLyAfoD8+JgI2EQvQC/bPz//w==");
  return {
    cmd:E.nativeCall(561, "int(int,int)", bin),
    cmds:E.nativeCall(749, "int(int,int)", bin),
    cmd4:E.nativeCall(677, "int(int,int,int,int)", bin),
    setpins:E.nativeCall(909, "void(int,int,int,int)", bin),
    enable:E.nativeCall(797, "int(int,int)", bin),
    disable:E.nativeCall(877, "void()", bin),
    blit_setup:E.nativeCall(33, "void(int,int,int,int)", bin),
    blt_pal:E.nativeCall(221, "int(int,int,int)", bin),
  };
})();

// this method would produce code string that can replace bin declaration above with heatshrink compressed variant
// however it seems the gain is very small so is not worth it
//    shrink:function(){return `var bin=E.toString(require("heatshrink").decompress(atob("${btoa(require("heatshrink").compress(bin))}")))`;}
//*/
CS=D25;DC=D18;RST=D26;BL=D14;
SCK=D2;MOSI=D3;
RST.reset();
// CLK,MOSI,CS,DC
D2.write(0);D3.write(0);CS.write(1);DC.write(1);
SPI2.setpins(SCK,MOSI,CS,DC);
SPI2.enable(0x80,0); //8MBit, mode 0

function delayms(ms){
  digitalPulse(DC,0,ms); // just to wait 10ms
  digitalPulse(DC,0,0);
}

function toFlatString(arr){
  var b=E.toString(arr);if (b) return b;
  print("toFlatString() fail&retry!");E.defrag();b=E.toString(arr);if (b) return b;
  print("fail&retry again!");E.defrag();b=E.toString(arr);if (b) return b;
  print("failed!"); return b;
}
function toFlatBuffer(a){return E.toArrayBuffer(toFlatString(a));}

function cmd(a){
  var l=a.length;
  if (!l)return SPI2.cmd4(a,-1,-1,-1);
  if (l==2)return SPI2.cmd4(a[0],a[1],-1,-1);
  if (l==3)return SPI2.cmd4(a[0],a[1],a[2],-1);
  if (l==4)return SPI2.cmd4(a[0],a[1],a[2],a[3]);
  if (l==1)return SPI2.cmd4(a[0],-1,-1,-1);
  var b=toFlatString(a);
  SPI2.cmd(E.getAddressOf(b,true),b.length);
}

function cmds(arr){
  var b=toFlatString(arr);
  var c=SPI2.cmds(E.getAddressOf(b,true),b.length);
  if (c<0)print('lcd_cmds: buffer mismatch, cnt='+c);
  return c;
}

RST.set();

function init(){
	cmd(0x11); // sleep out
	delayms(20);
//	cmd([0x36, 0]);     // MADCTL - This is an unrotated screen
	cmd([0x36, 0x48]); 	
	cmd([0x37,0,0]);
	// These 2 rotate the screen by 180 degrees
	//[0x36,0xC0],     // MADCTL
	//[0x37,0,80],   // VSCSAD (37h): Vertical Scroll Start Address of RAM
	cmd([0x3A, 0x55]);  // COLMOD - interface pixel format - 03 - 12bpp, 05 - 16bpp
	cmd([0xB2, 0xC, 0xC, 0, 0x33, 0x33]); // PORCTRL (B2h): Porch Setting
	cmd([0xB7, 0]);     // GCTRL (B7h): Gate Control
	cmd([0xBB, 0x3E]);  // VCOMS (BBh): VCOM Setting 
	cmd([0xC2, 1]);     // VDVVRHEN (C2h): VDV and VRH Command Enable
	cmd([0xC3, 0x19]);  // VRHS (C3h): VRH Set 
	cmd([0xC4, 0x20]);  // VDVS (C4h): VDV Set
	cmd([0xC5, 0xF]);   // VCMOFSET (C5h): VCOM Offset Set .
	cmd([0xD0, 0xA4, 0xA1]);   // PWCTRL1 (D0h): Power Control 1 
	cmd([0xe0, 0x70, 0x15, 0x20, 0x15, 0x10, 0x09, 0x48, 0x33, 0x53, 0x0B, 0x19, 0x15, 0x2a, 0x2f]);   // PVGAMCTRL (E0h): Positive Voltage Gamma Control
	cmd([0xe1, 0x70, 0x15, 0x20, 0x15, 0x10, 0x09, 0x48, 0x33, 0x53, 0x0B, 0x19, 0x15, 0x2a, 0x2f]);   // NVGAMCTRL (E1h): Negative Voltage Gamma Contro
	cmd(0x29); // DISPON (29h): Display On 
//	cmd(0x21); // INVON (21h): Display Inversion On
	cmd(0x20); // INVON (21h): Display Inversion On
	//cmd([0x2a,0,0,0,239]);
	//cmd([0x2b,0,0,0,239]);
	//cmd([0x2c]);
}
var bpp=(require("Storage").read("setting.json") && require("Storage").readJSON("setting.json").bpp)?require("Storage").readJSON("setting.json").bpp:1;
var g=Graphics.createArrayBuffer(240,240,bpp);
var pal;
g.sc=g.setColor;
g.col=Uint16Array([ 0x000,1365,2730,3549,1629,2474,1963,3840,143,3935,2220,0x5ff,170,4080,1535,4095 ]);

switch(bpp){
  case 1:
    pal= Uint16Array([ 0x000,1365,2730,3549,1629,2474,1963,3840,143,3935,2220,0x5ff,170,4080,1535,4095 ]);
    g.buffer=new ArrayBuffer(8400);
    c1=pal[1]; //save color 1
    g.setColor=function(c,v){ 
	  if (c==1) pal[1]=g.col[v]; else pal[0]=g.col[v];
	  g.sc(c);
    }; 
    break; 
  case 2: 
    pal= Uint16Array([0x000,1365,1629,1535]);break; // white won't fit
    g.buffer=new ArrayBuffer(16800);
    break; 
  case 4: 
	g.buffer=new ArrayBuffer(33600);
	pal= Uint16Array([0x000,1365,2730,3549,1629,2474,1963,3840,143,3935,2220,0x5ff,170,4080,1535,4095]);
	g.setColor=function(c,v){ 
		g.sc(v);
	}; 
    break;
}

// preallocate setwindow command buffer for flip
g.winCmd=toFlatBuffer([
  5, 0x2a, 0,0, 0,0,
  5, 0x2b, 0,0, 0,0,
  1, 0x2c,
  0 ]);
// precompute addresses for flip
g.winA=E.getAddressOf(g.winCmd,true);
g.palA=E.getAddressOf(pal.buffer,true); // pallete address
g.buffA=E.getAddressOf(g.buffer,true); // framebuffer address
g.stride=g.getWidth()*bpp/8;

g.flip=function(force){
  var r=g.getModified(true);
  if (force)
    r={x1:0,y1:0,x2:this.getWidth()-1,y2:this.getHeight()-1};
  if (r === undefined) return;
  var x1=r.x1&0xfe;var x2=(r.x2+2)&0xfe; // for 12bit mode align to 2 pixels
  var xw=(x2-x1);
  var yw=(r.y2-r.y1+1);
  if (xw<1||yw<1) {print("empty rect ",xw,yw);return;}
/*
  cmd([0x2a,0,x1,0,x2-1]);
  cmd([0x2b,0,r.y1,0,r.y2]);
  cmd([0x2c]);
*/
  var c=g.winCmd;
  c[3]=x1;c[5]=x2-1; //0x2a params
  c[9]=r.y1;c[11]=r.y2; // 0x2b params
  SPI2.blit_setup(xw,yw,bpp,g.stride);
  var xbits=x1*bpp;
  var bitoff=xbits%8;
  var addr=g.buffA+(xbits-bitoff)/8+r.y1*g.stride; // address of upper left corner
  //VIB.set();//debug
  SPI2.cmds(g.winA,c.length);
  SPI2.blt_pal(addr,g.palA,bitoff);
  //VIB.reset();//debug
};

g.bri={
  	lv:((require("Storage").readJSON("setting.json",1)||{}).bri)?(require("Storage").readJSON("setting.json",1)||{}).bri:3,
	set:function(o){	
//      print(o);
	if (o) this.lv=o; else { this.lv++; if (this.lv>7) this.lv=1; o=this.lv; }
	digitalWrite([D23,D22,D14],7-o);
    set.def.bri=o;
	return o;
	}
};

g.isOn=false;
init();

g.on=function(){
  if (this.isOn) return;
  cmd(0x11);
//  g.flip();
  //cmd(0x13); //ST7735_NORON: Set Normal display on, no args, w/delay: 10 ms delay
  //cmd(0x29); //ST7735_DISPON: Set Main screen turn on, no args w/delay: 100 ms delay
  this.bri.set(this.bri.lv);
  this.isOn=true;
//  this.setBrightness();
};


g.off=function(){
  if (!this.isOn) return;
  //cmd(0x28);
  cmd(0x10);
  digitalWrite([D23,D22,D14],7);
//  BL.set();
  this.isOn=false;
};

//battery
const batt=function(i,c){
	let v= 7.1*analogRead(D31);
	let l=3.5,h=4.19;
    let hexString = ("0x"+(0x50000700+(D31*4)).toString(16));
	poke32(hexString,2); // disconnect pin for power saving, otherwise it draws 70uA more 	
	if (i==="info"){
		if (c) return ((100*(v-l)/(h-l)|0)+'%-'+v.toFixed(2)+'V'); 
		return (((v<=l)?0:(h<=v)?100:((v-l)/(h-l)*100|0))+'%-'+v.toFixed(2)+'V'); 
	}else if (i) { 
		if (c) return (100*(v-l)/(h-l)|0);
		return ( (v<=l)?0:(h<=v)?100:((v-l)/(h-l)*100|0) );
	}else return +v.toFixed(2);
};
const battVoltage=function(s){
	let v=7.1*analogRead(D31);
	if (s) { v=(v*100-340)*1.33|0; //if (v>=100) v=100;
	}
    let hexString = ("0x"+(0x50000700+(D31*4)).toString(16));
	poke32(hexString,2); // disconnect pin for power saving, otherwise it draws 70uA more 
	return v;
};
module.exports = {
	batt: batt,
	battVoltage: battVoltage,
	gfx: g
};
});
w=require("eucWatch");
//load
//w.gfx.init();
require("Storage").write("colmode16","done");
eval(require('Storage').read('handler'));
eval(require('Storage').read('main'));
eval(require('Storage').read('euc'));

//require('Storage').list(/m_/).forEach(modfile=>{eval(require('Storage').read(modfile));});
digitalPulse(ew.pin.BUZZ,1,[100,30,100]);
setTimeout(function(){
if (global.face) face.go('main',0);
setTimeout(function(){ if (global.set) set.accR(); },1000); 
digitalPulse(ew.pin.BUZZ,1,[100]);  
},200); 
}
