var status = -1, sel = -1, slot = -1;
var reqMeso = 0;
var reqItem = [4008013, 1];
var chance = 100;
//以下當作沒看到
var reqGash = 1200;
var reqItem2 = [4000000, 1];
var chance2 = 100;
//以上當作沒看到

function start() {
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
        var msg = "#b<裝備還原>#k\r\n";
        msg += "#L0#使用";
        if (reqMeso > 0) {
            msg += numberToString(reqMeso) + "楓幣";
        }
        if (reqItem[0] > 0) {
            msg += " #i" + reqItem[0] + "##z" + reqItem[0] + "# x " + reqItem[1];
        }
        msg += " 成功機率:" + chance + "%#l\r\n";
        /*msg += "#L1#使用";
        if (reqGash > 0) {
            msg += numberToString(reqGash) + "點券 ";
        }
        if (reqItem2[0] > 0) {
            msg += " #v" + reqItem2[0] + "# x " + reqItem2[1];
        }
        msg += " 成功機率:" + chance2 + "%#l\r\n";*/
        cm.sendSimple(msg);
    } else if (status == 1) {
        if (mode == 1) {
            sel = selection;
        }
        if (sel < 0 || sel > 1) {
            cm.dispose();
            return;
        }
        var hasNext = false;
        var msg = "請選擇要還原的裝備:\r\n";
        var itemList = cm.getItemList(1);
        var iter = itemList.iterator();
        var realCount = 0;
        for (var i = 0; i < cm.getSlotLimit(1); i++) {
            var item = cm.getItem(1, i);
            if (item == null || cm.isCash(item.getItemId())) {
                continue;
            }
            realCount++;
            msg += "#L" + item.getPosition() + "##v" + item.getItemId() + "#";
            if (realCount % 5 == 0) {
                msg += "\r\n";
            }
            hasNext = true;
        }
        if (!hasNext) {
            cm.sendNext("揹包內沒有可用的裝備");
            cm.dispose();
            return;
        }
        cm.sendSimple(msg);
    } else if (status == 2) {
        slot = selection;
        var item = cm.getItem(1, slot);
        var tmpChance = 0;
        if (item == null || cm.isCash(item.getItemId())) {
            cm.dispose();
            return;
        } else if (sel == 0) {
            if (cm.getMeso() < reqMeso) {
                cm.sendNext("至少需要" + numberToString(reqMeso) + "楓幣");
                cm.dispose();
                return;
            } else if (reqItem[0] > 0 && !cm.haveItem(reqItem[0], reqItem[1])) {
                cm.sendNext("身上必須要有#v" + reqItem[0] + "##t" + reqItem[0] + "#x" + reqItem[1]);
                cm.dispose();
                return;
            }
            if (reqMeso > 0) {
                cm.gainMeso(-reqMeso);
            }

            if (reqItem[0] > 0) {
                cm.gainItem(reqItem[0], -reqItem[1]);
            }
            tmpChance = chance;
        } else if (sel == 1) {
            if (cm.getCash(1) < reqGash) {
                cm.sendNext("至少需要" + numberToString(reqGash) + "點券");
                cm.dispose();
                return;
            } else if (reqItem2[0] > 0 && !cm.haveItem(reqItem2[0], reqItem2[1])) {
                cm.sendNext("身上必須要有#v" + reqItem2[0] + "##t" + reqItem2[0] + "#x" + reqItem2[1]);
                cm.dispose();
                return;
            }
            if (reqGash > 0) {
                cm.gainCash(1, -reqGash);
            }
            if (reqItem2[0] > 0) {
                cm.gainItem(reqItem2[0], -reqItem2[1]);
            }
            tmpChance = chance2;
        }
        if (!isSuccess(tmpChance)) {
            cm.sendNext("重置裝備失敗");
            cm.dispose();
            return;
        }
        cm.removeSlot(1, item.getPosition(), 1);
        cm.addFromDrop(cm.getEquipById(item.getItemId()));
        cm.sendNext("重置裝備成功");
        cm.dispose();
    } else {
        cm.dispose();
    }
}

function r(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isSuccess(chance) {
    return r(0, 99) < chance;
}

function numberToString(val) {
    if (val >= 100000000 && ((val % 100000000) == 0)) {
        return (val / 100000000) + "E";
    } else if (val >= 10000 && ((val % 10000) == 0)) {
        return (val / 10000) + "W";
    }
    return val;
}
