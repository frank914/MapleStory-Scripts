var typeSel = -1;
var info = [
[999000001,"包廂一",5220011,[9400203,500,1000,50000,1102,274],[9400203,500,1000,50000,447,-35]],
[999000002,"包廂二",5220011,[9420540,500,10000,100000,-1113,-1049],[9420540,500,10000,100000,-1273,-1056]],  
[999000003,"包廂三",5220011,[9420517,500,100000,150000,-281,-221],[9420517,500,100000,150000,-87,185]]
];
var status = -1 ;


function start(){
	action(1,0,0);
}

function action(mode,type,selection){
    if (mode == 1) {
        status++;
    } else if (mode == 0) {
        status--;
    } else {
        cm.dispose();
        return;
    }

	if ( status == 0 ) {
		var msg = "您需要甚麼呢?\r\n";
		msg += "#L0#物品兌換\r\n";
		msg += "#L1#前往#r#e會員專屬#k#n地圖\r\n";
		cm.sendSimple(msg);
	} else if ( status == 1 ) {
		if ( selection == 0 ) {
			cm.dispose();
			cm.openNpc(9901628,"腳本整理/忠誠會員");
		} else if ( selection == 1 ) {
			typeSel = selection;
			var msg = "入場...\r\n";
			for ( var i = 0 ; i < info.length ; i++ ){
				msg += "#L"+i+"#"+info[i][1]+"入場# - (身上需要:#i"+info[i][2]+"##t"+info[i][2]+"#)#k#l\r\n";
			}
			cm.sendSimple(msg);
		}
	} else if ( status == 2 ){
		if ( selection < 0 || selection >= info.length ){
			cm.dispose();
		} else if ( typeSel == 1 ){
			if ( !cm.haveItem(info[selection][2],1) ){
				cm.sendOk("身上沒有需求道具");
				cm.dispose();
				return;
			}
			cm.warp(info[selection][0],0);
			for ( var i = 3 ; i < info[selection].length ; i++ ) {
				for ( var j = 0 ; j < info[selection][i][1] ; j++ ) {
					var mob = cm.getMonster(info[selection][i][0]);
					var modified = cm.newMonsterStats();
					if ( info[selection][i][2] < 0 )
						modified.setOHp(mob.getHp());
					else
						modified.setOHp(info[selection][i][2]);
					modified.setOMp(mob.getMp());
					if ( info[selection][i][3] < 0 )
						modified.setOExp(mob.getExp());
					else
						modified.setOExp(info[selection][i][3]);
					mob.setOverrideStats(modified);
					var tmap = cm.getMap(info[selection][0]);
					tmap.spawnMonsterOnGroundBelow(mob, new java.awt.Point(info[selection][i][4], info[selection][i][5]));
				}
				// [怪物,num,hp,exp,x,y]
			}
			cm.dispose();
		}
	}else{
		cm.dispose();
	}
}