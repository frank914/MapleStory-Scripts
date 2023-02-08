var status = -1;
var log = "每日";
var title = "每日";

var pqLog = [
    //["101組隊", "每日時間裂縫勝利場數", 2]
    //["女神副本", "每日女神勝利場數", 2],
    //["金鉤副本", "每日金勾勝利場數", 2],
    //["毒霧副本", "每日毒霧勝利場數", 2],
    //["茱麗葉副本", "每日茱麗葉勝利場數", 2],
    //["茱麗葉副本", "每日羅密歐勝利場數", 2],
     //["超綠副本", "每日超綠勝利場數", 5]
];

var reqLog = [
    //["殘暴炎魔", "8800002", 2],
];

var reqItem = [
    [4032056, 10]
];

var reqLevel = 100;
var 紅利 = 1;

// id qty
var rewardItem = [
    [5220000, 20, -1],
    [5220010, 1, -1]
];

var rewardMeso = 0;
var rewardGash = 0;
var rewardMaplePoint = 1200;

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
    if (cm.getPlayer().getLevel() < reqLevel) {
        cm.sendNext("至少需要" + reqLevel + "等才能使用本功能");
        cm.dispose();
        return;
    }
    if (status == 0) {
        if (cm.getPlayer().getAccLogValue(log) > 0) {
            cm.sendNext("本任務今日已經做過了喔");
            cm.dispose();
            return;
        }
        msg = "\t\t\t#r#e" + title + "#k#n如下\r\n\r\n\r\n";
        if (reqItem.length > 0) {
            msg += "收集物品: \r\n"
            for (var i = 0; i < reqItem.length; i++) {
                var id = reqItem[i][0];
                var qty = reqItem[i][1];
                msg += "\t#v" + id + "##t" + id + "# " + qty + "個\r\n";
            }
        }

        if (reqLog.length > 0) {
            msg += "殺死怪物: \r\n"
            for (var i = 0; i < reqLog.length; i++) {
                var name = reqLog[i][0];
                var time = reqLog[i][1] ;
                var reqTime = reqLog[i][2];
                msg += "\t" + name + " #r#e" + (cm.getPlayer().getLogValue("BOSS_"+time+"_DAILY")==-1?"0":cm.getPlayer().getLogValue("BOSS_"+time+"_DAILY")) + "/" + reqTime + "#k#n\r\n";
            }
        }

        if (pqLog.length > 0) {
            msg += "完成副本: \r\n"
            for (var i = 0; i < pqLog.length; i++) {
                var name = pqLog[i][0];
                var time = pqLog[i][1];
                var reqTime = pqLog[i][2];
                msg += "\t" + name + " #r#e" + (cm.getPlayer().getAccLogValue(time)==-1?"0":cm.getPlayer().getAccLogValue(time)) + "/" + reqTime + "#k#n\r\n";
            }
        }

        if (rewardItem.length > 0) {
            msg += "獎勵物品: \r\n"
            for (var i = 0; i < rewardItem.length; i++) {
                var id = rewardItem[i][0];
                var qty = rewardItem[i][1];
                msg += "\t#v" + id + ":##t" + id + ":# " + qty + "個";
                msg += "\r\n";
            }
        }

        if (rewardGash > 0) {
            msg += "獎勵GASH: " + rewardGash + "\r\n"
        }

        if (rewardMaplePoint > 0) {
            msg += "獎勵楓點: " + rewardMaplePoint + "\r\n"
        }
        if (rewardMeso > 0) {
            msg += "獎勵楓幣: " + rewardMeso + "\r\n"
        }
		if (紅利 > 0) {
			msg += "獎勵紅利: " + 紅利 + "\r\n"
		}

        cm.sendAcceptDecline(msg);
    } else if (status == 1) {
        if (reqItem.length > 0) {
            for (var i = 0; i < reqItem.length; i++) {
                var id = reqItem[i][0];
                var qty = reqItem[i][1];
                if (!cm.haveItem(id, qty)) {
                    cm.sendNext("身上沒有#v" + id + "##t" + id + "#" + qty + "個");
                    cm.dispose();
                    return;
                }
            }
        }
        if (reqLog.length > 0) {
            for (var i = 0; i < reqLog.length; i++) {
                var name = reqLog[i][0];
                var time = reqLog[i][1];
                var reqtime = reqLog[i][2];
                if (cm.getPlayer().getLogValue("BOSS_"+time+"_DAILY") < reqtime) {
                    cm.sendNext("未完成:\r\n"+name + " #r#e" + (cm.getPlayer().getLogValue("BOSS_"+time+"_DAILY")==-1?"0":cm.getPlayer().getLogValue("BOSS_"+time+"_DAILY")) + "/" + reqtime + "#k#n");
                    cm.dispose();
                    return;
                }
            }
        }
        if (pqLog.length > 0) {
            for (var i = 0; i < pqLog.length; i++) {
                var name = pqLog[i][0];
                var time = pqLog[i][1];
                var reqTime = pqLog[i][2];
                if (cm.getPlayer().getAccLogValue(time) < reqTime) {
                    cm.sendNext("未完成:\r\n"+name + " #r#e" + (cm.getPlayer().getAccLogValue(time)==-1?"0":cm.getPlayer().getAccLogValue(time)) + "/" + reqTime + "#k#n\r\n");
                    cm.dispose();
                    return;
                }
            }
        }
        if (rewardItem.length > 0) {
            if (!cm.hasAllSpace(rewardItem.length)) {
                cm.sendNext("背包放不下#v" + rewardItem[0][0] + "##t" + rewardItem[0][0] + "#");
                cm.dispose();
                return;
            }
        }
        if (reqItem.length > 0) {
            for (var i = 0; i < reqItem.length; i++) {
                var id = reqItem[i][0];
                var qty = reqItem[i][1];
                if (cm.haveItem(id, qty)) {
                    cm.gainItem(id, -qty);
                } else {
                    cm.dispose();
                    return;
                }
            }
        }

        if (rewardGash > 0) {
            cm.getPlayer().modifyCSPoints(1, rewardGash);
        }
        if (rewardMaplePoint > 0) {
            cm.getPlayer().modifyCSPoints(2, rewardMaplePoint);
        }
        if (rewardMeso > 0) {
            cm.gainMeso(rewardMeso);
        }
        if (紅利 > 0) {
            gainTTPoint(紅利);
        }
        if (rewardItem.length > 0) {
            for (var i = 0; i < rewardItem.length; i++) {
                var id = rewardItem[i][0];
                var qty = rewardItem[i][1];
                cm.gainItem(id, qty);
            }
        }

        if (rewardItem.length > 0) {
            msg += "獎勵物品: \r\n"
            for (var i = 0; i < rewardItem.length; i++) {
                var id = rewardItem[i][0];
                var qty = rewardItem[i][1];
                msg += "#v" + id + ":##t" + id + ":# " + qty + "個";
                msg += "\r\n";
            }
        }

        if (rewardGash > 0) {
            msg += "獎勵GASH: " + rewardGash + "\r\n"
        }
        if (rewardMaplePoint > 0) {
            msg += "獎勵楓點: " + rewardMaplePoint + "\r\n";
        }
        if (rewardMeso > 0) {
            msg += "獎勵楓幣: " + rewardMeso + "\r\n"
        }
        if (紅利 > 0) {
            msg += "獎勵紅利: " + 紅利 + "\r\n"
        }
        cm.sendNext(msg);
        cm.getPlayer().setAccDailyLogValue(log,1);
        cm.dispose();
    } else {
        cm.dispose();
    }
}

function gainTTPoint(value) {
	cm.getPlayer().addAccLogValue("紅利",value);
}