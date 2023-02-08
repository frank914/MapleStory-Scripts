var input = "";
function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1)
        status++;
    else
        status--;
    if (status == 0) {
        cm.sendGetText("請輸入要更改的名稱");
    } else if (status == 1) {
        var text = cm.getText();
        var canCreate = cm.canCreateChar(text);
        var victim = cm.getPlayer();
        if (canCreate) {
            victim.dropMessage(1, "完成改名了~~");
            victim.changeName(text);
            victim.getClient().changeChannel(victim.getClient().getChannel());
            cm.dispose();
        } else {
            cm.sendOk("名字已經被使用過了");
            cm.dispose();
        }
    } else {
        cm.dispose();
    }
}
