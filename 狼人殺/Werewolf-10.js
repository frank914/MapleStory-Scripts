var setupTask;
var isPq = true;
var 斷線回傳最大時間 = 5*60*1000;
var tChannel = -1;
var minPlayers = 10, maxPlayers = 10;
var minLevel = 10, maxLevel = 255;
var entryMap = 910090410;
var exitMap = 910000000;
var recruitMap = 910000000;

// 地圖範圍
var mapList = [910090410,993073000];

// 死亡人數限制
var diedLimitMode = -1 ;// -1 死到沒人回不去 0 死不管怎樣都能回去 1 全隊死亡最高次數限制
var diedTime = 5;

var playerPool = [];
// 角色池
var cardPool = [];
var cardPool2 = ["平民","平民","平民","平民","狼人","狼人","狼人","預言家","女巫","獵人"];
var lobbyRange = 7;

var cardInfo = [
// [身分,好壞,技能]
["平民","正義",[]],
["預言家","正義",["查驗"]],
["女巫","正義",["毒藥","解藥"]],
["獵人","正義",["明槍"]],
["狼人","邪惡",["刀"]]
];
var 狼人殺人時間 = 60; // 秒
var 女巫救人時間 = 20; // 秒
var 女巫下毒時間 = 30; // 秒
var 預言家查時間 = 30; // 秒
var 獵人指槍時間 = 15; // 秒
var 死亡遺言時間 = 45; // 秒
var 驅逐討論時間 = 300; // 秒
var 一般遺言時間 = 60; // 秒
var 結束緩衝時間 = 600; // 秒

function inMapList(id){
	for (var i = 0;i<mapList.length;i++){
		if (mapList[i]==id)
			return true;
	}
	return false;
}

function gainCard(chr) {
	for ( var i = 0 ; i < playerPool.length ; i++ ) {
		if ( chr.getName() == playerPool[i][0] ) {
			return;
		}
	}
	if ( cardPool.length > 0 ) {
		var tmpList = [];
		tmpList.push(chr.getName());
		var cardPos = Math.floor(Math.random()*cardPool.length);
		var cardName = cardPool[cardPos];
		cardPool.splice(cardPos,1);
		var infoPos = -1;
		for ( var i = 0 ; i < cardInfo.length ; i++ ){
			if ( cardInfo[i][0] == cardName ) {
				infoPos = i ;
				break;
			}
		}
		if ( infoPos == -1 ){
			chr.dropMessage(6,"[Error] : 獲取到異常卡牌 " + cardName);
		}
		tmpList.push(cardInfo[infoPos]);
		playerPool.push(tmpList);
		var eim = em.getInstance("Werewolf-10-" + tChannel);
		eim.setProperty(chr.getName()+"_身分",cardInfo[infoPos][0]);
		eim.setProperty(chr.getName()+"_陣營",cardInfo[infoPos][1]);
		eim.setProperty(chr.getName()+"_狀態","存活");
		for ( var i = 0 ; i < cardInfo[infoPos][2].length ; i++ ) {
			eim.setProperty(chr.getName()+"_"+cardInfo[infoPos][2][i],1);
		}
	} else {
		if ( eim.getProperty("day") != "0" )
			chr.dropMessage(6,"沒有卡牌可以抽了");
	}
}

function init() {
    setEventRequirements();
}

function getMaxLobbies() {
    return lobbyRange;
}

function setEventRequirements() {
    var reqStr = "";

    reqStr += "\r\n    玩家數量: ";
    if (maxPlayers - minPlayers >= 1)
        reqStr += minPlayers + " ~ " + maxPlayers;
    else
        reqStr += minPlayers;

    reqStr += "\r\n    等級範圍: ";
    if (maxLevel - minLevel >= 1)
        reqStr += minLevel + " ~ " + maxLevel;
    else
        reqStr += minLevel;


    em.setProperty("party", reqStr);
}

function getEligibleParty(party) { //selects, from the given party, the team that is allowed to attempt this event
    var eligible = em.newPartyChrList();
    var hasLeader = false;
    if (party.size() > 0) {
        var partyList = party.toArray();
        for (var i = 0; i < party.size(); i++) {
            var ch = partyList[i];
            if (ch.getMapId() == recruitMap && ch.getLevel() >= minLevel && ch.getLevel() <= maxLevel) {
                if (ch.isLeader())
                    hasLeader = true;
                eligible.add(ch);
            }
        }
    }
    if (!(hasLeader && eligible.size() >= minPlayers && eligible.size() <= maxPlayers))
        eligible = em.newPartyChrList();
    return eligible;
}

function setup(channel) {
	tChannel = channel;
	cardPool = [];
	for ( var i in cardPool2 )
		cardPool.push(cardPool2[i]);
	playerPool = [];
    var eim = em.newInstance("Werewolf-10-" + channel);
    eim.setProperty("canJoin", 1);
    eim.setProperty("status", 0);
    eim.setProperty("day", 0);
	broadCast("遊戲將在倒數結束後發牌!!請做好準備!!!!",0);
    eim.startEventTimer(15*1000);
	var level = 1;
	eim.getInstanceMap(910090410).resetPQ(level);
	eim.getMapInstance(910090410).resetFully();
	eim.getMapInstance(910090410).destroyNPC(1013440);
    return eim;
}

function afterSetup(eim) {}

function broadCast(msg,mode){
    var eim = em.getInstance("Werewolf-10-" + tChannel);
	if ( mode == 0 ) {
		eim.dropMessage(6,msg);
		eim.getMapInstance(910090410).startBlowWeatherEffect(msg,5120006,10*1000);
		eim.getMapInstance(993073000).startBlowWeatherEffect(msg,5120006,10*1000);
	} else if ( mode == 1 ) {
		eim.dropMessage(6,msg);
		eim.getMapInstance(910090410).startBlowWeatherEffect(msg,5120006,10*1000);
	} else {
		eim.dropMessage(6,msg);		
	}
}

function playerEntry(eim, player) {
	if ( player == null )
		return;
    var map = eim.getMapInstance(entryMap);
    player.changeMap(map, map.getPortal(0));
	gainCard(player);
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

function getVotedKilled(day) {
	var killedList = getVotedList(day);
	return findMostOfList(killedList);
}

function getVotedList(day) {
    eim = em.getInstance("Werewolf-10-" + tChannel);
	var killedStr = eim.getProperty(day+"被投者");
	var killedList = killedStr.split("_");
	return killedList;
}

function getWolfVotedList(day) {
    eim = em.getInstance("Werewolf-10-" + tChannel);
	var wolfStr = eim.getProperty(day+"日狼人行動者");
	var wolfList = wolfStr.split("_");
	return wolfList;
}

function getWolfKilledList(day) {
    eim = em.getInstance("Werewolf-10-" + tChannel);
	var killedStr = eim.getProperty(day+"日狼人落刀者");
	var killedList = killedStr.split("_");
	return killedList;
}

function scheduledTimeout(eim) {
	var stat = eim.getProperty("status");
	var day = eim.getProperty("day");
	if ( eim.getProperty(day+"投票者") == null || eim.getProperty(day+"被投者") == null ) { 
		eim.setProperty(day+"投票者","?_?_?_?_?_?_?_?_?_?");
		eim.setProperty(day+"被投者","?_?_?_?_?_?_?_?_?_?");
	}
	if ( eim.getProperty(day+"日狼人行動者") == null || eim.getProperty(day+"日狼人落刀者") == null ) { 
		eim.setProperty(day+"日狼人行動者","?_?_?");
		eim.setProperty(day+"日狼人落刀者","?_?_?");
	}
	if ( stat > 99 ) {
		end(eim);
	if ( checkEnd() && parseInt(day) > 0 )
		return;
	} else if ( stat == 0 ) { // 發牌
		var list = eim.getPlayers();
		eim.setProperty("day", parseInt(day)+1);
		var msg = "【狼人殺遊戲公告】：15秒後開始，請做好準備!";
		broadCast(msg,0);
		for ( var i = 0 ; i  < list.length ; i++ ) {
			gainCard(list[i]);
		}
		for ( var i = 0 ; i  < list.length ; i++ ) {
			chr = list[i];
			for ( var j = 0 ; j < playerPool.length ; j++ ) {
				if ( chr.getName() == playerPool[j][0] ) {
					chr.dropMessage(6,"你的身分卡牌是 : " + playerPool[j][1][0]);
					break;
				}
			}
		}
		eim.startEventTimer(15*1000);
	} else if ( stat == 1 ) { // 進入天黑，狼人現身投票殺人
		var msg = "【第"+day+"天夜晚】：天黑請閉眼，狼人現身請殺人。";
		broadCast(msg,0);
		var list = eim.getPlayers();
		for ( var i = 0 ; i  < list.length ; i++ ) {
			chr = list[i];
			身分 = eim.getProperty(chr.getName()+"_身分");
			if ( 身分 == "狼人" )
				chr.dropMessage(5,"【邪惡陣營/狼人提示】: 請點選NPC決定要下手的對象。");
			if ( 身分 == "女巫" || 身分 == "預言家" || 身分 == "獵人" )
				chr.dropMessage(5,"【正義陣營/"+身分+"提示】: 請記得您是神職，"+身分);
		}
		eim.startEventTimer(狼人殺人時間*1000);
	} else if ( stat == 2 ) {
		var wolfKilled = getWolfKilled(day);
		var list = eim.getPlayers();
		for ( var i = 0 ; i  < list.length ; i++ ) {
			chr = list[i];
			身分 = eim.getProperty(chr.getName()+"_身分");
			if ( 身分 == "狼人" )
				if ( wolfKilled != "" )
					chr.dropMessage(5,"【邪惡陣營/狼人提示】: 受死吧，"+wolfKilled+"!");
				else
					chr.dropMessage(5,"【邪惡陣營/狼人提示】: 空刀?");
			if ( 身分 == "女巫" ) {
				if ( parseInt(eim.getProperty(chr.getName()+"_解藥")) == 1 ) {
					chr.dropMessage(5,"【正義陣營/女巫提示】: "+wolfKilled+" 他/她被殺死了，你要救他/她嗎?(點選NPC操作)");
				} else {
					chr.dropMessage(5,"【正義陣營/女巫提示】: 解藥已經使用過了!");
				}
			}
		}
		var msg = "【第"+day+"天夜晚】：狼人請閉眼。女巫請睜眼，他/她被殺死了，你要救他/她嗎?";
		broadCast(msg,0);
		eim.startEventTimer(女巫救人時間*1000);
	} else if ( stat == 3 ) {
		var list = eim.getPlayers();
		for ( var i = 0 ; i  < list.length ; i++ ) {
			chr = list[i];
			身分 = eim.getProperty(chr.getName()+"_身分");
			if ( 身分 == "女巫" ) {
				
				if ( parseInt(eim.getProperty(chr.getName()+"_毒藥")) == 1 ) {
					chr.dropMessage(5,"【正義陣營/女巫提示】: 你要下毒嗎?(點選NPC操作)");
				} else {
					chr.dropMessage(5,"【正義陣營/女巫提示】: 毒藥已經使用過了!");
				}
			}
		}
		var msg = "【第"+day+"天夜晚】：你要使用毒藥嗎?你要毒誰呢?";
		broadCast(msg,0);
		eim.startEventTimer(女巫下毒時間*1000);
	} else if ( stat == 4 ) {
		var wolfKilled = getWolfKilled(day);
		var list = eim.getPlayers();
		for ( var i = 0 ; i  < list.length ; i++ ) {
			chr = list[i];
			身分 = eim.getProperty(chr.getName()+"_身分");
			if ( 身分 == "預言家" ) {
				chr.dropMessage(5,"【正義陣營/預言家提示】: 請選擇要查驗的對象(點選NPC操作)");
			}
		}
		var msg = "【第"+day+"天夜晚】：女巫請閉眼。預言家請睜眼，請選擇你要查驗的對象。";
		broadCast(msg,0);
		eim.startEventTimer(預言家查時間*1000);
	} else if ( stat == 5 ) {
		var witchKilled = eim.getProperty("毒藥使用");
		var list = eim.getPlayers();
		for ( var i = 0 ; i  < list.length ; i++ ) {
			chr = list[i];
			身分 = eim.getProperty(chr.getName()+"_身分");
			if ( 身分 == "獵人" ) {
				if ( chr.getName() == wolfKilled && ( witchKilled == null ||chr.getName() != witchKilled.split("_")[1] ) ) {
					chr.dropMessage(5,"【正義陣營/獵人提示】: 你被殺死了，今晚可開槍(點選NPC操作)");
				} else if ( chr.getName() == wolfKilled ) {
					chr.dropMessage(5,"【正義陣營/獵人提示】: 你被殺死了，今晚不可開槍");
				} else {
					chr.dropMessage(5,"【正義陣營/獵人提示】: 今天是平安的一天");
				}
			}
		}
		var msg = "【第"+day+"天夜晚】：預言家請閉眼。獵人請睜眼，請確認開槍手勢。";
		broadCast(msg,0);
		eim.startEventTimer(獵人指槍時間*1000);
	} else if ( stat == 6 ) {
		var wolfKilled = getWolfKilled(day);
		var witchHelped = eim.getProperty("解藥使用");
		var witchKilled = eim.getProperty("毒藥使用");
		var msg = "【第"+day+"天白天】：天亮了，昨晚";
		var diedList = [];
		if ( witchHelped != null && parseInt(witchHelped.split("_")[0]) == day )
			wolfKilled = "";
		if ( wolfKilled != "" ) {
			diedList.push(wolfKilled);
		}
		if ( witchKilled != null && day == parseInt(witchKilled.split("_")[0]) ) {
			if ( wolfKilled != witchKilled.split("_")[1] )
				diedList.push(witchKilled.split("_")[1]);
		}
		if ( diedList.length > 0 )
			msg += dealOutList(diedList,false) + "被殺死了" ;
		else
			msg += "是平安夜";
		if ( eim.getProperty(day+"日明槍") != null ) {
			msg += eim.getProperty(day+"日明槍")+"被槍殺.";
			diedList.push(eim.getProperty(day+"日明槍"));
		}
		if ( day != 1 && diedList.length > 0 ) {
			stat = parseInt(stat) + 1;
			msg += "，請開始尋找兇手";
			dealOutList(diedList,true);
			if ( checkEnd() )
				return;
			eim.startEventTimer(驅逐討論時間*1000);
		} else if ( diedList.length > 0 ) {
			msg += "，請發表遺言";
			eim.startEventTimer(死亡遺言時間*1000);
		} else {
			msg += "，請開始尋找兇手";
			stat = parseInt(stat) + 1;
			eim.startEventTimer(驅逐討論時間*1000);
		}
		broadCast(msg,0);
	} else if ( stat == 7 ) {
		var witchHelped = eim.getProperty("解藥使用");
		var witchKilled = eim.getProperty("毒藥使用");
		var wolfKilled = getWolfKilled(day);
		var diedList = [];
		if ( witchHelped != null && parseInt(witchHelped.split("_")[0]) == day )
			wolfKilled = "";
		if ( wolfKilled != "" ) {
			diedList.push(wolfKilled);
		}
		if ( witchKilled != null && day == parseInt(witchKilled.split("_")[0]) ) {
			if ( wolfKilled != witchKilled.split("_")[1] )
				diedList.push(witchKilled.split("_")[1]);
		}
		if ( eim.getProperty(day+"日明槍") != null ) {
			diedList.push(eim.getProperty(day+"日明槍"));
		}
		dealOutList(diedList,true);
		if ( checkEnd() )
			return;
		broadCast("【第"+day+"天白天】：請開始尋找兇手。",0);
		eim.startEventTimer(驅逐討論時間*1000);
	} else if ( stat == 8 ) {
		var msg = getVotedKilled(day); // outPerson
		if ( msg != "" ) {
			if ( eim.getProperty(msg+"_身分") == "獵人" ) {
				broadCast("【第"+day+"天白天】："+msg+"被驅逐，請開槍",0);
				eim.startEventTimer(獵人指槍時間*1000);
			} else {
				broadCast("【第"+day+"天白天】："+msg+"被殺死了，請發表遺言",0);
				eim.startEventTimer(一般遺言時間*1000);
			}
		} else {
			broadCast("【第"+day+"天白天】：沒有人被淘汰...",0);
			eim.startEventTimer(5*1000);
		}
	} else if ( stat == 9 ) {
		var diedList = [];
		var msg = "";
		if ( eim.getProperty(day+"日驅逐明槍") != null ) {
			msg += eim.getProperty(day+"日驅逐明槍");
			diedList.push(msg);
			msg += "被槍帶走，"
		}
		diedList.push(getVotedKilled(day));
		dealOutList(diedList,true);
		if ( checkEnd() )
			return;
		broadCast("【第"+day+"天白天】："+msg+"即將進入下一個夜晚....",0);
		eim.startEventTimer(15*1000);
		eim.setProperty("day",parseInt(day)+1);
		eim.setProperty("status",1);
		return;
	} else if ( stat == 10 ) {
		var msg = eim.getProperty(day+"自爆"); // outPerson
		if ( msg != "" ) {
			broadCast("【第"+day+"天白天】："+msg+"自爆，請發表遺言",0);
			eim.startEventTimer(一般遺言時間*1000);
		}
	} else if ( stat == 11 ) {
		var diedList = [];
		diedList.push(eim.getProperty(day+"自爆"));
		dealOutList(diedList,true);
		if ( checkEnd() )
			return;
		broadCast("【第"+day+"天白天】：即將進入下一個夜晚....",0);
		eim.startEventTimer(15*1000);
		eim.setProperty("day",parseInt(day)+1);
		eim.setProperty("status",1);
		return;
	}
	eim.setProperty("status",parseInt(stat)+1);
}

function checkEnd() {
    eim = em.getInstance("Werewolf-10-" + tChannel);
	var list = [0,0,0];
	for ( var i = 0 ; i < eim.getPlayers().length ; i++ ) {
		chr = eim.getPlayers()[i];
		身分 = eim.getProperty(chr.getName()+"_身分");
		狀態 = eim.getProperty(chr.getName()+"_狀態");
		if ( 狀態 == "存活" ) {
			if ( 身分 == "狼人" ) {
				list[0]++;
			} else if ( 身分 == "平民" ) {
				list[1]++;
			} else {
				list[2]++;
			}
		}
	}
	if ( list[0] != 0 && list[1] != 0 && list[2] != 0 ) {
		return false;
	}	
	for ( var i = 0 ; i < eim.getPlayers().length ; i++ ){
		if ( eim.getPlayers()[i].getMapId() == 993073000 ) {
			eim.getPlayers()[i].changeMap(910090410);
		}
	}
	eim.setProperty("status",100);
	if ( list[1] == 0 || list[2] == 0 ) {
		broadCast("遊戲結束，狼人獲勝",0);
	} else if ( list[0] == 0 ) {
		broadCast("遊戲結束，正義聯盟獲勝",0);
	}
	eim.startEventTimer(結束緩衝時間*1000);
	return true;
}

function dealOutList(list,out) {
	var msg = "";
	for (var i = 0; i < list.length; i++) {
		var iRand = parseInt(list.length * Math.random());
		var temp = list[i];
		list[i] = list[iRand];
		list[iRand] = temp;
	}
	var players = eim.getPlayers();
	for ( var i = 0 ; i < list.length ; i++ ) {
		msg += list[i];
		if ( out ) {
			for ( var j = 0 ; j < players.length ; j++ ) {
				if ( players[j].getName() == list[i] ) {
					players[j].changeMap(993073000);
					eim.setProperty(players[j].getName()+"_狀態","出局");
				}
			}
		}
		if ( i + 1 != list.length )
			msg += " . ";
	}
	return msg;
}

function playerUnregistered(eim, player) {}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, 0);
}

function playerLeft(eim, player) {
    if (!eim.isEventCleared()) {
        playerExit(eim, player);
    }
}

function changedMap(eim, player, mapid) {
    if (!inMapList(mapid)) {
        if (eim.isEventTeamLackingNow(false, 1, player)) {
            eim.unregisterPlayer(player);
            end(eim);
        } else
            eim.unregisterPlayer(player);
    }
}

function changedLeader(eim, leader) {
}

function playerDead(eim, player) {
	if ( diedLimitMode == 1 ) {
		var count = eim.getIntProperty("fallenPlayers");
		if ( count == null ) {
			eim.setProperty("fallenPlayers", 0);
			count = eim.getIntProperty("fallenPlayers");
		}
		count = count + 1;
		eim.setIntProperty("fallenPlayers", count);
		if (count == diedTime) {
			eim.dropMessage(5, "[遠征隊] 太多的玩家倒下了；副本結束了。");
			end(eim);
		} else if ( count == parseInt(diedTime/2) ) {
			eim.dropMessage(5, "傷亡人數開始失去控制。小心戰鬥。(傷亡人數:"+count+")");
		} else {
			eim.dropMessage(5, "小心點，不要死亡了...(傷亡人數:"+count+")");
		}
	}
}

function playerRevive(eim, player) { // player presses ok on the death pop up.
	if ( diedLimitMode == -1 ) {
		if (eim.isEventTeamLackingNow(false, 1, player)) {
			eim.unregisterPlayer(player);
			end(eim);
		} else
			eim.unregisterPlayer(player);
	} else if ( diedLimitMode == 0 ) {
		player.addHP(50);
		return false;
	} else if ( diedLimitMode == 1 ) {
		player.addHP(50);
		return false;
	}
}

function scheduleplayerDisconnected2(eim) {
	cancelSchedule();
	setupTask = em.schedule( "playerDisconnected2", 斷線回傳最大時間);
}

function cancelSchedule() {
    if (setupTask != null) {
        setupTask.cancel(true);
    }
}

function playerDisconnected(eim, player) {
    if (eim.isEventTeamLackingNow(false, 1, player)) {
        eim.unregisterPlayer(player);
		scheduleplayerDisconnected2(eim);
    } else {
        eim.dropMessage(5, "[狼人殺] " + player.getName() + " 已離開房間。");
        eim.unregisterPlayer(player);
    }
}

function playerDisconnected2(eim,player) {
    eim = em.getInstance("Werewolf-10-" + tChannel);
    if (eim != null && eim.checkEventTeamLacking(false, 1)) {
        end(eim);
    }
}

function leftParty(eim, player) {}

function disbandParty(eim) {}

function monsterValue(eim, mobId) {
    return 1;
}

function friendlyKilled(mob, eim) {}

function end(eim) {
    var party = eim.getPlayers();
    for (var i = 0; i < party.size(); i++) {
        playerExit(eim, party.get(i));
    }
    eim.dispose();
}

function clearPQ(eim) {
    eim.stopEventTimer();
    eim.setEventCleared();
}

function monsterKilled(mob, eim) {}

function allMonstersDead(eim) {}

function dispose(eim) {}