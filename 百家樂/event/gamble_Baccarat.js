/* 
Writing by Xiang  Line Frank914a
尊重作者請勿販賣 尊重作者請勿販賣 尊重作者請勿販賣
*/
var setupTask, setupTask2,setupTask3, setupTask4;
var nextTime, nextTime2,nextTime3,nextTime4, nextTime5,nextTime6;
// 每次間隔
var interval =  1*60*1000;
var map ;
var log = "賭博娛樂_百家樂";
var card = [
["黑桃A",1,1],["黑桃2",2,2],["黑桃3",3,3],["黑桃4",4,4],["黑桃5",5,5],["黑桃6",6,6],["黑桃7",7,7],["黑桃8",8,8],["黑桃9",9,9],["黑桃10",0,10],["黑桃J",0,11],["黑桃Q",0,12],["黑桃K",0,13],
["紅心A",1,14],["紅心2",2,15],["紅心3",3,16],["紅心4",4,17],["紅心5",5,18],["紅心6",6,19],["紅心7",7,20],["紅心8",8,21],["紅心9",9,22],["紅心10",0,23],["紅心J",0,24],["紅心Q",0,25],["紅心K",0,26],
["方塊A",1,27],["方塊2",2,28],["方塊3",3,29],["方塊4",4,30],["方塊5",5,31],["方塊6",6,32],["方塊7",7,33],["方塊8",8,34],["方塊9",9,35],["方塊10",0,36],["方塊J",0,37],["方塊Q",0,38],["方塊K",0,39],
["梅花A",1,40],["梅花2",2,41],["梅花3",3,42],["梅花4",4,43],["梅花5",5,44],["梅花6",6,45],["梅花7",7,46],["梅花8",8,47],["梅花9",9,48],["梅花10",0,49],["梅花J",0,50],["梅花Q",0,51],["梅花K",0,52]];
var tempCard = [];
var allConsume = [0,0,0];
var typedName = ["楓幣","楓點","GASH"];
var channel = 1;
var mapId = 910000000;
var 莊家牌 = [];
var 閒家牌 = [];
var 賠率 = [
["閒贏",1],
["莊贏",0.95],
["和",8],
["閒對",11],
["莊對",11],
["大",0.53],
["小",1.45],
["閒單",0.95],
["閒雙",0.88],
["莊單",0.92],
["莊雙",0.92]
// 只能改中間賠率
];
var 外掛系統 = [false,3,10]; // [true/false,連超過幾次開始,每次增加互換機率]
var 牌組打散 = true;
var 連續次數計算 = 0;
var lastEnd;


function init() { // 開服時觸發
    if (em.getChannel() != channel) {
        return;
    }
	em.executeSQL("DELETE FROM `characters_log` WHERE `key` like ?", "賭博娛樂%");
	map = em.getChannelServer().getMapFactory().getMap(mapId);
	if(map == null){
		return;
	}
    var cal = java.util.Calendar.getInstance();
    var cal2 = java.util.Calendar.getInstance();
    var cal3 = java.util.Calendar.getInstance();
    var cal4 = java.util.Calendar.getInstance();
    //時間設定成0點
    cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
    cal.set(java.util.Calendar.MINUTE, 0);
    cal.set(java.util.Calendar.SECOND, 0);
    nextTime = cal.getTimeInMillis();

    cal2.set(java.util.Calendar.HOUR_OF_DAY, 0); 
    cal2.set(java.util.Calendar.MINUTE, 0);
    cal2.set(java.util.Calendar.SECOND, 30);
    nextTime2 = cal2.getTimeInMillis();

    cal3.set(java.util.Calendar.HOUR_OF_DAY, 0); 
    cal3.set(java.util.Calendar.MINUTE, 0);
    cal3.set(java.util.Calendar.SECOND, 40);
    nextTime3 = cal3.getTimeInMillis();
	
    cal4.set(java.util.Calendar.HOUR_OF_DAY, 0); 
    cal4.set(java.util.Calendar.MINUTE, 0);
    cal4.set(java.util.Calendar.SECOND, 50);
    nextTime4 = cal4.getTimeInMillis();
    while (nextTime <= em.getCurrentTime()) {
        nextTime += interval;
    }
    while (nextTime2 <= em.getCurrentTime()) {
        nextTime2 += interval;
    }
    while (nextTime3 <= em.getCurrentTime()) {
        nextTime3 += interval;
    }
    while (nextTime4 <= em.getCurrentTime()) {
        nextTime4 += interval;
    }
	getBrand(0);
    em.println("本期百家樂莊家牌點數: " + getPoint(0) + " " + 莊家牌[0][0] + " " + 莊家牌[1][0] + " " + 莊家牌[2][0]);
    em.println("本期百家樂閒家牌點數: " + getPoint(1) + " " + 閒家牌[0][0] + " " + 閒家牌[1][0] + " " + 閒家牌[2][0]);
    scheduleSetup();
    schedule關盤();
	schedule開牌();
	schedule補牌決勝();
}

function 獎金發放(){
	var players = map.getAllPlayers();
	var iter = players.iterator();
	var player ;
	while(iter.hasNext()){
		player = iter.next();
		allConsume[0] = player.getLogValue(log + "_" + getMinStr(-1) + "_獲得"+typedName[0]+"金額");
		allConsume[1] = player.getLogValue(log + "_" + getMinStr(-1) + "_獲得"+typedName[1]+"金額");
		allConsume[2] = player.getLogValue(log + "_" + getMinStr(-1) + "_獲得"+typedName[2]+"金額");
		if (allConsume[0] == -1 && allConsume[1] == -1 && allConsume[2] == -1 ){
			continue;
		} else if (player.getLogValue(log + "_" + getMinStr(-1) + "_領取") > 0) {
		} else {
			player.setLogValue(log + "_" + getMinStr(-1) + "_領取",1);
			if ( allConsume[0] > 0 ){	
				player.gainMoneytoBank(allConsume[0]);
				player.dropMessage("[百家樂獎金系統] : 贏得了楓幣"+allConsume[0]);
				em.logFile("百家樂/領獎系統.txt",em.getReadableTime()+"<"+player.getName()+">贏得了楓幣<"+allConsume[0]+">",false);
			}
			if ( allConsume[1] > 0 ) {
				player.gainCash(2, allConsume[1]);
				player.dropMessage("[百家樂獎金系統] : 贏得了楓葉點數"+allConsume[1]);
				em.logFile("百家樂/領獎系統.txt",em.getReadableTime()+"<"+player.getName()+">贏得了楓葉點數<"+allConsume[1]+">",false);
			}
			if ( allConsume[2] > 0 ) {
				player.gainCash(1, allConsume[2]);
				player.dropMessage("[百家樂獎金系統] : 贏得了GASH"+allConsume[2]);
				em.logFile("百家樂/領獎系統.txt",em.getReadableTime()+"<"+player.getName()+">贏得了GASH<"+allConsume[2]+">",false);
			}
		}
	}

}

function scheduleSetup() {
    setupTask = em.scheduleAtTimestamp("setup", nextTime);
}
function schedule關盤() {
    setupTask2 = em.scheduleAtTimestamp("關盤", nextTime2);
}
function schedule開牌() {
    setupTask3 = em.scheduleAtTimestamp("開牌", nextTime3);
}
function schedule補牌決勝() {
    setupTask4 = em.scheduleAtTimestamp("補牌決勝", nextTime4);
}
function cancelSchedule() {
    if (setupTask != null) {
        setupTask.cancel(true);
    }
    if (setupTask2 != null) {
        setupTask2.cancel(true);
    }
    if (setupTask3 != null) {
        setupTask3.cancel(true);
    }
    if (setupTask4 != null) {
        setupTask4.cancel(true);
    }
}

function 關盤() {
    map.dropMessage(5,"[百家樂] : ----------------------------------------");
	em.setProperty(getMinStr(0)+"_百家樂開盤狀況",0);
    map.dropMessage(5,"[百家樂] : 停止下注，10秒後開牌。");
    nextTime2 += interval; // 5分鐘
    schedule關盤();
}
function 開牌() {
    map.dropMessage(5,"[百家樂] : ----------------------------------------");
	var msg = "閒家牌 "+閒家牌[0][0] + " " + 閒家牌[1][0];
	msg += " 莊家牌 "+莊家牌[0][0] + " " + 莊家牌[1][0];
    map.dropMessage(5,"[百家樂] : "+msg);
    map.dropMessage(5,"[百家樂] : 補牌中，請稍後。");
    nextTime3 += interval;
    schedule開牌();
}
function 補牌決勝() {
	var msg ="閒家 ["+ ((閒家牌[2][0]=="無")?"不補":閒家牌[2][0]) +"] | 莊家 ["+ (莊家牌[2][0]=="無"?"不補":莊家牌[2][0]) +"]";
    map.dropMessage(5,"[百家樂] : "+msg);
	var 閒家對 ="";
	if((閒家牌[0][2]%13) == (閒家牌[1][2]%13)){
		閒家對+=" 對子";
	}
	var 莊家對 ="";
	if((莊家牌[0][2]%13) == (莊家牌[1][2]%13)){
		莊家對+=" 對子";
	}
	var 勝負 = "";
	if(getPoint(0) > getPoint(1)){
		勝負="莊贏";
	}else if (getPoint(0)<getPoint(1)){
		勝負="閒贏";
	}else{
		勝負="和局";
	}
	if(外掛系統[0]){
		if(lastEnd == 勝負||連續次數計算== 0){
			連續次數計算++;
		} else {
			連續次數計算 = 0;
		}
		lastEnd = 勝負;
	}
    map.dropMessage(5,"[百家樂] : 閒家 ["+getPoint(1)+"點"+閒家對+"] | 莊家 ["+getPoint(0)+"點"+莊家對+"] | "+勝負);
	em.logFile("百家樂/開牌紀錄.txt",getCurrentTime2()+"[百家樂] : 閒家 ["+getPoint(1)+"點"+閒家對+"] | 莊家 ["+getPoint(0)+"點"+莊家對+"] | "+勝負,false)
    nextTime4 += interval; // 5分鐘
    schedule補牌決勝();
}

function setup() {
	getBrand(0);
    em.println(getCurrentTime()+"下期百家樂莊家牌點數: " + getPoint(0) + " " + 莊家牌[0][0] + " " + 莊家牌[1][0] + " " + 莊家牌[2][0]);
    em.println(getCurrentTime()+"下期百家樂閒家牌點數: " + getPoint(1) + " " + 閒家牌[0][0] + " " + 閒家牌[1][0] + " " + 閒家牌[2][0]);
	莊家牌 = [];
	閒家牌 = [];
	for ( var i = 0; i < 3 ; i++ ) {
		var pos = em.getProperty(getMinStr(-1)+"_百家樂_莊家牌位置"+i)-1;
		if ( pos >= 0 && pos <= 51)
			莊家牌.push(card[pos]);
		else {
			莊家牌.push(["無",0,-1]);
		}
	}
	for ( var i = 0; i < 3 ; i++ ) {
		var pos = em.getProperty(getMinStr(-1)+"_百家樂_閒家牌位置"+i)-1;
		if ( pos >= 0 && pos <= 51)
			閒家牌.push(card[pos]);
		else {
			閒家牌.push(["無",0,-1]);
		}
	}
	
	獎金發放();
    map.dropMessage(5,"[百家樂] : -----------上期獎金已完成入帳-----------");
    map.dropMessage(5,"[百家樂] : ----------------------------------------");
    map.dropMessage(5,"[百家樂] : 現在開放下注，30秒後關盤");
	em.setProperty(getMinStr(0)+"_百家樂開盤狀況",1);
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

function getMinStr(AddSecCount) {
    var dt = new Date();
	dt.setMinutes(dt.getMinutes()+AddSecCount);
	dt.setSeconds(0);
    var year = dt.getFullYear();
    var month = dt.getMonth() + 1;
    var day = dt.getDate();
    var hour = dt.getHours();
    var min = dt.getMinutes();
    var second = dt.getSeconds();
    return year + "-" + month + '-' + day + ' ' + hour + ":" + min + ":" + second + ":" ;
}

function getCurrentTime2() {
    return getMinStr(0);
}

function shuffle(){
	tempCard = [];
	for ( var i = 0 ; i < 8 ; i++ ) {
		for ( var j = 0 ; j < card.length ; j++ ) {
			var tempInsert = [];
			tempInsert = card[j];
			if ( tempInsert.length < 3 )
				tempInsert.push(j);
			tempCard.push(tempInsert);
		}
	}
    map.dropMessage(2,"[百家樂] : 重新洗牌......");
	em.setProperty(getMinStr(0)+"_百家樂勝負", -1);
}

function getACard() {
	var pos = Math.floor(Math.random()*tempCard.length);
	var tCard = tempCard[pos];
	if ( !牌組打散 )
		tempCard.splice(pos,1);
	return tCard;
}

function getPoint(category){
	var point = 0;
	if ( category == 0 ){
		for (var i in 莊家牌) {
			if (莊家牌[i][1]!=-1)
				point += 莊家牌[i][1];
		}
	} else if (category == 1 ) {
		for (var i in 閒家牌) {
			if (閒家牌[i][1]!=-1)
				point += 閒家牌[i][1];
		}
	}
	point = point % 10;
	return point;
}

function switchSystem(){
	var rand = getRand(1,100);
	var tempRand = 外掛系統[2]*(連續次數計算-外掛系統[1]);
	if (tempRand>=90){
		tempRand = 90;
	}
	if(tempRand>=rand){
		var temp牌 = 莊家牌;
		莊家牌 = 閒家牌;
		閒家牌 = temp牌;
	}
}

function getBrand(time){
	if ( tempCard.length < 8 ) {
		shuffle();
	}
	莊家牌 = [];
	閒家牌 = [];
	閒家牌.push(getACard());
	莊家牌.push(getACard());
	閒家牌.push(getACard());
	莊家牌.push(getACard());
	decideToMakeUp();
	if (外掛系統[0]&&連續次數計算>=外掛系統[1]){
		switchSystem();
	}
	for ( var i = 0; i < 莊家牌.length ; i++ ) {
		em.setProperty(getMinStr(time)+"_百家樂_莊家牌位置"+i, 莊家牌[i][2]);
	}
	
	for ( var i = 0; i < 閒家牌.length ; i++ ) {
		em.setProperty(getMinStr(time)+"_百家樂_閒家牌位置"+i, 閒家牌[i][2]);
	}
	if (getPoint(0) > getPoint(1)){
		em.setProperty(getMinStr(time)+"_百家樂勝負", 0);
	}else if (getPoint(0) < getPoint(1)){
		em.setProperty(getMinStr(time)+"_百家樂勝負", 1);
	}else{
		em.setProperty(getMinStr(time)+"_百家樂勝負", 2);
	}
}

function decideToMakeUp(){
	var 莊家點 = getPoint(0);
	var 閒家點 = getPoint(1);
	if ( 莊家牌[0][1] == 0 && 閒家牌[0][1] == 0 && 莊家牌[1][1] == 0 && 閒家牌[1][1] == 0  ){
		閒家牌.push(getACard());
		莊家牌.push(getACard());
		return;
	}else if ( 莊家點 >=8 || 閒家點 >= 8 ) {
		閒家牌.push(["無",0,-1]);
		莊家牌.push(["無",0,-1]);
		return ;
	} else {
		if ( 閒家點 >= 6 ) {
			閒家牌.push(["無",0,-1]);
		} else {
			閒家牌.push(getACard());
		}
		閒家點 = getPoint(1);
		if ( 閒家點 > 7 && 閒家牌[2][0] == "無" ) {
			莊家牌.push(["無",0,-1]);
		} else if ( 閒家點 >= 6 && 莊家點 > 閒家點 ) {
			莊家牌.push(["無",0,-1]);
		} else if ( 莊家點 < 3 ) {
			莊家牌.push(getACard());
		} else if ( 莊家點 == 3 ) {
			if ( 閒家牌[2][1] == 8){
				莊家牌.push(["無",0,-1]);
			} else {
				莊家牌.push(getACard());
			}
		} else if ( 莊家點 == 4 ) {
			if ( 閒家牌[2][1] == 0 || 閒家牌[2][1] == 1 || 閒家牌[2][1] == 8 || 閒家牌[2][1] == 9 ) {
				莊家牌.push(["無",0,-1]);
			} else {
				莊家牌.push(getACard());
			}
		} else if ( 莊家點 == 5 ) {
			if ( 閒家牌[2][1] == 0 || 閒家牌[2][1] == 1 || 閒家牌[2][1] == 2 || 閒家牌[2][1] == 3 || 閒家牌[2][1] == 8 || 閒家牌[2][1] == 9 ) {
				莊家牌.push(["無",0,-1]);
			} else {
				莊家牌.push(getACard());
			}
		} else if ( 莊家點 == 6 ) {
			if ( 閒家牌[2][1] == 6 || 閒家牌[2][1] == 7 ) {
					莊家牌.push(getACard());
			} else {
				莊家牌.push(["無",0,-1]);
			}
		} else {
			莊家牌.push(["無",0,-1]);
		}
	}
	
}