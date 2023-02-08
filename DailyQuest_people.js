var status = -1, currentQuest;
var channelServer;
var em;
var quests = [
    [1, "藍寶的生存危機1",
        [// reqItem
            [4000000, 200],
        ],
		[//pqLog
		//["101組隊", "每日時間裂縫勝利場數", 2],
		//["女神副本", "每日女神勝利場數", 2],
		//["金鉤副本", "每日金勾勝利場數", 2],
		//["毒霧副本", "每日毒霧勝利場數", 2],
		//["茱麗葉副本", "每日茱麗葉勝利場數", 2],
		//["茱麗葉副本", "每日羅密歐勝利場數", 2],
		 //["超綠副本", "每日超綠勝利場數", 5]
		],
		[//reqLog
			//["殘暴炎魔", "8800002", 2],	
		],
        100, // reqLevel
        1000, // reqMeso
        [// rewardItem
            [1302000, 1, -1, 100], // id qty hour chance
        ],
		[
		 [100100,5]
		],
        10, // rewardMeso
        100, // rewardGash
        1000, // rewardMaplePoint
		0//紅利
    ],
    [2, "藍寶的生存危機1",
        [// reqItem
            [4000000, 200],
        ],
		[//pqLog
		//["101組隊", "101勝利", 2],
		//["女神副本", "女神勝利", 2],
		//["金鉤副本", "金鉤勝利", 2],
		//["毒霧副本", "毒霧勝利", 2],
		//["茱麗葉副本", "茱麗葉勝利", 2],
		 ["超綠副本", "超綠勝利", 5],
		// ["擂台副本", "擂台勝利", 2],
		],
		[//reqLog
			//["龍王", "龍王勝利", 2],
			["殘暴炎魔", "殘暴炎魔勝利", 2],		
		],
        100, // reqLevel
        1000, // reqMeso
        [// rewardItem
            [1302000, 1, -1, 100], // id qty hour chance
        ],
		[
		 [100100,5]
		],
        10, // rewardMeso
        100, // rewardGash
        1000, // rewardMaplePoint
		0//紅利
    ]
]

function start() {
    action(1, 0, 0);
}


function action(mode, type, selection) {
    var msg = "";
    if (mode == 1) {
        status++;
    } else if (mode == 0) {
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
		var auto = "每日任務代號";
        currentQuest = cm.getPlayer().getAccLog(auto);
        if (currentQuest == null) {
			cm.getPlayer().setAccDailyLogValue(auto, getRandomInt(0,quests.length-1)); 
			currentQuest = cm.getPlayer().getAccLogValue(auto);
			for (var i = 0; i < quests[currentQuest][8].length; i++) {
				var mobid = quests[currentQuest][8][i][0];
				cm.getPlayer().removeMobKilledCount(mobid);
			}
		}
        if (currentQuest == -1) {
            cm.sendNext("發生異常: " + currentQuest);
            cm.dispose();
            return;
        }
        var message = "\t\t\t#r" + quests[currentQuest][1] + "#k\r\n";
        if (quests[currentQuest][5] > 0) {
            message += "等級需求:#b" + quests[currentQuest][5] + "#k\r\n";
        }
        if (quests[currentQuest][6] > 0) {
            message += "楓幣需求:#b" + quests[currentQuest][6] + "#k\r\n";
        }
        if (quests[currentQuest][2].length > 0) {
            message += "收集物品: \r\n"
            for (var i = 0; i < quests[currentQuest][2].length; i++) {
                var id = quests[currentQuest][2][i][0];
                var qty = quests[currentQuest][2][i][1];
                message += "\t#v" + id + "##t" + id + "# " + qty + "個\r\n";
            }
        }
        if (quests[currentQuest][3].length > 0) {
            message += "完成副本: \r\n"
            for (var i = 0; i < quests[currentQuest][3].length; i++) {
                var name = quests[currentQuest][3][i][0];
                var time = quests[currentQuest][3][i][1];
                var reqTime = quests[currentQuest][3][i][2];
                message += "\t" + name + " #r#e" + (cm.getPlayer().getAccLogValue(time)==-1?"0":cm.getPlayer().getAccLogValue(time)) + "/" + reqTime + "#k#n\r\n";
            }
        }
        if (quests[currentQuest][4].length > 0) {
            message += "殺死BOSS: \r\n"
            for (var i = 0; i < quests[currentQuest][4].length; i++) {
                var name = quests[currentQuest][4][i][0];
                var time = quests[currentQuest][4][i][1];
                var reqTime = quests[currentQuest][4][i][2];
                message += "\t" + name + " #r#e" + (cm.getPlayer().getLogValue("BOSS_"+time+"_DAILY")==-1?"0":cm.getPlayer().getLogValue("BOSS_"+time+"_DAILY")) + "/" + reqTime + "#k#n\r\n";
            }
        }
        if (quests[currentQuest][8].length > 0) {
            message += "殺死怪物: \r\n"
            for (var i = 0; i < quests[currentQuest][8].length; i++) {
                var mobid = quests[currentQuest][8][i][0];
                var needKill = quests[currentQuest][8][i][1];
                message += "\t#o" + mobid + "# #r#e" + cm.getPlayer().getMobKilledCount(mobid) + "/" + needKill + "#k#n\r\n";
            }
        } 
        message += "\r\n";
        if (quests[currentQuest][9] > 0) {
            message += "獎勵楓幣:#b" + quests[currentQuest][9] + "#k\r\n";
        }
        if (quests[currentQuest][10] > 0) {
            message += "獎勵Gash:#b" + quests[currentQuest][10] + "#k\r\n";
        }
        if (quests[currentQuest][11] > 0) {
            message += "獎勵楓點:#b" + quests[currentQuest][11] + "#k\r\n";
        }
        if (quests[currentQuest][12] > 0) {
            message += "獎勵紅利:#b" + quests[currentQuest][12] + "#k\r\n";
        }
        if (quests[currentQuest][7].length > 0) {
            message += "獎勵物品: \r\n"
            for (var i = 0; i < quests[currentQuest][7].length; i++) {
                var id = quests[currentQuest][7][i][0];
                var qty = quests[currentQuest][7][i][1];
                var hour = quests[currentQuest][7][i][2];
                var chance = quests[currentQuest][7][i][3];
                message += "\t#v" + id + ":##t" + id + ":# " + qty + "個";
                if (hour > 0) {
                    message += "(" + hour + "小時)";
                }
                if (chance < 100) {
                    message += "(" + chance + "%機率獲得)";
                }
                message += "\r\n";
            }
        }
        message += "\r\n\r\n\r\n#k是否要挑戰此任務?";
        cm.sendAcceptDecline(message);
    } else if (status == 1) {
        if (cm.getPlayer().getLevel() < quests[currentQuest][5]) {
            cm.sendNext("至少需要" + quests[currentQuest][5] + "等才能完成此任務");
            cm.dispose();
            return;
        } else if (cm.getPlayer().getMeso() < quests[currentQuest][6]) {
            cm.sendNext("至少需要" + quests[currentQuest][6] + "楓幣才能完成");
            cm.dispose();
            return;
        } else if (cm.getPlayer().getAccLogValue(quests[currentQuest][1]) > 0) {
            cm.sendNext("本任務今日已經做過了喔");
            cm.dispose();
            return;
        }
        if (quests[currentQuest][2].length > 0) {
            for (var i = 0; i < quests[currentQuest][2].length; i++) {
                var id = quests[currentQuest][2][i][0];
                var qty = quests[currentQuest][2][i][1];
                if (!cm.haveItem(id, qty)) {
                    cm.sendNext("身上沒有#v" + id + "##t" + id + "#" + qty + "個");
                    cm.dispose();
                    return;
                }
            }
        }
        if (quests[currentQuest][3].length > 0) {
            for (var i = 0; i < quests[currentQuest][3].length; i++) {
                var name = quests[currentQuest][3][i][0];
                var time = quests[currentQuest][3][i][1];
                var reqtime = quests[currentQuest][3][i][2];
                if (cm.getPlayer().getAccLogValue(time) < reqtime) {
                    cm.sendNext("未完成:\r\n"+name + " #r#e" + cm.getPlayer().getAccLogValue(time) + "/" + reqtime + "#k#n");
                    cm.dispose();
                    return;
                }
            }
        }
        if (quests[currentQuest][4].length > 0) {
            for (var i = 0; i < quests[currentQuest][4].length; i++) {
                var name = quests[currentQuest][4][i][0];
                var time = quests[currentQuest][4][i][1];
                var reqTime = quests[currentQuest][4][i][2];
				if (cm.getPlayer().getLogValue("BOSS_"+time+"_DAILY") < reqTime) {
                    cm.sendNext("未完成:\r\n"+name + " #r#e" + (cm.getPlayer().getLogValue("BOSS_"+time+"_DAILY")==-1?"0":cm.getPlayer().getLogValue("BOSS_"+time+"_DAILY")) + "/" + reqTime + "#k#n");
                    cm.dispose();
                    return;
                }
            }
        }
        if (quests[currentQuest][7].length > 0) {
            if (!cm.hasAllSpace(2)) {
                cm.sendNext("背包放不下#v" + quests[currentQuest][7][0][0] + "##t" + quests[currentQuest][7][0][0] + "#");
                cm.dispose();
                return;
            }
        }
        if (quests[currentQuest][8].length > 0) {
            for (var i = 0; i < quests[currentQuest][8].length; i++) {
				if (cm.getPlayer().getMobKilledCount(quests[currentQuest][8][i][0])<quests[currentQuest][8][i][1]) {
					cm.sendNext("殺死怪物數量:#o"+quests[currentQuest][8][i][0]+"#"+cm.getPlayer().getMobKilledCount(quests[currentQuest][8][i][0])+" / "+quests[currentQuest][8][i][1]);
					cm.dispose();
					return;
				}
			}
        }
        if (quests[currentQuest][2].length > 0) {
            for (var i = 0; i < quests[currentQuest][2].length; i++) {
                var id = quests[currentQuest][2][i][0];
                var qty = quests[currentQuest][2][i][1];
                if (cm.haveItem(id, qty)) {
                    cm.gainItem(id, -qty);
                } else {
                    cm.dispose();
                    return;
                }
            }
        }

        if (quests[currentQuest][10] > 0) {
            cm.getPlayer().modifyCSPoints(1, quests[currentQuest][10]);
        }
        if (quests[currentQuest][11] > 0) {
            cm.getPlayer().modifyCSPoints(2, quests[currentQuest][11]);
        }
        if (quests[currentQuest][9] > 0) {
            cm.gainMeso(quests[currentQuest][9]);
        }
        if (quests[currentQuest][12] > 0) {
            gainTTPoint(quests[currentQuest][12]);
        }

        var gains = [];

        if (quests[currentQuest][7].length > 0) {
            for (var i = 0; i < quests[currentQuest][7].length; i++) {
                var id = quests[currentQuest][7][i][0];
                var qty = quests[currentQuest][7][i][1];
                var hour = quests[currentQuest][7][i][2];
                var chance = quests[currentQuest][7][i][3];
                if (getRandomInt(1, 100) <= chance) {
                    gains.push(id);
                    if (hour > 0) {
                        cm.gainItemHour(id, 1, hour);
                    } else {
                        cm.gainItem(id, qty);
                    }
                }
            }
        }
        if (gains.length > 0 && quests[currentQuest][7].length > 0) {
            msg += "獎勵物品: \r\n"
            for (var i = 0; i < quests[currentQuest][7].length; i++) {
                var id = quests[currentQuest][7][i][0];
                var qty = quests[currentQuest][7][i][1];
                var hour = quests[currentQuest][7][i][2];
                if (!hasId(gains, id)) {
                    continue;
                }
                msg += "#v" + id + ":##t" + id + ":# " + qty + "個";
                if (hour > 0) {
                    msg += "(" + hour + "小時)";
                }
                msg += "\r\n";
            }
        }

        if (quests[currentQuest][10] > 0) {
            msg += "獎勵GASH: " + quests[currentQuest][10] + "\r\n"
        }
        if (quests[currentQuest][11] > 0) {
            msg += "獎勵楓點: " + quests[currentQuest][11] + "\r\n";
        }
        if (quests[currentQuest][9] > 0) {
            msg += "獎勵楓幣: " + quests[currentQuest][9] + "\r\n"
        }
        if (quests[currentQuest][12] > 0) {
            msg += "獎勵紅利: " + quests[currentQuest][12] + "\r\n"
        }
        cm.sendNext(msg);
        cm.getPlayer().setAccDailyLogValue(quests[currentQuest][1],1);
    } else {
        cm.dispose();
    }
}

function hasId(array, id) {
    if (array.length <= 0) {
        return false;
    }
    for (var i = 0; i < array.length; i++) {
        if (array[i] == id) {
            return true;
        }
    }
    return false;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gainTTPoint(value) {
	cm.getPlayer().addAccLogValue("紅利",value);
}