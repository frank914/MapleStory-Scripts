var status = 0;
var expedition;
var expedMembers;
var player;
var em;
var exped;
var expedName = "天黑請閉眼 - 狼人殺 10人局";
var expedBoss = "天黑請閉眼 - 狼人殺 10人局";
var eimName = "Werewolf-10-";
var expedMap = "狼人殺會所";
var list = "你想做什麼？#b\r\n\r\n#L1#檢視目前玩家#l\r\n#L2#開始遊戲！#l\r\n#L3#停止這場遊戲。#l";
var 最少人數 = 10   //入場最少人數
var 最多人數 = 10  //入場最多人數
var 挑戰次數 = 100  //挑戰次數

function start() {
    exped = cm.getExpeditionType("CUSTOM_30");
    action(1, 0, 0);
}

function action(mode, type, selection) {

    player = cm.getPlayer();
    expedition = cm.getExpedition(exped);
    em = cm.getEventManager("Werewolf-10");

    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }

        if (status == 0) {
            if (player.getLevel() < exped.getMinLevel() || player.getLevel() > exped.getMaxLevel()) { //Don't fit requirement, thanks Conrad
                cm.sendOk("你不符合遊玩的資格！");
                cm.dispose();
            } else if (expedition == null) { //Start an expedition
                cm.sendSimple("#e#b<" + expedName + ">\r\n#k#n" + em.getProperty("party") + "\r\n\r\n你想組建一支隊伍來參加嗎 #r" + expedBoss + "#k？\r\n#b#L1#我們開始吧！#l\r\n\#L2#不，我想我要等一下。。。#l");
                status = 1;
            } else if (expedition.isLeader(player)) { //If you're the leader, manage the exped
                if (expedition.isInProgress()) {    // thanks Conrad for noticing exped leaders being able to still manage in-progress expeds
                    cm.sendOk("房間已經有人正在遊玩了。");
                    cm.dispose();
                } else {
                    cm.sendSimple("#e#b<" + expedName + ">\r\n#k#n" + em.getProperty("party") + list);
                    status = 2;
                }
            } else if (expedition.isRegistering()) { //If the expedition is registering
                if (expedition.contains(player)) { //If you're in it but it hasn't started, be patient
                    cm.sendOk("你已經加入該房間了。請稍候 #r" + expedition.getLeader().getName() + "#k開始吧。");
                    cm.dispose();
                } else { //If you aren't in it, you're going to get added
                    cm.sendOk(expedition.addMember(cm.getPlayer(), 挑戰次數));
                    cm.dispose();
                }
            } else if (expedition.isInProgress()) { //Only if the expedition is in progress
                if (expedition.contains(player)) { //If you're registered, warp you in
                    var eim = em.getInstance(eimName + player.getClient().getChannel());
                    if (eim.getIntProperty("canJoin") > 1) {
                        eim.registerPlayer(player);
                    } else {
                        cm.sendOk("你的房間已經開始進行" + expedBoss + "。");
                    }

                    cm.dispose();
                } else { //If you're not in by now, tough luck
                    cm.sendOk("另一個房間已經開始 " + expedBoss + "。");
                    cm.dispose();
                }
            }
        } else if (status == 1) {
            if (selection == 1) {
                expedition = cm.getExpedition(exped);
                if (expedition != null) {
                    cm.sendOk("已經有人主動成為房整。試著加入他們！");
                    cm.dispose();
                    return;
                }

                var res = cm.createExpedition(exped, false, 最少人數, 最多人數, 挑戰次數);//最少人，最多人，次數
                if (res == 0) {
                    cm.sendOk("#r" + expedBoss + " 房間#k 已建立。\r\n\r\n請再次與我對話決定下一步！");
                } else if (res > 0) {
                    cm.sendOk("對不起，您已經達到了今天挑戰的次數！");
                } else {
                    cm.sendOk("開始遊戲時發生意外錯誤，請稍後再試。");
                }

                cm.dispose();
                return;
            } else if (selection == 2) {
                cm.sendOk("沒事啦，下次再來玩。");
                cm.dispose();
                return;
            }
        } else if (status == 2) {
            if (selection == 1) {
                if (expedition == null) {
                    cm.sendOk("無法開始遊戲。");
                    cm.dispose();
                    return;
                }
                expedMembers = expedition.getMemberList();
                var size = expedMembers.size();
                if (size == 1) {
                    cm.sendOk("你是房間的唯一成員。");
                    cm.dispose();
                    return;
                }
                var text = "以下為房間內的成員（點選他們踢出他們）：\r\n";
                text += "\r\n\t\t1." + expedition.getLeader().getName();
                for (var i = 1; i < size; i++) {
                    text += "\r\n#b#L" + (i + 1) + "#" + (i + 1) + ". " + expedMembers.get(i).getValue() + "#l\n";
                }
                cm.sendSimple(text);
                status = 6;
            } else if (selection == 2) {
                var min = exped.getMinSize();

                var size = expedition.getMemberList().size();
                if (size < 最少人數) {
                    cm.sendOk("你至少需要 " + 最少人數 + "個人加入房間。");
                    cm.dispose();
                    return;
                }

                cm.sendOk("遊戲即將開始，你現在將被送到 #b" + expedMap + "#k。");
                status = 4;
            } else if (selection == 3) {
                player.getMap().dropMessage(6, expedition.getLeader().getName() + " 已經關閉了房間。");
                cm.endExpedition(expedition);
                cm.sendOk("房間關閉了...");
                cm.dispose();
                return;
            }
        } else if (status == 4) {
            if (em == null) {
                cm.sendOk("事件無法初始化，請聯繫管理員。");
                cm.dispose();
                return;
            }

            em.setProperty("leader", player.getName());
            em.setProperty("channel", player.getClient().getChannel());
            if (!em.startInstance(expedition)) {
                cm.sendOk("另一房間已經開始了 " + expedBoss + "。");
                cm.dispose();
                return;
            }

            cm.dispose();
            return;
        } else if (status == 6) {
            if (selection > 0) {
                var banned = expedMembers.get(selection - 1);
                expedition.ban(banned);
                cm.sendOk("你已經禁止 " + banned.getValue() + "。");    // getValue, thanks MedicOP (MicroWilly69) for finding this issue
                cm.dispose();
            } else {
                cm.sendSimple(list);
                status = 2;
            }
        }
    }
}
