var ting = ting || {};
(function() {
	var webHost = window.location.href.replace(
			/(http:\/\/[^\/\\]+)([\/\\].*)/g, "$1");
	var webHostPath = webHost, passJumpPath = webHostPath
			+ "/static/html/pass_jump.html", passAPIPath = "http://passport.baidu.com/v2/api/?getapi&class=ACTION&tpl=ti&tangram=true", passSendRegEmailPath = "https://passport.baidu.com/v2/?regmailsend&tpl=ti&callback=resetEmailCallback", passGetEmailProviderPath = "https://passport.baidu.com/v2/?regmailsvr&callback=getProviderCalback", passChangeRegEmailPath = "https://passport.baidu.com/v2/?regmailchange", regnotifyPath = "/regnotify", regverifyPath = "http://"
			+ window.location.host + "/regverify", activateGetPath = "/activate", activatePostPath = "/data/user/activate", guidePath = "/guide", userInfoPath = "/data/user/info", cssPath = "/static/css/passport/popup_account.css";
	var _NAME_ATTRS = (function() {
		var result = {
			cellpadding : "cellPadding",
			cellspacing : "cellSpacing",
			colspan : "colSpan",
			rowspan : "rowSpan",
			valign : "vAlign",
			usemap : "useMap",
			frameborder : "frameBorder"
		};
		var ua = navigator.userAgent, match = /(msie) ([\w.]+)/.exec(ua
				.toLowerCase()), documentMode = document.documentMode
				|| +RegExp["\x241"];
		if (documentMode < 8 || (match && match[1] && parseInt(match[2]) < 8)) {
			result["for"] = "htmlFor";
			result["class"] = "className"
		} else {
			result.htmlFor = "for";
			result.className = "class"
		}
		return result
	}());
	var g = function(id) {
		if ("string" == typeof id || id instanceof String) {
			return document.getElementById(id)
		} else {
			if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
				return id
			}
		}
		return null
	};
	var escapeReg = function(source) {
		return String(source).replace(
				new RegExp("([.*+?^=!:\x24{}()|[\\]/\\\\])", "g"), "\\\x241")
	};
	var setAttr = function(element, key, value) {
		element = g(element);
		if ("style" == key) {
			element.style.cssText = value
		} else {
			key = _NAME_ATTRS[key] || key;
			element.setAttribute(key, value)
		}
		return element
	};
	var setAttrs = function(element, attributes) {
		var key;
		element = g(element);
		for (key in attributes) {
			if (attributes.hasOwnProperty(key)) {
				setAttr(element, key, attributes[key])
			}
		}
		return element
	};
	var removeClass = function(element, className) {
		element = g(element);
		var oldClasses = element.className.split(/\s+/), newClasses = className
				.split(/\s+/), lenOld, lenDel = newClasses.length, j, i = 0;
		for (; i < lenDel; ++i) {
			for (j = 0, lenOld = oldClasses.length; j < lenOld; ++j) {
				if (oldClasses[j] == newClasses[i]) {
					oldClasses.splice(j, 1);
					break
				}
			}
		}
		element.className = oldClasses.join(" ");
		return element
	};
	var addClass = function(element, className) {
		element = g(element);
		var classArray = className.split(/\s+/), result = element.className, classMatch = " "
				+ result + " ", i = 0, l = classArray.length;
		for (; i < l; i++) {
			if (classMatch.indexOf(" " + classArray[i] + " ") < 0) {
				result += (result ? " " : "") + classArray[i]
			}
		}
		element.className = result;
		return element
	};
	var createDOM = function(tagName, opt_attributes) {
		var el = document.createElement(tagName), attributes = opt_attributes
				|| {};
		return setAttrs(el, attributes)
	};
	var q = function(className, element, tagName) {
		var result = [], trim = function(source) {
			var trimer = new RegExp(
					"(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
			return String(source).replace(trimer, "")
		}, len, i, elements, node;
		if (!(className = trim(className))) {
			return result
		}
		if ("undefined" == typeof element) {
			element = document
		} else {
			element = g(element);
			if (!element) {
				return result
			}
		}
		if (tagName) {
			tagName = trim(tagName).toUpperCase()
		}
		if (element.getElementsByClassName) {
			elements = element.getElementsByClassName(className);
			len = elements.length;
			for (i = 0; i < len; i++) {
				node = elements[i];
				if (tagName && node.tagName != tagName) {
					continue
				}
				result[result.length] = node
			}
		} else {
			className = new RegExp("(^|\\s)" + escapeReg(className)
					+ "(\\s|\x24)");
			elements = tagName ? element.getElementsByTagName(tagName)
					: (element.all || element.getElementsByTagName("*"));
			len = elements.length;
			for (i = 0; i < len; i++) {
				node = elements[i];
				if (className.test(node.className)) {
					result[result.length] = node
				}
			}
		}
		return result
	};
	var isString = function(a) {
		return (typeof a === "object" && a && a.constructor === String)
				|| typeof a === "string"
	};
	var parseQuery = function(j, n) {
		if (n) {
			var l = new RegExp("(^|&|\\?|#)" + escapeReg(n)
					+ "=([^&]*)(&|\x24)", ""), k = j.match(l);
			if (k) {
				return k[2]
			}
		} else {
			if (j) {
				j = j.substr(j.indexOf("?") + 1, j.length);
				var g = j.split("&");
				var h = {}, e = [], d, c, m, f;
				for (f = 0; f < g.length; f++) {
					d = g[f].split("=");
					c = d[0];
					m = d[1];
					if (c === "") {
						continue
					}
					if (typeof h[c] === "undefined") {
						h[c] = m
					} else {
						if (isString(h[c])) {
							continue
						} else {
							h[c].push(m)
						}
					}
				}
				return h
			}
		}
		return null
	};
	var q1 = function(className, element, tagName) {
		var list = q(className, element, tagName);
		if (list && list[0]) {
			return list[0]
		}
		return null
	};
	var addEvent = function(dom, eventName, handler) {
		if (document.attachEvent) {
			dom.attachEvent("on" + eventName, handler)
		} else {
			if (document.addEventListener) {
				dom.addEventListener(eventName, handler, false)
			}
		}
	};
	var sioGet = function(d, a) {
		var g, f, c, b, e;
		if (!d || !isString(d)) {
			return null
		}
		g = parseQuery(d, "callback");
		f = document.createElement("SCRIPT");
		if (!g) {
			c = false;
			f.onreadystatechange = f.onload = function() {
				if (c) {
					return false
				}
				if (typeof f.readyState === "undefined"
						|| f.readyState === "loaded"
						|| f.readyState === "complete") {
					c = true;
					try {
						a()
					} finally {
						if (f && f.parentNode) {
							f.parentNode.removeChild(f)
						}
						f.onreadystatechange = null;
						f.onload = null;
						f = null
					}
				}
			}
		} else {
			b = "CB" + Math.floor(Math.random() * 2147483648).toString(36);
			d = d.replace(/(&|\?)callback=([^&]*)/, "\x241callback=" + b);
			window[b] = function() {
				try {
					var h = (a || window[g]);
					h.apply(null, arguments)
				} finally {
					if (f && f.parentNode) {
						f.parentNode.removeChild(f)
					}
					f = null;
					window[b] = null
				}
			}
		}
		f.src = d;
		f.type = "text/javascript";
		f.charset = "gb2312";
		e = document.getElementsByTagName("HEAD")[0];
		e.insertBefore(f, e.firstChild)
	};
	var pixelize = function(str) {
		return str + "px"
	};
	var ajax = {
		getXHR : function() {
			if (window.ActiveXObject) {
				try {
					return new ActiveXObject("Msxml2.XMLHTTP")
				} catch (e) {
					try {
						return new ActiveXObject("Microsoft.XMLHTTP")
					} catch (f) {
					}
				}
			}
			if (window.XMLHttpRequest) {
				return new XMLHttpRequest()
			}
		},
		get : function(path, callback) {
			var httpRequest = this.getXHR();
			httpRequest.onreadystatechange = function() {
				if (httpRequest.readyState === 4 && httpRequest.status === 200) {
					callback(httpRequest.responseText)
				}
			};
			httpRequest.open("GET", path);
			httpRequest.send(null)
		},
		post : function(path, value, callback) {
			var httpRequest = this.getXHR();
			httpRequest.onreadystatechange = function() {
				if (httpRequest.readyState === 4 && httpRequest.status === 200) {
					callback(httpRequest.responseText)
				}
			};
			httpRequest.open("POST", path);
			httpRequest.setRequestHeader("Content-Type",
					"application/x-www-form-urlencoded");
			httpRequest.send(value)
		}
	};
	var countString = function(str) {
		return String(str).replace(/[^\x00-\xff]/g, "mz").length
	};
	var appendStyle = function(text) {
		var style;
		if (document.createStyleSheet) {
			style = document.createStyleSheet();
			style.cssText = text
		} else {
			style = document.createElement("style");
			style.type = "text/css";
			style.appendChild(document.createTextNode(text));
			document.getElementsByTagName("head")[0].appendChild(style)
		}
	};
	var nickNameCheck = {
		init : function(inputElem, tipElem, errElem) {
			this.inputElem = inputElem;
			this.tipElem = tipElem;
			this.errElem = errElem;
			if (inputElem) {
				inputElem.onblur = (function(obj) {
					return function() {
						obj.check()
					}
				}(this))
			}
		},
		check : function() {
			var nick, value;
			if (!this.inputElem) {
				return ting.userInfo.bdName
			}
			nick = this.inputElem.value;
			value = nick.replace(/\s+$|^\s+/g, "");
			if (countString(value) > 24 || !value) {
				this.errElem.style.display = "inline";
				this.tipElem.style.display = "none";
				if (!value) {
					this.errElem.innerHTML = "请填写昵称"
				} else {
					this.errElem.innerHTML = "不超过12个字"
				}
				return false
			} else {
				this.errElem.style.display = "none";
				this.tipElem.style.display = "inline";
				return value
			}
		}
	};
	var refreshUserBar = function() {
		try {
			if (jQuery !== undefined) {
				$.ting.refreshTrigger.refresh($(".user-bar"), "/ajax/user_bar")
			}
		} catch (e) {
		}
	};
	var setLoginedCookie = function() {
		try {
			if (jQuery !== undefined) {
				jQuery.cookie("u_lo", "1", {
					path : "/",
					expires : 30
				});
				jQuery.cookie("u_id", ting.userInfo.userId, {
					path : "/",
					expires : 30
				});
				jQuery.cookie("u_t", ting.userInfo.userType, {
					path : "/",
					expires : 30
				})
			}
		} catch (e) {
		}
	};
	var log = function(action, params) {
		var logUrlPrefix = "/static/images/v.gif?pid=304&url=&v=1.0.0", paramUrl = "&type="
				+ encodeURIComponent(action), imgId = "ting_"
				+ Math.round(Math.random() * 100000) + (new Date()).getTime(), img = window[imgId] = new Image(
				1, 1), logUrl, key;
		for (key in params) {
			if (params.hasOwnProperty(key)) {
				paramUrl += "&" + encodeURIComponent(key) + "="
						+ encodeURIComponent(params[key])
			}
		}
		logUrl = logUrlPrefix + paramUrl;
		img.onload = img.onerror = function() {
			window[imgId] = null
		};
		img.src = logUrl;
		img = null
	};
	var getUrlFrom = function() {
		var curl = window.location.pathname, searchList = window.location.search
				.substr(1).split("&"), pcRegisterReg = /^\/register\/pc\b/, fromReg = /^from=/, foundFrom, i, len, from;
		if (pcRegisterReg.test(curl)) {
			return "pc"
		}
		foundFrom = false;
		for (i = 0, len = searchList.length; i < len; i += 1) {
			if (fromReg.test(searchList[i])) {
				foundFrom = i
			}
		}
		if (foundFrom !== false) {
			return searchList[foundFrom].replace(fromReg, "")
		}
		return null
	};
	var popupLog = function(action) {
		if (ting.passport.lastOptions && ting.passport.lastOptions.isPopup) {
			var actionTypeList = {
				login : "popup_login",
				activate : "popup_activate",
				register : "popup_register"
			}, type = actionTypeList[action], opt = ting.passport.lastOptions
					|| {}, ref = opt.ref || "", param, userInfo;
			userInfo = ting.userInfo || {};
			if (ref.length > 0) {
				param = {
					ref : ref,
					username : userInfo.userName || "",
					ting_uid : userInfo.userId || "",
					u_id : userInfo.userId || "",
					u_lo : userInfo.userId ? 1 : 0,
					u_t : userInfo.userType || 0
				};
				log(type, param)
			}
		}
	};
	var popup = {
		ele : null,
		mask : null,
		boxSize : null,
		init : function(dom, boxSize) {
			this.boxSize = boxSize || {
				width : 500,
				height : 300
			};
			this.ele = this.getElement(dom);
			this.mask = this.mask || this.createMask()
		},
		getElement : function(dom) {
			var boxSize = this.boxSize;
			return {
				dom : dom,
				show : function() {
					var pos = popup.position(boxSize.width, boxSize.height), dom = this.dom;
					dom.style.width = pixelize(boxSize.width);
					dom.style.top = pixelize(pos.top);
					dom.style.left = pixelize(pos.left);
					dom.style.display = "block"
				},
				hide : function() {
					this.dom.style.display = "none"
				}
			}
		},
		createMask : function() {
			var doc = document, body = doc.body, html = doc.documentElement, client = doc.compatMode === "BackCompat" ? body
					: doc.documentElement, layer = doc.createElement("div");
			body.insertBefore(layer, body.childNodes[0]);
			layer.style.display = "none";
			layer.className = "account-mask";
			return {
				layer : layer,
				show : function() {
					var height = Math.max(html.scrollHeight, body.scrollHeight,
							client.clientHeight), width = Math.max(
							html.scrollWidth, body.scrollWidth,
							client.clientWidth), layer = this.layer;
					layer.style.width = pixelize(width);
					layer.style.height = pixelize(height);
					popup.animateShow(layer)
				},
				hide : function() {
					this.layer.style.display = "none"
				}
			}
		},
		show : function() {
			if (this.ele) {
				this.ele.show()
			}
			if (this.mask) {
				this.mask.show()
			}
		},
		hide : function() {
			if (this.ele) {
				this.ele.hide()
			}
			if (this.mask) {
				this.mask.hide()
			}
		},
		position : function(width, height) {
			var doc = document, client = doc.compatMode === "BackCompat" ? doc.body
					: doc.documentElement, left = (client.clientWidth - width) / 2, top = (client.clientHeight - height) / 2;
			left += window.pageXOffset || doc.documentElement.scrollLeft
					|| doc.body.scrollLeft;
			top += window.pageYOffset || doc.documentElement.scrollTop
					|| doc.body.scrollTop;
			top = top < 0 ? 5 : top;
			return {
				top : top,
				left : left
			}
		},
		animateShow : function animateShow(element) {
			var className = element.className, i = 0, showing;
			element.className = className + " account-ts0";
			element.style.display = "block";
			showing = setInterval(function() {
				i += 1;
				if (i === 4) {
					clearInterval(showing)
				}
				element.className = className + " account-ts" + i
			}, 30)
		}
	};
	var Render = function(father) {
		Render.prototype.init.call(this, father)
	};
	var rp = Render.prototype;
	rp.init = function(father) {
		var key;
		if (!father) {
			return
		}
		for (key in father) {
			if (father.hasOwnProperty(key)) {
				this[key] = father[key]
			}
		}
	};
	rp.render = function() {
		var dom;
		if (this.base && this.base.render) {
			dom = this.base.render()
		}
		return this.myRender(dom)
	};
	rp.getBoxSize = function() {
		if (this.boxSize) {
			return this.boxSize
		} else {
			if (this.base && this.base.getBoxSize) {
				return this.base.getBoxSize()
			}
		}
		return null
	};
	rp.all = function(name) {
		var stack = [], base = this;
		while (base) {
			if (base[name]) {
				stack.push(base[name])
			}
			base = base.base
		}
		return stack
	};
	var NullRender = function(father) {
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			return curDOM
		}
	};
	NullRender.prototype = new Render();
	var PopupRender = function(father) {
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			var dom = q1("account-popup-holder") || createDOM("div", {
				className : "account-popup-holder"
			}), closeBtn;
			dom.innerHTML = [ '<div class="account-ptitle">',
					'    <span class="account-ptitle-text"></span>',
					'    <a class="account-pclose" href="#" title="关闭窗口"></a>',
					"</div>", '<div class="account-pbody"></div>' ].join("");
			closeBtn = q1("account-pclose", dom);
			closeBtn.onclick = function() {
				var lc = ting.passport.lastCallback;
				lc.onClose();
				if (lc.onAbstractCancel) {
					lc.onAbstractCancel()
				}
				return false
			};
			return dom
		}
	};
	PopupRender.prototype = new Render();
	var PopupLoginRegisterRender = function(father) {
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom);
			pbody.innerHTML = [ '<div class="action-holder">',
					'	<div class="action-title-holder">',
					'        <span class="account-t2"></span>',
					'        <span class="action-title-tip"></span>',
					"    </div>", '	<div class="action-form"></div>', "</div>" ]
					.join("");
			return dom
		}
	};
	PopupLoginRegisterRender.prototype = new Render();
	var PopupActivateRender = function(father) {
		rp.init.call(this, father);
		this.boxSize = {
			width : 630,
			height : 340
		};
		this.myRender = function(curDOM) {
			var created = createDOM("div", {
				className : "account-pbody"
			}), dom = curDOM || created, pbody = q1("account-pbody", dom)
					|| created, titleText = q1("account-ptitle-text", dom), submitBtn, lc = ting.passport.lastCallback;
			addClass(pbody, "account-pbody-3");
			pbody.innerHTML = [
					'<div class="activate-title-holder">',
					'    <span class="account-t2">免费享受正版音乐无限量试听下载</span>',
					"</div>",
					'<div class="activate-mid-block">',
					'     <div style="font-size: 14px; color: #666;">先为自己起个昵称吧！</div>',
					'     <div class="activate-input">',
					'         <input id="activate_nickname" name="nickName" type="text" class="activate-input-text" />&nbsp;<span id="activate_valid"></span><span id="activate_desc"></span>',
					"     </div>",
					'     <div class="activate-statement">',
					'         <input type="checkbox" id="activate_statement" checked="checked" /><label for="activate_statement"> 我同意</label><a href="http://passport.baidu.com/protocal.html" target="_blank">《百度用户协议》</a>和<a href="/help/agreement.html" target="_blank">《ting!服务协议》</a>',
					"     </div>",
					'     <div class="info-image">',
					"     </div>",
					"</div>",
					'<div class="activate-btn pass_login_p_btn">',
					'    <button id="activate_btn" class="activate-submit"><span>开启我的 ting! 生活</span></button><span id="agree_valid"></span>',
					"</div>" ].join("");
			titleText.innerHTML = "激活ting";
			ting.passport.lastCallback.onAbstractCancel = function() {
				var lc = ting.passport.lastCallback;
				if (lc.onActivateCancel) {
					lc.onActivateCancel()
				}
				if (lc.onCancel) {
					lc.onCancel()
				}
			};
			return dom
		}
	};
	PopupActivateRender.prototype = new Render();
	var PopupSimpleActivateRender = function(father) {
		rp.init.call(this, father);
		this.boxSize = {
			width : 320,
			height : 205
		};
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom), titleText = q1(
					"account-ptitle-text", dom), lc = ting.passport.lastCallback;
			removeClass(pbody, "account-pbody-3");
			addClass(pbody, "account-pbody-3-simple");
			pbody.innerHTML = [
					'<div class="activate-welcome">',
					'   欢迎您, <span class="activate-bdname">'
							+ ting.userInfo.bdName + "</span>：",
					"</div>",
					'<div class="activate-title-holder">',
					'    <span class="account-t2">激活即可免费享受正版高品质音乐服务！</span>',
					"</div>",
					'<div class="activate-mid-block">',
					'     <div class="activate-statement">',
					'         <input type="checkbox" id="activate_statement" checked="checked" /><label for="activate_statement"> 我同意</label><a href="http://passport.baidu.com/protocal.html" target="_blank">《百度用户协议》</a>和<a href="/help/agreement.html" target="_blank">《ting!服务协议》</a>',
					"     </div>",
					"</div>",
					'<div class="activate-btn pass_login_p_btn">',
					'    <button id="activate_btn" class="activate-submit"><span>立即激活</span></button><span id="agree_valid"></span>',
					"</div>" ].join("");
			return dom
		}
	};
	PopupSimpleActivateRender.prototype = new Render();
	var PopupOperationSimpleActivateRender = function(father) {
		rp.init.call(this, father);
		this.boxSize = {
			width : 320,
			height : 205
		};
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom), titleText = q1(
					"account-ptitle-text", dom), welcomeText = q1(
					"activate-welcome", dom), wording = q1("account-t2", dom);
			removeClass(pbody, "account-pbody-3-simple");
			addClass(pbody, "account-pbody-3-simple-op");
			welcomeText.innerHTML = '<span class="activate-bdname">'
					+ ting.userInfo.bdName + "</span>，您好：";
			wording.innerHTML = "您的百度账号尚未激活ting服务。";
			return dom
		}
	};
	PopupOperationSimpleActivateRender.prototype = new Render();
	var PopupLoginRender = function(father) {
		rp.init.call(this, father);
		this.boxSize = {
			width : 660,
			height : 340
		};
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom), holder = q1(
					"action-holder", dom), holderTitle = q1(
					"action-title-holder", dom), holderTitleTip = q1(
					"action-title-tip", dom), holderTitleText = q1(
					"account-t2", dom), form = q1("action-form", dom), titleText = q1(
					"account-ptitle-text", dom), extra = createDOM("div", {
				className : "register-right-now"
			}), lc = ting.passport.lastCallback, curl = window.location.pathname, mboxAppReg = /^\/(player|app)\//, reglink = "/register", matches;
			matches = curl.match(mboxAppReg);
			if (matches && matches.length > 1) {
				reglink = [ reglink, "?from=", matches[1] ].join("")
			} else {
				if (lc && lc.isPopup) {
					reglink = [ reglink, "?from=",
							encodeURIComponent(window.location.href) ].join("")
				}
			}
			if (pbody) {
				addClass(pbody, "account-pbody-1")
			}
			if (holder) {
				addClass(holder, "login-holder")
			}
			if (holderTitle) {
				addClass(holderTitle, "login-title-holder")
			}
			if (holderTitleTip) {
				addClass(holderTitleTip, "login-title-tip")
			}
			holderTitleTip.innerHTML = "已有百度账号，请直接登录";
			titleText.innerHTML = "登录ting";
			if (form) {
				addClass(form, "login-form");
				form.id = "login_form"
			}
			extra.innerHTML = '<span class="register-right-now-text">没有账号？</span><a href="'
					+ reglink
					+ '" target="_blank" id="register-right-now-btn"  class="register-right-now-btn"></a>';
			if (pbody) {
				pbody.appendChild(extra)
			}
			ting.passport.lastCallback.onAbstractCancel = function() {
				var lc = ting.passport.lastCallback;
				if (lc.onLoginCancel) {
					lc.onLoginCancel()
				}
				if (lc.onCancel) {
					lc.onCancel()
				}
			};
			return dom
		}
	};
	PopupLoginRender.prototype = new Render();
	var PopupRegisterRender = function(father) {
		rp.init.call(this, father);
		this.boxSize = {
			width : 630,
			height : 560
		};
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom), holder = q1(
					"action-holder", dom), holderTitle = q1(
					"action-title-holder", dom), holderTitleTip = q1(
					"action-title-tip", dom), holderTitleText = q1(
					"account-t2", dom), titleText = q1("account-ptitle-text",
					dom), form = q1("action-form", dom), lc = ting.passport.lastCallback;
			if (pbody) {
				addClass(pbody, "account-pbody-2")
			}
			if (holder) {
				addClass(holder, "register-holder")
			}
			if (holderTitle) {
				addClass(holderTitle, "register-title-holder")
			}
			if (holderTitleTip) {
				addClass(holderTitleTip, "register-title-tip")
			}
			titleText.innerHTML = "注册";
			holderTitle.innerHTML = [
					'<div class="has-account">已有百度账号？<a class="direct-login-hook" href="javascript: void(0);">请直接登录 &gt;&gt;</a></div>',
					'<div class="popup-register-tip">以下均为必填项</div>',
					'<div class="reg-title-holder account-t1"></div>' ]
					.join("");
			q1("direct-login-hook", dom).onclick = function() {
				ting.passport.popup("login", ting.passport.lastCallback,
						ting.passport.lastOptions);
				return false
			};
			if (form) {
				addClass(form, "register-form");
				form.id = "register_form"
			}
			lc.onAbstractCancel = function() {
				var lc = ting.passport.lastCallback;
				if (lc.onRegisterCancel) {
					lc.onRegisterCancel()
				}
				if (lc.onCancel) {
					lc.onCancel()
				}
			};
			return dom
		}
	};
	PopupRegisterRender.prototype = new Render();
	var PopupMboxLoginRender = function(father) {
		rp.init.call(this, father);
		this.boxSize = {
			width : 470,
			height : 310
		};
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom);
			if (pbody) {
				removeClass(pbody, "account-pbody-1");
				addClass(pbody, "account-pbody-1-mbox")
			}
			return dom
		}
	};
	PopupMboxLoginRender.prototype = new Render();
	var PopupMboxActivateRender = function(father) {
		rp.init.call(this, father);
		this.boxSize = {
			width : 470,
			height : 300
		};
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom);
			if (pbody) {
				removeClass(pbody, "account-pbody-3");
				addClass(pbody, "account-pbody-3-mbox")
			}
			return dom
		}
	};
	PopupMboxActivateRender.prototype = new Render();
	var PopupMboxRegisterRender = function(father) {
		rp.init.call(this, father);
		this.boxSize = {
			width : 470,
			height : 420
		};
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom);
			if (pbody) {
				addClass(pbody, "account-pbody-2-mbox")
			}
			return dom
		}
	};
	PopupMboxRegisterRender.prototype = new Render();
	var PopupOperationLimitLoginRender = function(father) {
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom), className;
			if (!pbody) {
				return dom
			}
			className = pbody.className;
			if (className.indexOf("mbox") !== -1) {
				pbody.className = "account-pbody account-pbody-1-oplimit-mbox"
			} else {
				pbody.className = "account-pbody account-pbody-1-oplimit"
			}
			return dom
		};
		this.onReady = function(form) {
			var infoImage = createDOM("div", {
				className : "info-image"
			}), registerPanel = createDOM("div", {
				className : "register-panel"
			}), lc = ting.passport.lastOptions, curl = window.location.pathname, mboxAppReg = /^\/(player|app)\//, reglink = "/register", matches;
			matches = curl.match(mboxAppReg);
			if (matches && matches.length > 1) {
				reglink = [ reglink, "?from=", matches[1] ].join("")
			} else {
				if (lc && lc.isPopup) {
					reglink = [ reglink, "?from=",
							encodeURIComponent(window.location.href) ].join("")
				}
			}
			registerPanel.innerHTML = '<span>没有账号？</span><a href="'
					+ reglink
					+ '" target="_blank" class="register-now">立即注册&nbsp;&gt;&gt;</a>';
			q1("pass_login_p_btn", form).appendChild(infoImage);
			q1("pass_login_p_btn", form).appendChild(registerPanel)
		}
	};
	PopupOperationLimitLoginRender.prototype = new Render();
	var PopupOperationLimitActivateRender = function(father) {
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom), className;
			if (!pbody) {
				return dom
			}
			className = pbody.className;
			if (className.indexOf("mbox") !== -1) {
				pbody.className = "account-pbody account-pbody-3-oplimit-mbox"
			} else {
				pbody.className = "account-pbody account-pbody-3-oplimit"
			}
			return dom
		}
	};
	PopupOperationLimitActivateRender.prototype = new Render();
	var PopupSongLimitLoginRender = function(father) {
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom), className;
			if (!pbody) {
				return dom
			}
			className = pbody.className;
			pbody.className = "account-pbody account-pbody-1-download-mbox account-pbody-1-limit-mbox";
			return dom
		}
	};
	PopupSongLimitLoginRender.prototype = new Render();
	var PopupSongLimitActivateRender = function(father) {
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom), className;
			if (!pbody) {
				return dom
			}
			className = pbody.className;
			if (className.indexOf("mbox") !== -1) {
				pbody.className = "account-pbody account-pbody-3-limit-mbox"
			} else {
				pbody.className = "account-pbody account-pbody-3-limit"
			}
			return dom
		}
	};
	PopupSongLimitActivateRender.prototype = new Render();
	var PopupDownloadLoginRender = function(father) {
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom), className;
			if (!pbody) {
				return dom
			}
			className = pbody.className;
			if (className.indexOf("mbox") !== -1) {
				pbody.className = "account-pbody account-pbody-1-download-mbox"
			} else {
				pbody.className = "account-pbody account-pbody-1-download"
			}
			return dom
		}
	};
	PopupDownloadLoginRender.prototype = new Render();
	var PopupPlaylistLoginRender = function(father) {
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			var dom = curDOM, pbody = q1("account-pbody", dom), className;
			if (!pbody) {
				return dom
			}
			className = pbody.className;
			pbody.className = "account-pbody account-pbody-1-download-mbox account-pbody-1-playlist-mbox";
			return dom
		}
	};
	PopupPlaylistLoginRender.prototype = new Render();
	var bdPassLoginConfig = function(loginType, bdplr, container) {
		var getUserInfo = createGetUserInfo(), lc = ting.passport.lastCallback, phone = loginType == "mobileLogin" ? true
				: false, getErrSpanId = function(inputDomOrInputDomId) {
			if (typeof (inputDomOrInputDomId) == "string") {
				return inputDomOrInputDomId + "_err"
			} else {
				return g(inputDomOrInputDomId).id + "_err"
			}
		}, config = {
			isPhone : phone,
			onLoginSuccess : function() {
				getUserInfo()
			},
			onSystemErr : function(form, errNo, extObj) {
				var rp = (function() {
					var result = regnotifyPath + "?t=" + 1 * (new Date()), fmMboxReg = /^\/(player|app)\//, aurl = window.location.href, curl = window.location.pathname, opt = ting.passport.lastOptions;
					if (opt && opt.isPopup && !fmMboxReg.test(curl)) {
						result += "&from=" + encodeURIComponent(aurl)
					}
					return result
				})();
				var extMail = extObj.mail || "", loginGeneralErrors = {
					"-1" : {
						main : "登录时发生未知错误，请重新输入"
					},
					"5" : {
						main : "今日登录次数过多"
					},
					"16" : {
						main : "对不起，您现在无法登录"
					},
					"20" : {
						main : "此账号已登录人数过多"
					},
					"110024" : {
						main : "账号尚未验证",
						extra : "您的账号还没有经过验证，<a href='" + rp + "&email="
								+ extMail
								+ "' target='_blank'>立即去验证 &gt;&gt;</a>"
					}
				}, errorNo = "" + errNo, error;
				if (loginGeneralErrors.hasOwnProperty(errorNo)) {
					error = loginGeneralErrors[errorNo];
					showErrorTip(error.main, error.extra, g(container))
				}
			},
			onInputErr : function(inputDom, errNo) {
				var sumLoginErrorDOM = q1("sum-login-error", g(container)), errSpanId = getErrSpanId(inputDom), inputErrDOM = g(errSpanId);
				sumLoginErrorDOM.innerHTML = inputErrDOM.innerHTML;
				sumLoginErrorDOM.errFrom = errSpanId;
				basicFailure(inputDom, errNo);
				if (lc.onFailure) {
					lc.onFailure(inputDom, errNo)
				}
			},
			onInputOk : function(inputDom) {
				var sumLoginErrorDOM = q1("sum-login-error", g(container)), errSpanId = getErrSpanId(inputDom), inputErrDOM = g(errSpanId);
				if (sumLoginErrorDOM.errFrom == errSpanId) {
					sumLoginErrorDOM.innerHTML = ""
				}
			},
			onReady : function(form) {
				var labelNames = {
					username : "账&#12288;号",
					phoneNumber : "手机号",
					password : "密&#12288;码",
					verifycode : "验证码"
				}, buttonName = "登    录", userNameInput = q1(
						"pass_login_input_username", form), phoneInput = q1(
						"pass_login_input_phoneNumber", form), passwordInput = q1(
						"pass_login_input_password", form), verifyInput = q1(
						"pass_login_input_verifycode", form), toFocus = g("pass_login_username_0"), key, label, stack, holder, loginErrorDOM, focusHandler, keydownHandler;
				for (key in labelNames) {
					if (labelNames.hasOwnProperty(key)) {
						label = q1("pass_login_label_" + key, form);
						if (label) {
							label.innerHTML = labelNames[key]
						}
					}
				}
				q1("pass_login_input_submit", form).value = buttonName;
				focusHandler = function(e) {
					var sumLoginErrorDOM = q1("sum-login-error", g(container)), errSpanId = getErrSpanId((e && e.srcElement) ? e.srcElement
							: this), inputErrDOM = g(errSpanId);
					if (sumLoginErrorDOM.errFrom == errSpanId) {
						sumLoginErrorDOM.innerHTML = ""
					}
				};
				keydownHandler = function(e) {
					var keycode = document.all ? window.event.keyCode : e.which, submitBtn;
					if (keycode == 13) {
						submitBtn = q1("pass_login_input_submit", form);
						if (submitBtn) {
							submitBtn.click()
						}
					}
				};
				if (userNameInput) {
					addEvent(userNameInput, "focus", focusHandler);
					addEvent(userNameInput, "keydown", keydownHandler)
				}
				if (phoneInput) {
					addEvent(phoneInput, "focus", focusHandler);
					addEvent(phoneInput, "keydown", keydownHandler)
				}
				if (passwordInput) {
					addEvent(passwordInput, "focus", focusHandler);
					addEvent(passwordInput, "keydown", keydownHandler)
				}
				if (verifyInput) {
					addEvent(verifyInput, "focus", focusHandler);
					addEvent(verifyInput, "keydown", keydownHandler)
				}
				holder = form.parentNode;
				holder.insertBefore(createDOM("div", {
					"class" : "sum-login-error"
				}), form);
				if (toFocus) {
					toFocus.focus()
				}
				stack = bdplr.all("onReady");
				runStackCallbacks(stack, arguments);
				if (lc.onReady) {
					lc.onReady.apply(null, arguments)
				}
			}
		};
		return config
	};
	var bdPassLoginRender = function(father) {
		var self = this, options = ting.passport.lastOptions, tabs = {
			emailLogin : {
				show : true,
				tabName : "普通登录"
			},
			mobileLogin : {
				show : true,
				tabName : "手机号登录"
			}
		}, istabs = true;
		options.mobileLogin = true;
		options.emailLogin = true;
		tabs.mobileLogin.show = options.mobileLogin || false;
		tabs.emailLogin.show = options.emailLogin || false;
		if (!tabs.mobileLogin.show && !tabs.emailLogin.show) {
			tabs.emailLogin.show = true
		}
		if (tabs.mobileLogin.show ^ tabs.emailLogin.show) {
			istabs = false
		}
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			var opt = ting.passport.lastOptions, container = (opt && opt.container) ? opt.container
					: "login_form", first = true, firstTab = true, config, key, id, className, dom, tabMainDOM, tabDOM, formsContainer;
			if (istabs) {
				tabMainDOM = createDOM("div", {
					"class" : "login-tabs"
				});
				for (key in tabs) {
					if (tabs.hasOwnProperty(key) && tabs[key].show) {
						className = firstTab ? "login-tab login-first-tab selected"
								: "login-tab";
						firstTab = false;
						tabDOM = createDOM("div", {
							"class" : className
						});
						tabDOM.innerHTML = tabs[key].tabName;
						tabDOM.onclick = (function(tabType) {
							var cid = container + "_"
									+ tabType.replace("Login", "");
							return function() {
								var holder = g(container), tabs = q(
										"login-tab", holder), forms = q1(
										"login-forms", holder).childNodes, i, ilen, loginInput;
								for (i = 0, ilen = tabs.length; i < ilen; i += 1) {
									removeClass(tabs[i], "selected")
								}
								addClass(this, "selected");
								for (i = 0, ilen = forms.length; i < ilen; i += 1) {
									forms[i].style.display = "none"
								}
								g(cid).style.display = "block"
							}
						})(key);
						tabMainDOM.appendChild(tabDOM)
					}
				}
				g(container).appendChild(tabMainDOM)
			}
			formsContainer = createDOM("div", {
				"class" : "login-forms"
			});
			g(container).appendChild(formsContainer);
			for (key in tabs) {
				if (tabs.hasOwnProperty(key) && tabs[key].show) {
					id = container + "_" + key.replace("Login", "");
					className = key.replace("Login", "-login-form");
					dom = createDOM("div", {
						"class" : className,
						id : id
					});
					if (!first) {
						dom.style.display = "none"
					}
					first = false;
					config = bdPassLoginConfig(key, self, id);
					formsContainer.appendChild(dom);
					bdPassHelper("login", id, config)
				}
			}
		}
	};
	bdPassLoginRender.prototype = new Render();
	var bdPassRegisterRender = function(father) {
		var self = this;
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			var submitActivate = createSubmitActivate(), lc = ting.passport.lastCallback, config = {
				onRegSuccess : function(form, u) {
					var url = decodeURIComponent(decodeURIComponent(u)), a = url
							.split("&"), b = a.slice(1), from = getUrlFrom(), lo = ting.passport.lastOptions, rp, regChannel;
					switch (from) {
					case null:
						break;
					case "pc":
						b.push("from="
								+ encodeURIComponent(regverifyPath + "/pc"));
						break;
					default:
						b.push("from=" + from);
						break
					}
					b.push("last=reg");
					b = b.join("&");
					rp = regnotifyPath + "?t=" + 1 * (new Date());
					rp = [ rp, "&", b ].join("");
					if (u) {
						setTimeout(function() {
							document.location = rp
						}, 100)
					}
					regChannel = lo.isPopup ? (lo.ref || "") : "web";
					if (regChannel != "pop_web" && from !== null) {
						regChannel = from
					}
					log("register", {
						reg_channel : regChannel
					})
				},
				onInputErr : function(inputDom, errNo) {
					if (lc.onFailure) {
						lc.onFailure(inputDom, errNo)
					}
				},
				onReady : function(form) {
					var labelNames = {
						username : "用 户 名",
						password : "设置密码",
						repassword : "确认密码",
						verifycode : "验 证 码",
						email : "电子邮箱"
					}, buttonName = "同意以下协议并提交", key, label, stack;
					for (key in labelNames) {
						if (labelNames.hasOwnProperty(key)) {
							label = q1("pass_reg_label_" + key, form);
							if (label) {
								label.innerHTML = labelNames[key]
							}
						}
					}
					q1("pass_reg_submit", form).value = buttonName;
					stack = self.all("onReady");
					runStackCallbacks(stack, arguments);
					if (lc.onReady) {
						lc.onReady.apply(null, arguments)
					}
				}
			}, opt = ting.passport.lastOptions, container = (opt && opt.container) ? opt.container
					: "register_form";
			bdPassHelper("register", container, config)
		}
	};
	bdPassRegisterRender.prototype = new Render();
	var bdPassLockmailRender = function(father) {
		var self = this;
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			var config = {
				labelName : {
					securemail : "邮箱："
				},
				onSuccess : function() {
					var lc = ting.passport.lastCallback;
					if (lc.onSuccess) {
						lc.onSuccess()
					}
				},
				onInputErr : function(inputDom, errNo) {
					var lc = ting.passport.lastCallback;
					if (lc.onFailure) {
						lc.onFailure(inputDom, errNo)
					}
				},
				onReady : function() {
					var lc = ting.passport.lastCallback;
					if (lc.onReady) {
						lc.onReady()
					}
				}
			}, opt = ting.passport.lastOptions, container = (opt && opt.container) ? opt.container
					: "lockmail_holder";
			bdPassHelper("lockmail", container, config)
		}
	};
	bdPassLockmailRender.prototype = new Render();
	var bdPassActivateRender = function(father) {
		rp.init.call(this, father);
		this.myRender = function(curDOM) {
			var submitBtn = q1("activate-submit") || q1("activate-submit-2"), submitActivate = createSubmitActivate();
			submitBtn.onclick = function() {
				var nickName;
				nickNameCheck.init(g("activate_nickname"), g("activate_desc"),
						g("activate_valid"));
				nickName = nickNameCheck.check();
				if (!nickName) {
					return false
				}
				if (!g("activate_statement").checked) {
					g("agree_valid").innerHTML = "请阅读和同意协议";
					return false
				} else {
					g("agree_valid").innerHTML = ""
				}
				submitActivate( {
					action : "activate",
					name : nickName
				});
				return false
			}
		}
	};
	bdPassActivateRender.prototype = new Render();
	var FinishActivateRender = function(father) {
		rp.init.call(this, father);
		this.boxSize = {
			width : 630,
			height : 320
		};
		this.myRender = function(curDOM) {
			var pbody = q1("account-pbody", curDOM);
			pbody.innerHTML = [
					'<div class="account-t2 final-success-title">',
					"     恭喜您正式成为ting友！",
					"</div>",
					'<div class="final-success-title2">登录ting!您可以：</div>',
					'<div class="final-success-tips">',
					"     1.一键点击，新歌、专辑收听一网打尽<br />",
					"     2.享受ting!为你量身推荐的歌曲与歌手，不再为听什么而纠结<br />",
					"     3.参加ting友活动，与偶像亲密贴身互动<br />",
					"     4.寻找音乐同好，分享你的音乐喜好",
					"</div>",
					'<div class="final-success-btn pass_login_p_btn">',
					'     <button class="btn-complete" id="btn_complete"><span>我知道了</span></button>',
					"</div>" ].join("");
			pbody.className = "account-pbody account-pbody-3";
			var done = function() {
				var lc = ting.passport.lastCallback;
				lc.onClose();
				if (lc.onSuccess) {
					lc.onSuccess()
				}
				return false
			};
			q1("account-pclose", curDOM).onclick = done;
			q1("btn-complete", pbody).onclick = done;
			return curDOM
		}
	};
	FinishActivateRender.prototype = new Render();
	var MboxFinishActivateRender = function(father) {
		rp.init.call(this, father);
		this.boxSize = {
			width : 470,
			height : 300
		};
		this.myRender = function(curDOM) {
			var pbody = q1("account-pbody", curDOM);
			pbody.className = "account-pbody account-pbody-final-mbox";
			return curDOM
		}
	};
	MboxFinishActivateRender.prototype = new Render();
	var basicFailure = function(inputDom, errNo) {
		var formDom = inputDom.parentNode.parentNode, loginInputs = q(
				"pass_login_input", formDom), twoInputs = [ loginInputs ], key, i, ilen, j, jlen, inputs;
		for (i = 0, ilen = twoInputs.length; i < ilen; i += 1) {
			inputs = twoInputs[i];
			for (j = 0, jlen = inputs.length; j < jlen; j += 1) {
				if (inputs[j].id != inputDom.id) {
					inputs[j].removeAttribute("style")
				}
			}
		}
		inputDom.style.background = 'url("/static/images/bg/login_input_bg_err.png") repeat-x 0 0';
		inputDom.style.border = "1px solid #C66"
	};
	var showErrorTip = function(mainMsg, extraMsg, dom, style) {
		var tipDOM = createDOM("div", {
			"class" : "error-tip"
		}), tipHTML = [ "   <div class='error-tip-inner'>",
				"       <div class='error-tip-main'>", mainMsg,
				"       </div>", "       <div class='error-tip-extra'>",
				extraMsg, "       </div>", "   </div>",
				"   <a class='error-tip-close' href='#'></a>",
				"   <div class='error-tip-arrow'></div>", ].join(""), tipClose, tipExtra;
		tipDOM.innerHTML = tipHTML;
		tipExtra = q1("error-tip-extra", tipDOM);
		tipClose = q1("error-tip-close", tipDOM);
		if (!extraMsg) {
			tipDOM.style.top = "-45px";
			tipExtra.style.display = "none"
		}
		tipClose.onclick = function() {
			dom.removeChild(tipDOM);
			return false
		};
		dom.appendChild(tipDOM)
	};
	var templateList = {
		login : {
			action : "login",
			template : "LoginTemplate"
		},
		register : {
			action : "reg",
			template : "RegTemplate"
		},
		activate : {
			action : "activate",
			template : "empty"
		},
		lockmail : {
			action : "lockmail",
			template : "LockmailTemplate"
		}
	};
	var bdPassHelper = function(pAction, pContainer, pConfig) {
		var obj = templateList[pAction], action = obj.action, template = obj.template, passAPIUrl = passAPIPath
				.replace("ACTION", action)
				+ "&callback=bdPassHelperCallback", container = pContainer, config = pConfig, oldFailure = config.onInputErr, lc = ting.passport.lastOptions, curl = window.location.pathname, from = getUrlFrom(), fmMboxReg = /^\/(player|app)\//, bdPassHelperCallback, i, len, foundFrom;
		config.tpl = "ti";
		config.staticpage = passJumpPath;
		config.outerDomId = pContainer;
		config.retu = regverifyPath;
		if (pAction == "register") {
			switch (from) {
			case null:
				break;
			case "pc":
				config.retu += "/pc";
				break;
			default:
				config.retu += "?from=" + from;
				break
			}
		} else {
			if (pAction == "login" && lc && lc.isPopup && !fmMboxReg.test(curl)) {
				config.retu += "?from="
						+ encodeURIComponent(window.location.href)
			}
		}
		config.onInputErr = function(inputDom, errNo) {
			if (oldFailure) {
				oldFailure(inputDom, errNo)
			}
		};
		bdPassHelperCallback = function(response) {
			bdPass.api[action].init(config)
		};
		bdPass.api[action].init(config)
	};
	var createGetUserInfo = function() {
		var lastCallback = ting.passport.lastCallback, lastOptions = ting.passport.lastOptions, isPopup = lastOptions.isPopup, showSumError = function(
				txt) {
			var emailForm = g("login_form_email"), mobileForm = g("login_form_mobile"), target = emailForm.style.display != "none" ? emailForm
					: mobileForm, sumError = q1("sum-login-error", target);
			if (sumError) {
				sumError.innerHTML = txt
			}
		}, getUserInfo = function() {
			var url = userInfoPath + "?callback=userInfoCallback";
			sioGet(url, userInfoCallback)
		}, userInfoCallback = function(response) {
			var json = eval(response), errorCode = json.errorCode, processorList = {
				22452 : userInfoNotLogined,
				22453 : userInfoNotActivated,
				22454 : userInfoBanned,
				22000 : userInfoPass
			}, processor = processorList[errorCode];
			if (processor) {
				processor(json)
			}
		}, userInfoNotLogined = function(json) {
			showSumError("未知登录错误，请重试")
		}, userInfoNotActivated = function(json) {
			if (isPopup) {
				ting.userInfo = json.data;
				lastOptions.simple = !(ting.userInfo.bdNameInvalid || false);
				if (lastOptions.simple && lastOptions.operation) {
					lastOptions.simple = false;
					lastOptions.operation = false;
					lastOptions.simpleOp = true
				}
				ting.passport.popup("activate", lastCallback, lastOptions);
				refreshUserBar()
			} else {
				window.location.href = activateGetPath
			}
		}, userInfoBanned = function(json) {
			showSumError("该账号已被封禁")
		}, userInfoPass = function(json) {
			var userInfo = json.data, callback = ting.passport.lastCallback, redirect;
			if (isPopup) {
				callback.onClose();
				if (callback.onLoginSuccess) {
					callback.onLoginSuccess(userInfo)
				}
				if (callback.onSuccess) {
					callback.onSuccess(userInfo)
				}
				refreshUserBar()
			} else {
				redirect = window.location.search.match(/[?&]redirect=([^&]*)/);
				redirect = redirect ? redirect[1] : null;
				if (!redirect || redirect === "home") {
					redirect = userInfo.userType === "0" ? "/people/"
							: "/artist/";
					redirect += userInfo.userId
				} else {
					redirect = decodeURIComponent(redirect)
				}
				window.location = redirect
			}
		};
		return getUserInfo
	};
	var createSubmitActivate = function() {
		var lastCallback = ting.passport.lastCallback, lastOptions = ting.passport.lastOptions, isPopup = lastOptions.isPopup, submitActivate = function(
				json) {
			var param = [], action = json.action, actionType = templateList[action].action, name = json.name
					|| "", from = getUrlFrom(), regChannel = isPopup ? (lastOptions.ref || "")
					: "web";
			if (regChannel != "pop_web" && from !== null) {
				regChannel = from
			}
			if (window.location.pathname == "/special/wxk.html") {
				param.push("special=wangxiaokun")
			}
			if (regChannel.length > 0) {
				param.push("action_type=" + encodeURIComponent(actionType));
				param.push("reg_channel=" + encodeURIComponent(regChannel))
			}
			param.push("nickName=" + encodeURIComponent(name));
			ajax
					.post(
							activatePostPath,
							param.join("&"),
							function(response) {
								var json = eval("(" + response + ")"), errorCode = json.errorCode, processorList = {
									22452 : activateNotLogined,
									22231 : activateInvalidName,
									22000 : activatePass
								}, processor = processorList[errorCode];
								json.action = action;
								if (processor) {
									processor(json)
								}
							})
		}, activateNotLogined = function(json) {
			window.location.href = "/"
		}, activateInvalidName = function(json) {
			if (json.action === "activate") {
				var activate_valid = g("activate_valid");
				activate_valid.style.display = "inline";
				activate_valid.innerHTML = "该昵称不可用"
			} else {
				window.location = activateGetPath
			}
		}, activatePass = function(json) {
			var userInfo = json.data, lc = lastCallback, oldSuccess = lc ? lc.onSuccess
					: null, from = getUrlFrom(), guideExtra, finalUrl, tmpUrl;
			if (lc.onActivateSuccess) {
				lc.onActivateSuccess(userInfo)
			}
			lc.onSuccess = function() {
				if (oldSuccess) {
					oldSuccess(userInfo)
				}
			};
			if (isPopup) {
				userInfo.active = true;
				userInfo.login = true;
				ting.userInfo = userInfo;
				refreshUserBar();
				ting.passport.popup("finishActivate", lc, lastOptions)
			} else {
				guideExtra = (json.action === "activate" ? "?from=activate"
						: "");
				finalUrl = guidePath + guideExtra;
				switch (from) {
				case null:
				case "player":
				case "radio":
				case "app":
					break;
				default:
					tmpUrl = decodeURIComponent(from);
					if (/^https?:\/\/(.*?\.)?ting\.baidu\.com/.test(tmpUrl)) {
						finalUrl = tmpUrl
					}
					break
				}
				setTimeout(function() {
					window.location.href = finalUrl
				}, 500)
			}
		};
		return submitActivate
	};
	var runStackCallbacks = function(stack, args) {
		var t = stack.pop();
		while (t) {
			t.apply(null, args);
			t = stack.pop()
		}
	};
	var actionRender = {
		login : {
			normal : [ PopupLoginRegisterRender, PopupLoginRender ],
			mbox : [ PopupMboxLoginRender ],
			songLimit : [ PopupSongLimitLoginRender ],
			opLimit : [ PopupOperationLimitLoginRender ],
			download : [ PopupDownloadLoginRender ],
			playlist : [ PopupPlaylistLoginRender ]
		},
		activate : {
			normal : [ PopupActivateRender ],
			simple : [ PopupSimpleActivateRender ],
			simpleOp : [ PopupSimpleActivateRender,
					PopupOperationSimpleActivateRender ],
			mbox : [ PopupMboxActivateRender ],
			songLimit : [ PopupOperationLimitActivateRender,
					PopupSongLimitActivateRender ],
			opLimit : [ PopupOperationLimitActivateRender ],
			download : [ PopupOperationLimitActivateRender ],
			playlist : [ PopupOperationLimitActivateRender ]
		},
		register : {
			normal : [ PopupLoginRegisterRender, PopupRegisterRender ],
			mbox : [ PopupMboxRegisterRender ],
			songLimit : [ NullRender ],
			opLimit : [ NullRender ],
			download : [ NullRender ],
			playlist : [ NullRender ]
		},
		finishActivate : {
			normal : [ FinishActivateRender ],
			mbox : [ MboxFinishActivateRender ],
			songLimit : [ NullRender ],
			opLimit : [ NullRender ],
			download : [ NullRender ],
			playlist : [ NullRender ]
		}
	};
	ting.passport = {
		cssLoaded : false,
		countString : countString,
		nickName : nickNameCheck,
		render : function(action, container, callback, options, finalRender) {
			ting.passport.lastCallback = callback || {};
			ting.passport.lastOptions = options || {};
			ting.passport.lastOptions.container = container;
			var map = {
				login : bdPassLoginRender,
				register : bdPassRegisterRender,
				activate : bdPassActivateRender,
				finishActivate : NullRender,
				lockmail : bdPassLockmailRender
			}, TheRender = map[action], lastRender = new TheRender( {
				base : finalRender || new NullRender()
			});
			lastRender.render()
		},
		popup : function(action, callback, options) {
			if (action == "activate") {
				options.simple = !(ting.userInfo.bdNameInvalid || false);
				if (options.simple
						&& (options.operation || options.download || options.playlist)) {
					options.simple = false;
					options.operation = false;
					options.playlist = false;
					options.download = false;
					options.simpleOp = true
				}
			}
			var opt = options || {}, mbox = opt.mbox || false, songLimit = opt.songLimit || false, opLimit = opt.operation || false, download = opt.download || false, playlist = opt.playlist || false, simple = opt.simple || false, simpleOp = opt.simpleOp || false, ref = opt.ref
					|| "web", finalRender = new PopupRender(), dom, FakeRender, boxSize, i, statck, doit, renderList = actionRender[action], normalRender = renderList.normal, mboxRender = renderList.mbox, songLimitRender = renderList.songLimit
					|| [], opLimitRender = renderList.opLimit || [], downloadRender = renderList.download
					|| [], playlistRender = renderList.playlist || [], simpleRender = renderList.simple
					|| [], simpleOpRender = renderList.simpleOp || [], lastDom = ting.passport.lastDom;
			callback.onClose = function() {
				popup.hide()
			};
			options.isPopup = true;
			ting.passport.lastCallback = callback;
			ting.passport.lastOptions = options;
			for (i = 0; i < normalRender.length; i++) {
				finalRender = new normalRender[i]( {
					base : finalRender
				})
			}
			if (mbox) {
				for (i = 0; i < mboxRender.length; i++) {
					finalRender = new mboxRender[i]( {
						base : finalRender
					})
				}
			}
			if (songLimit) {
				for (i = 0; i < songLimitRender.length; i++) {
					finalRender = new songLimitRender[i]( {
						base : finalRender
					})
				}
			}
			if (opLimit) {
				for (i = 0; i < opLimitRender.length; i++) {
					finalRender = new opLimitRender[i]( {
						base : finalRender
					})
				}
			}
			if (download) {
				for (i = 0; i < downloadRender.length; i++) {
					finalRender = new downloadRender[i]( {
						base : finalRender
					})
				}
			}
			if (playlist) {
				for (i = 0; i < playlistRender.length; i++) {
					finalRender = new playlistRender[i]( {
						base : finalRender
					})
				}
			}
			if (simple) {
				for (i = 0; i < simpleRender.length; i++) {
					finalRender = new simpleRender[i]( {
						base : finalRender
					})
				}
			}
			if (simpleOp) {
				for (i = 0; i < simpleOpRender.length; i++) {
					finalRender = new simpleOpRender[i]( {
						base : finalRender
					})
				}
			}
			if (lastDom) {
				document.body.removeChild(lastDom)
			}
			dom = finalRender.render();
			boxSize = finalRender.getBoxSize();
			stack = finalRender.all("onReady");
			FakeRender = function(father) {
				rp.init.call(this, father);
				this.myRender = function() {
					return dom
				};
				this.onReady = function(form) {
					var stackBck = [], i, len;
					for (i = 0, len = stack.length; i < len; i += 1) {
						stackBck[i] = stack[i]
					}
					runStackCallbacks(stackBck, arguments)
				}
			};
			FakeRender.prototype = new Render();
			doit = function() {
				document.body.insertBefore(dom, document.body.childNodes[0]);
				ting.passport.lastDom = dom;
				popup.init(dom, boxSize);
				popup.show();
				ting.passport.render(action, null, callback, options,
						new FakeRender());
				popupLog(action)
			};
			if (ting.passport.cssLoaded) {
				doit()
			} else {
				ting.passport.cssLoaded = true;
				ajax.get(cssPath, function(response) {
					appendStyle(response);
					doit()
				})
			}
		},
		checkLogin : function(pCallback, pOptions) {
			var userInfo = ting.userInfo, oldSuccess, callback, options;
			if (arguments.length === 2) {
				callback = pCallback;
				options = pOptions
			} else {
				callback = {
					onSuccess : arguments[0],
					onFailure : arguments[1],
					onCancel : arguments[2],
					onPassportSuccess : arguments[3]
				};
				options = arguments[4] || {}
			}
			oldSuccess = callback.onSuccess;
			if (!userInfo || !userInfo.active) {
				callback.onSuccess = function(userInfo) {
					userInfo = userInfo || {};
					userInfo.login = true;
					userInfo.active = true;
					ting.userInfo = userInfo;
					setLoginedCookie();
					if (oldSuccess) {
						oldSuccess()
					}
				}
			}
			if (!userInfo) {
				ting.passport.popup("login", callback, options)
			} else {
				if (userInfo.active) {
					if (callback.onSuccess) {
						callback.onSuccess(userInfo)
					}
				} else {
					ting.passport.popup("activate", callback, options)
				}
			}
		},
		closePopup : function() {
			popup.hide()
		},
		getEmailProvider : function(email, cbk) {
			var url = [ passGetEmailProviderPath,
					"email=" + encodeURIComponent(email),
					"t=" + 1 * (new Date()) ].join("&"), callback = function(
					json) {
				if (json && json.errno === 0) {
					if (cbk) {
						cbk.call(null, json.svr)
					}
				}
			};
			if (email) {
				sioGet(url, callback)
			}
		},
		sendRegEmail : function(email, success, fail) {
			var rp, url, callback, foundFrom, i, len, tmpUrl, searchList = window.location.search
					.substr(1).split("&"), from = getUrlFrom();
			rp = regverifyPath;
			if (/regverify/.test(from)) {
				rp = decodeURIComponent(tmpUrl)
			} else {
				rp += "?from=" + tmpUrl
			}
			url = [ passSendRegEmailPath, "u=" + encodeURIComponent(rp),
					"user=" + encodeURIComponent(email),
					"t=" + 1 * (new Date()) ].join("&");
			callback = function(json) {
				if (json && json.errno === 0) {
					if (success) {
						success.call()
					}
				} else {
					if (fail) {
						fail.call(null, json)
					}
				}
			};
			if (email) {
				sioGet(url, callback)
			}
		},
		changeRegEmail : function(json) {
			var data = json || {}, callback = data.callback, oldEmail = data.oldEmail, formId = data.form, formDOM = g(formId), formParent = formDOM.parentNode, iframeName = "pass_ce_iframe", iframeDOM = createDOM(
					document.all ? "<iframe name='" + iframeName + "'>"
							: "iframe", {
						id : iframeName,
						name : iframeName,
						src : "javascript:''",
						style : "display: none"
					}), callbackName = "tingpce";
			formParent.appendChild(iframeDOM);
			formDOM.action = passChangeRegEmailPath;
			formDOM.target = iframeName;
			window[callbackName] = function() {
				try {
					callback.apply(null, arguments)
				} finally {
				}
			};
			formDOM.appendChild(createDOM("input", {
				type : "hidden",
				name : "callback",
				value : "parent." + callbackName
			}));
			formDOM.appendChild(createDOM("input", {
				type : "hidden",
				name : "oldEmail",
				value : oldEmail
			}));
			formDOM.appendChild(createDOM("input", {
				type : "hidden",
				name : "tpl",
				value : "ti"
			}));
			formDOM.appendChild(createDOM("input", {
				type : "hidden",
				name : "token",
				value : "abc123"
			}));
			formDOM.appendChild(createDOM("input", {
				type : "hidden",
				name : "staticpage",
				value : passJumpPath
			}))
		}
	}
}());