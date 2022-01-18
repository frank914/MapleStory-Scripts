/* 
Writing by Xiang  Line Frank914a
尊重作者請勿販賣 尊重作者請勿販賣 尊重作者請勿販賣
*/
var log = "賭博娛樂_妞妞";
var setupTask, setupTask2;
var nextTime, nextTime2;
// 每次間隔
var interval =  5*60*1000;
var Computer =["無妞",0];
var ComputerH =Array();
var ComputerP =Array();
var 外掛系統 =[true,5,2]; // true =開啟 小於幾點重骰 能骰幾次
var Name = Array(
"黑桃A","黑桃2","黑桃3","黑桃4","黑桃5","黑桃6","黑桃7","黑桃8","黑桃9","黑桃10","黑桃J","黑桃Q","黑桃K",
"紅心A","紅心2","紅心3","紅心4","紅心5","紅心6","紅心7","紅心8","紅心9","紅心10","紅心J","紅心Q","紅心K",
"方塊A","方塊2","方塊3","方塊4","方塊5","方塊6","方塊7","方塊8","方塊9","方塊10","方塊J","方塊Q","方塊K",
"梅花A","梅花2","梅花3","梅花4","梅花5","梅花6","梅花7","梅花8","梅花9","梅花10","梅花J","梅花Q","梅花K");
var Point = Array(
1,2,3,4,5,6,7,8,9,10,100,100,100,
1,2,3,4,5,6,7,8,9,10,100,100,100,
1,2,3,4,5,6,7,8,9,10,100,100,100,
1,2,3,4,5,6,7,8,9,10,100,100,100);
var PointVector = [
["無妞",0], 
["一點",1], 
["二點",2], 
["三點",3], 
["四點",4], 
["五點",5], 
["六點",6], 
["七點",7], 
["八點",8], 
["九點",9], 
["妞妞",10], 
["黑龍",11]
];
var map;
var 地圖限制 = [true,1,910000000]; // [是否限制,頻道,地圖代碼]
function init() { // 開服時觸發
	if ( 地圖限制[0] ) {
		if (em.getChannel() == 地圖限制[1]) {
			map = em.getChannelServer().getMapFactory().getMap(地圖限制[2]);
			if ( map == null ) {
				return;
			}
		} else {
			return;
		}
    } else if (em.getChannel() != 1) {
        return;
    }
	em.executeSQL("DELETE FROM `characters_log` WHERE `key` like ?", "賭博娛樂%");
	em.logFile("妞妞/莊家最新開牌紀錄.txt", "---------------刷新---------------",false);
    var cal = java.util.Calendar.getInstance();
    var cal2 = java.util.Calendar.getInstance();
    //時間設定成0點
    cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
    cal.set(java.util.Calendar.MINUTE, 0);
    cal.set(java.util.Calendar.SECOND, 0);
    nextTime = cal.getTimeInMillis();

    //時間設定成0點5分
    cal2.set(java.util.Calendar.HOUR_OF_DAY, 0); // 開獎廣播時間
    cal2.set(java.util.Calendar.MINUTE, 5);
    cal2.set(java.util.Calendar.SECOND, 0);
    nextTime2 = cal2.getTimeInMillis();

    // 以凌晨0點為基礎, 再+5分鐘
    while (nextTime <= em.getCurrentTime()) {
        nextTime += interval;
    }
    // 以凌晨0點為基礎, 再+5分鐘
    while (nextTime2 <= em.getCurrentTime()) {
        nextTime2 += interval;
    }
	getBrand(-5);
    var tmpMsg = "";
	初始化();
	for ( var i = 0; i < ComputerP.length ; i++ ){
		ComputerP[i] = parseInt(ComputerP[i]);
	}
	Judgebrand(Computer,ComputerP);
	tmpMsg = Computer[0];
    em.println("上次妞妞莊家牌: " + tmpMsg);
	getBrand(0);
    var tmpMsg = "";
	初始化();
	for ( var i = 0; i < ComputerP.length ; i++ ){
		ComputerP[i] = parseInt(ComputerP[i]);
	}
	Judgebrand(Computer,ComputerP);
	tmpMsg = Computer[0];
	em.logFile("妞妞/莊家最新開牌紀錄.txt", getCurrentTime() + "新妞妞莊家牌: " + tmpMsg,true);
    em.println("這次妞妞莊家牌: " + tmpMsg);
    scheduleSetup();
    scheduleBroadcast();
}

function scheduleSetup() {
    setupTask = em.scheduleAtTimestamp("setup", nextTime);
}
function scheduleBroadcast() {
    setupTask2 = em.scheduleAtTimestamp("broadCast", nextTime2);
}

function cancelSchedule() {
    if (setupTask != null) {
        setupTask.cancel(true);
    }
    if (setupTask2 != null) {
        setupTask2.cancel(true);
    }
}

function broadCast() {
    nextTime2 += interval; // 5分鐘
    scheduleBroadcast();
}

function setup() {
	getBrand(0);
    var tmpMsg = "";
	初始化();
	for ( var i = 0; i < ComputerP.length ; i++ ){
		ComputerP[i] = parseInt(ComputerP[i]);
	}
	Judgebrand(Computer,ComputerP);
	tmpMsg = Computer[0];
    var tmpMsg2 = "";
    for (var i = 0; i <= 4; i++) {
        var tmpLog = log + "_" + getMinStr(-5) + "_" + i;
        ComputerP[i] = em.getProperty(tmpLog+"num");
    }
	初始化();
	for ( var i = 0; i < ComputerP.length ; i++ ){
		ComputerP[i] = parseInt(ComputerP[i]);
	}
	Judgebrand(Computer,ComputerP);
	tmpMsg2 = Computer[0];
    em.println(getCurrentTime() + "新妞妞莊家牌: " + tmpMsg);
	em.logFile("妞妞/莊家最新開牌紀錄.txt", getCurrentTime() + "新妞妞莊家牌: " + tmpMsg,true);
	if ( 地圖限制[0] ) {
		map.dropMessage(6,"[妞妞系統] : 妞妞開放下注啦！快來試試手氣吧!上把莊家牌為 : " + tmpMsg2 + " (領獎時間5分鐘)");
	} else {
		em.broadcastGambleMessage(3, "[妞妞系統] : 妞妞開放下注啦！快來試試手氣吧!上把莊家牌為 : " + tmpMsg2 + " (領獎時間5分鐘)" );
	}
    nextTime += interval; // 5分鐘
    scheduleSetup();
}

function getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCurrentTime() {
    var dt = new Date();
    var year = dt.getFullYear();
    var month = dt.getMonth() + 1;
    var day = dt.getDate();
    var hour = dt.getHours();
    var min = dt.getMinutes();
    var sec = dt.getSeconds();
    return year + "-" + month + '-' + day + ' ' + hour + ":" + min + ":" + sec;
}

function getMinStr(AddMinCount) {
    var dt = new Date();
	dt.setMinutes(dt.getMinutes()+AddMinCount);
	while ( dt.getMinutes() != 0 ){
		if ( dt.getMinutes() % 5 == 0 )
			break;
		else
			dt.setMinutes(dt.getMinutes()-1);
	}
    var year = dt.getFullYear();
    var month = dt.getMonth() + 1;
    var day = dt.getDate();
    var hour = dt.getHours();
    var min = dt.getMinutes();
    return year + "-" + month + '-' + day + ' ' + hour + ":" + min + ":" ;
}

function getCurrentTime2() {
    return getMinStr(0);
}


function exambrand () {
	for(i=0;i<ComputerH.length;i++){
		if(ComputerH[i]==Name[ran])
			return false;
	}
	return true;
}


function Judgebrand(name,nameP){ // 1.2.3 1.2.4 1.2.5 2.3.4 2.3.5 3.4.5 五搭都要檢查紀錄大小
	if ( ( nameP[0]+nameP[1]+nameP[2]+nameP[3]+nameP[4] ) / 500 == 1 ) { // 黑龍
		UsePoint = 11;
		name[0] = PointVector[UsePoint][0];
		name[1] = PointVector[UsePoint][1];
	}
	if ( ( nameP[0] + nameP[1] + nameP[2] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,3,4);
	if ( ( nameP[0] + nameP[1] + nameP[3] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,2,4);
	if ( ( nameP[0] + nameP[1] + nameP[4] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,2,3);
	if ( ( nameP[0] + nameP[2] + nameP[3] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,1,4);
	if ( ( nameP[0] + nameP[2] + nameP[4] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,1,3);
	if ( ( nameP[0] + nameP[3] + nameP[4] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,1,2);
	if ( ( nameP[1] + nameP[2] + nameP[3] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,0,4);
	if ( ( nameP[1] + nameP[2] + nameP[4] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,0,3);
	if ( ( nameP[1] + nameP[3] + nameP[4] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,0,2);
	if ( ( nameP[2] + nameP[3] + nameP[4] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,0,1);
}

function Judgebrand2(name,nameP,first,second){
  	UsePoint = nameP[first] + nameP[second];
	UsePoint = UsePoint % 10;
	if ( UsePoint == 0 )
		UsePoint += 10;
	if ( name[1] <= PointVector[UsePoint][1] ){
		name[0] = PointVector[UsePoint][0];
		name[1] = PointVector[UsePoint][1];
	}
}

function 初始化(){
	Computer = ["無妞",0];
}

function getBrand(time){
	var finishOne =false;
	for ( var j = 0 ; ( 外掛系統[0] && Computer[1] < 外掛系統[1] && j < 外掛系統[2] ) || j==0 ; j++ ) {
		for ( var i = 0 ; i < 5 ; i++ ){
			var tmpLog = log + "_" + getMinStr(time) + "_" + i;
			var tmpLog2 = log + "_" + getMinStr(time) + "_" + i + "num";
			while ( !finishOne ){
				ran = parseInt(Math.random()*Name.length);
				finishOne = exambrand();
			}
			ComputerH[i] = Name[ran];
			ComputerP[i] = Point[ran];
			em.setProperty(tmpLog, Name[ran]);
			em.setProperty(tmpLog2, Point[ran]);
			finishOne = false;
		}
		for ( var i = 0; i < ComputerP.length ; i++ ){
			ComputerP[i] = parseInt(ComputerP[i]);
		}
		初始化();
		Judgebrand(Computer,ComputerP);
	}
}