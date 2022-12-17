var status = -1;
var sel = 1;
var em;
var startDay = -1;

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
    var eim = em.getInstance("Werewolf-10-" + cm.getClient().getChannel());
	if ( startDay == -1 )
		startDay = eim.getProperty("day");
	if ( startDay != eim.getProperty("day") ) {
		cm.dispose();
		return;
	}
	var stat = parseInt(eim.getProperty("status"))-1;
	if ( eim.getProperty(cm.getPlayer().getName()+"_身分") == null ) {
		cm.sendOk("尚未開始...");
		cm.dispose();
		return;
	}
	if ( status == 0 ) {
		var msg = "#e#b<天黑請閉眼 - 狼人殺 10人局>\r\n";
		msg += "#d#n你好我是遊戲幫助NPC，請問你要進行甚麼服務呢?\r\n";
		msg += "#b你的角色陣營:#r"+eim.getProperty(cm.getPlayer().getName()+"_陣營")+"\r\n";
		msg += "#b你的角色卡牌:#r"+eim.getProperty(cm.getPlayer().getName()+"_身分")+"\r\n";
		if ( eim.getProperty(cm.getPlayer().getName()+"_身分") == "狼人" ) {
			msg += "#b狼人成員:#r";
			for ( var i = 0, count = 0 ; i < eim.getPlayers().length ; i++ ) {
				name = eim.getPlayers()[i].getName();
				if ( eim.getProperty(name+"_身分") == "狼人" ) {
					msg += name + (count < 2?".":"");
					count++;
				}
			}
			msg += "#k\r\n"
			if ( stat == 1 ) {
				msg += getWolfKilledInfo()+"\r\n";
				msg += "#L0##r【狼人技能】#b選擇要下手擊殺的對象\r\n";
			} else if ( stat == 6 || stat == 7 ) {
				msg += "#L87##r【狼人技能】#b自爆結束白天\r\n";
			}
		} else if ( eim.getProperty(cm.getPlayer().getName()+"_身分") == "女巫" ) {
			if ( stat == 2 ) {
				if ( parseInt(eim.getProperty(cm.getPlayer().getName()+"_解藥")) == 1 ) {
					var day = eim.getProperty("day");
					var wolfKilled = getWolfKilled(day);
					if ( wolfKilled != "" )
						msg += "#L1##r"+wolfKilled+" 他/她被殺死了，你要救他/她的話點選此。\r\n";
				}
			} else if ( stat == 3 ) {
				if ( parseInt(eim.getProperty(cm.getPlayer().getName()+"_毒藥")) == 1 ) {
					msg += "#L2##r你要使用毒藥嗎?\r\n";
				}
			}
		} else if ( eim.getProperty(cm.getPlayer().getName()+"_身分") == "預言家" ) {
			var day = eim.getProperty("day");
			for ( var i = 1 ; i < parseInt(startDay+1) ; i++ ) {
				if ( eim.getProperty(i+"日查驗結果") != null )
					msg += "#k"+i+"日查驗結果:#r"+eim.getProperty(i+"日查驗結果")+"\r\n";
			}
			if ( stat == 4 && eim.getProperty(day+"日查驗結果") == null ) {
				msg += "#L3##r是否要進行查驗?\r\n";
			}
		} else if ( stat == 5 && eim.getProperty(cm.getPlayer().getName()+"_身分") == "獵人" ) {
			var day = eim.getProperty("day");
			var wolfKilled = getWolfKilled(day);
			var witchKilled = eim.getProperty("毒藥使用");
			if ( cm.getPlayer().getName() == wolfKilled && cm.getPlayer().getName() != witchKilled ) {
				msg += "#L4##r你被殺死了，今晚可開槍#n\r\n";
			} else if ( cm.getPlayer().getName() == wolfKilled ) {
				msg += "#e#r你被殺死了，今晚不可開槍#n\r\n";
			} else {
				msg += "#e#b今天是平安的一天#n\r\n";
			}
		} else if ( stat == 8 && eim.getProperty(cm.getPlayer().getName()+"_身分") == "獵人" && getVotedKilled(eim.getProperty("day")) == cm.getPlayer().getName() ) {
			msg += "#L487##r你被驅逐了，請選擇開槍對象#n\r\n";
		}
		if ( stat == 6 || stat == 7 ) {
			if ( ( stat == 6 && day != 1 ) || stat == 7 ) {
				msg += "#L5##e#b進行投票作業#n\r\n";
			}
		}
		msg += "#L100##r結束對話\r\n";
		msg += "#L1000##r離開遊戲\r\n";
		cm.sendSimple(msg);
	} else if ( status == 1 ) {
		sel = selection;
		if ( sel == 100 ) {
			cm.dispose();
			return;
		} else if ( sel == 1000 ) {
			cm.warp(910000000,0);
			cm.dispose();
			return;
		} else if ( ( sel == 0 || sel == 87 ) && eim.getProperty(cm.getPlayer().getName()+"_身分") == "狼人" ) {
			if ( sel == 0 && stat == 1 ) {
				var list = "";
				for ( var i = 0 ; i < eim.getPlayers().length ; i++ ) {
					if ( eim.getProperty(eim.getPlayers()[i].getName()+"_狀態") != "存活" )
						continue;
					list += "#L"+i+"##b角色名稱 : #r"+eim.getPlayers()[i].getName()+"\r\n";
				}
				cm.sendSimple("請選擇要下手的對象:\r\n#b"+list);
			} else if ( sel == 87 && ( stat == 6 || stat == 7 ) ) {
				cm.sendYesNo("確定要自爆強行進入天黑?");
			}
		} else if ( ( sel == 1 || sel == 2 ) && eim.getProperty(cm.getPlayer().getName()+"_身分") == "女巫" ) {
			if ( sel == 1 && stat == 2 &&  parseInt(eim.getProperty(cm.getPlayer().getName()+"_解藥")) == 1 ) {
				var day = eim.getProperty("day");
				var wolfKilled = getWolfKilled(day);
				var str = day + "_" + wolfKilled ;
				eim.setProperty("解藥使用",str);
				eim.setProperty(cm.getPlayer().getName()+"_解藥",0);
				cm.sendOk("你已對"+str.split("_")[1]+"使用解藥");
				cm.dispose();
			} else if ( sel == 2 && stat == 3 &&  parseInt(eim.getProperty(cm.getPlayer().getName()+"_毒藥")) == 1 ) {
				if ( eim.getProperty("解藥使用") != null && eim.getProperty("解藥使用").split("_")[0] == eim.getProperty("day") ) {
					cm.sendOk("解藥毒藥只能擇一使用");
					cm.dispose();
					return;
				}
				var list = "";
				for ( var i = 0 ; i < eim.getPlayers().length ; i++ ) {
					if ( eim.getProperty(eim.getPlayers()[i].getName()+"_狀態") != "存活" )
						continue;
					list += "#L"+i+"##b角色名稱 : #r"+eim.getPlayers()[i].getName()+"\r\n";
				}
				cm.sendSimple("請選擇要下手的對象:\r\n#b"+list);
			}
		} else if ( sel == 3 && eim.getProperty(cm.getPlayer().getName()+"_身分") == "預言家" ) {
			if ( stat == 4 && eim.getProperty(day+"日查驗結果") == null ) {
				var list = "";
				for ( var i = 0 ; i < eim.getPlayers().length ; i++ ) {
					if ( eim.getProperty(eim.getPlayers()[i].getName()+"_狀態") != "存活" )
						continue;
					if ( eim.getPlayers()[i].getName() == cm.getPlayer().getName() )
						continue;
					if ( eim.getProperty(eim.getPlayers()[i].getName()+"_查驗") == "已查驗")
						continue;
					list += "#L"+i+"##b角色名稱 : #r"+eim.getPlayers()[i].getName()+"\r\n";
				}
				cm.sendSimple("請選擇要查驗的對象:\r\n#b"+list);
			}
		} else if ( sel == 4 && stat == 5 && eim.getProperty(cm.getPlayer().getName()+"_身分") == "獵人" ) {
			var day = eim.getProperty("day");
			var wolfKilled = getWolfKilled(day);
			var witchKilled = eim.getProperty("毒藥使用");
			if ( cm.getPlayer().getName() == wolfKilled && cm.getPlayer().getName() != witchKilled ) {
				var list = "";
				for ( var i = 0 ; i < eim.getPlayers().length ; i++ ) {
					if ( eim.getProperty(eim.getPlayers()[i].getName()+"_狀態") != "存活" )
						continue;
					if ( eim.getPlayers()[i].getName() == cm.getPlayer().getName() )
						continue;
					list += "#L"+i+"##b角色名稱 : #r"+eim.getPlayers()[i].getName()+"\r\n";
				}
				cm.sendSimple("請選擇要下手的對象:\r\n#b"+list);
			}
		} else if ( ( stat == 6 || stat == 7 ) && sel == 5 ) {
			if ( ( stat == 6 && day != 1 ) || stat == 7 ) {
				var list = "";
				for ( var i = 0 ; i < eim.getPlayers().length ; i++ ) {
					if ( eim.getProperty(eim.getPlayers()[i].getName()+"_狀態") != "存活" )
						continue;
					list += "#L"+i+"##b角色名稱 : #r"+eim.getPlayers()[i].getName()+"\r\n";
				}
				cm.sendSimple("請投票:\r\n#b"+list);
			}
		} else if ( stat == 8 && sel == 487 && eim.getProperty(cm.getPlayer().getName()+"_身分") == "獵人" && getVotedKilled(eim.getProperty("day")) == cm.getPlayer().getName() ) {
			var list = "";
			for ( var i = 0 ; i < eim.getPlayers().length ; i++ ) {
				if ( eim.getProperty(eim.getPlayers()[i].getName()+"_狀態") != "存活" )
					continue;
				if ( eim.getPlayers()[i].getName() == cm.getPlayer().getName() )
					continue;
				list += "#L"+i+"##b角色名稱 : #r"+eim.getPlayers()[i].getName()+"\r\n";
			}
			cm.sendSimple("請選擇要開槍的對象:\r\n#b"+list);
		} else {
			cm.sendOk("超出時間");
			cm.dispose();
		}
	} else if ( status == 2 ) {
		if ( sel == 0 && stat == 1 && eim.getProperty(cm.getPlayer().getName()+"_身分") == "狼人" ) {
			var day = eim.getProperty("day");
			if ( eim.getProperty(eim.getPlayers()[selection].getName()+"_狀態") != "存活" ) {
				cm.dispose();
				return;
			}
			var wolfStr = eim.getProperty(day+"日狼人行動者");
			var killedStr = eim.getProperty(day+"日狼人落刀者");
			var wolfList = wolfStr.split("_");
			var killedList = killedStr.split("_");
			for ( var i = 0 ; i < wolfList.length ; i++ ) {
				if ( wolfList[i] == "?" || wolfList[i] == cm.getPlayer().getName() ) {
					wolfList[i] = cm.getPlayer().getName();
					killedList[i] = eim.getPlayers()[selection].getName();
					break;
				}
			}
			eim.setProperty(day+"日狼人行動者","");
			eim.setProperty(day+"日狼人落刀者","");
			for ( var i = 0 ; i < wolfList.length ; i++ ) {
				eim.setProperty(day+"日狼人行動者",eim.getProperty(day+"日狼人行動者")+wolfList[i]);
				eim.setProperty(day+"日狼人落刀者",eim.getProperty(day+"日狼人落刀者")+killedList[i]);
				if ( i + 1 != wolfList.length ) {
					eim.setProperty(day+"日狼人行動者",eim.getProperty(day+"日狼人行動者")+"_");
					eim.setProperty(day+"日狼人落刀者",eim.getProperty(day+"日狼人落刀者")+"_");
				}

			}
			cm.sendOk("你已經選擇下刀#b"+eim.getPlayers()[selection].getName());
			cm.dispose();
		} else if ( sel == 87 && ( stat == 6 || stat == 7 ) ) {
			if ( eim.getProperty(cm.getPlayer().getName()+"_身分") == "狼人" ) {
				eim.setProperty("status",10);
				eim.setProperty(cm.getPlayer().getName()+"_狀態","出局");
				eim.setProperty(startDay+"自爆",cm.getPlayer().getName());
				eim.stopEventTimer();
				eim.startEventTimer(1*1000);
				cm.dispose();
			}
		} else if ( (sel == 1 || sel == 2 )&& eim.getProperty(cm.getPlayer().getName()+"_身分") == "女巫" ) {
			if ( sel == 2 && stat == 3 && parseInt(eim.getProperty(cm.getPlayer().getName()+"_毒藥")) == 1 ) {
				if ( eim.getProperty(eim.getPlayers()[selection].getName()+"_狀態") != "存活" ) {
					cm.dispose();
					return;
				}
				var day = eim.getProperty("day");
				eim.setProperty("毒藥使用",day+"_"+eim.getPlayers()[selection].getName());
				eim.setProperty(cm.getPlayer().getName()+"_毒藥",0);
				cm.sendOk("你已經選擇下毒#b"+eim.getPlayers()[selection].getName());
				cm.dispose();
			}
		} else if ( sel == 3 && eim.getProperty(cm.getPlayer().getName()+"_身分") == "預言家" ) {
			var day = eim.getProperty("day")
			if ( stat == 4 && eim.getProperty(day+"日查驗結果") == null ) {
				if ( eim.getProperty(eim.getPlayers()[selection].getName()+"_狀態") != "存活" ) {
					cm.dispose();
					return;
				}
				var name = eim.getPlayers()[selection].getName();
				var team = eim.getProperty(name+"_陣營");
				if ( team == "邪惡" ) {
					team = "#r#e"+team+"#n#k";
				} else {
					team = "#b#e"+team+"#n#k";
				}
				eim.setProperty(name+"_查驗","已查驗");
				var msg = "#b"+name+"#k的陣營:"+team;
				eim.setProperty(day+"日查驗結果",msg);
				cm.sendOk(msg);
				cm.dispose();
			}
		} else if ( sel == 4 && stat == 5 && eim.getProperty(cm.getPlayer().getName()+"_身分") == "獵人" ) {
			var day = eim.getProperty("day")
			var wolfKilled = getWolfKilled(day);
			var witchKilled = eim.getProperty("毒藥使用");
			if ( cm.getPlayer().getName() == wolfKilled && cm.getPlayer().getName() != witchKilled ) {
				if ( eim.getProperty(eim.getPlayers()[selection].getName()+"_狀態") != "存活" ) {
					cm.dispose();
					return;
				}
				var name = eim.getPlayers()[selection].getName();
				var msg = name;
				eim.setProperty(day+"日明槍",msg);
				cm.sendOk(msg+ "將被槍擊殺");
				cm.dispose();
			}
		} else if ( ( stat == 6 || stat == 7 ) && sel == 5 ) {
			if ( ( stat == 6 && day != 1 ) || stat == 7 ) {
				if ( eim.getProperty(eim.getPlayers()[selection].getName()+"_狀態") != "存活" ) {
					cm.dispose();
					return;
				}
				var day = eim.getProperty("day");
				if ( eim.getProperty(day+"投票者") == null || eim.getProperty(day+"被投者") == null ) { 
					eim.setProperty(day+"投票者","?_?_?_?_?_?_?_?_?_?");
					eim.setProperty(day+"被投者","?_?_?_?_?_?_?_?_?_?");
				}
				var wolfStr = eim.getProperty(day+"投票者");
				var killedStr = eim.getProperty(day+"被投者");
				var wolfList = wolfStr.split("_");
				var killedList = killedStr.split("_");
				for ( var i = 0 ; i < wolfList.length ; i++ ) {
					if ( wolfList[i] == "?" || wolfList[i] == cm.getPlayer().getName() ) {
						wolfList[i] = cm.getPlayer().getName();
						killedList[i] = eim.getPlayers()[selection].getName();
						break;
					}
				}
				eim.setProperty(day+"投票者","");
				eim.setProperty(day+"被投者","");
				for ( var i = 0 ; i < wolfList.length ; i++ ) {
					eim.setProperty(day+"投票者",eim.getProperty(day+"投票者")+wolfList[i]);
					eim.setProperty(day+"被投者",eim.getProperty(day+"被投者")+killedList[i]);
					if ( i + 1 != wolfList.length ) {
						eim.setProperty(day+"投票者",eim.getProperty(day+"投票者")+"_");
						eim.setProperty(day+"被投者",eim.getProperty(day+"被投者")+"_");
					}
				}
				cm.sendOk("你已經選擇投票#b"+eim.getPlayers()[selection].getName());
				cm.dispose();
			}
		} else if ( stat == 8 && sel == 487 && eim.getProperty(cm.getPlayer().getName()+"_身分") == "獵人" && getVotedKilled(eim.getProperty("day")) == cm.getPlayer().getName() ) {
			var day = eim.getProperty("day");
			eim.setProperty(day+"日驅逐明槍",eim.getPlayers()[selection].getName());
			cm.sendOk("已選擇開槍#r"+eim.getPlayers()[selection].getName()+"#k，倒數結束前可做更改");
			cm.dispose();
		} else {
			cm.sendOk("超出時間");
			cm.dispose();
		}
	} else {
		cm.dispose();
	}
}

function getWolfKilledInfo() {
    var eim = em.getInstance("Werewolf-10-" + cm.getClient().getChannel());
	var day = eim.getProperty("day");
	if ( eim.getProperty(day+"日狼人行動者") == null || eim.getProperty(day+"日狼人落刀者") == null ) {
		return "#e#r暫無#k#n";
	} else {
		var wolfStr = eim.getProperty(day+"日狼人行動者");
		var killedStr = eim.getProperty(day+"日狼人落刀者");
		var wolfList = wolfStr.split("_");
		var killedList = killedStr.split("_");
		var msg = "#d★狼人陣營投票資訊如下#k\r\n";
		for ( var i = 0 ; i < wolfList.length ; i++ ) {
			msg += "#b狼人:#r#e"+wolfList[i]+"#n#b投給#r#e"+killedList[i]+"#n\r\n";
		}
		msg += "目前最高票為:"+getWolfKilled(day);+"\r\n"
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
    eim = em.getInstance("Werewolf-10-" + cm.getClient().getChannel());
	var wolfStr = eim.getProperty(day+"日狼人行動者");
	var wolfList = wolfStr.split("_");
	return wolfList;
}

function getWolfKilledList(day) {
    eim = em.getInstance("Werewolf-10-" + cm.getClient().getChannel());
	var killedStr = eim.getProperty(day+"日狼人落刀者");
	var killedList = killedStr.split("_");
	return killedList;
}

function getVotedKilled(day) {
	var killedList = getVotedList(day);
	return findMostOfList(killedList);
}

function getVotedList(day) {
    eim = em.getInstance("Werewolf-10-" + cm.getClient().getChannel());
	var killedStr = eim.getProperty(day+"被投者");
	var killedList = killedStr.split("_");
	return killedList;
}