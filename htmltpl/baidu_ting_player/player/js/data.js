mbox.localStorage = (function() {
	var c = {
		vol : "vol",
		mute : "mute",
		mode : "playmode",
		defList : "defaultListData",
		defIds : "defaultIdList"
	};
	var h = {
		path : "/",
		expires : 1000 * 60 * 60 * 24 * 30
	};
	var a = [], b = [];
	var f = function() {
	};
	var e = 50, d = false, g = 3;
	return {
		init : function(i) {
			if (baidu.lang.isFunction(i)) {
				f = i;
				f()
			}
			M3.dispatch(mbox.ACTION.VOLCHANGE, T.fn.bind(function(j) {
				this.setVolume(j)
			}, this));
			M3.dispatch(mbox.ACTION.MUTECHANGE, T.fn.bind(function(j) {
				this.setMute(j)
			}, this));
			M3.dispatch(mbox.ACTION.PLAYMODECHANGE, T.fn.bind(function(j) {
				this.setPlayMode(j)
			}, this))
		},
		setVolume : function(i) {
			e = i;
			T.cookie.set("defVol", i, h)
		},
		getVolume : function() {
			return T.cookie.get("defVol") || 50
		},
		setMute : function(i) {
			d = i;
			T.cookie.set("isMute", i, h)
		},
		getMute : function() {
			(T.cookie.get("isMute") == "true") ? d = true : d = false;
			return d
		},
		setPlayMode : function(i) {
			g = i
		},
		getPlayMode : function() {
			return g
		},
		getDefaultList : function() {
			return a
		},
		addDefaultSong : function(i) {
			var j = this.getDefaultList();
			j = j.concat(i);
			a = j
		},
		delDefaultSong : function(i) {
			if (i === -1) {
				a = [];
				return []
			} else {
				var j = this.getDefaultList();
				i = i.sort(function(l, k) {
					return l - k
				}).reverse();
				baidu.array.each(i, function(l, k) {
					j.splice(l, 1)
				});
				a = j;
				return j
			}
		},
		setDefaultSong : function(i) {
			a = i
		},
		_onload : function() {
			f()
		}
	}
})();
var TingData = (function() {
	var k = {}, B = {}, q = 200, l = 100, C = "ting.baidu.com", a = location.host, A = "qukufile.qianqian.com", e = "", i = null, c = PLAYCTRL.XCODEINTERVAL * 60 * 60 * 1000, r = PLAYCTRL.XCODERETRY, w = a != C;
	var y = "/data/music/songlink", D = "/data/music/box/album", z = "/data/music/box/top", f = "/data/music/box/bubble", o = "/data/music/xcode";
	var d = {
		success : 22000
	};
	var t = T.ajax.request, b = T.json.parse, n = T.array.each, p = T.fn.bind;
	var x = function(E) {
		try {
			return b(E)
		} catch (F) {
			return E
		}
	}, v = function(E) {
		return x(E && E.responseText)
	}, u = function(E) {
		E = E || {};
		E.onsuccess = E.onsuccess || function() {
		};
		E.onfailure = E.onfailure || function() {
		};
		return E
	}, m = function(E) {
		return typeof E.errorCode != "undefined"
	}, g = function(H, G) {
		var F = [], E = [];
		n(H, function(J, I) {
			if (J && J.songId) {
				if (J.status && J.status == 1) {
				} else {
					k[J.songId] = J;
					if (!G || G-- > 0) {
						F.push(J);
						E.push(J.songId)
					}
				}
			}
		});
		return {
			list : F,
			ids : E
		}
	}, j = function(F, E) {
		B[F] = E
	}, h = function(G) {
		var F = [], H = [], E = [];
		n(G, function(K, I) {
			if (K) {
				var J = k[K];
				if (J) {
					F.push(J);
					H.push(J.songId)
				} else {
					E.push(K)
				}
				J = null
			}
		});
		return {
			cache : F,
			cacheIds : H,
			nocache : E
		}
	}, s = function(E) {
		return k[E] || {}
	};
	return {
		init : function() {
		},
		getFromSongCache : function(G) {
			var F = [];
			if (typeof G != "undefined") {
				n(G, function(I, H) {
					var J = k[I];
					if (J) {
						F.push(J)
					}
				})
			} else {
				for ( var E in k) {
					F.push(k[E])
				}
			}
			return F
		},
		getSongListData : function(E, I, R) {
			I = u(I);
			R = R || {};
			if (E && E.length > 0) {
				var O = E.length, M = O % q, N = parseInt(O / q), G = [];
				for ( var L = 0; L < N; L++) {
					G.push(E.slice(L * q, (L + 1) * q))
				}
				G.push(E.slice(L * q, O));
				var H = 0, Q = {}, K = {}, J = N + (M ? 1 : 0), P = 0;
				var F = function(U, V) {
					var S = h(U);
					V( {
						errorCode : K[0] || "",
						data : {
							ids : S.cacheIds,
							list : S.cache
						}
					})
				};
				n(G, p(function(U, S) {
					this.getSongData(U, {
						onsuccess : (function() {
							var V = S;
							return function(W) {
								if (V == H) {
									H++;
									K[V] = W.errorCode;
									if (J - 1 == V) {
										F(E, I.onsuccess);
										return
									}
									while (typeof Q[++V] != "undefined") {
										H = V;
										if (J - 1 == V) {
											F(E, I.onsuccess);
											return
										}
									}
								} else {
									Q[V] = W.data;
									K[V] = W.errorCode
								}
							}
						})(),
						onfailure : (function() {
							var V = S;
							return function() {
								P++;
								if (V == H) {
									H++;
									if (P == J) {
										I.onfailure();
										return
									}
									if (J - 1 == V) {
										F(E, I.onsuccess);
										return
									}
									while (typeof Q[++V] != "undefined") {
										H++;
										if (J - 1 == V) {
											F(E, I.onsuccess);
											return
										}
									}
								} else {
									Q[V] = {};
									K[V] = ""
								}
							}
						})()
					}, R)
				}, this))
			}
		},
		getSongData : function(F, K, N) {
			K = u(K);
			N = N || {};
			var M = this;
			var G = h(F), I = G.nocache;
			if (I.length > 0) {
				var H = y, E = I.length > l ? "post" : "get", L = N.mimeType
						|| "", J = N.speed || "";
				t(H, {
					method : E,
					data : "songIds=" + I.join(",") + "&type=" + L + "&speed="
							+ J,
					onsuccess : function(Q) {
						var P = v(Q);
						if (m(P)) {
							if (!i && P.data.xcode) {
								e = P.data.xcode;
								i = new M3.Timer(c, 9999), i.addEventListener(
										"timer", function() {
											M.updateXcode()
										});
								i.start()
							}
							var O = g(P.data.songList);
							K.onsuccess( {
								errorCode : P.errorCode,
								data : O
							})
						} else {
							K.onfailure(Q)
						}
					},
					onfailure : function(O) {
						K.onfailure(O)
					}
				})
			} else {
				K.onsuccess( {
					errorCode : d.success,
					data : {
						ids : G.cacheIds,
						list : G.cache
					}
				})
			}
		},
		getSongUrl : function(I, E, F) {
			E = u(E);
			F = F || {};
			var H = F.lid || 0;
			var G = s(I);
			G.link = G.songLink ? (G.songLink + "?xcode=" + e + "&lid=" + H)
					: "";
			E.onsuccess(G)
		},
		getXcode : function(E) {
			return e
		},
		updateXcode : function() {
			var E = this;
			t(o, {
				onsuccess : function(G) {
					var F = v(G);
					if (F.xcode) {
						e = F.xcode;
						r = PLAYCTRL.XCODERETRY
					} else {
						if (r-- > 0) {
							E.updateXcode()
						} else {
							r = PLAYCTRL.XCODERETRY
						}
					}
				},
				onfailure : function(F) {
					if (r-- > 0) {
						E.updateXcode()
					} else {
						r = PLAYCTRL.XCODERETRY
					}
				},
				noCache : true
			})
		},
		getAlbum : function(J, H, E, G) {
			E = u(E);
			var I = this;
			var F = D + "?albumId=" + J + "&type=" + H;
			t(F, {
				onsuccess : function(N) {
					var L = v(N);
					if (m(L)) {
						var K = L.data;
						var M = K.songIdList;
						I.getSongListData(M, {
							onsuccess : function(O) {
								E.onsuccess( {
									album : K,
									songList : O
								})
							},
							onfailure : E.onfailure
						}, G)
					} else {
						E.onfailure(N)
					}
				},
				onfailure : function(K) {
					E.onfailure(K)
				}
			})
		},
		getSongListByBubble : function(I, E, G) {
			E = u(E);
			var H = this;
			var F = f + "?bubbleId=" + I;
			t(F, {
				onsuccess : function(K) {
					var J = v(K);
					if (m(J)) {
						H.getSongListData(J.data.songIdList, E, G)
					} else {
						E.onfailure(K)
					}
				},
				onfailure : function(J) {
					E.onfailure(J)
				}
			})
		},
		getLrcContent : function(G, E) {
			var F = this.getLrcLink(G);
			E = u(E);
			if (F.length == 0) {
				E.onfailure();
				return
			}
			if (B[G]) {
				E.onsuccess(B[G])
			} else {
				F = F.replace(A, a);
				t(F, {
					onsuccess : function(I) {
						var H = v(I);
						E.onsuccess(H);
						j(G, H)
					},
					onfailure : function() {
						E.onfailure()
					}
				})
			}
		},
		getLrcLink : function(E) {
			return this.getFromSongCache( [ E ])[0].lrcLink
		},
		getSongListByTop : function(H, E, G) {
			E = u(E);
			G = G || {};
			var I = this;
			var J = typeof G.period == "undefined" ? "" : G.period;
			var F = z + "?topId=" + H + "&p=" + J;
			t(F, {
				onsuccess : function(L) {
					var K = v(L);
					if (m(K)) {
						I.getSongListData(K.data.songIdList, E, G)
					} else {
						E.onfailure(L)
					}
				},
				onfailure : function(K) {
					E.onfailure(K)
				}
			})
		},
		saveSongList : function(F, E) {
			return g(F, E)
		}
	}
})();
var TingUserData = (function() {
	var i = "/data/user/collectionSongIds", p = "/data/user/box/collection", e = "/data/user/tingHistory", d = "/data/user/collect", b = "/data/user/deleteCollection", a = "/data/user/recommend", q = "/data/playlist/getlist", u = "/data/playlist/addSong", f = "/data/playlist/create", j = "/data/playlist/getDetail", h = "/statage";
	var g = 500, v = 500;
	var o = T.ajax.request, c = T.json.parse, m = T.array.each, n = T.fn.bind;
	var t = function(w) {
		try {
			return c(w)
		} catch (x) {
			return w
		}
	}, s = function(w) {
		return t(w && w.responseText)
	}, r = function(w) {
		w = w || {};
		w.onsuccess = w.onsuccess || function() {
		};
		w.onfailure = w.onfailure || function() {
		};
		return w
	}, k = function(w) {
		return typeof w.errorCode != "undefined"
	};
	var l = function() {
		this.favorSongIds = null;
		this.favorSongIdsMap = {};
		this.defaultSongIds = [];
		this.maxRmCount = 100, this.historyLimit = 500
	};
	l.prototype = {
		saveSongList : function(x, w) {
			return this.saveSongList.apply(TingData, arguments)
		},
		saveFavorSongIdsToMap : function(w) {
			this.favorSongIds = w;
			this.favorSongIdsMap = {};
			m(this.favorSongIds, n(function(y, x) {
				this.favorSongIdsMap[y] = true
			}, this));
			return this.favorSongIdsMap
		},
		saveFavorSongList : function(y) {
			var w = [], z = {}, x = [];
			m(y, function(B, A) {
				var C = B, D = C.songId;
				if (C && D) {
					if (C.status && C.status == 1) {
					} else {
						w.push(D);
						z[D] = C;
						x.push(C)
					}
				}
			});
			return {
				ids : w,
				map : z,
				list : x
			}
		},
		checkFavor : function(y, x) {
			var w = this.favorSongIdsMap[y] ? true : false;
			if (typeof x == "function") {
				x(w)
			}
			return w
		},
		getFavorSongIds : function(w, x, z) {
			w = r(w);
			var y = i + "?size=" + (z || v);
			if (x && this.favorSongIds) {
				w.onsuccess(this.favorSongIdsMap)
			} else {
				o(y, {
					onsuccess : n(function(B) {
						var A = s(B);
						this.saveFavorSongIdsToMap((A.data && A.data.songIds)
								|| []);
						w.onsuccess( {
							list : this.favorSongIds,
							map : this.favorSongIdsMap,
							errCode : A.errorCode
						})
					}, this),
					onfailure : function(A) {
						w.onfailure(A)
					},
					noCache : true
				})
			}
		},
		getFavorSongList : function(w, z, y) {
			w = r(w);
			var A = this;
			var x = p + "?type=song" + (z ? "&size=" + z : "");
			o(x, {
				onsuccess : function(D) {
					var B = s(D);
					var C = B.data.songIdList;
					TingData.getSongListData(C, w, y)
				},
				onfailure : function(B) {
					w.onfailure(B)
				},
				noCache : true
			})
		},
		getSongListByHistory : function(w, z, y) {
			w = r(w);
			var x = e;
			o(x, {
				onsuccess : function(D) {
					var A = s(D), B = (A.data && A.data.songList) || [];
					var C = [];
					m(B, function(F, E) {
						if (F.songId) {
							C.push(F.songId)
						}
					});
					TingData.getSongListData(C, w, y)
				},
				onfailure : function(A) {
					w.onfailure(A)
				},
				noCache : true
			})
		},
		addFavorSong : function(y, w) {
			w = r(w);
			var x = d, z = "post";
			o(x, {
				method : z,
				data : "type=song&ids=" + y.join(","),
				onsuccess : n(function(B) {
					var A = s(B);
					if (k(A)) {
						if (A.errorCode == mbox.CODEMAP.SUCCESS
								|| A.errorCode == mbox.CODEMAP.FAVORREPEAT) {
							m(y, n(function(D, C) {
								this.favorSongIdsMap[D] = true
							}, this))
						}
						w.onsuccess(A.errorCode)
					} else {
						w.onfailure(B)
					}
				}, this),
				onfailure : function(A) {
					w.onfailure(A)
				},
				noCache : true
			})
		},
		removeFavorSong : function(y, w) {
			w = r(w);
			var x = b, z = "post";
			o(x, {
				method : z,
				data : "type=song&ids=" + y.join(","),
				onsuccess : n(function(B) {
					var A = s(B);
					if (k(A)) {
						if (A.errorCode == mbox.CODEMAP.SUCCESS) {
							m(y, n(function(D, C) {
								delete this.favorSongIdsMap[D]
							}, this))
						}
						w.onsuccess(A.errorCode)
					} else {
						w.onfailure(B)
					}
				}, this),
				onfailure : function(A) {
					w.onfailure(A)
				},
				noCache : true
			})
		},
		sendCommendation : function(z, y, w) {
			w = r(w);
			var x = a;
			o(x, {
				method : "post",
				data : "id=" + z + "&type=song&description="
						+ encodeURIComponent(y),
				onsuccess : function(B) {
					var A = s(B);
					if (k(A)) {
						w.onsuccess(A)
					} else {
						w.onfailure(B)
					}
				},
				onfailure : function(A) {
					w.onfailure(A)
				},
				noCache : true
			})
		},
		getPlayListName : function(w) {
			w = r(w);
			var x = q;
			o(x, {
				onsuccess : function(z) {
					var y = s(z);
					if (k(y)) {
						w.onsuccess(y)
					} else {
						w.onfailure(z)
					}
				},
				onfailure : function(y) {
					w.onfailure(y)
				},
				noCache : true
			})
		},
		getPlayList : function(y, w) {
			w = r(w);
			var x = j + "?sid=1&playListId=" + y;
			o(x, {
				onsuccess : n(function(A) {
					var z = s(A);
					if (k(z)) {
						if (z.errorCode == mbox.CODEMAP.SUCCESS) {
							m(z.data.songIds, n(function(C, B) {
								if (C.listId) {
									C.songList = this.saveSongList(C.songList)
								}
							}, this));
							w.onsuccess(z.data.songIds)
						}
						w.onsuccess(z)
					} else {
						w.onfailure(A)
					}
				}, this),
				onfailure : function(z) {
					w.onfailure(z)
				},
				noCache : true
			})
		},
		getPlayListDetail : function(y, w) {
			w = r(w);
			var x = j + "?sid=1&playListId=" + y;
			o(x, {
				onsuccess : n(function(A) {
					var z = s(A);
					if (k(z)) {
						if (z.errorCode == mbox.CODEMAP.SUCCESS) {
							m(z.data.songIds, n(function(C, B) {
								if (C.listId) {
									C.songList = this.saveSongList(C.songList)
								}
							}, this));
							w.onsuccess(z.data.songIds)
						}
						w.onsuccess(z)
					} else {
						w.onfailure(A)
					}
				}, this),
				onfailure : function(z) {
					w.onfailure(z)
				},
				noCache : true
			})
		},
		createPlayList : function(y, z, w) {
			w = r(w);
			var x = f;
			o(x, {
				method : "post",
				data : "playListName=" + encodeURIComponent(y) + "&gen_title="
						+ encodeURIComponent(z),
				onsuccess : function(B) {
					var A = s(B);
					if (k(A)) {
						w.onsuccess(A)
					} else {
						w.onfailure(B)
					}
				},
				onfailure : function(A) {
					w.onfailure(A)
				},
				noCache : true
			})
		},
		savePlayList : function(y, z, w) {
			w = r(w);
			var x = u + "?playListId=" + y;
			o(x, {
				method : "post",
				data : "songIds=" + z.join(","),
				onsuccess : function(B) {
					var A = s(B);
					if (k(A)) {
						w.onsuccess(A)
					} else {
						w.onfailure(B)
					}
				},
				onfailure : function(A) {
					w.onfailure(A)
				},
				noCache : true
			})
		},
		statAge : function(y, w) {
			w = r(w);
			var x = h;
			var A = [];
			for ( var z in y) {
				A.push(z + "=" + y[z])
			}
			o(x, {
				method : "post",
				data : A.join("&"),
				onsuccess : function(B) {
					w.onsuccess(B)
				},
				onfailure : function(B) {
					w.onfailure(B)
				},
				noCache : true
			})
		}
	};
	return l
})();
mbox.data = (function() {
	var g = T.ajax.request, d = T.json.parse, e = T.array.each, i = T.fn.bind;
	var a = function(j) {
		try {
			return d(j)
		} catch (k) {
			return j
		}
	}, b = function(j) {
		return a(j && j.responseText)
	}, c = function(j) {
		j = j || {};
		j.onsuccess = j.onsuccess || function() {
		};
		j.onfailure = j.onfailure || function() {
		};
		return j
	}, h = function(j) {
		return typeof j.errorCode != "undefined"
	};
	var f = function() {
		this.BaseData = TingData;
		this.UserData = new TingUserData();
		this.defaultSongIds = []
	};
	f.prototype = {
		saveSongList : function(k, j) {
			return this.BaseData.saveSongList.apply(this.BaseData, arguments)
		},
		saveFavorSongIdsToMap : function(j) {
			return this.UserData.saveFavorSongIdsToMap.apply(this.UserData,
					arguments)
		},
		saveFavorSongList : function(j) {
			return this.UserData.saveFavorSongList.apply(this.UserData,
					arguments)
		},
		init : function(j) {
			mbox.localStorage.init(i(function() {
				this.saveSongList(mbox.localStorage.getDefaultList());
				if (baidu.lang.isFunction(j)) {
					j()
				}
			}, this))
		},
		initDefaultSongListData : function(j) {
			defaultSongIds = this.getDefaultSongList();
			this.requestSongListData(defaultSongIds, j)
		},
		addDefaultSong : function(j) {
			var k = [];
			e(j, i(function(n, l) {
				var m = this.getFromSongCache(n);
				if (m && m.songId) {
					k.push( {
						songId : m.songId,
						songName : m.songName,
						artistId : m.artistId,
						artistName : m.artistName,
						albumId : m.albumId,
						albumName : m.albumName,
						songPicSmall : m.songPicSmall,
						lrcLink : m.lrcLink,
						version : m.version
					})
				}
			}, this));
			mbox.localStorage.addDefaultSong(k)
		},
		delDefaultSong : function(j) {
			j = j || [];
			return mbox.localStorage.delDefaultSong(j)
		},
		getLocalIdList : function() {
			var j = [], k = mbox.localStorage.getDefaultList();
			e(k, function(m, l) {
				if (typeof m.songId != "undefined") {
					j.push(m.songId)
				}
			});
			return j
		},
		getLocalListData : function() {
			return mbox.localStorage.getDefaultList()
		},
		getFromSongCache : function(j) {
			return this.BaseData.getFromSongCache( [ j ])[0]
		},
		getSongListData : function(k, j) {
			this.BaseData.getSongListData.apply(this.BaseData, arguments)
		},
		getSongUrl : function(l, j, k) {
			this.BaseData.getSongUrl.apply(this.BaseData, arguments)
		},
		getAlbum : function(k, j) {
			this.BaseData.getAlbum.apply(this.BaseData, arguments)
		},
		getDiyAlbum : function(k, j) {
			this.BaseData.getDiyAlbum.apply(this.BaseData, arguments)
		},
		getSongListByBubble : function(k, j) {
			this.BaseData.getSongListByBubble.apply(this.BaseData, arguments)
		},
		getLrcContent : function(k, j) {
			this.BaseData.getLrcContent.apply(this.BaseData, arguments)
		},
		getSongListByTop : function(k, j, l) {
			this.BaseData.getSongListByTop.apply(this.BaseData, arguments)
		},
		getFavorSongIds : function(j, k, l) {
			this.UserData.getFavorSongIds.apply(this.UserData, arguments)
		},
		getFavorSongList : function(j, k) {
			this.UserData.getFavorSongList.apply(this.UserData, arguments)
		},
		checkFavor : function(k, j) {
			return this.UserData.checkFavor.apply(this.UserData, arguments)
		},
		getSongListByHistory : function(j, k) {
			this.UserData.getSongListByHistory.apply(this.UserData, arguments)
		},
		addFavorSong : function(k, j) {
			this.UserData.addFavorSong.apply(this.UserData, arguments)
		},
		removeFavorSong : function(k, j) {
			this.UserData.removeFavorSong.apply(this.UserData, arguments)
		},
		sendCommendation : function(l, k, j) {
			this.UserData.sendCommendation.apply(this.UserData, arguments)
		},
		getPlayList : function(k, j) {
			this.UserData.getPlayList.apply(this.UserData, arguments)
		},
		getPlayListDetail : function(k, j) {
			this.UserData.getPlayListDetail.apply(this.UserData, arguments)
		},
		getPlayListName : function(j) {
			this.UserData.getPlayListName.apply(this.UserData, arguments)
		},
		createPlayList : function(k, j) {
			this.UserData.createPlayList.apply(this.UserData, arguments)
		},
		savePlayList : function(k, l, j) {
			this.UserData.savePlayList.apply(this.UserData, arguments)
		},
		statAge : function(l, k, j) {
			this.UserData.statAge.apply(this.UserData, arguments)
		}
	};
	return f
})();
mbox.data = new mbox.data();