var status;
var reqItem = 2432043;
var log = "";
var maxTime = -1; // -1不限制
var list = [
0,0,0,
1,1,1,
2,2,2,
3,3,
4,
5,
6,
7,
8,
9,
10
]; // 有可能出現的能力值
var statTyped = 0; // str, dex, int, luk, 4屬
var meso = 10000;
function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 0) {
			var msg = "安安你好，你要打開能力隨機箱嗎\r\n";
			msg += "給予4屬隨機，你要使用幾個\r\n";
			if ( maxTime > 0 ) {
				msg += "最大次數:("+(cm.getPlayer().getLogValue(log)==0?0:cm.getPlayer().getLogValue(log))+")/" + maxTime;
			}
			cm.sendGetNumber(msg,1,1,100);
		} else if ( status == 1 ) {
			if ( meso*selection > cm.getPlayer().getMeso() ) {
				cm.sendOk("身上沒有足夠楓幣，需要"+meso+"楓幣");
				cm.dispose();
				return;
			} else if ( !cm.haveItem(reqItem,selection) ) {
				cm.sendOk("身上沒有#i"+reqItem+"##t"+reqItem+"#");
				cm.dispose();
				return;
			} else if ( cm.getPlayer().getLogValue(log) > maxTime ) {
				cm.sendOk("超過最大次數了");
				cm.dispose();
				return;
			}
			cm.gainItem(reqItem,-selection);
			if ( meso > 0 )
				cm.gainMeso(-meso*selection);
			var num = 0;
			for ( var i = 0 ; i < selection ; i++ )
				num += list[Math.floor(Math.random()*list.length)];
			var 名字 = "";
			switch (statTyped) {
				case 0:
					名字 = "力量";
					if ( cm.getPlayer().getStr()+num <= 32767 )
						cm.getPlayer().setStr(cm.getPlayer().getStr()+num);
					else
						cm.getPlayer().setStr(32767);
					break;
				case 1:
					名字 = "敏捷";
					if ( cm.getPlayer().getDex()+num <= 32767 )
						cm.getPlayer().setDex(cm.getPlayer().getDex()+num);
					else
						cm.getPlayer().setDex(32767);
					break;
				case 2:
					名字 = "智力";
					if ( cm.getPlayer().getInt()+num <= 32767 )
						cm.getPlayer().setInt(cm.getPlayer().getInt()+num);
					else
						cm.getPlayer().setInt(32767);
					break;
				case 3:
					名字 = "幸運";
					if ( cm.getPlayer().getLuk()+num <= 32767 )
						cm.getPlayer().setLuk(cm.getPlayer().getLuk()+num);
					else
						cm.getPlayer().setLuk(32767);
					break;
				case 4:
					名字 = "全屬性";
					if ( cm.getPlayer().getStr()+num <= 32767 )
						cm.getPlayer().setStr(cm.getPlayer().getStr()+num);
					else
						cm.getPlayer().setStr(32767);
					num = 0;
					for ( var i = 0 ; i < selection ; i++ )
						num += list[Math.floor(Math.random()*list.length)];
					if ( cm.getPlayer().getDex()+num <= 32767 )
						cm.getPlayer().setDex(cm.getPlayer().getDex()+num);
					else
						cm.getPlayer().setDex(32767);
					num = 0;
					for ( var i = 0 ; i < selection ; i++ )
						num += list[Math.floor(Math.random()*list.length)];
					if ( cm.getPlayer().getInt()+num <= 32767 )
						cm.getPlayer().setInt(cm.getPlayer().getInt()+num);
					else
						cm.getPlayer().setInt(32767);
					num = 0;
					for ( var i = 0 ; i < selection ; i++ )
						num += list[Math.floor(Math.random()*list.length)];
					if ( cm.getPlayer().getLuk()+num <= 32767 )
						cm.getPlayer().setLuk(cm.getPlayer().getLuk()+num);
					else
						cm.getPlayer().setLuk(32767);
					break;;
			}
			if ( maxTime > 0 ) {
				cm.getPlayer().addLogValue(log,1);
			}
            cm.getPlayer().updateAllStats();
			cm.sendOk("恭喜你獲得了"+名字+"#r"+num+"");
			cm.dispose();
		}
    }
}

function getRand(Min,Max) {
	return Math.floor(Math.random()*(Max-Min+1))+Min;
}