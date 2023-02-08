
var status = -1;
var rewardItem = 2450000;
var rewardItem2 = 4032056;
var log = "祝賀";
var banList = ["fuck","Fuck","爛谷","幹"];

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if ( mode == 1 ){
		status++ ;
	} else {
		cm.dispose();
		return;
	}
    if (status === 0) {
        cm.sendGetText("請輸入你有關於對xx谷的祝福");
    } else if (status === 1) {
		if ( cm.getPlayer().getAccLogValue(log) > 0 ) {
			cm.sendOk("今日已祝賀過了~")
			cm.dispose();
			return;
		} else if ( cm.getText().length < 5 ) {
			cm.sendOk("至少要5個字哦!")
			cm.dispose();
			return;
		} else if ( !checkText(cm.getText()) ) {
			cm.sendOk("有被禁用的文字存在")
			cm.dispose();
			return;
		} else if ( !cm.hasAllSpace(3) ) {
			cm.sendOk("背包空間不足~")
			cm.dispose();
			return;
		} else if (cm.getText().contains("xx谷")) {
			cm.getPlayer().setAccDailyLogValue(log,1);
            cm.gainItem(rewardItem, 1);
            cm.gainItem(rewardItem2, 1);
            cm.sendOk("完成祝賀了~");
        } else {
			cm.sendOk("你所說的不包含祝賀 ~")
			cm.dispose();
			return;
		}
		cm.dispose();
		return;
    } else {
		cm.dispose();
		return;
	}
}

function checkText(msg) {
	for ( var i = 0 ; i < banList.length ; i++ ){
		if ( msg.contains(banList[i]) ) {
			return false;
		}
	}
	return true;
}