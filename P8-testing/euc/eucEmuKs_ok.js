//NRF.setConnectionInterval({minInterval:100, maxInterval:200});
//atc
//if (euc.state!=="READY") return;
euc.emuR=function(evt){
	//handleInfoEvent({"src":"BT","title":"EUC","body":"Phone write"});

	if (set.bt!=4) {
		if (evt.data==[170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 155, 20, 90, 90]){
			set.bt=4;
			handleInfoEvent({"src":"BT","title":"EUC","body":"Phone connected"});
			euc.emuW([0xAA,0x55,0x0f,0x20,0X00,0x00,0x04,0x00,0x3B,0xB4,0x08,0x00,0xa4,0x06,0x02,0xe0,0xa9,0x14,0x5A,0x5A]);
			//setTimeout(()=>{euc.emuU();},1000);
		}
    }
  //var ll=0; require("Storage").write("evt"+ll,evt); ll++;
  //global.srt=String.fromCharCode.apply(String,evt.data);  
  //euc.emuW[0xAA,0x55,0x0f,0x20,euc.dash.spd*100,0x00,0x04,0x00,0x3B,0xB4,0x08,0x00,0xa4,0x06,0x02,0xe0,0xa9,0x14,0x5A,0x5A]; //rf 4C
//	euc.emuW([0xAA,0x55,0x0f,0x20,0X00,0x00,0x04,0x00,0x3B,0xB4,0x08,0x00,0xa4,0x06,0x02,0xe0,0xa9,0x14,0x5A,0x5A]);
  
};
//NRF.setServices(undefined,{uart:false });
//
NRF.setServices({
0x180A-0000-1000-8000-00805f9b34fb": {
		0x2a23-0000-1000-8000-00805f9b34fb": {
			value : [0x4d,0x89,0x75,0x00,0x00,0x4e,0x69,0x64],
			maxLen : 20,
			readable:true
		},0x2a24-0000-1000-8000-00805f9b34fb": {
			value : "Model Number",
			maxLen : 20,
		  readable:true
		},0x2a25-0000-1000-8000-00805f9b34fb": {
			value : "Serial Number",
			maxLen : 20,
		  readable:true
		},0x2a26-0000-1000-8000-00805f9b34fb": {
			value : "Firmware Revision",
			maxLen : 20,
			readable:true
		},0x2a27-0000-1000-8000-00805f9b34fb": {
			value : "Firmware Revision",
			maxLen : 20,
			readable:true,
		},0x2a28-0000-1000-8000-00805f9b34fb": {
			value : "Software Revision",
			maxLen : 20,
			readable:true
		},0x2a29-0000-1000-8000-00805f9b34fb": {
			value : "Manufacturer Name",
			maxLen : 20,
			readable:true
		},0x2a2a-0000-1000-8000-00805f9b34fb": {
			value : [0xfe,0x00,0x65,0x78,0x70,0x65,0x72,0x69,0x6d,0x65,0x6e,0x74,0x61,0x6c],
			maxLen : 20,
			readable:true
		},0x2a50-0000-1000-8000-00805f9b34fb": {
			value : 0x00D",
			maxLen : 20,
			readable:true
		}
	},
	0xfff0-0000-1000-8000-00805f9b34fb": {
		0xfff1-0000-1000-8000-00805f9b34fb": {
			value : [0x01],
			maxLen : 20,
			writable : true,
			readable:true,
			onWrite : function(evt) {
			  euc.emuR(evt);
			},
            description:"Characteristic 1"
		},0xfff2-0000-1000-8000-00805f9b34fb": {
			value : [0x02],
			maxLen : 20,
		    onWrite : function(evt) {
			  euc.emuR(evt);
			},
			readable:true,
            description:"Characteristic 2"
		},0xfff3-0000-1000-8000-00805f9b34fb": {
			writable : true,
			onWrite : function(evt) {
				euc.emuR(evt);
			},
            description:"Characteristic 3"
		},0xfff4-0000-1000-8000-00805f9b34fb": {
			notify:true,
            description:"Characteristic 4"
		},0xfff5-0000-1000-8000-00805f9b34fb": {
			value : [0x01,0x02,0x03,0x04,0x05],
			maxLen : 20,
            writable:true,
			onWrite : function(evt) {
				euc.emuR(evt);
			},
			readable:true,
			notify:true,
            description:"Characteristic 5"
		}
	},0xffe0-0000-1000-8000-00805f9b34fb": {
		0xffe1-0000-1000-8000-00805f9b34fb": {
			value : [0x00],
			maxLen : 20,
            writable:true,
			onWrite : function(evt) {
				euc.emuR(evt);
			},
   			readable:true,
  			notify:true,
           description:"Key Press State"
		}
  }
},{uart:false });

euc.emuW= function(o) {
	NRF.updateServices({
		0xffe0: {
			0xffe1: {
				value : o,
				notify:true
			}
		},
	});
};




NRF.setAdvertising([[
0x02,0x01,0x06,
0x03,0x02,0xf0,0xff,
0x05,0x12,0x60,0x00,0x0c,0x00,
0x07,0xFF,0x48,0x43,0x2D,0x30,0x38,0x00,
 ]],{ name:set.def.name});


