var status = -1;
function start() {
	action(1,0,0);
}
function action(mode,type,selection){
	if ( mode == 1 ) {
		status++;
	} else if ( mode == 0 ) {
		status--;
	} else {
		cm.dispose();
		return;
	}
	if ( status ==  0 ) {
		cm.sendYesNo("你是否要離開?")
	} else if ( status == 1 ) {
		cm.warp(211070000);
		cm.dispose();
	} else {
		cm.dispose();
	}
}