var status = -1;
var eim;
function start() {
	action(1,0,0);
}

function action(mode,type,selection) {
	if ( mode == 1 ) {
		status++;
	} else {
		cm.dispose();
		return;
	}
    em = cm.getEventManager("Werewolf-10");
    eim = em.getInstance("Werewolf-10-" + cm.getClient().getChannel());
	if ( status == 0 ) {
		var msg = "請問你要做甚麼呢?#b\r\n";
		if ( eim != null ) {
			msg += "#L0#遊戲說明\r\n";
			msg += "#L1#歷史追溯";
		}
		cm.sendSimple(msg);
	} else if ( status == 1 ) {
		if ( selection == 0 ) {
			var msg = "狼人殺遊戲說明\r\n";
			msg += "角色配置: #r3 狼 3 神（預言家，女巫，獵人），4 平民#k\r\n";
			msg += "首夜刀中女巫可以自救。屠邊\r\n";
			msg += "發牌完後流程如下\r\n";
			msg += "1.天黑狼人現身，投票決定殺人(建議開訊息窗)\r\n";
			msg += "2.女巫現身，決定使用解藥、毒藥。(擇一使用)\r\n";
			msg += "3.預言家現身，選擇查驗對象 \r\n";
			msg += "4.獵人現身，查看開槍手勢\r\n";
			msg += "5.白天宣告死亡(第一天發表遺言)不是第一天就開始討論投票\r\n";
			msg += "6.被投出者遺言時間 接著即將進入天黑";
			cm.sendOk(msg);
			cm.dispose();
			return;
		} else {
			var day = parseInt(eim.getProperty("day")) - 1 ;
			if ( day < 0 ) {
				cm.sendOk("沒有歷史可以追溯");
				cm.dispose();
				return;
			} else {
				var msg = "狼人殺歷史追溯\r\n";
				if ( eim.getProperty("status") == "100" )
					day++;
				if ( eim.getIntProperty("status") >= 100 ) {
					msg += "#L0##b查看身分表#l\r\n";
				}
				for ( var i = 1 ; i <= day ; i++ ) {
					msg += "#L"+i+"##b查看第 #r" + i + " #b天情況#k#l\r\n";
				}
				cm.sendNext(msg);
				return;
			}
		}
	} else if ( status == 2 ) {
		if ( selection == 0 ) {
			var msg = "狼人殺角色列表\r\n";
			for ( var i = 0 ; i < eim.getPlayers().length ; i++ ) {
				msg += "#b角色名稱 : #r"+eim.getPlayers()[i].getName()+"#k 身分為 #r"+eim.getProperty(eim.getPlayers()[i].getName()+"_身分")+"\r\n";
			}
			cm.sendOk(msg);
			cm.dispose();
		} else {
			var day = parseInt(eim.getProperty("day")) - 1 ;
			if ( eim.getProperty("status") == "100" )
				day++;
			if ( day < selection ) {
				cm.sendOk("沒有歷史可以追溯");
				cm.dispose();
				return;
			} else {
				var msg = "狼人殺第"+selection+"天歷史追溯\r\n";
				if ( eim.getIntProperty("status") >= 100 ) {
					msg += 狼人情況(selection);
					msg += 女巫情況(selection);
					msg += 預言家情況(selection);
					msg += 獵人情況(selection);
				}
				msg += 白天情況(selection);
				cm.sendOk(msg);
				cm.dispose();
				return;
			}
		}
	} else {
		cm.dispose();
	}
}

function 狼人情況(day) {
	var msg = "";
	if ( eim.getProperty(day+"日狼人行動者") == null || eim.getProperty(day+"日狼人落刀者") == null ) {
		return "#e#r暫無#k#n";
	} else {
		var wolfStr = eim.getProperty(day+"日狼人行動者");
		var killedStr = eim.getProperty(day+"日狼人落刀者");
		var wolfList = wolfStr.split("_");
		var killedList = killedStr.split("_");
		msg = "#d★狼人陣營投票資訊如下#k\r\n";
		for ( var i = 0 ; i < wolfList.length ; i++ ) {
			msg += "#b狼人:#r#e"+wolfList[i]+"#n#b投給#r#e"+killedList[i]+"#n\r\n";
		}
	}
	msg += "#b被殺者:#r" + getWolfKilled(day) + "#k\r\n"
	return msg;
}

function 女巫情況(day) {
	var msg = "";
	var 毒藥 = eim.getProperty("毒藥使用");
	var 解藥 = eim.getProperty("解藥使用");
	if ( 解藥.split("_")[0] == day || 毒藥.split("_")[0] == day )
		msg = "#d★女巫執行資訊如下#k\r\n";
	if ( 解藥 != null && 解藥.split("_")[0] == day )
		msg += "第"+解藥.split("_")[0]+"天對#r"+解藥.split("_")[1]+"#k解救\r\n";
	if ( 毒藥 != null && 毒藥.split("_")[0] == day )
		msg += "第"+毒藥.split("_")[0]+"天對#r"+毒藥.split("_")[1]+"#k下毒\r\n";
	return msg;
}

function 預言家情況(day) {
	var msg = "";
	if ( eim.getProperty(day+"日查驗結果") != null ) {
		msg = "#d★預言家執行資訊如下#k\r\n";
		msg += "#k"+day+"日查驗結果:#r"+eim.getProperty(day+"日查驗結果")+"\r\n";
	}
	return msg;
}

function 獵人情況(day) {
	var msg = "";
	var 明槍 = eim.getProperty(day+"日明槍");
	var 驅逐明槍 = eim.getProperty(day+"日驅逐明槍");
	if ( 明槍 != null ) {
		msg = "#d★獵人執行資訊如下#k\r\n";
		msg += "被殺死向#r"+明槍+"#k開槍\r\n";
	}
	if ( 驅逐明槍 != null ) {
		msg = "#d★獵人執行資訊如下#k\r\n";
		msg += "被驅逐向#r"+驅逐明槍+"#k開槍\r\n";
		
	}
	return msg;
}

function 白天情況(day) {
	var msg = "";
	if ( eim.getProperty(day+"自爆") != null ) {
		msg = "#d★白天資訊如下#k\r\n";
		msg += "#r"+eim.getProperty(day+"自爆")+"#k自爆了\r\n";
	} else {
		var wolfStr = eim.getProperty(day+"投票者");
		var killedStr = eim.getProperty(day+"被投者");
		var wolfList = wolfStr.split("_");
		var killedList = killedStr.split("_");
		msg = "#d★白天投票資訊如下#k\r\n";
		for ( var i = 0 ; i < wolfList.length ; i++ ) {
			if ( wolfList[i] == "?" )
				continue;
			msg += "#b玩家:#r#e"+wolfList[i]+"#n#b投給#r#e"+killedList[i]+"#n\r\n";
		}
		msg += "#b被驅逐者:#r" + getVotedKilled(day) + "#k\r\n"
	}
	return msg;
}

function findMostOfList(list) {
	var counter_list = [];
	var size = list.length;
	for ( var i = 0 ; i < size ; i++ ) {
		var find = false;
		var tmpSize = counter_list.length;
		for ( var j = 0 ; j < tmpSize ; j++ ) {
			if ( list[i] == counter_list[j][0] ) {
				counter_list[j][1]++;
				find = true;
			}
		}
		if ( !find && list[i] != "?" ) {
			counter_list.push([list[i],1]);
		}
	}
	size = counter_list.length;
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size - i - 1 ; j++) { 
			if (counter_list[j][1] <= counter_list[j+1][1]) {
				let tempValue = counter_list[j];
				counter_list[j] = counter_list[j + 1];
				counter_list[j + 1] = tempValue;
			}
		}
	}
	if ( size == 0 || ( size >= 2 && counter_list[0][1] == counter_list[1][1] ) )
		return "";
	return counter_list[0][0];
}

function getWolfKilled(day) {
	var killedList = getWolfKilledList(day);
	return findMostOfList(killedList);
}

function getWolfVotedList(day) {
	var wolfStr = eim.getProperty(day+"日狼人行動者");
	var wolfList = wolfStr.split("_");
	return wolfList;
}

function getWolfKilledList(day) {
	var killedStr = eim.getProperty(day+"日狼人落刀者");
	var killedList = killedStr.split("_");
	return killedList;
}

function getVotedKilled(day) {
	var killedList = getVotedList(day);
	return findMostOfList(killedList);
}

function getVotedList(day) {
	var killedStr = eim.getProperty(day+"被投者");
	var killedList = killedStr.split("_");
	return killedList;
}