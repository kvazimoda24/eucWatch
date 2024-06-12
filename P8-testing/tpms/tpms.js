//tpms sensor support
//create settings json
if (!require("Storage").read("tpms.json",1) || ( require("Storage").read("tpms.json",1) && require("Storage").readJSON("tpms.json",1).ver!=7) ) {
  let def={"ver":7};
  def.dev={};
  def.def={
    wait:60,
    try:0,
    int:0,
    ref:0,
    pos:0,
    metric:"psi",
    list:{},
    allowNew:1
  };
  require("Storage").writeJSON("tpms.json",def);
}
//tpms module
tpms= {
  euc:{},
  busy:0,
  new:0,
  status:"IDLE",
  scan:()=>{
    if (tpms.busy) return;
    tpms.busy=1;
    tpms.new=0;
    tpms.try=tpms.def.try;
    tpms.cnt=getTime()|0;
    tpms.status="SCANNING";
    if (tpms.tid) {clearTimeout(tpms.tid); tpms.tid=0;}
    tpms.find();
  },
  type_fbb0:(device)=>{
    let mac=device.id.split(" ")[0].split(":");
    if (mac[1]+mac[2] != "eaca") return;
    if (typeof device.manufacturerData == 'undefined' || device.manufacturerData.length < 16) return;
    let id=mac[3]+mac[4]+mac[5];
    let time=getTime()|0;
    let alrm=0;
    let dev={};
    let d = new DataView(device.manufacturerData);
    let kpa=d.getUint32(6,true)/1000;
    dev={
      "id":id,
      "pos":mac[0][1],
      "kpa":kpa.toFixed(2),
      "bar":(kpa/100).toFixed(2),
      "psi":(kpa*0.1450377377).toFixed(2),
      "temp":(d.getInt32(10,true)/100).toFixed(2),
      "batt":d.getUint8(14),
      "alrm":device.manufacturerData[15],
      "time":time,
    };
    return dev;
  },
  type_27a5:(device)=>{
    let mac=device.id.split(" ")[0].split(":");
    if (mac[0]+mac[2]+mac[3] != "d80000") return;
    let id=mac[1]+mac[4]+mac[5];
    let time=getTime()|0;
    let alrm=0;
    let dev={};
    let d = new DataView(device.data);
    let psi = (d.getUint16(13)-145)/10;
    dev={
      "id":id,
      "pos":mac[1][0],
      "psi":psi.toFixed(1),
      "kpa":(psi/0.1450377377).toFixed(1),
      "bar":(psi/14.50377377).toFixed(2),
      "temp":(d.getInt8(12)).toFixed(1),
      "volt":(d.getInt8(11)/10).toFixed(1),
      "batt":(((d.getInt8(11)-20)*100)/13).toFixed(0),
      "alrm":(device.data[10]&0x80)>>7,
      "time":time,
    };
    return dev;
  },
  find:(rp,sl)=>{
    let parseFunc;
    let serviceLst = ["fbb0", "27a5"];
    NRF.findDevices(function(devices) {
      serviceLst.forEach(function(service) {
        switch(service) {
          case "fbb0":
            parseFunc=tpms.type_fbb0;
            break;
          case "27a5":
            parseFunc=tpms.type_27a5;
            break;
        }
        //let parseFunc = new Function("device", "return tpms.type_" + service + "(device)");
        devicesFilter = NRF.filterDevices(devices, [{services:[ service ]}] );
        devicesFilter.forEach(function(device) {
          if (ew.is.bt===2 && tpms.dbg == 1) console.log(device);
          if (device == [ ] || !device.id ) return;
          let dev = parseFunc(device);
          if (!dev) return;
          if (!tpms.def.allowNew && !tpms.def.list[dev.id]) return;
          if (!tpms.def.list[dev.id]) {
            tpms.def.list[dev.id]={"hiP":50,"lowP":10};
            let got=require("Storage").readJSON("tpms.json",1);
            got.def=tpms.def;
            require("Storage").writeJSON("tpms.json",got);
            got=0;
          }
          tpms.def.ref=0;
          device=[ ];
          tpms.new++;
          if (dev.psi<tpms.def.list[dev.id].lowP) {
            alrm=1;
            if (euc.state=="READY") euc.dash.alrt.warn.txt="LOW PRESSURE";
            handleInfoEvent({"src":"TPMS","title":id,"body":"LOW PRESSURE."+"  "+dev[tpms.def.metric]+" "+tpms.def.metric+"  "},1);
          } else if (tpms.def.list[dev.id].hiP <=dev.psi) {
            alrm=2;
            if (euc.state=="READY") euc.dash.alrt.warn.txt="HI PRESSURE";
            handleInfoEvent({"src":"TPMS","title":dev.id,"body":"HI PRESSURE."+"  "+dev[tpms.def.metric]+" "+tpms.def.metric+"  "},1);
          } else alrm=0;
          if (euc.state!="OFF") tpms.euc[dev.id]={"time":dev.time,"alrm":dev.alrm,"psi":dev.psi};
          let log=(require("Storage").readJSON("tpmsLog"+dev.id+".json",1))?require("Storage").readJSON("tpmsLog"+dev.id+".json",1):[];
          log.unshift(dev);
          if (10<log.length) log.pop();
          require("Storage").writeJSON("tpmsLog"+dev.id+".json",log);
          log=0;
          tpms.def.id=dev.id;
          dev=0;
        });
      });
      devices=[ ];
      if (!tpms.new) {
        if (tpms.try) {
          tpms.cnt=getTime()|0;
          tpms.try--;
          tpms.status="RETRY ("+(tpms.try+1)+")";
          tpms.find();
          return;
        } else {
          tpms.busy=0;
          tpms.status="NOT FOUND";
        }
      } else {
        tpms.status="SUCCESS";
        tpms.busy=0;
      }
      if (tpms.def.int||euc.state!="OFF") {
        let intT=[2,5,30,60,360];
        if (tpms.tid) clearTimeout(tpms.tid);
        tpms.tid=setTimeout(()=>{
          tpms.tid=0;
          tpms.scan();
        },intT[tpms.def.int]*60000);
      }
    }, {timeout : tpms.def.wait*1000 });
  }
};
//run
tpms.def=require("Storage").readJSON("tpms.json",1).def;
if (tpms.def.int) tpms.scan();
