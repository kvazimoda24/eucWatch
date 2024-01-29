//Inmotion V11 module- code based on freestyl3r'work
E.setFlags({ pretokenise: 1 });
/*
	//info type:
	NoOp(0),
	Version=1,
	info=2,
	Diagnostic=3,
	live=4,
	bms=5,
	Something1=16,
	stats=17,
	Settings=32,
	control=96;
*/
euc.cmd=function(no,val){
	let cmd;
	euc.temp.last=no;
	switch (no) {
		case "live": return           [0xAA, 0xAA, 0x14, 0x01, 0x04, 0x11];
		//case "stats": return          [0xAA, 0xAA, 0x14, 0x01, 0x11, 0x11];
		case "stats": return          [0xAA, 0xAA, 0x14, 0x01, 0x11, 0x04];
		case "drlOn": return          [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x2D, 0x01, 0x5B];
		case "drlOff": return         [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x2D, 0x00, 0x5A];
		//case "lightsOn": return       [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x40, 0x01, 0x36];
		case "lightsOn": return       [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x50, 0x01, 0x26];
		//case "lightsOff": return      [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x40, 0x00, 0x37];
		case "lightsOff": return      [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x50, 0x00, 0x27];
		case "fanOn": return          [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x43, 0x01, 0x35];
		case "fanOff": return         [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x43, 0x00, 0x34];
		case "fanQuietOn": return     [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x38, 0x01, 0x4E];
		case "fanQuietOff": return    [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x38, 0x00, 0x4F];
		case "liftOn": return         [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x2E, 0x01, 0x58];
		case "liftOff": return        [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x2E, 0x00, 0x59];
		case "lock": return           [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x31, 0x01, 0x47];
		case "unlock": return         [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x31, 0x00, 0x46];
		case "transportOn": return    [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x32, 0x01, 0x44];
		case "transportOff": return   [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x32, 0x00, 0x45];
		case "rideComfort": return    [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x23, 0x00, 0x54];
		case "rideSport": return      [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x23, 0x01, 0x55];
		case "performanceOn": return  [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x24, 0x01, 0x52];
		case "performanceOff": return [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x24, 0x00, 0x53];
		case "remainderReal": return  [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x3D, 0x01, 0x4B];
		case "remainderEst": return   [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x3D, 0x00, 0x4A];
		case "lowBatLimitOn": return  [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x37, 0x01, 0x41];
		case "lowBatLimitOff": return [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x37, 0x00, 0x40];
		case "usbOn": return          [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x3C, 0x01, 0x4A];
		case "usbOff": return         [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x3C, 0x00, 0x4B];
		case "loadDetectOn": return   [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x36, 0x01, 0x40];
		case "loadDetectOff": return  [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x36, 0x00, 0x41];
		case "mute": return           [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x2C, 0x00, 0x5B];
		case "unmute": return         [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x2C, 0x01, 0x5A];
		case "calibration": return    [0xAA, 0xAA, 0x14, 0x05, 0x60, 0x42, 0x01, 0x00, 0x01, 0x33];
		case "speedLimit":
			cmd = [0xAA, 0xAA, 0x14, 0x04, 0x60, 0x21];
			cmd.push((val * 100) & 0xFF);
			cmd.push(((val * 100) >> 8) & 0xFF);
			cmd.push(cmd.reduce(checksum));
			return cmd;
		case "pedalTilt":
			cmd = [0xAA, 0xAA, 0x14, 0x04, 0x60, 0x22];
			cmd.push((val * 100) & 0xFF);
			cmd.push(((val * 100) >> 8) & 0xFF);
			cmd.push(cmd.reduce(checksum));
			return cmd;
		case "pedalSensitivity":
			cmd = [0xAA, 0xAA, 0x14, 0x04, 0x60, 0x25, val, 0x64];
			cmd.push(cmd.reduce(checksum));
			return cmd;
		case "setBrightness":
			cmd = [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x2B, val];
			cmd.push(cmd.reduce(checksum));
			return cmd;
		case "setVolume":
			cmd = [0xAA, 0xAA, 0x14, 0x03, 0x60, 0x26, val];
			cmd.push(cmd.reduce(checksum));
			return cmd;
		case "playSound":
			cmd = [0xAA, 0xAA, 0x14, 0x04, 0x60, 0x51, val, 0x01];
			//cmd = [0xAA, 0xAA, 0x14, 0x04, 0x60, 0x41, val, 0x01];
			//cmd = [0xAA, 0xAA, 0x14, 0x03, 0xE0, 0x51, 0x00]; // horn on v11 new firmware 1.4.0 (this is a mistake most probably)
			cmd.push(cmd.reduce(checksum));
			return cmd;
	}
};
//
function checksum(check, val) {
	return (check ^ val) & 0xFF;
}
//
function validateChecksum(buffer) {
	receivedChecksum = buffer[buffer.length - 1];
	array = new Uint8Array(buffer, 0, buffer.length - 1);
	calculatedChecksum = array.reduce(checksum);
	//if (ew.is.bt===2) print("calculated checksum: ", calculatedChecksum);
	//if (ew.is.bt===2) print("message   checksum: ", receivedChecksum);
	return receivedChecksum == calculatedChecksum;
}
//
euc.temp.liveParse = function (inc){
  let lala = new DataView(inc);
  //volt
  euc.dash.live.volt=lala.getUint16(5, true)/100;
  //batt
  euc.dash.live.bat=Math.round(100*(euc.dash.live.volt*(100/euc.dash.opt.bat.pack) - euc.dash.opt.bat.low ) / (euc.dash.opt.bat.hi-euc.dash.opt.bat.low) );
  euc.log.batL.unshift(euc.dash.live.bat);
  if (20<euc.log.batL.length) euc.log.batL.pop();
  euc.dash.alrt.bat.cc = (50 <= euc.dash.live.bat)? 0 : (euc.dash.live.bat <= euc.dash.alrt.bat.hapt.low)? 2 : 1;
  //amp
  euc.dash.live.amp=lala.getInt16(7, true) / 100;
  //speed
  //euc.dash.live.spd=Math.round((event.target.value.getInt16(9, true) / 100)*euc.dash.opt.unit.fact.spd*((ew.def.dash.mph)?0.625:1));
  euc.dash.live.spd=lala.getInt16(9, true) / 100;
  if (euc.dash.live.spd<0) euc.dash.live.spd=-euc.dash.live.spd;
  if (euc.dash.trip.topS < euc.dash.live.spd) euc.dash.trip.topS = euc.dash.live.spd;
  euc.dash.alrt.spd.cc = ( euc.dash.alrt.spd.hapt.hi <= euc.dash.live.spd )? 2 : ( euc.dash.alrt.spd.hapt.low <= euc.dash.live.spd )? 1 : 0 ;
  if ( euc.dash.alrt.spd.hapt.en && euc.dash.alrt.spd.cc == 2 )
    euc.is.alert = 1 + Math.round((euc.dash.live.spd-euc.dash.alrt.spd.hapt.hi) / euc.dash.alrt.spd.hapt.step) ;
  if ( euc.dash.alrt.bat.hapt.en && euc.dash.alrt.bat.cc ==2 )  euc.is.alert ++;
  // PWM
  euc.dash.live.pwm=lala.getInt16(13, true)/100
  if (euc.dash.trip.pwm < euc.dash.live.pwm) euc.dash.trip.pwm = euc.dash.live.pwm;
  //trip
//  euc.dash.trip.last=lala.getUint16(17, true)/100;
//  euc.dash.trip.left=(lala.getUint16(19, true))*10; //remain
  euc.dash.trip.last=lala.getUint16(31, true)/100;
  euc.dash.trip.left=lala.getUint16(35, true)/100; //remain
  //temp
  // was euc.dash.live.tmp=(event.target.value.buffer[22] & 0xff) + 80 - 256;
  // mosfet temp
  euc.dash.live.tmp=(lala.getUint8(47) & 0xFF) + 80 - 256;
  euc.dash.alrt.tmp.cc=(euc.dash.alrt.tmp.hapt.hi - 5 <= euc.dash.live.tmp )? (euc.dash.alrt.tmp.hapt.hi <= euc.dash.live.tmp )?2:1:0;
  if (euc.dash.alrt.tmp.hapt.en && euc.dash.alrt.tmp.cc==2) euc.is.alert++;
  // battery temp
  euc.dash.live.tmp2=(lala.getUint8(49) & 0xFF) + 80 - 256;
  //log
  euc.log.ampL.unshift(Math.round(euc.dash.live.amp));
  if (20<euc.log.ampL.length) euc.log.ampL.pop();
  euc.dash.alrt.amp.cc = ( euc.dash.alrt.amp.hapt.hi <= euc.dash.live.amp || euc.dash.live.amp <= euc.dash.alrt.amp.hapt.low )? 2 : ( euc.dash.live.amp  <= -0.5 || 15 <= euc.dash.live.amp)? 1 : 0;
  if (euc.dash.alrt.amp.hapt.en && euc.dash.alrt.amp.cc==2) {
    if (euc.dash.alrt.amp.hapt.hi<=euc.dash.live.amp)	euc.is.alert =  euc.is.alert + 1 + Math.round( (euc.dash.live.amp - euc.dash.alrt.amp.hapt.hi) / euc.dash.alrt.amp.hapt.step) ;
    else euc.is.alert =  euc.is.alert + 1 + Math.round(-(euc.dash.live.amp - euc.dash.alrt.amp.hapt.low) / euc.dash.alrt.amp.hapt.step) ;
  }
}
//
euc.temp.statsParse = function (inc){
  let lala = new DataView(inc);
  if (1<euc.dbg===2) print("EUC module, this is a stats packet:",event.target.value.buffer);
  //trip total
  euc.dash.trip.totl=lala.getUint32(5, true)/100;
    euc.log.trip.forEach(function(val,pos){ if (!val) euc.log.trip[pos]=euc.dash.trip.totl;});
  //time
  euc.dash.trip.time=(lala.getUint32(17, true)/60)|0;
  euc.dash.timR=(lala.getUint32(21, true)/60)|0;
  //deb
  if (2<euc.dbg) print("trip total :", euc.dash.trip.totl);
  if (2<euc.dbg) print("on time :", euc.dash.trip.time);
  if (2<euc.dbg) print("ride time :", euc.dash.timR);
}
//
euc.temp.inpk = function(event) {
  if (3<euc.dbg) print("responce packet: ", event.target.value.buffer);
  if (ew.is.bt===5) euc.proxy.w(event.target.value.buffer);
  if (euc.is.busy) return;
  if ( !validateChecksum(event.target.value.buffer) ) {
    if (ew.is.bt===2) print ("Fail checksum, packet dropped: ", event.target.value.buffer);
    return;
  }
  if ( event.target.value.buffer[4] & 0x7F == 0x11 ) {
    euc.temp.statsParse(event.target.value.buffer);
    return;
  }
  // masked out temp 031222
  // was event.target.value.buffer[3] != 51
  // some packets larger than 74 have valid checksum but drop them for now...
  if (event.target.value.buffer[4] & 0x7F == 0x04) {
    euc.temp.liveParse(event.target.value.buffer);
  }
  //print ("packet: ",event.target.value.buffer);
  euc.is.alert=0;
  //alarm
  // was euc.dash.alrt.pwr=event.target.value.buffer[52];
  euc.dash.alrt.pwr=0;
  //log
  euc.log.almL.unshift(euc.dash.alrt.pwr);
  if (20<euc.log.almL.length) euc.log.almL.pop();
  //haptic
  if (euc.dash.alrt.pwr) euc.is.alert=20;
  //average
  //euc.dash.trip.avrS=(event.target.value.getUint16(17, true))/100;
  //euc.dash.trip.topS=(event.target.value.getUint16(19, true))/100;
  //haptic
  //euc.new=1;
  if (!euc.is.buzz && euc.is.alert) {
    if (!w.gfx.isOn&&(euc.dash.alrt.spd.cc||euc.dash.alrt.amp.cc||euc.dash.alrt.pwr)) face.go(ew.is.dash[ew.def.dash.face],0);
    //else face.off(6000);
    euc.is.buzz=1;
    if (20 <= euc.is.alert) euc.is.alert = 20;
    var a = [100];
    while (5 <= euc.is.alert) {
      a.push(200,500);
      euc.is.alert = euc.is.alert - 5;
    }
    let i;
    for (i = 0; i < euc.is.alert ; i++) {
      a.push(200,150);
    }
    buzzer.euc(a);
    setTimeout(() => { euc.is.buzz = 0; }, 3000);
  }
}

euc.isProxy=0;
euc.wri=function(i) {if (ew.is.bt===2) console.log("not connected yet"); if (i=="end") euc.off(); return;};
euc.conn=function(mac){
	if (euc.gatt && euc.gatt.connected) {
		return euc.gatt.disconnect();
	}
	//check if proxy
	if (mac.includes("private-resolvable")&&!euc.isProxy ){
		let name=require("Storage").readJSON("dash.json",1)["slot"+require("Storage").readJSON("dash.json",1).slot+"Name"];
		NRF.requestDevice({ timeout:2000, filters: [{ namePrefix: name }] }).then(function(device) { euc.isProxy=1;euc.conn(device.id);}  ).catch(function(err) {print ("error "+err);euc.conn(euc.mac); });
		return;
	}
	euc.isProxy=0;
	if (euc.tout.reconnect) {clearTimeout(euc.tout.reconnect); euc.tout.reconnect=0;}
	NRF.connect(mac,{minInterval:7.5, maxInterval:15})
		.then(function(g) {
			euc.gatt=g;
			return g.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
		}).then(function(s) {
			euc.temp.serv=s;
			return euc.temp.serv.getCharacteristic("6e400002-b5a3-f393-e0a9-e50e24dcca9e"); // write
		}).then(function(wc) {
			euc.temp.wCha=wc;//write
			print("write packet: ", wc);
			return euc.temp.serv.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e");//read
		}).then(function(rc) {
			euc.temp.rCha=rc;
			//read
			euc.temp.rCha.on('characteristicvaluechanged', euc.temp.inpk);
			//on disconnect
			euc.gatt.device.on('gattserverdisconnected', euc.off);
			return  rc;
		}).then(function(c) {
			//connected
			if (ew.is.bt===2) console.log("EUC: Connected");
			euc.state="READY"; //connected
			buzzer.nav([90,40,150,40,90]);
			euc.dash.opt.lock.en=0;
			//write function
			euc.wri=function(cmd,value){
				if (euc.state==="OFF"||cmd==="end") {
					euc.is.busy=1;
					if (euc.tout.loop) {clearTimeout(euc.tout.loop); euc.tout.loop=0;}
					if (euc.gatt && euc.gatt.connected) {
						euc.tout.loop=setTimeout(function(){
							euc.tout.loop=0;
							if (euc.gatt && !euc.gatt.connected)  {euc.off("not connected");return;}
							euc.temp.wCha.writeValue(euc.cmd("lightsOff")).then(function() {
								euc.gatt.disconnect();
							}).catch(euc.off);
						},500);
					}else {
						euc.state="OFF";
						euc.off("not connected");
						euc.is.busy=0;euc.is.horn=0;
						return;
					}
				}else if (cmd==="start") {
					euc.is.busy=0;
					euc.temp.wCha.writeValue(euc.cmd((euc.dash.opt.lght.HL)?"lightsOn":"lightsOff")).then(function() {
						euc.temp.rCha.startNotifications();
						if (euc.tout.loop) {clearTimeout(euc.tout.loop); euc.tout.loop=0;}
						euc.tout.loop=setTimeout(function(){
							euc.tout.loop=0;
							euc.is.busy=0;
							euc.is.run=1;
							euc.wri("live");
						},300);
					}).catch(euc.off);
				}else if (cmd==="hornOn") {
					if (euc.is.horn) return;
					euc.is.busy=1;euc.is.horn=1;
					if (euc.tout.loop) {clearTimeout(euc.tout.loop); euc.tout.loop=0;}
					euc.tout.loop=setTimeout(function(){
						euc.temp.wCha.writeValue(euc.cmd("playSound",euc.dash.opt.horn.mode)).then(function() {
							euc.is.horn=0;euc.tout.loop=0;
							euc.tout.loop=setTimeout(function(){
								euc.tout.loop=0;
								euc.is.busy=0;
								euc.is.horn=0;
								euc.wri("live");
							},250);
						});
					},350);
				}else if (cmd==="hornOff") {
					euc.is.horn=0;
				} else if (cmd==="proxy") {
					//if (euc.is.busy) return;
					euc.temp.wCha.writeValue(value).then(function() {
						if (euc.is.busy) return;
						if (euc.tout.loop) {clearTimeout(euc.tout.loop); euc.tout.loop=0;}
						euc.tout.loop=setTimeout(function(){
								euc.tout.loop=0;
								euc.wri("live");
						},300);
					}).catch(euc.off);
				} else {
					//if (euc.is.busy) return;
					euc.temp.wCha.writeValue(euc.cmd(cmd,value)).then(function() {
						if (euc.is.busy) return;
						if (euc.tout.loop) {clearTimeout(euc.tout.loop); euc.tout.loop=0;}
						euc.tout.loop=setTimeout(function(){
								euc.tout.loop=0;
								euc.wri("live");
						},125);
					}).catch(euc.off);
				}
			};
			if (!ew.do.fileRead("dash","slot"+ew.do.fileRead("dash","slot")+"Mac")) {
				euc.dash.info.get.mac=euc.mac; euc.dash.opt.bat.hi=420;
				euc.updateDash(require("Storage").readJSON("dash.json",1).slot);
				ew.do.fileWrite("dash","slot"+ew.do.fileRead("dash","slot")+"Mac",euc.mac);
			}
			setTimeout(() => {euc.wri("start");}, 200);
		//reconnect
		}).catch(euc.off);
};
