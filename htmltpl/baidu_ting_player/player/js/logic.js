mbox.namespace("mbox.logic");
mbox.logic.PlayList = (function(b, c) {
	var a = function(d) {
		this._songIdList = [];
		this._curSongIndex = 0;
		this._playIndexList = [];
		this._defaultPlayIndexes = [];
		this._curIndex = 0;
		this._playMode = 3;
		this.init(d)
	};
	a.prototype = {
		init : function(f) {
			f = f || [];
			this._songIdList = f;
			this._defaultPlayIndexes = [];
			var e = f.length, d = 0;
			while (e--) {
				this._defaultPlayIndexes.push(d++)
			}
			this._curSongIndex = 0;
			this.setMode(this._playMode);
			return this
		},
		reset : function() {
		},
		add : function(d) {
			this._songIdList = this._songIdList.concat(d);
			var f = d.length, e = this._defaultPlayIndexes.length;
			while (f--) {
				this._defaultPlayIndexes.push(e++)
			}
			this.setMode(this._playMode)
		},
		remove : function(f) {
			if (f != -1) {
				if (f.length != this.getLength()) {
					f = f.sort(function(i, h) {
						return i - h
					});
					var g = this._curSongIndex, d = f.length;
					while (d--) {
						var e = f[d];
						this._songIdList.splice(e, 1);
						this._defaultPlayIndexes.pop();
						if (e < g) {
							g--
						}
					}
					if (g > this._defaultPlayIndexes.length - 1) {
						g = 0
					}
					this._curSongIndex = g;
					this.setMode(this._playMode)
				} else {
					this.init( [])
				}
			} else {
				this.init( [])
			}
		},
		getSongIdList : function(f) {
			var e = [];
			if (f) {
				for ( var g = 0, d = f.length; g < d; g++) {
					e.push(this._songIdList[f[g]])
				}
			} else {
				e = this._songIdList.concat()
			}
			return e
		},
		getPlayIdList : function() {
			return this.getSongIdList(this._playIndexList.concat())
		},
		getLength : function() {
			return this._songIdList.length
		},
		getCurrentSongId : function() {
			return this._songIdList[this._curSongIndex]
		},
		getCurrentIndex : function() {
			return this._curSongIndex
		},
		setCurrentIndex : function(d) {
			if (!isNul(d)) {
				this._curSongIndex = d;
				this.setMode(this._playMode)
			}
		},
		prev : function() {
			if (--this._curIndex < 0) {
				this._curIndex = this._playIndexList.length - 1
			}
			this._curSongIndex = this._playIndexList[this._curIndex];
			return this._songIdList[this._playIndexList[this._curIndex]]
		},
		next : function() {
			if (++this._curIndex > this._playIndexList.length - 1) {
				this._curIndex = 0
			}
			this._curSongIndex = this._playIndexList[this._curIndex];
			return this._songIdList[this._playIndexList[this._curIndex]]
		},
		setMode : function(e) {
			this._playMode = e.toString();
			switch (this._playMode) {
			case "1":
				this._playIndexList = [ this._curSongIndex ];
				this._curIndex = 0;
				break;
			case "2":
				var d = this._songIdList.length, f = this._defaultPlayIndexes
						.concat(), g = this._curSongIndex;
				f.splice(g, 1);
				f.sort(function() {
					return Math.random() - 0.5
				});
				f.unshift(g);
				this._playIndexList = f;
				this._curIndex = 0;
				break;
			case "3":
				this._playIndexList = this._defaultPlayIndexes.concat();
				this._curIndex = this._curSongIndex;
				break;
			default:
				this._playIndexList = this._defaultPlayIndexes.concat();
				this._curIndex = this._curSongIndex;
				break
			}
		},
		getMode : function() {
			return this._playMode.toString()
		}
	};
	return a
})(window);
mbox.namespace("mbox.logic");
mbox.logic.listCtrl = (function() {
	var g = T.fn.bind, c = T.dom.query, b = T.array.each, e = T.g, f = T.cookie;
	var a = function(h, i) {
		var j = {};
		T.object.merge(j, h, {
			overwrite : true
		});
		T.object.merge(j, i, {
			overwrite : true
		});
		return j
	};
	var d = function(h) {
		this.player = h.player;
		this.loadTimer = new M3.Timer(100, 0);
		this.playTimer = new M3.Timer(200, 0);
		this.startSW = new M3.StopWatch();
		this.loadSW = new M3.StopWatch();
		this.start2play = -1;
		this.load2play = -1;
		this.buftotalSW = new M3.StopWatch();
		this.buftime = -1;
		this.playList = new mbox.logic.PlayList();
		this.showList = new mbox.logic.PlayList();
		this.hasTotalTime = true;
		this.totalTime = 0;
		this.prevPosition = 0;
		this.preStatus = "";
		this.bufPercent = 0;
		this.bufCost = 0;
		this.bufCostSW = new M3.StopWatch();
		this.songSize = 0;
		this.currSong = null;
		this.isPlaying = false;
		this.curMode = 3;
		this.muted = false;
		this.showListName = "";
		this.playListName = "";
		this.curShowIds = [];
		this.listName = {
			DEFAULT : "default"
		};
		this.auto = 1;
		this.errstop = 0;
		this.playedTimes = 0;
		this.hasBreak = false;
		this.lid = Math.random() * (+new Date());
		this.maxSpeed = 0;
		this.avgSpeed = 0;
		this.avgSpeed_2 = 0;
		this.Data = mbox.data;
		this.linkOptions = {
			mimeType : "",
			speed : ""
		}
	};
	d.prototype = {
		init : function() {
			this.linkOptions.mimeType = this.suportMimeType();
			this.loadTimer.addEventListener("timer", g(function(h, i) {
				this.updateProgressAndTime()
			}, this));
			this.playTimer.addEventListener("timer", g(function(h, i) {
				this.updateCurrTimeAndPostion()
			}, this));
			this.listenPlayerState();
			this.listenUIEvent();
			this.listenActionEvent()
		},
		listenUIEvent : function() {
			M3.dispatch(mbox.ACTION.UI_PLAY, g(function(i, h) {
				this.playSongPercent(i, h)
			}, this));
			M3.dispatch(mbox.ACTION.UI_PLAYCHANGE, g(function() {
				this.playAndPause()
			}, this));
			M3.dispatch(mbox.ACTION.UI_PREV, g(function() {
				M3.dispatch(mbox.ACTION.AUTO, []);
				this.prevSong()
			}, this));
			M3.dispatch(mbox.ACTION.UI_NEXT, g(function() {
				M3.dispatch(mbox.ACTION.AUTO, []);
				this.nextSong()
			}, this));
			M3.dispatch(mbox.ACTION.UI_MODECHANGE, g(function(h) {
				this.setPlayMode(h)
			}, this));
			M3.dispatch(mbox.ACTION.UI_PLAYTIMER, g(function(h) {
				h ? this.playTimer.stop() : this.playTimer.start()
			}, this));
			M3.dispatch(mbox.ACTION.UI_SETMUTE, g(function(i, h) {
				this.setMute(i)
			}, this));
			M3.dispatch(mbox.ACTION.UI_VOLCHANGE, g(function(h) {
				this.setVolume(h)
			}, this));
			M3.dispatch(mbox.ACTION.UI_FAVOR, g(function(h) {
				this.favor(h)
			}, this));
			M3.dispatch(mbox.ACTION.UI_RECOM, g(function(h) {
				this.offer(h)
			}, this));
			M3.dispatch(mbox.ACTION.UI_PLAYINDEX, g(function(h) {
				M3.dispatch(mbox.ACTION.AUTO, []);
				this.playIndexInCurList(h)
			}, this));
			M3.dispatch(mbox.ACTION.UI_REMOVELIST, g(function(h) {
				this.remove(h)
			}, this));
			M3.dispatch(mbox.ACTION.UI_DOWNLOAD, g(function(h) {
				this.download(h)
			}, this))
		},
		listenActionEvent : function() {
			M3.dispatch(mbox.ACTION.ADDPLAYEDTIMES, g(function() {
				this.addPlayedTimes()
			}, this));
			M3.dispatch(mbox.ACTION.AUTO, g(function(h) {
				this.changeAutoStatus(h)
			}, this))
		},
		listenPlayerState : function() {
			this.player.setStateChangeCallBack(g(function(j, h, i) {
				switch (j.toString()) {
				case "end":
					this.buftotalSW.pause();
					M3.dispatch(mbox.ACTION.PLAYCOMPLETE, [ this.currSong, {
						subject : this.playListName,
						lid : this.lid
					} ]);
					if (PLAYCTRL.LISTENBREAK
							&& this.playedTimes > PLAYCTRL.RESTTIME - 1) {
						this.hasBreak = true;
						M3.dispatch(mbox.ACTION.LISTENBREAK, [])
					} else {
						this.continueSong()
					}
					break;
				case "play":
					M3.dispatch(mbox.ACTION.PLAYSTATECHANGE, [ true ]);
					M3.dispatch(mbox.ACTION.SHOWLOADING, [ false ]);
					this.buftotalSW.pause();
					break;
				case "pre-buffer":
					M3.dispatch(mbox.ACTION.PREBUFFER, [ true ]);
					M3.dispatch(mbox.ACTION.SHOWLOADING, [ true ]);
					this.buftotalSW.start();
					this.buftime++;
					break;
				case "buffering":
					M3.dispatch(mbox.ACTION.BUFFERING, []);
					M3.dispatch(mbox.ACTION.SHOWLOADING, [ true ]);
					this.buftotalSW.start();
					this.buftime++;
					break;
				case "pause":
					this.buftotalSW.pause();
					break;
				case "ready":
					this.buftotalSW.pause();
					break;
				case "error":
					this.buftotalSW.pause();
					break;
				default:
				}
			}, this))
		},
		updateProgressAndTime : function() {
			var h = this.bufPercent = this.player.getLoadedPercent() * 100;
			M3.dispatch(mbox.ACTION.UPDATELOADED, [ h ]);
			if (!this.hasTotalTime) {
				this.totalTime = this.player.getTotalTime();
				M3.dispatch(mbox.ACTION.TOTALTIME, [ this.totalTime ])
			}
			if (this.player.curEngine != "wmp" && h == 100) {
				this.loadTimer.stop()
			}
			this.bufCost = this.bufCostSW.getTime();
			if (h == 100) {
				this.bufCostSW.pause()
			}
			if (this.player.curEngine == "wmp" && h < 100) {
				this.bufCostSW.start()
			}
		},
		updateCurrTimeAndPostion : function() {
			var j = this.player.getCurrentPosition(), k = M3.convertTime(j), i = this.totalTime ? Math
					.round((j / this.totalTime) * 10000) / 100
					: 0, h = this.player.getLoadedPercent() * 100;
			if (j - this.prevPosition > 0) {
				this.prevPosition = j
			}
			M3.dispatch(mbox.ACTION.UPDATEPLAYED, [ {
				value : i,
				drop : true,
				time : k,
				curtime : j
			} ])
		},
		startPlay : function(h, i) {
			i = typeof i == "undefined" ? true : i;
			if (this.currSong) {
				M3
						.dispatch(
								mbox.ACTION.PLAYEND,
								[
										this.currSong,
										{
											subject : this.playListName,
											position : Math
													.max(
															this.prevPosition,
															this.player
																	.getCurrentPosition()),
											auto : this.auto,
											preStatus : this.preStatus,
											linkerr : this.linkerrmsg,
											fromstart : this.startSW.getTime(),
											fromload : this.loadSW.getTime(),
											buftotal : this.buftotalSW
													.getTime(),
											buftime : this.buftime,
											load2play : this.load2play,
											start2play : this.start2play,
											link : this.currLinkInfo ? (this.currLinkInfo.link || "")
													: "",
											lid : this.lid,
											maxspeed : this.maxSpeed,
											avgspeed : this.avgSpeed,
											avgspeed_2 : this.avgSpeed_2,
											isclosed : 0,
											receivedpackets : this.player
													.getReceivedPackets(),
											wmpstate : listCtrl.player
													.getWMPState(),
											bufp : this.bufPercent,
											bufc : this.bufCost,
											songdur : this.totalTime,
											songsize : this.songSize
										} ])
			}
			this.preStatus = mbox.ACTION.PLAYSTART;
			this.auto = 1;
			this.startSW.reset();
			this.loadSW.reset();
			this.load2play = -1;
			this.start2play = -1;
			this.buftotalSW.reset();
			this.bufPercent = 0;
			this.buftime = -1;
			this.maxSpeed = 0;
			this.avgSpeed = 0;
			this.avgSpeed_2 = 0;
			this.linkerrmsg = "";
			this.bufCost = 0;
			this.bufCostSW.reset();
			this.totalTime = 0;
			this.songSize = 0;
			this.startSW.start();
			if (i) {
				this.loadSong(h)
			}
			M3.dispatch(mbox.ACTION.PLAYSTART, [ h, {
				subject : this.playListName,
				lid : this.lid
			} ]);
			this.getLinkAndPlay(h)
		},
		loadSong : function(h) {
			this.resetPlayer();
			this.currSong = h;
			M3.dispatch(mbox.ACTION.LOADTITLE, [ h ]);
			this.Data.checkFavor(h.songId, function(i) {
				M3.dispatch(mbox.ACTION.FAVOR, [ i ])
			});
			M3.dispatch(mbox.ACTION.HIGHLIGHTINDEX, [ this.playList
					.getCurrentIndex() ]);
			this.highLightRow(this.playList.getCurrentIndex())
		},
		getLinkAndPlay : function(h) {
			this.Data
					.getSongUrl(
							h.songId,
							{
								onsuccess : g(
										function(i) {
											if (i.link
													&& i.linkCode != mbox.CODEMAP.NOLINK) {
												this.currLinkInfo = i;
												this.loadSW.start();
												this.loadTimer.start();
												this.bufCostSW.start();
												this.totalTime = this.currLinkInfo.time;
												if (this.totalTime != null
														|| this.totalTime != "0") {
													this.hasTotalTime = true;
													this.totalTime = parseInt(this.totalTime) * 1000
												} else {
													this.hasTotalTime = false;
													this.totalTime = 0
												}
												this.songSize = this.currLinkInfo.size;
												this.preStatus = mbox.ACTION.LOADLINK;
												this.player
														.setUrl(this.currLinkInfo.link);
												this.playSong(undefined, true);
												M3.dispatch(
														mbox.ACTION.TOTALTIME,
														[ this.totalTime ]);
												M3
														.dispatch(
																mbox.ACTION.LOADLINK,
																[
																		this.currSong,
																		{
																			link : this.currLinkInfo ? (this.currLinkInfo.link || "")
																					: "",
																			lid : this.lid
																		} ])
											} else {
												this.preStatus = mbox.ACTION.ERR_LINKFAIL;
												this.linkerrmsg = "blank";
												M3
														.dispatch(
																mbox.ACTION.ERR_LINKFAIL,
																[
																		this.currSong,
																		{
																			linkerr : this.linkerrmsg,
																			lid : this.lid
																		} ]);
												if (this.errstop++ < PLAYCTRL.ERRSTOP) {
													this.nextSong()
												}
											}
										}, this)
							}, {
								lid : this.lid
							})
		},
		playAndPause : function(h) {
			this.isPlaying = !this.isPlaying;
			this.isPlaying ? this.playSong(undefined, true) : this.pauseSong()
		},
		playSongPercent : function(i, h) {
			this.playSong(parseInt(i * this.totalTime / 100), h)
		},
		playSong : function(i, h) {
			if (!this.currSong) {
				this.playIndexInCurList(0);
				return
			} else {
				if (!this.currLinkInfo) {
					this.startPlay(this.currSong);
					return
				}
			}
			if (h) {
				this.isPlaying = true;
				this.player.play(i)
			} else {
				this.player.play(i);
				if (!this.isPlaying) {
					this.player.pause()
				}
			}
			this.isPlaying ? this.playTimer.start() : this.playTimer.stop();
			if (this.hasBreak) {
				this.hasBreak = false;
				this.playedTimes = 0
			}
			M3.dispatch(mbox.ACTION.PLAYSTATECHANGE, [ this.isPlaying ]);
			if (this.isPlaying) {
				M3.dispatch(mbox.ACTION.PLAYING, []);
				mbox.logic.uniqueplay.setTag()
			}
		},
		pauseSong : function() {
			this.isPlaying = false;
			this.player.pause();
			this.playTimer.stop();
			M3.dispatch(mbox.ACTION.PLAYSTATECHANGE, [ this.isPlaying ])
		},
		stopSong : function() {
			this.isPlaying = false;
			this.player.stop();
			this.playTimer.stop();
			this.loadTimer.stop();
			M3.dispatch(mbox.ACTION.STOP, []);
			M3.dispatch(mbox.ACTION.PLAYSTATECHANGE, [ this.isPlaying ])
		},
		nextSong : function() {
			if (!this.currSong) {
				this.playIndexInCurList(0)
			} else {
				var i = this.playList.next(), h = this.Data.getFromSongCache(i);
				this.startPlay(h)
			}
			M3.dispatch(mbox.ACTION.NEXTSONG, [ h ])
		},
		prevSong : function() {
			var i = this.playList.prev(), h = this.Data.getFromSongCache(i);
			this.startPlay(h);
			M3.dispatch(mbox.ACTION.PREVSONG, [ h ])
		},
		continueSong : function() {
			if (this.curMode == 1) {
				this.startPlay(this.currSong, false)
			} else {
				this.nextSong()
			}
		},
		setVolume : function(h) {
			this.volume = h;
			this.player.setVolume(this.volume);
			M3.dispatch(mbox.ACTION.VOLCHANGE, [ this.volume ])
		},
		setMute : function(h) {
			this.muted = typeof h == "undefined" ? !this.muted : !!h;
			this.player.setMute(this.muted);
			M3.dispatch(mbox.ACTION.MUTECHANGE, [ this.muted ])
		},
		setPlayMode : function(h) {
			var i = this.curMode = h;
			i = i == 1 ? 3 : i;
			if (this.playListName) {
				this.playList.setMode(i)
			}
			M3.dispatch(mbox.ACTION.PLAYMODECHANGE, [ this.curMode ])
		},
		addSongListToPlayList : function(m, n, i) {
			if (m.errorCode == mbox.CODEMAP.IPFORBIDDEN
					|| m.errorCode == mbox.CODEMAP.IPNOTFOUND
					|| m.errorCode == mbox.CODEMAP.IPMISTAKE) {
				M3.dispatch(mbox.ACTION.ABROAD, []);
				return
			}
			var j = m.data;
			var h = this.playList.getLength(), l = j.list, k = j.ids;
			switch (n) {
			case this.listName.DEFAULT:
				this.Data.addDefaultSong(k);
				break
			}
			if (this.showListName == n) {
				this.showList.add(k)
			}
			if (this.playListName == n) {
				this.playList.add(k)
			}
			if (this.showListName == n) {
				M3.dispatch(mbox.ACTION.ADDTOPLAYLIST, [ j ])
			}
			if (i) {
				if (this.showListName != n) {
					this.showPlayList(n)
				}
				this.playIndexInCurList(h)
			}
		},
		addSongs : function(j, h, i) {
			M3.dispatch(mbox.ACTION.ADDSONG, [ j ]);
			this.Data.getSongListData(j, {
				onsuccess : g(function(k) {
					this.addSongListToPlayList(k, this.listName.DEFAULT, h)
				}, this)
			}, a(this.linkOptions, i))
		},
		addAlbum : function(k, j, h, i) {
			this.Data.getAlbum(k, j, {
				onsuccess : g(function(l) {
					if (l.album) {
						M3.dispatch(mbox.ACTION.ADDALBUM, [ l.album ]);
						this.addSongListToPlayList(l.songList,
								this.listName.DEFAULT, h)
					}
				}, this)
			}, a(this.linkOptions, i))
		},
		addTop : function(j, i, h) {
			this.Data.getSongListByTop(j, {
				onsuccess : g(function(k) {
					this.addSongListToPlayList(k, this.listName.DEFAULT, i)
				}, this)
			}, a(this.linkOptions, h))
		},
		addBubble : function(j, i, h) {
			this.Data.getSongListByBubble(j, {
				onsuccess : g(function(k) {
					this.addSongListToPlayList(k, this.listName.DEFAULT, i)
				}, this)
			}, a(this.linkOptions, h))
		},
		addHistory : function(i, h) {
			this.Data.getSongListByHistory( {
				onsuccess : g(function(j) {
					this.addSongListToPlayList(j, this.listName.DEFAULT, i)
				}, this)
			}, a(this.linkOptions, h))
		},
		addFavor : function(i, h) {
			this.Data.getFavorSongList( {
				onsuccess : g(function(j) {
					this.addSongListToPlayList(j, this.listName.DEFAULT, i)
				}, this)
			}, 500, a(this.linkOptions, h))
		},
		remove : function(i) {
			if (typeof i != "undefined") {
				M3.dispatch(mbox.ACTION.REMOVELIST, [ i ]);
				if (i.length == this.showList.getLength()) {
					this.currSong = null
				}
				if (this.showListName == this.listName.DEFAULT) {
					var l = this.Data.delDefaultSong(i)
				} else {
					var m = this.showList.getSongIdList(i);
					this.Data.removeFavorSong(m)
				}
				if (this.showListName == this.playListName) {
					var o = this.playList.getCurrentSongId(), k = this.playList
							.getCurrentIndex(), h = false;
					b(i, function(q, p) {
						if (k == q) {
							h = true;
							return false
						}
					});
					this.playList.remove(i);
					var n = this.playList.getCurrentSongId(), j = this.playList
							.getCurrentIndex();
					if (n && o) {
						if (h) {
							this.playIndex(j)
						}
					} else {
						this.resetPlayer();
						this.playListName = ""
					}
				}
				this.showList.remove(i)
			}
		},
		highLightRow : function(h) {
			if (!isNul(h)) {
				if (this.showListName == this.playListName) {
					M3.dispatch(mbox.ACTION.SETCURRPLAY, [ h ]);
					M3.dispatch(mbox.ACTION.SCROLLTO, [ h ])
				}
			}
		},
		recoverHighLightRow : function() {
			if (this.playListName) {
				var h = this.playList.getCurrentIndex();
				this.highLightRow(h)
			}
		},
		playIndex : function(h) {
			if (this.playListName) {
				this.playList.setCurrentIndex(h);
				this.startPlay(this.Data.getFromSongCache(this.playList
						.getCurrentSongId()))
			}
		},
		playIndexInCurList : function(h) {
			if (this.showList.getLength() > 0) {
				this.playListName = this.showListName;
				this.playList.init(this.showList.getSongIdList());
				this.playIndex(h)
			}
		},
		resetPlayer : function() {
			this.totalTime = 0;
			this.prevPosition = 0;
			this.isPlaying = false;
			this.currLinkInfo = null;
			this.player.stop();
			this.player.reset();
			this.playTimer.stop();
			this.loadTimer.stop();
			M3.dispatch(mbox.ACTION.RESET, [])
		},
		itemoffer : function(h) {
			var i = this.showList.getSongIdList( [ h ])[0];
			this.offer(i)
		},
		offer : function(j) {
			if (mbox.user.isLogin) {
				if (j == "number") {
				} else {
					var i = this.currSong;
					if (i && i.songId) {
						M3.dispatch(mbox.ACTION.EXPANDMOD, [ true ]);
						setTimeout(function() {
							mbox.ui.dialog.recompop.show(i.songId)
						}, 100)
					}
				}
			} else {
				var h = {
					songLimit : false
				};
				mbox.user.checklogin(true, g(function() {
					this.offer.apply(this, arguments)
				}, this), h, true)
			}
		},
		offerto : function(m, j, h, l) {
			var k = this;
			this.Data.sendCommendation(m, j, {
				onsuccess : function(n) {
					i(n)
				},
				onfailure : function() {
				}
			});
			var i = function(n) {
				if (n.errorCode == mbox.CODEMAP.UNLOGIN) {
					mbox.user.checklogin(true, function() {
						k.offerto(m, j, h, l)
					})
				} else {
					l(h, n.errorCode)
				}
			}
		},
		favor : function(h) {
			mbox.user.checklogin(true, g(function(j) {
				if (h) {
					this.Data.addFavorSong(h, {
						onsuccess : function() {
						},
						onfailure : function() {
						}
					})
				} else {
					var k = this.currSong;
					if (k && k.songId) {
						var i = {
							songLimit : false
						};
						this.Data.checkFavor(k.songId, g(function(l) {
							if (l) {
								this.Data.removeFavorSong( [ k.songId ], {
									onsuccess : g(function(m) {
										switch (m) {
										case mbox.CODEMAP.SUCCESS:
											M3.dispatch(mbox.ACTION.FAVOR,
													[ false ]);
											break;
										case mbox.CODEMAP.UNLOGIN:
											mbox.user.checklogin(true, g(
													function() {
														this.favor.apply(this,
																arguments)
													}, this), i, true);
											break;
										case mbox.CODEMAP.UNACTIVE:
											mbox.user.checklogin(true, g(
													function() {
														this.favor.apply(this,
																arguments)
													}, this), i, true);
											break;
										default:
										}
									}, this),
									onfailure : function(m) {
									}
								})
							} else {
								this.Data.addFavorSong( [ k.songId ], {
									onsuccess : g(function(m) {
										switch (m) {
										case mbox.CODEMAP.SUCCESS:
										case mbox.CODEMAP.FAVORREPEAT:
											M3.dispatch(mbox.ACTION.FAVOR,
													[ true ]);
											break;
										case mbox.CODEMAP.TOOFAST:
											break;
										case mbox.CODEMAP.UNLOGIN:
											mbox.user.checklogin(true, g(
													function() {
														this.favor.apply(this,
																arguments)
													}, this), i, true);
											break;
										case mbox.CODEMAP.UNACTIVE:
											mbox.user.checklogin(true, g(
													function() {
														this.favor.apply(this,
																arguments)
													}, this), i, true);
											break;
										default:
										}
									}, this),
									onfailure : function(m) {
									}
								})
							}
						}, this))
					}
				}
			}, this), {}, true)
		},
		download : function(h) {
			var i = this.showList.getSongIdList(h)[0];
			if (h.length == 1) {
				window.open(mbox.url.getDownload(i), "song_download",
								"height=250,width=690,status=no,toolbar=no,menubar=no,location=no")
			}
		},
		showPlayList : function(h) {
			switch (h) {
			case this.listName.DEFAULT:
				this.showDefaultList()
			}
		},
		showDefaultList : function() {
			if (this.showListName != this.listName.DEFAULT) {
				var j = this.Data.getLocalListData(), h = [], i = [];
				b(j, function(l, k) {
					if (l.songId) {
						h.push( {
							trId : "li_" + k,
							index : k,
							id : l.songId,
							title : l.songName,
							artist : l.artistName
						});
						i.push(l.songId)
					}
				});
				this.curShowIds = i;
				this.showList.init(i);
				this.showListName = this.listName.DEFAULT;
				M3.dispatch(mbox.ACTION.UPDATELIST, [ h ]);
				this.recoverHighLightRow()
			}
		},
		addPlayedTimes : function() {
			this.playedTimes++
		},
		changeAutoStatus : function(h) {
			this.auto = typeof h == "undefined" ? 0 : h
		},
		suportMimeType : function() {
			if (PLAYCTRL.USEAAC && this.player.canPlayType("aac")) {
				return "aac"
			}
			if (PLAYCTRL.USEWMA && this.player.canPlayType("wma")) {
				return "wma"
			}
			return "mp3"
		}
	};
	return d
})();
mbox.logic.listCtrl = new mbox.logic.listCtrl( {
	player : baidu.m3
});
var mboxCtrl = function() {
	var a = 500;
	var d = function(e) {
		if (typeof e == "function") {
			setTimeout(function() {
				e()
			}, a)
		}
	};
	var c = mbox.logic.listCtrl;
	var b = function() {
		return /ipad|iphone|ipod/i.test(navigator.userAgent)
	}();
	return {
		closePassport : function() {
			ting.passport.closePopup()
		},
		playAndClosePop : function() {
			M3.dispatch(mbox.ACTION.AUTO, [ 0 ]);
			M3.dispatch(mbox.ACTION.CLOSELISTENBREAK, [])
		},
		playSong : function(e) {
			this.playAndClosePop();
			this.addSong(e, b ? false : true)
		},
		addSong : function(e, f) {
			f = f || false;
			e = e.split("_");
			d(function() {
				c.addSongs(e, f)
			});
			this.closePassport()
		},
		playAlbum : function(e) {
			this.playAndClosePop();
			this.addAlbum(e, b ? false : true)
		},
		addAlbum : function(f, e) {
			e = e || false;
			d(function() {
				c.addAlbum(f, "album", e)
			});
			this.closePassport()
		},
		playDiy : function(e) {
			this.playAndClosePop();
			this.addDiy(e, b ? false : true)
		},
		addDiy : function(f, e) {
			e = e || false;
			d(function() {
				c.addAlbum(f, "diy", e)
			});
			this.closePassport()
		},
		playTop : function(e) {
			istop = true;
			this.playAndClosePop();
			this.addTop(e, b ? false : true)
		},
		addTop : function(f, g) {
			g = g || false;
			var e = f.split("_");
			var i = e[0], h = e[1];
			d(function() {
				c.addTop(i, g, {
					period : h
				})
			});
			this.closePassport()
		},
		playBubble : function(e) {
			this.playAndClosePop();
			this.addBubble(e, b ? false : true)
		},
		addBubble : function(e, f) {
			f = f || false;
			d(function() {
				c.addBubble(e, f)
			});
			this.closePassport()
		},
		playList : function(e) {
			this.playAndClosePop();
			if (e == "collection") {
				d(function() {
					c.addFavor(b ? false : true)
				})
			} else {
				if (e == "history") {
					d(function() {
						c.playHistory(b ? false : true)
					})
				}
			}
			this.closePassport()
		}
	}
}();
var mbc = {
	ps : mboxCtrl.playSong,
	as : mboxCtrl.addSong,
	pa : mboxCtrl.playAlbum,
	aa : mboxCtrl.addAlbum,
	pd : mboxCtrl.playDiy,
	ad : mboxCtrl.addDiy,
	pt : mboxCtrl.playTop,
	at : mboxCtrl.addTop,
	pl : mboxCtrl.playList,
	pb : mboxCtrl.playBubble,
	ab : mboxCtrl.addBubble
};
var Log = (function() {
	var b = mbox.ACTION, h = "1.0.0", a = "http://nsclick.baidu.com/v.gif", e = "http://tinglog.baidu.com/v.gif", g = function(
			j) {
		return encodeURIComponent(j)
	}, d = function(j) {
		return {
			song_id : j.songId || 0,
			song_title : j.songName || "",
			singer_id : j.artistId || 0,
			singer_name : j.artistName || "",
			album_id : j.albumId || 0,
			album_name : j.albumName || "",
			song_area : j.area || "",
			song_version : j.version || ""
		}
	}, f = function(j) {
		return {
			song_id : song.songId || 0,
			song_title : song.songName || "",
			singer_id : song.artistId || 0,
			singer_name : song.artistName || "",
			album_id : song.albumId || 0,
			album_name : song.albumName || "",
			song_area : song.area || "",
			song_version : song.version || ""
		}
	}, c = function(q, r) {
		q = q || {};
		var m = [], p = new Image(), k = new Date().getTime();
		window["tingbox_log_" + k] = p;
		m.push("pid=304");
		m.push("url=");
		for ( var o in q) {
			var s = o;
			var l = q[o];
			if (s == "songdata") {
				for ( var n in l) {
					m.push(n + "=" + g(l[n] + ""))
				}
			} else {
				if (s == "other") {
					for ( var n in l) {
						if (n == "link") {
							m.push(n + "=" + l[n].replace("&", "%26"))
						} else {
							m.push(n + "=" + g(l[n] + ""))
						}
					}
				} else {
					m.push(s + "=" + g(l + ""))
				}
			}
		}
		m.push("r" + Math.random() + "=1");
		m.push("ref=tingbox");
		m.push("v=" + h);
		var t = g(mbox.user.userdata && mbox.user.userdata.data.userName || "");
		m.push("username=" + t);
		m.push("ting_uid=" + mbox.user.getTingId());
		m.push("u_lo=" + mbox.user.getLoginType());
		m.push("u_t=" + mbox.user.getUserType());
		p.onload = function() {
			p = null;
			try {
				delete window["tingbox_log_" + k]
			} catch (j) {
			}
		};
		p.src = (r || a) + "?" + m.join("&")
	}, i = function(l, k) {
		var j = arguments[2] || {};
		k = k || {};
		switch (l) {
		case b.ADDSONG:
			c( {
				type : l,
				song_id : k
			});
			break;
		case b.ADDALBUM:
			c( {
				type : l,
				album_id : k.albumId || k.diyId,
				album_name : k.albumName || k.diyName,
				singer_id : k.artistId || k.creatorId,
				singer_name : k.artistName || k.creatorName,
				album_style : k.style || k.tags,
				album_type : k.albumId ? "album" : "diy"
			});
			break;
		case b.PLAY60:
			c( {
				type : l,
				songdata : d(k),
				position : 60 * 1000,
				other : j
			});
			break;
		case b.PLAYSTART:
		case b.LOADLINK:
		case b.PLAYSONG100MS:
		case b.PLAYEND:
		case b.PLAYCOMPLETE:
		case b.ERR_LOADERR:
		case b.ERR_LINKFAIL:
		case b.ERR_BUFERR:
		case b.ERR_PLAYERR:
			c( {
				type : l,
				songdata : d(k),
				other : j
			});
			c( {
				type : l,
				songdata : d(k),
				other : j
			}, e);
			break;
		case b.CLK:
			c( {
				type : l,
				action : k,
				preStatus : listCtrl.preStatus
			});
			break;
		default:
		}
	};
	return {
		listenDispatch : function() {
			for ( var k in b) {
				var j = b[k];
				(function(l) {
					M3.dispatch(l, function() {
						var m = [];
						m.push(l);
						m = m.concat(Array.prototype.slice.call(arguments, 0));
						i.apply(null, m)
					})
				})(j)
			}
		},
		send : function(k, j) {
			c(k, j)
		}
	}
})();
Log.listenDispatch();
mbox.namespace("mbox.logic");
mbox.init = (function() {
	var a;
	var b = [];
	return {
		bind : function(c) {
			c = c || {};
			a = c.playList;
			this.bindPlayList();
			this.bindDailog()
		},
		bindPlayList : function(c) {
			a.initEvents( {
				dblclick : function(e, d) {
					M3.dispatch(mbox.ACTION.UI_PLAYINDEX, [ d.rowIndex ])
				},
				ondel : function(d) {
					if (d.length == 1) {
						M3.dispatch(mbox.ACTION.UI_REMOVELIST, [ d ])
					}
				},
				ondownload : function(d) {
					M3.dispatch(mbox.ACTION.UI_DOWNLOAD, [ d ])
				}
			})
		},
		bindDailog : function() {
			baidu.event.on(baidu.g("continueconfirm"), "click", function() {
				listCtrl.continueSong();
				M3.dispatch(mbox.ACTION.CLOSELISTENBREAK, [])
			})
		}
	}
})();
mbox.namespace("mbox.logic");
mbox.logic.uniqueplay = (function(a) {
	var c = new M3.Timer(1000, 0);
	var b = new Date().getTime();
	var e = false;
	var d = "livingTag";
	return {
		init : function(f) {
			f = f || {};
			this.setTag();
			c.addEventListener("timer", baidu.fn.bind(function(g, i) {
				var h = this.getTag();
				if (b != h && !e) {
					e = true;
					this.stop();
					if (typeof f.notUnique == "function") {
						f.notUnique()
					}
				}
			}, this));
			this.start()
		},
		setTag : function() {
			var g = d;
			var f = b;
			var h = {
				path : "/",
				expires : 1000 * 60 * 60 * 24
			};
			baidu.cookie.set(g, f, h);
			e = false;
			this.start()
		},
		getTag : function() {
			return baidu.cookie.get(d)
		},
		stop : function() {
			c.stop()
		},
		start : function() {
			c.start()
		},
		getTamp : function() {
			return b
		}
	}
})();