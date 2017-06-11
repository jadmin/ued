(function() {
	var i = ".", j = " ", b = "";
	window.selectItem = function(s) {
		try {
			var q = document.getElementById(s);
			if (q) {
				q.className = q.className + j + "i-selected"
			}
		} catch (r) {
		}
	};
	var n = function() {
		var s = arguments[1] || location.hostname;
		var r = s.split("."), e = r.length;
		var q = arguments[0] || (e < 3 ? 0 : 1);
		if (q >= e || e - q < 2) {
			q = e - 2
		}
		return r.slice(q).join(".")
	};
	try {
		if (document.getElementById("J_ITouchDomain")) {
			document.domain = n(2)
		}
	} catch (h) {
	}
	if ("undefined" === typeof KISSY) {
		return
	}
	var l = (function() {
		var t = "http://a.tbcdn.cn/apps/tbskip/public/flashStorage.swf?t=20110224", u = null;
		var s = function(v, x) {
			var w = this;
			if (x === undefined) {
				x = 200
			}
			if (x === 0) {
				return false
			}
			try {
				return u.read(v)
			} catch (y) {
				setTimeout(function() {
					w.read(v, x - 1)
				}, 0)
			}
		};
		var r = function(w, v, y) {
			var x = this, A;
			if (y === undefined) {
				y = 200
			}
			if (y === 0) {
				v.onFailure();
				return false
			}
			try {
				A = u.read(w);
				v.onSuccess(A)
			} catch (z) {
				setTimeout(function() {
					x.readWithCB(w, v, y - 1)
				}, 0)
			}
		};
		var q = function(v, y, x) {
			var w = this;
			if (x === undefined) {
				x = 200
			}
			if (x === 0) {
				return false
			}
			try {
				u.save(v, y)
			} catch (z) {
				setTimeout(function() {
					w.save(v, y, x - 1)
				}, 0)
			}
		};
		var e = function(w) {
			var x = document, v = x.createElement("div"), y = "";
			y += '<object id="J_FlashStorageObj" name="J_FlashStorageObj" ';
			y += 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="1" height="1" ';
			y += 'codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">';
			y += '<param name="movie" value="' + t + '" />';
			y += '<param name="allowScriptAccess" value="always" />';
			y += '<embed name="J_FlashStorageEmbed" src="' + t
					+ '" width="1" height="1" ';
			y += 'allowScriptAccess="always" type="application/x-shockwave-flash" ';
			y += 'pluginspage="http://www.adobe.com/go/getflashplayer">';
			y += "</embed></object>";
			w = w || x.body;
			w.appendChild(v);
			v.innerHTML = y;
			if (navigator.appVersion.indexOf("MSIE") !== -1) {
				v.style.zoom = 1;
				v.style.filter = "alpha(opacity=" + 10 + ")";
				u = window.J_FlashStorageObj
			} else {
				v.style.opacity = 0.1;
				u = x.J_FlashStorageEmbed
			}
		};
		return {
			init : function(v) {
				v = v || {};
				e(v.appendTo)
			},
			read : s,
			readWithCB : r,
			save : q
		}
	})();
	var f = "hidden", k = location.hostname.indexOf("taobao.net") !== -1, o = k ? "yingyong.daily.taobao.net"
			: "yingyong.taobao.com", m = "http://" + o
			+ "/json/menu/recent_apps.htm", c = "i-collapser-closed", a = '<span class="i-indicator"></span>', d = KISSY, p = d.DOM, g = d.Event;
	d.ready(function() {
				var s = p.get("#i-nav-menu"), q = null, e = true;
				if (!s) {
					return false;
				}
				var r = function(t) {
					return t.innerHTML.indexOf("\u6211\u7684\u4ea4\u6613") > 0;
				};
				e && l.init();
				(function() {
					p.query(".J_ICollapser", s)
							.each(
									function(v) {
										var u = p.next(v), t = p.create(a);
										p.prepend(t, v);
										g.on(
														v,
														"click",
														function(w) {
															var x = w.target;
															if (x.nodeName
																	.toUpperCase() !== "A") {
																p.toggleClass(
																		u, f);
																p.toggleClass(
																		v, c);
																if (r(v) && e) {
																	l
																			.save(
																					"tradeMenuClosed",
																					p
																							.hasClass(
																									v,
																									c) ? "true"
																							: "false")
																}
															}
														});
										if (q === null && e) {
											if (r(v)) {
												q = v;
												d.later(
																function() {
																	if (l.read("tradeMenuClosed") === "true") {
																		p.addClass(u, f);
																		p.addClass(q, c)
																	}
																}, 500)
											}
										}
									})
				})();
				(function() {
					var v = {
						J_APPLIST : "#J_IAppList"
					}, u = p.get(v.J_APPLIST);
					if (!u) {
						return
					}
					var t = {
						success : function() {
							var x = window._i_recents;
							if (!d.isPlainObject(x)) {
								return t.error()
							}
							var z = x.apps["list"], B = x.apps["size"];
							if (!z.length) {
								return t.error()
							}
							var C = document.createDocumentFragment(), w = '<li><a target="{target}" href="{url}" data-static="{data}"><span class="{className}" data-static="{data}">{name}</span></a></li>', A = w
									.replace(
											"<li><a",
											'<li style="background:url({icon}) no-repeat 5px 6px;"><a style="text-indent:24px;background:none;"');
							for ( var y = Math.min(B, z.length); y > 0; y--) {
								var D = z[y - 1];
								D = p.create(d.substitute(D.icon ? A : w, D));
								p.prepend(D, C)
							}
							p.prepend(C, u);
							C = null
						},
						error : function() {
							var w = function(y, x) {
								p.css(y, "background", "url("
										+ p.attr(y, "icon") + ") no-repeat "
										+ (x ? "5px" : "16px") + " 6px");
								p.css(y.getElementsByTagName("a")[0], {
									textIndent : x ? "24px" : "34px",
									background : "none"
								});
								p.removeClass(y, "i-hidden");
								p.removeAttr(y, "icon")
							};
							d.each(p.query(v.J_APPLIST + " li.i-hidden"),
									function(x) {
										w(x, true)
									})
						},
						charset : "gbk",
						timeout : 10
					};
					d.getScript(m, t)
				})()
			});
	d.ready(function() {
				var e = {
					"\u6211\u7684\u9996\u9875" : "hp",
					"\u5173\u6ce8" : "fw",
					"\u597d\u53cb" : "fd",
					"\u627e\u4eba" : "ffw",
					"\u627e\u5173\u6ce8" : "ffd",
					flash : "flash",
					"\u8bd5\u7528\u65b0\u7248" : "new",
					"\u8fd4\u56de\u65e7\u7248" : "old",
					"\u7535\u5f71\u7968\u5728\u7ebf\u8ba2\u8d2d" : "ticket",
					"\u5065\u5eb7\u52a9\u624b" : "health",
					"\u80b2\u513f\u4e2d\u5fc3" : "baby",
					"\u7f8e\u98df\u76d2\u5b50" : "food",
					"\u65e5\u5fd7" : "log",
					"\u76f8\u518c" : "photo",
					"\u8f6c\u5e16" : "zt",
					"\u53fd\u6b6a" : "jy",
					"\u6295\u7968" : "tp",
					"\u597d\u53cb\u5370\u8c61" : "hyyx",
					"\u793c\u7269" : "lw",
					"\u6dd8\u5e2e\u6d3e" : "tbp",
					"\u5e2e\u6211\u6311" : "bwt",
					"\u6253\u542c" : "dt",
					"\u6dd8\u91d1\u5e01" : "tjb",
					"\u5b9d\u8d1d\u5206\u4eab" : "bbfx",
					"\u6dd8\u5b9d\u8fbe\u4eba" : "tbdr",
					"\u805a\u5212\u7b97" : "jhs",
					"\u5f00\u5fc3\u53a8\u623f" : "kxcf",
					"\u5fb7\u514b\u8428\u65af\u6251\u514b" : "zzpk",
					"\u5c0f\u6e38\u620f\u4e2d\u5fc3" : "gc",
					"\u5feb\u4e50\u5c9b\u4e3b" : "kldz",
					"\u697c\u4e00\u5e62" : "lyz",
					"\u9633\u5149\u7267\u573a" : "ygmc",
					"\u68a6\u60f3\u82b1\u56ed" : "mxhy",
					"\u5b9d\u8d1d\u661f\u7403" : "bbxq",
					"\u5c0f\u5c0f\u6218\u4e89" : "xxzz",
					"\u5feb\u4e50\u63a2\u5b9d" : "kltb",
					"\u5c0f\u5c0f\u591c\u5e97" : "xxyd",
					"\u8054\u4f17\u68cb\u724c" : "lzqp",
					"\u679c\u679c\u5e2e" : "ggb",
					"\u6211\u662f\u4e70\u5bb6" : "buyer",
					"\u6211\u662f\u5356\u5bb6" : "seller",
					"\u8d26\u53f7\u7ba1\u7406" : "account",
					"\u5e94\u7528\u4e2d\u5fc3" : "app",
					"\u6211\u7684\u8d2d\u7269\u8f66" : "cart",
					"\u5df2\u4e70\u5230\u7684\u5b9d\u8d1d" : "buyauc",
					"\u7ade\u62cd\u7684\u5b9d\u8d1d" : "paauc",
					"\u6211\u7684\u673a\u7968/\u9152\u5e97/\u4fdd\u9669" : "airticket",
					"\u6211\u7684\u5f69\u7968" : "lottery",
					"\u6211\u7684\u7f51\u6e38" : "mom",
					"\u8d2d\u4e70\u8fc7\u7684\u5e97\u94fa" : "buyshop",
					"\u6211\u7684\u6536\u85cf" : "collect",
					"\u6211\u7684\u79ef\u5206" : "ponit",
					"\u6211\u7684\u4f18\u60e0\u5361\u5238" : "card",
					"\u6211\u7684\u4fe1\u7528\u7ba1\u7406" : "credit",
					"\u9000\u6b3e\u7ba1\u7406" : "refund",
					"\u7ef4\u6743\u7ba1\u7406" : "weiquan",
					"\u4e3e\u62a5\u7ba1\u7406" : "jubao",
					"\u54a8\u8be2/\u56de\u590d" : "zixun",
					"\u6211\u8981\u4ed8\u6b3e" : "alipay",
					"\u6c34\u7535\u7164\u7f34\u8d39" : "sdm",
					"\u4fe1\u7528\u5361\u8fd8\u6b3e" : "ccard",
					"\u7f16\u8f91\u5934\u50cf" : "bjtx",
					"\u4e2a\u4eba\u8d44\u6599" : "grzl",
					"\u9690\u79c1\u8bbe\u7f6e" : "yssz",
					"\u4e2a\u4eba\u4e3b\u9875" : "grzy",
					"\u4fe1\u7528\u7ba1\u7406" : "xygl",
					"\u6211\u7684\u652f\u4ed8\u5b9d" : "zfb",
					vip : "vip",
					"\u7279\u6743" : "tq",
					"\u9886\u53d6\u5f53\u65e5\u6dd8\u91d1\u5e01" : "lqtjb",
					"\u79ef\u5206" : "jf",
					"\u5e97\u94fa\u4f18\u60e0\u5238" : "dpyhq",
					"\u5f85\u4ed8\u6b3e" : "dfk",
					"\u5f85\u786e\u8ba4\u6536\u8d27" : "dqrsh",
					"\u5f85\u8bc4\u4ef7" : "dpj",
					"\u63a8\u8350\u5e94\u7528" : "recommend",
					"\u6dd8\u5b9d\u65b0\u9c9c\u4e8b" : "news"
				};
				g.on(
								document,
								"click",
								function(r) {
									var t = r.target, s = "", q;
									if ("A" === t.nodeName.toUpperCase()
											|| (t.parentNode && "A" === t.parentNode.nodeName
													.toUpperCase())) {
										if (t.nodeName.toUpperCase() !== "A") {
											t = t.parentNode
										}
										if (p.attr(t, "data-analytics-key")) {
											s = p.attr(t, "data-analytics-key")
										} else {
											s = d.trim(p.html(t))
										}
										s = s
												.replace(
														/<\/?[a-z][a-z0-9]*[^<>]*>|\(|\)|\d+|^\s+|\s+$/gi,
														"");
										q = e[s];
										if (q) {
											(new Image()).src = "http://www.atpanel.com/jsclick?mytaobao_sns="
													+ q + "&cache=" + d.guid()
										}
									}
								});
				g.on(
								document,
								"click",
								function(s) {
									var t = s.target, r = t
											.getAttribute("data-static"), q = (r || "a" === t.nodeName
											.toLowerCase()) ? t : KISSY.DOM
											.parent(t, "a");
									if (q) {
										r = q.getAttribute("data-static");
										if (r) {
											new Image().src = "http://www.atpanel.com/tbapp."
													+ r
													+ "?url="
													+ encodeURI(location.href
															.replace(
																	location.hash,
																	""))
													+ "&t="
													+ new Date().getTime()
										}
										if (q.className.toLowerCase() === "mytaodan") {
											new Image().src = " http://www.atpanel.com/sns.2.7.2?tracelog=mytaobaomytaodan&cache="
													+ new Date().getTime()
										}
									}
								})
			})
})();
(function(b, c, a) {
	b.ready(function() {
				var k = c.get("#mytb-nav"), e = c.get(".left", k), m = c
						.children(e), j = "hide", i = "hover", h = "arrowhover", l = "nonebg", d = null, f = function() {
					if (d && d.cancel) {
						d.cancel()
					}
				}, g = function() {
					d = b.later(function() {
						c.addClass(menu, j);
						c.removeClass(arrow, h)
					}, 500, false)
				};
				a.on(m, "mouseover", function(p) {
					var o = c.next(this), n = c.children(o, "a");
					if (n == null) {
						return
					}
					c.addClass(n, l)
				});
				a.on(m, "mouseout", function(p) {
					var o = c.next(this), n = c.children(o, "a");
					if (n == null) {
						return
					}
					c.removeClass(n, l)
				})
			})
})(KISSY, KISSY.DOM, KISSY.Event);