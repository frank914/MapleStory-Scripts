var status = -1, sel = -1, max = -1;
var input = null;
var statMax = 19999;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0) {
        status--;
    } else if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status <= -1) {
        cm.dispose();
    } else if (status == 0) {
        var msg = "當前能力點上限數值為: #d" + statMax + "#k\r\n";
        msg += "當前可分配的能力點為: #b" + cm.getPlayer().getRemainingAp() + "#k\r\n\r\n";
        msg += "請選擇要增加的能力:\r\n";
        msg += "#L0##r力量(" + getStatVal(0) + ")#l\r\n";
        msg += "#L1##b敏捷(" + getStatVal(1) + ")#l\r\n";
        msg += "#L2##d智力(" + getStatVal(2) + ")#l\r\n";
        msg += "#L3##k幸運(" + getStatVal(3) + ")#l\r\n";
        msg += "#L4##r能力值重置#l\r\n";
        cm.sendSimple(msg);
    } else if (status == 1) {
        if (mode == 1) {
            sel = selection;
        }
        if (sel < 0 || sel > 4) {
            cm.sendNext("發生未知的錯誤: " + sel);
            cm.dispose();
            return;
        } else if ( sel == 4 ) {
			var newApNUM = cm.getPlayer().getStr()+cm.getPlayer().getDex()+cm.getPlayer().getInt()+cm.getPlayer().getLuk()-16;
			cm.getPlayer().changeRemainingAp((cm.getPlayer().getRemainingAp() + newApNUM ),false);
			cm.getPlayer().setStr(4);
			cm.getPlayer().setDex(4);
			cm.getPlayer().setInt(4);
			cm.getPlayer().setLuk(4);
			cm.getPlayer().updateAllStats();
			cm.sendOk("能力值已經重置");
			cm.dispose();
			return;
	}else if (cm.getPlayer().getRemainingAp() <= 0) {
            cm.sendNext("目前沒有任何AP");
            cm.dispose();
            return;
        } 
        max = cm.getPlayer().getRemainingAp();
        if ((statMax - getStatVal(sel)) < cm.getPlayer().getRemainingAp()) {
            max = (statMax - getStatVal(sel));
        }
        var msg = "當前選擇的能力值為: #r" + getStatName(sel) + "#k\r\n";
        msg += "當前能力點上限數值為: #d" + statMax + "#k\r\n";
        msg += "當前可分配的能力點為: #d" + cm.getPlayer().getRemainingAp() + "#k\r\n";
        msg += "請輸入要增加的能力點:";
        cm.sendGetNumber(msg, max, 1, max);
    } else if (status == 2) {
        if (mode == 1) {
            input = selection;
        }
        if (input < 0 || input > cm.getPlayer().getRemainingAp() || input > max) {
            cm.sendNext("發生未知的錯誤: " + input);
            cm.dispose();
            return;
        } else if ((cm.getPlayer().getRemainingAp() - selection) < 0) {
            cm.sendNext("AP點不足");
            cm.dispose();
            return;
        } else if ((getStatVal(sel) + input) > statMax) {
            cm.sendNext("能力已經超過上限值" + statMax);
            cm.dispose();
            return;
        }

        var msg = "請確認以下資訊是否正確:\r\n\r\n";
        msg += "當前選擇的能力值為: #r" + getStatName(sel) + "#k\r\n";
        msg += "當前#b" + getStatName(sel) + "#k能力點為: #r" + getStatVal(sel) + "#k\r\n";
        msg += "當前#b可分配#k的能力點為: #d" + cm.getPlayer().getRemainingAp() + "#k\r\n";
        msg += "當前#b分配#k的能力點為: #d" + input + "#k\r\n";
        msg += "分配後#b剩餘#k的能力點為: #d" + (cm.getPlayer().getRemainingAp() - input) + "#k\r\n";
        msg += "分配後#b" + getStatName(sel) + "#k能力點為: #b" + (getStatVal(sel) + input) + "#k\r\n";
        cm.sendYesNo(msg);
    } else if (status == 3) {
        cm.getPlayer().changeRemainingAp((cm.getPlayer().getRemainingAp() - input),false);
        setStatVal(sel, (getStatVal(sel) + input));;
        cm.getPlayer().updateAllStats();
        cm.sendNext("分配#r" + getStatName(sel) + "#b" + input + "#k點成功!");
        status = -1;
    }
}

function setStatVal(val, val2) {
    var stat = -1;
    switch (val) {
        case 0:
            cm.getPlayer().setStr(val2);
            break;
        case 1:
            cm.getPlayer().setDex(val2);
            break;
        case 2:
            cm.getPlayer().setInt(val2);
            break;
        case 3:
            cm.getPlayer().setLuk(val2);
            break;
    }
}

function getStatVal(val) {
    var stat = -1;
    switch (val) {
        case 0:
            stat = cm.getPlayer().getStr();
            break;
        case 1:
            stat = cm.getPlayer().getDex();
            break;
        case 2:
            stat = cm.getPlayer().getInt();
            break;
        case 3:
            stat = cm.getPlayer().getLuk();
            break;
    }
    return stat;
}

function getStatName(val) {
    var statName = "未指定";
    switch (val) {
        case 0:
            statName = "力量";
            break;
        case 1:
            statName = "敏捷";
            break;
        case 2:
            statName = "智力";
            break;
        case 3:
            statName = "幸運";
            break;
    }
    return statName;
}
