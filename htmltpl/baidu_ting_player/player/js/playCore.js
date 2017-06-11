(function(g, e) {
	var p = g.document, q = Array.prototype.slice, m = Array.prototype.join, s = Object.prototype.toString, r = navigator.userAgent, a = 0;
	var d = [
			"\u64ad\u653e\u6838\u8c03\u5ea6\u5668\u76ee\u524d\u53ea\u652f\u6301\u521d\u59cb\u5316\u4e00\u6b21",
			"playerEngine \u5c1a\u672a\u8fdb\u884c\u521d\u59cb\u5316\uff0c\u8bf7\u5148\u8fdb\u884c\u521d\u59cb\u5316(init)",
			"Media pleyer\u672a\u5b89\u88c5\u5728\u6216\u8005\u88ab\u7981\u7528",
			"Flash\u64ad\u653e\u5668\u672a\u5b89\u88c5\u6216\u7248\u672c\u8fc7\u4f4e\uff0c\u8bf7\u5b89\u88c5\u6700\u65b0\u7248\u672c",
			"Flash\u64ad\u653e\u5668\u53ef\u80fd\u88ab\u63d2\u4ef6\u7981\u7528\u6216\u52a0\u8f7d\u5931\u8d25",
			"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301HTML5\u64ad\u653eMp3\u683c\u5f0f" ], k = function(
			G) {
		return p.getElementById(G)
	}, b = function(H, G) {
		w(G, function(J, I) {
			J = J.toString().replace(/\$/g, "$$$$");
			H = H.replace(RegExp("#{" + I + "}", "g"), J)
		});
		return H
	}, o = function(I, H) {
		var G = q.call(arguments, 2);
		return function() {
			var J = q.call(arguments, 0);
			return I.apply(H, J.concat(G))
		}
	}, F = function(G, H) {
		G = G.toString().split(".")[0];
		if (H - G.length > -1) {
			return Array(H - G.length + 1).join("0") + G
		} else {
			return G
		}
	}, w = function(J, I) {
		if (s.call(J) == "[object Array]") {
			for ( var H = 0, G = J.length; H < G; H++) {
				I(J[H], H)
			}
		} else {
			if (typeof (J) == "object") {
				for ( var H in J) {
					if (J.hasOwnProperty(H)) {
						I(J[H], H)
					}
				}
			}
		}
	}, A = (function() {
		if (g.addEventListener) {
			return function(I, H, G) {
				I.addEventListener(H, G, false)
			}
		} else {
			if (g.attachEvent) {
				return function(I, H, G) {
					I.attachEvent("on" + H, G)
				}
			} else {
				return function(I, H, G) {
					I["on" + H] = G
				}
			}
		}
	})(), C = function() {
		return !!g.ActiveXObject
	}(), j = function() {
		var G = false;
		try {
			G = external.max_version
		} catch (H) {
		}
		return G
	}(), v = function() {
		return /webkit/i.test(r)
	}(), y = function() {
		return typeof Audio != "undefined"
				&& typeof new Audio().canPlayType == "function"
				&& (new Audio().canPlayType("audio/mpeg") == "maybe" || new Audio()
						.canPlayType("audio/mpeg") == "probably") ? true
				: false
	}(), c = function() {
		return /ipad|iphone|ipod/i.test(r)
	}(), z = function() {
		return /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(r)
				&& !/chrome/i.test(r)
	}(), l = function(G) {
		return G == e ? true : !isFinite(G) ? true : false
	}, i = function() {
		return "_" + a++
	};
	var E = function(H, G) {
		var I, K, J;
		if (typeof (G) == "undefined") {
			G = []
		}
		I = arguments.callee;
		if (!I.map) {
			I.map = {}
		}
		K = function(Q, N, O) {
			var P, M, L;
			P = I.map;
			if (M = P[Q]) {
				w(M, function(S) {
					var R = S.apply(O, N);
					if (R !== e) {
						L = R
					}
				});
				return L
			}
		};
		J = function(N, L) {
			var M;
			M = I.map;
			if (!M[N]) {
				M[N] = []
			}
			M[N].push(L)
		};
		if (typeof (G) == "function") {
			J.apply(this, arguments)
		} else {
			if (G instanceof Array) {
				return K.apply(this, arguments)
			}
		}
	}, x = function() {
		this.on = function(H, I, G) {
			var K = G ? "before" : "";
			var J = this.instanceId;
			E(J + K + H, I)
		};
		this.un = function() {
		};
		this.fireEvent = function(I, H, G) {
			var K = this.instanceId;
			if (!G) {
				var J = E(K + "before" + I, H);
				if (J !== e) {
					return J
				}
			}
			return E(K + I, H)
		}
	}, u = function(G, H, L, K) {
		var J, I, M;
		G = G || function() {
		};
		H = H || {};
		M = {};
		J = function() {
			this.instanceId = i();
			G.apply(this, arguments)
		};
		I = J.prototype;
		x.call(I);
		w(H, function(O, N) {
			I[N] = function(Q, P) {
				if (typeof (Q) == "function") {
					return function() {
						var R, U;
						R = q.call(arguments, 0);
						if (L) {
							var T = L.apply(this, [ P ].concat(R));
							if (T !== e) {
								return T
							}
						}
						var S = this.fireEvent("before" + P, R);
						if (S !== e) {
							return S
						}
						U = Q.apply(this, R);
						K && K.apply(this, [ P ].concat(R));
						this.fireEvent(P, R, true);
						return U
					}
				} else {
					return Q
				}
			}(O, N)
		});
		return J
	}, n = function() {
		var G, I, H;
		G = [];
		I = function(J) {
			if (H) {
				J()
			} else {
				G.push(J)
			}
		};
		I.fire = function() {
			while (G.length) {
				try {
					G.shift()()
				} catch (J) {
				}
			}
			H = true
		};
		I.extinguish = function() {
			H = false
		};
		I.wettish = function() {
			this.fire();
			this.extinguish()
		};
		return I
	}, t = function(G) {
	};
	var D = u(function() {
		this.str = m.call(arguments, "")
	}, {
		apply : function(G) {
			return b(this.str, G)
		}
	});
	var B = {
		create : function(I, H) {
			I = I || {};
			var J = this.createHTML(I), G = true;
			if (typeof H == "string") {
				H = k(H)
			}
			if (!J) {
				J = I.errorMessage || "";
				G = false
			}
			if (H) {
				H.innerHTML = J
			} else {
				p.write(J)
			}
			return G
		},
		getMovie : function(G) {
			return p[G] || g[G]
		},
		getVersion : function() {
			if (navigator.plugins && navigator.mimeTypes.length) {
				var I = navigator.plugins["Shockwave Flash"];
				if (I && I.description) {
					return I.description.replace(/([a-zA-Z]|\s)+/, "").replace(
							/(\s)+r/, ".")
							+ ".0"
				}
			} else {
				if (g.ActiveXObject && !g.opera) {
					for ( var H = 10; H >= 6; H--) {
						try {
							var G = new ActiveXObject(
									"ShockwaveFlash.ShockwaveFlash." + H);
							if (G) {
								return H + ".0.0"
							}
						} catch (J) {
						}
					}
				}
			}
		},
		createHTML : function(O) {
			O = O || {};
			var P = this.getVersion(), I = 1, U = O.ver || "6.0.0", S, J;
			var R = O.vars, Q, N, K, L = [ "<object " ], H = [ "classid",
					"codebase", "id", "width", "height", "align" ];
			O.movie = O.url || "";
			O.align = O.align || "middle";
			O.classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000";
			O.codebase = "http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0";
			delete O.vars;
			delete O.url;
			if (typeof R == "string") {
				O.flashvars = R
			} else {
				var G = [];
				for (Q in R) {
					(K = R[Q]) && G.push(Q + "=" + encodeURIComponent(K))
				}
				O.flashvars = G.join("&")
			}
			for ( var M = 0, N = H.length; M < N; M++) {
				L.push(" ", K = H[M], '="', O[K], '"')
			}
			L.push(">");
			var T = {
				wmode : 1,
				scale : 1,
				quality : 1,
				play : 1,
				loop : 1,
				menu : 1,
				salign : 1,
				bgcolor : 1,
				base : 1,
				allowscriptaccess : 1,
				allownetworking : 1,
				allowfullscreen : 1,
				seamlesstabbing : 1,
				devicefont : 1,
				swliveconnect : 1,
				flashvars : 1,
				movie : 1
			};
			for (Q in O) {
				K = O[Q];
				if (T[Q] && K) {
					L.push('<param name="' + Q + '" value="' + K + '" />')
				}
			}
			O.src = O.movie;
			O.name = O.id;
			delete O.id;
			delete O.movie;
			delete O.classid;
			delete O.codebase;
			O.type = "application/x-shockwave-flash";
			O.pluginspage = "http://www.macromedia.com/go/getflashplayer";
			L.push("<embed");
			for (Q in O) {
				K = O[Q];
				if (K) {
					L.push(" ", Q, '="', K, '"')
				}
			}
			L.push("></embed></object>");
			return L.join("")
		},
		checkPlayer : function(H) {
			var J = this.getVersion(), K = H;
			if (J) {
				var G = J.split("."), I = K.split(".");
				if (G[0] - I[0] >= 0 && G[1] - I[1] >= 0) {
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		}
	};
	var h = function(H) {
		var I, G;
		H /= 1000;
		I = Math.floor(H / 60);
		G = H % 60;
		return F(I, 2) + ":" + F(G, 2)
	};
	var f = u(
			function(G) {
				G = G || {};
				this.defaultEngine = G.defaultEngine || {
					wmp : 1,
					audio : 1,
					fmp : 1,
					aac : 1
				};
				this.defaultExt = G.defaultExt || "mp3";
				this.ready = false;
				this.errorHandler = typeof G.errorHandler == "function" ? G.errorHandler
						: function(H, I) {
						};
				this.mute = G.mute || false;
				this.volume = typeof G.volume == "undefined" ? 50 : G.volume;
				this.curEngine = ""
			},
			{
				init : function(I) {
					if (this.ready) {
						return t(d[0])
					}
					var H = [], I = I || {};
					if (!I.el) {
						var G = p.createElement("div");
						G.id = "_baidu_player_container";
						G.style.width = "1%";
						G.style.height = "1%";
						G.style.overflow = "hidden";
						G.style.position = "absolute";
						G.style.top = "-10px";
						G.style.zIndex = "1";
						p.body.appendChild(G);
						I.el = G
					}
					H.push(I.el);
					H.push(I.swfPath);
					H.push(I.aacPath);
					this.engines = I.engines || this.defaultEngine;
					this.engineNameList = [];
					this.engines.wmp = !!this.engines.wmp;
					if (this.engines.wmp) {
						this.engineNameList.push("wmp")
					}
					this.engines.audio = !!this.engines.audio;
					if (this.engines.audio) {
						this.engineNameList.push("audio")
					}
					this.engines.fmp = !!this.engines.fmp;
					if (this.engines.fmp) {
						this.engineNameList.push("fmp")
					}
					this.engines.aac = !!this.engines.aac;
					if (this.engines.aac) {
						this.engineNameList.push("aac")
					}
					if (this.engines.wmp && C) {
						f.wmp.init.apply(f.wmp, H);
						this.switchEngineInstanceByUrl(null, "wmp");
						this.curEngine = "wmp"
					} else {
						if (this.engines.audio && y && (c || z)) {
							f.audio.init.apply(f.audio, H);
							this.switchEngineInstanceByUrl(null, "audio");
							this.curEngine = "audio"
						} else {
							if (this.engines.fmp) {
								f.fmp.init.apply(f.fmp, [ I.el, I.swfPath ]);
								this.switchEngineInstanceByUrl(null, "fmp");
								this.curEngine = "fmp"
							}
							if (this.engines.aac) {
								f.aac.init.apply(f.aac, [ I.el, I.aacPath ]);
								this.switchEngineInstanceByUrl(null, "aac");
								this.curEngine = "aac"
							}
						}
					}
					this.ready = true;
					this.conf = I
				},
				reset : function() {
					this.url = "";
					this.engineInstance.reset.apply(this.engineInstance,
							arguments)
				},
				setUrl : function(G) {
					this.url = G;
					var H;
					H = this.engineInstance;
					this.switchEngineInstanceByUrl(G);
					if (H && H != this.engineInstance) {
						H.stop()
					}
					return this.engineInstance.setUrl.apply(
							this.engineInstance, [ G ])
				},
				getUrl : function() {
					return this.url
				},
				play : function(G) {
					if (G == e) {
						return this.engineInstance.play.apply(
								this.engineInstance, arguments)
					} else {
						this.setCurrentPosition(G)
					}
				},
				pause : function() {
					return this.engineInstance.pause.apply(this.engineInstance,
							arguments)
				},
				stop : function() {
					return this.engineInstance.stop.apply(this.engineInstance,
							arguments)
				},
				setMute : function(I) {
					this.mute = I;
					for ( var H = 0, G = this.engineNameList.length; H < G; H++) {
						this[this.engineNameList[H]].setMute.apply(
								this[this.engineNameList[H]], arguments)
					}
				},
				getMute : function() {
					return typeof this.mute == "boolean" ? this.mute
							: this.mute = this.audio.settings.mute
				},
				setVolume : function(I) {
					this.volume = I;
					for ( var H = 0, G = this.engineNameList.length; H < G; H++) {
						this[this.engineNameList[H]].setVolume.apply(
								this[this.engineNameList[H]], arguments)
					}
				},
				getVolume : function() {
					return this.volume
				},
				setCurrentPosition : function(G) {
					return this.engineInstance.setCurrentPosition.apply(
							this.engineInstance, arguments)
				},
				getCurrentPosition : function() {
					return this.engineInstance.getCurrentPosition.apply(
							this.engineInstance, arguments)
				},
				getCurrentPositionString : function() {
					return this.engineInstance.getCurrentPositionString.apply(
							this.engineInstance, arguments)
				},
				getLoadedPercent : function() {
					return this.engineInstance.getLoadedPercent.apply(
							this.engineInstance, arguments)
				},
				getBufferedPercent : function() {
					return this.engineInstance.getBufferedPercent.apply(
							this.engineInstance, arguments)
				},
				getTotalTime : function() {
					return this.engineInstance.getTotalTime.apply(
							this.engineInstance, arguments)
				},
				getTotalTimeString : function() {
					return this.engineInstance.getTotalTimeString.apply(
							this.engineInstance, arguments)
				},
				getState : function() {
					return this.engineInstance.getState.apply(
							this.engineInstance, arguments)
				},
				getBandWidth : function() {
					return this.engineInstance.getBandWidth.apply(
							this.engineInstance, arguments)
				},
				getVersion : function() {
					return this.engineInstance.getVersion.apply(
							this.engineInstance, arguments)
				},
				getReceivedPackets : function() {
					return this.engineInstance.getReceivedPackets.apply(
							this.engineInstance, arguments)
				},
				getWMPState : function() {
					if (this.curEngine == "wmp") {
						return this.engineInstance.getPlayState() + "_"
								+ this.engineInstance.getOpenState()
					} else {
						return ""
					}
				},
				setStateChangeCallBack : function(I) {
					var H = this;
					var G = function(L, J, K) {
						if (K == H.engineType) {
							I.apply(H, [ L, J, K ])
						}
					};
					this.on("playstatechange", G)
				},
				getUrlExt : function(G) {
					var H = /\.(mp3|wma|asf|mp4)(\?|$)/i;
					if (H.test(G)) {
						return RegExp.$1.toLowerCase()
					} else {
						return this.defaultExt
					}
				},
				switchEngineInstanceByUrl : function(G, H) {
					H = H || this.getUrlExt(G);
					switch (H) {
					case "fmp":
					case "mp3":
						if (this.engines.wmp && C) {
							this.engineType = "wmp";
							this.engineInstance = f.wmp
						} else {
							if (this.engines.audio && y && (c || z)) {
								this.engineType = "audio";
								this.engineInstance = f.audio
							} else {
								if (this.engines.fmp) {
									this.engineType = "fmp";
									this.engineInstance = f.fmp
								}
							}
						}
						break;
					case "wmp":
					case "wma":
						this.engineType = "wmp";
						this.engineInstance = f.wmp;
						break;
					case "audio":
						this.engineType = "audio";
						this.engineInstance = f.audio;
						break;
					case "aac":
					case "mp4":
						this.engineType = "aac";
						this.engineInstance = f.aac;
						break
					}
				},
				setErrorListener : function(G) {
					this.errorHandler = typeof G == "function" ? G
							: this.errorHandler
				},
				callErrorListener : function() {
					this.errorHandler.apply(this, arguments)
				},
				canPlayType : function(G) {
					switch (G) {
					case "mp3":
					case "mpeg":
						if (this.engines.wmp || this.engines.fmp
								|| (this.engines.audio && (c || z))) {
							return true
						} else {
							return false
						}
						break;
					case "wma":
						return !!this.engines.wmp;
						break;
					case "aac":
					case "mp4":
						return !!this.engines.aac && B.checkPlayer("10.0.0");
						break
					}
				}
			}, function(G) {
				switch (G) {
				case "init":
				case "getUrlExt":
				case "switchEngineInstanceByUrl":
				case "setErrorListener":
				case "callErrorListener":
					return;
					break
				}
				if (!this.ready) {
					t(d[1]);
					return false
				}
			});
	f = new f();
	f.wmp = u(
			function(G) {
				G = G || {};
				this.playStateDelayTime = typeof G.playStateDelayTime == "number" ? G.playStateDelayTime
						: 100;
				this.humanStopCheckDelayTime = typeof G.humanStopCheckDelayTime == "number" ? G.humanStopCheckDelayTime
						: 640;
				this.timeDifference = typeof G.timeDifference == "number" ? G.timeDifference
						: 2;
				this.minDurationForDiff = typeof G.minDurationForDiff == "number" ? G.minDurationForDiff
						: 10;
				this.errorMessage = typeof G.errorMessage != "undefined" ? G.errorMessage
						: "";
				this.fuze = n();
				this.fuze.fire()
			},
			{
				init : function(I) {
					var G;
					if (typeof I == "string") {
						I = k(I)
					}
					G = p.createElement("div");
					I.appendChild(G);
					var J = "_m3_" + i();
					var H = new D(
							"<object id='#{id}' width='#{width}' height='#{height}' ",
							"classid='CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6'>",
							"<param name='autostart' value='false'>",
							"<param name='balance' value='0'>",
							"<param name='enabled' value='false'>",
							"<param name='enablecontextmenu' value='false'>",
							"<param name='url' value='#{url}'>",
							"<param name='playcount' value='#{playcount}'>",
							"<param name='rate' value='1'>",
							"<param name='currentposition' value='0'>",
							"<param name='currentmarker' value='0'>",
							"<param name='defaultframe' value=''>",
							"<param name='invokeurls' value='false'>",
							"<param name='baseurl' value=''>",
							"<param name='stretchtofit' value='false'>",
							"<param name='volume' value='#{volume}'>",
							"<param name='mute' value='#{mute}'>",
							"<param name='uimode' value='none'>",
							"<param name='windowlessvideo' value='-1'>",
							"<param name='fullscreen' value='false'>",
							"<param name='enableerrordialogs' value='false'>",
							"</object>");
					G.innerHTML = H.apply( {
						id : J,
						width : "0%",
						height : "0%",
						url : "",
						playcount : 1,
						volume : 50,
						mute : false
					});
					this.audio = k(J);
					if (!this.checkPlayer()) {
						return
					}
					this.defineEvent();
					this.reset()
				},
				reset : function() {
					this.bufferingProgress = 0;
					this.lastControl = "";
					this.lastState = "";
					this.stateDispatchSwitch = false;
					this.url = "";
					this.audio.URL = "";
					this.stateStack = [ "ready" ];
					this.timer_0 = this.timer_1 = null
				},
				setUrl : function(G) {
					this.fuze(o(function() {
						this.reset();
						this.url = this.audio.URL = G || "";
						this.lastState = "ready"
					}, this))
				},
				getUrl : function() {
					return this.url || ""
				},
				play : function() {
					this.fuze(o(function() {
						this.setVolume(this.getVolume());
						this.setMute(this.getMute());
						this.stateDispatchSwitch = true;
						this.firePlayStateChange(this.getState(3));
						this.audio.controls.play();
						this.firePlayStateChange(this.getState())
					}, this))
				},
				pause : function() {
					this.fuze(o(function() {
						if (this.lastState != "stop") {
							this.firePlayStateChange(this.getState(2));
							this.audio.controls.pause()
						}
					}, this))
				},
				stop : function() {
					this.fuze(o(function() {
						this.firePlayStateChange(this.getState(1));
						this.fuze.extinguish();
						this.humanStop = true;
						this.audio.controls.stop();
						setTimeout(o(function() {
							this.humanStop = false;
							this.fuze.fire()
						}, this), this.humanStopCheckDelayTime)
					}, this))
				},
				setMute : function(G) {
					if (this.getMute() == G) {
						return
					}
					if (G) {
						this.volume_tmp = this.getVolume();
						this.setVolume(0);
						this.mute = G
					} else {
						this.mute = G;
						this.setVolume(this.volume_tmp)
					}
					this.audio.settings.mute = G
				},
				getMute : function() {
					return typeof this.mute == "boolean" ? this.mute
							: this.mute = this.audio.settings.mute
				},
				setVolume : function(G) {
					if (this.getMute()) {
						this.volume_tmp = G;
						this.volume = 0
					} else {
						this.volume = G
					}
					this.audio.settings.volume = this.volume
				},
				getVolume : function() {
					return this.getMute() ? this.volume_tmp
							: typeof this.volume == "number" ? this.volume
									: this.volume = this.audio.settings.volume
				},
				setCurrentPosition : function(G) {
					this.fuze(o(function() {
						this.audio.controls.currentPosition = G / 1000;
						if (this.state != "play" && this.state != "buffering"
								&& this.state != "pre-buffer") {
							this.play()
						} else {
							this.audio.controls.play()
						}
					}, this))
				},
				getCurrentPosition : function() {
					var G = this.audio.controls.currentPosition, H = this.audio.currentMedia ? this.audio.currentMedia.duration
							: 0;
					if (Math.abs(G - H) < this.timeDifference
							&& H > this.minDurationForDiff) {
						this.firePlayStateChange(this.getState(8))
					}
					return Math.ceil(G * 1000)
				},
				getCurrentPositionString : function() {
					return this.audio.controls.currentPositionString || "00:00"
				},
				getLoadedPercent : function() {
					if (this.lastState == "ready") {
						return 0
					} else {
						return this.audio.network.downloadProgress / 100
					}
				},
				getBufferedPercent : function() {
					if (this.lastState == "ready") {
						return 0
					} else {
						return this.audio.network.bufferingProgress / 100
					}
				},
				getTotalTime : function() {
					if (this.audio.currentMedia) {
						return Math
								.round(this.audio.currentMedia.duration * 1000)
					} else {
						return 0
					}
				},
				getTotalTimeString : function() {
					if (this.audio.currentMedia) {
						return this.audio.currentMedia.durationString
					} else {
						return "00:00"
					}
				},
				getState : function(G) {
					G = typeof G == "number" ? G : this.audio.PlayState - 0;
					switch (G) {
					case 1:
						return "stop";
					case 2:
						return "pause";
					case 3:
						return "play";
					case 6:
						return "buffering";
					case 8:
						return "end";
					case 9:
						return "pre-buffer";
					case 10:
						return "ready";
					case 11:
						return "error"
					}
				},
				getBandWidth : function() {
					if (this.audio.network) {
						return this.audio.network.bandwidth
					} else {
						return 0
					}
				},
				getVersion : function() {
					return this.audio.versionInfo
				},
				getReceivedPackets : function() {
					if (this.audio.network) {
						return this.audio.network.receivedPackets
					} else {
						return 0
					}
				},
				getPlayState : function() {
					return this.audio.playState
				},
				getOpenState : function() {
					return this.audio.openState
				},
				defineEvent : function() {
					var H = this.audio;
					var G;
					var I = o(function(K, J) {
						return setTimeout(o(this.firePlayStateChange, this,
								this.getState(J)), K)
					}, this);
					H
							.attachEvent(
									"PlayStateChange",
									o(
											function(J) {
												clearTimeout(G);
												if (J == 3) {
													switch (this.lastControl) {
													case "stop":
													case "pause":
														this[this.lastControl]
																.call(this);
														break;
													default:
														G = I(
																this.playStateDelayTime,
																J);
														break
													}
												} else {
													if (J == 6) {
														switch (this.lastControl) {
														case "stop":
														case "pause":
															return;
															break
														}
													} else {
														if (J == 1) {
															if (this.humanStop) {
																this
																		.firePlayStateChange(this
																				.getState(1))
															} else {
																this.timer_0 = setTimeout(
																		o(
																				function() {
																					if (!this.unload) {
																						this
																								.firePlayStateChange(this
																										.getState(8))
																					}
																				},
																				this),
																		0)
															}
														} else {
															if (J == 10
																	&& this
																			.getCurrentPosition() > 0) {
																this
																		.firePlayStateChange(this
																				.getState(11))
															} else {
																if (J != 8) {
																	if (!this.timer_1) {
																		this
																				.firePlayStateChange(this
																						.getState(J))
																	}
																} else {
																	this.timer_1 = setTimeout(
																			o(
																					function() {
																						this
																								.firePlayStateChange(this
																										.getState(8))
																					},
																					this),
																			20)
																}
															}
														}
													}
												}
											}, this))
				},
				firePlayStateChange : function(H) {
					if (this.stateDispatchSwitch && this.lastState != H) {
						this.stateStack.push(H);
						var G = this.stateStack.shift();
						if (H == "end") {
							this.stateDispatchSwitch = false;
							if (this.timer_0) {
								g.clearTimeout(this.timer_0)
							}
							if (this.timer_1) {
								g.clearTimeout(this.timer_1)
							}
						}
						f.fireEvent("playstatechange", [ this.lastState = H, G,
								"wmp" ])
					}
				},
				checkPlayer : function() {
					if (!this.audio.controls) {
						this.callErrorListener();
						return false
					}
					return true
				},
				callErrorListener : function() {
					f.callErrorListener("wmp", this.errorMessage)
				}
			}, function(G) {
				if (G == "init") {
					return
				}
				if (!this.audio || !this.audio.controls) {
					switch (G) {
					case "play":
					case "pause":
					case "stop":
					case "setCurrentPosition":
					case "setMute":
					case "setUrl":
					case "setVolume":
						return false;
					case "getMute":
						return false;
					case "getTotalTime":
					case "getCurrentPosition":
					case "getLoadedPercent":
						return 0;
					case "getVolume":
						return 50;
					case "getState":
						return -1;
					case "getCurrentPositionString":
					case "getTotalTimeString":
						return "00:00"
					}
				} else {
					switch (G) {
					case "play":
					case "pause":
					case "stop":
					case "setCurrentPosition":
						this.lastControl = G
					}
				}
			});
	f.wmp = new f.wmp( {
		playStateDelayTime : 100,
		humanStopCheckDelayTime : 640,
		timeDifference : 2,
		minDurationForDiff : 10,
		errorMessage : d[2]
	});
	f.fmp = u(function(G) {
		G = G || {};
		this.swfPath = G.swfPath || "fmp.swf";
		this.flashVersionRequire = G.flashVersionRequire || "9.0.0";
		this.versionErrorMessage = G.versionErrorMessage || "";
		this.loadFailMessage = G.loadFailMessage || ""
	}, {
		init : function(H, I) {
			var G;
			if (typeof H == "string") {
				H = k(H)
			}
			G = p.createElement("div");
			G.id = "_m3_" + i();
			H.appendChild(G);
			this.swfPath = I || this.swfPath;
			if (j || v) {
				this.swfPath += "?" + Math.random()
			}
			this.flashReady = n();
			B.create( {
				id : this.flashObjectId = "_m3_" + i(),
				width : "1%",
				height : "1%",
				ver : this.flashVersionRequire,
				errorMessage : this.versionErrorMessage,
				url : this.swfPath,
				bgcolor : "#ffffff",
				wmode : "window",
				scale : "noscale",
				vars : {
					_instanceName : "baidu.m3.fmp",
					_buffertime : 6000
				}
			}, G);
			if (!this.checkPlayer()) {
				return
			}
			this.reset()
		},
		reset : function() {
			this.url = "";
			this.state = -1;
			this.stateStack = [ "ready" ]
		},
		setUrl : function(G) {
			this.flashReady(o(function() {
				this.reset();
				this.url = G;
				this.flashObject.f_load(G)
			}, this))
		},
		getUrl : function() {
			return this.url || ""
		},
		play : function() {
			this.flashReady(o(function() {
				if (this.state == 1) {
					return
				}
				this.flashObject.f_play()
			}, this))
		},
		pause : function() {
			this.flashReady(o(function() {
				if (this.state == 2 || this.state == 0 || this.state == 3) {
					return
				}
				this.flashObject.f_pause()
			}, this))
		},
		stop : function() {
			this.flashReady(o(function() {
				if (this.state == 0) {
					return
				}
				this.flashObject.f_stop()
			}, this))
		},
		setMute : function(G) {
			this.flashReady(o(function() {
				this.mute = G;
				this.flashObject.setData("mute", G)
			}, this))
		},
		getMute : function() {
			return this.mute || false
		},
		setVolume : function(G) {
			this.flashReady(o(function() {
				this.volume = G;
				this.flashObject.setData("volume", G)
			}, this))
		},
		getVolume : function() {
			return typeof this.volume == "number" ? this.volume : 50
		},
		setCurrentPosition : function(G) {
			this.flashReady(o(function() {
				this.flashObject.f_play(G)
			}, this))
		},
		getCurrentPosition : function() {
			return this.flashObject.getData("currentPosition")
		},
		getCurrentPositionString : function() {
			return h(this.getCurrentPosition())
		},
		getLoadedPercent : function() {
			return this.flashObject.getData("loadedPct")
		},
		getBufferedPercent : function() {
			return 1
		},
		getTotalTime : function() {
			return this.flashObject.getData("length")
		},
		getTotalTimeString : function() {
			return h(this.getTotalTime())
		},
		getState : function(G) {
			G = typeof G == "number" ? G : this.flashObject
					.getData("playStatus");
			switch (G) {
			case -1:
				return "ready";
			case 0:
				return "stop";
			case 1:
				return "play";
			case 2:
				return "pause";
			case 3:
				return "end";
			case 4:
				return "buffering";
			case 5:
				return "pre-buffer"
			}
		},
		getBandWidth : function() {
			return 0
		},
		getVersion : function() {
			return B.getVersion()
		},
		getReceivedPackets : function() {
			return 0
		},
		getPlayState : function() {
			return ""
		},
		getOpenState : function() {
			return ""
		},
		firePlayStateChange : function(H) {
			this.stateStack.push(H);
			var G = this.stateStack.shift();
			f.fireEvent("playstatechange", [ H, G, "fmp" ])
		},
		_onLoad : function() {
			this.state = -1;
			this.flashObject = B.getMovie(this.flashObjectId);
			setTimeout(o(function() {
				this.flashReady.fire()
			}, this), 0)
		},
		_onPlayStateChange : function(G) {
			if (G != this.state) {
				this.state = G;
				this.firePlayStateChange(this.getState(G))
			}
		},
		checkPlayer : function() {
			var I = B.getVersion(), J = this.flashVersionRequire;
			if (I) {
				var G = I.split("."), H = J.split(".");
				if (G[0] - H[0] >= 0 && G[1] - H[1] >= 0) {
					return true
				} else {
					this.callErrorListener(this.versionErrorMessage);
					return false
				}
			} else {
				this.callErrorListener(this.versionErrorMessage);
				return false
			}
		},
		checkFail : function() {
			if (this.flashObject == null) {
				this.callErrorListener(this.loadFailMessage);
				return false
			}
		},
		callErrorListener : function(G) {
			f.callErrorListener("fmp", G)
		}
	}, function(G) {
		if (G == "init" || G == "_onLoad") {
			return
		}
		if (!this.flashObject && this.flashReady) {
			switch (G) {
			case "getMute":
				return false;
			case "getTotalTime":
			case "getCurrentPosition":
			case "getLoadedPercent":
				return 0;
			case "getVolume":
				return 50;
			case "getState":
				return -1;
			case "getCurrentPositionString":
			case "getTotalTimeString":
				return "00:00"
			}
		} else {
			if (!this.flashReady) {
				return false
			}
		}
	});
	f.fmp = new f.fmp( {
		swfPath : "flash/fmp.swf",
		flashVersionRequire : "9.0.0",
		versionErrorMessage : d[3],
		loadFailMessage : d[4]
	});
	f.audio = u(function(G) {
		G = G || {};
		this.audio = null;
		this.mute = false;
		this.state = "ready";
		this.lastState = "ready";
		this.statetrack = [ "ready" ];
		this.mimeType = G.mimeType || "audio/mpeg";
		this.errMsg = G.errorMsg || ""
	}, {
		init : function(G) {
			if (y) {
				this.audio = new Audio();
				this.volume = 50;
				this.audio.volume = 0.5;
				this.url = "";
				this.definedEvents()
			} else {
				this.callErrorListener("audio", this.errMsg)
			}
		},
		reset : function() {
			this.audio.load();
			this.url = "";
			this.audio.pause();
			this.state = "ready";
			this.lastState = "ready";
			this.statetrack = [ "ready" ]
		},
		setUrl : function(G) {
			this.url = G;
			this.audio.src = G;
			this.firePlayStateChange(this.getState(5));
			this.audio.load()
		},
		getUrl : function() {
			return this.url
		},
		play : function() {
			if (this.state != "ready") {
				this.audio.play()
			}
		},
		pause : function() {
			if (this.state != "stop" && this.state != "ready"
					&& this.state != "end") {
				this.audio.pause();
				this.firePlayStateChange(this.getState(2))
			}
		},
		stop : function() {
			if (this.audio) {
				if (this.audio.currentTime != 0) {
					this.audio.currentTime = 0
				}
				this.audio.pause();
				this.firePlayStateChange(this.getState(0))
			}
		},
		setMute : function(G) {
			this.audio.muted = this.mute = G
		},
		getMute : function() {
			return this.mute || false
		},
		setVolume : function(G) {
			G = l(G) ? 50 : G;
			G = Math.max(Math.min(G, 100), 0);
			this.volume = G;
			this.audio.volume = G / 100
		},
		getVolume : function() {
			return typeof this.volume == "number" ? this.volume : 50
		},
		setCurrentPosition : function(G) {
			this.audio.currentTime = G / 1000;
			this.play()
		},
		getCurrentPosition : function() {
			return Math.round(this.audio.currentTime * 1000)
		},
		getCurrentPositionString : function() {
			return h(this.getCurrentPosition())
		},
		getLoadedPercent : function() {
			try {
				var G = this.audio.buffered.end(0), H = this.audio.duration;
				H = isNaN(H) ? 0 : H;
				return Math.round(G / H * 100) / 100
			} catch (I) {
				return 0
			}
		},
		getBufferedPercent : function() {
			return 1
		},
		getTotalTime : function() {
			var G = this.audio.duration;
			G = isNaN(G) ? 0 : G;
			return Math.round(G * 1000)
		},
		getTotalTimeString : function() {
			return h(this.getTotalTime())
		},
		getState : function(H) {
			if (typeof H === "number") {
				switch (H) {
				case -1:
					return "ready";
				case 0:
					return "stop";
				case 1:
					return "play";
				case 2:
					return "pause";
				case 3:
					return "end";
				case 4:
					return "buffering";
				case 5:
					return "pre-buffer";
				case 6:
					return "error"
				}
			} else {
				var G = this.audio;
				if (G.ended) {
					return "ended"
				}
				if (G.currentTime == 0 && G.networkState == 2) {
					return "pre-buffer"
				}
				if ((G.networkState == 2 && G.readyState < 3)
						|| (G.seeking && !G.paused)) {
					return "buffering"
				}
				if (G.buffered.length && G.buffered.end(0)
						&& (G.buffered.end(0) - G.currentTime <= 0.35)) {
					return "buffering"
				}
				if (G.networkState > 0 && G.readyState > 0 && G.paused) {
					return G.currentTime > 0 ? "paused" : "stop"
				}
				if (G.networkState > 0 && G.readyState > 0 && !G.paused
						&& !G.ended) {
					return "playing"
				}
				if (G.error && G.error.code) {
					return "error"
				}
			}
			return "ready"
		},
		getBandWidth : function() {
			return 0
		},
		getVersion : function() {
			return ""
		},
		getReceivedPackets : function() {
			return 0
		},
		getPlayState : function() {
			return ""
		},
		getOpenState : function() {
			return ""
		},
		definedEvents : function() {
			this.audio.addEventListener("error", o(function() {
				this.firePlayStateChange(this.getState(6))
			}, this));
			this.audio.addEventListener("ended", o(function() {
				this.firePlayStateChange(this.getState(3))
			}, this));
			this.audio.addEventListener("playing", o(function() {
				this.firePlayStateChange(this.getState(1))
			}, this));
			this.audio.addEventListener("progress", o(function(J) {
				var I = this.getCurrentPosition(), G = 0;
				try {
					G = Math.round(this.audio.buffered.end(0) * 1000)
				} catch (K) {
				}
				var H = G - I;
				if (G && H > 350) {
					if (this.state == "buffering") {
						this.firePlayStateChange(this.getState(1))
					}
				} else {
					if (this.state == "play") {
						this.firePlayStateChange(this.getState(4))
					}
				}
			}, this))
		},
		firePlayStateChange : function(G) {
			if (this.state != G) {
				this.state = G;
				this.statetrack.push(G);
				this.lastState = this.statetrack.shift();
				f.fireEvent("playstatechange", [ G, this.lastState, "audio" ])
			}
		},
		callErrorListener : function(G) {
			f.callErrorListener("audio", G)
		}
	}, function(G) {
		if (G == "init" || G == "callErrorListener") {
			return
		}
		if (!this.audio) {
			return false
		}
	});
	f.audio = new f.audio( {
		errorMsg : d[5]
	});
	f.aac = u(function(G) {
		G = G || {};
		this.swfPath = G.aacPath || "aac.swf";
		this.flashVersionRequire = G.flashVersionRequire || "10.0.0";
		this.versionErrorMessage = G.versionErrorMessage || "";
		this.loadFailMessage = G.loadFailMessage || ""
	}, {
		init : function(H, I) {
			var G;
			if (typeof H == "string") {
				H = k(H)
			}
			G = p.createElement("div");
			G.id = "_m3_" + i();
			H.appendChild(G);
			this.swfPath = I || this.swfPath;
			if (j || v) {
				this.swfPath += "?" + Math.random()
			}
			this.flashReady = n();
			B.create( {
				id : this.flashObjectId = "_m3_" + i(),
				width : "1%",
				height : "1%",
				ver : this.flashVersionRequire,
				errorMessage : this.versionErrorMessage,
				url : this.swfPath,
				bgcolor : "#ffffff",
				wmode : "window",
				scale : "noscale",
				vars : {
					_instanceName : "baidu.m3.aac",
					_buffertime : 6000
				}
			}, G);
			if (!this.checkPlayer()) {
				return
			}
			this.reset()
		},
		reset : function() {
			this.url = "";
			this.state = -1;
			this.stateStack = [ "ready" ]
		},
		setUrl : function(G) {
			this.flashReady(o(function() {
				this.reset();
				this.url = G;
				this.flashObject.f_load(G)
			}, this))
		},
		getUrl : function() {
			return this.url || ""
		},
		play : function() {
			this.flashReady(o(function() {
				if (this.state == 1) {
					return
				}
				this.flashObject.f_play()
			}, this))
		},
		pause : function() {
			this.flashReady(o(function() {
				if (this.state == 2 || this.state == 0 || this.state == 3) {
					return
				}
				this.flashObject.f_pause()
			}, this))
		},
		stop : function() {
			this.flashReady(o(function() {
				if (this.state == 0) {
					return
				}
				this.flashObject.f_stop()
			}, this))
		},
		setMute : function(G) {
			this.flashReady(o(function() {
				this.mute = G;
				this.flashObject.setData("mute", G)
			}, this))
		},
		getMute : function() {
			return this.mute || false
		},
		setVolume : function(G) {
			this.flashReady(o(function() {
				G = G > 100 ? 100 : G < 0 ? 0 : G;
				this.volume = G;
				this.flashObject.setData("volume", G)
			}, this))
		},
		getVolume : function() {
			return typeof this.volume == "number" ? this.volume : 50
		},
		setCurrentPosition : function(G) {
			this.flashReady(o(function() {
				this.flashObject.f_play(Math.round(G))
			}, this))
		},
		getCurrentPosition : function() {
			return Math.round(this.flashObject.getData("currentPosition"))
		},
		getCurrentPositionString : function() {
			return h(this.getCurrentPosition())
		},
		getLoadedPercent : function() {
			return this.flashObject.getData("loadedPct")
		},
		getBufferedPercent : function() {
			return 1
		},
		getTotalTime : function() {
			return Math.round(this.flashObject.getData("length") * 1000)
		},
		getTotalTimeString : function() {
			return h(this.getTotalTime())
		},
		getState : function(G) {
			G = typeof G == "number" ? G : this.flashObject
					.getData("playStatus");
			switch (G) {
			case -1:
				return "ready";
			case 0:
				return "stop";
			case 1:
				return "play";
			case 2:
				return "pause";
			case 3:
				return "end";
			case 4:
				return "buffering";
			case 5:
				return "pre-buffer"
			}
		},
		getBandWidth : function() {
			return 0
		},
		getVersion : function() {
			return B.getVersion()
		},
		getReceivedPackets : function() {
			return 0
		},
		getPlayState : function() {
			return ""
		},
		getOpenState : function() {
			return ""
		},
		firePlayStateChange : function(H) {
			this.stateStack.push(H);
			var G = this.stateStack.shift();
			f.fireEvent("playstatechange", [ H, G, "aac" ])
		},
		_onLoad : function() {
			this.state = -1;
			this.flashObject = B.getMovie(this.flashObjectId);
			setTimeout(o(function() {
				this.flashReady.fire()
			}, this), 0)
		},
		_onPlayStateChange : function(G) {
			if (G != this.state) {
				this.state = G;
				this.firePlayStateChange(this.getState(G))
			}
		},
		checkPlayer : function() {
			var I = B.getVersion(), J = this.flashVersionRequire;
			if (I) {
				var G = I.split("."), H = J.split(".");
				if (G[0] - H[0] >= 0 && G[1] - H[1] >= 0) {
					return true
				} else {
					this.callErrorListener(this.versionErrorMessage);
					return false
				}
			} else {
				this.callErrorListener(this.versionErrorMessage);
				return false
			}
		},
		checkFail : function() {
			if (this.flashObject == null) {
				this.callErrorListener(this.loadFailMessage);
				return false
			}
		},
		callErrorListener : function(G) {
			f.callErrorListener("aac", G)
		}
	}, function(G) {
		if (G == "init" || G == "_onLoad") {
			return
		}
		if (!this.flashObject && this.flashReady) {
			switch (G) {
			case "getMute":
				return false;
			case "getTotalTime":
			case "getCurrentPosition":
			case "getLoadedPercent":
				return 0;
			case "getVolume":
				return 50;
			case "getState":
				return -1;
			case "getCurrentPositionString":
			case "getTotalTimeString":
				return "00:00"
			}
		} else {
			if (!this.flashReady) {
				return false
			}
		}
	});
	f.aac = new f.aac( {
		swfPath : "flash/aac.swf",
		flashVersionRequire : "10.0.0",
		versionErrorMessage : d[3],
		loadFailMessage : d[4]
	});
	A(g, "beforeunload", function(G) {
		f.wmp.unload = true
	});
	if (!g.baidu) {
		g.baidu = {}
	}
	g.baidu.m3 = f
})(window);
M3.playerRuleController = M3.Class(function(a) {
	a = a || {};
	this.player = a.playEngine;
	this.rules = [];
	this.isBlock = a.isBlock || false
}, {
	addRule : function(b) {
		this.rules.push(b);
		var c = b.getListener();
		for ( var a in c) {
			var d = function(h) {
				var e = b, f = h, g = c[a];
				return function() {
					if (!f.isBlock) {
						return g.apply(e, arguments)
					}
				}
			}(this);
			if (a != "playstatechange") {
				this.player.on(a, d, true)
			} else {
				this.player.setStateChangeCallBack(d)
			}
		}
	},
	getRulesCount : function() {
		return this.rules.length
	},
	getRules : function() {
		return this.rules
	},
	reset : function(b) {
		if (b) {
			for ( var c = 0, a = this.rules.length; c < a; c++) {
				if (this.rules[c].getName() == b) {
					this.rules[c].getTimer().reset()
				}
			}
		} else {
			for ( var c = 0, a = this.rules.length; c < a; c++) {
				this.rules[c].getTimer().reset()
			}
		}
	},
	blockListen : function() {
		this.isBlock = true
	},
	resetListen : function() {
		this.isBlock = false
	},
	getBlockState : function() {
		return this.isBlock
	}
});
M3.playerRuleController = new M3.playerRuleController( {
	playEngine : baidu.m3
});
M3.ruleModel = M3.Class(function(a) {
	a = a || {};
	this._name = a.name || "";
	this._timer = a.timer || null;
	this._stateListener = a.stateListener || {};
	this._msg = "";
	var b = typeof a.handler == "function" ? a.handler : function() {
	};
	this._handlerList = [ b ]
}, {
	init : function() {
		if (this._timer) {
			this._timer.addEventListener("timer", this.getHandler());
			return this
		}
	},
	getName : function() {
		return this._name
	},
	getListener : function() {
		return this._stateListener
	},
	setListener : function(a) {
		this._stateListener = a
	},
	getHandler : function() {
		var a = this;
		return function() {
			a.execHandler()
		}
	},
	addHandler : function(a) {
		if (typeof a == "function") {
			this._handlerList.push(a)
		}
	},
	setTimer : function(a) {
		this._timer = a
	},
	getTimer : function() {
		return this._timer
	},
	execHandler : function() {
		for ( var b = 0, a = this._handlerList.length; b < a; b++) {
			var c = this._handlerList[b];
			c.call(this)
		}
	}
});
var rule_1 = new M3.ruleModel( {
	name : "prebuffer",
	timer : new M3.Timer((PLAYRULES.PREBUFTIME || 10) * 1000, 1),
	stateListener : {
		setUrl : function() {
			this.getTimer().reset()
		},
		playstatechange : function(b, a) {
			if (b == "pre-buffer") {
				this.getTimer().start()
			} else {
				this.getTimer().reset()
			}
		}
	}
});
var rule_2 = new M3.ruleModel( {
	name : "firstBuffer",
	timer : new M3.Timer((PLAYRULES.BUFTIME || 10) * 1000, 1),
	stateListener : {
		setUrl : function() {
			this.getTimer().reset()
		},
		playstatechange : function(b, a) {
			if (b == "buffering") {
				if (a == "ready" || a == "pre-buffer") {
					this.getTimer().start()
				}
			} else {
				this.getTimer().reset()
			}
		}
	}
});
var rule_3 = new M3.ruleModel( {
	name : "buffer",
	timer : new M3.Timer((PLAYRULES.MULTBUFTIME || 20) * 1000, 1),
	stateListener : {
		setUrl : function() {
			this.startRecord = true;
			this.getTimer().reset()
		},
		playstatechange : function(b, a) {
			if (this.startRecord) {
				if (b == "buffering") {
					if (a == "play") {
						this.getTimer().start()
					}
				} else {
					if (b == "play" || b == "pause") {
						if (a == "buffering") {
							this.getTimer().pause()
						}
					} else {
						if (b == "end" || b == "ready") {
							this.getTimer().reset();
							this.startRecord = false
						}
					}
				}
			}
		}
	},
	handler : function() {
		this.startRecord = false
	}
});
var rule_4 = new M3.ruleModel( {
	name : "exception",
	timer : new M3.Timer((PLAYRULES.ERRTIME || 1) * 1000, 1),
	stateListener : {
		setUrl : function() {
			this.startRecord = true;
			this.getTimer().reset()
		},
		playstatechange : function(b, a) {
			if (this.startRecord) {
				if (b == "ready") {
					if (a == "play" || a == "pre-buffer") {
						this.getTimer().start()
					}
				} else {
					this.getTimer().reset()
				}
			}
		}
	},
	handler : function() {
		this.startRecord = false
	}
});
var rule_5 = new M3.ruleModel( {
	name : "savelink",
	timer : new M3.Timer((PLAYRULES.SAVETIME || 60) * 1000, 1),
	stateListener : {
		setUrl : function() {
			this.startRecord = true;
			this.getTimer().reset()
		},
		playstatechange : function(b, a) {
			if (this.startRecord) {
				if (b == "play") {
					this.getTimer().start()
				} else {
					if (b == "pause") {
						if (a == "play") {
							this.getTimer().pause()
						}
					} else {
						this.getTimer().reset()
					}
				}
			}
		}
	},
	handler : function() {
		this.startRecord = false
	}
});
var rule_6 = new M3.ruleModel( {
	name : "playsong",
	timer : new M3.Timer(0, 1),
	stateListener : {
		setUrl : function() {
			this.startRecord = true;
			this.getTimer().reset()
		},
		playstatechange : function(b, a) {
			if (this.startRecord) {
				if ((b == "play" && a == "pre-buffer")
						|| (b == "play" && a == "buffering")) {
					this.getTimer().start()
				}
			}
		}
	},
	handler : function() {
		this.startRecord = false
	}
});
var rule_7 = new M3.ruleModel( {
	name : "playsong100ms",
	timer : new M3.Timer(100, 1),
	stateListener : {
		setUrl : function() {
			this.startRecord = true;
			this.getTimer().reset()
		},
		playstatechange : function(b, a) {
			if (this.startRecord) {
				if (b == "play") {
					this.getTimer().start()
				} else {
					this.getTimer().reset()
				}
			}
		}
	},
	handler : function() {
		this.startRecord = false
	}
});