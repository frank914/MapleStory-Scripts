var status = -1;  
var sel;
var reqGASH=0;

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
	
	if(status == 0) {
		cm.sendYesNo((cm.getPlayer().getGender()==0? "你是#r男性#k啊，想要在這裡做切除變性手術嗎?":"你是女性啊!想在這裡做加裝變性手術嗎?!")+"\r\n#b所需費用GASH:"+reqGASH);
	}else if(status == 1){
		if ( cm.getPlayer().getCSPoints(1) > reqGASH ){
                cm.getPlayer().gainCash(1, -reqGASH);
			cm.getPlayer().setGender((cm.getPlayer().getGender()==0?1:0));
			cm.sendOk("#b變性成功#k，扣除了#b"+reqGASH+"GASH#k，脫褲檢查一下你的#r"+(cm.getPlayer().getGender()?"妹妹":"弟弟")+"#k!");
		}else {
			cm.sendOk("你沒GASH啊!滾");
		}
		cm.dispose();
	}
}
