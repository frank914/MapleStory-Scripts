var menu = [
    //標題,道具代碼,最小值,最大值
        ["洗血",4007016,50,150],
        ["洗魔",4007017,50,150],
    ];
    
    function start() {
        status = -1;
        action(1, 0, 0);
    }
    
    var modes;
    function action(mode, type, sel) {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        mode == 1 ? status++ : status--
        
        var text = "";
        switch (status) {
            case 0:
                text += "#d歡迎使用 洗血洗魔系統\r\n";
                for (var i in menu){
                    text += "#L"+ i +"#我要使用 #d#i"+ menu[i][1] +"##z"+ menu[i][1] +"# "+ menu[i][0] +" 可隨機增加 "+ menu[i][2] +" ~ "+ menu[i][3] +"#l\r\n"
                }
                cm.sendSimple(text);
                break;
            case 1:
                modes = sel;
                text += "請輸入要使用多少個#i"+ menu[modes][1] +"##z"+ menu[modes][1] +"# "+menu[modes][0];
                cm.sendGetNumber(text, 1, 1, 600);
                break;
            case 2:
                if (sel < 1 || sel > 600){
                    cm.sendOk("輸入異常");
                    cm.dispose();
                    break;
                }
                var HpMp = getRandom(menu[modes][2],menu[modes][3]);
                var update = HpMp*sel;
                var name = menu[modes][0];
                var ItemId = menu[modes][1];
                if (!cm.haveItem(ItemId,sel)) {
                    cm.sendNext("請準備好#i"+ ItemId +"##z"+ ItemId +"# x "+ sel +"個再來找我");
                    cm.dispose();
                    break;
                }
                if(getHpMp(modes) >= 30000 ){
                    cm.sendSimple("已達30000無法進行" + name);
                    cm.dispose();
                    return;
                }
                text += "#d已使用#r#i"+ ItemId +"##z"+ ItemId +"# x "+ sel +"個#d\r\n"
                text += "本次"+ name +"後提升了 : #r"+ update
                cm.gainItem(ItemId,-sel);
                if(Math.floor(getHpMp(modes)+update) >= 30000 )
                    setHpMp(modes,Math.floor(30000-getHpMp(modes)));
                else
                    setHpMp(modes,update);
                cm.sendOk(text);
                cm.dispose();
                break;
        }
    }
    
    function getHpMp(sel) {
        if(menu[sel][0] == "洗血")
            return cm.getPlayer().getClientMaxHp();
        if(menu[sel][0] == "洗魔")
            return cm.getPlayer().getClientMaxMp();
    }
    
    function setHpMp(sel,hpmp) {
        if(menu[sel][0] == "洗血")
            return cm.getPlayer().addMaxHP(hpmp);
        if(menu[sel][0] == "洗魔")
            return cm.getPlayer().addMaxMP(hpmp);
    }
    
    function getRandom(minNum, maxNum) {
        return Math.floor( Math.random() * (maxNum - minNum + 1) ) + minNum;
    }