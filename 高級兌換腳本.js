var status = -1;
var sel = -1;
var sel2 = -1;

function start() {
    status = -1;
    action(1, 0, 0);
}

var list = [{
        "標題": "#b#i1012164#恰吉兌換#k",
        "獲得物": [
            [1112127, 1, 1, 1, 1], [0, 15], [1, 13], [2, 1], [3, 1]
        ], // 留空 = 沒有 [代碼,數量,能力,攻擊,天數]、[0,GASH]、[1,楓點]、[2,楓幣]、[3,紅利]
        "失敗時獲得物": [
            [1112127, 1, 1, 1, 1], [0, 15], [1, 13], [2, 1], [3, 1]
        ], // 留空 = 沒有 [代碼,數量,能力,攻擊,天數]、[0,GASH]、[1,楓點]、[2,楓幣]、[3,紅利]
        "需求物": [
            [4000000, 1], [4000001, 2], [4000003, 1], [4000004, 1]
        ], // 留空 = 沒有
        "會爆炸的需求物": [
            [4000005, 1], [4000006, 1], [4000007, 1], [4000008, 1]
        ], // 留空 = 沒有
        "需要GASH": 15,
        "需要楓點": 13,
        "需要楓幣": 1,
        "需要紅利": 1,
        "成功率": 100,
        "失敗後會爆炸的需求物爆炸率": 100,
        "增加機率物品": [4032056, 1, 100], // 留空 = 沒有 格式 [代碼,數量,機率]
        "防爆道具": [4032000, 1], // 留空 = 沒有 格式 [代碼,數量]
        "兌換次數限制": ["測試記錄用LOG", 0, 100]// 留空 = 沒有 格式 ["記錄用名稱(不得有相同)",時效(永久:0,天:1,週:2,月:3),次數]
    }
];

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else if (mode == 0) {
        cm.dispose();
        return;
    }
    if (status == 0) {
        var msg = "#w請選擇要進行的兌換\r\n";
        for (var i = 0; i < list.length; i++) {
            msg += "#L" + i + "#" + list[i].標題 + "#l\r\n";
        }
        cm.sendSimple(msg);
    } else if (status == 1) {
        sel = selection;
        if (status > 0 && (sel < 0 || sel >= list.length)) {
            cm.dispose();
            return;
        }
        var msg = "#w要進行的兌換方式詳細如下:\r\n";
        msg += getItemDetail();
        msg += "#b#L0#我要直接升級#l\r\n";
        if (list[sel].增加機率物品.length > 0) {
            msg += "#L1#我要使用增加機率物品升級#l\r\n";
        }
        if (list[sel].防爆道具.length > 0) {
            msg += "#L2#我要使用防爆道具進行升級#l\r\n";
        }
        if (list[sel].增加機率物品.length > 0 && list[sel].防爆道具.length > 0) {
            msg += "#L3#我要使用增加機率物品、防爆道具來進行升級#l\r\n";
        }
        msg += "#L4##r我甚麼都不做，我要離開...#k#l\r\n";
        cm.sendSimple(msg);
    } else if (status == 2) {
        sel2 = selection;
        if (sel2 < 0 || sel2 > 3) {
            cm.dispose();
            return;
        }
        var msg = "";
        if (sel2 == 0) {
            msg += "#e你確定要直接升級此項目嗎?#n\r\n";
        } else if (sel2 == 1) {
            msg += "#e你確定要使用增加機率物品升級此項目嗎?#n\r\n";
        } else if (sel2 == 2) {
            msg += "#e你確定要使用防爆物品升級此項目嗎?#n\r\n";
        } else if (sel2 == 3) {
            msg += "#e你確定要使用增加機率物品、防爆物品升級此項目嗎?#n\r\n";
        }
        msg += getItemDetail();
        cm.sendYesNo(msg);
    } else if (status == 3) {
        if (sel < 0 || sel > list.length) {
            cm.dispose();
            return;
        }
        var useMoreChanceItem = false;
        var useExplosionProof = false;
        if (sel2 == 1) {
            useMoreChanceItem = true;
        } else if (sel2 == 2) {
            useExplosionProof = true;
        } else if (sel2 == 3) {
            useMoreChanceItem = true;
            useExplosionProof = true;
        }
        if (!cm.hasAllSpace(list[sel].獲得物.length + list[sel].失敗時獲得物.length)) {
            cm.sendOk("身上空間請幫我保留" + list[sel].獲得物.length + list[sel].失敗時獲得物.length + "格");
            cm.dispose();
            return;
        } else if (useMoreChanceItem && !cm.haveItem(list[sel].增加機率物品[0], list[sel].增加機率物品[1])) {
            cm.sendOk("你好像沒有增加機率物品#i" + list[sel].增加機率物品[0] + "##t" + list[sel].增加機率物品[0] + "# * " + list[sel].增加機率物品[1]);
            cm.dispose();
            return;
        } else if (useMoreChanceItem && !cm.haveItem(list[sel].防爆道具[0], list[sel].防爆道具[1])) {
            cm.sendOk("你好像沒有防爆道具#i" + list[sel].防爆道具[0] + "##t" + list[sel].防爆道具[0] + "# * " + list[sel].防爆道具[1]);
            cm.dispose();
            return;
        } else if (cm.getCash(1) < list[sel].需要GASH) {
            cm.sendOk("身上GASH只有" + cm.getCash(1) + "，需要: " + list[sel].需要GASH);
            cm.dispose();
            return;
        } else if (cm.getCash(2) < list[sel].需要楓點) {
            cm.sendOk("身上楓點只有" + cm.getCash(2) + "，需要: " + list[sel].需要楓點);
            cm.dispose();
            return;
        } else if (cm.getMeso() < list[sel].需要楓幣) {
            cm.sendOk("身上楓幣只有" + cm.getMeso() + "，需要: " + list[sel].需要楓幣);
            cm.dispose();
            return;
        } else if (cm.getPlayer().getAccLogValue("紅利") < list[sel].需要紅利) {
            cm.sendOk("身上紅利只有" + cm.getPlayer().getAccLogValue("紅利") + "，需要: " + list[sel].需要紅利);
            cm.dispose();
            return;
        } else if (list[sel].兌換次數限制.length > 0) {
            // ["記錄用名稱",時效(永久:0,天:1,週:2,月:3),次數]
            if (cm.getPlayer().getAccLogValue(list[sel].兌換次數限制[0]) >= list[sel].兌換次數限制[2]) {
                cm.sendNext("達到最高限制次數了!");
                cm.dispose();
                return;
            }
        }
        var reqItemList = [];
        for (var i = 0; i < list[sel].需求物.length; i++) {
            var next = true;
            for (var j = 0; j < reqItemList.length; j++) {
                if (list[sel].需求物[i][0] == reqItemList[j][0]) {
                    reqItemList[i][1] += list[sel].需求物[i][1];
                }
            }
            if (next) {
                reqItemList.push(list[sel].需求物[i]);
            }
        }
        for (var i = 0; i < list[sel].會爆炸的需求物.length; i++) {
            var next = true;
            for (var j = 0; j < reqItemList.length; j++) {
                if (list[sel].會爆炸的需求物[i][0] == reqItemList[j][0]) {
                    reqItemList[i][1] += list[sel].會爆炸的需求物[i][1];
                }
            }
            if (next) {
                reqItemList.push(list[sel].會爆炸的需求物[i]);
            }
        }
        for (var i = 0; i < reqItemList.length; i++) {
            if (!cm.haveItem(reqItemList[i][0], reqItemList[i][1])) {
                cm.sendOk("你身上沒有#i" + reqItemList[i][0] + "##t" + reqItemList[i][0] + "# * " + reqItemList[i][1]);
                cm.dispose();
                return;
            }
        }
        var sucRand = Math.floor(Math.random() * 100);
        var failBoomRand = Math.floor(Math.random() * 100);
        if (sucRand < list[sel].成功率 || failBoomRand < list[sel].失敗後會爆炸的需求物爆炸率) {
            for (var i = 0; i < list[sel].會爆炸的需求物.length; i++) {
                cm.gainItem(list[sel].會爆炸的需求物[i][0], -list[sel].會爆炸的需求物[i][1]);
            }
        }
        for (var i = 0; i < list[sel].需求物.length; i++) {
            cm.gainItem(list[sel].需求物[i][0], -list[sel].需求物
			[i][1]);
        }

        if (useMoreChanceItem) {
            cm.gainItem(list[sel].增加機率物品[0], -list[sel].增加機率物品[1]);
        }
        if (useMoreChanceItem) {
            cm.gainItem(list[sel].防爆道具[0], -list[sel].防爆道具[1]);
        }
        if (list[sel].需要GASH > 0) {
            cm.gainCash(1, -list[sel].需要GASH);
        }
        if (list[sel].需要楓點 > 0) {
            cm.gainCash(2, -list[sel].需要GASH);
        }
        if (list[sel].需要楓幣 > 0) {
            cm.gainMeso(-list[sel].需要楓幣);
        }
        if (list[sel].需要紅利 > 0) {
            cm.getPlayer().addAccLogValue("紅利", -list[sel].需要紅利)
        }
        if (list[sel].兌換次數限制.length > 0) {
            // ["記錄用名稱",時效(永久:0,天:1,週:2,月:3),次數]
            if (list[sel].兌換次數限制[1] == 0) {
                cm.getPlayer().addAccLogValue(list[sel].兌換次數限制[0], 1);
            } else if (list[sel].兌換次數限制[1] == 1) {
                cm.getPlayer().addAccDailyLogValue(list[sel].兌換次數限制[0], 1);
            } else if (list[sel].兌換次數限制[1] == 2) {
                cm.getPlayer().addAccWeeklyLogValue(list[sel].兌換次數限制[0], 1);
            } else if (list[sel].兌換次數限制[1] == 3) {
                cm.getPlayer().addAccMonthlylyLogValue(list[sel].兌換次數限制[0], 1);
            }
        }
        if (sucRand < list[sel].成功率) {
            for (var i = 0; i < list[sel].獲得物.length; i++) {
                if (list[sel].獲得物[i][0] == 0) {
                    cm.gainCash(1, list[sel].獲得物[i][1]);
                } else if (list[sel].獲得物[i][0] == 1) {
                    cm.gainCash(2, list[sel].獲得物[i][1]);
                } else if (list[sel].獲得物[i][0] == 2) {
                    cm.gainMeso(list[sel].獲得物[i][1]);
                } else if (list[sel].獲得物[i][0] == 3) {
                    cm.getPlayer().addAccLogValue("紅利", list[sel].獲得物[i][1]);
                } else {
                    if (parseInt(list[sel].獲得物[i][0] / 1000000) == 1) {
                        for (var j = 0; j < list[sel].獲得物[i][1]; j++) {
                            gainStatItem(list[sel].獲得物[i][0], list[sel].獲得物[i][2], list[sel].獲得物[i][3], list[sel].獲得物[i][4]);
                        }
                    } else if (list[sel].獲得物[i][3] > -1) {
                        cm.gainItemPeriod(list[sel].獲得物[i][0], list[sel].獲得物[i][1], list[sel].獲得物[i][3]);
                    } else {
                        cm.gainItem(list[sel].獲得物[i][0], list[sel].獲得物[i][1]);
                    }
                }
            }
            cm.sendOk("成功了，確認一下背包物品吧!");
            cm.dispose();
            return;
        } else if (failBoomRand < list[sel].失敗後會爆炸的需求物爆炸率) {
            cm.sendOk("失敗了，所有需求道具都消失了...");
            cm.dispose();
            return;
        } else {
            for (var i = 0; i < list[sel].失敗時獲得物.length; i++) {
                if (list[sel].失敗時獲得物[i][0] == 0) {
                    cm.gainCash(1, list[sel].失敗時獲得物[i][1]);
                } else if (list[sel].失敗時獲得物[i][0] == 1) {
                    cm.gainCash(2, list[sel].失敗時獲得物[i][1]);
                } else if (list[sel].失敗時獲得物[i][0] == 2) {
                    cm.gainMeso(list[sel].失敗時獲得物[i][1]);
                } else if (list[sel].失敗時獲得物[i][0] == 3) {
                    cm.getPlayer().addAccLogValue("紅利", list[sel].失敗時獲得物[i][1]);
                } else {
                    if (parseInt(list[sel].失敗時獲得物[i][0] / 1000000) == 1) {
                        for (var j = 0; j < list[sel].失敗時獲得物[i][1]; j++) {
                            gainStatItem(list[sel].失敗時獲得物[i][0], list[sel].失敗時獲得物[i][2], list[sel].失敗時獲得物[i][3], list[sel].失敗時獲得物[i][4]);
                        }
                    } else if (list[sel].失敗時獲得物[i][3] > -1) {
                        cm.gainItemPeriod(list[sel].失敗時獲得物[i][0], list[sel].失敗時獲得物[i][1], list[sel].失敗時獲得物[i][3]);
                    } else {
                        cm.gainItem(list[sel].失敗時獲得物[i][0], list[sel].失敗時獲得物[i][1]);
                    }
                }
            }
            cm.sendOk("失敗了，可是運氣很好有的材料還留著...");
            cm.dispose();
            return;
        }
    } else {
        cm.dispose();
    }
}

function getTypeMsg(str) {
    var msg = "";
    if (str == "需求物") {
        msg += "需求物品: \r\n\t";
        for (var i = 0; i < list[sel].需求物.length; i++) {
            msg += "#b#i" + list[sel].需求物[i][0] + "##t" + list[sel].需求物[i][0] + "# * " + list[sel].需求物[i][1];
            msg += ((i + 1) % 2 == 0 && i + 1 != list[sel].需求物.length ? "\r\n\t" : " .#k ");
        }
    } else if (str == "會爆炸的需求物") {
        msg += "會爆炸的需求物品: \r\n\t";
        for (var i = 0; i < list[sel].會爆炸的需求物.length; i++) {
            msg += "#b#i" + list[sel].會爆炸的需求物[i][0] + "##t" + list[sel].會爆炸的需求物[i][0] + "# * " + list[sel].會爆炸的需求物[i][1];
            msg += ((i + 1) % 2 == 0 && i + 1 != list[sel].需求物.length ? "\r\n\t" : " . #k");
        }
    } else if (str == "需要GASH") {
        msg += "\t需要GASH: #b" + list[sel].需要GASH + "#k";

    } else if (str == "需要楓點") {
        msg += "\t需要楓點: #b" + list[sel].需要楓點 + "#k";

    } else if (str == "需要楓幣") {
        msg += "\t需要楓幣: #b" + list[sel].需要楓幣 + "#k";

    } else if (str == "需要紅利") {
        msg += "\t需要紅利: #b" + list[sel].需要紅利 + "#k";

    } else if (str == "獲得物") {
        // 留空 = 沒有 [代碼,數量,能力,攻擊,天數]
        msg += "獲得物: \r\n";
        for (var i = 0; i < list[sel].獲得物.length; i++) {
            var 目前獲得物 = list[sel].獲得物[i];
            if (目前獲得物[0] == 0) {
                msg += "\t【獲得GASH: #b" + 目前獲得物[1] + "#k】";
            } else if (目前獲得物[0] == 1) {
                msg += "\t【獲得楓點: #b" + 目前獲得物[1] + "#k】";
            } else if (目前獲得物[0] == 2) {
                msg += "\t【獲得楓幣: #b" + 目前獲得物[1] + "#k】";
            } else if (目前獲得物[0] == 3) {
                msg += "\t【獲得紅利: #b" + 目前獲得物[1] + "#k】";
            } else {
                msg += "\t#b#i" + 目前獲得物[0] + "##t" + 目前獲得物[0] + "# * " + 目前獲得物[1] + "#r";
                if (目前獲得物[2] > -1) {
                    msg += " 全能力+" + 目前獲得物[2];
                }
                if (目前獲得物[3] > -1) {
                    msg += " 攻擊+" + 目前獲得物[3];
                }
                if (目前獲得物[4] > -1) {
                    msg += " 天數+" + 目前獲得物[4];
                }
            }
            msg += "#k\r\n"
        }

    } else if (str == "失敗時獲得物") {
        // 留空 = 沒有 [代碼,數量,能力,攻擊,天數]
        msg += "失敗時獲得物: \r\n";
        for (var i = 0; i < list[sel].失敗時獲得物.length; i++) {
            var 目前獲得物 = list[sel].失敗時獲得物[i];
            if (目前獲得物[0] == 0) {
                msg += "\t【獲得GASH: #b" + 目前獲得物[1] + "#k】";
            } else if (目前獲得物[0] == 1) {
                msg += "\t【獲得楓點: #b" + 目前獲得物[1] + "#k】";
            } else if (目前獲得物[0] == 2) {
                msg += "\t【獲得楓幣: #b" + 目前獲得物[1] + "#k】";
            } else if (目前獲得物[0] == 3) {
                msg += "\t【獲得紅利: #b" + 目前獲得物[1] + "#k】";
            } else {
                msg += "\t#b#i" + 目前獲得物[0] + "##t" + 目前獲得物[0] + "# * " + 目前獲得物[1] + "#r";
                if (目前獲得物[2] > -1) {
                    msg += " 全能力+" + 目前獲得物[2];
                }
                if (目前獲得物[3] > -1) {
                    msg += " 攻擊+" + 目前獲得物[3];
                }
                if (目前獲得物[4] > -1) {
                    msg += " 天數+" + 目前獲得物[4];
                }
            }
            msg += "#k\r\n"
        }
    } else if (str == "成功率") {
        msg += "成功率: #r" + list[sel].成功率 + "%#k";
    } else if (str == "失敗後會爆炸的需求物爆炸率") {
        msg += "  (失敗後會爆炸的需求物爆炸率: #r" + list[sel].失敗後會爆炸的需求物爆炸率 + "%#k)";
    } else if (str == "增加機率物品") {
        // 留空 = 沒有 [代碼,數量,能力,攻擊,天數]
        msg += "使用機率物品: ";
        var 機率物品 = list[sel].增加機率物品;
        msg += "#b#i" + 機率物品[0] + "##t" + 機率物品[0] + "# * " + 機率物品[1] + "#k";
        msg += " #k增加機率 #r" + 機率物品[2] + "%#k";

    } else if (str == "防爆道具") {
        // 留空 = 沒有 [代碼,數量,能力,攻擊,天數]
        msg += "可使用防爆道具: ";
        var 防爆道具 = list[sel].防爆道具;
        msg += "#b#i" + 防爆道具[0] + "##t" + 防爆道具[0] + "# * " + 防爆道具[1] + "#k";
    } else if (str == "兌換次數限制") {
        // ["記錄用名稱",時效(永久:0,天:1,週:2,月:3),次數]
        if (list[sel].兌換次數限制[1] == 0) {
            msg += "可兌換次數(永久):" + (cm.getPlayer().getAccLogValue(list[sel].兌換次數限制[0]) == -1 ? "0" : cm.getPlayer().getAccLogValue(list[sel].兌換次數限制[0])) + "/" + list[sel].兌換次數限制[2] + "\r\n";
        } else if (list[sel].兌換次數限制[1] == 1) {
            msg += "可兌換次數(天):" + (cm.getPlayer().getAccLogValue(list[sel].兌換次數限制[0]) == -1 ? "0" : cm.getPlayer().getAccLogValue(list[sel].兌換次數限制[0])) + "/" + list[sel].兌換次數限制[2] + "\r\n";
        } else if (list[sel].兌換次數限制[1] == 2) {
            msg += "可兌換次數(週):" + (cm.getPlayer().getAccLogValue(list[sel].兌換次數限制[0]) == -1 ? "0" : cm.getPlayer().getAccLogValue(list[sel].兌換次數限制[0])) + "/" + list[sel].兌換次數限制[2] + "\r\n";
        } else if (list[sel].兌換次數限制[1] == 3) {
            msg += "可兌換次數(月):" + (cm.getPlayer().getAccLogValue(list[sel].兌換次數限制[0]) == -1 ? "0" : cm.getPlayer().getAccLogValue(list[sel].兌換次數限制[0])) + "/" + list[sel].兌換次數限制[2] + "\r\n";
        }
    }
    return msg;
}

function getItemDetail() {
    var msg = "";
    if (list[sel].獲得物.length > 0) {
        msg += getTypeMsg("獲得物") + "";
    }
    if (list[sel].失敗時獲得物.length > 0) {
        msg += getTypeMsg("失敗時獲得物") + "";
    }
    if (list[sel].需求物.length > 0) {
        msg += getTypeMsg("需求物") + "\r\n";
    }
    if (list[sel].會爆炸的需求物.length > 0) {
        msg += getTypeMsg("會爆炸的需求物") + "\r\n";
    }
    var nextLine = false;
    if (list[sel].需要GASH > 0) {
        msg += getTypeMsg("需要GASH");
        nextLine = true;
        msg += "\t.   ";
    }
    if (list[sel].需要楓點 > 0) {
        msg += getTypeMsg("需要楓點");
        if (nextLine) {
            msg += "\r\n";
            nextLine = false;
        } else {
            nextLine = true;
            msg += "\t.   ";
        }
    }
    if (list[sel].需要楓幣 > 0) {
        msg += getTypeMsg("需要楓幣");
        if (nextLine) {
            msg += "\r\n";
        } else {
            nextLine = true;
            msg += "\t.   ";
        }
    }
    if (list[sel].需要紅利 > 0) {
        msg += getTypeMsg("需要紅利") + "\r\n";
    }
    if (list[sel].成功率 >= 0) {
        msg += getTypeMsg("成功率");
    }
    if (list[sel].失敗後會爆炸的需求物爆炸率 > 0) {
        msg += getTypeMsg("失敗後會爆炸的需求物爆炸率");
    }
    msg += "\r\n";
    if (list[sel].增加機率物品.length > 0) {
        msg += getTypeMsg("增加機率物品") + "\r\n";
    }
    if (list[sel].防爆道具.length > 0) {
        msg += getTypeMsg("防爆道具") + "\r\n";
    }
    if (list[sel].兌換次數限制.length > 0) {
        msg += getTypeMsg("兌換次數限制") + "\r\n";
    }
    return msg;
}

function gainStatItem(itemId, stat, adap, day_) {
    var ii = cm.getItemInformationProvider();
    var equip = ii.randomizeStats(ii.getEquipById(itemId));
    if (stat > -1) {
        equip.setStr(stat);
    }
    if (stat > -1) {
        equip.setLuk(stat);
    }
    if (stat > -1) {
        equip.setDex(stat);
    }
    if (stat > -1) {
        equip.setInt(stat);
    }
    if (adap > -1) {
        equip.setMatk(adap);
    }
    if (adap > -1) {
        equip.setWatk(adap);
    }
    if (day_ > 0) {
        equip.setExpiration((cm.getCurrentTime() + (day_ * 24 * 60 * 60 * 1000)));
    }
    cm.addByItem(equip);
}
