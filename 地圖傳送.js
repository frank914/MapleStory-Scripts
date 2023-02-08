var 紫色x = "#fUI/GuildMark.img/Mark/Pattern/00004001/14#"; //粉紅星星
var 粉色x = "#fEffect/CharacterEff/1050334/1/1#";
var arrow2 = "#fUI/UIWindow/Quest/icon6/7#";
var arrow1 = "#fUI/UIWindow/Quest/icon8/0#";
var arrow = "#fUI/UIWindow.img/VegaSpell/EffectArrow/0#";
var 藍圈圈 = "#fUI/UIWindow/Quest/icon4#";
var 藍閃 = "#fEffect/CharacterEff/1003393/1/0#";
var 音符 =  "#fEffect/CharacterEff/1003271/0/0#"; //向右指標1003271
var 星星 = "#fEffect/CharacterEff/1102232/2/0#";
var 紫星星 = "#fEffect/CharacterEff/1051296/1/0#";
var 七彩星星 = "#fEffect/CharacterEff/1082312/0/0#";
var 兔子 = "#fEffect/CharacterEff/1112960/0/0#";
var 紅閃 = "#fEffect/CharacterEff/1114000/3/0#";
var 黃星 = "#fEffect/CharacterEff/1051295/1/0#";
var 熊貓 = "#fNpc/2090006.img/stand/0#";
var 熊貓2 = "#fNpc/2090006.img/stand/2#";
var 黃星 = "#fEffect/CharacterEff/1051295/1/0#";
var b27 = "#fUI/GuildMark.img/Mark/Pattern/00004001/4#"; //白色星星
var right = "#fUI/Basic.img/BtHide3/mouseOver/0#";
var left = "#fUI/Basic.img/BtHide2/mouseOver/0#";
var icons = [arrow2, arrow1, arrow, 藍圈圈, 藍閃, 音符, 星星, 紫星星, 七彩星星, 兔子, 紅閃, 黃星, 熊貓, 熊貓2];
var status = -1;  
var sel;
var meso=0;
var 開啟NPC代碼 = 9010000;
var 母NPC ="腳本整理/聚合功能";
var 該NPC位置 = "腳本整理/傳送腳本/地圖傳送";
var text="到達目的地，一共收您"+meso+"楓幣";
var 世界導遊Map = [
["【#b 自由市場 #k】",910000000],
["【#b 弓箭手村 #k】",100000000],
["【#b 墮落城市 #k】",103000000],
["【#b 勇士之村 #k】",102000000],
["【#b維多利亞港#k】",104000000],
["【#b鯨魚號碼頭#k】",120000000],
["【#b 魔法森林 #k】",101000000],
["【#b  轉蛋屋  #k】",749050400],
["【#b  西門町  #k】",740000000],
["【#b 桃花仙境 #k】",250000100],
["【#b 101 大道 #k】",742000000],
["【#b  上海灘  #k】",701000000],
["【#b   泰國   #k】",500000000],
["【#b 楓葉古城 #k】",800040000],
["【#b 黃金海灘 #k】",110000000],
["【#b中心商務區#k】",540000000],
["【#b幽靈碼頭城#k】",541000000],
["【#b都會潮流區#k】",550000000],
["【#b  昭和村  #k】",801000000],
["【#b  少林寺  #k】",702000000],
["【#b 日本神社 #k】",800000000],
["【#b 天空之城 #k】",200000000],
["【#b  玩具城  #k】",220000000],
["【#b 桃花仙境 #k】",250000000],
["【#b  神木村  #k】",240000000],
["【#b 結婚小鎮 #k】",680000000],
["【#b  新葉城  #k】",600000000],
["【#b 納希沙漠 #k】",260000000],
["【#b 艾靈森林 #k】",300000000],
["【#b 冰原雪域 #k】",211000000],
["【#b  水世界  #k】",230000000],
["【#b  童話村  #k】",222000000],
["【#b 靈藥幻境 #k】",251000000],
["【#b瑪迦提亞城#k】",261000000],
["【#b 時間神殿 #k】",270000100],
["【#b  耶雷弗  #k】",130000000],
["【#b  瑞恩村  #k】",140000000],
["【#r返回上一頁#k】",-1] 
];

var 練功地圖Map = [
["【#b  弓箭手訓練場 I  #k】",104040000],
["【#b地鐵一號線(地區01)#k】",103000101],
["【#b  捷運車廂內部 2  #k】",742000103],
["【#b      郊區 1      #k】",540020000],
["【#b      郊區 2      #k】",540020100],
["【#b    神秘小徑 1    #k】",541000100],
["【#b    神秘小徑 3    #k】",541000300],
["【#b     幽靈船 2     #k】",541010010],
["【#b   藏經閣第七層   #k】",702070400],
["【#b 都會廣場東部區域 #k】",742010100],
["【#b   夢幻公園入口   #k】",551030100],
["【#b    烏魯城中心    #k】",541020500],
["【#r    返回上一頁    #k】",-1] 
];
var 王Map = [
["【#b 殘暴炎魔 #k】",211042300],
["【#b 暗黑龍王 #k】",240040700],
["【#b  皮卡啾  #k】",270050000],
["【#b 格瑞芬多 #k】",240020101],
["【#b  噴火龍  #k】",240020401],
["【#b  海怒斯  #k】",230040420],
["【#b  拉圖斯  #k】",220080000],
["【#b 天狗地圖 #k】",800020130],
["【#b 熊獅入口 #k】",551030100],
["【#r返回上一頁#k】",-1] 
];
var 組隊Map = [
["#b第一次同行#d　　　　　　　『等級:21-250』",103000000],
["#b時空裂縫#d　　　　　　　　『等級:35-250』",221024500],
["#b毒霧森林#d　　　　　　　　『等級:45-250』",300030100],
["#b武林道場#d　　　　　　　　『等級:10~250』",925020000],
["#b怪物擂台#d　　　　　　　　『等級:30~250』",2042002],
["#b疑問之塔#d　　　　　　　　『等級:55~250』",200080101],
["#b奈特的金字塔#d　　　　　　『等級:45~250』",926010000],
["#b金勾海盜船#d　	　　　　　『等級:55~250』",251010404],
["#b羅密歐與茱麗葉#d　　　　　『等級:70~250』",261000021],
["#r返回上一頁",-1] 
];
var tempUsed = [];

function start() { 
    action(1, 0, 0); 
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else if (mode == 0){
        status--;
    } else {
		cm.dispose();
	}
	if(status == 0) {
		var msg = "\t\t\t\t\t《 地圖傳送 》\r\n";
		msg += "\t\t  #L0##i2030000##l\t\t\t\t#L1##i2030000##l\r\n";
		msg += "\t#L0#"+right+"#k【 世界導遊 】"+left+"#l#k";
		msg += "   #L1#"+right+"#k【 練功地圖 】"+left+"#l\r\n\r\n#k";
		
		msg += "\t\t  #L2##i2030000##l\t\t\t\t#L3##i2030000##l\r\n";
		msg += "\t#L2#"+right+"#k【 BOSS傳送 】"+left+"#l#k";
		msg += "   #L3#"+right+"#k【 組隊傳送 】"+left+"#l#k\r\n\r\n";
		
		msg += "\t\t\t\t\t   #L100##i2030000##l\r\n";
		msg += "\t\t\t\t#L100##k"+right+"【 回上一頁 】"+left+"#l\r\n";
		msg += "#n#e#k";
		cm.sendSimple(msg);
	} else if(status == 1) {
		sel = selection;
		switch (selection) {
		case 0:
			tempUsed = 世界導遊Map;
			var str = "#k需要傳送到哪裡?";
			str += "\r\n所需費用:#r#e"+meso+"#k#n楓幣\r\n";
			for ( var i = 0; i<世界導遊Map.length ; i++ ){
				if(i % 3 == 0 && i != 0)
					str += "\r\n";
				else if ( i != 0 )
					str+= " "
				str += "#L"+i+"#"+世界導遊Map[i][0]+"#l";
			}
			cm.sendSimple(str);
			break;
		case 1:
			tempUsed = 練功地圖Map;
			var str = "#k需要傳送到哪張練功地圖呢?";
			str += "\r\n所需費用:#r#e"+meso+"#k#n楓幣\r\n";
			for ( var i = 0; i<練功地圖Map.length ; i++ ){
				if(i % 2 == 0 && i != 0)
					str += "\r\n";
				else if ( i != 0 )
					str+= " "
				str += "#L"+i+"#"+練功地圖Map[i][0]+"#l";
			}
			cm.sendSimple(str);
			break;
		case 2:
			tempUsed = 王Map;
			var str = "#k需要傳送到哪張BOSS地圖呢?";
			str += "\r\n所需費用:#r#e"+meso+"#k#n楓幣\r\n";
			for ( var i = 0; i<王Map.length ; i++ ){
				if(i % 3 == 0 && i != 0)
					str += "\r\n";
				else if ( i != 0 )
					str+= ""
				str += "#L"+i+"#"+王Map[i][0]+"#l";
			}
			
			cm.sendSimple(str);
			break;
		case 3:
			tempUsed = 組隊Map;
			var str = "#k需要傳送到哪張組隊地圖呢?";
			str += "\r\n所需費用:#r#e"+meso+"#k#n楓幣\r\n";
			for ( var i = 0; i<組隊Map.length ; i++ ){
				str += "#r#L"+i+"#"+arrow2+組隊Map[i][0]+"\r\n";
			}
			cm.sendSimple(str);
			break;
		case 100:
			cm.dispose();
			cm.openNpc(開啟NPC代碼,母NPC);
		}
	} else if (status == 2 ){
		if ( tempUsed[selection][1] == -1 ) {
			cm.dispose();
			cm.openNpc(開啟NPC代碼,該NPC位置);
			return;
		} else if(cm.getMeso() >= meso ){
			if(meso > 0) {
				cm.gainMeso(-meso);
				cm.playerMessage(5,[text]);
			}
			cm.warp(tempUsed[selection][1])
			cm.dispose();
		} else {
			cm.sendOk("請確認一下身上的楓幣是否足夠#i4032181#");
			cm.dispose();
		}
	} else {
		cm.dispose();
	}
}
