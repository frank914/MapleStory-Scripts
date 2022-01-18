/* 
Writing by Xiang  Line Frank914a
尊重作者請勿販賣 尊重作者請勿販賣 尊重作者請勿販賣
*/
var status = -1;
var sel = -1,selType = -1,keySel = -1,skillSel = -1;
var input;
var skillList =[
[10, // 等級
1, // 可偷招數
[ // 可偷技能列表
1001003,
1001004,
1001005,
2001002,
2001003,
2001004,
2001005,
3001003,
3001004,
3001005,
4001002,
4001003,
4001334,
4001344,
5001001,
5001002,
5001003,
5001005]
],
[30, // 等級
1, // 可偷招數
[ // 可偷技能列表
1101006,
1101007,
1301006,
1301007,
1201006,
1201007,
3101004,
3101005,
3201004,
3201005,
5101002,
5101033,
5101004,
5201001,
5201002,
5201005,
2201004,
2201002,
2201005,
2101004,
2101002,
2301005,
2301001]
],
[70, // 等級
2, // 可偷招數
[ // 可偷技能列表
1311004,
1211009,
4211002,
4111005,
3111004,
3211004,
5211004,
5211005,
2211002,
2211003,
2211006,
2111002,
2111006,
2311004]
],
[120, // 等級
3, // 可偷招數
[ // 可偷技能列表
1121000,
1121002,
1121008,
1321002,
1221000,
1221009,
1321000,
4221000,
4221007, 
4221000,
4121006,
4121000,
3121000,
3121000,
3221000,
5121001,
5121007,
5121000,
5221006,
5221007,
5221000,
2221006,
2221003,
2221000, 
2121003,
2121006,
2121000,
2321007,
2321000]
]
];
var 可使用鍵盤位置 = [
[1,"Esc"],
[2,"數字1"],
[3,"數字2"],
[4,"數字3"],
[5,"數字4"],
[6,"數字5"],
[7,"數字6"],
[8,"數字7"],
[9,"數字8"],
[10,"數字9"],
[11,"數字0"],
[12,"-"],
[14,"BkSpc"],
[15,"Tab"],
[16,"Q"],
[17,"W"],
[18,"E"],
[19,"R"],
[20,"T"],
[21,"Y"],
[22,"U"],
[23,"I"],
[24,"O"],
[25,"P"],
[26,"["],
[27,"]"],
[29,"Left Ctrl"],
[30,"A"],
[31,"S"],
[32,"D"],
[33,"F"],
[34,"G"],
[35,"H"],	
[36,"J"],
[37,"K"],
[38,"L"],
[42,"Left Shift"],
[44,"Z"],
[45,"X"],
[46,"C"],
[47,"V"],
[48,"B"],
[49,"N"],
[50,"M"],
[51,"],"],
[52,"."],
[53,"/"],
[54,"Right Shift"],
[55,"Gray *"],
[56,"Left Alt"],
[57,"Space"],
[58,"Caps"],
[59,"F1"],
[60,"F2"],
[61,"F3"],
[62,"F4"],
[63,"F5"],
[64,"F6"],
[65,"F7"],
[66,"F8"],
[67,"F9"],
[68,"F10"],
[69,"NumLock"],
[70,"ScrollLock"],	
[71,"Pad 7"],
[72,"Pad 8"],
[73,"Pad 9"],
[74,"Gray Minus"],
[75,"Pad 4"],
[76,"Pad 5"],
[77,"Pad 6"],
[78,"Gray Plus"],
[79,"Pad 1"],
[80,"Pad 2"],
[81,"Pad 3"],
[82,"Pad 0/Ins"],
[83,"Pad ./Del"],
[84,"PrtScr/SysRq"],
[87,"F11"],
[88,"F12"],
[90,"Pause/Break"],
[91,"Insert"],
[92,"Home"],
[93,"PgUp"],
[94,"Gray /"],
[95,"Delete"],
[96,"End"],
[97,"PgDn"],
[98,"Right Alt"],
[99,"Right Ctrl"]
];
function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0) {
        cm.dispose();
        return;
    } else {
        status++;
    }
	if ( cm.getPlayer().getJobId() != 0 && cm.getPlayer().getJobId() != 900 ) {
		cm.sendOk("你不是初心者");
		cm.dispose();
		return;
	}
    if (status == 0) {
		var msg = "歡迎使用#r#e初心者#n#k專用偷技能腳本\r\n";
		msg += "#e#b#L10000#偷技能系統使用說明\r\n#k";
		
		for ( var i = 0 ; i < skillList.length ; i++ ) {
			if ( cm.getPlayer().getLevel() >= skillList[i][0] )
				msg += "#e#b#L"+i+"##r"+skillList[i][0]+"#b等技能欄位#d("+skillList[i][1]+"個技能)\r\n";
		}
		
		cm.sendSimple(msg);
	} else if ( status == 1 ) {
		sel = selection ;
		if ( sel == 10000 ) {
			var msg = "";
			cm.sendNext(msg);
			status = -1;
		} else {
			if ( cm.getPlayer().getLevel() < skillList[sel][0] ) {
				cm.sendOk("發生錯誤.");
				cm.dispose();
				return;
			} else {
				var msg = "請選擇以下功能:\r\n";
				msg += "#L0#將技能放入鍵盤欄位\r\n";
				msg += "#L1#更換偷竊之技能\r\n";
				cm.sendSimple(msg);
			}
		}
	} else if ( status == 2 ) {
		if ( sel != 100000 ) {
			selType = selection;
			if ( cm.getPlayer().getLevel() < skillList[sel][0] ) {
				cm.sendOk("發生錯誤.");
				cm.dispose();
				return;
			} else if ( selType == 0 ) {
				var msg = "以下為您目前所擁有技能:\r\n";
				for ( var i = 0 ; i < skillList[sel][1] ; i++ ) {
					var skillId = cm.getPlayer().getMapleLog(skillList[sel][0]+"等偷竊技能"+(i+1));
					if ( skillId == null ) {
						msg += "#L"+i+"##r該欄位無技能#n#k";
					} else {
						msg += "#L"+i+"##b#s"+skillId.getValue()+"##q"+skillId.getValue()+"##r"+skillId.getValue2()+"#b點#n#k";
					}
					msg += "\r\n";
				}
				cm.sendSimple(msg);
			} else if ( selType == 1 ) {
				var msg = "以下為您目前所擁有技能(#r請選擇要替換的技能#k):\r\n";
				for ( var i = 0 ; i < skillList[sel][1] ; i++ ) {
					var skillId = cm.getPlayer().getMapleLog(skillList[sel][0]+"等偷竊技能"+(i+1));
					if ( skillId == null ) {
						msg += "#L"+i+"##r該欄位無技能#n#k";
					} else {
						msg += "#L"+i+"##b#s"+skillId.getValue()+"##q"+skillId.getValue()+"##r"+skillId.getValue2()+"#b點#n#k";
					}
					msg += "\r\n";
				}
				cm.sendSimple(msg);
			}
		} else {
			cm.dispose();
			return;
		}
	} else if ( status == 3 ) {
		if ( sel != 100000 ) {
			skillSel = selection;
			if ( cm.getPlayer().getLevel() < skillList[sel][0] ) {
				cm.sendOk("發生錯誤.");
				cm.dispose();
				return;
			} else if ( selType == 0 ) {
				var skillId = cm.getPlayer().getLogValue(skillList[sel][0]+"等偷竊技能"+(skillSel+1));
				var msg = "請選擇要放入的鍵盤欄位:\r\n";
				if ( skillId == -1 ) {
					cm.sendNext("空技能不可以放入鍵盤欄位，下一步回首頁..");
					sel = -1,selType = -1,keySel = -1,skillSel = -1;
					status = -1;
				} else {
					for ( var i = 0 ; i < 可使用鍵盤位置.length ; i++ ) {
						while ( 可使用鍵盤位置[i][1].length < 10 )
							可使用鍵盤位置[i][1] += "#l ";
						msg += "#L"+i+"##b"+可使用鍵盤位置[i][1]+"#l";
						if ( (i+1) % 4 == 0 )
							msg += "\r\n";
					}
					cm.sendSimple(msg);
				}
			} else if ( selType == 1 ) {
				var msg = "請輸入地圖上欲偷的玩家名稱:#k:\r\n";
				cm.sendGetText(msg);
			}
		} else {
			cm.dispose();
			return;
		}
	} else if ( status == 4 ) {
		if ( sel != 100000 ) {
			if ( cm.getPlayer().getLevel() < skillList[sel][0] ) {
				cm.sendOk("發生錯誤.");
				cm.dispose();
				return;
			} else if ( selType == 0 ) {
				var skillId = cm.getPlayer().getMapleLog(skillList[sel][0]+"等偷竊技能"+(skillSel+1))
				cm.putKey(parseInt(可使用鍵盤位置[selection][0]),parseInt(skillId.getValue()));
				cm.sendOk("檢查看看鍵盤吧!");
				cm.dispose();
			} else if ( selType == 1 ) {
				input = cm.getText();
				var victim = cm.getPlayer().getMap().getCharacterByName(input);
				if ( victim == null ) {
					cm.sendNext("該玩家不存在地圖上..");
					sel = -1,selType = -1,keySel = -1,skillSel = -1;
					status = -1;
				} else {
					var msg = "請選擇欲偷的技能:#k\r\n";
					for ( var i = 0 ; i < skillList[sel][2].length ; i++ ) {
						var skillId = skillList[sel][2][i];
						if ( victim.getSkillLevel(skillId) > 0 ) {
							msg += "#L"+skillId+"##s"+skillId+"##q"+skillId+"##b"+victim.getSkillLevel(skillId)+"#k點\r\n"
						}
					}
					cm.sendSimple(msg);
				}
			}
		} else {
			cm.dispose();
			return;
		}
	} else if ( status == 5 ) {
		if ( sel != 100000 ) {
			if ( cm.getPlayer().getLevel() < skillList[sel][0] ) {
				cm.sendOk("發生錯誤.");
				cm.dispose();
				return;
			} else if ( selType == 0 ) {
			} else if ( selType == 1 ) {
				var victim = cm.getPlayer().getMap().getCharacterByName(input);
				if ( victim == null ) {
					cm.sendNext("該玩家不存在地圖上..");
					sel = -1,selType = -1,keySel = -1,skillSel = -1;
					status = -1;
				} else {
					skillId = selection;
					if ( !canSteal(skillId) ) {
						cm.dispose();
						return;
					}
					var msg = "已完成偷技能:#k\r\n";
					msg += "#s"+skillId+"##q"+skillId+"##b"+victim.getSkillLevel(skillId)+"#k點已成功獲取至欄位"+(skillSel+1)+"\r\n"
					if ( cm.getPlayer().getLog(skillList[sel][0]+"等偷竊技能"+(skillSel+1)) != null ) {
						cm.getPlayer().changeSkillLevel(cm.getPlayer().getLogValue(skillList[sel][0]+"等偷竊技能"+(skillSel+1)),0,0,-1);
					}
					cm.getPlayer().setLog(skillList[sel][0]+"等偷竊技能"+(skillSel+1),skillId,victim.getSkillLevel(skillId),0,-1);
					cm.getPlayer().changeSkillLevel(skillId,victim.getSkillLevel(skillId),victim.getSkillLevel(skillId),-1);
					cm.sendNext(msg);
					sel = -1,selType = -1,keySel = -1,skillSel = -1;
					status = -1;
				}
			}
		} else {
			cm.dispose();
			return;
		}
	}
}

function canSteal(skillId) {
	for ( var i = 0 ; i < skillList[sel][2].length ; i++ ){
		if ( skillList[sel][2][i] == skillId ) {
			return true;
		}
	}
	return false;
}