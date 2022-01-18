var status = -1, slot = -1, sel = -1, sel2 = -1;
var enableCashEquip = true, useBlessItem;
var reqMeso = 3000000;
var blessItem = 2340000;
var reqItem = 4001126; // maple Leaf
var reqQty = 1;
var successRand = 60; // 成功機率
var range = [-10,10];
function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status < 0) {
        cm.dispose();
    } else if (status == 0) {
        var msg = "#e在這裡可使用#v" + reqItem + "#提高混沌卷軸的強化能力!\r\n\r\n#n";
        msg += "#b#e將會消耗強化次數#r1次#b,請選擇需要強化的裝備！\r\n";
        msg += "注意：強化后產的效用由卷軸決定！\r\n";
        msg += "#k(每次強化需要手續費#d" + reqMeso + "#k)\r\n";
        msg += "- 請先選擇要強化的道具 -\r\n";
        msg += getInventoryItemMessage();
        cm.sendSimple(msg);
    } else if (status == 1) {
        if (mode == 1) {
            slot = selection;
            if (slot < 0) {
                cm.dispose();
                return;
            }
        }
        if (cm.haveItem(blessItem, 1)) {
            cm.sendSimple("\r\n是否使用#v" + blessItem + "#？#L0#是#r#l\t\t#L1#否#l\r\n");
        } else {
            cm.sendNext("\r\n由於身上沒有#v" + blessItem + "##t" + blessItem + "#，必須消耗裝備砸卷次數。");
        }
    } else if (status == 2) {
        if (mode == 1) {
            sel2 = selection;
        }
        var eq = cm.getItem(1, slot);
        if (!canApplyEquip(eq)) {
            cm.sendNext("發生未知的錯誤。");
            cm.dispose();
            return;
        } else if (cm.getPlayer().getMeso() < reqMeso) {
            cm.sendNext("身上的楓幣不足，至少需要#b" + reqMeso + "#k楓幣。");
            cm.dispose();
            return;
        } else if (!cm.haveItem(reqItem, 1) ) {
            cm.sendNext("缺少強化物");
            cm.dispose();
            return;
        } else if (eq.getUpgradeSlots() <= 0 ){
            cm.sendNext("該道具已無法強化。");
            cm.dispose();
            return;
		}
        cm.gainMeso(-reqMeso);
        if (!isSuccess((successRand))) {
	    cm.gainItem(reqItem,-1);
			if (cm.haveItem(blessItem, 1) && sel2 == 0) {
				cm.gainItem(blessItem, -1);
			} else {
				eq.setUpgradeSlots((eq.getUpgradeSlots() - 1));	
				cm.getPlayer().forceUpdateItem(eq);
			}
            cm.sendNext("強化失敗。");
            cm.dispose();
            return;
        }
		
		eq.setUpgradeSlots((eq.getUpgradeSlots() - 1));
		cm.gainItem(reqItem,-1);
		eq.setLevel((eq.getLevel() + 1));
        var msg = "#r#e強化完成#k#n\r\n\r\n";
        msg += "您選擇的裝備#v" + eq.getItemId() + "#將提升屬性如下：\r\n";
        var eq = cm.getItem(1, slot);
		if ( eq.getStr() > 0 ) {
			add = rand(range[0],range[1]);
            eq.setStr((eq.getStr() + add));
			msg += "\t力量 + " + add + "\r\n";
		}
		if ( eq.getDex() > 0 )  {
			add = rand(range[0],range[1]);
            eq.setDex((eq.getDex() + add));
			msg += "\t敏捷 + " + add + "\r\n";
		}
		if ( eq.getInt() > 0 ) {
			add = rand(range[0],range[1]);
            eq.setInt((eq.getInt() + add));
			msg += "\t智力 + " + add + "\r\n";
		}
		if ( eq.getLuk() > 0 ) { 
			add = rand(range[0],range[1]);
            eq.setLuk((eq.getLuk() + add));
			msg += "\t幸運 + " + add + "\r\n";
		}
		if ( eq.getHp() > 0 ) { 
			add = rand(range[0],range[1]);
            eq.setHp((eq.getHp() + add));
			msg += "\t血量 + " + add + "\r\n";
		}
		if ( eq.getMp() > 0 ) { 
			add = rand(range[0],range[1]);
            eq.setMp((eq.getMp() + add));
			msg += "\t魔量 + " + add + "\r\n";
		}
		if ( eq.getWatk() > 0 ) { 
			add = rand(range[0],range[1]);
            eq.setWatk((eq.getWatk() + add));
			msg += "\t物理攻擊力 + " + add + "\r\n";
		}
		if ( eq.getMatk() > 0 ) { 
			add = rand(range[0],range[1]);
            eq.setMatk((eq.getMatk() + add));
			msg += "\t魔法攻擊力 + " + add + "\r\n";
		}
		if ( eq.getWdef() > 0 ) { 
			add = rand(range[0],range[1]);
            eq.setWdef((eq.getWdef() + add));
			msg += "\t物理防禦力 + " + add + "\r\n";
		}
		if ( eq.getMdef() > 0 ) { 
			add = rand(range[0],range[1]);
            eq.setMdef((eq.getMdef() + add));
			msg += "\t魔法防禦力 + " + add + "\r\n";
		}
		if ( eq.getAcc() > 0 ) { 
			add = rand(range[0],range[1]);
            eq.setAcc((eq.getAcc() + add));
			msg += "\t命中率 + " + add + "\r\n";
		}
		if ( eq.getAvoid() > 0 ) { 
			add = rand(range[0],range[1]);
            eq.setAvoid((eq.getAvoid() + add));
			msg += "\t迴避率 + " + add + "\r\n";
		}
		if ( eq.getSpeed() > 0 ) { 
			add = rand(range[0],range[1]);
            eq.setSpeed((eq.getSpeed() + add));
			msg += "\t速度 + " + add + "\r\n";
		}
		if ( eq.getJump() > 0 ) { 
			add = rand(range[0],range[1]);
            eq.setJump((eq.getJump() + add));
			msg += "\t跳躍力 + " + add + "\r\n";
		}
        cm.getPlayer().forceUpdateItem(eq);
        cm.sendNext(msg);
        status = -1;
        addType = -1;
        sel = -1;
        sel2 = -1;
        slot = -1;
    }
}

function canApplyEquip(eq) {
    if (!enableCashEquip && cm.isCash(itemId)) {
        return false;
    } else if (eq.getUpgradeSlots() <= 0) {
        return false;
    }
    return true;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isSuccess(chance) {
    return rand(0, 99) < chance;
}

function getInventoryItemMessage() {
    var msg = "\r\n";
    var slotLimit = cm.getSlotLimit(1);
    for (var i = 0; i < slotLimit; i++) {
        var eq = cm.getItem(1, i);
        if (eq != null) {
            var itemId = eq.getItemId();
            if (!canApplyEquip(eq)) {
                continue;
            }
            msg += "#L" + i + "##v" + itemId + "#";
        }
    }
    return msg;
}
