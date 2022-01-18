/* 
Writing by Xiang  Line Frank914a
尊重作者請勿販賣 尊重作者請勿販賣 尊重作者請勿販賣
*/
var status = -1;
var valList;
var channelServer;
var em;
var log = "賭博娛樂_妞妞";
var Odds = 90 ; // 實際獲得%數
var logTime;
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
var broadcastOnReward = false; // 領獎時廣播
var MESOISOPEN = true;
var MesoBase = 100; //楓幣基礎值
var MesoMin = 100; //楓幣min
var MesoMax = 100000000; //楓幣max 
var POINT1ISOPEN = false;
var Point1_Base = 10; //楓點基礎值
var Point1_Min = 10; //楓點min
var Point1_Max = 1000; //楓點max 
var POINT2ISOPEN = false;
var Point2_Base = 10; //GASH基礎值
var Point2_Min = 10; //GASHmin
var Point2_Max = 1000; //GASHmax 
var typed ; // 選擇類別
var sel = -1;
var typedName = ["楓幣","楓點","GASH"];
var Consume ; //消費值
var Player =["無妞",0,0];
var Player_Old =["無妞",0,0];
var PlayerH =[];
var PlayerP =[];
var PlayerH_Old =[];
var PlayerP_Old =[];
var Computer = ["無妞",0,0];
var Computer_Old = ["無妞",0,1];
var ComputerH = [];
var ComputerP = [];
var ComputerH_Old = [];
var ComputerP_Old = [];
var ran ;
var PointVector = [
["無妞",0,1], 
["一點",1,1], 
["二點",2,1], 
["三點",3,1], 
["四點",4,1], 
["五點",5,1], 
["六點",6,1], 
["七點",7,1], 
["八點",8,2], 
["九點",9,2], 
["妞妞",10,3], 
["黑龍",11,5]
]; // 牌名,順位,倍率
var name = "XX谷";
var 地圖限制 = [true,1,910000000]; // [是否限制,頻道,地圖代碼]


function start(){
	if ( 地圖限制[0] ) {
		channelServer = cm.getChannelServer(cm.getMap().getWorld(), 地圖限制[1]);
		if(cm.getClient().getChannel()!=地圖限制[1]||cm.getPlayer().getMapId() != 地圖限制[2]){
			cm.sendOk("請在"+cm.getMap(地圖限制[2]).getMapName()+地圖限制[1]+"頻道進行!");
			cm.dispose();
			return;
		}
	} else {
		channelServer = cm.getChannelServer(cm.getMap().getWorld(), 1);
	}
    em = channelServer.getEventSM().getEventManager("gamble_Niuniu");
    if (em == null) {
        cm.sendNext("目前尚未開放此系統");
        cm.dispose();
        return;
    }
    for (var i = 0; i <= 4; i++) {
        if (em.getProperty(log + "_" + getCurrentTime2() + "_" + i) == null) {
            cm.sendNext("請耐心等待，還沒開始1");
            cm.dispose();
            return;
        }
		
        if (em.getProperty(log + "_" + getCurrentTime2() + "_" + i + "num") == null) {
            cm.sendNext("請耐心等待，還沒開始2");
            cm.dispose();
            return;
        }
        if (em.getProperty(log + "_" + getMinStr(-5) + "_" + i) != null) {
			ComputerH_Old.push(em.getProperty(log + "_" + getMinStr(-5) + "_" + i ));
        }
        if (em.getProperty(log + "_" + getMinStr(-5) + "_" + i + "num") != null) {
			ComputerP_Old.push(em.getProperty(log + "_" + getMinStr(-5) + "_" + i + "num"));
        }
		ComputerH.push(em.getProperty(log + "_" + getCurrentTime2() + "_" + i ));
		ComputerP.push(em.getProperty(log + "_" + getCurrentTime2() + "_" + i + "num"));
    }
	for ( var i = 0; i < ComputerP.length ; i++ ){
		ComputerP[i] = parseInt(ComputerP[i]);
	}
	for ( var i = 0; i < ComputerH_Old.length ; i++ ){
		ComputerP_Old[i] = parseInt(ComputerP_Old[i]);
	}
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else if (mode == 0) {
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
		var text = "#d------------------------------------------------\r\n";
        text += "你好，歡迎來到#r"+name+"#b#e妞妞系統#n#k\r\n";
		Judgebrand(Computer_Old,ComputerP_Old);
		text += "上期妞妞莊家牌為:";
		if(ComputerH_Old[0] != undefined )
			text +=ComputerH_Old[0]+"."+ComputerH_Old[1]+"."+ComputerH_Old[2]+"."+ComputerH_Old[3]+"."+ComputerH_Old[4]+":#b"+Computer_Old[0]+"\r\n";
		else
			text += "無\r\n";
        var tmpMsg = "";
		if(getChrNumberArray_OLD(1)!=null){
			PlayerH_Old = getChrNumberArray_OLD(1);
			PlayerP_Old = getChrNumberArray_OLD(2);
			Judgebrand(Player_Old,PlayerP_Old);
			for ( var i = 0 ; i < PlayerH_Old.length ; i++ ){
				tmpMsg += PlayerH_Old[i];
				if ( i != PlayerH_Old.length-1 )
					tmpMsg += ".";
			}
		}
		if ( PlayerH_Old.length == 0 )
			tmpMsg = "無";
		else
			tmpMsg += ":#b"+Player_Old[0]+"";
		
		var tmpMsg2 = "";
		if(getChrNumberArray(1)!=null){
			PlayerH = getChrNumberArray(1);
			PlayerP = getChrNumberArray(2);
			Judgebrand(Player,PlayerP);
			for ( var i = 0 ; i < PlayerH.length ; i++ ){
				tmpMsg2 += PlayerH[i];
				if ( i != PlayerH.length-1 )
					tmpMsg2 += ".";
			}
		}
		if ( PlayerH.length == 0 )
			tmpMsg2 = "無";
		else 
			tmpMsg2 += ":#b"+Player[0]+"";
		
		text += "#k上期你購買的牌為:" + tmpMsg;
		text += "\r\n#k這期你購買的牌為:" + tmpMsg2;

		if(PlayerH_Old.length>0)
			text += "\r\n#r#L0#我要領取上次獎勵#l";
        text += "\r\n#b#L1#我要購買這期妞妞#l\r\n";
        text += "#d#L2#妞妞遊戲規則說明#l\r\n";
		text += "#k#L3#我要結束對話#l\r\n"; 
		text += "\r\n\t#b一期可下注多次，重複投注只會算做一次!\r\n";
		text += "\r\n\t#r5分鐘開一次!\r\n";
        text += "#d------------------------------------------------\r\n";
		logTime = getCurrentTime2();
        cm.sendSimple(text);
	} else if (status == 1) {
		if (logTime != getCurrentTime2()){
			cm.sendOk("錯過這期的操作時間了!")
			cm.dispose();
			return;
		}
		sel = selection;
		初始化();
		if ( sel == 0 ){
			Judgebrand(Computer,ComputerP);
			if (CompareSize( Player_Old[1], Computer_Old[1] )) {
				text = "你目前手上的牌"+PlayerH_Old[0]+"."+PlayerH_Old[1]+"."+PlayerH_Old[2]+"."+PlayerH_Old[3]+"."+PlayerH_Old[4]+":#b"+Player_Old[0]+"\r\n";
				text += "#k比莊家目前手上的牌"+ComputerH_Old[0]+"."+ComputerH_Old[1]+"."+ComputerH_Old[2]+"."+ComputerH_Old[3]+"."+ComputerH_Old[4]+":#b"+Computer_Old[0]+"\r\n";
				text += "#k還大，#r#e 賠率:"+Player_Old[2]+"\r\n";
				text += "點選下一步領獎";
				cm.sendNext(text);
			} else {	
				text = "你目前手上的牌"+PlayerH_Old[0]+"."+PlayerH_Old[1]+"."+PlayerH_Old[2]+"."+PlayerH_Old[3]+"."+PlayerH_Old[4]+":#b"+Player_Old[0]+"\r\n";
				text += "#k比莊家目前手上的牌"+ComputerH_Old[0]+"."+ComputerH_Old[1]+"."+ComputerH_Old[2]+"."+ComputerH_Old[3]+"."+ComputerH_Old[4]+":#b"+Computer_Old[0]+"\r\n";
				text += "#k還小，#r#e 賠率:"+Computer_Old[2]+"\r\n";
				text += "沒有獲勝，點選下一步領回押金。";
				cm.sendNext(text);
			}
		} else if ( sel == 1 ){
			var text = "你好，歡迎來到#r"+name+"#b#e妞妞系統#k#n(玩家贏的賠率*1倍)\r\n(會扣除最大可能輸的金額)#n#k\r\n";
			if(MESOISOPEN)
				text += "#r#L0#使用楓幣賭博#l\r\n";
			if(POINT1ISOPEN)
				text += "#r#L1#使用楓點賭博#l\r\n";
			if(POINT2ISOPEN)
				text += "#r#L2#使用GASH賭博#l\r\n";
			cm.sendSimple(text);
		} else if ( sel == 2 ) {
			var msg = "妞妞玩法簡單，五張撲克牌分前兩張、後三張，\r\n";
			msg += "後三張湊成十的倍數成為第一個「妞」，\r\n前兩張相加的個位數拿來跟莊家比大小。#r\r\n(這裡是我們管理員做莊)#k\r\n";
			msg += "若相加後超過八，且贏過別人，賭金乘以2倍#r(這邊倍率:"+PointVector[8][2]+")#k\r\n相加等於十的倍數為第二個妞，就可以乘上3倍#r(這邊倍率:"+PointVector[10][2]+")#k\r\n若手上五張牌都是J、Q、K，則是5倍賭金#r(這邊倍率:"+PointVector[11][2]+")#k\r\n因為通常用兩副牌玩，且翻牌就定輸贏，所以遊戲很快的進行5分鐘開一局。";
			msg += "\r\n每次遊玩都會先扣最多可能輸多少，做押金，怕你烙跑!";
			msg += "\r\n#b另外，若你贏錢會收取"+(100-Odds)+"%手續費";
			cm.sendOk(msg);
			cm.dispose();
			return;
		} else if ( sel == 3 ) {
			cm.sendOk("這樣就要走了嗎?!好吧!");
			cm.dispose();
			return;
		}
    } else if (status == 2) {
		if (logTime != getCurrentTime2()){
			cm.sendOk("錯過這期的操作時間了!")
			cm.dispose();
			return;
		}
		typed = selection;
		if(sel == 0){
			Consume = cm.getPlayer().getLogValue(log + "_" + getMinStr(-5) + "_消耗金額");
			typed = cm.getPlayer().getLogValue(log + "_" + getMinStr(-5) + "_消耗類型");
			if (cm.getPlayer().getLogValue(log + "_" + getMinStr(-5) + "_領取") > 0 ) {
                cm.sendNext("已經領取過此次獎勵");
                cm.dispose();
                return;
            } else if( typed == 0 && (Consume*PointVector[11][2]+Consume*(Player_Old[2]))*Odds/100 + cm.getPlayer().getMeso() > 2100000000){
					cm.sendNext("領下去你的楓幣會爆炸欸~");
					cm.dispose();
					return;
			} else {
				cm.getPlayer().setLogValue(log + "_" + getMinStr(-5) + "_領取",1);
				if (CompareSize( Player_Old[1], Computer_Old[1] )) {
					if (broadcastOnReward) {
						cm.broadcastGambleMessage(3,"[妞妞系統] : 恭喜玩家<" + cm.getPlayer().getName() + ">在妞妞贏錢了~");
					}
					if ( typed == 0 ){	
						cm.gainMeso(Consume*PointVector[11][2]+(Consume*Player_Old[2] * Odds/100));
						cm.logFile("妞妞/贏楓幣.txt", cm.getReadableTime()+"<"+cm.getPlayer().getName()+">點數:"+Player_Old[1]+"領回<"+Consume*PointVector[11][2]+(Consume*Player_Old[2] * Odds/100)+">",true);
					} else if ( typed == 1 ) {
						cm.getPlayer().modifyCSPoints(2,Consume*PointVector[11][2]+(Consume*Player_Old[2] * Odds/100));
						cm.logFile("妞妞/贏楓點.txt", cm.getReadableTime()+"<"+cm.getPlayer().getName()+">點數:"+Player_Old[1]+"領回<"+Consume*PointVector[11][2]+(Consume*Player_Old[2] * Odds/100)+">",true);
					} else if ( typed == 2 ) {
						cm.getPlayer().modifyCSPoints(1,Consume*PointVector[11][2]+(Consume*Player_Old[2] * Odds/100));
						cm.logFile("妞妞/贏點數.txt", cm.getReadableTime()+"<"+cm.getPlayer().getName()+">點數:"+Player_Old[1]+"領回<"+Consume*PointVector[11][2]+(Consume*Player_Old[2] * Odds/100)+">",true);
					}
				}else {
					cm.getPlayer().setLogValue(log + "_" + getMinStr(-5) + "_領取",1);
					if ( typed == 0 ){	
						cm.gainMeso(Consume*PointVector[11][2]-Consume*Computer_Old[2]);
						cm.logFile("妞妞/輸楓幣.txt", cm.getReadableTime()+"<"+cm.getPlayer().getName()+">點數:"+Player_Old[1]+" 領回<"+(Consume*PointVector[11][2]-Consume*Computer_Old[2])+">",true);
					} else if ( typed == 1 ) {
						cm.getPlayer().modifyCSPoints(2,Consume*PointVector[11][2]-Consume*Computer_Old[2]);
						cm.logFile("妞妞/輸楓點.txt", cm.getReadableTime()+"<"+cm.getPlayer().getName()+">點數:"+Player_Old[1]+" 領回<"+(Consume*PointVector[11][2]-Consume*Computer_Old[2])+">",true);
					} else if ( typed == 2 ) {
						cm.getPlayer().modifyCSPoints(1,Consume*PointVector[11][2]-Consume*Computer_Old[2]);
						cm.logFile("妞妞/輸點數.txt", cm.getReadableTime()+"<"+cm.getPlayer().getName()+">點數:"+Player_Old[1]+" 領回<"+(Consume*PointVector[11][2]-Consume*Computer_Old[2])+">",true);
					}
				}
			cm.sendOk("謝謝光臨，歡迎下次再來玩!");
			cm.dispose();
			}
		} else if ( sel == 1 ) {
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
		} else {
			cm.sendOk("謝謝光臨，歡迎下次再來玩!");
			cm.dispose();
		}
    } else if (status == 3) {
		if (logTime != getCurrentTime2()){
			cm.sendOk("錯過這期的操作時間了!")
			cm.dispose();
			return;
		}
		if( sel == 0 ){
			cm.sendOk("謝謝光臨，歡迎下次再來玩!");
			cm.dispose();
		} else if ( sel == 1 ) {
			Consume = selection; 
			if ( typed == 0 ){
				if ( cm.getPlayer().getMeso() < Consume*PointVector[11][2] ){
					cm.sendOk("您的金額不足以負擔最慘的狀況欸，需要:"+Consume*PointVector[11][2]);
					cm.dispose();
					return;
				}else{
					cm.gainMeso(-Consume*PointVector[11][2]);
					cm.logFile("妞妞/下注紀錄.txt", cm.getCurrentTime()+"<"+cm.getPlayer().getName()+">下注楓幣<"+(Consume*PointVector[11][2])+">+押金",true);
				}
			} else if ( typed == 1 ) {
				if ( cm.getPlayer().getCSPoints(2) < Consume*PointVector[11][2] ){
					cm.sendOk("您的金額不足以負擔最慘的狀況欸，需要:"+Consume*PointVector[11][2]);
					cm.dispose();
					return;
				}else{
					cm.getPlayer().gainCash(2,-Consume*PointVector[11][2]);
					cm.logFile("妞妞/下注紀錄.txt", cm.getCurrentTime()+"<"+cm.getPlayer().getName()+">下注楓點<"+(Consume*PointVector[11][2])+">+押金",true);
				}
			} else if ( typed == 2 ) {
				if ( cm.getPlayer().getCSPoints(1) < Consume*PointVector[11][2] ){
					cm.sendOk("您的金額不足以負擔最慘的狀況欸，需要:"+Consume*PointVector[11][2]);
					cm.dispose();
					return;
				}else{
					cm.getPlayer().gainCash(1,-Consume*PointVector[11][2]);
					cm.logFile("妞妞/下注紀錄.txt", cm.getCurrentTime()+"<"+cm.getPlayer().getName()+">下注GASH<"+(Consume*PointVector[11][2])+">+押金",true);
				}
			}
			cm.getPlayer().setLogValue(log + "_" + getCurrentTime2() + "_消耗金額",Consume);
			cm.getPlayer().setLogValue(log + "_" + getCurrentTime2() + "_消耗類型",typed);
			Licensing(true); // 發牌
			text  = "#b帥哥/美女\r\n#k";
			text += "您下注的額度是"+Consume+typedName[typed]+"\r\n\r\n";
			Judgebrand(Player,PlayerP);
			text += "你目前手上的牌"+PlayerH[0]+"."+PlayerH[1]+"."+PlayerH[2]+"."+PlayerH[3]+"."+PlayerH[4]+":#b"+Player[0]+"\r\n";
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

function Licensing(key){
	var finishOne = false;
	finishOne = false;
	for ( var i = 0 ; i < 5 ; i++ ){
	  while ( !finishOne ){
		ran = parseInt(Math.random()*Name.length);
		finishOne = exambrand();
	  }
	  PlayerH[i] = Name[ran];
	  PlayerP[i] = Point[ran];
	  
	if (key) {
		cm.getPlayer().setLogValue(log + "_" + logTime + "_" + i, ran);
	}
	finishOne = false;
			
	}
}

function exambrand () {
	for(i=0;i<Player.length;i++){
		if(Player[i]==Name[ran])
			return false;
	}
	for(i=0;i<Computer.length;i++){
		if(Computer[i]==Name[ran])
			return false;
	}
	return true;
}

function Judgebrand(name,nameP){ // 1.2.3 1.2.4 1.2.5 2.3.4 2.3.5 3.4.5 五搭都要檢查紀錄大小
	if ( ( nameP[0]+nameP[1]+nameP[2]+nameP[3]+nameP[4] ) / 500 == 1 ) { // 黑龍
	    UsePoint=12;
		name[0] = PointVector[UsePoint][0];
		name[1] = PointVector[UsePoint][1];
		name[2] = PointVector[UsePoint][2];
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
	var UsePoint = 0;
  	UsePoint = nameP[first] + nameP[second];
	
	UsePoint = UsePoint % 10;
	if ( UsePoint == 0 ){
		UsePoint += 10;
	}
	if ( name[1] <= PointVector[UsePoint][1] ){
		name[0] = PointVector[UsePoint][0];
		name[1] = PointVector[UsePoint][1];
		name[2] = PointVector[UsePoint][2];
	}
}

function CompareSize( PlayerSize, ComputerSize ) { // 玩家大電腦 RETURN TRUE
	if ( PlayerSize > ComputerSize )
		return true;
	else
		return false;
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


function getChrNumberArray_OLD(mode) {
    var tmpArray = [];
    for (var i = 0; i <= 4; i++) {
        if (cm.getPlayer().getLogValue(log + "_" + getMinStr(-5) + "_" + i) == -1) {
            return null;
        }
		
		if ( mode == 1 ) 
			tmpArray.push(Name[cm.getPlayer().getLogValue(log + "_" + getMinStr(-5) + "_" + i)]);
		if ( mode == 2 )
			tmpArray.push(Point[cm.getPlayer().getLogValue(log + "_" + getMinStr(-5) + "_" + i)]);
    }
    return tmpArray;
}

function getChrNumberArray(mode) {
    var tmpArray = [];
    for (var i = 0; i <= 4; i++) { 
		if (cm.getPlayer().getLogValue(log + "_" + getCurrentTime2() + "_" + i) == -1) {
            return null;
        }
		if ( mode == 1 ) 
			tmpArray.push(Name[cm.getPlayer().getLogValue(log + "_" + getCurrentTime2() + "_" + i)]);
		if ( mode == 2 )
			tmpArray.push(Point[cm.getPlayer().getLogValue(log + "_" + getCurrentTime2() + "_" + i)]);
    }
    return tmpArray;
}


function showChrNumber(mode) {
    var message = "";
    for (var i = 0; i <= 4; i++) {
		if ( mode == 1 ) 
			message += Name[cm.getPlayer().getLogValue(log + "_" + getCurrentTime2() + "_" + i)] +" ";
		if ( mode == 2 )
			message += Point[cm.getPlayer().getLogValue(log + "_" + getCurrentTime2() + "_" + i)] + " ";
    }
    return message;
}


function 初始化(){
	Player =["無妞",0,0];
	PlayerH =[];
	PlayerP =[];
}