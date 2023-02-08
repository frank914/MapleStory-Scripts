var status = -1, sel = -1, toJob = -1;
var rebornLevelInFirst = 200
    var rebornLevel = 200;
var maxReborn = 50;
var newap = 50;
var 公告廣播 = true;
var jobs = [[1, "劍士"], [2, "法師"], [3, "弓手"], [4, "盜賊"], [5, "海盜"], [11, "聖魂劍士"], [12, "烈焰巫師"], [13, "破風使者"], [14, "暗夜行者"], [15, "閃雷悍將"], [21, "狂狼"]];

var reqItem = [
    [4032056, 10]
];
var reqMeso = 0;
var reqGash = 0;
var reqMaplePoint = 0;

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
        var msg = "歡迎使用轉生系統, 本系統可協助轉職/轉生/滿技:\r\n";
        msg += "#L0##r1.職業變成當前的一轉, 技能不重製, 保留在鍵盤#l\r\n";
        msg += "#L1##r2.職業變成任何職業, 技能/鍵盤 重製#l\r\n";
        msg += "#L2##b技能點滿#l\r\n\r\n";
        msg += "#r請注意第一次轉生無能力值加成!!!\r\n";
        msg += "#d轉生後為11等並可獲得基礎能力點" + newap + "\r\n";
        msg += "#b★需要達到#r" + rebornLevel + "#b等才能進行轉生\r\n";
        msg += "#b★第一次需要達到#r" + rebornLevelInFirst + "#b等才能進行轉生\r\n";
        msg += "#b★目前轉生只開放#r" + maxReborn + "#b轉";
        cm.sendSimple(msg);
    } else if (status == 1) {
        if (mode == 1) {
            sel = selection;
        }
        if (sel == 2) {
            cm.getPlayer().maxSkillByJob();
            cm.dispose();
            return;
        }
        if (cm.getPlayer().getLevel() < rebornLevelInFirst && cm.getPlayer().getReborns() == 0) {
            cm.sendNext("至少要#r" + rebornLevelInFirst + "#k等才能轉生");
            cm.dispose();
            return;
        } else if (cm.getPlayer().getLevel() < rebornLevel && cm.getPlayer().getReborns() > 0) {
            cm.sendNext("至少要#r" + rebornLevel + "#k等才能轉生");
            cm.dispose();
            return;
        } else if (cm.getPlayer().getReborns() >= maxReborn) {
            cm.sendNext("目前只能轉生" + maxReborn + "次");
            cm.dispose();
            return;
        }

        var msg = "當前選擇轉生模式為" + (sel == 0 ? "[#r職業不重置,技能不重製#k]" : "[#r職業重置,技能重製#k]") + "\r\n";
        msg += "請問是否正確?";
        cm.sendYesNo(msg);
    } else if (status == 2) {
        var msg = "一旦轉生了便不能後悔, 請問確認是否轉生?\r\n";
        msg += "#r★當前模式為" + (sel == 0 ? "[#r職業不重置,技能不重製#k]" : "[#r職業重置,技能重製#k]");
        cm.sendYesNo(msg);
    } else if (status == 3) {
        if (sel == 1) {
            cm.sendSimple(showJobList());
        } else {
            cm.sendNext("即將進行轉生...");
        }
    } else if (status == 4) {
        if (!isCorrectChoice(selection) && sel == 1) {
            cm.sendNext("發生未知的錯誤..." + selection);
            cm.dispose();
            return;
        }
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

        if (reqGash > cm.getCash(1)) {
            cm.sendNext("身上沒有足夠GASH");
            cm.dispose();
            return;
        }
        if (reqMaplePoint > cm.getCash(2)) {
            cm.sendNext("身上沒有足夠楓葉點數");
            cm.dispose();
            return;
        }
        if (reqGash > cm.getPlayer().getMeso()) {
            cm.sendNext("身上沒有足夠楓幣");
            cm.dispose();
            return;
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

        if (reqGash > 0) {
            cm.getPlayer().modifyCSPoints(1, -reqGash);
        }
        if (reqMaplePoint > 0) {
            cm.getPlayer().modifyCSPoints(2, -reqMaplePoint);
        }
        if (reqMeso > 0) {
            cm.gainMeso(-reqMeso);
        }
        doReborn(selection);
        if (公告廣播)
            cm.worldMessage(0, " 恭喜「" + cm.getPlayer().getName() + "」 玩家，轉生了第 「" + cm.getPlayer().getReborns() + "」 次嚕，大家恭喜他呦~　^_^");
        cm.sendNext("恭喜轉生成功.");
        cm.dispose();
    } else {
        cm.dispose();
    }
}

function doReborn(sel_) {
    cm.getPlayer().resetAPSP();
    cm.getPlayer().updateRemainingSp(0);
    if (sel == 0) {
        cm.getPlayer().clearSkill();
        cm.changeJobById(getFirstJob(cm.getPlayer().getJobId()));
    } else if (sel == 1) {
        cm.getPlayer().clearSkill();
      //  cm.getPlayer().maxSkillByJob();
        cm.changeJobById(sel_ * 100);
    }

    cm.getPlayer().changeLevel(10);
    cm.getPlayer().changeRemainingAp(newap * (cm.getPlayer().getReborns() + 1), false);
    cm.getPlayer().setReborns((cm.getPlayer().getReborns() + 1));
	cm.getClient().disconnect(false,false);
}

function isCorrectChoice(choose) {
    for (var i = 0; i < jobs.length; i++) {
        if (jobs[i][0] == choose) {
            return true;
        }
    }
    return false;
}

function showJobList() {
    var msg = "";
    for (var i = 0; i < jobs.length; i++) {
        msg += "#L" + jobs[i][0] + "#" + jobs[i][1] + "#l\r\n";
    }
    return msg;
}

function getNewJob(choice) {
    var newJob = 0;
    switch (choice) {
    case 0:
        newJob = 0;
        break;
    case 1:
        newJob = 1000;
        break;
    case 1:
        newJob = 0;
        break;
    }
}

function getFirstJob(job_) {
    var newJob = parseInt(job_ / 100) * 100;
    return newJob;
}

function getFirstFirstJob(job_) {
    if (job_ < 1000)
        return 0;
    if (job_ > 1000 && job_ < 2000)
        return 1000;
    if (job_ > 2000 && job_ < 3000)
        return 2000;
    if (job_ > 3000 && job_ < 4000)
        return 3000;
}
