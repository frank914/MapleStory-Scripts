/* 
Writing by Xiang  Line Frank914a
尊重作者請勿販賣 尊重作者請勿販賣 尊重作者請勿販賣
*/
var status = -1;
var valList;
var channelServer;
var em;
var log = "賭博娛樂_百家樂";
var logTime;
var 執行頻道 = 1;
var 執行地圖 = 910000000;
var 當期下注次數限制 = [true , 1];
var broadcastOnReward = true; // 領獎時廣播
var card = [
["黑桃A",1,1],["黑桃2",2,2],["黑桃3",3,3],["黑桃4",4,4],["黑桃5",5,5],["黑桃6",6,6],["黑桃7",7,7],["黑桃8",8,8],["黑桃9",9,9],["黑桃10",0,10],["黑桃J",0,11],["黑桃Q",0,12],["黑桃K",0,13],
["紅心A",1,14],["紅心2",2,15],["紅心3",3,16],["紅心4",4,17],["紅心5",5,18],["紅心6",6,19],["紅心7",7,20],["紅心8",8,21],["紅心9",9,22],["紅心10",0,23],["紅心J",0,24],["紅心Q",0,25],["紅心K",0,26],
["方塊A",1,27],["方塊2",2,28],["方塊3",3,29],["方塊4",4,30],["方塊5",5,31],["方塊6",6,32],["方塊7",7,33],["方塊8",8,34],["方塊9",9,35],["方塊10",0,36],["方塊J",0,37],["方塊Q",0,38],["方塊K",0,39],
["梅花A",1,40],["梅花2",2,41],["梅花3",3,24],["梅花4",4,43],["梅花5",5,44],["梅花6",6,45],["梅花7",7,46],["梅花8",8,47],["梅花9",9,48],["梅花10",0,49],["梅花J",0,50],["梅花Q",0,51],["梅花K",0,52]];
var MESOISOPEN = true;
var MesoBase = 100; //楓幣基礎值
var MesoMin = 100; //楓幣min
var MesoMax = 100000000; //楓幣max 
var POINT1ISOPEN = true;
var Point1_Base = 10; //楓點基礎值
var Point1_Min = 10; //楓點min
var Point1_Max = 500; //楓點max 
var POINT2ISOPEN = true;
var Point2_Base = 10; //GASH基礎值
var Point2_Min = 10; //GASHmin
var Point2_Max = 500; //GASHmax 
var typed ; // 選擇類別
var sel = -1;
var typedName = ["楓幣","楓點","GASH"];
var Consume ; //消費值
var allConsume = [0,0,0];
var 莊家牌 = [];
var 閒家牌 = [];
var 莊家牌old = [];
var 閒家牌old = [];
var 賠率 = [
["閒贏",1],
["莊贏",0.95],
["和",8],
["閒對",5],
["莊對",5],
["大",0.53],
["小",1.45],
["閒單",0.95],
["閒雙",0.88],
["莊單",0.92],
["莊雙",0.92]
// 只能改中間賠率
];
var rateSel = -1;
var name = "XX谷";

function start(){
    channelServer = cm.getChannelServer(cm.getMap().getWorld(), 執行頻道);
    em = channelServer.getEventSM().getEventManager("gamble_Baccarat");
	if(cm.getClient().getChannel()!=執行頻道||cm.getPlayer().getMapId() != 執行地圖){
		cm.sendOk("請在"+cm.getMap(執行地圖).getMapName()+執行頻道+"頻道進行!");
		cm.dispose();
		return;
	}
    if (em == null) {
        cm.sendNext("目前尚未開放此系統");
        cm.dispose();
        return;
    }
    for (var i = 0; i < 3; i++) {
        if (em.getProperty(getCurrentTime2()+"_百家樂_莊家牌位置"+i) == null) {
            cm.sendNext("請耐心等待，還沒開始1");
            cm.dispose();
            return;
        }
        if (em.getProperty(getCurrentTime2()+"_百家樂_閒家牌位置"+i) == null) {
            cm.sendNext("請耐心等待，還沒開始1");
            cm.dispose();
            return;
        }
        if (em.getProperty(getMinStr(-2)+"_百家樂_莊家牌位置"+i) == null) {
            cm.sendNext("請耐心等待，還沒開始，大約2分鐘後開始。");
            cm.dispose();
            return;
        }
        if (em.getProperty(getMinStr(-2)+"_百家樂_閒家牌位置"+i) == null) {
            cm.sendNext("請耐心等待，還沒開始，大約2分鐘後開始。");
            cm.dispose();
            return;
        }
    }
	insertPreEnd();
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else if (mode == 0) {
        cm.dispose();
        return;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
		var text = "#d------------------------------------------------\r\n";
        text += "你好，歡迎來到#r"+name+"#b#e百家樂系統#n#k\r\n";
		text += "上期百家樂狀況\r\n";
		text += "#e莊家牌為:#r";
		if( 莊家牌old.length > 0 )
			text +=莊家牌old[0][0]+"."+莊家牌old[1][0]+"."+莊家牌old[2][0]+" #b- 點數:"+getPoint(2)+"\r\n";
		else
			text += "無\r\n";
		text += "#k閒家牌為:#r";
		if( 閒家牌old.length > 0 )
			text +=閒家牌old[0][0]+"."+閒家牌old[1][0]+"."+閒家牌old[2][0]+" #b- 點數:"+getPoint(3)+"\r\n#n";
		else
			text += "無\r\n";
		if( em.getProperty(getMinStr(0)+"_百家樂開盤狀況") == 1){
			text += "\r\n#b#L1#百家樂下注區#l\r\n";
		} else {
			text += "\r\n#l   #e#k目前無法下注，請等下一局#n\r\n";
		}
        text += "#d#L4#近期百家樂結果紀錄#l\r\n";
        text += "#d#L2#百家樂遊戲規則說明#l\r\n";
		text += "#k#L3#我要結束對話#l\r\n"; 
		text += "\r\n\t#r1分鐘開一次!\r\n";
        text += "#d------------------------------------------------\r\n";
		logTime = getCurrentTime2();
        cm.sendSimple(text);
	} else if (status == 1) {
		sel = selection;
		if ( sel == 2 ) {
			var msg = "#r#e百家樂#n#k，簡單來說就是押莊閒的遊戲，無嚴格規定參與人數，除了賭桌上提供的坐位外，在賭桌旁站立的玩家亦可#b自由投注#k。\r\n";
			msg += "在用牌的部分，百家樂一般使用8副撲克牌（一靴），經過荷官洗牌、堆牌、切牌後，第一、三張牌發給閒家，第二、四張牌發給莊家，依照補牌規定，至多三張牌，雙方點數最接近9者為勝。\r\n";
			msg += "#r點數計算：百家樂不像其他遊戲，它只計算排面點數不比花色。A為1點，10、J、Q和K為0點；其他牌依牌面數字計點，依規則補牌後取所有牌數總和的個位數。";
			cm.sendOk(msg);
			cm.dispose();
			return;
		} else if ( sel == 4 ) {
			cm.sendOk(showEarlyEnd());
			cm.dispose();
			return;
		} else if (logTime != getCurrentTime2() || em.getProperty(getMinStr(0)+"_百家樂開盤狀況") == 0){
			cm.sendOk("錯過這期的操作時間了!")
			cm.dispose();
			return;
		} else if ( sel == 1 ){
			var rateMsg = "請決定下注方式:\r\n";
			for (var i in 賠率 ) {
				rateMsg += "#L"+i+"#"+賠率[i][0]+" 賠率:「"+賠率[i][1]+"」\r\n";	
			}
			cm.sendSimple(rateMsg);
		} else if ( sel == 3 ) {
			cm.sendOk("這樣就要走了嗎?!好吧!");
			cm.dispose();
			return;
		} 
    } else if (status == 2) {
		if (logTime != getCurrentTime2() || em.getProperty(getMinStr(0)+"_百家樂開盤狀況") == 0){
			cm.sendOk("錯過這期的操作時間了!")
			cm.dispose();
			return;
		}
		if ( sel == 1 ) {
			rateSel = selection;
			var text = "你好，歡迎來到#r"+name+"#b#e百家樂系統#k#n#n#k\r\n";
			if(MESOISOPEN)
				text += "#r#L0#使用楓幣賭博#l\r\n";
			if(POINT1ISOPEN)
				text += "#r#L1#使用楓點賭博#l\r\n";
			if(POINT2ISOPEN)
				text += "#r#L2#使用GASH賭博#l\r\n";
			cm.sendSimple(text);
		} else {
			cm.sendOk("謝謝光臨，歡迎下次再來玩!");
			cm.dispose();
		}
    } else if (status == 3) {
		if (logTime != getCurrentTime2() || em.getProperty(getMinStr(0)+"_百家樂開盤狀況") == 0){
			cm.sendOk("錯過這期的操作時間了!")
			cm.dispose();
			return;
		}
		if ( sel == 1 ) {
			typed = selection;
			var text = "請輸入你要投注的金額：";
			if (selection == 0) {
				if(!MESOISOPEN){
					cm.dispose();
					return;
				}
				cm.sendGetNumber(text, MesoBase, MesoMin, MesoMax);
			} else if (selection == 1) {
				if(!POINT1ISOPEN){
					cm.dispose();
					return;
				}
				cm.sendGetNumber(text, Point1_Base, Point1_Min, Point1_Max);
			} else if (selection == 2) {
				if(!POINT2ISOPEN){
					cm.dispose();
					return;
				}
				cm.sendGetNumber(text, Point2_Base, Point2_Min, Point2_Max);
			}
		}
    } else if (status == 4 ){
		if (logTime != getCurrentTime2() || em.getProperty(getMinStr(0)+"_百家樂開盤狀況") == 0){
			cm.sendOk("錯過這期的操作時間了!")
			cm.dispose();
			return;
		}
		Consume = selection; 
		if(當期下注次數限制[0]){
			if (cm.getPlayer().getLogValue(log + "_" + getCurrentTime2() + "下注紀錄") >= 當期下注次數限制[1]){
				cm.sendOk("下注次數大於"+當期下注次數限制[1]+"了!");
				cm.dispose();
				return;
			}
		}
		if ( sel == 1 ) {
			if ( typed == 0 ){
				if ( cm.getPlayer().getMeso() < Consume ){
					cm.sendOk("您的金額不足以負擔，需要:"+Consume);
					cm.dispose();
					return;
				}else{
					cm.gainMeso(-Consume);
					cm.logFile("百家樂/下注紀錄.txt", cm.getReadableTime()+"<"+cm.getPlayer().getName()+">下注楓幣<"+Consume+"> 類別:"+賠率[rateSel][0],false);
				}
			} else if ( typed == 1 ) {
				if ( cm.getPlayer().getCSPoints(2) < Consume ){
					cm.sendOk("您的金額不足以負擔，需要:"+Consume);
					cm.dispose();
					return;
				}else{
					cm.getPlayer().gainCash(2,-Consume);
					cm.logFile("百家樂/下注紀錄.txt", cm.getReadableTime()+"<"+cm.getPlayer().getName()+">下注楓點<"+Consume+"> 類別:"+賠率[rateSel][0],false);
				}
			} else if ( typed == 2 ) {
				if ( cm.getPlayer().getCSPoints(1) < Consume ){
					cm.sendOk("您的金額不足以負擔，需要:"+Consume);
					cm.dispose();
					return;
				}else{
					cm.getPlayer().gainCash(1,-Consume);
					cm.logFile("百家樂/下注紀錄.txt", cm.getReadableTime()+"<"+cm.getPlayer().getName()+">下注GASH<"+Consume+"> 類別:"+賠率[rateSel][0],false);
				}
			}
			
			if(當期下注次數限制[0]){
				if (cm.getPlayer().getLogValue(log + "_" + getCurrentTime2() + "下注紀錄") > 0){
					cm.getPlayer().addLogValue(log + "_" + getCurrentTime2() + "下注紀錄",1);
				} else {
					cm.getPlayer().setLogValue(log + "_" + getCurrentTime2() + "下注紀錄",1);
				}
			}
			if ( ( 賠率[rateSel][0]=="閒贏" && getPoint(0) == getPoint(1) )|| (賠率[rateSel][0]=="莊贏" && getPoint(0) == getPoint(1))  ){
				cm.logFile("百家樂/下注紀錄.txt", cm.getReadableTime()+"<"+cm.getPlayer().getName()+">贏回"+typedName[typed]+"<"+Consume+"> 類別:"+賠率[rateSel][0],false);
				if (cm.getPlayer().getLogValue(log + "_" + getCurrentTime2() + "_獲得"+typedName[typed]+"金額") == 0){
					cm.getPlayer().setLogValue(log + "_" + getCurrentTime2() + "_獲得"+typedName[typed]+"金額",Consume);
				}else {
					cm.getPlayer().addLogValue(log + "_" + getCurrentTime2() + "_獲得"+typedName[typed]+"金額",Consume);
				}
			} else if ( playerWin(rateSel) ) {
				if (cm.getPlayer().getLogValue(log + "_" + getCurrentTime2() + "_獲得"+typedName[typed]+"金額") == 0){
					cm.logFile("百家樂/下注紀錄.txt", cm.getReadableTime()+"<"+cm.getPlayer().getName()+">贏回"+typedName[typed]+"<"+Consume*(1+賠率[rateSel][1])+"> 類別:"+賠率[rateSel][0],false);
					cm.getPlayer().setLogValue(log + "_" + getCurrentTime2() + "_獲得"+typedName[typed]+"金額",Consume*(1+賠率[rateSel][1]));
				}else {
					cm.logFile("百家樂/下注紀錄.txt", cm.getReadableTime()+"<"+cm.getPlayer().getName()+">贏回"+typedName[typed]+"<"+Consume*(1+賠率[rateSel][1])+"> 類別:"+賠率[rateSel][0],false);
					cm.getPlayer().addLogValue(log + "_" + getCurrentTime2() + "_獲得"+typedName[typed]+"金額",Consume*(1+賠率[rateSel][1]));
				}
			}
			text  = "#b帥哥/美女\r\n#k";
			text += "您下注的額度是"+Consume+typedName[typed]+"\r\n\r\n";
			text += "#r#e請等待開獎囉~";
			cm.sendOk(text);
		} else {
			cm.sendOk("謝謝光臨，歡迎下次再來玩!");
			cm.dispose();
		}
	} else {
		cm.sendOk("謝謝光臨，歡迎下次再來玩!");
		cm.dispose();
	}
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
	} else if ( category == 2 ){
		for (var i in 莊家牌old) {
			if (莊家牌old[i][1]!=-1)
				point += 莊家牌old[i][1];
		}
	} else if (category == 3 ) {
		for (var i in 閒家牌old) {
			if (閒家牌old[i][1]!=-1)
				point += 閒家牌old[i][1];
		}
	}
	point %= 10;
	return point;

}

function insertPreEnd() {
	for ( var i = 0; i < 3 ; i++ ) {
		var pos = em.getProperty(getMinStr(-1)+"_百家樂_莊家牌位置"+i)-1;
		if ( pos != -2 )
			莊家牌.push(card[pos]);
		else
			莊家牌.push(["無",0,-1]);
	}
	for ( var i = 0; i < 3 ; i++ ) {
		var pos = em.getProperty(getMinStr(-1)+"_百家樂_閒家牌位置"+i)-1;
		if ( pos != -2 )
			閒家牌.push(card[pos]);
		else
			閒家牌.push(["無",0,-1]);
	}
	for ( var i = 0; i < 3 ; i++ ) {
		var pos = em.getProperty(getMinStr(-2)+"_百家樂_莊家牌位置"+i)-1;
		if ( pos != -2 )
			莊家牌old.push(card[pos]);
		else
			莊家牌old.push(["無",0,-1]);
	}
	for ( var i = 0; i < 3 ; i++ ) {2
		var pos = em.getProperty(getMinStr(-2)+"_百家樂_閒家牌位置"+i)-1;
		if ( pos != -2 )
			閒家牌old.push(card[pos]);
		else
			閒家牌old.push(["無",0,-1]);
	}
}

function playerWin(category){
	if ( 賠率[category][0] == "閒贏" ) {
		if ( getPoint(1) > getPoint(0) ) {
			return true;
		} else {
			return false;
		}
	} else if ( 賠率[category][0] == "莊贏" ) {
		if ( getPoint(0) > getPoint(1) ) {
			return true;
		} else {
			return false;
		}
	} else if ( 賠率[category][0] == "和" ) {
		if ( getPoint(0) == getPoint(1) ) {
			return true;
		} else {
			return false;
		}
	} else if ( 賠率[category][0] == "莊對" ) {
		if ( ( em.getProperty(getMinStr(-1)+"_百家樂_莊家牌位置"+0) ) % 13 == ( em.getProperty(getMinStr(-1)+"_百家樂_莊家牌位置"+1) ) % 13 ) {
			return true;
		} else {
			return false;
		}
	} else if ( 賠率[category][0] == "閒對" ) {
		if ( (em.getProperty(getMinStr(-1)+"_百家樂_閒家牌位置"+0) ) % 13 == ( em.getProperty(getMinStr(-1)+"_百家樂_閒家牌位置"+1) ) % 13 ) {
			return true;
		} else {
			return false;
		}
	} else if ( 賠率[category][0] == "大" ) {
		if ( 莊家牌[2][0] != "無" || 閒家牌[2][0] != "無" ) {
			return true;
		} else {
			return false;
		}
	} else if ( 賠率[category][0] == "小" ) {
		if ( 莊家牌[2][0] == "無" && 閒家牌[2][0] == "無" ) {
			return true;
		} else {
			return false;
		}
	} else if ( 賠率[category][0] == "閒單" ) {
		if ( getPoint(1) % 2 == 1 ) {
			return true;
		} else {
			return false;
		}
	} else if ( 賠率[category][0] == "閒雙" ) {
		if ( getPoint(1) % 2 == 0 ) {
			return true;
		} else {
			return false;
		}
	} else if ( 賠率[category][0] == "莊單" ) {
		if ( getPoint(0) % 2 == 1 ) {
			return true;
		} else {
			return false;
		}
	} else if ( 賠率[category][0] == "莊雙" ) {
		if ( getPoint(0) % 2 == 0 ) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
	
}

function showEarlyEnd(){
	var message = "#e以下為近期紀錄:\r\n";
	for (var i = 2 ; i <= 51 ; i++){
		var 勝負結果 = em.getProperty(getMinStr((-1)*i)+"_百家樂勝負");
		if (勝負結果==0){
			message += getMinStr((-1)*i);
			message += " #r莊家勝利#k\r\n";
		}else if (勝負結果==1){
			message += getMinStr((-1)*i);
			message += " #b閒家勝利#k\r\n";
		}else if (勝負結果==2){
			message += getMinStr((-1)*i);
			message += " #g雙方和局#k\r\n";
		} else {
			break;
		}
	}
	
	return message;
}