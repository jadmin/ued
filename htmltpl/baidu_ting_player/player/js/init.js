rule_1.addHandler(function() {
	M3.dispatch(mbox.ACTION.ERR_LOADERR, [ listCtrl.currSong, {
		link : listCtrl.currLinkInfo ? (listCtrl.currLinkInfo.link || "") : "",
		lid : listCtrl.lid,
		wmpstate : listCtrl.player.getWMPState()
	} ]);
	listCtrl.preStatus = mbox.ACTION.ERR_LOADERR;
	listCtrl.nextSong()
});
rule_1.init();
rule_2.addHandler(function() {
	M3.dispatch(mbox.ACTION.ERR_BUFERR, [ listCtrl.currSong, {
		link : listCtrl.currLinkInfo ? (listCtrl.currLinkInfo.link || "") : "",
		lid : listCtrl.lid,
		wmpstate : listCtrl.player.getWMPState()
	} ]);
	listCtrl.preStatus = mbox.ACTION.ERR_BUFERR;
	listCtrl.nextSong()
});
rule_2.init();
rule_4.addHandler(function() {
	M3.dispatch(mbox.ACTION.ERR_PLAYERR, [ listCtrl.currSong, {
		preStatus : listCtrl.preStatus,
		link : listCtrl.currLinkInfo ? (listCtrl.currLinkInfo.link || "") : "",
		lid : listCtrl.lid,
		wmpstate : listCtrl.player.getWMPState()
	} ]);
	listCtrl.preStatus = mbox.ACTION.ERR_PLAYERR
});
rule_4.init();
rule_5.addHandler(function() {
	mbox.data.statAge( {
		songid : listCtrl.currSong.songId,
		singerid : listCtrl.currSong.artistId
	}, {
		onfailure : function() {
			mbox.data.statAge(listCtrl.currSong.songId,
					listCtrl.currSong.artistId, null)
		}
	});
	M3.dispatch(mbox.ACTION.PLAY60, [ listCtrl.currSong, {
		link : listCtrl.currLinkInfo ? (listCtrl.currLinkInfo.link || "") : "",
		lid : listCtrl.lid
	} ]);
	listCtrl.preStatus = mbox.ACTION.PLAY60;
	M3.dispatch(mbox.ACTION.ADDPLAYEDTIMES, [])
});
rule_5.init();
rule_7.addHandler(function() {
	listCtrl.preStatus = 100;
	listCtrl.start2play = listCtrl.startSW.getTime();
	listCtrl.load2play = listCtrl.loadSW.getTime();
	M3.dispatch(mbox.ACTION.PLAYSONG100MS, [ listCtrl.currSong, {
		fromstart : listCtrl.start2play,
		fromload : listCtrl.load2play,
		link : listCtrl.currLinkInfo ? (listCtrl.currLinkInfo.link || "") : "",
		lid : listCtrl.lid
	} ]);
	listCtrl.preStatus = mbox.ACTION.PLAYSONG100MS;
	playErrTime = 0
});
rule_7.init();
function log(b) {
	if (DEBUG && DEBUG.LOG) {
		try {
			if (console.log) {
				console.log(b)
			}
		} catch (a) {
		}
	}
}
var autoPlay = true, istop = false;
var playErrTime = 0;
var player;
var debug = false;
var listCtrl = mbox.logic.listCtrl;
function init() {
	player = baidu.m3;
	player.setErrorListener(function() {
		M3.dispatch(mbox.ACTION.MEDIAERROR, [])
	});
	player.init( {
		swfPath : "flash/fmp.swf",
		aacPath : "flash/aac.swf",
		engines : {
			wmp : PLAYCORE.WMP,
			fmp : PLAYCORE.FMP,
			audio : PLAYCORE.AUDIO,
			aac : PLAYCORE.ACC
		}
	});
	M3.playerRuleController.addRule(rule_1);
	M3.playerRuleController.addRule(rule_2);
	M3.playerRuleController.addRule(rule_4);
	M3.playerRuleController.addRule(rule_5);
	M3.playerRuleController.addRule(rule_7);
	listCtrl.init();
	listCtrl.playListName = listCtrl.showListName = listCtrl.listName.DEFAULT;
	mbox.panel = new mbox.ui.Panel( {
		wraper : "doc",
		base : {
			volume : "",
			localstoge : true
		},
		plugins : {
			lrc : {},
			seach : true,
			suggestion : false
		}
	});
	mbox.data.init(function() {
				PL = mbox.ui.playListInstance = new mbox.ui.PlayList();
				mbox.ui.playListInstance.init( {
					container : "playListContainer",
					data : []
				});
				mbox.init.bind( {
					listCtrl : mbox.logic.listCtrl,
					playList : mbox.ui.playListInstance
				});
				var a = mbox.localStorage.getVolume(), b = mbox.localStorage.getMute(), c = mbox.localStorage.getPlayMode();
				listCtrl.setMute(b);
				listCtrl.setVolume(a);
				new singleInstance().initSinglePage( {
					bridge : "bridge",
					single : "index",
					path : ""
				});
				if (!istop) {
					listCtrl.showDefaultList();
					if (autoPlay) {
						mbox.logic.listCtrl.nextSong()
					}
				}
				listCtrl.setPlayMode(c);
				if (b) {
					M3.dispatch(mbox.ACTION.MUTECHANGE, b)
				}
			});
	Log.send( {
		type : "playerinfo",
		playerver : player.getVersion(),
		coretype : player.curEngine
	})
}
baidu.dom.ready(function() {
	init();
	mbox.user.checklogin(false);
	mbox.logic.uniqueplay.init( {
		notUnique : function() {
			listCtrl.pauseSong()
		}
	})
});
baidu.event
		.on(
				window,
				"beforeunload",
				function() {
					if (listCtrl.currSong) {
						M3.dispatch(
										mbox.ACTION.PLAYEND,
										[
												listCtrl.currSong,
												{
													subject : listCtrl.playListName,
													position : Math.max(listCtrl.prevPosition, listCtrl.player.getCurrentPosition()),
													auto : listCtrl.auto,
													preStatus : listCtrl.preStatus,
													linkerr : listCtrl.linkerrmsg,
													fromstart : listCtrl.startSW.getTime(),
													fromload : listCtrl.loadSW.getTime(),
													buftotal : listCtrl.buftotalSW.getTime(),
													buftime : listCtrl.buftime,
													load2play : listCtrl.load2play,
													start2play : listCtrl.start2play,
													link : listCtrl.currLinkInfo ? (listCtrl.currLinkInfo.link || "") : "",
													lid : listCtrl.lid,
													maxspeed : listCtrl.maxSpeed,
													avgspeed : listCtrl.avgSpeed,
													avgspeed_2 : listCtrl.avgSpeed_2,
													isclosed : 1,
													receivedpackets : listCtrl.player.getReceivedPackets(),
													wmpstate : listCtrl.player.getWMPState(),
													listlength : listCtrl.playList.getLength(),
													bufp : listCtrl.bufPercent,
													bufc : listCtrl.bufCost,
													songdur : listCtrl.totalTime,
													songsize : listCtrl.songSize
												} ])
					}
				});
if (M3.isIe) {
	document.execCommand("BackgroundImageCache", false, true)
};