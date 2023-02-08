var status = -1;
var time = 5;
var meso = 1000000;
var log = "改密碼";

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
        var msg = "";
        msg += "歡迎使用改密碼Npc\r\n";
        msg += "請問是否要改密碼?\r\n";
        cm.sendYesNo(msg);
    } else if (status == 1) {
        if (cm.getPlayer().getAccLogValue(log) >= time) {
            cm.sendNext("一個帳號只能改" + time + "次密碼");
            cm.dispose();
            return;
        } else if (cm.getPlayer().getMeso() < meso) {
            cm.sendNext("改密碼至少需要" + meso + "錢");
            cm.dispose();
            return;
        }
        cm.sendGetText("請輸入要更改的新密碼");
    } else if (status == 2) {
        var pass = cm.getText();
        if (pass.length() > 12) {
            cm.sendNext("密碼過長");
            status = -1;
            return;
        } else if (pass.length() < 6) {
            cm.sendNext("密碼過短");
            status = -1;
            return;
        }
        cm.gainMeso(-meso);
        cm.getPlayer().addAccLogValue(log);
        cm.getClient().changePassword(pass);
        cm.sendNext("修改密碼成功");
        cm.dispose();
    }
}
