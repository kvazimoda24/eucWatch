//settings 
ew.is={
	bt:0, //Incomming BT service status indicator- Not user settable.0=not_connected|1=unknown|2=webide|3=gadgetbridge|4=eucemu|5=esp32
	tor:0, //Enables/disables torch- Not user settable.
	ondc:0, //charging indicator-not user settable.
	btsl:0, //bt sleep status-not user settable.
	gIsB:0,//gat status-n.u.s- 0=not busy|1=busy 
	fmp:0, //find my phone-n.u.s.
	boot:getTime(), 
	dash:[],
	hidM:undefined, //not user settable.
	clin:0,//not settable
};
ew.do.update.acc=function(){if(!ew.def.dash.accE) { if (ew.def.acc)acc.on(); else acc.off();}};
ew.do.update.settings=function(){require('Storage').write('setting.json', ew.def);};
ew.do.reset.settings=function() {
ew.def = {"off":{"main":5000},"dash":{"tot":"0","mph":0,"amp":0,"bat":0,"batS":0,"face":0,"accE":0,"clck":0,"clkS":0,"farn":0,"rtr":5},
	"name":"eucWatch_v2","touchtype":"0","acctype":"0","hr24":1,"emuZ":0,"timezone":"0","woe":1,"wob":1,"rfTX":-4,"cli":1,"hid":0,"gb":0,"atc":0,"acc":0,"hidT":"media","bri":2,"buzz":1,"bpp":4,"info":1,"txt":1};
	ew.do.update.settings();
};	
ew.do.update.bluetooth=function(){ 
	if (ew.def.hid===1) {ew.def.hid=0; return;}
	NRF.setServices(undefined,{uart:(ew.def.cli||ew.def.gb)?true:false,hid:(ew.def.hid&&ew.is.hidM)?ew.is.hidM.report:undefined });
	if (ew.def.gb) 
		eval(require('Storage').read('m_gb'));
	else {
		ew.gbSend=function(){return;};
		//set.handleNotificationEvent=0;set.handleFindEvent=0;handleWeatherEvent=0;handleCallEvent=0;handleFindEvent=0;sendBattery=0;global.GB=0;
	}		
	if (!ew.def.cli&&!ew.def.gb&&!ew.def.emuZ&&!ew.def.hid) { if (ew.is.bt) NRF.disconnect(); else{ NRF.sleep();ew.is.btsl=1;}}
	else if (ew.is.bt) NRF.disconnect();
	else if (ew.is.btsl==1) {NRF.restart();ew.is.btsl=0;}
};
ew.do.fileRead=function(file,name){
	let got=require("Storage").readJSON([file+".json"],1);
	if (got==undefined) return false;
	if (name || name==0) {
		if (require("Storage").readJSON([file+".json"],1)[name])
		return require("Storage").readJSON([file+".json"],1)[name];
		else return false;
	}else return require("Storage").readJSON([file+".json"],1);
};
ew.do.fileWrite=function(file,name,value,value2,value3){
	let got=require("Storage").readJSON([file+".json"],1);
	if (got==undefined) got={};
	if (!value&&value!=0)  delete got[name]; //delete
	else {
		if ((value2||value2==0 )&& got[name] ) 
			if (value3 || value3==0) got[name][value][value2]=value3;
			else got[name][value]=value2;
		else 
			got[name]=value;
	}
	require("Storage").writeJSON([file+".json"],got);
	return true;
};
ew.do.setGattState=function(){
	if (ew.is.gIsB) {
		ew.is.gIsB=2;
		if (global["\xFF"].BLE_GATTS) {
			if (global["\xFF"].BLE_GATTS.connected)
			global["\xFF"].BLE_GATTS.disconnect().then(function (c){ew.is.gIsB=0;});
		}else gIsB=0;
	 }
};
//defaults
ew.def = require('Storage').readJSON('setting.json', 1);
if (!ew.def) ew.do.reset.settings();
if (!ew.def.rstP) ew.def.rstP=E.toJS(ew.pin.touch.RST);
if (!ew.def.rstR) ew.def.rstR=0xA5;
if (!ew.def.addr) ew.def.addr=NRF.getAddress();
if (!ew.def.off) ew.def.off={};
//
//buzzzer
if (ew.def.buzz) buzzer = digitalPulse.bind(null,ew.pin.BUZZ,ew.pin.BUZ0);
else buzzer=function(){return true;};
buz={ok:[20,40,20],na:25,ln:80,on:40,off:[20,25,20]};
buzz = digitalPulse.bind(null,ew.pin.BUZZ,ew.pin.BUZ0);
//dash
require('Storage').list("dash_").forEach(dashfile=>{
	ew.is.dash.push(dashfile);
});
if (!Boolean(require("Storage").read("dash.json"))) { 
	let dash={slot:1};
	require('Storage').write('dash.json', dash);
}
//rest
E.setTimeZone(ew.def.timezone);





