var status = -1;
var sel = -1, typeSel = -1;
var 開關_每日里程任務 = true;
var 開關_永久里程任務 = true;
var 開關_每日里程商店 = true;
var 開關_永久里程商店 = true;
var 開關_累積里程獎勵 = true; // 總里程累積獎
var 開關_一鍵領取功能 = true;
var 每日里程任務隨機開關 = [true,5]; // [隨機,挑選幾個]
/*每日里程任務類別
各式LOG
[[log名稱,需要次數,0 = acc 1 = chr],"中文顯示",coin]
*/
var 每日里程任務 = [
[["",100,0],"1",1],
[["",100,0],"1",1],
[["",100,0],"1",1],
[["",100,0],"1",1],
[["",100,0],"1",1],
[["",100,0],"1",1]
];

/*永久里程任務類別
各式LOG
[[log名稱,需要次數,0 = acc 1 = chr],"中文顯示",coin]
*/
var 永久里程任務 =[
];

var 每日里程商店 = [
[50,2432046,1],//黃金蘋果可交易
[80,2432059,1],//電池隨機相
[30,2432047,1],//卷軸相
[80,2432042,1],//1-50紅利
[130,2432043,1],//100-200紅利
[100,4008032,1],
[50,2022670,1],
[50,2022533,1],
[100,2432062,1],//突破石3w
];

var 累積里程商店 = [
];

var 總里程累積獎 = [
	//[達成里程,[類別,代碼,數量,全能,攻擊,天數]
	// 類別分類 0 物品 1 GASH 2 楓點 3 楓幣 4 紅利
	[1000000,
	[0,2450000,1,0,0,0]
	]
];
var tmpList = [];

function start() {
	if ( 每日里程任務隨機開關[0] && cm.getPlayer().getAccLog("每日隨機里程任務列表") == null ) {
		var remStr = "";
		var list = [];
		var newlist = [];
		for ( var i = 0 ; i < 每日里程任務.length ; i++ ) {
			list.push(i);
		}
		for ( var i = 0 ; i < 每日里程任務隨機開關[1] ; i++ ) {
			ran = Math.floor(Math.random()*list.length);
			newlist.push(list[ran]);
			list.splice(ran,1);
		}
		newlist.sort(function(a, b){return a - b}); 
		for ( var i = 0 ; i < newlist.length ; i++ ) {
			remStr += newlist[i];
			if ( i + 1 < newlist.length )
				remStr += "_";
		}
		cm.getPlayer().setAccDailyLog("每日隨機里程任務列表",remStr);
	}
	if ( 每日里程任務隨機開關[0] ) {
		var str = cm.getPlayer().getAccLog("每日隨機里程任務列表");
		var list = str.split("_");
		for ( var i = 0 ; i < list.length ; i++ ) {
			tmpList.push(每日里程任務[parseInt(list[i])]);
		}
	} else {
		tmpList = 每日里程任務;
	}
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
	if ( status >= 1 && ( ( typeSel == 0 && !開關_每日里程任務 ) || ( typeSel == 1 && !開關_永久里程任務 ) || ( typeSel == 2 && !開關_每日里程商店 ) || ( typeSel == 3 && !開關_永久里程商店 ) || ( typeSel == 4 && !開關_一鍵領取功能 )|| ( typeSel == 5 && !開關_累積里程獎勵 ) ) ) {
		cm.dispose();
		return;
	}
	var 當日里程點數 = getAccLogValue("當日里程點數",0);
	var 累積里程點數 = getAccLogValue("累積里程點數",0);
	var 總得里程點數 = getAccLogValue("總得里程點數",0);
	if (status == 0) {
        var msg = "\t\t\t\t\t#r#e<里 程 系 統>\r\n#b#n每天通關里程即可獲得#e里程點數#n，累積里程點數可至里程商店兌換許多獎品喔!\r\n#d請注意：#r「每日凌晨00:00點」#d將會#r「重置每日里程點數」\r\n#d請在重置前花完里程點數#r「每日里程點數」#k#n\r\n";
		msg += "\r\n\t\t\t\t#r目前您的當日里程點數:"+當日里程點數 + "";
		msg += "\r\n\t\t\t\t#r目前您的永久里程點數:"+累積里程點數 + "";
		msg += "\r\n\t\t\t\t#r目前累積當日里程點數:"+總得里程點數 + "";
		msg += "\r\n"
		if ( 開關_每日里程任務 ) 
			msg += "\t\t\t   #b#L0##i2180000#每日里程任務#l\r\n";
		if ( 開關_永久里程任務 ) 
			msg += "\t\t\t   #b#L1##i2180000#永久里程任務#l\r\n";
		if ( 開關_每日里程商店 ) 
			msg += "\t\t\t   #b#L2##i2180000#每日里程商店#l\r\n";
		if ( 開關_永久里程商店 ) 
			msg += "\t\t\t   #b#L3##i2180000#累積里程商店#l\r\n";
		if ( 開關_一鍵領取功能 ) 
			msg += "\t\t\t   #r#L4##i2180000#一鍵領取里程#l\r\n";
		if ( 開關_累積里程獎勵 ) 
			msg += "\t\t\t   #r#L5##i2180000#總里程累積獎#l\r\n";
        cm.sendSimple(msg);
	} else if ( status == 1 ) {
		typeSel = selection;
		switch (typeSel) {
			case 0 : 
				var message = "\t請選擇要領取的每日里程任務\r\n";
				for ( var i in tmpList ){
					message += "#L"+i+"#"+( cm.getPlayer().getAccLogValue(tmpList[i][1]) > 0 ? "#e#b【已領取】#n":"#r#n【未領取】#b");
					message += "#d"+tmpList[i][1] +"  #b里程值:" + tmpList[i][2] + "\r\n"
				}
				cm.sendSimple(message);
				break;
			case 1 :
				var message = "\t請選擇要領取的永久里程任務\r\n";
				for ( var i in 永久里程任務 ){
					message += "#L"+i+"#"+( cm.getPlayer().getAccLogValue(永久里程任務[i][1]) > 0 ? "#e#b【已領取】#n":"#r#n【未領取】#b");
					message += "#d"+永久里程任務[i][1] +"  #b里程值:" + 永久里程任務[i][2] + "\r\n"
				}
				cm.sendSimple(message);
				break;
			case 2 :
				var message = "請選擇要兌換的商品(每日)\r\n";
				message += "目前當日里程點:"+當日里程點數+"\r\n";
				for ( var i in 每日里程商店 ){
					message += "#L"+i+"##b使用 #r"+每日里程商店[i][0] +"#b 里程值 兌換 #t" + 每日里程商店[i][1] + "##i" + 每日里程商店[i][1] + "##r * " + 每日里程商店[i][2] + "\r\n"
				}
				cm.sendSimple(message);
				break;
			case 3 :
				var message = "請選擇要兌換的商品(永久)\r\n";
				message += "目前累積里程點:"+累積里程點數+"\r\n";
				for ( var i in 累積里程商店 ){
					message += "#L"+i+"##b使用 #r"+累積里程商店[i][0] +"#b 里程值 兌換 #t" + 累積里程商店[i][1] + "##i" + 累積里程商店[i][1] + "##r * " + 累積里程商店[i][2] + "\r\n"
				}
				cm.sendSimple(message);
				break;
			case 4 :
				for ( var i = 0 ; 開關_每日里程任務 && i < tmpList.length ; i++ ) {
					if ( cm.getPlayer().getAccLogValue(tmpList[i][1]) < 0 ) {
						var tempTime = ( tmpList[i][0][2] == 0 ? cm.getPlayer().getAccLogValue(tmpList[i][0][0]) : cm.getPlayer().getLogValue(tmpList[i][0][0]) );
						if ( tempTime >= tmpList[i][0][1] ) {
							cm.getPlayer().addAccDailyLogValue(tmpList[i][1],1);
							cm.getPlayer().addAccDailyLogValue("當日里程點數",tmpList[i][2]);
							cm.getPlayer().addAccLogValue("累積里程點數",tmpList[i][2]);
							cm.getPlayer().addAccDailyLogValue("總得里程點數",tmpList[i][2]);
							cm.dropMessage("完成("+tmpList[i][1]+")，已給予里程值:"+tmpList[i][2]);
						}
					}
				}
				for ( var i = 0 ; 開關_永久里程任務 && i < 永久里程任務.length ; i++ ) {
					if ( cm.getPlayer().getAccLogValue(永久里程任務[i][1]) < 0 ) {
						var tempTime = ( 永久里程任務[i][0][2] == 0 ? cm.getPlayer().getAccLogValue(永久里程任務[i][0][0]) : cm.getPlayer().getLogValue(永久里程任務[i][0][0]) );
						if ( tempTime >= 永久里程任務[i][0][1] ) {
							cm.getPlayer().addAccLogValue(永久里程任務[i][1]);
							cm.getPlayer().addAccDailyLogValue("當日里程點數",永久里程任務[i][2]);
							cm.getPlayer().addAccLogValue("累積里程點數",永久里程任務[i][2]);
							cm.getPlayer().addAccDailyLogValue("總得里程點數",永久里程任務[i][2]);
							cm.dropMessage("完成("+永久里程任務[i][1]+")，已給予里程值:"+永久里程任務[i][2]);
						}
					}
				}
				cm.dispose();
				break;
			case 5 :
				var message = "請選擇要領取的累積獎勵\r\n";
				message += "目前總累積里程點:"+總得里程點數+"\r\n"
				for ( var i in 總里程累積獎 ){
					message += "#L"+i+"##b領取達到#r"+總里程累積獎[i][0] +"#b累積里程獎勵#l\r\n";
				}
				cm.sendSimple(message);
				break;
		}
	} else if ( status == 2 ) {
		sel = selection;
		if ( typeSel == 0 ) {
			if ( cm.getPlayer().getAccLogValue(tmpList[sel][1]) > 0 ) {
				cm.sendOk("今日已經完成此里程任務");
				cm.dispose();
				return;
			} else {
				var tempTime = ( tmpList[sel][0][2] == 0 ? cm.getPlayer().getAccLogValue(tmpList[sel][0][0]) : cm.getPlayer().getLogValue(tmpList[sel][0][0]) );
				if ( tempTime >= tmpList[sel][0][1] ) {
					cm.getPlayer().addAccDailyLogValue(tmpList[sel][1],1);
					cm.getPlayer().addAccDailyLogValue("當日里程點數",tmpList[sel][2]);
					cm.getPlayer().addAccLogValue("累積里程點數",tmpList[sel][2]);
					cm.getPlayer().addAccDailyLogValue("總得里程點數",tmpList[sel][2]);
					cm.sendOk("完成里程任務，已給予里程值:"+tmpList[sel][2]);
				} else {
					cm.sendOk("不足資格，只有"+tempTime+"，需要:"+tmpList[sel][0][1]+"");
				}
			}
		} else if ( typeSel == 1 ) {
			if ( cm.getPlayer().getAccLogValue(永久里程任務[sel][1]) > 0 ) {
				cm.sendOk("今日已經完成此里程任務");
				cm.dispose();
				return;
			} else {
				var tempTime = ( 永久里程任務[sel][0][2] == 0 ? cm.getPlayer().getAccLogValue(永久里程任務[sel][0][0]) : cm.getPlayer().getLogValue(永久里程任務[sel][0][0]) );
				if ( tempTime >= 永久里程任務[sel][0][1] ) {
					cm.getPlayer().addAccLogValue(永久里程任務[sel][1]);
					cm.getPlayer().addAccDailyLogValue("當日里程點數",永久里程任務[sel][2]);
					cm.getPlayer().addAccLogValue("累積里程點數",永久里程任務[sel][2]);
					cm.getPlayer().addAccDailyLogValue("總得里程點數",永久里程任務[sel][2]);
					cm.sendOk("完成里程任務，已給予里程值:"+永久里程任務[sel][2]);
				} else {
					cm.sendOk("不足資格，只有"+tempTime+"，需要:"+永久里程任務[sel][0][1]+"");
				}
			}
		} else if ( typeSel == 2 ) {
			if ( 當日里程點數 < 每日里程商店[sel][0] ){
				cm.sendOk("里程值不足，需要"+每日里程商店[sel][0] );
				cm.dispose();
				return;
			} else if ( !cm.getPlayer().canHold(每日里程商店[sel][1],每日里程商店[sel][2]) ) {
				cm.sendOk("空間不足，請確認一下~");
				cm.dispose();
				return;
			} else {
				cm.gainItem(每日里程商店[sel][1],每日里程商店[sel][2]);
				cm.getPlayer().addAccDailyLogValue("當日里程點數",-每日里程商店[sel][0]);
				cm.logFile("里程系統/每日里程商店.txt", cm.getReadableTime() + "玩家<"+cm.getPlayer().getName()+">完成消耗"+每日里程商店[sel][0]+"里程值兌換了 <"+每日里程商店[sel][1]+" * " +每日里程商店[sel][2]+">",false);	
				cm.sendOk("完成消耗"+每日里程商店[sel][0]+"里程值兌換了 #i"+每日里程商店[sel][1]+"##t"+每日里程商店[sel][1]+" * " + 每日里程商店[sel][2]);
				cm.dispose();
				return;
			}
		} else if ( typeSel == 3 ) {
			if ( 累積里程點數 < 累積里程商店[sel][0] ){
				cm.sendOk("里程值不足，需要"+累積里程商店[sel][0] );
				cm.dispose();
				return;
			} else if ( !cm.getPlayer().canHold(累積里程商店[sel][1],累積里程商店[sel][2]) ) {
				cm.sendOk("空間不足，請確認一下~");
				cm.dispose();
				return;
			} else {
				cm.gainItem(累積里程商店[sel][1],累積里程商店[sel][2]);
				cm.getPlayer().addAccLogValue("累積里程點數",-累積里程商店[sel][0]);
				cm.logFile("里程系統/累積里程商店.txt", cm.getReadableTime() + "玩家<"+cm.getPlayer().getName()+">完成消耗"+累積里程商店[sel][0]+"里程值兌換了 <"+累積里程商店[sel][1]+" * " +累積里程商店[sel][2]+">",false);	
				cm.sendOk("完成消耗"+累積里程商店[sel][0]+"里程值兌換了 #i"+累積里程商店[sel][1]+"##t"+累積里程商店[sel][1]+" * " + 累積里程商店[sel][2]);
				cm.dispose();
				return;
			}
		} else if ( typeSel == 5 ) {
			if ( 總得里程點數 < 總里程累積獎[sel][0] ){
				cm.sendOk("里程值不足，需要"+總里程累積獎[sel][0] );
				cm.dispose();
				return;
			} else if ( !cm.hasAllSpace(總里程累積獎[sel].length-1) ) {
				cm.sendOk("空間不足，請確認一下~");
				cm.dispose();
				return;
			}
			var message = "是否要領取#b達到#r"+總里程累積獎[sel][0] +"#b 里程值獎勵\r\n內容包含以下物品\r\n"+ShowList(sel)+"#l\r\n";
			cm.sendYesNo(message);
		}
	} else if ( status == 3 ) {
		if ( typeSel == 5 ) {
			if ( 總得里程點數 < 總里程累積獎[sel][0] ){
				cm.sendOk("里程值不足，需要"+總里程累積獎[sel][0] );
				cm.dispose();
				return;
			} else if ( !cm.hasAllSpace(總里程累積獎[sel].length-1) ) {
				cm.sendOk("空間不足，請確認一下~");
				cm.dispose();
				return;
			} else if ( cm.getPlayer().getAccLogValue("總得里程點數_每日"+總里程累積獎[sel][0]+"獎") > 0 ) {
				cm.sendOk("已領取過該獎勵了...");
				cm.dispose();
				return;
			} else {
				for(var k = 1; k < 總里程累積獎[sel].length ;k++){
					if(總里程累積獎[sel][k][0] == 0&&(總里程累積獎[sel][k][3]>0||總里程累積獎[sel][k][4]>0))	
						gainStatItem(總里程累積獎[sel][k][1], 總里程累積獎[sel][k][3], 總里程累積獎[sel][k][4], -1,總里程累積獎[sel][k][5]);
					else if(總里程累積獎[sel][k][0]==0&&總里程累積獎[sel][k][5]>0){
						cm.gainItemPeriod(總里程累積獎[sel][k][1],總里程累積獎[sel][k][2],總里程累積獎[sel][k][5]);
					}else if(總里程累積獎[sel][k][0] == 0){
						if(總里程累積獎[sel][k][1]<2000000)
							cm.gainItem(總里程累積獎[sel][k][1],false);
						else
							cm.gainItem(總里程累積獎[sel][k][1],總里程累積獎[sel][k][2]);
					}else if(總里程累積獎[sel][k][0] == 1)
						cm.getPlayer().gainCash(1, 總里程累積獎[sel][k][1]);
					else if(總里程累積獎[sel][k][0] == 2)
						cm.getPlayer().gainCash(2, 總里程累積獎[sel][k][1]);
					else if(總里程累積獎[sel][k][0] == 3)
						cm.gainMeso(總里程累積獎[sel][k][1]);
					else if(總里程累積獎[sel][k][0] == 4)
						gainTTPoint(總里程累積獎[sel][k][1]);
				}
				cm.getPlayer().addAccDailyLogValue("總得里程點數_每日"+總里程累積獎[sel][0]+"獎",1);
				cm.sendOk("完成消耗領取總累積里程獎勵"+總里程累積獎[sel][0]);
				cm.dispose();
				return;
			}
		}
	}
}

function getAccLogValue(log,preset) {
	var coin = cm.getPlayer().getAccLogValue(log);
	if ( coin < 0 ) {
		return preset;
	} else {
		return coin;
	}
}

function ShowList( seles ){
	var str = "";
	var tt_item = 總里程累積獎[seles];
	var t_item = tt_item[1];
	for( var i = 1 ; i<tt_item.length ; i++ ){
		t_item = tt_item[i];
		if(t_item[0]==0){
			str+="\t#b物品:#i"+t_item[1]+":##t"+t_item[1]+":# * "+t_item[2]+"" ;
			str+="\t";
			if(t_item[1]<2000000&&(t_item[3]>0||t_item[4]>0)||t_item[5]>0)	{
				if(t_item[5]>0)
					str+="#r "+t_item[5]+" 天";
				if(t_item[1]<2000000&&(t_item[3]>0||t_item[4]>0))
					str+="\r\n\t#r4屬性 + "+t_item[3]+" 攻擊/魔法攻擊力 + "+t_item[4]+" ";
			}
		}else if(t_item[0]==1){
			str+="\t#bGASH點數: #r"+t_item[1]+"#b點";
		}else if(t_item[0]==2){
			str+="\t#b楓葉點數: #r"+t_item[1]+"#b點";
		}else if(t_item[0]==3){
			if ( t_item[1]>=100000000 )
				str+="\t#b楓幣:#r"+t_item[1]/100000000+"#b億元";
			else if(t_item[1]>=10000)
				str+="\t#b楓幣:#r"+t_item[1]/10000+"#b萬元";
			else
				str+="\t#b楓幣:#r"+t_item[1]+"#b元";
		}else if(t_item[0]==4){
			str+= "\t#b紅利: #r"+t_item[1]+"#b點";
		}
		str+="\r\n";
	}
	return str;
}

function gainTTPoint(value) {
	cm.getPlayer().addAccLogValue("紅利",value);
}
