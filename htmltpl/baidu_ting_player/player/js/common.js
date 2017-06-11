var T, baidu = T = baidu || {
	version : "1.3.8"
};
baidu.guid = "$BAIDU$";
window[baidu.guid] = window[baidu.guid] || {};
baidu.ajax = baidu.ajax || {};
baidu.fn = baidu.fn || {};
baidu.fn.blank = function() {
};
baidu.ajax.request = function(d, s) {
	s = s || {};
	var k = s.data || "", h = !(s.async === false), j = s.username || "", q = s.password
			|| "", a = (s.method || "GET").toUpperCase(), g = s.headers || {}, o = s.timeout || 0, c = {}, m, p, r;
	function l() {
		if (r.readyState == 4) {
			try {
				var u = r.status
			} catch (t) {
				f("failure");
				return
			}
			f(u);
			if ((u >= 200 && u < 300) || u == 304 || u == 1223) {
				f("success")
			} else {
				f("failure")
			}
			window.setTimeout(function() {
				r.onreadystatechange = baidu.fn.blank;
				if (h) {
					r = null
				}
			}, 0)
		}
	}
	function b() {
		if (window.ActiveXObject) {
			try {
				return new ActiveXObject("Msxml2.XMLHTTP")
			} catch (t) {
				try {
					return new ActiveXObject("Microsoft.XMLHTTP")
				} catch (t) {
				}
			}
		}
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest()
		}
	}
	function f(v) {
		v = "on" + v;
		var u = c[v], w = baidu.ajax[v];
		if (u) {
			if (m) {
				clearTimeout(m)
			}
			if (v != "onsuccess") {
				u(r)
			} else {
				try {
					r.responseText
				} catch (t) {
					return u(r)
				}
				u(r, r.responseText)
			}
		} else {
			if (w) {
				if (v == "onsuccess") {
					return
				}
				w(r)
			}
		}
	}
	for (p in s) {
		c[p] = s[p]
	}
	g["X-Requested-With"] = "XMLHttpRequest";
	try {
		r = b();
		if (a == "GET") {
			if (k) {
				d += (d.indexOf("?") >= 0 ? "&" : "?") + k;
				k = null
			}
			if (s.noCache) {
				d += (d.indexOf("?") >= 0 ? "&" : "?") + "b" + (+new Date)
						+ "=1"
			}
		}
		if (j) {
			r.open(a, d, h, j, q)
		} else {
			r.open(a, d, h)
		}
		if (h) {
			r.onreadystatechange = l
		}
		if (a == "POST") {
			r.setRequestHeader("Content-Type",
					"application/x-www-form-urlencoded")
		}
		for (p in g) {
			if (g.hasOwnProperty(p)) {
				r.setRequestHeader(p, g[p])
			}
		}
		f("beforerequest");
		if (o) {
			m = setTimeout(function() {
				r.onreadystatechange = baidu.fn.blank;
				r.abort();
				f("timeout")
			}, o)
		}
		r.send(k);
		if (!h) {
			l()
		}
	} catch (n) {
		f("failure")
	}
	return r
};
baidu.ajax.form = function(a, c) {
	c = c || {};
	var g = a.elements, o = g.length, b = a.getAttribute("method"), f = a
			.getAttribute("action"), u = c.replacer || function(w, v) {
		return w
	}, r = {}, t = [], m, q, s, n, d, h, j, l, k;
	function p(v, w) {
		t.push(v + "=" + w)
	}
	for (m in c) {
		if (c.hasOwnProperty(m)) {
			r[m] = c[m]
		}
	}
	for (m = 0; m < o; m++) {
		q = g[m];
		n = q.name;
		if (!q.disabled && n) {
			s = q.type;
			d = q.value;
			switch (s) {
			case "radio":
			case "checkbox":
				if (!q.checked) {
					break
				}
			case "textarea":
			case "text":
			case "password":
			case "hidden":
			case "select-one":
				p(n, u(d, n));
				break;
			case "select-multiple":
				h = q.options;
				l = h.length;
				for (j = 0; j < l; j++) {
					k = h[j];
					if (k.selected) {
						p(n, u(k.value, n))
					}
				}
				break
			}
		}
	}
	r.data = t.join("&");
	r.method = a.getAttribute("method") || "GET";
	return baidu.ajax.request(f, r)
};
baidu.ajax.get = function(b, a) {
	return baidu.ajax.request(b, {
		onsuccess : a
	})
};
baidu.ajax.post = function(b, c, a) {
	return baidu.ajax.request(b, {
		onsuccess : a,
		method : "POST",
		data : c
	})
};
baidu.array = baidu.array || {};
baidu.array.indexOf = function(f, b, d) {
	var a = f.length, c = b;
	d = d | 0;
	if (d < 0) {
		d = Math.max(0, a + d)
	}
	for (; d < a; d++) {
		if (d in f && f[d] === b) {
			return d
		}
	}
	return -1
};
baidu.array.contains = function(a, b) {
	return (baidu.array.indexOf(a, b) >= 0)
};
baidu.each = baidu.array.forEach = baidu.array.each = function(h, f, b) {
	var d, g, c, a = h.length;
	if ("function" == typeof f) {
		for (c = 0; c < a; c++) {
			g = h[c];
			d = f.call(b || h, g, c);
			if (d === false) {
				break
			}
		}
	}
	return h
};
baidu.array.empty = function(a) {
	a.length = 0
};
baidu.array.every = function(f, d, b) {
	var c = 0, a = f.length;
	for (; c < a; c++) {
		if (c in f && !d.call(b || f, f[c], c)) {
			return false
		}
	}
	return true
};
baidu.array.filter = function(j, g, d) {
	var c = [], b = 0, a = j.length, h, f;
	if ("function" == typeof g) {
		for (f = 0; f < a; f++) {
			h = j[f];
			if (true === g.call(d || j, h, f)) {
				c[b++] = h
			}
		}
	}
	return c
};
baidu.array.find = function(f, c) {
	var d, b, a = f.length;
	if ("function" == typeof c) {
		for (b = 0; b < a; b++) {
			d = f[b];
			if (true === c.call(f, d, b)) {
				return d
			}
		}
	}
	return null
};
baidu.array.hash = function(f, b) {
	var g = {}, d = b && b.length, c = 0, a = f.length;
	for (; c < a; c++) {
		g[f[c]] = (d && d > c) ? b[c] : true
	}
	return g
};
baidu.array.lastIndexOf = function(d, b, c) {
	var a = d.length;
	c = c | 0;
	if (!c || c >= a) {
		c = a - 1
	}
	if (c < 0) {
		c += a
	}
	for (; c >= 0; c--) {
		if (c in d && d[c] === b) {
			return c
		}
	}
	return -1
};
baidu.array.map = function(g, f, b) {
	var d = [], c = 0, a = g.length;
	for (; c < a; c++) {
		d[c] = f.call(b || g, g[c], c)
	}
	return d
};
baidu.array.reduce = function(g, c, d) {
	var b = 0, a = g.length, f = 0;
	if (arguments.length < 3) {
		for (; b < a; b++) {
			d = g[b++];
			f = 1;
			break
		}
		if (!f) {
			return
		}
	}
	for (; b < a; b++) {
		if (b in g) {
			d = c(d, g[b], b, g)
		}
	}
	return d
};
baidu.array.remove = function(c, b) {
	var a = c.length;
	while (a--) {
		if (a in c && c[a] === b) {
			c.splice(a, 1)
		}
	}
	return c
};
baidu.array.removeAt = function(b, a) {
	return b.splice(a, 1)[0]
};
baidu.array.some = function(f, d, b) {
	var c = 0, a = f.length;
	for (; c < a; c++) {
		if (c in f && d.call(b || f, f[c], c)) {
			return true
		}
	}
	return false
};
baidu.array.unique = function(f, g) {
	var b = f.length, a = f.slice(0), d, c;
	if ("function" != typeof g) {
		g = function(j, h) {
			return j === h
		}
	}
	while (--b > 0) {
		c = a[b];
		d = b;
		while (d--) {
			if (g(c, a[d])) {
				a.splice(b, 1);
				break
			}
		}
	}
	return a
};
baidu.browser = baidu.browser || {};
if (/chrome\/(\d+\.\d)/i.test(navigator.userAgent)) {
	baidu.browser.chrome = +RegExp["\x241"]
}
if (/firefox\/(\d+\.\d)/i.test(navigator.userAgent)) {
	baidu.browser.firefox = +RegExp["\x241"]
}
if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
	baidu.browser.ie = baidu.ie = document.documentMode || +RegExp["\x241"]
}
baidu.browser.isGecko = /gecko/i.test(navigator.userAgent)
		&& !/like gecko/i.test(navigator.userAgent);
baidu.browser.isStrict = document.compatMode == "CSS1Compat";
baidu.browser.isWebkit = /webkit/i.test(navigator.userAgent);
try {
	if (/(\d+\.\d)/.test(external.max_version)) {
		baidu.browser.maxthon = +RegExp["\x241"]
	}
} catch (e) {
}
if (/opera\/(\d+\.\d)/i.test(navigator.userAgent)) {
	baidu.browser.opera = +RegExp["\x241"]
}
(function() {
	var a = navigator.userAgent;
	if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(a)
			&& !/chrome/i.test(a)) {
		baidu.browser.safari = +(RegExp["\x241"] || RegExp["\x242"])
	}
})();
baidu.cookie = baidu.cookie || {};
baidu.cookie._isValidKey = function(a) {
	return (new RegExp(
			'^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24'))
			.test(a)
};
baidu.cookie.getRaw = function(b) {
	if (baidu.cookie._isValidKey(b)) {
		var c = new RegExp("(^| )" + b + "=([^;]*)(;|\x24)"), a = c
				.exec(document.cookie);
		if (a) {
			return a[2] || null
		}
	}
	return null
};
baidu.cookie.get = function(a) {
	var b = baidu.cookie.getRaw(a);
	if ("string" == typeof b) {
		b = decodeURIComponent(b);
		return b
	}
	return null
};
baidu.cookie.setRaw = function(c, d, b) {
	if (!baidu.cookie._isValidKey(c)) {
		return
	}
	b = b || {};
	var a = b.expires;
	if ("number" == typeof b.expires) {
		a = new Date();
		a.setTime(a.getTime() + b.expires)
	}
	document.cookie = c + "=" + d + (b.path ? "; path=" + b.path : "")
			+ (a ? "; expires=" + a.toGMTString() : "")
			+ (b.domain ? "; domain=" + b.domain : "")
			+ (b.secure ? "; secure" : "")
};
baidu.cookie.remove = function(b, a) {
	a = a || {};
	a.expires = new Date(0);
	baidu.cookie.setRaw(b, "", a)
};
baidu.cookie.set = function(b, c, a) {
	baidu.cookie.setRaw(b, encodeURIComponent(c), a)
};
baidu.date = baidu.date || {};
baidu.number = baidu.number || {};
baidu.number.pad = function(d, c) {
	var f = "", b = (d < 0), a = String(Math.abs(d));
	if (a.length < c) {
		f = (new Array(c - a.length + 1)).join("0")
	}
	return (b ? "-" : "") + f + a
};
baidu.date.format = function(a, g) {
	if ("string" != typeof g) {
		return a.toString()
	}
	function d(n, m) {
		g = g.replace(n, m)
	}
	var b = baidu.number.pad, h = a.getFullYear(), f = a.getMonth() + 1, l = a
			.getDate(), j = a.getHours(), c = a.getMinutes(), k = a
			.getSeconds();
	d(/yyyy/g, b(h, 4));
	d(/yy/g, b(parseInt(h.toString().slice(2), 10), 2));
	d(/MM/g, b(f, 2));
	d(/M/g, f);
	d(/dd/g, b(l, 2));
	d(/d/g, l);
	d(/HH/g, b(j, 2));
	d(/H/g, j);
	d(/hh/g, b(j % 12, 2));
	d(/h/g, j % 12);
	d(/mm/g, b(c, 2));
	d(/m/g, c);
	d(/ss/g, b(k, 2));
	d(/s/g, k);
	return g
};
baidu.date.parse = function(c) {
	var a = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
	if ("string" == typeof c) {
		if (a.test(c) || isNaN(Date.parse(c))) {
			var g = c.split(/ |T/), b = g.length > 1 ? g[1].split(/[^\d]/) : [
					0, 0, 0 ], f = g[0].split(/[^\d]/);
			return new Date(f[0] - 0, f[1] - 1, f[2] - 0, b[0] - 0, b[1] - 0,
					b[2] - 0)
		} else {
			return new Date(c)
		}
	}
	return new Date()
};
baidu.dom = baidu.dom || {};
baidu.dom._NAME_ATTRS = (function() {
	var a = {
		cellpadding : "cellPadding",
		cellspacing : "cellSpacing",
		colspan : "colSpan",
		rowspan : "rowSpan",
		valign : "vAlign",
		usemap : "useMap",
		frameborder : "frameBorder"
	};
	if (baidu.browser.ie < 8) {
		a["for"] = "htmlFor";
		a["class"] = "className"
	} else {
		a.htmlFor = "for";
		a.className = "class"
	}
	return a
})();
baidu.lang = baidu.lang || {};
baidu.lang.isString = function(a) {
	return "[object String]" == Object.prototype.toString.call(a)
};
baidu.isString = baidu.lang.isString;
baidu.dom._g = function(a) {
	if (baidu.lang.isString(a)) {
		return document.getElementById(a)
	}
	return a
};
baidu._g = baidu.dom._g;
baidu.dom.g = function(a) {
	if ("string" == typeof a || a instanceof String) {
		return document.getElementById(a)
	} else {
		if (a && a.nodeName && (a.nodeType == 1 || a.nodeType == 9)) {
			return a
		}
	}
	return null
};
baidu.g = baidu.G = baidu.dom.g;
baidu.dom._matchNode = function(a, c, d) {
	a = baidu.dom.g(a);
	for ( var b = a[d]; b; b = b[c]) {
		if (b.nodeType == 1) {
			return b
		}
	}
	return null
};
baidu.dom._styleFilter = baidu.dom._styleFilter || [];
baidu.dom._styleFilter[baidu.dom._styleFilter.length] = {
	get : function(c, d) {
		if (/color/i.test(c) && d.indexOf("rgb(") != -1) {
			var f = d.split(",");
			d = "#";
			for ( var b = 0, a; a = f[b]; b++) {
				a = parseInt(a.replace(/[^\d]/gi, ""), 10).toString(16);
				d += a.length == 1 ? "0" + a : a
			}
			d = d.toUpperCase()
		}
		return d
	}
};
baidu.dom._styleFilter.filter = function(b, f, g) {
	for ( var a = 0, d = baidu.dom._styleFilter, c; c = d[a]; a++) {
		if (c = c[g]) {
			f = c(b, f)
		}
	}
	return f
};
baidu.dom._styleFilter[baidu.dom._styleFilter.length] = {
	set : function(a, b) {
		if (b.constructor == Number
				&& !/zIndex|fontWeight|opacity|zoom|lineHeight/i.test(a)) {
			b = b + "px"
		}
		return b
	}
};
baidu.dom._styleFixer = baidu.dom._styleFixer || {};
baidu.dom._styleFixer.display = baidu.browser.ie && baidu.browser.ie < 8 ? {
	set : function(a, b) {
		a = a.style;
		if (b == "inline-block") {
			a.display = "inline";
			a.zoom = 1
		} else {
			a.display = b
		}
	}
} : baidu.browser.firefox && baidu.browser.firefox < 3 ? {
	set : function(a, b) {
		a.style.display = b == "inline-block" ? "-moz-inline-box" : b
	}
} : null;
baidu.dom._styleFixer["float"] = baidu.browser.ie ? "styleFloat" : "cssFloat";
baidu.dom._styleFixer.opacity = baidu.browser.ie ? {
	get : function(a) {
		var b = a.style.filter;
		return b && b.indexOf("opacity=") >= 0 ? (parseFloat(b
				.match(/opacity=([^)]*)/)[1]) / 100)
				+ "" : "1"
	},
	set : function(a, c) {
		var b = a.style;
		b.filter = (b.filter || "").replace(/alpha\([^\)]*\)/gi, "")
				+ (c == 1 ? "" : "alpha(opacity=" + c * 100 + ")");
		b.zoom = 1
	}
} : null;
baidu.dom.getDocument = function(a) {
	a = baidu.dom.g(a);
	return a.nodeType == 9 ? a : a.ownerDocument || a.document
};
baidu.dom.getComputedStyle = function(b, a) {
	b = baidu.dom._g(b);
	var d = baidu.dom.getDocument(b), c;
	if (d.defaultView && d.defaultView.getComputedStyle) {
		c = d.defaultView.getComputedStyle(b, null);
		if (c) {
			return c[a] || c.getPropertyValue(a)
		}
	}
	return ""
};
baidu.string = baidu.string || {};
baidu.string.toCamelCase = function(a) {
	if (a.indexOf("-") < 0 && a.indexOf("_") < 0) {
		return a
	}
	return a.replace(/[-_][^-_]/g, function(b) {
		return b.charAt(1).toUpperCase()
	})
};
baidu.dom.getStyle = function(c, b) {
	var f = baidu.dom;
	c = f.g(c);
	b = baidu.string.toCamelCase(b);
	var d = c.style[b] || (c.currentStyle ? c.currentStyle[b] : "")
			|| f.getComputedStyle(c, b);
	if (!d) {
		var a = f._styleFixer[b];
		if (a) {
			d = a.get ? a.get(c) : baidu.dom.getStyle(c, a)
		}
	}
	if (a = f._styleFilter) {
		d = a.filter(b, d, "get")
	}
	return d
};
baidu.getStyle = baidu.dom.getStyle;
baidu.dom._styleFixer.textOverflow = (function() {
	var b = {};
	function a(f) {
		var g = f.length;
		if (g > 0) {
			g = f[g - 1];
			f.length--
		} else {
			g = null
		}
		return g
	}
	function c(f, g) {
		f[baidu.browser.firefox ? "textContent" : "innerText"] = g
	}
	function d(n, j, t) {
		var l = baidu.browser.ie ? n.currentStyle || n.style
				: getComputedStyle(n, null), s = l.fontWeight, r = "font-family:"
				+ l.fontFamily
				+ ";font-size:"
				+ l.fontSize
				+ ";word-spacing:"
				+ l.wordSpacing
				+ ";font-weight:"
				+ ((parseInt(s) || 0) == 401 ? 700 : s)
				+ ";font-style:"
				+ l.fontStyle + ";font-variant:" + l.fontVariant, f = b[r];
		if (!f) {
			l = n.appendChild(document.createElement("div"));
			l.style.cssText = "float:left;" + r;
			f = b[r] = [];
			for ( var p = 0; p < 256; p++) {
				p == 32 ? (l.innerHTML = "&nbsp;") : c(l, String
						.fromCharCode(p));
				f[p] = l.offsetWidth
			}
			c(l, "\u4e00");
			f[256] = l.offsetWidth;
			c(l, "\u4e00\u4e00");
			f[257] = l.offsetWidth - f[256] * 2;
			f[258] = f[".".charCodeAt(0)] * 3 + f[257] * 3;
			n.removeChild(l)
		}
		for ( var m = n.firstChild, q = f[256], h = f[257], g = f[258], v = [], t = t ? g
				: 0; m; m = m.nextSibling) {
			if (j < t) {
				n.removeChild(m)
			} else {
				if (m.nodeType == 3) {
					for ( var p = 0, u = m.nodeValue, k = u.length; p < k; p++) {
						l = u.charCodeAt(p);
						v[v.length] = [ j, m, p ];
						j -= (p ? h : 0) + (l < 256 ? f[l] : q);
						if (j < t) {
							break
						}
					}
				} else {
					l = m.tagName;
					if (l == "IMG" || l == "TABLE") {
						l = m;
						m = m.previousSibling;
						n.removeChild(l)
					} else {
						v[v.length] = [ j, m ];
						j -= m.offsetWidth
					}
				}
			}
		}
		if (j < t) {
			while (l = a(v)) {
				j = l[0];
				m = l[1];
				l = l[2];
				if (m.nodeType == 3) {
					if (j >= g) {
						m.nodeValue = m.nodeValue.substring(0, l) + "...";
						return true
					} else {
						if (!l) {
							n.removeChild(m)
						}
					}
				} else {
					if (d(m, j, true)) {
						return true
					} else {
						n.removeChild(m)
					}
				}
			}
			n.innerHTML = ""
		}
	}
	return {
		get : function(h) {
			var g = baidu.browser, f = dom.getStyle;
			return (g.opera ? f("OTextOverflow") : g.firefox ? h._baiduOverflow
					: f("textOverflow"))
					|| "clip"
		},
		set : function(g, j) {
			var f = baidu.browser;
			if (g.tagName == "TD" || g.tagName == "TH" || f.firefox) {
				g._baiduHTML && (g.innerHTML = g._baiduHTML);
				if (j == "ellipsis") {
					g._baiduHTML = g.innerHTML;
					var k = document.createElement("div"), h = g.appendChild(k).offsetWidth;
					g.removeChild(k);
					d(g, h)
				} else {
					g._baiduHTML = ""
				}
			}
			k = g.style;
			f.opera ? (k.OTextOverflow = j)
					: f.firefox ? (g._baiduOverflow = j) : (k.textOverflow = j)
		}
	}
})();
(function() {
	var a = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)",
			"g");
	baidu.string.trim = function(b) {
		return String(b).replace(a, "")
	}
})();
baidu.trim = baidu.string.trim;
baidu.dom.addClass = function(g, h) {
	g = baidu.dom.g(g);
	var b = h.split(/\s+/), a = g.className, f = " " + a + " ", d = 0, c = b.length;
	for (; d < c; d++) {
		if (f.indexOf(" " + b[d] + " ") < 0) {
			a += (a ? " " : "") + b[d]
		}
	}
	g.className = a;
	return g
};
baidu.addClass = baidu.dom.addClass;
baidu.dom.children = function(b) {
	b = baidu.dom.g(b);
	for ( var a = [], c = b.firstChild; c; c = c.nextSibling) {
		if (c.nodeType == 1) {
			a.push(c)
		}
	}
	return a
};
baidu.dom.contains = function(a, b) {
	var c = baidu.dom._g;
	a = c(a);
	b = c(b);
	return a.contains ? a != b && a.contains(b) : !!(a
			.compareDocumentPosition(b) & 16)
};
baidu.dom.setAttr = function(b, a, c) {
	b = baidu.dom.g(b);
	if ("style" == a) {
		b.style.cssText = c
	} else {
		a = baidu.dom._NAME_ATTRS[a] || a;
		b.setAttribute(a, c)
	}
	return b
};
baidu.setAttr = baidu.dom.setAttr;
baidu.dom.setAttrs = function(c, a) {
	c = baidu.dom.g(c);
	for ( var b in a) {
		baidu.dom.setAttr(c, b, a[b])
	}
	return c
};
baidu.setAttrs = baidu.dom.setAttrs;
baidu.dom.create = function(c, a) {
	var d = document.createElement(c), b = a || {};
	return baidu.dom.setAttrs(d, b)
};
(function() {
	var a = window[baidu.guid];
	baidu.lang.guid = function() {
		return "TANGRAM__" + (a._counter++).toString(36)
	};
	a._counter = a._counter || 1
})();
window[baidu.guid]._instances = window[baidu.guid]._instances || {};
baidu.lang.isFunction = function(a) {
	return "[object Function]" == Object.prototype.toString.call(a)
};
baidu.lang.Class = function(a) {
	this.guid = a || baidu.lang.guid();
	window[baidu.guid]._instances[this.guid] = this
};
window[baidu.guid]._instances = window[baidu.guid]._instances || {};
baidu.lang.Class.prototype.dispose = function() {
	delete window[baidu.guid]._instances[this.guid];
	for ( var a in this) {
		if (!baidu.lang.isFunction(this[a])) {
			delete this[a]
		}
	}
	this.disposed = true
};
baidu.lang.Class.prototype.toString = function() {
	return "[object " + (this._className || "Object") + "]"
};
baidu.lang.Event = function(a, b) {
	this.type = a;
	this.returnValue = true;
	this.target = b || null;
	this.currentTarget = null
};
baidu.lang.Class.prototype.addEventListener = function(d, c, b) {
	if (!baidu.lang.isFunction(c)) {
		return
	}
	!this.__listeners && (this.__listeners = {});
	var a = this.__listeners, f;
	if (typeof b == "string" && b) {
		if (/[^\w\-]/.test(b)) {
			throw ("nonstandard key:" + b)
		} else {
			c.hashCode = b;
			f = b
		}
	}
	d.indexOf("on") != 0 && (d = "on" + d);
	typeof a[d] != "object" && (a[d] = {});
	f = f || baidu.lang.guid();
	c.hashCode = f;
	a[d][f] = c
};
baidu.lang.Class.prototype.removeEventListener = function(d, c) {
	if (typeof c != "undefined") {
		if ((baidu.lang.isFunction(c) && !(c = c.hashCode))
				|| (!baidu.lang.isString(c))) {
			return
		}
	}
	!this.__listeners && (this.__listeners = {});
	d.indexOf("on") != 0 && (d = "on" + d);
	var b = this.__listeners;
	if (!b[d]) {
		return
	}
	if (typeof c != "undefined") {
		b[d][c] && delete b[d][c]
	} else {
		for ( var a in b[d]) {
			delete b[d][a]
		}
	}
};
baidu.lang.Class.prototype.dispatchEvent = function(d, a) {
	if (baidu.lang.isString(d)) {
		d = new baidu.lang.Event(d)
	}
	!this.__listeners && (this.__listeners = {});
	a = a || {};
	for ( var c in a) {
		d[c] = a[c]
	}
	var c, b = this.__listeners, f = d.type;
	d.target = d.target || this;
	d.currentTarget = this;
	f.indexOf("on") != 0 && (f = "on" + f);
	baidu.lang.isFunction(this[f]) && this[f].apply(this, arguments);
	if (typeof b[f] == "object") {
		for (c in b[f]) {
			b[f][c].apply(this, arguments)
		}
	}
	return d.returnValue
};
baidu.lang.createSingle = function(b) {
	var d = new baidu.lang.Class();
	for ( var a in b) {
		d[a] = b[a]
	}
	return d
};
baidu.dom.ddManager = baidu.lang.createSingle( {
	_targetsDroppingOver : {}
});
baidu.event = baidu.event || {};
baidu.event._listeners = baidu.event._listeners || [];
baidu.event.on = function(b, f, h) {
	f = f.replace(/^on/i, "");
	b = baidu.dom._g(b);
	var g = function(k) {
		h.call(b, k)
	}, a = baidu.event._listeners, d = baidu.event._eventFilter, j, c = f;
	f = f.toLowerCase();
	if (d && d[f]) {
		j = d[f](b, f, g);
		c = j.type;
		g = j.listener
	}
	if (b.addEventListener) {
		b.addEventListener(c, g, false)
	} else {
		if (b.attachEvent) {
			b.attachEvent("on" + c, g)
		}
	}
	a[a.length] = [ b, f, h, g, c ];
	return b
};
baidu.on = baidu.event.on;
baidu.event.un = function(c, g, b) {
	c = baidu.dom._g(c);
	g = g.replace(/^on/i, "").toLowerCase();
	var k = baidu.event._listeners, d = k.length, f = !b, j, h, a;
	while (d--) {
		j = k[d];
		if (j[1] === g && j[0] === c && (f || j[2] === b)) {
			h = j[4];
			a = j[3];
			if (c.removeEventListener) {
				c.removeEventListener(h, a, false)
			} else {
				if (c.detachEvent) {
					c.detachEvent("on" + h, a)
				}
			}
			k.splice(d, 1)
		}
	}
	return c
};
baidu.un = baidu.event.un;
baidu.event.preventDefault = function(a) {
	if (a.preventDefault) {
		a.preventDefault()
	} else {
		a.returnValue = false
	}
};
baidu.object = baidu.object || {};
baidu.extend = baidu.object.extend = function(c, a) {
	for ( var b in a) {
		if (a.hasOwnProperty(b)) {
			c[b] = a[b]
		}
	}
	return c
};
baidu.page = baidu.page || {};
baidu.page.getScrollTop = function() {
	var a = document;
	return window.pageYOffset || a.documentElement.scrollTop
			|| a.body.scrollTop
};
baidu.page.getScrollLeft = function() {
	var a = document;
	return window.pageXOffset || a.documentElement.scrollLeft
			|| a.body.scrollLeft
};
(function() {
	baidu.page.getMousePosition = function() {
		return {
			x : baidu.page.getScrollLeft() + a.x,
			y : baidu.page.getScrollTop() + a.y
		}
	};
	var a = {
		x : 0,
		y : 0
	};
	baidu.event.on(document, "onmousemove", function(b) {
		b = window.event || b;
		a.x = b.clientX;
		a.y = b.clientY
	})
})();
baidu.dom.getPosition = function(a) {
	a = baidu.dom.g(a);
	var l = baidu.dom.getDocument(a), d = baidu.browser, h = baidu.dom.getStyle, c = d.isGecko > 0
			&& l.getBoxObjectFor
			&& h(a, "position") == "absolute"
			&& (a.style.top === "" || a.style.left === ""), j = {
		left : 0,
		top : 0
	}, g = (d.ie && !d.isStrict) ? l.body : l.documentElement, m, b;
	if (a == g) {
		return j
	}
	if (a.getBoundingClientRect) {
		b = a.getBoundingClientRect();
		j.left = Math.floor(b.left)
				+ Math.max(l.documentElement.scrollLeft, l.body.scrollLeft);
		j.top = Math.floor(b.top)
				+ Math.max(l.documentElement.scrollTop, l.body.scrollTop);
		j.left -= l.documentElement.clientLeft;
		j.top -= l.documentElement.clientTop;
		var k = l.body, n = parseInt(h(k, "borderLeftWidth")), f = parseInt(h(
				k, "borderTopWidth"));
		if (d.ie && !d.isStrict) {
			j.left -= isNaN(n) ? 2 : n;
			j.top -= isNaN(f) ? 2 : f
		}
	} else {
		m = a;
		do {
			j.left += m.offsetLeft;
			j.top += m.offsetTop;
			if (d.isWebkit > 0 && h(m, "position") == "fixed") {
				j.left += l.body.scrollLeft;
				j.top += l.body.scrollTop;
				break
			}
			m = m.offsetParent
		} while (m && m != a);
		if (d.opera > 0 || (d.isWebkit > 0 && h(a, "position") == "absolute")) {
			j.top -= l.body.offsetTop
		}
		m = a.offsetParent;
		while (m && m != l.body) {
			j.left -= m.scrollLeft;
			if (!d.opera || m.tagName != "TR") {
				j.top -= m.scrollTop
			}
			m = m.offsetParent
		}
	}
	return j
};
(function() {
	var o, n, h, f, r, j, s, a, q, g = baidu.lang.isFunction, d, l, c;
	baidu.dom.drag = function(u, t) {
		q = a = null;
		if (!(o = baidu.dom.g(u))) {
			return false
		}
		n = baidu.object.extend( {
			autoStop : true,
			capture : true,
			interval : 20
		}, t);
		l = baidu.dom.getPosition(o.offsetParent);
		c = baidu.dom.getPosition(o);
		if (baidu.getStyle(o, "position") == "absolute") {
			r = c.top - (o.offsetParent == document.body ? 0 : l.top);
			j = c.left - (o.offsetParent == document.body ? 0 : l.left)
		} else {
			r = parseFloat(baidu.getStyle(o, "top"))
					|| -parseFloat(baidu.getStyle(o, "bottom")) || 0;
			j = parseFloat(baidu.getStyle(o, "left"))
					|| -parseFloat(baidu.getStyle(o, "right")) || 0
		}
		if (n.mouseEvent) {
			h = baidu.page.getScrollLeft() + n.mouseEvent.clientX;
			f = baidu.page.getScrollTop() + n.mouseEvent.clientY
		} else {
			var v = baidu.page.getMousePosition();
			h = v.x;
			f = v.y
		}
		d = setInterval(b, n.interval);
		n.autoStop && baidu.event.on(document, "mouseup", p);
		baidu.event.on(document.body, "selectstart", k);
		if (n.capture && o.setCapture) {
			o.setCapture()
		} else {
			if (n.capture && window.captureEvents) {
				window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
			}
		}
		s = document.body.style.MozUserSelect;
		document.body.style.MozUserSelect = "none";
		if (g(n.ondragstart)) {
			n.ondragstart(o, n)
		}
		return {
			stop : p,
			update : m
		}
	};
	function m(t) {
		baidu.extend(n, t)
	}
	function p() {
		clearTimeout(d);
		if (n.capture && o.releaseCapture) {
			o.releaseCapture()
		} else {
			if (n.capture && window.releaseEvents) {
				window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP)
			}
		}
		document.body.style.MozUserSelect = s;
		baidu.event.un(document.body, "selectstart", k);
		n.autoStop && baidu.event.un(document, "mouseup", p);
		if (g(n.ondragend)) {
			n.ondragend(o, n)
		}
	}
	function b(x) {
		var t = n.range, w = baidu.page.getMousePosition(), u = j + w.x - h, v = r
				+ w.y - f;
		if (typeof t == "object" && t && t.length == 4) {
			u = Math.max(t[3], u);
			u = Math.min(t[1] - o.offsetWidth, u);
			v = Math.max(t[0], v);
			v = Math.min(t[2] - o.offsetHeight, v)
		}
		o.style.top = v + "px";
		o.style.left = u + "px";
		if ((a !== u || q !== v) && (a !== null || q !== null)) {
			if (g(n.ondrag)) {
				n.ondrag(o, n)
			}
		}
		a = u;
		q = v
	}
	function k(t) {
		return baidu.event.preventDefault(t, false)
	}
})();
baidu.dom.setStyle = function(c, b, d) {
	var f = baidu.dom, a;
	c = f.g(c);
	b = baidu.string.toCamelCase(b);
	if (a = f._styleFilter) {
		d = a.filter(b, d, "set")
	}
	a = f._styleFixer[b];
	(a && a.set) ? a.set(c, d) : (c.style[a || b] = d);
	return c
};
baidu.setStyle = baidu.dom.setStyle;
baidu.dom.draggable = function(b, l) {
	l = baidu.object.extend( {
		toggle : function() {
			return true
		}
	}, l || {});
	l.autoStop = true;
	b = baidu.dom.g(b);
	l.handler = l.handler || b;
	var a, j = [ "ondragstart", "ondrag", "ondragend" ], c = j.length - 1, d, k, g = {
		dispose : function() {
			k && k.stop();
			baidu.event.un(l.handler, "onmousedown", h);
			baidu.lang.Class.prototype.dispose.call(g)
		}
	}, f = this;
	if (a = baidu.dom.ddManager) {
		for (; c >= 0; c--) {
			d = j[c];
			l[d] = (function(m) {
				var n = l[m];
				return function() {
					baidu.lang.isFunction(n) && n.apply(f, arguments);
					a.dispatchEvent(m, {
						DOM : b
					})
				}
			})(d)
		}
	}
	if (b) {
		function h(n) {
			var m = l.mouseEvent = window.event || n;
			if (m.button > 1
					|| (baidu.lang.isFunction(l.toggle) && !l.toggle())) {
				return
			}
			if (baidu.dom.getStyle(b, "position") == "static") {
				baidu.dom.setStyle(b, "position", "relative")
			}
			if (baidu.lang.isFunction(l.onbeforedragstart)) {
				l.onbeforedragstart(b)
			}
			k = baidu.dom.drag(b, l);
			g.stop = k.stop;
			g.update = k.update;
			baidu.event.preventDefault(m)
		}
		baidu.event.on(l.handler, "onmousedown", h)
	}
	return {
		cancel : function() {
			g.dispose()
		}
	}
};
baidu.dom.intersect = function(k, j) {
	var h = baidu.dom.g, f = baidu.dom.getPosition, a = Math.max, c = Math.min;
	k = h(k);
	j = h(j);
	var d = f(k), b = f(j);
	return a(d.left, b.left) <= c(d.left + k.offsetWidth, b.left
			+ j.offsetWidth)
			&& a(d.top, b.top) <= c(d.top + k.offsetHeight, b.top
					+ j.offsetHeight)
};
baidu.dom.droppable = function(f, c) {
	c = c || {};
	var d = baidu.dom.ddManager, h = baidu.dom.g(f), b = baidu.lang.guid(), g = function(
			l) {
		var k = d._targetsDroppingOver, j = {
			trigger : l.DOM,
			reciever : h
		};
		if (baidu.dom.intersect(h, l.DOM)) {
			if (!k[b]) {
				(typeof c.ondropover == "function") && c.ondropover.call(h, j);
				d.dispatchEvent("ondropover", j);
				k[b] = true
			}
		} else {
			if (k[b]) {
				(typeof c.ondropout == "function") && c.ondropout.call(h, j);
				d.dispatchEvent("ondropout", j)
			}
			delete k[b]
		}
	}, a = function(k) {
		var j = {
			trigger : k.DOM,
			reciever : h
		};
		if (baidu.dom.intersect(h, k.DOM)) {
			typeof c.ondrop == "function" && c.ondrop.call(h, j);
			d.dispatchEvent("ondrop", j)
		}
		delete d._targetsDroppingOver[b]
	};
	d.addEventListener("ondrag", g);
	d.addEventListener("ondragend", a);
	return {
		cancel : function() {
			d.removeEventListener("ondrag", g);
			d.removeEventListener("ondragend", a)
		}
	}
};
baidu.dom.empty = function(a) {
	a = baidu.dom.g(a);
	while (a.firstChild) {
		a.removeChild(a.firstChild)
	}
	return a
};
baidu.dom.first = function(a) {
	return baidu.dom._matchNode(a, "nextSibling", "firstChild")
};
baidu.dom.getAncestorBy = function(a, b) {
	a = baidu.dom.g(a);
	while ((a = a.parentNode) && a.nodeType == 1) {
		if (b(a)) {
			return a
		}
	}
	return null
};
baidu.dom.getAncestorByClass = function(a, b) {
	a = baidu.dom.g(a);
	b = new RegExp("(^|\\s)" + baidu.string.trim(b) + "(\\s|\x24)");
	while ((a = a.parentNode) && a.nodeType == 1) {
		if (b.test(a.className)) {
			return a
		}
	}
	return null
};
baidu.dom.getAncestorByTag = function(b, a) {
	b = baidu.dom.g(b);
	a = a.toUpperCase();
	while ((b = b.parentNode) && b.nodeType == 1) {
		if (b.tagName == a) {
			return b
		}
	}
	return null
};
baidu.dom.getAttr = function(b, a) {
	b = baidu.dom.g(b);
	if ("style" == a) {
		return b.style.cssText
	}
	a = baidu.dom._NAME_ATTRS[a] || a;
	return b.getAttribute(a)
};
baidu.getAttr = baidu.dom.getAttr;
baidu.dom.getParent = function(a) {
	a = baidu.dom._g(a);
	return a.parentElement || a.parentNode || null
};
baidu.dom.getText = function(d) {
	var b = "", f, c = 0, a;
	d = baidu._g(d);
	if (d.nodeType === 3 || d.nodeType === 4) {
		b += d.nodeValue
	} else {
		if (d.nodeType !== 8) {
			f = d.childNodes;
			for (a = f.length; c < a; c++) {
				b += baidu.dom.getText(f[c])
			}
		}
	}
	return b
};
baidu.dom.getWindow = function(a) {
	a = baidu.dom.g(a);
	var b = baidu.dom.getDocument(a);
	return b.parentWindow || b.defaultView || null
};
baidu.dom.hasAttr = function(c, b) {
	c = baidu.g(c);
	var a = c.attributes.getNamedItem(b);
	return !!(a && a.specified)
};
baidu.dom.hasClass = function(c, d) {
	c = baidu.dom.g(c);
	var b = baidu.string.trim(d).split(/\s+/), a = b.length;
	d = c.className.split(/\s+/).join(" ");
	while (a--) {
		if (!(new RegExp("(^| )" + b[a] + "( |\x24)")).test(d)) {
			return false
		}
	}
	return true
};
baidu.dom.hide = function(a) {
	a = baidu.dom.g(a);
	a.style.display = "none";
	return a
};
baidu.hide = baidu.dom.hide;
baidu.dom.insertAfter = function(d, c) {
	var b, a;
	b = baidu.dom._g;
	d = b(d);
	c = b(c);
	a = c.parentNode;
	if (a) {
		a.insertBefore(d, c.nextSibling)
	}
	return d
};
baidu.dom.insertBefore = function(d, c) {
	var b, a;
	b = baidu.dom._g;
	d = b(d);
	c = b(c);
	a = c.parentNode;
	if (a) {
		a.insertBefore(d, c)
	}
	return d
};
baidu.dom.insertHTML = function(d, a, c) {
	d = baidu.dom.g(d);
	var b, f;
	if (d.insertAdjacentHTML) {
		d.insertAdjacentHTML(a, c)
	} else {
		b = d.ownerDocument.createRange();
		a = a.toUpperCase();
		if (a == "AFTERBEGIN" || a == "BEFOREEND") {
			b.selectNodeContents(d);
			b.collapse(a == "AFTERBEGIN")
		} else {
			f = a == "BEFOREBEGIN";
			b[f ? "setStartBefore" : "setEndAfter"](d);
			b.collapse(f)
		}
		b.insertNode(b.createContextualFragment(c))
	}
	return d
};
baidu.insertHTML = baidu.dom.insertHTML;
baidu.dom.last = function(a) {
	return baidu.dom._matchNode(a, "previousSibling", "lastChild")
};
baidu.dom.next = function(a) {
	return baidu.dom._matchNode(a, "nextSibling", "nextSibling")
};
baidu.dom.prev = function(a) {
	return baidu.dom._matchNode(a, "previousSibling", "previousSibling")
};
baidu.string.escapeReg = function(a) {
	return String(a).replace(new RegExp("([.*+?^=!:\x24{}()|[\\]/\\\\])", "g"),
			"\\\x241")
};
baidu.dom.q = function(j, f, b) {
	var k = [], d = baidu.string.trim, h, g, a, c;
	if (!(j = d(j))) {
		return k
	}
	if ("undefined" == typeof f) {
		f = document
	} else {
		f = baidu.dom.g(f);
		if (!f) {
			return k
		}
	}
	b && (b = d(b).toUpperCase());
	if (f.getElementsByClassName) {
		a = f.getElementsByClassName(j);
		h = a.length;
		for (g = 0; g < h; g++) {
			c = a[g];
			if (b && c.tagName != b) {
				continue
			}
			k[k.length] = c
		}
	} else {
		j = new RegExp("(^|\\s)" + baidu.string.escapeReg(j) + "(\\s|\x24)");
		a = b ? f.getElementsByTagName(b) : (f.all || f
				.getElementsByTagName("*"));
		h = a.length;
		for (g = 0; g < h; g++) {
			c = a[g];
			j.test(c.className) && (k[k.length] = c)
		}
	}
	return k
};
baidu.q = baidu.Q = baidu.dom.q;
/*
 * Sizzle CSS Selector Engine - v1.0 Copyright 2009, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses. More information:
 * http://sizzlejs.com/
 */
(function() {
	var r = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, k = 0, d = Object.prototype.toString, q = false, j = true;
	[ 0, 0 ].sort(function() {
		j = false;
		return 0
	});
	var b = function(y, t, B, C) {
		B = B || [];
		t = t || document;
		var E = t;
		if (t.nodeType !== 1 && t.nodeType !== 9) {
			return []
		}
		if (!y || typeof y !== "string") {
			return B
		}
		var v, G, J, u, F, I, H, A, x = true, w = b.isXML(t), z = [], D = y;
		do {
			r.exec("");
			v = r.exec(D);
			if (v) {
				D = v[3];
				z.push(v[1]);
				if (v[2]) {
					u = v[3];
					break
				}
			}
		} while (v);
		if (z.length > 1 && l.exec(y)) {
			if (z.length === 2 && f.relative[z[0]]) {
				G = h(z[0] + z[1], t)
			} else {
				G = f.relative[z[0]] ? [ t ] : b(z.shift(), t);
				while (z.length) {
					y = z.shift();
					if (f.relative[y]) {
						y += z.shift()
					}
					G = h(y, G)
				}
			}
		} else {
			if (!C && z.length > 1 && t.nodeType === 9 && !w
					&& f.match.ID.test(z[0])
					&& !f.match.ID.test(z[z.length - 1])) {
				F = b.find(z.shift(), t, w);
				t = F.expr ? b.filter(F.expr, F.set)[0] : F.set[0]
			}
			if (t) {
				F = C ? {
					expr : z.pop(),
					set : a(C)
				} : b.find(z.pop(),
						z.length === 1 && (z[0] === "~" || z[0] === "+")
								&& t.parentNode ? t.parentNode : t, w);
				G = F.expr ? b.filter(F.expr, F.set) : F.set;
				if (z.length > 0) {
					J = a(G)
				} else {
					x = false
				}
				while (z.length) {
					I = z.pop();
					H = I;
					if (!f.relative[I]) {
						I = ""
					} else {
						H = z.pop()
					}
					if (H == null) {
						H = t
					}
					f.relative[I](J, H, w)
				}
			} else {
				J = z = []
			}
		}
		if (!J) {
			J = G
		}
		if (!J) {
			b.error(I || y)
		}
		if (d.call(J) === "[object Array]") {
			if (!x) {
				B.push.apply(B, J)
			} else {
				if (t && t.nodeType === 1) {
					for (A = 0; J[A] != null; A++) {
						if (J[A]
								&& (J[A] === true || J[A].nodeType === 1
										&& b.contains(t, J[A]))) {
							B.push(G[A])
						}
					}
				} else {
					for (A = 0; J[A] != null; A++) {
						if (J[A] && J[A].nodeType === 1) {
							B.push(G[A])
						}
					}
				}
			}
		} else {
			a(J, B)
		}
		if (u) {
			b(u, E, B, C);
			b.uniqueSort(B)
		}
		return B
	};
	b.uniqueSort = function(u) {
		if (c) {
			q = j;
			u.sort(c);
			if (q) {
				for ( var t = 1; t < u.length; t++) {
					if (u[t] === u[t - 1]) {
						u.splice(t--, 1)
					}
				}
			}
		}
		return u
	};
	b.matches = function(t, u) {
		return b(t, null, null, u)
	};
	b.matchesSelector = function(t, u) {
		return b(u, null, null, [ t ]).length > 0
	};
	b.find = function(A, t, B) {
		var z;
		if (!A) {
			return []
		}
		for ( var w = 0, v = f.order.length; w < v; w++) {
			var x, y = f.order[w];
			if ((x = f.leftMatch[y].exec(A))) {
				var u = x[1];
				x.splice(1, 1);
				if (u.substr(u.length - 1) !== "\\") {
					x[1] = (x[1] || "").replace(/\\/g, "");
					z = f.find[y](x, t, B);
					if (z != null) {
						A = A.replace(f.match[y], "");
						break
					}
				}
			}
		}
		if (!z) {
			z = t.getElementsByTagName("*")
		}
		return {
			set : z,
			expr : A
		}
	};
	b.filter = function(E, D, H, x) {
		var z, t, v = E, J = [], B = D, A = D && D[0] && b.isXML(D[0]);
		while (E && D.length) {
			for ( var C in f.filter) {
				if ((z = f.leftMatch[C].exec(E)) != null && z[2]) {
					var I, G, u = f.filter[C], w = z[1];
					t = false;
					z.splice(1, 1);
					if (w.substr(w.length - 1) === "\\") {
						continue
					}
					if (B === J) {
						J = []
					}
					if (f.preFilter[C]) {
						z = f.preFilter[C](z, B, H, J, x, A);
						if (!z) {
							t = I = true
						} else {
							if (z === true) {
								continue
							}
						}
					}
					if (z) {
						for ( var y = 0; (G = B[y]) != null; y++) {
							if (G) {
								I = u(G, z, y, B);
								var F = x ^ !!I;
								if (H && I != null) {
									if (F) {
										t = true
									} else {
										B[y] = false
									}
								} else {
									if (F) {
										J.push(G);
										t = true
									}
								}
							}
						}
					}
					if (I !== undefined) {
						if (!H) {
							B = J
						}
						E = E.replace(f.match[C], "");
						if (!t) {
							return []
						}
						break
					}
				}
			}
			if (E === v) {
				if (t == null) {
					b.error(E)
				} else {
					break
				}
			}
			v = E
		}
		return B
	};
	b.error = function(t) {
		throw "Syntax error, unrecognized expression: " + t
	};
	var f = b.selectors = {
		order : [ "ID", "NAME", "TAG" ],
		match : {
			ID : /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			CLASS : /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			NAME : /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
			ATTR : /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
			TAG : /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
			CHILD : /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
			POS : /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
			PSEUDO : /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
		},
		leftMatch : {},
		attrMap : {
			"class" : "className",
			"for" : "htmlFor"
		},
		attrHandle : {
			href : function(t) {
				return t.getAttribute("href")
			}
		},
		relative : {
			"+" : function(z, u) {
				var w = typeof u === "string", y = w && !/\W/.test(u), A = w
						&& !y;
				if (y) {
					u = u.toLowerCase()
				}
				for ( var v = 0, t = z.length, x; v < t; v++) {
					if ((x = z[v])) {
						while ((x = x.previousSibling) && x.nodeType !== 1) {
						}
						z[v] = A || x && x.nodeName.toLowerCase() === u ? x || false
								: x === u
					}
				}
				if (A) {
					b.filter(u, z, true)
				}
			},
			">" : function(z, u) {
				var y, x = typeof u === "string", v = 0, t = z.length;
				if (x && !/\W/.test(u)) {
					u = u.toLowerCase();
					for (; v < t; v++) {
						y = z[v];
						if (y) {
							var w = y.parentNode;
							z[v] = w.nodeName.toLowerCase() === u ? w : false
						}
					}
				} else {
					for (; v < t; v++) {
						y = z[v];
						if (y) {
							z[v] = x ? y.parentNode : y.parentNode === u
						}
					}
					if (x) {
						b.filter(u, z, true)
					}
				}
			},
			"" : function(w, u, y) {
				var x, v = k++, t = s;
				if (typeof u === "string" && !/\W/.test(u)) {
					u = u.toLowerCase();
					x = u;
					t = p
				}
				t("parentNode", u, v, w, x, y)
			},
			"~" : function(w, u, y) {
				var x, v = k++, t = s;
				if (typeof u === "string" && !/\W/.test(u)) {
					u = u.toLowerCase();
					x = u;
					t = p
				}
				t("previousSibling", u, v, w, x, y)
			}
		},
		find : {
			ID : function(u, v, w) {
				if (typeof v.getElementById !== "undefined" && !w) {
					var t = v.getElementById(u[1]);
					return t && t.parentNode ? [ t ] : []
				}
			},
			NAME : function(v, y) {
				if (typeof y.getElementsByName !== "undefined") {
					var u = [], x = y.getElementsByName(v[1]);
					for ( var w = 0, t = x.length; w < t; w++) {
						if (x[w].getAttribute("name") === v[1]) {
							u.push(x[w])
						}
					}
					return u.length === 0 ? null : u
				}
			},
			TAG : function(t, u) {
				return u.getElementsByTagName(t[1])
			}
		},
		preFilter : {
			CLASS : function(w, u, v, t, z, A) {
				w = " " + w[1].replace(/\\/g, "") + " ";
				if (A) {
					return w
				}
				for ( var x = 0, y; (y = u[x]) != null; x++) {
					if (y) {
						if (z
								^ (y.className && (" " + y.className + " ")
										.replace(/[\t\n\r]/g, " ").indexOf(w) >= 0)) {
							if (!v) {
								t.push(y)
							}
						} else {
							if (v) {
								u[x] = false
							}
						}
					}
				}
				return false
			},
			ID : function(t) {
				return t[1].replace(/\\/g, "")
			},
			TAG : function(u, t) {
				return u[1].toLowerCase()
			},
			CHILD : function(t) {
				if (t[1] === "nth") {
					if (!t[2]) {
						b.error(t[0])
					}
					t[2] = t[2].replace(/^\+|\s*/g, "");
					var u = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(t[2] === "even"
							&& "2n" || t[2] === "odd" && "2n+1"
							|| !/\D/.test(t[2]) && "0n+" + t[2] || t[2]);
					t[2] = (u[1] + (u[2] || 1)) - 0;
					t[3] = u[3] - 0
				} else {
					if (t[2]) {
						b.error(t[0])
					}
				}
				t[0] = k++;
				return t
			},
			ATTR : function(x, u, v, t, y, z) {
				var w = x[1].replace(/\\/g, "");
				if (!z && f.attrMap[w]) {
					x[1] = f.attrMap[w]
				}
				if (x[2] === "~=") {
					x[4] = " " + x[4] + " "
				}
				return x
			},
			PSEUDO : function(x, u, v, t, y) {
				if (x[1] === "not") {
					if ((r.exec(x[3]) || "").length > 1 || /^\w/.test(x[3])) {
						x[3] = b(x[3], null, null, u)
					} else {
						var w = b.filter(x[3], u, v, true ^ y);
						if (!v) {
							t.push.apply(t, w)
						}
						return false
					}
				} else {
					if (f.match.POS.test(x[0]) || f.match.CHILD.test(x[0])) {
						return true
					}
				}
				return x
			},
			POS : function(t) {
				t.unshift(true);
				return t
			}
		},
		filters : {
			enabled : function(t) {
				return t.disabled === false && t.type !== "hidden"
			},
			disabled : function(t) {
				return t.disabled === true
			},
			checked : function(t) {
				return t.checked === true
			},
			selected : function(t) {
				t.parentNode.selectedIndex;
				return t.selected === true
			},
			parent : function(t) {
				return !!t.firstChild
			},
			empty : function(t) {
				return !t.firstChild
			},
			has : function(v, u, t) {
				return !!b(t[3], v).length
			},
			header : function(t) {
				return (/h\d/i).test(t.nodeName)
			},
			text : function(t) {
				return "text" === t.type
			},
			radio : function(t) {
				return "radio" === t.type
			},
			checkbox : function(t) {
				return "checkbox" === t.type
			},
			file : function(t) {
				return "file" === t.type
			},
			password : function(t) {
				return "password" === t.type
			},
			submit : function(t) {
				return "submit" === t.type
			},
			image : function(t) {
				return "image" === t.type
			},
			reset : function(t) {
				return "reset" === t.type
			},
			button : function(t) {
				return "button" === t.type
						|| t.nodeName.toLowerCase() === "button"
			},
			input : function(t) {
				return (/input|select|textarea|button/i).test(t.nodeName)
			}
		},
		setFilters : {
			first : function(u, t) {
				return t === 0
			},
			last : function(v, u, t, w) {
				return u === w.length - 1
			},
			even : function(u, t) {
				return t % 2 === 0
			},
			odd : function(u, t) {
				return t % 2 === 1
			},
			lt : function(v, u, t) {
				return u < t[3] - 0
			},
			gt : function(v, u, t) {
				return u > t[3] - 0
			},
			nth : function(v, u, t) {
				return t[3] - 0 === u
			},
			eq : function(v, u, t) {
				return t[3] - 0 === u
			}
		},
		filter : {
			PSEUDO : function(v, A, z, B) {
				var t = A[1], u = f.filters[t];
				if (u) {
					return u(v, z, A, B)
				} else {
					if (t === "contains") {
						return (v.textContent || v.innerText
								|| b.getText( [ v ]) || "").indexOf(A[3]) >= 0
					} else {
						if (t === "not") {
							var w = A[3];
							for ( var y = 0, x = w.length; y < x; y++) {
								if (w[y] === v) {
									return false
								}
							}
							return true
						} else {
							b.error(t)
						}
					}
				}
			},
			CHILD : function(t, w) {
				var z = w[1], u = t;
				switch (z) {
				case "only":
				case "first":
					while ((u = u.previousSibling)) {
						if (u.nodeType === 1) {
							return false
						}
					}
					if (z === "first") {
						return true
					}
					u = t;
				case "last":
					while ((u = u.nextSibling)) {
						if (u.nodeType === 1) {
							return false
						}
					}
					return true;
				case "nth":
					var v = w[2], C = w[3];
					if (v === 1 && C === 0) {
						return true
					}
					var y = w[0], B = t.parentNode;
					if (B && (B.sizcache !== y || !t.nodeIndex)) {
						var x = 0;
						for (u = B.firstChild; u; u = u.nextSibling) {
							if (u.nodeType === 1) {
								u.nodeIndex = ++x
							}
						}
						B.sizcache = y
					}
					var A = t.nodeIndex - C;
					if (v === 0) {
						return A === 0
					} else {
						return (A % v === 0 && A / v >= 0)
					}
				}
			},
			ID : function(u, t) {
				return u.nodeType === 1 && u.getAttribute("id") === t
			},
			TAG : function(u, t) {
				return (t === "*" && u.nodeType === 1)
						|| u.nodeName.toLowerCase() === t
			},
			CLASS : function(u, t) {
				return (" " + (u.className || u.getAttribute("class")) + " ")
						.indexOf(t) > -1
			},
			ATTR : function(y, w) {
				var v = w[1], t = f.attrHandle[v] ? f.attrHandle[v](y)
						: y[v] != null ? y[v] : y.getAttribute(v), z = t + "", x = w[2], u = w[4];
				return t == null ? x === "!="
						: x === "=" ? z === u
								: x === "*=" ? z.indexOf(u) >= 0
										: x === "~=" ? (" " + z + " ")
												.indexOf(u) >= 0
												: !u ? z && t !== false
														: x === "!=" ? z !== u
																: x === "^=" ? z
																		.indexOf(u) === 0
																		: x === "$=" ? z
																				.substr(z.length
																						- u.length) === u
																				: x === "|=" ? z === u
																						|| z
																								.substr(
																										0,
																										u.length + 1) === u
																								+ "-"
																						: false
			},
			POS : function(x, u, v, y) {
				var t = u[2], w = f.setFilters[t];
				if (w) {
					return w(x, v, u, y)
				}
			}
		}
	};
	var l = f.match.POS, g = function(u, t) {
		return "\\" + (t - 0 + 1)
	};
	for ( var o in f.match) {
		f.match[o] = new RegExp(f.match[o].source
				+ (/(?![^\[]*\])(?![^\(]*\))/.source));
		f.leftMatch[o] = new RegExp(/(^(?:.|\r|\n)*?)/.source
				+ f.match[o].source.replace(/\\(\d+)/g, g))
	}
	var a = function(u, t) {
		u = Array.prototype.slice.call(u, 0);
		if (t) {
			t.push.apply(t, u);
			return t
		}
		return u
	};
	try {
		Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType
	} catch (m) {
		a = function(x, w) {
			var v = 0, u = w || [];
			if (d.call(x) === "[object Array]") {
				Array.prototype.push.apply(u, x)
			} else {
				if (typeof x.length === "number") {
					for ( var t = x.length; v < t; v++) {
						u.push(x[v])
					}
				} else {
					for (; x[v]; v++) {
						u.push(x[v])
					}
				}
			}
			return u
		}
	}
	var c, n;
	if (document.documentElement.compareDocumentPosition) {
		c = function(u, t) {
			if (u === t) {
				q = true;
				return 0
			}
			if (!u.compareDocumentPosition || !t.compareDocumentPosition) {
				return u.compareDocumentPosition ? -1 : 1
			}
			return u.compareDocumentPosition(t) & 4 ? -1 : 1
		}
	} else {
		c = function(B, A) {
			var y, u, v = [], t = [], x = B.parentNode, z = A.parentNode, C = x;
			if (B === A) {
				q = true;
				return 0
			} else {
				if (x === z) {
					return n(B, A)
				} else {
					if (!x) {
						return -1
					} else {
						if (!z) {
							return 1
						}
					}
				}
			}
			while (C) {
				v.unshift(C);
				C = C.parentNode
			}
			C = z;
			while (C) {
				t.unshift(C);
				C = C.parentNode
			}
			y = v.length;
			u = t.length;
			for ( var w = 0; w < y && w < u; w++) {
				if (v[w] !== t[w]) {
					return n(v[w], t[w])
				}
			}
			return w === y ? n(B, t[w], -1) : n(v[w], A, 1)
		};
		n = function(u, t, v) {
			if (u === t) {
				return v
			}
			var w = u.nextSibling;
			while (w) {
				if (w === t) {
					return -1
				}
				w = w.nextSibling
			}
			return 1
		}
	}
	b.getText = function(t) {
		var u = "", w;
		for ( var v = 0; t[v]; v++) {
			w = t[v];
			if (w.nodeType === 3 || w.nodeType === 4) {
				u += w.nodeValue
			} else {
				if (w.nodeType !== 8) {
					u += b.getText(w.childNodes)
				}
			}
		}
		return u
	};
	(function() {
		var u = document.createElement("div"), v = "script"
				+ (new Date()).getTime(), t = document.documentElement;
		u.innerHTML = "<a name='" + v + "'/>";
		t.insertBefore(u, t.firstChild);
		if (document.getElementById(v)) {
			f.find.ID = function(x, y, z) {
				if (typeof y.getElementById !== "undefined" && !z) {
					var w = y.getElementById(x[1]);
					return w ? w.id === x[1]
							|| typeof w.getAttributeNode !== "undefined"
							&& w.getAttributeNode("id").nodeValue === x[1] ? [ w ]
							: undefined
							: []
				}
			};
			f.filter.ID = function(y, w) {
				var x = typeof y.getAttributeNode !== "undefined"
						&& y.getAttributeNode("id");
				return y.nodeType === 1 && x && x.nodeValue === w
			}
		}
		t.removeChild(u);
		t = u = null
	})();
	(function() {
		var u = document.createElement("div");
		try {
			u.appendChild(document.createComment(""))
		} catch (t) {
		}
		if (u.getElementsByTagName("*").length > 0) {
			f.find.TAG = function(v, z) {
				var y = z.getElementsByTagName(v[1]);
				if (v[1] === "*") {
					var x = [];
					for ( var w = 0; y[w]; w++) {
						if (y[w].nodeType === 1) {
							x.push(y[w])
						}
					}
					y = x
				}
				return y
			}
		}
		u.innerHTML = "<a href='#'></a>";
		if (u.firstChild && typeof u.firstChild.getAttribute !== "undefined"
				&& u.firstChild.getAttribute("href") !== "#") {
			f.attrHandle.href = function(v) {
				return v.getAttribute("href", 2)
			}
		}
		u = null
	})();
	if (document.querySelectorAll) {
		(function() {
			var t = b, w = document.createElement("div"), v = "__sizzle__";
			w.innerHTML = "<p class='TEST'></p>";
			if (w.querySelectorAll && w.querySelectorAll(".TEST").length === 0) {
				return
			}
			b = function(E, y, A, D) {
				y = y || document;
				E = E.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
				if (!D && !b.isXML(y)) {
					if (y.nodeType === 9) {
						try {
							return a(y.querySelectorAll(E), A)
						} catch (B) {
						}
					} else {
						if (y.nodeType === 1
								&& y.nodeName.toLowerCase() !== "object") {
							var z = y.getAttribute("id"), x = z || v, G = y.parentNode, F = /^\s*[+~]/
									.test(E);
							if (!z) {
								y.setAttribute("id", x)
							} else {
								x = x.replace(/'/g, "\\$&")
							}
							if (F && G) {
								y = y.parentNode
							}
							try {
								if (!F || G) {
									return a(y.querySelectorAll("[id='" + x
											+ "'] " + E), A)
								}
							} catch (C) {
							} finally {
								if (!z) {
									y.removeAttribute("id")
								}
							}
						}
					}
				}
				return t(E, y, A, D)
			};
			for ( var u in t) {
				b[u] = t[u]
			}
			w = null
		})()
	}
	(function() {
		var t = document.documentElement, v = t.matchesSelector
				|| t.mozMatchesSelector || t.webkitMatchesSelector
				|| t.msMatchesSelector, u = false;
		try {
			v.call(document.documentElement, "[test!='']:sizzle")
		} catch (w) {
			u = true
		}
		if (v) {
			b.matchesSelector = function(x, z) {
				z = z.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
				if (!b.isXML(x)) {
					try {
						if (u || !f.match.PSEUDO.test(z) && !/!=/.test(z)) {
							return v.call(x, z)
						}
					} catch (y) {
					}
				}
				return b(z, null, null, [ x ]).length > 0
			}
		}
	})();
	(function() {
		var t = document.createElement("div");
		t.innerHTML = "<div class='test e'></div><div class='test'></div>";
		if (!t.getElementsByClassName
				|| t.getElementsByClassName("e").length === 0) {
			return
		}
		t.lastChild.className = "e";
		if (t.getElementsByClassName("e").length === 1) {
			return
		}
		f.order.splice(1, 0, "CLASS");
		f.find.CLASS = function(u, v, w) {
			if (typeof v.getElementsByClassName !== "undefined" && !w) {
				return v.getElementsByClassName(u[1])
			}
		};
		t = null
	})();
	function p(u, z, y, C, A, B) {
		for ( var w = 0, v = C.length; w < v; w++) {
			var t = C[w];
			if (t) {
				var x = false;
				t = t[u];
				while (t) {
					if (t.sizcache === y) {
						x = C[t.sizset];
						break
					}
					if (t.nodeType === 1 && !B) {
						t.sizcache = y;
						t.sizset = w
					}
					if (t.nodeName.toLowerCase() === z) {
						x = t;
						break
					}
					t = t[u]
				}
				C[w] = x
			}
		}
	}
	function s(u, z, y, C, A, B) {
		for ( var w = 0, v = C.length; w < v; w++) {
			var t = C[w];
			if (t) {
				var x = false;
				t = t[u];
				while (t) {
					if (t.sizcache === y) {
						x = C[t.sizset];
						break
					}
					if (t.nodeType === 1) {
						if (!B) {
							t.sizcache = y;
							t.sizset = w
						}
						if (typeof z !== "string") {
							if (t === z) {
								x = true;
								break
							}
						} else {
							if (b.filter(z, [ t ]).length > 0) {
								x = t;
								break
							}
						}
					}
					t = t[u]
				}
				C[w] = x
			}
		}
	}
	if (document.documentElement.contains) {
		b.contains = function(u, t) {
			return u !== t && (u.contains ? u.contains(t) : true)
		}
	} else {
		if (document.documentElement.compareDocumentPosition) {
			b.contains = function(u, t) {
				return !!(u.compareDocumentPosition(t) & 16)
			}
		} else {
			b.contains = function() {
				return false
			}
		}
	}
	b.isXML = function(t) {
		var u = (t ? t.ownerDocument || t : 0).documentElement;
		return u ? u.nodeName !== "HTML" : false
	};
	var h = function(t, A) {
		var y, w = [], x = "", v = A.nodeType ? [ A ] : A;
		while ((y = f.match.PSEUDO.exec(t))) {
			x += y[0];
			t = t.replace(f.match.PSEUDO, "")
		}
		t = f.relative[t] ? t + "*" : t;
		for ( var z = 0, u = v.length; z < u; z++) {
			b(t, v[z], w)
		}
		return b.filter(x, w)
	};
	baidu.dom.query = b
})();
(function() {
	var a = baidu.dom.ready = function() {
		var f = false, d = [];
		function b() {
			if (!b.isReady) {
				b.isReady = true;
				for ( var h = 0, g = d.length; h < g; h++) {
					d[h]()
				}
			}
		}
		function c() {
			if (f) {
				return
			}
			f = true;
			var k = document, h = window, g = baidu.browser.opera;
			if (k.addEventListener) {
				k.addEventListener("DOMContentLoaded", g ? function() {
					if (b.isReady) {
						return
					}
					for ( var l = 0; l < k.styleSheets.length; l++) {
						if (k.styleSheets[l].disabled) {
							setTimeout(arguments.callee, 0);
							return
						}
					}
					b()
				} : b, false)
			} else {
				if (baidu.browser.ie && h == top) {
					(function() {
						if (b.isReady) {
							return
						}
						try {
							k.documentElement.doScroll("left")
						} catch (l) {
							setTimeout(arguments.callee, 0);
							return
						}
						b()
					})()
				} else {
					if (baidu.browser.safari) {
						var j;
						(function() {
							if (b.isReady) {
								return
							}
							if (k.readyState != "loaded"
									&& k.readyState != "complete") {
								setTimeout(arguments.callee, 0);
								return
							}
							if (j === undefined) {
								j = 0;
								var o = k.getElementsByTagName("style"), m = k
										.getElementsByTagName("link");
								if (o) {
									j += o.length
								}
								if (m) {
									for ( var n = 0, l = m.length; n < l; n++) {
										if (m[n].getAttribute("rel") == "stylesheet") {
											j++
										}
									}
								}
							}
							if (k.styleSheets.length != j) {
								setTimeout(arguments.callee, 0);
								return
							}
							b()
						})()
					}
				}
			}
			h.attachEvent ? h.attachEvent("onload", b) : h.addEventListener(
					"load", b, false)
		}
		c();
		return function(g) {
			b.isReady ? g() : (d[d.length] = g)
		}
	}();
	a.isReady = false
})();
baidu.dom.remove = function(a) {
	a = baidu.dom._g(a);
	var b = a.parentNode;
	b && b.removeChild(a)
};
baidu.dom.removeClass = function(g, h) {
	g = baidu.dom.g(g);
	var d = g.className.split(/\s+/), k = h.split(/\s+/), b, a = k.length, c, f = 0;
	for (; f < a; ++f) {
		for (c = 0, b = d.length; c < b; ++c) {
			if (d[c] == k[f]) {
				d.splice(c, 1);
				break
			}
		}
	}
	g.className = d.join(" ");
	return g
};
baidu.removeClass = baidu.dom.removeClass;
baidu.dom.removeStyle = function() {
	var b = document.createElement("DIV"), a, c = baidu.dom._g;
	if (b.style.removeProperty) {
		a = function(f, d) {
			f = c(f);
			f.style.removeProperty(d);
			return f
		}
	} else {
		if (b.style.removeAttribute) {
			a = function(f, d) {
				f = c(f);
				f.style.removeAttribute(baidu.string.toCamelCase(d));
				return f
			}
		}
	}
	b = null;
	return a
}();
baidu.object.each = function(f, c) {
	var b, a, d;
	if ("function" == typeof c) {
		for (a in f) {
			if (f.hasOwnProperty(a)) {
				d = f[a];
				b = c.call(f, d, a);
				if (b === false) {
					break
				}
			}
		}
	}
	return f
};
baidu.dom.setStyles = function(b, c) {
	b = baidu.dom.g(b);
	for ( var a in c) {
		baidu.dom.setStyle(b, a, c[a])
	}
	return b
};
baidu.setStyles = baidu.dom.setStyles;
baidu.lang.isNumber = function(a) {
	return "[object Number]" == Object.prototype.toString.call(a)
			&& isFinite(a)
};
baidu.event.getTarget = function(a) {
	return a.target || a.srcElement
};
baidu.dom.setBorderBoxSize = function(c, b) {
	var a = {};
	b.width && (a.width = parseFloat(b.width));
	b.height && (a.height = parseFloat(b.height));
	function d(g, f) {
		return parseFloat(baidu.getStyle(g, f)) || 0
	}
	if (baidu.browser.isStrict) {
		if (b.width) {
			a.width = parseFloat(b.width) - d(c, "paddingLeft")
					- d(c, "paddingRight") - d(c, "borderLeftWidth")
					- d(c, "borderRightWidth");
			a.width < 0 && (a.width = 0)
		}
		if (b.height) {
			a.height = parseFloat(b.height) - d(c, "paddingTop")
					- d(c, "paddingBottom") - d(c, "borderTopWidth")
					- d(c, "borderBottomWidth");
			a.height < 0 && (a.height = 0)
		}
	}
	return baidu.dom.setStyles(c, a)
};
baidu.dom.setOuterHeight = baidu.dom.setBorderBoxHeight = function(b, a) {
	return baidu.dom.setBorderBoxSize(b, {
		height : a
	})
};
baidu.dom.setOuterWidth = baidu.dom.setBorderBoxWidth = function(a, b) {
	return baidu.dom.setBorderBoxSize(a, {
		width : b
	})
};
baidu.dom.resizable = function(d, h) {
	var A, n, k = {}, c, a = {}, s, y, v, b, f, l, p, t = false, w = {
		direction : [ "e", "s", "se" ],
		minWidth : 16,
		minHeight : 16,
		classPrefix : "tangram",
		directionHandlePosition : {}
	};
	if (!(A = baidu.dom.g(d)) && baidu.getStyle(A, "position") == "static") {
		return false
	}
	b = A.offsetParent;
	var o = baidu.getStyle(A, "position");
	n = baidu.extend(w, h);
	baidu.each( [ "minHeight", "minWidth", "maxHeight", "maxWidth" ], function(
			B) {
		n[B] && (n[B] = parseFloat(n[B]))
	});
	s = [ n.minWidth || 0, n.maxWidth || Number.MAX_VALUE, n.minHeight || 0,
			n.maxHeight || Number.MAX_VALUE ];
	z();
	function z() {
		l = baidu.extend( {
			e : {
				right : "-5px",
				top : "0px",
				width : "7px",
				height : A.offsetHeight
			},
			s : {
				left : "0px",
				bottom : "-5px",
				height : "7px",
				width : A.offsetWidth
			},
			n : {
				left : "0px",
				top : "-5px",
				height : "7px",
				width : A.offsetWidth
			},
			w : {
				left : "-5px",
				top : "0px",
				height : A.offsetHeight,
				width : "7px"
			},
			se : {
				right : "1px",
				bottom : "1px",
				height : "16px",
				width : "16px"
			},
			sw : {
				left : "1px",
				bottom : "1px",
				height : "16px",
				width : "16px"
			},
			ne : {
				right : "1px",
				top : "1px",
				height : "16px",
				width : "16px"
			},
			nw : {
				left : "1px",
				top : "1px",
				height : "16px",
				width : "16px"
			}
		}, n.directionHandlePosition);
		baidu.each(n.direction, function(B) {
			var C = n.classPrefix.split(" ");
			C[0] = C[0] + "-resizable-" + B;
			var E = baidu.dom.create("div", {
				className : C.join(" ")
			}), D = l[B];
			D.cursor = B + "-resize";
			D.position = "absolute";
			baidu.setStyles(E, D);
			E.key = B;
			E.style.MozUserSelect = "none";
			A.appendChild(E);
			k[B] = E;
			baidu.on(E, "mousedown", j)
		});
		t = false
	}
	function g() {
		f && u();
		baidu.object.each(k, function(B) {
			baidu.un(B, "mousedown", j);
			baidu.dom.remove(B)
		});
		t = true
	}
	function m(B) {
		if (!t) {
			n = baidu.extend(n, B || {});
			g();
			z()
		}
	}
	function j(D) {
		var C = baidu.event.getTarget(D), B = C.key;
		f = C;
		if (C.setCapture) {
			C.setCapture()
		} else {
			if (window.captureEvents) {
				window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
			}
		}
		v = baidu.getStyle(document.body, "cursor");
		baidu.setStyle(document.body, "cursor", B + "-resize");
		baidu.on(document, "mouseup", u);
		baidu.on(document.body, "selectstart", q);
		y = document.body.style.MozUserSelect;
		document.body.style.MozUserSelect = "none";
		var E = baidu.page.getMousePosition();
		a = r();
		p = setInterval(function() {
			x(B, E)
		}, 20);
		baidu.lang.isFunction(n.onresizestart) && n.onresizestart();
		baidu.event.preventDefault(D)
	}
	function u() {
		if (f.releaseCapture) {
			f.releaseCapture()
		} else {
			if (window.releaseEvents) {
				window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP)
			}
		}
		baidu.un(document, "mouseup", u);
		baidu.un(document, "selectstart", q);
		document.body.style.MozUserSelect = y;
		baidu.un(document.body, "selectstart", q);
		clearInterval(p);
		baidu.setStyle(document.body, "cursor", v);
		f = null;
		baidu.lang.isFunction(n.onresizeend) && n.onresizeend()
	}
	function x(C, I) {
		var H = baidu.page.getMousePosition(), D = a.width, B = a.height, G = a.top, F = a.left, E;
		if (C.indexOf("e") >= 0) {
			D = Math.max(H.x - I.x + a.width, s[0]);
			D = Math.min(D, s[1])
		} else {
			if (C.indexOf("w") >= 0) {
				D = Math.max(I.x - H.x + a.width, s[0]);
				D = Math.min(D, s[1]);
				F -= D - a.width
			}
		}
		if (C.indexOf("s") >= 0) {
			B = Math.max(H.y - I.y + a.height, s[2]);
			B = Math.min(B, s[3])
		} else {
			if (C.indexOf("n") >= 0) {
				B = Math.max(I.y - H.y + a.height, s[2]);
				B = Math.min(B, s[3]);
				G -= B - a.height
			}
		}
		E = {
			width : D,
			height : B,
			top : G,
			left : F
		};
		baidu.dom.setOuterHeight(A, B);
		baidu.dom.setOuterWidth(A, D);
		baidu.setStyles(A, {
			top : G,
			left : F
		});
		k.n && baidu.setStyle(k.n, "width", D);
		k.s && baidu.setStyle(k.s, "width", D);
		k.e && baidu.setStyle(k.e, "height", B);
		k.w && baidu.setStyle(k.w, "height", B);
		baidu.lang.isFunction(n.onresize) && n.onresize( {
			current : E,
			original : a
		})
	}
	function q(B) {
		return baidu.event.preventDefault(B, false)
	}
	function r() {
		var B = baidu.dom.getPosition(A.offsetParent), C = baidu.dom
				.getPosition(A), E, D;
		if (o == "absolute") {
			E = C.top - (A.offsetParent == document.body ? 0 : B.top);
			D = C.left - (A.offsetParent == document.body ? 0 : B.left)
		} else {
			E = parseFloat(baidu.getStyle(A, "top"))
					|| -parseFloat(baidu.getStyle(A, "bottom")) || 0;
			D = parseFloat(baidu.getStyle(A, "left"))
					|| -parseFloat(baidu.getStyle(A, "right")) || 0
		}
		baidu.setStyles(A, {
			top : E,
			left : D
		});
		return {
			width : A.offsetWidth,
			height : A.offsetHeight,
			top : E,
			left : D
		}
	}
	return {
		cancel : g,
		update : m,
		enable : z
	}
};
baidu.dom.setPosition = function(b, a) {
	return baidu.dom
			.setStyles(b,
					{
						left : a.left
								- (parseFloat(baidu.dom.getStyle(b,
										"margin-left")) || 0),
						top : a.top
								- (parseFloat(baidu.dom.getStyle(b,
										"margin-top")) || 0)
					})
};
baidu.dom.show = function(a) {
	a = baidu.dom.g(a);
	a.style.display = "";
	return a
};
baidu.show = baidu.dom.show;
baidu.dom.toggle = function(a) {
	a = baidu.dom.g(a);
	a.style.display = a.style.display == "none" ? "" : "none";
	return a
};
baidu.dom.toggleClass = function(a, b) {
	if (baidu.dom.hasClass(a, b)) {
		baidu.dom.removeClass(a, b)
	} else {
		baidu.dom.addClass(a, b)
	}
};
baidu.lang.isArray = function(a) {
	return "[object Array]" == Object.prototype.toString.call(a)
};
baidu.lang.toArray = function(b) {
	if (b === null || b === undefined) {
		return []
	}
	if (baidu.lang.isArray(b)) {
		return b
	}
	if (typeof b.length !== "number" || typeof b === "string"
			|| baidu.lang.isFunction(b)) {
		return [ b ]
	}
	if (b.item) {
		var a = b.length, c = new Array(a);
		while (a--) {
			c[a] = b[a]
		}
		return c
	}
	return [].slice.call(b)
};
baidu.fn.methodize = function(b, a) {
	return function() {
		return b.apply(this, [ (a ? this[a] : this) ].concat( [].slice
				.call(arguments)))
	}
};
baidu.fn.wrapReturnValue = function(a, c, b) {
	b = b | 0;
	return function() {
		var d = a.apply(this, arguments);
		if (b > 0) {
			return new c(arguments[b - 1])
		}
		if (!b) {
			return new c(d)
		}
		return d
	}
};
baidu.fn.multize = function(c, a) {
	var b = function() {
		var l = arguments[0], h = a ? b : c, f = [], k = [].slice.call(
				arguments, 0), g = 0, d, j;
		if (l instanceof Array) {
			for (d = l.length; g < d; g++) {
				k[0] = l[g];
				j = h.apply(this, k);
				f.push(j)
			}
			return f
		} else {
			return c.apply(this, arguments)
		}
	};
	return b
};
baidu.element = baidu.e = function(b) {
	var a = baidu._g(b);
	if (!a && baidu.dom.query) {
		a = baidu.dom.query(b)
	}
	return new baidu.element.Element(a)
};
baidu.element.Element = function(a) {
	if (!baidu.element._init) {
		baidu.element._makeChain();
		baidu.element._init = true
	}
	this._dom = baidu.lang.toArray(a)
};
baidu.element.Element.prototype.each = function(a) {
	baidu.array.each(this._dom, function(b) {
		a.call(this, new baidu.element.Element(b))
	})
};
baidu.element._toChainFunction = function(b, a) {
	return baidu.fn.methodize(baidu.fn.wrapReturnValue(baidu.fn.multize(b),
			baidu.element.Element, a), "_dom")
};
baidu.element._makeChain = function() {
	var b = baidu.element.Element.prototype, c = baidu.element._toChainFunction;
	baidu.each(("draggable droppable resizable").split(" "), function(d) {
		b[d] = c(baidu.dom[d], 1)
	});
	baidu
			.each(
					("remove getText contains getAttr getPosition getStyle hasClass intersect hasAttr getComputedStyle")
							.split(" "), function(d) {
						b[d] = b[d.replace(/^get[A-Z]/g, a)] = c(baidu.dom[d],
								-1)
					});
	baidu
			.each(
					("addClass empty hide show insertAfter insertBefore insertHTML removeClass setAttr setAttrs setStyle setStyles show toggleClass toggle children next first getAncestorByClass getAncestorBy getAncestorByTag getDocument getParent getWindow last next prev g q query removeStyle setBorderBoxSize setOuterWidth setOuterHeight setBorderBoxWidth setBorderBoxHeight setPosition")
							.split(" "), function(d) {
						b[d] = b[d.replace(/^get[A-Z]/g, a)] = c(baidu.dom[d],
								0)
					});
	baidu.each(("on un").split(" "), function(d) {
		b[d] = c(baidu.event[d], 0)
	});
	baidu
			.each(
					("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error")
							.split(" "), function(d) {
						b[d] = function(f) {
							return this.on(d, f)
						}
					});
	function a(d) {
		return d.charAt(3).toLowerCase()
	}
};
baidu.element.extend = function(a) {
	var b = baidu.element;
	baidu.object.each(a, function(d, c) {
		b.Element.prototype[c] = baidu.element._toChainFunction(d, -1)
	})
};
baidu.event.EventArg = function(c, f) {
	f = f || window;
	c = c || f.event;
	var d = f.document;
	this.target = (c.target) || c.srcElement;
	this.keyCode = c.which || c.keyCode;
	for ( var a in c) {
		var b = c[a];
		if ("function" != typeof b) {
			this[a] = b
		}
	}
	if (!this.pageX && this.pageX !== 0) {
		this.pageX = (c.clientX || 0)
				+ (d.documentElement.scrollLeft || d.body.scrollLeft);
		this.pageY = (c.clientY || 0)
				+ (d.documentElement.scrollTop || d.body.scrollTop)
	}
	this._event = c
};
baidu.event.EventArg.prototype.preventDefault = function() {
	if (this._event.preventDefault) {
		this._event.preventDefault()
	} else {
		this._event.returnValue = false
	}
	return this
};
baidu.event.EventArg.prototype.stopPropagation = function() {
	if (this._event.stopPropagation) {
		this._event.stopPropagation()
	} else {
		this._event.cancelBubble = true
	}
	return this
};
baidu.event.EventArg.prototype.stop = function() {
	return this.stopPropagation().preventDefault()
};
baidu.event._eventFilter = baidu.event._eventFilter || {};
baidu.event._eventFilter._crossElementBoundary = function(a, d) {
	var c = d.relatedTarget, b = d.currentTarget;
	if (c === false || b == c
			|| (c && (c.prefix == "xul" || baidu.dom.contains(b, c)))) {
		return
	}
	return a.call(b, d)
};
baidu.fn.bind = function(b, a) {
	var c = arguments.length > 2 ? [].slice.call(arguments, 2) : null;
	return function() {
		var f = baidu.lang.isString(b) ? a[b] : b, d = (c) ? c.concat( [].slice
				.call(arguments, 0)) : arguments;
		return f.apply(a || f, d)
	}
};
baidu.event._eventFilter.mouseenter = window.attachEvent ? null : function(a,
		b, c) {
	return {
		type : "mouseover",
		listener : baidu.fn.bind(
				baidu.event._eventFilter._crossElementBoundary, this, c)
	}
};
baidu.event._eventFilter.mouseleave = window.attachEvent ? null : function(a,
		b, c) {
	return {
		type : "mouseout",
		listener : baidu.fn.bind(
				baidu.event._eventFilter._crossElementBoundary, this, c)
	}
};
baidu.event._unload = function() {
	var c = baidu.event._listeners, a = c.length, b = !!window.removeEventListener, f, d;
	while (a--) {
		f = c[a];
		if (f[1] == "unload") {
			continue
		}
		if (!(d = f[0])) {
			continue
		}
		if (d.removeEventListener) {
			d.removeEventListener(f[1], f[3], false)
		} else {
			if (d.detachEvent) {
				d.detachEvent("on" + f[1], f[3])
			}
		}
	}
	if (b) {
		window.removeEventListener("unload", baidu.event._unload, false)
	} else {
		window.detachEvent("onunload", baidu.event._unload)
	}
};
if (window.attachEvent) {
	window.attachEvent("onunload", baidu.event._unload)
} else {
	window.addEventListener("unload", baidu.event._unload, false)
}
baidu.object.values = function(d) {
	var a = [], c = 0, b;
	for (b in d) {
		if (d.hasOwnProperty(b)) {
			a[c++] = d[b]
		}
	}
	return a
};
(function() {
	var d = baidu.browser, m = {
		keydown : 1,
		keyup : 1,
		keypress : 1
	}, a = {
		click : 1,
		dblclick : 1,
		mousedown : 1,
		mousemove : 1,
		mouseup : 1,
		mouseover : 1,
		mouseout : 1
	}, j = {
		abort : 1,
		blur : 1,
		change : 1,
		error : 1,
		focus : 1,
		load : d.ie ? 0 : 1,
		reset : 1,
		resize : 1,
		scroll : 1,
		select : 1,
		submit : 1,
		unload : d.ie ? 0 : 1
	}, g = {
		scroll : 1,
		resize : 1,
		reset : 1,
		submit : 1,
		change : 1,
		select : 1,
		error : 1,
		abort : 1
	}, l = {
		KeyEvents : [ "bubbles", "cancelable", "view", "ctrlKey", "altKey",
				"shiftKey", "metaKey", "keyCode", "charCode" ],
		MouseEvents : [ "bubbles", "cancelable", "view", "detail", "screenX",
				"screenY", "clientX", "clientY", "ctrlKey", "altKey",
				"shiftKey", "metaKey", "button", "relatedTarget" ],
		HTMLEvents : [ "bubbles", "cancelable" ],
		UIEvents : [ "bubbles", "cancelable", "view", "detail" ],
		Events : [ "bubbles", "cancelable" ]
	};
	baidu.object.extend(g, m);
	baidu.object.extend(g, a);
	function c(s, q) {
		var p = 0, o = s.length, r = {};
		for (; p < o; p++) {
			r[s[p]] = q[s[p]];
			delete q[s[p]]
		}
		return r
	}
	function f(q, p, o) {
		o = baidu.object.extend( {}, o);
		var r = baidu.object.values(c(l[p], o)), s = document.createEvent(p);
		r.unshift(q);
		if ("KeyEvents" == p) {
			s.initKeyEvent.apply(s, r)
		} else {
			if ("MouseEvents" == p) {
				s.initMouseEvent.apply(s, r)
			} else {
				if ("UIEvents" == p) {
					s.initUIEvent.apply(s, r)
				} else {
					s.initEvent.apply(s, r)
				}
			}
		}
		baidu.object.extend(s, o);
		return s
	}
	function b(o) {
		var p;
		if (document.createEventObject) {
			p = document.createEventObject();
			baidu.object.extend(p, o)
		}
		return p
	}
	function h(r, o) {
		o = c(l.KeyEvents, o);
		var s;
		if (document.createEvent) {
			try {
				s = f(r, "KeyEvents", o)
			} catch (q) {
				try {
					s = f(r, "Events", o)
				} catch (p) {
					s = f(r, "UIEvents", o)
				}
			}
		} else {
			o.keyCode = o.charCode > 0 ? o.charCode : o.keyCode;
			s = b(o)
		}
		return s
	}
	function n(p, o) {
		o = c(l.MouseEvents, o);
		var q;
		if (document.createEvent) {
			q = f(p, "MouseEvents", o);
			if (o.relatedTarget && !q.relatedTarget) {
				if ("mouseout" == p.toLowerCase()) {
					q.toElement = o.relatedTarget
				} else {
					if ("mouseover" == p.toLowerCase()) {
						q.fromElement = o.relatedTarget
					}
				}
			}
		} else {
			o.button = o.button == 0 ? 1 : o.button == 1 ? 4 : baidu.lang
					.isNumber(o.button) ? o.button : 0;
			q = b(o)
		}
		return q
	}
	function k(q, o) {
		o.bubbles = g.hasOwnProperty(q);
		o = c(l.HTMLEvents, o);
		var s;
		if (document.createEvent) {
			try {
				s = f(q, "HTMLEvents", o)
			} catch (r) {
				try {
					s = f(q, "UIEvents", o)
				} catch (p) {
					s = f(q, "Events", o)
				}
			}
		} else {
			s = b(o)
		}
		return s
	}
	baidu.event.fire = function(p, q, o) {
		var r;
		q = q.replace(/^on/i, "");
		p = baidu.dom._g(p);
		o = baidu.object.extend( {
			bubbles : true,
			cancelable : true,
			view : window,
			detail : 1,
			screenX : 0,
			screenY : 0,
			clientX : 0,
			clientY : 0,
			ctrlKey : false,
			altKey : false,
			shiftKey : false,
			metaKey : false,
			keyCode : 0,
			charCode : 0,
			button : 0,
			relatedTarget : null
		}, o);
		if (m[q]) {
			r = h(q, o)
		} else {
			if (a[q]) {
				r = n(q, o)
			} else {
				if (j[q]) {
					r = k(q, o)
				} else {
					throw (new Error(q + " is not support!"))
				}
			}
		}
		if (r) {
			if (p.dispatchEvent) {
				p.dispatchEvent(r)
			} else {
				if (p.fireEvent) {
					p.fireEvent("on" + q, r)
				}
			}
		}
	}
})();
baidu.event.get = function(a, b) {
	return new baidu.event.EventArg(a, b)
};
baidu.event.getKeyCode = function(a) {
	return a.which || a.keyCode
};
baidu.event.getPageX = function(b) {
	var a = b.pageX, c = document;
	if (!a && a !== 0) {
		a = (b.clientX || 0)
				+ (c.documentElement.scrollLeft || c.body.scrollLeft)
	}
	return a
};
baidu.event.getPageY = function(b) {
	var a = b.pageY, c = document;
	if (!a && a !== 0) {
		a = (b.clientY || 0)
				+ (c.documentElement.scrollTop || c.body.scrollTop)
	}
	return a
};
baidu.event.once = function(a, b, c) {
	a = baidu.dom._g(a);
	function d(f) {
		c.call(a, f);
		baidu.event.un(a, b, d)
	}
	baidu.event.on(a, b, d);
	return a
};
baidu.event.stopPropagation = function(a) {
	if (a.stopPropagation) {
		a.stopPropagation()
	} else {
		a.cancelBubble = true
	}
};
baidu.event.stop = function(a) {
	var b = baidu.event;
	b.stopPropagation(a);
	b.preventDefault(a)
};
baidu.fn.abstractMethod = function() {
	throw Error("unimplemented abstract method")
};
baidu.json = baidu.json || {};
baidu.json.parse = function(a) {
	return (new Function("return (" + a + ")"))()
};
baidu.json.decode = baidu.json.parse;
baidu.json.stringify = (function() {
	var b = {
		"\b" : "\\b",
		"\t" : "\\t",
		"\n" : "\\n",
		"\f" : "\\f",
		"\r" : "\\r",
		'"' : '\\"',
		"\\" : "\\\\"
	};
	function a(g) {
		if (/["\\\x00-\x1f]/.test(g)) {
			g = g.replace(/["\\\x00-\x1f]/g, function(h) {
				var j = b[h];
				if (j) {
					return j
				}
				j = h.charCodeAt();
				return "\\u00" + Math.floor(j / 16).toString(16)
						+ (j % 16).toString(16)
			})
		}
		return '"' + g + '"'
	}
	function d(n) {
		var h = [ "[" ], j = n.length, g, k, m;
		for (k = 0; k < j; k++) {
			m = n[k];
			switch (typeof m) {
			case "undefined":
			case "function":
			case "unknown":
				break;
			default:
				if (g) {
					h.push(",")
				}
				h.push(baidu.json.stringify(m));
				g = 1
			}
		}
		h.push("]");
		return h.join("")
	}
	function c(g) {
		return g < 10 ? "0" + g : g
	}
	function f(g) {
		return '"' + g.getFullYear() + "-" + c(g.getMonth() + 1) + "-"
				+ c(g.getDate()) + "T" + c(g.getHours()) + ":"
				+ c(g.getMinutes()) + ":" + c(g.getSeconds()) + '"'
	}
	return function(m) {
		switch (typeof m) {
		case "undefined":
			return "undefined";
		case "number":
			return isFinite(m) ? String(m) : "null";
		case "string":
			return a(m);
		case "boolean":
			return String(m);
		default:
			if (m === null) {
				return "null"
			} else {
				if (m instanceof Array) {
					return d(m)
				} else {
					if (m instanceof Date) {
						return f(m)
					} else {
						var h = [ "{" ], l = baidu.json.stringify, g, k;
						for ( var j in m) {
							if (Object.prototype.hasOwnProperty.call(m, j)) {
								k = m[j];
								switch (typeof k) {
								case "undefined":
								case "unknown":
								case "function":
									break;
								default:
									if (g) {
										h.push(",")
									}
									g = 1;
									h.push(l(j) + ":" + l(k))
								}
							}
						}
						h.push("}");
						return h.join("")
					}
				}
			}
		}
	}
})();
baidu.json.encode = baidu.json.stringify;
baidu.lang.Class.prototype.addEventListeners = function(c, d) {
	if (typeof d == "undefined") {
		for ( var b in c) {
			this.addEventListener(b, c[b])
		}
	} else {
		c = c.split(",");
		var b = 0, a = c.length, f;
		for (; b < a; b++) {
			this.addEventListener(baidu.trim(c[b]), d)
		}
	}
};
baidu.lang.createClass = function(g, b) {
	b = b || {};
	var f = b.superClass || baidu.lang.Class;
	var d = function() {
		if (f != baidu.lang.Class) {
			f.apply(this, arguments)
		} else {
			f.call(this)
		}
		g.apply(this, arguments)
	};
	d.options = b.options || {};
	var j = function() {
	}, h = g.prototype;
	j.prototype = f.prototype;
	var a = d.prototype = new j();
	for ( var c in h) {
		a[c] = h[c]
	}
	typeof b.className == "string" && (a._className = b.className);
	a.constructor = h.constructor;
	d.extend = function(l) {
		for ( var k in l) {
			d.prototype[k] = l[k]
		}
		return d
	};
	return d
};
baidu.lang.decontrol = function(b) {
	var a = window[baidu.guid];
	a._instances && (delete a._instances[b])
};
baidu.lang.eventCenter = baidu.lang.eventCenter || baidu.lang.createSingle();
baidu.lang.inherits = function(h, f, d) {
	var c, g, a = h.prototype, b = new Function();
	b.prototype = f.prototype;
	g = h.prototype = new b();
	for (c in a) {
		g[c] = a[c]
	}
	h.prototype.constructor = h;
	h.superClass = f.prototype;
	if ("string" == typeof d) {
		g._className = d
	}
};
baidu.inherits = baidu.lang.inherits;
baidu.lang.instance = function(a) {
	return window[baidu.guid]._instances[a] || null
};
baidu.lang.isBoolean = function(a) {
	return typeof a === "boolean"
};
baidu.lang.isDate = function(a) {
	return {}.toString.call(a) === "[object Date]"
			&& a.toString() !== "Invalid Date" && !isNaN(a)
};
baidu.lang.isElement = function(a) {
	return !!(a && a.nodeName && a.nodeType == 1)
};
baidu.lang.isObject = function(a) {
	return "function" == typeof a || !!(a && "object" == typeof a)
};
baidu.isObject = baidu.lang.isObject;
baidu.lang.module = function(name, module, owner) {
	var packages = name.split("."), len = packages.length - 1, packageName, i = 0;
	if (!owner) {
		try {
			if (!(new RegExp("^[a-zA-Z_\x24][a-zA-Z0-9_\x24]*\x24"))
					.test(packages[0])) {
				throw ""
			}
			owner = eval(packages[0]);
			i = 1
		} catch (e) {
			owner = window
		}
	}
	for (; i < len; i++) {
		packageName = packages[i];
		if (!owner[packageName]) {
			owner[packageName] = {}
		}
		owner = owner[packageName]
	}
	if (!owner[packages[len]]) {
		owner[packages[len]] = module
	}
};
baidu.lang.getModule = function(b, c) {
	var d = b.split("."), f = c || window, a;
	for (; a = d.shift();) {
		if (f[a] != null) {
			f = f[a]
		} else {
			return null
		}
	}
	return f
};
baidu.number.comma = function(b, a) {
	if (!a || a < 1) {
		a = 3
	}
	b = String(b).split(".");
	b[0] = b[0].replace(new RegExp("(\\d)(?=(\\d{" + a + "})+$)", "ig"), "$1,");
	return b.join(".")
};
baidu.number.randomInt = function(b, a) {
	return Math.floor(Math.random() * (a - b + 1) + b)
};
baidu.object.isPlain = function(c) {
	var b = Object.prototype.hasOwnProperty, a;
	if (!c || Object.prototype.toString.call(c) !== "[object Object]"
			|| !("isPrototypeOf" in c)) {
		return false
	}
	if (c.constructor && !b.call(c, "constructor")
			&& !b.call(c.constructor.prototype, "isPrototypeOf")) {
		return false
	}
	for (a in c) {
	}
	return a === undefined || b.call(c, a)
};
baidu.object.clone = function(f) {
	var b = f, c, a;
	if (!f || f instanceof Number || f instanceof String
			|| f instanceof Boolean) {
		return b
	} else {
		if (baidu.lang.isArray(f)) {
			b = [];
			var d = 0;
			for (c = 0, a = f.length; c < a; c++) {
				b[d++] = baidu.object.clone(f[c])
			}
		} else {
			if (baidu.object.isPlain(f)) {
				b = {};
				for (c in f) {
					if (f.hasOwnProperty(c)) {
						b[c] = baidu.object.clone(f[c])
					}
				}
			}
		}
	}
	return b
};
baidu.object.keys = function(d) {
	var a = [], c = 0, b;
	for (b in d) {
		if (d.hasOwnProperty(b)) {
			a[c++] = b
		}
	}
	return a
};
baidu.object.map = function(d, c) {
	var b = {};
	for ( var a in d) {
		if (d.hasOwnProperty(a)) {
			b[a] = c(d[a], a)
		}
	}
	return b
};
(function() {
	var b = function(c) {
		return baidu.lang.isObject(c) && !baidu.lang.isFunction(c)
	};
	function a(h, g, f, d, c) {
		if (g.hasOwnProperty(f)) {
			if (c && b(h[f])) {
				baidu.object.merge(h[f], g[f], {
					overwrite : d,
					recursive : c
				})
			} else {
				if (d || !(f in h)) {
					h[f] = g[f]
				}
			}
		}
	}
	baidu.object.merge = function(j, c, l) {
		var f = 0, m = l || {}, h = m.overwrite, k = m.whiteList, d = m.recursive, g;
		if (k && k.length) {
			g = k.length;
			for (; f < g; ++f) {
				a(j, c, k[f], h, d)
			}
		} else {
			for (f in c) {
				a(j, c, f, h, d)
			}
		}
		return j
	}
})();
baidu.object.isEmpty = function(b) {
	for ( var a in b) {
		return false
	}
	return true
};
baidu.page.createStyleSheet = function(a) {
	var g = a || {}, d = g.document || document, c;
	if (baidu.browser.ie) {
		if (!g.url) {
			g.url = ""
		}
		return d.createStyleSheet(g.url, g.index)
	} else {
		c = "<style type='text/css'></style>";
		g.url
				&& (c = "<link type='text/css' rel='stylesheet' href='" + g.url
						+ "'/>");
		baidu.dom.insertHTML(d.getElementsByTagName("HEAD")[0], "beforeEnd", c);
		if (g.url) {
			return null
		}
		var b = d.styleSheets[d.styleSheets.length - 1], f = b.rules
				|| b.cssRules;
		return {
			self : b,
			rules : b.rules || b.cssRules,
			addRule : function(h, k, j) {
				if (b.addRule) {
					return b.addRule(h, k, j)
				} else {
					if (b.insertRule) {
						isNaN(j) && (j = f.length);
						return b.insertRule(h + "{" + k + "}", j)
					}
				}
			},
			removeRule : function(h) {
				if (b.removeRule) {
					b.removeRule(h)
				} else {
					if (b.deleteRule) {
						isNaN(h) && (h = 0);
						b.deleteRule(h)
					}
				}
			}
		}
	}
};
baidu.page.getHeight = function() {
	var d = document, a = d.body, c = d.documentElement, b = d.compatMode == "BackCompat" ? a
			: d.documentElement;
	return Math.max(c.scrollHeight, a.scrollHeight, b.clientHeight)
};
baidu.page.getViewHeight = function() {
	var b = document, a = b.compatMode == "BackCompat" ? b.body
			: b.documentElement;
	return a.clientHeight
};
baidu.page.getViewWidth = function() {
	var b = document, a = b.compatMode == "BackCompat" ? b.body
			: b.documentElement;
	return a.clientWidth
};
baidu.page.getWidth = function() {
	var d = document, a = d.body, c = d.documentElement, b = d.compatMode == "BackCompat" ? a
			: d.documentElement;
	return Math.max(c.scrollWidth, a.scrollWidth, b.clientWidth)
};
baidu.page.lazyLoadImage = function(a) {
	a = a || {};
	a.preloadHeight = a.preloadHeight || 0;
	baidu.dom
			.ready(function() {
				var f = document.getElementsByTagName("IMG"), g = f, h = f.length, d = 0, l = c(), k = "data-tangram-ori-src", j;
				if (a.className) {
					g = [];
					for (; d < h; ++d) {
						if (baidu.dom.hasClass(f[d], a.className)) {
							g.push(f[d])
						}
					}
				}
				function c() {
					return baidu.page.getScrollTop()
							+ baidu.page.getViewHeight() + a.preloadHeight
				}
				for (d = 0, h = g.length; d < h; ++d) {
					j = g[d];
					if (baidu.dom.getPosition(j).top > l) {
						j.setAttribute(k, j.src);
						a.placeHolder ? j.src = a.placeHolder : j
								.removeAttribute("src")
					}
				}
				var b = function() {
					var n = c(), p, q = true, o = 0, m = g.length;
					for (; o < m; ++o) {
						j = g[o];
						p = j.getAttribute(k);
						p && (q = false);
						if (baidu.dom.getPosition(j).top < n && p) {
							j.src = p;
							j.removeAttribute(k);
							baidu.lang.isFunction(a.onlazyload)
									&& a.onlazyload(j)
						}
					}
					q && baidu.un(window, "scroll", b)
				};
				baidu.on(window, "scroll", b)
			})
};
baidu.page.load = function(c, l, f) {
	l = l || {};
	var j = baidu.page.load, a = j._cache = j._cache || {}, h = j._loadingCache = j._loadingCache
			|| {}, g = l.parallel;
	function d() {
		for ( var n = 0, m = c.length; n < m; ++n) {
			if (!a[c[n].url]) {
				setTimeout(arguments.callee, 10);
				return
			}
		}
		l.onload()
	}
	function b(o, q) {
		var p, n, m;
		switch (o.type.toLowerCase()) {
		case "css":
			p = document.createElement("link");
			p.setAttribute("rel", "stylesheet");
			p.setAttribute("type", "text/css");
			break;
		case "js":
			p = document.createElement("script");
			p.setAttribute("type", "text/javascript");
			p.setAttribute("charset", o.charset || j.charset);
			break;
		case "html":
			p = document.createElement("iframe");
			p.frameBorder = "none";
			break;
		default:
			return
		}
		m = function() {
			if (!n
					&& (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
				n = true;
				baidu.un(p, "load", m);
				baidu.un(p, "readystatechange", m);
				q.call(window, p)
			}
		};
		baidu.on(p, "load", m);
		baidu.on(p, "readystatechange", m);
		if (o.type == "css") {
			(function() {
				if (n) {
					return
				}
				try {
					p.sheet.cssRule
				} catch (r) {
					setTimeout(arguments.callee, 20);
					return
				}
				n = true;
				q.call(window, p)
			})()
		}
		p.href = p.src = o.url;
		document.getElementsByTagName("head")[0].appendChild(p)
	}
	baidu.lang.isString(c) && (c = [ {
		url : c
	} ]);
	if (!(c && c.length)) {
		return
	}
	function k(o) {
		var n = o.url, p = !!g, m, q = function(r) {
			a[o.url] = r;
			delete h[o.url];
			if (baidu.lang.isFunction(o.onload)) {
				if (false === o.onload.call(window, r)) {
					return
				}
			}
			!g && j(c.slice(1), l, true);
			if ((!f) && baidu.lang.isFunction(l.onload)) {
				d()
			}
		};
		o.type = o.type || n.substr(n.lastIndexOf(".") + 1);
		o.requestType = o.requestType || (o.type == "html" ? "ajax" : "dom");
		if (m = a[o.url]) {
			q(m);
			return p
		}
		if (!l.refresh && h[o.url]) {
			setTimeout(function() {
				k(o)
			}, 10);
			return p
		}
		h[o.url] = true;
		if (o.requestType.toLowerCase() == "dom") {
			b(o, q)
		} else {
			baidu.ajax.get(o.url, function(s, r) {
				q(r)
			})
		}
		return p
	}
	baidu.each(c, k)
};
baidu.page.load.charset = "UTF8";
baidu.page.loadCssFile = function(b) {
	var a = document.createElement("link");
	a.setAttribute("rel", "stylesheet");
	a.setAttribute("type", "text/css");
	a.setAttribute("href", b);
	document.getElementsByTagName("head")[0].appendChild(a)
};
baidu.page.loadJsFile = function(b) {
	var a = document.createElement("script");
	a.setAttribute("type", "text/javascript");
	a.setAttribute("src", b);
	a.setAttribute("defer", "defer");
	document.getElementsByTagName("head")[0].appendChild(a)
};
baidu.platform = baidu.platform || {};
baidu.platform.isAndroid = /android/i.test(navigator.userAgent);
baidu.platform.isIpad = /ipad/i.test(navigator.userAgent);
baidu.platform.isIphone = /iphone/i.test(navigator.userAgent);
baidu.platform.isMacintosh = /macintosh/i.test(navigator.userAgent);
baidu.platform.isWindows = /windows/i.test(navigator.userAgent);
baidu.platform.isX11 = /x11/i.test(navigator.userAgent);
baidu.sio = baidu.sio || {};
baidu.sio._createScriptTag = function(b, a, c) {
	b.setAttribute("type", "text/javascript");
	c && b.setAttribute("charset", c);
	b.setAttribute("src", a);
	document.getElementsByTagName("head")[0].appendChild(b)
};
baidu.sio._removeScriptTag = function(b) {
	if (b.clearAttributes) {
		b.clearAttributes()
	} else {
		for ( var a in b) {
			if (b.hasOwnProperty(a)) {
				delete b[a]
			}
		}
	}
	if (b && b.parentNode) {
		b.parentNode.removeChild(b)
	}
	b = null
};
baidu.sio.callByBrowser = function(a, h, k) {
	var d = document.createElement("SCRIPT"), f = 0, l = k || {}, c = l.charset, j = h
			|| function() {
			}, g = l.timeOut || 0, b;
	d.onload = d.onreadystatechange = function() {
		if (f) {
			return
		}
		var m = d.readyState;
		if ("undefined" == typeof m || m == "loaded" || m == "complete") {
			f = 1;
			try {
				j();
				clearTimeout(b)
			} finally {
				d.onload = d.onreadystatechange = null;
				baidu.sio._removeScriptTag(d)
			}
		}
	};
	if (g) {
		b = setTimeout(function() {
			d.onload = d.onreadystatechange = null;
			baidu.sio._removeScriptTag(d);
			l.onfailure && l.onfailure()
		}, g)
	}
	baidu.sio._createScriptTag(d, a, c)
};
baidu.sio.callByServer = function(a, o, p) {
	var k = document.createElement("SCRIPT"), j = "bd__cbs__", m, f, q = p
			|| {}, d = q.charset, g = q.queryField || "callback", n = q.timeOut || 0, b, c = new RegExp(
			"(\\?|&)" + g + "=([^&]*)"), h;
	if (baidu.lang.isFunction(o)) {
		m = j + Math.floor(Math.random() * 2147483648).toString(36);
		window[m] = l(0)
	} else {
		if (baidu.lang.isString(o)) {
			m = o
		} else {
			if (h = c.exec(a)) {
				m = h[2]
			}
		}
	}
	if (n) {
		b = setTimeout(l(1), n)
	}
	a = a.replace(c, "\x241" + g + "=" + m);
	if (a.search(c) < 0) {
		a += (a.indexOf("?") < 0 ? "?" : "&") + g + "=" + m
	}
	baidu.sio._createScriptTag(k, a, d);
	function l(r) {
		return function() {
			try {
				if (r) {
					q.onfailure && q.onfailure()
				} else {
					o.apply(window, arguments);
					clearTimeout(b)
				}
				window[m] = null;
				delete window[m]
			} catch (s) {
			} finally {
				baidu.sio._removeScriptTag(k)
			}
		}
	}
};
baidu.sio.log = function(b) {
	var a = new Image(), c = "tangram_sio_log_"
			+ Math.floor(Math.random() * 2147483648).toString(36);
	window[c] = a;
	a.onload = a.onerror = a.onabort = function() {
		a.onload = a.onerror = a.onabort = null;
		window[c] = null;
		a = null
	};
	a.src = b
};
baidu.string.decodeHTML = function(a) {
	var b = String(a).replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(
			/&gt;/g, ">").replace(/&amp;/g, "&");
	return b.replace(/&#([\d]+);/g, function(d, c) {
		return String.fromCharCode(parseInt(c, 10))
	})
};
baidu.decodeHTML = baidu.string.decodeHTML;
baidu.string.encodeHTML = function(a) {
	return String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g,
			"&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
};
baidu.encodeHTML = baidu.string.encodeHTML;
baidu.string.filterFormat = function(c, a) {
	var b = Array.prototype.slice.call(arguments, 1), d = Object.prototype.toString;
	if (b.length) {
		b = b.length == 1 ? (a !== null
				&& (/\[object Array\]|\[object Object\]/.test(d.call(a))) ? a
				: b) : b;
		return c.replace(/#\{(.+?)\}/g, function(g, k) {
			var m, j, h, f, l;
			if (!b) {
				return ""
			}
			m = k.split("|");
			j = b[m[0]];
			if ("[object Function]" == d.call(j)) {
				j = j(m[0])
			}
			for (h = 1, f = m.length; h < f; ++h) {
				l = baidu.string.filterFormat[m[h]];
				if ("[object Function]" == d.call(l)) {
					j = l(j)
				}
			}
			return (("undefined" == typeof j || j === null) ? "" : j)
		})
	}
	return c
};
baidu.string.filterFormat.escapeJs = function(f) {
	if (!f || "string" != typeof f) {
		return f
	}
	var d, a, b, c = [];
	for (d = 0, a = f.length; d < a; ++d) {
		b = f.charCodeAt(d);
		if (b > 255) {
			c.push(f.charAt(d))
		} else {
			c.push("\\x" + b.toString(16))
		}
	}
	return c.join("")
};
baidu.string.filterFormat.js = baidu.string.filterFormat.escapeJs;
baidu.string.filterFormat.escapeString = function(a) {
	if (!a || "string" != typeof a) {
		return a
	}
	return a.replace(/["'<>\\\/`]/g, function(b) {
		return "&#" + b.charCodeAt(0) + ";"
	})
};
baidu.string.filterFormat.e = baidu.string.filterFormat.escapeString;
baidu.string.filterFormat.toInt = function(a) {
	return parseInt(a, 10) || 0
};
baidu.string.filterFormat.i = baidu.string.filterFormat.toInt;
baidu.string.format = function(c, a) {
	c = String(c);
	var b = Array.prototype.slice.call(arguments, 1), d = Object.prototype.toString;
	if (b.length) {
		b = b.length == 1 ? (a !== null
				&& (/\[object Array\]|\[object Object\]/.test(d.call(a))) ? a
				: b) : b;
		return c.replace(/#\{(.+?)\}/g, function(f, h) {
			var g = b[h];
			if ("[object Function]" == d.call(g)) {
				g = g(h)
			}
			return ("undefined" == typeof g ? "" : g)
		})
	}
	return c
};
baidu.format = baidu.string.format;
(function() {
	var c = /^\#[\da-f]{6}$/i, b = /^rgb\((\d+), (\d+), (\d+)\)$/, a = {
		black : "#000000",
		silver : "#c0c0c0",
		gray : "#808080",
		white : "#ffffff",
		maroon : "#800000",
		red : "#ff0000",
		purple : "#800080",
		fuchsia : "#ff00ff",
		green : "#008000",
		lime : "#00ff00",
		olive : "#808000",
		yellow : "#ffff0",
		navy : "#000080",
		blue : "#0000ff",
		teal : "#008080",
		aqua : "#00ffff"
	};
	baidu.string.formatColor = function(f) {
		if (c.test(f)) {
			return f
		} else {
			if (b.test(f)) {
				for ( var k, j = 1, f = "#"; j < 4; j++) {
					k = parseInt(RegExp["\x24" + j]).toString(16);
					f += ("00" + k).substr(k.length)
				}
				return f
			} else {
				if (/^\#[\da-f]{3}$/.test(f)) {
					var h = f.charAt(1), g = f.charAt(2), d = f.charAt(3);
					return "#" + h + h + g + g + d + d
				} else {
					if (a[f]) {
						return a[f]
					}
				}
			}
		}
		return ""
	}
})();
baidu.string.getByteLength = function(a) {
	return String(a).replace(/[^\x00-\xff]/g, "ci").length
};
baidu.string.subByte = function(c, b, a) {
	c = String(c);
	a = a || "";
	if (b < 0 || baidu.string.getByteLength(c) <= b) {
		return c + a
	}
	c = c.substr(0, b).replace(/([^\x00-\xff])/g, "\x241 ").substr(0, b)
			.replace(/[^\x00-\xff]$/, "").replace(/([^\x00-\xff]) /g, "\x241");
	return c + a
};
baidu.string.toHalfWidth = function(a) {
	return String(a).replace(/[\uFF01-\uFF5E]/g, function(b) {
		return String.fromCharCode(b.charCodeAt(0) - 65248)
	}).replace(/\u3000/g, " ")
};
baidu.string.wbr = function(a) {
	return String(a).replace(/(?:<[^>]+>)|(?:&#?[0-9a-z]{2,6};)|(.{1})/gi,
			"$&<wbr>").replace(/><wbr>/g, ">")
};
baidu.string.stripTags = function(a) {
	return String(a || "").replace(/<[^>]+>/g, "")
};
baidu.swf = baidu.swf || {};
baidu.swf.getMovie = function(c) {
	var a = document[c], b;
	return baidu.browser.ie == 9 ? a && a.length ? (b = baidu.array.remove(
			baidu.lang.toArray(a), function(d) {
				return d.tagName.toLowerCase() != "embed"
			})).length == 1 ? b[0] : b : a : a || window[c]
};
baidu.swf.Proxy = function(g, c, d) {
	var b = this, a = this._flash = baidu.swf.getMovie(g), f;
	if (!c) {
		return this
	}
	f = setInterval(function() {
		try {
			if (a[c]) {
				b._initialized = true;
				clearInterval(f);
				if (d) {
					d()
				}
			}
		} catch (h) {
		}
	}, 100)
};
baidu.swf.Proxy.prototype.getFlash = function() {
	return this._flash
};
baidu.swf.Proxy.prototype.isReady = function() {
	return !!this._initialized
};
baidu.swf.Proxy.prototype.call = function(a, f) {
	try {
		var c = this.getFlash(), b = Array.prototype.slice.call(arguments);
		b.shift();
		if (c[a]) {
			c[a].apply(c, b)
		}
	} catch (d) {
	}
};
baidu.swf.version = (function() {
	var h = navigator;
	if (h.plugins && h.mimeTypes.length) {
		var d = h.plugins["Shockwave Flash"];
		if (d && d.description) {
			return d.description.replace(/([a-zA-Z]|\s)+/, "").replace(
					/(\s)+r/, ".")
					+ ".0"
		}
	} else {
		if (window.ActiveXObject && !window.opera) {
			for ( var b = 10; b >= 2; b--) {
				try {
					var g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."
							+ b);
					if (g) {
						var a = g.GetVariable("$version");
						return a.replace(/WIN/g, "").replace(/,/g, ".")
					}
				} catch (f) {
				}
			}
		}
	}
})();
baidu.swf.createHTML = function(t) {
	t = t || {};
	var l = baidu.swf.version, h = t.ver || "6.0.0", g, d, f, c, j, s, a = {}, p = baidu.string.encodeHTML;
	for (c in t) {
		a[c] = t[c]
	}
	t = a;
	if (l) {
		l = l.split(".");
		h = h.split(".");
		for (f = 0; f < 3; f++) {
			g = parseInt(l[f], 10);
			d = parseInt(h[f], 10);
			if (d < g) {
				break
			} else {
				if (d > g) {
					return ""
				}
			}
		}
	} else {
		return ""
	}
	var n = t.vars, m = [ "classid", "codebase", "id", "width", "height",
			"align" ];
	t.align = t.align || "middle";
	t.classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000";
	t.codebase = "http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0";
	t.movie = t.url || "";
	delete t.vars;
	delete t.url;
	if ("string" == typeof n) {
		t.flashvars = n
	} else {
		var q = [];
		for (c in n) {
			s = n[c];
			q.push(c + "=" + encodeURIComponent(s))
		}
		t.flashvars = q.join("&")
	}
	var o = [ "<object " ];
	for (f = 0, j = m.length; f < j; f++) {
		s = m[f];
		o.push(" ", s, '="', p(t[s]), '"')
	}
	o.push(">");
	var b = {
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
	for (c in t) {
		s = t[c];
		c = c.toLowerCase();
		if (b[c] && s) {
			o.push('<param name="' + c + '" value="' + p(s) + '" />')
		}
	}
	t.src = t.movie;
	t.name = t.id;
	delete t.id;
	delete t.movie;
	delete t.classid;
	delete t.codebase;
	t.type = "application/x-shockwave-flash";
	t.pluginspage = "http://www.macromedia.com/go/getflashplayer";
	o.push("<embed");
	var r;
	for (c in t) {
		s = t[c];
		if (s) {
			if ((new RegExp("^salign\x24", "i")).test(c)) {
				r = s;
				continue
			}
			o.push(" ", c, '="', p(s), '"')
		}
	}
	if (r) {
		o.push(' salign="', p(r), '"')
	}
	o.push("></embed></object>");
	return o.join("")
};
baidu.swf.create = function(a, c) {
	a = a || {};
	var b = baidu.swf.createHTML(a) || a.errorMessage || "";
	if (c && "string" == typeof c) {
		c = document.getElementById(c)
	}
	if (c) {
		c.innerHTML = b
	} else {
		document.write(b)
	}
};
baidu.url = baidu.url || {};
baidu.url.escapeSymbol = function(a) {
	return String(a).replace(/\%/g, "%25").replace(/&/g, "%26").replace(/\+/g,
			"%2B").replace(/\ /g, "%20").replace(/\//g, "%2F").replace(/\#/g,
			"%23").replace(/\=/g, "%3D")
};
baidu.url.getQueryValue = function(b, c) {
	var d = new RegExp("(^|&|\\?|#)" + baidu.string.escapeReg(c)
			+ "=([^&#]*)(&|\x24|#)", "");
	var a = b.match(d);
	if (a) {
		return a[2]
	}
	return null
};
baidu.url.jsonToQuery = function(c, f) {
	var a = [], d, b = f || function(g) {
		return baidu.url.escapeSymbol(g)
	};
	baidu.object.each(c, function(h, g) {
		if (baidu.lang.isArray(h)) {
			d = h.length;
			while (d--) {
				a.push(g + "=" + b(h[d], g))
			}
		} else {
			a.push(g + "=" + b(h, g))
		}
	});
	return a.join("&")
};
baidu.url.queryToJson = function(a) {
	var g = a.substr(a.lastIndexOf("?") + 1), c = g.split("&"), f = c.length, l = {}, d = 0, j, h, k, b;
	for (; d < f; d++) {
		if (!c[d]) {
			continue
		}
		b = c[d].split("=");
		j = b[0];
		h = b[1];
		k = l[j];
		if ("undefined" == typeof k) {
			l[j] = h
		} else {
			if (baidu.lang.isArray(k)) {
				k.push(h)
			} else {
				l[j] = [ k, h ]
			}
		}
	}
	return l
};
baidu.ui = baidu.ui || {};
baidu.ui.slider = baidu.ui.slider || {};
baidu.ui.create = function(g, a) {
	a = baidu.extend( {
		autoRender : true
	}, a);
	var c = a.parent, b = a.element, f = a.autoRender;
	a.autoRender = a.parent = a.element = null;
	var d = new g(a);
	if (c && d.setParent) {
		d.setParent(c)
	}
	if (a.autoRender && d.render) {
		d.render(a.element)
	}
	return d
};
baidu.ui.Base = {
	id : "",
	getId : function(a) {
		var c = this, b;
		b = "tangram-" + c.uiType + "--" + (c.id ? c.id : c.guid);
		return a ? b + "-" + a : b
	},
	getClass : function(a) {
		var c = this, b = c.classPrefix || "tangram-" + c.uiType.toLowerCase();
		skinName = c.skin;
		if (a) {
			b += "-" + a;
			skinName += "-" + a
		}
		if (c.skin) {
			b += " " + skinName
		}
		return b
	},
	getMain : function() {
		return baidu.g(this.mainId)
	},
	getBody : function() {
		return baidu.g(this.getId())
	},
	uiType : "",
	addons : [],
	getCallRef : function() {
		return "window['$BAIDU$']._instances['" + this.guid + "']"
	},
	getCallString : function(d) {
		var c = 0, b = Array.prototype.slice.call(arguments, 1), a = b.length;
		for (; c < a; c++) {
			if (typeof b[c] == "string") {
				b[c] = "'" + b[c] + "'"
			}
		}
		return this.getCallRef() + "." + d + "(" + b.join(",") + ");"
	},
	renderMain : function(b) {
		var d = this, c = 0, a;
		if (d.getMain()) {
			return
		}
		b = baidu.g(b);
		if (!b) {
			b = document.createElement("div");
			document.body.appendChild(b);
			b.style.position = "absolute";
			b.className = d.getClass("main")
		}
		if (!b.id) {
			b.id = d.getId("main")
		}
		d.mainId = b.id;
		b.setAttribute("data-guid", d.guid);
		return b
	},
	dispose : function() {
		this.dispatchEvent("dispose");
		baidu.lang.Class.prototype.dispose.call(this)
	}
};
baidu.ui.createUI = function(f, b) {
	b = b || {};
	var d = b.superClass || baidu.lang.Class, c, j, g = function(k) {
		var l = this;
		k = k || {};
		d.call(l, d != baidu.lang.Class ? k : (k.guid || ""));
		baidu.object.extend(l, g.options);
		baidu.object.extend(l, k);
		l.classPrefix = l.classPrefix || "tangram-" + l.uiType.toLowerCase();
		for (c in baidu.ui.behavior) {
			if (typeof l[c] != "undefined") {
				baidu.object.extend(l, baidu.ui.behavior[c]);
				baidu.ui.behavior[c].call(l)
			}
		}
		f.apply(l, arguments);
		for (c = 0, j = g.addons.length; c < j; c++) {
			g.addons[c](l)
		}
	}, h = function() {
	};
	h.prototype = d.prototype;
	var a = g.prototype = new h();
	for (c in baidu.ui.Base) {
		a[c] = baidu.ui.Base[c]
	}
	g.extend = function(l) {
		for (c in l) {
			g.prototype[c] = l[c]
		}
		var k = l.uiType, m = k ? baidu.ui[k] : "";
		if (m) {
			m.create = function(n) {
				return baidu.ui.create(
						m[k.charAt(0).toUpperCase() + k.slice(1)], n)
			}
		}
		return g
	};
	g.addons = [];
	g.register = function(k) {
		if (typeof k == "function") {
			g.addons.push(k)
		}
	};
	g.options = {};
	return g
};
baidu.ui.slider.Slider = baidu.ui
		.createUI(function(a) {
			var b = this;
			a = a || {};
			b.layout = a.layout || "horizontal";
			if (!a.range) {
				b.range = [ b.min, b.max ]
			}
		})
		.extend(
				{
					layout : "horizontal",
					uiType : "slider",
					tplBody : '<div id="#{id}" class="#{class}" onmousedown="#{mousedown}">#{thumb}</div>',
					tplThumb : '<div id="#{thumbId}" class="#{thumbClass}" style="position:absolute;" onmouseover="#{mouseover}" onmouseout="#{mouseout}" onmousedown="#{mousedown}" onmouseup="#{mouseup}" ></div>',
					axis : {
						horizontal : {
							mousePos : "x",
							mainPos : "left",
							thumbSize : "offsetWidth",
							thumbPos : "left",
							_getSize : "_getWidth",
							_getThumbSize : "_getThumbWidth"
						},
						vertical : {
							mousePos : "y",
							mainPos : "top",
							thumbSize : "offsetHeight",
							thumbPos : "top",
							_getSize : "_getHeight",
							_getThumbSize : "_getThumbHeight"
						}
					},
					value : 0,
					min : 0,
					max : 100,
					disabled : false,
					_dragOpt : {},
					_mouseDown : function(f) {
						var d = this, b = baidu.page.getMousePosition(), c = baidu.dom
								.getPosition(d.getMain()), a = 0;
						if (baidu.event.getTarget(f) == d.getThumb()) {
							return
						}
						a = b[d.axis[d.layout].mousePos]
								- c[d.axis[d.layout].mainPos]
								- d.getThumb()[d.axis[d.layout].thumbSize] / 2;
						d._calcValue(a);
						d.dispatchEvent("slideclick");
						if (d.update()) {
							d.dispatchEvent("slidestop")
						}
					},
					_createThumb : function() {
						var a = this;
						a._dragOpt = {
							ondragend : function() {
								a._thumbDragging = false;
								baidu.dom.removeClass(a.getThumb(), a
										.getClass("thumb-press"));
								a._thumbState == "mouseout"
										&& baidu.dom.removeClass(a.getThumb(),
												a.getClass("thumb-hover"));
								a.dispatchEvent("slidestop")
							},
							ondragstart : function() {
								a._thumbDragging = true;
								a.dispatchEvent("slidestart")
							},
							ondrag : function() {
								var b = a.getThumb().style[a.axis[a.layout].thumbPos];
								a._calcValue(parseInt(b));
								a.dispatchEvent("slide")
							},
							range : [ 0, 0, 0, 0 ]
						};
						a._updateDragRange();
						baidu.dom.draggable(a.getThumb(), a._dragOpt)
					},
					_updateDragRange : function() {
						var c = this, a = c.range, b = 0;
						c._dragOpt.range[2] = c._getHeight();
						b = (c[c.axis[c.layout]._getSize]() - c[c.axis[c.layout]._getThumbSize]
								())
								/ (c.max - c.min);
						if (c.layout == "horizontal") {
							if (typeof a != "undefined") {
								c._dragOpt.range[1] = a[1] * b
										+ c._getThumbWidth();
								c._dragOpt.range[3] = a[0] * b
							} else {
								c._dragOpt.range[1] = c._getWidth();
								c._dragOpt.range[3] = 0
							}
						} else {
							if (typeof a != "undefined") {
								c._dragOpt.range[2] = a[1] * b
										+ c._getThumbHeight();
								c._dragOpt.range[1] = c._getThumbWidth()
							} else {
								c._dragOpt.range[1] = c._getWidth();
								c._dragOpt.range[3] = 0
							}
						}
					},
					update : function(b) {
						var c = this, a = 0;
						b = b || {};
						baidu.object.extend(c, b);
						c._updateDragRange();
						c._adjustValue();
						if (c.value == c._lastValue) {
							return
						}
						c._lastValue = c.value;
						if (c.dispatchEvent("beforesliderto", {
							drop : b.drop
						})) {
							a = c[c.axis[c.layout]._getSize]()
									- c[c.axis[c.layout]._getThumbSize]();
							baidu.dom.setStyle(c.getThumb(),
									c.axis[c.layout].thumbPos, c.value * (a)
											/ (c.max - c.min));
							c.dispatchEvent("update")
						}
					},
					_adjustValue : function() {
						var a = this;
						a.value = Math.max(Math.min(a.value, a.range[1]),
								a.range[0])
					},
					_calcValue : function(c) {
						var b = this, a = b[b.axis[b.layout]._getSize]()
								- b[b.axis[b.layout]._getThumbSize]();
						b.value = c * (b.max - b.min) / (a);
						b._adjustValue()
					},
					_getWidth : function() {
						return parseInt(baidu.dom.getStyle(this.getBody(),
								"width"))
					},
					_getHeight : function() {
						return parseInt(baidu.dom.getStyle(this.getBody(),
								"height"))
					},
					_getThumbWidth : function() {
						return parseInt(baidu.dom.getStyle(this.getThumb(),
								"width"))
					},
					_getThumbHeight : function() {
						return parseInt(baidu.dom.getStyle(this.getThumb(),
								"height"))
					},
					_mouseHandler : function(a) {
						var f = this, a = a || window.event, d = f._thumbState = a.type
								.toLowerCase(), b = f.getThumb(), c = {
							mouseover : function() {
								baidu.dom
										.addClass(b, f.getClass("thumb-hover"))
							},
							mouseout : function() {
								if (!f._thumbDragging) {
									baidu.dom.removeClass(b, f
											.getClass("thumb-press"));
									baidu.dom.removeClass(b, f
											.getClass("thumb-hover"))
								}
							},
							mousedown : function() {
								baidu.dom
										.addClass(b, f.getClass("thumb-press"))
							},
							mouseup : function() {
								if (baidu.event.getTarget(a).id != b.id) {
									baidu.dom.removeClass(b, f
											.getClass("thumb-hover"))
								}
							}
						};
						c.hasOwnProperty(d) && c[d].call()
					},
					getValue : function() {
						return this.value
					},
					disable : function() {
						this.disabled = true
					},
					enable : function() {
						this.disabled = false
					},
					getTarget : function() {
						return baidu.g(this.targetId)
					},
					getThumb : function() {
						return baidu.g(this.getId("thumb"))
					},
					dispose : function() {
						var a = this;
						baidu.dom.remove(a.getId())
					}
				});
baidu.fx = baidu.fx || {};
baidu.fx.Timeline = baidu.lang.createClass(function(a) {
	baidu.object.extend(this, baidu.fx.Timeline.options);
	baidu.object.extend(this, a)
}, {
	className : "baidu.fx.Timeline",
	options : {
		interval : 16,
		duration : 500,
		dynamic : true
	}
}).extend(
		{
			launch : function() {
				var a = this;
				a.dispatchEvent("onbeforestart");
				typeof a.initialize == "function" && a.initialize();
				a["\x06btime"] = new Date().getTime();
				a["\x06etime"] = a["\x06btime"] + (a.dynamic ? a.duration : 0);
				a["\x06pulsed"]();
				return a
			},
			"\x06pulsed" : function() {
				var b = this;
				var a = new Date().getTime();
				b.percent = (a - b["\x06btime"]) / b.duration;
				b.dispatchEvent("onbeforeupdate");
				if (a >= b["\x06etime"]) {
					typeof b.render == "function"
							&& b.render(b.transition(b.percent = 1));
					typeof b.finish == "function" && b.finish();
					b.dispatchEvent("onafterfinish");
					b.dispose();
					return
				}
				typeof b.render == "function"
						&& b.render(b.transition(b.percent));
				b.dispatchEvent("onafterupdate");
				b["\x06timer"] = setTimeout(function() {
					b["\x06pulsed"]()
				}, b.interval)
			},
			transition : function(a) {
				return a
			},
			cancel : function() {
				this["\x06timer"] && clearTimeout(this["\x06timer"]);
				this["\x06etime"] = this["\x06btime"];
				typeof this.restore == "function" && this.restore();
				this.dispatchEvent("oncancel");
				this.dispose()
			},
			end : function() {
				this["\x06timer"] && clearTimeout(this["\x06timer"]);
				this["\x06etime"] = this["\x06btime"];
				this["\x06pulsed"]()
			}
		});
baidu.fx.create = function(d, b, c) {
	var f = new baidu.fx.Timeline(b);
	f.element = d;
	f._className = c || f._className;
	f["\x06original"] = {};
	var a = "baidu_current_effect";
	f.addEventListener("onbeforestart", function() {
		var h = this, g;
		h.attribName = "att_" + h._className.replace(/\W/g, "_");
		g = h.element.getAttribute(a);
		h.element.setAttribute(a, (g || "") + "|" + h.guid + "|", 0);
		if (!h.overlapping) {
			(g = h.element.getAttribute(h.attribName))
					&& window[baidu.guid]._instances[g].cancel();
			h.element.setAttribute(h.attribName, h.guid, 0)
		}
	});
	f["\x06clean"] = function(g) {
		if (g = this.element) {
			g.removeAttribute(this.attribName);
			guid = g.getAttribute(a);
			guid = guid.replace("|" + this.guid + "|", "");
			if (!guid) {
				g.removeAttribute(a)
			} else {
				g.setAttribute(a, guid, 0)
			}
		}
	};
	f.addEventListener("oncancel", function() {
		this["\x06clean"]();
		this["\x06restore"]()
	});
	f.addEventListener("onafterfinish", function() {
		this["\x06clean"]();
		this.restoreAfterFinish && this["\x06restore"]()
	});
	f.protect = function(g) {
		this["\x06original"][g] = this.element.style[g]
	};
	f["\x06restore"] = function() {
		var k = this["\x06original"], j = this.element.style, g;
		for ( var h in k) {
			g = k[h];
			if (typeof g == "undefined") {
				continue
			}
			j[h] = g;
			if (!g && j.removeAttribute) {
				j.removeAttribute(h)
			} else {
				if (!g && j.removeProperty) {
					j.removeProperty(h)
				}
			}
		}
	};
	return f
};
baidu.fx.move = function(b, a) {
	if (!(b = baidu.dom.g(b)) || baidu.dom.getStyle(b, "position") == "static") {
		return null
	}
	a = baidu.object.extend( {
		x : 0,
		y : 0
	}, a || {});
	if (a.x == 0 && a.y == 0) {
		return null
	}
	var c = baidu.fx.create(b, baidu.object.extend( {
		initialize : function() {
			this.protect("top");
			this.protect("left");
			this.originX = parseInt(baidu.dom.getStyle(b, "left")) || 0;
			this.originY = parseInt(baidu.dom.getStyle(b, "top")) || 0
		},
		transition : function(d) {
			return 1 - Math.pow(1 - d, 2)
		},
		render : function(d) {
			b.style.top = (this.y * d + this.originY) + "px";
			b.style.left = (this.x * d + this.originX) + "px"
		}
	}, a), "baidu.fx.move");
	return c.launch()
};
baidu.fx.moveTo = function(d, b, c) {
	if (!(d = baidu.dom.g(d)) || baidu.dom.getStyle(d, "position") == "static"
			|| typeof b != "object") {
		return null
	}
	var g = [ b[0] || b.x || 0, b[1] || b.y || 0 ];
	var a = parseInt(baidu.dom.getStyle(d, "left")) || 0;
	var h = parseInt(baidu.dom.getStyle(d, "top")) || 0;
	var f = baidu.fx.move(d, baidu.object.extend( {
		x : g[0] - a,
		y : g[1] - h
	}, c || {}));
	return f
};
baidu.fx.current = function(d) {
	if (!(d = baidu.dom.g(d))) {
		return null
	}
	var b, g, f = /\|([^\|]+)\|/g;
	do {
		if (g = d.getAttribute("baidu_current_effect")) {
			break
		}
	} while ((d = d.parentNode) && d.nodeType == 1);
	if (!g) {
		return null
	}
	if ((b = g.match(f))) {
		f = /\|([^\|]+)\|/;
		for ( var c = 0; c < b.length; c++) {
			f.test(b[c]);
			b[c] = window[baidu.guid]._instances[RegExp["\x241"]]
		}
	}
	return b
};
baidu.ui.slider.Slider.register(function(a) {
	a.addEventListener("beforesliderto", function(c) {
		if (!c.drop) {
			if (baidu.fx.current(a.getThumb())) {
				return
			}
			var b = a[a.axis[a.layout]._getSize]()
					- a[a.axis[a.layout]._getThumbSize](), f = {};
			f[a.axis[a.layout].mousePos] = a.value * (b) / (a.max - a.min);
			function d(g) {
				var h = g.type;
				if (h != "onbeforestart") {
					a.dispatchEvent("update")
				}
				a.dispatchEvent(h + "fx")
			}
			baidu.fx.moveTo(a.getThumb(), f, {
				duration : 200,
				onbeforestart : d,
				onafterupdate : d,
				onafterfinish : d
			})
		}
		c.returnValue = c.drop
	})
});
baidu.ui.progressBar = baidu.ui.progressBar || {};
baidu.ui.progressBar.ProgressBar = baidu.ui.createUI(function(a) {
}).extend( {
	uiType : "progressBar",
	tplBody : '<div id="#{id}" class="#{class}">#{bar}</div>',
	tplBar : '<div id="#{barId}" class="#{barClass}"></div>',
	value : 0,
	_min : 0,
	_max : 100,
	axis : {
		horizontal : {
			offsetSize : "offsetWidth",
			size : "width"
		},
		vertical : {
			offsetSize : "offsetHeight",
			size : "height"
		}
	},
	update : function(b) {
		var c = this;
		b = b || {};
		baidu.object.extend(c, b);
		c.value = Math.max(Math.min(c.value, c._max), c._min);
		if (c.value == c._lastValue) {
			return
		}
		var a = c.axis[c.layout].size;
		baidu.dom.setStyle(c.getBar(), a, c._calcPos(c.value));
		c._lastValue = c.value;
		c.dispatchEvent("update")
	},
	getValue : function() {
		var a = this;
		return a.value
	},
	_calcPos : function(c) {
		var b = this;
		var a = b.getBody()[b.axis[b.layout].offsetSize];
		return c * (a) / (b._max - b._min)
	},
	disable : function() {
		this.disabled = true
	},
	enable : function() {
		this.disabled = false
	},
	getTarget : function() {
		return baidu.g(this.targetId)
	},
	getBar : function() {
		return baidu.g(this.getId("bar"))
	},
	dispose : function() {
		var a = this;
		baidu.dom.remove(a.getId())
	}
});
baidu.ui.slider.Slider.register(function(a) {
	a.addEventListener("load", function() {
		baidu.dom.insertHTML(a.getThumb(), "beforeBegin", a
				.getProgressBarString());
		a.progressBar = baidu.ui.create(baidu.ui.progressBar.ProgressBar, {
			layout : a.layout,
			skin : a.skin ? a.skin + "-followProgressbar" : null
		});
		a.progressBar.render(a.getId("followProgressBar"));
		a.adjustProgressbar()
	});
	a.addEventListeners("slide, slideclick", function() {
		a._adjustProgressbar()
	})
});
baidu.ui.slider.Slider
		.extend( {
			tplProgressBar : "<div id='#{rsid}' class='#{class}' style='position:absolute; left:0px; top:0px;'></div>",
			getProgressBarString : function() {
				var a = this;
				return baidu.string.format(a.tplProgressBar, {
					rsid : a.getId("followProgressBar"),
					"class" : a.getClass("followProgressbar")
				})
			},
			_adjustProgressbar : function() {
				var d = this, c = d.layout, a = d.axis[c], b = parseInt(
						baidu.dom.getStyle(d.getThumb(), a.thumbPos), 10);
				d.progressBar.getBar().style[d.progressBar.axis[c].size] = (isNaN(b) ? 0
						: b)
						+ d[a._getThumbSize]() / 2 + "px"
			}
		});
baidu.ui.accordion = baidu.ui.accordion || {};
baidu.ui.ItemSet = baidu.ui.createUI(function(a) {
})
		.extend(
				{
					currentClass : "current",
					tplHead : "",
					tplBody : "",
					headIds : [],
					bodyIds : [],
					switchType : "click",
					defaultIndex : 0,
					_getHeadString : function(d, b) {
						var c = this, a = c.getId("head" + b);
						c.headIds.push(a);
						if (b == c.defaultIndex) {
							c.addEventListener("onload", function() {
								c.setCurrentHead(baidu.g(a))
							})
						}
						return baidu.format(c.tplHead, {
							id : a,
							bodyId : c.getId("body" + b),
							"class" : b == c.defaultIndex ? c.getClass("head")
									+ " " + c.getClass(c.currentClass) : c
									.getClass("head"),
							head : d.head,
							tangram : "name : " + c.getId("body" + b)
						})
					},
					_getBodyString : function(c, a) {
						var b = this, d = b.getId("body" + a);
						b.bodyIds.push(d);
						return baidu.format(b.tplBody, {
							id : d,
							"class" : b.getClass("body"),
							body : c.body,
							display : a == b.defaultIndex ? "block" : "none"
						})
					},
					_getSwitchHandler : function(a) {
						var b = this;
						if (b.dispatchEvent("onbeforeswitch", {
							element : a
						})) {
							b.switchByHead(a);
							b.dispatchEvent("onswitch")
						}
					},
					_addSwitchEvent : function(a) {
						var b = this;
						a["on" + b.switchType] = baidu.fn.bind(
								"_getSwitchHandler", b, a)
					},
					render : function(a) {
						var b = this;
						baidu.dom.insertHTML(b.renderMain(a), "beforeEnd", b
								.getString());
						baidu.each(b.getHeads(), function(d, c) {
							b._addSwitchEvent(d);
							c == 0 && b.setCurrentHead(d)
						});
						b.dispatchEvent("onload")
					},
					getHeads : function() {
						var b = this, a = [];
						baidu.each(b.headIds, function(d, c) {
							a.push(baidu.g(d))
						});
						return a
					},
					getBodies : function() {
						var b = this, a = [];
						baidu.each(b.bodyIds, function(d, c) {
							a.push(baidu.g(d))
						});
						return a
					},
					getCurrentHead : function() {
						return this.currentHead
					},
					setCurrentHead : function(a) {
						this.currentHead = a
					},
					getBodyByHead : function(a) {
						return baidu.g(a.getAttribute("bodyId"))
					},
					addItem : function(b) {
						var a = this.getHeads().length;
						this.insertItemHTML(b, a);
						this._addSwitchEvent(this.getHeads()[a])
					},
					removeItem : function(c) {
						var d = this.getHeads()[c], b = d.id, a = this
								.getBodyByHead(d), f = a.id;
						baidu.dom.remove(d);
						baidu.dom.remove(a);
						baidu.array.remove(this.headIds, b);
						baidu.array.remove(this.bodyIds, f)
					},
					_switch : function(a) {
						var c = this, b = c.getCurrentHead();
						if (b) {
							c.getBodyByHead(b).style.display = "none";
							baidu.dom
									.removeClass(b, c.getClass(c.currentClass))
						}
						c.setCurrentHead(a);
						c.getBodyByHead(a).style.display = "block";
						baidu.dom.addClass(a, c.getClass(c.currentClass))
					},
					switchByHead : function(a) {
						var b = this;
						if (b.dispatchEvent("beforeswitchbyhead", {
							element : a
						})) {
							b._switch(a)
						}
					},
					switchByIndex : function(a) {
						this.switchByHead(this.getHeads()[a])
					},
					dispose : function() {
						this.dispatchEvent("ondispose")
					}
				});
baidu.ui.accordion.Accordion = baidu.ui
		.createUI(function(a) {
		}, {
			superClass : baidu.ui.ItemSet
		})
		.extend(
				{
					uiType : "accordion",
					target : document.body,
					tplDOM : "<div id='#{id}' class='#{class}'>#{items}</div>",
					tplHead : '<div id="#{id}" bodyId="#{bodyId}" class="#{class}" >#{head}</div>',
					tplBody : "<div id='#{id}' class='#{class}' style='display:#{display};'>#{body}</div>",
					getString : function() {
						var b = this, a = this.items, c = [];
						baidu.each(a, function(f, d) {
							c.push(b._getHeadString(f, d)
									+ b._getBodyString(f, d))
						});
						return baidu.format(this.tplDOM, {
							id : b.getId(),
							"class" : b.getClass(),
							items : c.join("")
						})
					},
					insertItemHTML : function(c, a) {
						var b = this;
						baidu.dom.insertHTML(b.getMain(), "beforeEnd", b
								._getHeadString(c, a));
						baidu.dom.insertHTML(b.getMain(), "beforeEnd", b
								._getBodyString(c, a))
					}
				});
baidu.fx.Timeline = baidu.lang.createClass(function(a) {
	baidu.object.extend(this, baidu.fx.Timeline.options);
	baidu.object.extend(this, a)
}, {
	className : "baidu.fx.Timeline",
	options : {
		interval : 16,
		duration : 500,
		dynamic : true
	}
}).extend(
		{
			launch : function() {
				var a = this;
				a.dispatchEvent("onbeforestart");
				typeof a.initialize == "function" && a.initialize();
				a["\x06btime"] = new Date().getTime();
				a["\x06etime"] = a["\x06btime"] + (a.dynamic ? a.duration : 0);
				a["\x06pulsed"]();
				return a
			},
			"\x06pulsed" : function() {
				var b = this;
				var a = new Date().getTime();
				b.percent = (a - b["\x06btime"]) / b.duration;
				b.dispatchEvent("onbeforeupdate");
				if (a >= b["\x06etime"]) {
					typeof b.render == "function"
							&& b.render(b.transition(b.percent = 1));
					typeof b.finish == "function" && b.finish();
					b.dispatchEvent("onafterfinish");
					b.dispose();
					return
				}
				typeof b.render == "function"
						&& b.render(b.transition(b.percent));
				b.dispatchEvent("onafterupdate");
				b["\x06timer"] = setTimeout(function() {
					b["\x06pulsed"]()
				}, b.interval)
			},
			transition : function(a) {
				return a
			},
			cancel : function() {
				this["\x06timer"] && clearTimeout(this["\x06timer"]);
				this["\x06etime"] = this["\x06btime"];
				typeof this.restore == "function" && this.restore();
				this.dispatchEvent("oncancel");
				this.dispose()
			},
			end : function() {
				this["\x06timer"] && clearTimeout(this["\x06timer"]);
				this["\x06etime"] = this["\x06btime"];
				this["\x06pulsed"]()
			}
		});
baidu.fx.expand = function(f, d) {
	if (!(f = baidu.dom.g(f))) {
		return null
	}
	var h = f, c, a, b = [ "paddingBottom", "paddingTop", "borderTopWidth",
			"borderBottomWidth" ];
	var g = baidu.fx.create(h, baidu.object.extend( {
		initialize : function() {
			baidu.dom.show(h);
			this.protect("height");
			this.protect("overflow");
			this.restoreAfterFinish = true;
			a = c = h.offsetHeight;
			function j(m, l) {
				var k = parseInt(baidu.getStyle(m, l));
				k = isNaN(k) ? 0 : k;
				k = baidu.lang.isNumber(k) ? k : 0;
				return k
			}
			baidu.each(b, function(k) {
				a -= j(h, k)
			});
			h.style.overflow = "hidden";
			h.style.height = "1px"
		},
		transition : function(j) {
			return Math.sqrt(j)
		},
		render : function(j) {
			h.style.height = Math.floor(j * a) + "px"
		}
	}, d || {}), "baidu.fx.expand_collapse");
	return g.launch()
};
baidu.fx.collapse = function(c, b) {
	if (!(c = baidu.dom.g(c))) {
		return null
	}
	var f = c, a;
	var d = baidu.fx.create(f, baidu.object.extend( {
		initialize : function() {
			this.protect("height");
			this.protect("overflow");
			this.restoreAfterFinish = true;
			a = f.offsetHeight;
			f.style.overflow = "hidden"
		},
		transition : function(g) {
			return Math.pow(1 - g, 2)
		},
		render : function(g) {
			f.style.height = Math.floor(g * a) + "px"
		},
		finish : function() {
			baidu.dom.hide(f)
		}
	}, b || {}), "baidu.fx.expand_collapse");
	return d.launch()
};
baidu.ui.accordion.Accordion.register(function(a) {
	a.addEventListener("beforeswitchbyhead", function(d) {
		var h = a.getCurrentHead(), f = h && a.getBodyByHead(h), j = a
				.getBodyByHead(d.element), c = h && h.id, g, b;
		if (!baidu.fx.current(a._fxElement) && c != d.element.id) {
			a._fxElement = j;
			baidu.fx.expand(j, baidu.object.extend( {
				duration : 200,
				onafterfinish : function() {
					a._switch(d.element);
					if (f) {
						f.style.height = j.style.height;
						f.style.overflow = "auto"
					}
				}
			}, f ? {
				onbeforestart : function() {
					f.style.overflow = "hidden";
					f.style.height = parseInt(baidu.dom.getStyle(f, "height"))
							- 1 + "px"
				},
				onbeforeupdate : function() {
					b = parseInt(baidu.dom.getStyle(j, "height"))
				},
				onafterupdate : function() {
					f.style.height = parseInt(baidu.dom.getStyle(f, "height"))
							- parseInt(baidu.dom.getStyle(j, "height")) + b
							+ "px"
				}
			} : {}))
		}
		d.returnValue = false
	})
});
baidu.ui.popup = baidu.ui.popup || {
	instances : {}
};
baidu.ui.popup.Popup = baidu.ui.createUI(function(a) {
}).extend( {
	uiType : "popup",
	width : "",
	height : "",
	top : "auto",
	left : "auto",
	zIndex : 1200,
	contentText : "",
	onbeforeclose : function() {
		return true
	},
	tplBody : "<div id='#{id}' class='#{class}'></div>",
	isShown : function() {
		return baidu.ui.popup.instances[this.guid] == "show"
	},
	getString : function() {
		var a = this;
		return baidu.format(a.tplBody, {
			id : a.getId(),
			"class" : a.getClass()
		})
	},
	render : function() {
		var b = this, a;
		if (b.getMain()) {
			return
		}
		a = b.renderMain();
		a.innerHTML = b.getString();
		b.update(b);
		baidu.dom.setStyles(b.getMain(), {
			position : "absolute",
			zIndex : b.zIndex,
			marginLeft : "-100000px"
		});
		b.dispatchEvent("onload");
		return a
	},
	open : function(a) {
		var b = this;
		b.update(a);
		b.getMain().style.marginLeft = "auto";
		baidu.ui.popup.instances[b.guid] = "show";
		b.dispatchEvent("onopen")
	},
	close : function() {
		var a = this;
		if (a.dispatchEvent("onbeforeclose")) {
			a.getMain().style.marginLeft = "-100000px";
			baidu.ui.popup.instances[a.guid] = "hide";
			a.dispatchEvent("onclose")
		}
	},
	update : function(b) {
		b = b || {};
		var c = this, a = c.getBody();
		baidu.object.extend(c, b);
		if (b.content) {
			if (a.firstChild != b.content) {
				a.innerHTML = "";
				a.appendChild(b.content)
			}
		} else {
			if (b.contentText) {
				a.innerHTML = b.contentText
			}
		}
		c._updateSize();
		c._updatePosition();
		c.dispatchEvent("onupdate")
	},
	_updateSize : function() {
		var a = this;
		baidu.dom.setStyles(a.getMain(), {
			width : a.width,
			height : a.height
		})
	},
	_updatePosition : function() {
		var a = this;
		baidu.dom.setStyles(a.getMain(), {
			top : a.top,
			left : a.left
		})
	},
	dispose : function() {
		var a = this;
		a.dispatchEvent("ondispose");
		baidu.dom.remove(a.getMain());
		baidu.lang.Class.prototype.dispose.call(a)
	}
});
baidu.ui.popup.create = function(a) {
	var b = new baidu.ui.popup.Popup(a);
	b.render();
	return b
};
baidu.fx.opacity = function(b, a) {
	if (!(b = baidu.dom.g(b))) {
		return null
	}
	a = baidu.object.extend( {
		from : 0,
		to : 1
	}, a || {});
	var d = b;
	var c = baidu.fx
			.create(
					d,
					baidu.object
							.extend(
									{
										initialize : function() {
											baidu.dom.show(b);
											if (baidu.browser.ie) {
												this.protect("filter")
											} else {
												this.protect("opacity");
												this.protect("KHTMLOpacity")
											}
											this.distance = this.to - this.from
										},
										render : function(f) {
											var g = this.distance * f
													+ this.from;
											if (!baidu.browser.ie) {
												d.style.opacity = g;
												d.style.KHTMLOpacity = g
											} else {
												d.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity:"
														+ Math.floor(g * 100)
														+ ")"
											}
										}
									}, a), "baidu.fx.opacity");
	return c.launch()
};
baidu.fx.fadeIn = function(b, a) {
	if (!(b = baidu.dom.g(b))) {
		return null
	}
	var c = baidu.fx.opacity(b, baidu.object.extend( {
		from : 0,
		to : 1,
		restoreAfterFinish : true
	}, a || {}));
	c._className = "baidu.fx.fadeIn";
	return c
};
baidu.fx.fadeOut = function(b, a) {
	if (!(b = baidu.dom.g(b))) {
		return null
	}
	var c = baidu.fx.opacity(b, baidu.object.extend( {
		from : 1,
		to : 0,
		restoreAfterFinish : true
	}, a || {}));
	c.addEventListener("onafterfinish", function() {
		baidu.dom.hide(this.element)
	});
	c._className = "baidu.fx.fadeOut";
	return c
};
baidu.fx.moveBy = function(b, g, a) {
	if (!(b = baidu.dom.g(b)) || baidu.dom.getStyle(b, "position") == "static"
			|| typeof g != "object") {
		return null
	}
	var f = {};
	f.x = g[0] || g.x || 0;
	f.y = g[1] || g.y || 0;
	var c = baidu.fx.move(b, baidu.object.extend(f, a || {}));
	return c
};
baidu.ui.popup.Popup.register(function(a) {
	a.addEventListener("open", function() {
		var c = a.getMain(), b = 300;
		if (!baidu.fx.current(c)) {
			clearTimeout(a.fxTimer);
			baidu.fx.moveBy(c, [ 0, -c.offsetHeight - 5 ], {
				duration : b
			});
			baidu.fx.fadeIn(c, {
				duration : b,
				onafterfinish : function() {
					a.fxTimer = setTimeout(function() {
						a.close()
					}, 300)
				}
			})
		}
	});
	a.addEventListener("beforeclose", function(d) {
		var c = a.getMain(), b = 300;
		baidu.fx.moveBy(c, [ 0, -c.offsetHeight ], {
			duration : b
		});
		baidu.fx.fadeOut(c, {
			duration : b,
			onafterfinish : function() {
				setTimeout(function() {
					c.style.display = ""
				}, 0);
				c.style.marginLeft = "-100000px";
				baidu.ui.popup.instances[a.guid] = "hide";
				a.dispatchEvent("onclose")
			}
		});
		d.returnValue = false
	})
});
baidu.suggestion = baidu.ui.suggestion = baidu.ui.suggestion || {};
baidu.ui.get = function(a) {
	var b;
	if (baidu.lang.isString(a)) {
		return baidu.lang.instance(a)
	} else {
		do {
			if (!a || a.nodeType == 9) {
				return null
			}
			if (b = baidu.dom.getAttr(a, "data-guid")) {
				return baidu.lang.instance(b)
			}
		} while ((a = a.parentNode) != document.body)
	}
};
baidu.ui.suggestion.Suggestion = baidu.ui
		.createUI(function(a) {
			var b = this;
			b.addEventListener("onload", function() {
				baidu.on(document, "mousedown", b.documentMousedownHandler);
				baidu.on(window, "blur", b.windowBlurHandler)
			});
			b.documentMousedownHandler = b.getDocumentMousedownHandler();
			b.windowBlurHandler = b.getWindowBlurHandler()
		})
		.extend(
				{
					event : new Object,
					uiType : "suggestion",
					onbeforepick : new Function,
					onpick : new Function,
					onconfirm : new Function,
					onhighlight : new Function,
					onshow : new Function,
					onhide : new Function,
					getData : function() {
						return []
					},
					prependHTML : "",
					appendHTML : "",
					currentData : {},
					tplDOM : "<div id='#{0}' class='#{1}' style='position:relative; top:0px; left:0px;'></div>",
					tplPrependAppend : "<div id='#{0}' class='#{1}'>#{2}</div>",
					tplBody : "<table cellspacing='0' cellpadding='2'><tbody>#{0}</tbody></table>",
					tplRow : '<tr><td id="#{0}" onmouseover="#{2}" onmouseout="#{3}" onmousedown="#{4}" onclick="#{5}">#{1}</td></tr>',
					getString : function() {
						var a = this;
						return baidu.format(a.tplDOM, a.getId(), a.getClass(),
								a.guid)
					},
					render : function(c) {
						var b = this, a, c = baidu.g(c);
						if (b.getMain() || !c) {
							return
						}
						if (c.id) {
							b.targetId = c.id
						} else {
							b.targetId = c.id = b.getId("input")
						}
						a = b.renderMain();
						a.style.display = "none";
						a.innerHTML = b.getString();
						this.dispatchEvent("onload")
					},
					isShowing : function() {
						var b = this, a = b.getMain();
						return a && a.style.display != "none"
					},
					pick : function(a) {
						var d = this, b = d.currentData, f = b
								&& typeof a == "number"
								&& typeof b[a] != "undefined" ? b[a].value : a, c = {
							data : {
								item : f == a ? {
									value : a,
									content : a
								} : b[a],
								index : a
							}
						};
						if (d.dispatchEvent("onbeforepick", c)) {
							d.dispatchEvent("onpick", c)
						}
					},
					show : function(g, f, c) {
						var b = 0, a = f.length, d = this;
						if (a == 0 && !c) {
							d.hide()
						} else {
							d.currentData = [];
							for (; b < a; b++) {
								if (typeof f[b].value != "undefined") {
									d.currentData.push(f[b])
								} else {
									d.currentData.push( {
										value : f[b],
										content : f[b]
									})
								}
							}
							d.getBody().innerHTML = d.getBodyString();
							d.getMain().style.display = "block";
							d.dispatchEvent("onshow")
						}
					},
					highlight : function(a) {
						var b = this;
						b.clearHighlight();
						b.getItem(a).className = b.getClass("current");
						this.dispatchEvent("onhighlight", {
							data : this.getDataByIndex(a)
						})
					},
					hide : function() {
						var a = this;
						if (!a.isShowing()) {
							return
						}
						a.getMain().style.display = "none";
						a.dispatchEvent("onhide")
					},
					confirm : function(a, c) {
						var b = this;
						b.pick(a);
						b.dispatchEvent("onconfirm", {
							data : b.getDataByIndex(a) || a,
							source : c
						});
						b.hide()
					},
					getDataByIndex : function(a) {
						return {
							item : this.currentData[a],
							index : a
						}
					},
					getTargetValue : function() {
						return this.getTarget().value
					},
					getHighlightIndex : function() {
						var c = this, a = c.currentData.length, b = 0;
						if (a && c.isShowing()) {
							for (; b < a; b++) {
								if (c.getItem(b).className == c
										.getClass("current")) {
									return b
								}
							}
						}
						return -1
					},
					clearHighlight : function() {
						var c = this, b = 0, a = c.currentData.length;
						for (; b < a; b++) {
							c.getItem(b).className = ""
						}
					},
					getTarget : function() {
						return baidu.g(this.targetId)
					},
					getItem : function(a) {
						return baidu.g(this.getId("item" + a))
					},
					getBodyString : function() {
						var g = this, f = "", d = [], h = g.currentData, a = h.length, c = 0;
						function b(j) {
							return baidu.format(g.tplPrependAppend, g.getId(j),
									g.getClass(j), g[j + "HTML"])
						}
						f += b("prepend");
						for (; c < a; c++) {
							d.push(baidu.format(g.tplRow, g.getId("item" + c),
									h[c].content, g
											.getCallString("itemOver", c), g
											.getCallString("itemOut"), g
											.getCallRef()
											+ ".itemDown(event, " + c + ")", g
											.getCallString("itemClick", c)))
						}
						f += baidu.format(g.tplBody, d.join(""));
						f += b("append");
						return f
					},
					itemOver : function(a) {
						this.highlight(a)
					},
					itemOut : function() {
						this.clearHighlight()
					},
					itemDown : function(b, a) {
						this.dispatchEvent("onmousedownitem", {
							data : this.getDataByIndex(a)
						});
						if (!baidu.ie) {
							b.stopPropagation();
							b.preventDefault();
							return false
						}
					},
					itemClick : function(a) {
						var b = this;
						b.dispatchEvent("onitemclick", {
							data : b.getDataByIndex(a)
						});
						b.confirm(a, "mouse")
					},
					getDocumentMousedownHandler : function() {
						var a = this;
						return function(d) {
							d = d || window.event;
							var b = d.target || d.srcElement, c = baidu.ui
									.get(b);
							if (b == a.getTarget()
									|| (c && c.uiType == a.uiType)) {
								return
							}
							a.hide()
						}
					},
					getWindowBlurHandler : function() {
						var a = this;
						return function() {
							a.hide()
						}
					},
					dispose : function() {
						var a = this;
						a.dispatchEvent("dispose");
						baidu.un(document, "mousedown",
								a.documentMousedownHandler);
						baidu.un(window, "blur", a.windowBlurHandler);
						baidu.dom.remove(a.mainId);
						baidu.lang.Class.prototype.dispose.call(this)
					}
				});
baidu.object.extend(baidu.ui.suggestion.Suggestion.prototype, {
	setData : function(d, c, b) {
		var a = this;
		a.dataCache[d] = c;
		if (!b) {
			a.show(d, a.dataCache[d])
		}
	}
});
baidu.ui.suggestion.Suggestion.register(function(a) {
	a.dataCache = {}, a.addEventListener("onneeddata", function(c, d) {
		var b = a.dataCache;
		if (typeof b[d] == "undefined") {
			a.getData(d)
		} else {
			a.show(d, b[d])
		}
	})
});
baidu.ui.suggestion.Suggestion.register(function(d) {
	var h, b = "", g, c, a = false, f = false;
	d.addEventListener("onload", function() {
		h = this.getTarget();
		g = h.value;
		d.targetKeydownHandler = d.getTargetKeydownHandler();
		baidu.on(h, "keydown", d.targetKeydownHandler);
		h.setAttribute("autocomplete", "off");
		d.circleTimer = setInterval(function() {
			if (f) {
				return
			}
			if (baidu.g(h) == null) {
				d.dispose()
			}
			var j = h.value;
			if (j == b && j != "" && j != g && j != c) {
				if (d.requestTimer == 0) {
					d.requestTimer = setTimeout(function() {
						d.dispatchEvent("onneeddata", j)
					}, 100)
				}
			} else {
				clearTimeout(d.requestTimer);
				d.requestTimer = 0;
				if (j == "" && b != "") {
					c = "";
					d.hide()
				}
				b = j;
				if (j != c) {
					d.defaultIptValue = j
				}
				if (g != h.value) {
					g = ""
				}
			}
		}, 10);
		baidu.on(h, "beforedeactivate", d.beforedeactivateHandler)
	});
	d.addEventListener("onitemclick", function() {
		f = false;
		d.defaultIptValue = b = d.getTargetValue()
	});
	d.addEventListener("onpick", function(j) {
		if (a) {
			h.blur()
		}
		h.value = c = j.data.item.value;
		if (a) {
			h.focus()
		}
	});
	d.addEventListener("onmousedownitem", function(j) {
		a = true;
		f = true;
		setTimeout(function() {
			f = false;
			a = false
		}, 500)
	});
	d.addEventListener("ondispose", function() {
		baidu.un(h, "keydown", d.targetKeydownHandler);
		baidu.un(h, "beforedeactivate", d.beforedeactivateHandler);
		clearInterval(d.circleTimer)
	})
});
baidu.object.extend(baidu.ui.suggestion.Suggestion.prototype, {
	selectIndexByKeybord : -1,
	beforedeactivateHandler : function() {
		return function() {
			if (mousedownView) {
				window.event.cancelBubble = true;
				window.event.returnValue = false
			}
		}
	},
	getTargetKeydownHandler : function() {
		var b = this;
		function a(c) {
			var f = b.currentData, d;
			if (!b.isShowing()) {
				b.dispatchEvent("onneeddata", b.getTargetValue());
				return
			}
			d = b.getHighlightIndex();
			b.clearHighlight();
			if (c) {
				if (d == 0) {
					b.pick(b.defaultIptValue);
					b.selectIndexByKeybord--;
					return
				}
				if (d == -1) {
					d = f.length
				}
				d--
			} else {
				if (d == f.length - 1) {
					b.pick(b.defaultIptValue);
					b.selectIndexByKeybord = -1;
					return
				}
				d++
			}
			b.highlight(d);
			b.pick(d);
			b.selectIndexByKeybord = d
		}
		return function(f) {
			var c = false, d;
			f = f || window.event;
			switch (f.keyCode) {
			case 9:
			case 27:
				b.hide();
				break;
			case 13:
				baidu.event.preventDefault(f);
				b.confirm(b.selectIndexByKeybord < 0 ? b.getTarget().value
						: b.selectIndexByKeybord, "keyboard");
				break;
			case 38:
				c = true;
			case 40:
				baidu.event.preventDefault(f);
				a(c);
				break
			}
		}
	},
	defaultIptValue : ""
});
baidu.ui.behavior = baidu.ui.behavior || {};
(function() {
	var b = baidu.ui.behavior.posable = function() {
	};
	b.setPosition = function(h, f, d) {
		f = baidu.g(f) || this.getMain();
		d = d || {};
		var g = this, c = [ f, h, d ];
		g.__execPosFn(f, "_positionByCoordinate", d.once, c)
	};
	b._positionByCoordinate = function(c, o, p, f) {
		o = o || [ 0, 0 ];
		p = p || {};
		var l = this, m = {}, j = baidu.page.getViewHeight(), n = baidu.page
				.getViewWidth(), g = c.offsetWidth, h = c.offsetHeight, d = c.offsetParent, k = (!d || d == document.body) ? {
			left : 0,
			top : 0
		}
				: baidu.dom.getPosition(d);
		p.position = p.position ? p.position.toLowerCase() : "bottomright";
		o = a(o || [ 0, 0 ]);
		p.offset = a(p.offset || [ 0, 0 ]);
		m.left = o.x + p.offset.x - k.left
				- (p.position.indexOf("left") >= 0 ? g : 0);
		m.top = o.y + p.offset.y - k.top
				- (p.position.indexOf("top") >= 0 ? h : 0);
		switch (p.insideScreen) {
		case "surround":
			m.left = o.x
					- k.left
					- (p.position.indexOf("left") >= 0 ? (o.x
							- baidu.page.getScrollLeft() > g ? g : 0) : (n
							- o.x + baidu.page.getScrollLeft() > g ? 0 : g));
			m.top = o.y
					- k.top
					- (p.position.indexOf("top") >= 0 ? (o.y
							- baidu.page.getScrollTop() > h ? h : 0) : (j - o.y
							+ baidu.page.getScrollTop() > h ? 0 : h));
			break;
		case "fix":
			m.left = Math.max(0 - parseFloat(baidu.dom
					.getStyle(c, "marginLeft")) || 0, Math.min(m.left,
					baidu.page.getViewWidth() - g - k.left));
			m.top = Math.max(
					0 - parseFloat(baidu.dom.getStyle(c, "marginTop")) || 0,
					Math.min(m.top, baidu.page.getViewHeight() - h - k.top));
			break
		}
		baidu.dom.setPosition(c, m);
		if (!f
				&& (j != baidu.page.getViewHeight() || n != baidu.page
						.getViewWidth())) {
			l._positionByCoordinate(c, o, {}, true)
		}
		f || l.dispatchEvent("onpositionupdate")
	};
	b.__execPosFn = function(d, h, f, c) {
		var g = this;
		if (typeof f == "undefined" || !f) {
			baidu.event.on(baidu.dom.getWindow(d), "resize", baidu.fn.bind
					.apply(g, [ h, g ].concat( [].slice.call(c))))
		} else {
			g[h].apply(g, c)
		}
	};
	function a(c) {
		c.x = c[0] || c.x || c.left || 0;
		c.y = c[1] || c.y || c.top || 0;
		return c
	}
})();
baidu.extend(baidu.ui.suggestion.Suggestion.prototype, {
	posable : true,
	fixWidth : true,
	getWindowResizeHandler : function() {
		var a = this;
		return function() {
			a.adjustPosition(true)
		}
	},
	adjustPosition : function(b) {
		var d = this, f = d.getTarget(), c, a = d.getMain(), g;
		if (!d.isShowing() && b) {
			return
		}
		c = baidu.dom.getPosition(f), g = {
			top : (c.top + f.offsetHeight - 1),
			left : c.left,
			width : f.offsetWidth
		};
		g = typeof d.view == "function" ? d.view(g) : g;
		d.setPosition( [ g.left, g.top ], null, {
			once : true
		});
		baidu.dom.setOuterWidth(a, g.width)
	}
});
baidu.ui.suggestion.Suggestion.register(function(a) {
	a.windowResizeHandler = a.getWindowResizeHandler();
	a.addEventListener("onload", function() {
		a.adjustPosition();
		if (a.fixWidth) {
			a.fixWidthTimer = setInterval(function() {
				var b = a.getMain(), c = a.getTarget();
				if (b.offsetWidth != 0 && c && c.offsetWidth != b.offsetWidth) {
					a.adjustPosition();
					b.style.display = "block"
				}
			}, 100)
		}
		baidu.on(window, "resize", a.windowResizeHandler)
	});
	a.addEventListener("onshow", function() {
		a.adjustPosition()
	});
	a.addEventListener("ondispose", function() {
		baidu.un(window, "resize", a.windowResizeHandler);
		clearInterval(a.fixWidthTimer)
	})
});
baidu.ui.suggestion.create = function(c, a) {
	var b = new baidu.ui.suggestion.Suggestion(a);
	b.render(c);
	return b
};
baidu.ui.dialog = baidu.ui.dialog || {
	instances : {}
};
baidu.ui.dialog.Dialog = baidu.ui
		.createUI(function(a) {
		})
		.extend(
				{
					uiType : "dialog",
					width : "",
					height : "",
					top : "auto",
					left : "auto",
					zIndex : 1000,
					titleText : "",
					contentText : "",
					onbeforeclose : function() {
						return true
					},
					tplDOM : "<div id='#{id}' class='#{class}' style='position:relative'>#{title}#{content}#{footer}</div>",
					tplTitle : "<div id='#{id}' class='#{class}'><span id='#{inner-id}' class='#{inner-class}'>#{content}</span></div>",
					tplContent : "<div id='#{id}' class='#{class}' style='overflow:auto; position:relative'>#{content}</div>",
					tplFooter : "<div id='#{id}' class='#{class}'></div>",
					isShown : function() {
						return baidu.ui.dialog.instances[this.guid] == "show"
					},
					getString : function() {
						var c = this, a, f = "title", d = "title-inner", b = "content", g = "footer";
						return baidu.format(c.tplDOM, {
							id : c.getId(),
							"class" : c.getClass(),
							title : baidu.format(c.tplTitle, {
								id : c.getId(f),
								"class" : c.getClass(f),
								"inner-id" : c.getId(d),
								"inner-class" : c.getClass(d),
								content : c.titleText
							}),
							content : baidu.format(c.tplContent, {
								id : c.getId(b),
								"class" : c.getClass(b),
								content : c.contentText
							}),
							footer : baidu.format(c.tplFooter, {
								id : c.getId(g),
								"class" : c.getClass(g)
							})
						})
					},
					render : function() {
						var b = this, a;
						if (b.getMain()) {
							return
						}
						a = b.renderMain();
						a.innerHTML = b.getString();
						b._update(b);
						baidu.dom.setStyles(b.getMain(), {
							position : "absolute",
							zIndex : this.zIndex,
							marginLeft : "-100000px"
						});
						b.windowResizeHandler = b.getWindowResizeHandler();
						baidu.on(window, "resize", b.windowResizeHandler);
						b.dispatchEvent("onload");
						return a
					},
					getWindowResizeHandler : function() {
						var a = this;
						return function() {
							a.update()
						}
					},
					open : function(a) {
						var b = this;
						b._update(a);
						b.getMain().style.marginLeft = "auto";
						baidu.ui.dialog.instances[b.guid] = "show";
						b.dispatchEvent("onopen")
					},
					close : function() {
						var a = this;
						if (a.dispatchEvent("onbeforeclose")) {
							a.getMain().style.marginLeft = "-100000px";
							baidu.ui.dialog.instances[a.guid] = "hide";
							a.dispatchEvent("onclose")
						}
					},
					_update : function(b) {
						b = b || {};
						var c = this, a = c.getContent();
						baidu.object.extend(c, b);
						if (b.content) {
							if (a.firstChild != b.content) {
								a.innerHTML = "";
								a.appendChild(b.content)
							}
						} else {
							if (b.contentText) {
								a.innerHTML = b.contentText
							}
						}
						if (b.titleText) {
							c.getTitleInner("title-inner").innerHTML = b.titleText
						}
						c._updatePosition()
					},
					update : function(a) {
						var b = this;
						a = a || {};
						b._update(a);
						b.dispatchEvent("onupdate")
					},
					_getBodyOffset : function() {
						var g = this, b, c = g.getBody(), f = g.getContent(), j = g
								.getTitle(), k = g.getFooter();
						b = {
							width : f.offsetWidth,
							height : f.offsetHeight
						};
						function d(n, m) {
							var l = parseInt(baidu.getStyle(n, m));
							l = isNaN(l) ? 0 : l;
							l = baidu.lang.isNumber(l) ? l : 0;
							return l
						}
						baidu.each( [ "marginLeft", "marginRight" ], function(
								m, l) {
							b.width += d(f, m)
						});
						b.height += j.offsetHeight + d(j, "marginTop");
						b.height += k.offsetHeight + d(k, "marginBottom");
						var a = d(f, "marginTop"), h = d(j, "marginBottom");
						b.height += a >= h ? a : h;
						a = d(k, "marginTop"), h = d(f, "marginBottom");
						b.height += a >= h ? a : h;
						return b
					},
					_updatePosition : function() {
						var f = this, g, j = "", c = "", b = "", h = "", d = f
								.getContent(), a = f.getBody();
						baidu.setStyles(d, {
							width : f.width,
							height : f.height
						});
						g = f._getBodyOffset();
						baidu.setStyles(a, g);
						if ((f.left && f.left != "auto")
								|| (f.right && f.right != "auto")) {
							h = f.left || "";
							c = f.right || ""
						} else {
							h = Math
									.max(
											(baidu.page.getViewWidth() - parseInt(f
													.getMain().offsetWidth))
													/ 2
													+ baidu.page
															.getScrollLeft(), 0)
						}
						if ((f.top && f.top != "auto")
								|| (f.bottom && f.bottom != "auto")) {
							j = f.top || "";
							b = f.bottom || ""
						} else {
							j = Math.max(
									(baidu.page.getViewHeight() - parseInt(f
											.getMain().offsetHeight))
											/ 2 + baidu.page.getScrollTop(), 0)
						}
						baidu.dom.setStyles(f.getMain(), {
							top : j,
							right : c,
							bottom : b,
							left : h
						})
					},
					getTitle : function() {
						return baidu.g(this.getId("title"))
					},
					getTitleInner : function() {
						return baidu.g(this.getId("title-inner"))
					},
					getContent : function() {
						return baidu.g(this.getId("content"))
					},
					getFooter : function() {
						return baidu.g(this.getId("footer"))
					},
					dispose : function() {
						var a = this;
						delete baidu.ui.dialog.instances[a.guid];
						a.dispatchEvent("dispose");
						baidu.un(window, "resize", a.windowResizeHandler);
						baidu.dom.remove(a.getMain());
						baidu.lang.Class.prototype.dispose.call(a)
					}
				});
baidu.ui.Base.setParent = function(b) {
	var c = this, a = c._parent;
	a && a.dispatchEvent("removechild");
	if (b.dispatchEvent("appendchild", {
		child : c
	})) {
		c._parent = b
	}
};
baidu.ui.Base.getParent = function() {
	return this._parent || null
};
baidu.ui.button = baidu.ui.button || {};
(function() {
	var a = baidu.ui.behavior.statable = function() {
		var b = this;
		b.addEventListeners("ondisable,onenable",
				function(f, c) {
					var d, g;
					c = c || {};
					elementId = (c.element || b.getMain()).id;
					g = c.group;
					if (f.type == "ondisable"
							&& !b.getState(elementId, g)["disabled"]) {
						b.removeState("press", elementId, g);
						b.removeState("hover", elementId, g);
						b.setState("disabled", elementId, g)
					} else {
						if (f.type == "onenable"
								&& b.getState(elementId, g)["disabled"]) {
							b.removeState("disabled", elementId, g)
						}
					}
				})
	};
	a._states = {};
	a._allStates = [ "hover", "press", "disabled" ];
	a._allEventsName = [ "mouseover", "mouseout", "mousedown", "mouseup" ];
	a._eventsHandler = {
		mouseover : function(d, c) {
			var b = this;
			if (!b.getState(d, c)["disabled"]) {
				b.setState("hover", d, c);
				return true
			}
		},
		mouseout : function(d, c) {
			var b = this;
			if (!b.getState(d, c)["disabled"]) {
				b.removeState("hover", d, c);
				b.removeState("press", d, c);
				return true
			}
		},
		mousedown : function(d, c) {
			var b = this;
			if (!b.getState(d, c)["disabled"]) {
				b.setState("press", d, c);
				return true
			}
		},
		mouseup : function(d, c) {
			var b = this;
			if (!b.getState(d, c)["disabled"]) {
				b.removeState("press", d, c);
				return true
			}
		}
	};
	a._getStateHandlerString = function(j, g) {
		var h = this, f = 0, b = h._allEventsName.length, c = [], d;
		if (typeof j == "undefined") {
			j = g = ""
		}
		for (; f < b; f++) {
			d = h._allEventsName[f];
			c[f] = "on" + d + '="' + h.getCallRef() + "._fireEvent('" + d
					+ "', '" + j + "', '" + g + "', event)\""
		}
		return c.join(" ")
	};
	a._fireEvent = function(c, g, b, f) {
		var d = this, h = d.getId(g + b);
		if (d._eventsHandler[c].call(d, h, g)) {
			d.dispatchEvent(c, {
				element : h,
				group : g,
				key : b,
				DOMEvent : f
			})
		}
	};
	a.addState = function(f, b, c) {
		var d = this;
		d._allStates.push(f);
		if (b) {
			d._allEventsName.push(b);
			if (!c) {
				c = function() {
					return true
				}
			}
			d._eventsHandler[b] = c
		}
	};
	a.getState = function(b, f) {
		var d = this, c;
		f = f ? f + "-" : "";
		b = b ? b : d.getId();
		c = d._states[f + b];
		return c ? c : {}
	};
	a.setState = function(f, b, g) {
		var d = this, h, c;
		g = g ? g + "-" : "";
		b = b ? b : d.getId();
		h = g + b;
		d._states[h] = d._states[h] || {};
		c = d._states[h][f];
		if (!c) {
			d._states[h][f] = 1;
			baidu.addClass(b, d.getClass(g + f))
		}
	};
	a.removeState = function(d, b, f) {
		var c = this, g;
		f = f ? f + "-" : "";
		b = b ? b : c.getId();
		g = f + b;
		if (c._states[g]) {
			c._states[g][d] = 0;
			baidu.removeClass(b, c.getClass(f + d))
		}
	}
})();
baidu.ui.button.Button = baidu.ui.createUI(new Function).extend( {
	uiType : "button",
	tplBody : '<div id="#{id}" #{statable} class="#{class}">#{content}</div>',
	disabled : false,
	statable : true,
	_getString : function() {
		var a = this;
		return baidu.format(a.tplBody, {
			id : a.getId(),
			statable : a._getStateHandlerString(),
			"class" : a.getClass(),
			content : a.content
		})
	},
	render : function(c) {
		var b = this, a;
		b.addState("click", "click");
		baidu.dom.insertHTML(b.renderMain(c), "beforeEnd", b._getString());
		a = baidu.g(c).lastChild;
		if (b.title) {
			a.title = b.title
		}
		b.disabled && b.setState("disabled");
		b.dispatchEvent("onload")
	},
	isDisabled : function() {
		var a = this, b = a.getId();
		return a.getState()["disabled"]
	},
	dispose : function() {
		var b = this, a = b.getBody();
		baidu.each(b._allEventsName, function(d, c) {
			a["on" + d] = null
		});
		baidu.dom.remove(a);
		b.dispatchEvent("ondispose");
		baidu.lang.Class.prototype.dispose.call(b)
	},
	disable : function() {
		var b = this, a = b.getBody();
		b.dispatchEvent("ondisable", {
			element : a
		})
	},
	enable : function() {
		var a = this;
		body = a.getBody();
		a.dispatchEvent("onenable", {
			element : body
		})
	},
	fire : function(a, c) {
		var b = this, a = a.toLowerCase();
		if (b.getState()["disabled"]) {
			return
		}
		b._fireEvent(a, null, null, c)
	},
	update : function(a) {
		var b = this;
		baidu.extend(b, a);
		a.content && (b.getBody().innerHTML = a.content);
		b.dispatchEvent("onupdate")
	}
});
baidu.extend(baidu.ui.dialog.Dialog.prototype, {
	createButton : function(c, a) {
		var d = this;
		baidu.extend(c, {
			classPrefix : d.classPrefix + "-" + a,
			skin : d.skin ? d.skin + "-" + a : "",
			element : d.getFooter(),
			autoRender : true,
			parent : d
		});
		var b = baidu.ui.create(baidu.ui.button.Button, c);
		d.buttonInstances[a] = b
	},
	removeButton : function(a) {
		var c = this, b = c.buttonInstances[a];
		if (b) {
			b.dispose();
			delete (c.buttonInstances[a]);
			delete (c.buttons[a])
		}
	}
});
baidu.ui.dialog.Dialog.register(function(a) {
	a.buttonInstances = {};
	a.addEventListener("onload", function() {
		baidu.object.each(a.buttons, function(c, b) {
			a.createButton(c, b)
		})
	});
	a.addEventListener("ondispose", function() {
		baidu.object.each(a.buttons, function(c, b) {
			a.removeButton(b)
		})
	});
	a.addEventListener("onupdate", function() {
		baidu.object.each(a.buttons, function(c, b) {
			a.buttonInstances[b] ? a.buttonInstances[b].update(c) : a
					.createButton(c, b)
		})
	})
});
baidu.extend(baidu.ui.dialog.Dialog.prototype, {
	closeText : "",
	closeButton : true
});
baidu.ui.dialog.Dialog.register(function(a) {
	a.closeButton && a.addEventListener("onload", function() {
		var b = baidu.ui.button.create( {
			parent : a,
			classPrefix : a.classPrefix + "-close",
			skin : a.skin ? a.skin + "-close" : "",
			onclick : function() {
				a.close()
			},
			onmousedown : function(c) {
				baidu.event.stopPropagation(c.DOMEvent)
			},
			element : a.getTitle(),
			autoRender : true
		});
		a.closeButtonInstance = b;
		a.addEventListener("ondispose", function() {
			b.dispose()
		})
	})
});
(function() {
	var a = baidu.ui.behavior.draggable = function() {
		this.addEventListener("onload", function() {
			var b = this;
			b.dragUpdate()
		});
		this.addEventListener("ondispose", function() {
			var b = this;
			baidu.un(b.dragHandler, "mousedown", b._dragFn);
			b.dragHandler = b._lastDragHandler = null
		})
	};
	a.dragUpdate = function(b) {
		var c = this;
		b = b || {};
		if (!c.draggable) {
			return
		}
		if (c._lastDragHandler && c._dragFn) {
			baidu.event.un(c._lastDragHandler, "onmousedown", c._dragFn)
		}
		baidu.object.extend(c, b);
		c._dragOption = {
			ondragstart : function() {
				c.dispatchEvent("ondragstart")
			},
			ondrag : function() {
				c.dispatchEvent("ondrag")
			},
			ondragend : function() {
				c.dispatchEvent("ondragend")
			},
			autoStop : true
		};
		c._dragOption.range = c.dragRange || [];
		c._dragOption.handler = c._lastDragHandler = c.dragHandler
				|| c.getMain();
		if (c.dragHandler) {
			baidu.event.on(c.dragHandler, "onmousedown",
					c._dragFn = function(d) {
						baidu.dom.drag(c.dragTarget || c.getMain(),
								c._dragOption);
						baidu.event.preventDefault(window.event || d)
					})
		}
	}
})();
baidu.ui.dialog.Dialog.prototype.draggable = true;
baidu.ui.dialog.Dialog
		.register(function(b) {
			if (b.draggable) {
				function a() {
					b.dragRange = [ 0, baidu.page.getWidth(),
							baidu.page.getHeight(), 0 ];
					b.dragUpdate()
				}
				b.addEventListener("onload", function() {
					b.dragHandler = b.dragHandler || b.getTitle();
					if (!b.dragRange) {
						a();
						baidu.on(window, "resize", a)
					} else {
						b.dragUpdate()
					}
				});
				b.addEventListener("ondragend", function() {
					b.left = baidu.dom.getStyle(b.getMain(), "left");
					b.top = baidu.dom.getStyle(b.getMain(), "top")
				});
				b.addEventListener("ondispose", function() {
					baidu.un(window, "resize", a)
				})
			}
		});
baidu.extend(baidu.ui.dialog.Dialog.prototype, {
	enableKeyboard : true,
	closeOnEscape : true
});
baidu.ui.dialog.Dialog.register(function(a) {
	baidu.ui.dialog.keyboardHandler = baidu.ui.dialog.keyboardHandler
			|| function(d) {
				d = window.event || d;
				var c = d.keyCode || d.which, f, b;
				baidu.object.each(baidu.ui.dialog.instances, function(h, g) {
					if (h == "show") {
						b = baidu.lang.instance(g);
						if (!f || b.zIndex > f.zIndex) {
							f = b
						}
					}
				});
				if (f) {
					switch (c) {
					case 27:
						f.closeOnEscape && f.close();
						break;
					case 13:
						f.dispatchEvent("onenter");
						break;
					default:
					}
				}
			};
	if (a.enableKeyboard && !baidu.ui.dialog.keyboardEventReady) {
		baidu.on(document, "keyup", baidu.ui.dialog.keyboardHandler);
		baidu.ui.dialog.keyboardEventReady = true
	}
	a.addEventListener("ondispose", function() {
		var b = true;
		baidu.object.each(baidu.ui.dialog.instances, function(d, c) {
			b = false;
			return false
		});
		if (b) {
			baidu.event.un(document, "keyup", baidu.ui.dialog.keyboardHandler);
			baidu.ui.dialog.keyboardEventReady = false
		}
	})
});
baidu.ui.modal = baidu.ui.modal || {
	mainId : null,
	showing : [],
	instances : {}
};
baidu.ui.modal.Modal = baidu.ui
		.createUI(function(b) {
			var c = this, a = (b && b.container) ? baidu.g(b.container) : null;
			!a && (a = document.body);
			if (!a.id) {
				a.id = c.getId("container")
			}
			c.containerId = a.id;
			c.styles = {
				color : "#000000",
				opacity : 0.6,
				zIndex : 1000
			}
		})
		.extend(
				{
					uiType : "modal",
					_showing : false,
					getContainer : function() {
						var a = this;
						return baidu.g(a.containerId)
					},
					render : function() {
						var f = this, b, d, a, g = f.containerId, c = baidu
								.g(f.containerId);
						if (b = baidu.ui.modal.collection[g]) {
							f.mainId = b.mainId;
							a = f.getMain()
						} else {
							a = f.renderMain();
							if (c !== document.body) {
								c.appendChild(a)
							}
							baidu.ui.modal.collection[g] = {
								mainId : f.mainId,
								instance : [],
								flash : {}
							}
						}
						f.dispatchEvent("onload")
					},
					show : function(d) {
						var h = this, c = h.getContainer(), a = h.getMain(), b = h.containerId, j = baidu.ui.modal.collection[b], g = j.instance.length, f;
						if (h._showing) {
							return
						}
						if (g > 0) {
							f = baidu.lang.instance(j.instance[g - 1]);
							f && f._removeHandler()
						}
						d = d || {};
						h._show(d.styles || {});
						a.style.display = "block";
						j.flash[h.guid] = h._hideFlash();
						j.instance.push(h.guid);
						h._showing = true;
						h.dispatchEvent("onshow")
					},
					_show : function(b) {
						var a = this;
						a._getModalStyles(b || {});
						a._update();
						a.windowHandler = a.getWindowHandle();
						baidu.on(window, "resize", a.windowHandler);
						baidu.on(window, "scroll", a.windowHandler)
					},
					hide : function() {
						var a = this;
						a._hide();
						a.dispatchEvent("onhide")
					},
					_hide : function() {
						var h = this, b = h.containerId, j = baidu.ui.modal.collection[b], c = j.flash[h.guid], a = h
								.getMain(), g = j.instance.length, f;
						if (!h._showing) {
							return
						}
						for ( var d = 0; d < g; d++) {
							if (j.instance[d] == h.guid) {
								j.instance.splice(d, 1);
								break
							}
						}
						g = j.instance.length;
						if (d == g) {
							h._removeHandler();
							if (g > 0) {
								f = baidu.lang.instance(j.instance[g - 1]);
								f && f._show()
							} else {
								a.style.display = "none"
							}
							h._restoreFlash(c)
						} else {
							f = baidu.lang.instance(j.instance[g - 1]);
							j.flash[f.guid] = j.flash[f.guid].concat(c)
						}
						j.flash[h.guid] = [];
						h._showing = false
					},
					_removeHandler : function() {
						var a = this;
						baidu.un(window, "resize", a.windowHandler);
						baidu.un(window, "scroll", a.windowHandler)
					},
					getWindowHandle : function() {
						var a = this;
						return function() {
							a._getModalStyles( {});
							a._update();
							window.top !== window.self
									&& setTimeout(function() {
										a._getModalStyles( {});
										a._update()
									}, 16)
						}
					},
					update : function(b) {
						b = b || {};
						var c = this, a = c.getMain(), d = baidu.ui.modal.collection[c.containerId];
						b = b || {};
						baidu.extend(c, b);
						c._getModalStyles(b.styles || {});
						c._update();
						delete (b.styles);
						baidu.extend(c, b);
						c.dispatchEvent("onupdate")
					},
					_update : function() {
						var b = this, a = b.getMain();
						baidu.dom.setStyles(a, b.styles)
					},
					_getModalStyles : function(g) {
						var f = this, a = f.getMain(), b = f.getContainer(), c, j, d;
						function h(m, l) {
							var k = parseInt(baidu.getStyle(m, l));
							k = isNaN(k) ? 0 : k;
							k = baidu.lang.isNumber(k) ? k : 0;
							return k
						}
						if (b !== document.body) {
							g.width = b.offsetWidth;
							g.height = b.offsetHeight;
							if (baidu.getStyle(b, "position") == "static") {
								d = a.offsetParent || document.body;
								c = baidu.dom.getPosition(d);
								j = baidu.dom.getPosition(b);
								g.top = j.top - c.top + h(d, "marginTop");
								g.left = j.left - c.left + h(d, "marginLeft")
							}
						} else {
							if ((baidu.browser.ie >= 7 || !baidu.browser.ie)
									&& document.compatMode != "BackCompat") {
								g.position = "fixed";
								g.top = 0;
								g.left = 0;
								g.width = "100%";
								g.height = "100%"
							} else {
								g.top = baidu.page.getScrollTop();
								g.left = baidu.page.getScrollLeft();
								g.width = baidu.page.getViewWidth();
								g.height = baidu.page.getViewHeight()
							}
						}
						baidu.extend(f.styles, g);
						f.styles.backgroundColor = f.styles.color
								|| f.styles.backgroundColor;
						delete (f.styles.color)
					},
					_hideFlash : function() {
						var c = this, b = c.getContainer(), d = b
								.getElementsByTagName("object"), a = [];
						baidu
								.each(
										d,
										function(g) {
											var f = true;
											if (baidu.dom
													.getAncestorBy(
															g,
															function(h) {
																if (baidu
																		.getStyle(
																				h,
																				"zIndex") > c.styles.zIndex) {
																	return true
																}
																return false
															})) {
												return
											}
											baidu
													.each(
															baidu.dom
																	.children(g),
															function(h) {
																if (baidu
																		.getAttr(
																				h,
																				"name") == "wmode"
																		&& baidu
																				.getAttr(
																						h,
																						"value") != "window") {
																	f = false
																}
															});
											if (f) {
												a
														.push( [
																g,
																baidu
																		.getStyle(
																				g,
																				"visibility") ]);
												g.style.visibility = "hidden"
											}
										});
						return a
					},
					_restoreFlash : function(a) {
						baidu.each(a, function(b) {
							if (b[0] != null) {
								b[0].style.visibility = b[1]
							}
						})
					},
					dispose : function() {
						var a = this;
						a._hide();
						a.dispatchEvent("ondispose");
						baidu.lang.Class.prototype.dispose.call(a)
					}
				});
baidu.ui.modal.collection = {};
baidu.ui.modal.create = function(a) {
	a = a || {};
	var b = new baidu.ui.modal.Modal(a);
	b.render();
	return b
};
baidu.extend(baidu.ui.dialog.Dialog.prototype, {
	modal : true,
	modalColor : "#000000",
	modalOpacity : 0.4,
	hideModal : function() {
		var a = this;
		(a.modal && a.modalInstance) && a.modalInstance.hide()
	}
});
baidu.ui.dialog.Dialog.register(function(a) {
	if (a.modal) {
		a.addEventListener("onopen", function() {
			if (!a.modalInstance) {
				a.modalInstance = baidu.ui.modal.create()
			}
			a.modalInstance.show( {
				targetUI : a,
				styles : {
					color : a.modalColor,
					opacity : a.modalOpacity,
					zIndex : a.modalZIndex ? a.modalZIndex : a.zIndex - 1
				}
			})
		});
		a.addEventListener("onclose", a.hideModal);
		a.addEventListener("ondispose", a.hideModal)
	}
});
(function() {
	var a = baidu.ui.behavior.resizable = function() {
	};
	a.resizeableHandle = null;
	a.resizeCreate = function(b) {
		var c = this, d;
		b = b || {};
		if (!c.resizable) {
			return
		}
		baidu.object.extend(c, b);
		c._resizeOption = {
			onresizestart : function() {
				c.dispatchEvent("onresizestart")
			},
			onresize : function(f) {
				c.dispatchEvent("onresize", f)
			},
			onresizeend : function() {
				c.dispatchEvent("onresizeend")
			}
		};
		baidu.each( [ "minWidth", "minHeight", "maxWidth", "maxHeight" ],
				function(g, f) {
					c[g] && (c._resizeOption[g] = c[g])
				});
		c._resizeOption.classPrefix = b.classPrefix || c.classPrefix;
		d = b.target || c.getBody();
		c.direction && (c._resizeOption.direction = c.direction);
		c.resizeableHandle = baidu.dom.resizable(d, c._resizeOption)
	};
	a.resizeUpdate = function(b) {
		this.resizeableHandle.update(b)
	};
	a.resizeCancel = function() {
		this.resizeableHandle.cancel()
	};
	a.resizeEnable = function() {
		this.resizeableHandle.enable()
	}
})();
baidu.extend(baidu.ui.dialog.Dialog.prototype, {
	resizable : true,
	minWidth : 100,
	minHeight : 100,
	direction : [ "s", "e", "se" ]
});
baidu.ui.dialog.Dialog.register(function(g) {
	if (g.resizable) {
		var d, f, b, a, j, h, k;
		function c() {
			h = d.offsetWidth;
			k = d.offsetHeight;
			a = f.offsetWidth;
			j = f.offsetHeight
		}
		g.addEventListener("onload", function() {
			d = g.getBody();
			b = g.getMain();
			f = g.getContent();
			c();
			g.resizeCreate( {
				target : b,
				classPrefix : g.classPrefix
			})
		});
		g.addEventListener("onresize", function(l) {
			baidu.dom.setOuterWidth(f, a + l.current.width - l.original.width);
			baidu.dom.setOuterHeight(f, j + l.current.height
					- l.original.height);
			baidu.dom.setOuterWidth(d, h + l.current.width - l.original.width);
			baidu.dom.setOuterHeight(d, k + l.current.height
					- l.original.height);
			g.coverable && g.Coverable_update()
		});
		g.addEventListener("onresizeend", function() {
			c();
			g.width = a;
			g.height = j;
			baidu.setStyles(b, {
				height : "",
				width : ""
			})
		});
		g.addEventListener("onupdate", function() {
			c();
			g.resizeUpdate()
		});
		g.addEventListener("onopen", function() {
			c();
			g.resizeUpdate()
		})
	}
});
var isNul = function(a) {
	return a == undefined ? true : !isFinite(a) ? true : false
};
var M3 = {
	isIe : /msie/i.test(navigator.userAgent),
	isIe6 : /msie 6/i.test(navigator.userAgent),
	isFirefox : /firefox/i.test(navigator.userAgent),
	isSafari : /safari/i.test(navigator.userAgent),
	isOpera : /opera/i.test(navigator.userAgent),
	isChrome : /chrome/i.test(navigator.userAgent),
	isMaxthon : function() {
		var a = false;
		try {
			a = external.max_version
		} catch (b) {
		}
		return a
	}(),
	id : function() {
		var a = arguments.callee;
		a.number = ++a.number || 0;
		return "_" + a.number
	},
	nul : function() {
		return false
	},
	apply : function(b, d, a) {
		var c = {};
		if (!d) {
			d = {}
		}
		if (!a) {
			a = {}
		}
		M3.each(b, function(g, f) {
			if (f in a) {
				return
			}
			d[f] = g
		});
		return d
	},
	dispatch : function(b, a) {
		var c, f, d;
		if (typeof (a) == "undefined") {
			a = []
		}
		c = arguments.callee;
		if (!c.map) {
			c.map = {}
		}
		f = function(m, j, k) {
			var l, h, g;
			l = c.map;
			if (h = l[m]) {
				M3.each(h, function(o) {
					var n = o.apply(k, j);
					if (n !== undefined) {
						g = n
					}
				});
				return g
			}
		};
		d = function(j, g) {
			var h;
			h = c.map;
			if (!h[j]) {
				h[j] = []
			}
			h[j].push(g)
		};
		if (typeof (a) == "function") {
			d.apply(this, arguments)
		} else {
			if (a instanceof Array) {
				return f.apply(this, arguments)
			}
		}
	},
	registerClassEvent : function() {
		this.on = function(b, c, a) {
			var f = a ? "before" : "";
			var d = this.instanceId;
			M3.dispatch(d + f + b, c)
		};
		this.un = function() {
		};
		this.fireEvent = function(c, b, a) {
			var f = this.instanceId;
			if (!a) {
				var d = M3.dispatch(f + "before" + c, b);
				if (d !== undefined) {
					return d
				}
			}
			return M3.dispatch(f + c, b)
		}
	},
	Class : function(a, b, g, f) {
		var d, c, h;
		a = a || function() {
		};
		b = b || {};
		h = {};
		d = function() {
			this.instanceId = M3.id();
			a.apply(this, arguments)
		};
		c = d.prototype;
		M3.registerClassEvent.call(c);
		M3.each(b, function(k, j) {
			c[j] = function(m, l) {
				if (typeof (m) == "function") {
					return function() {
						var n, q;
						n = Array.prototype.slice.call(arguments, 0);
						if (g) {
							var p = g.apply(this, [ l ].concat(n));
							if (p !== undefined) {
								return p
							}
						}
						var o = this.fireEvent("before" + l, n);
						if (o !== undefined) {
							return o
						}
						q = m.apply(this, n);
						f && f.apply(this, [ l ].concat(n));
						this.fireEvent(l, n, true);
						return q
					}
				} else {
					return m
				}
			}(k, j)
		});
		return d
	},
	each : function(d, c) {
		if (d instanceof Array) {
			for ( var b = 0, a = d.length; b < a; b++) {
				c(d[b], b)
			}
		} else {
			if (typeof (d) == "object") {
				for ( var b in d) {
					if (d.hasOwnProperty(b)) {
						c(d[b], b)
					}
				}
			}
		}
	},
	handle : function(d) {
		var b, a, c;
		b = arguments.callee;
		if (!b.cache) {
			b.cache = {}
		}
		if (typeof (b.number) == "undefined") {
			b.number = 0
		}
		a = typeof (d);
		if (a == "number") {
			return b.cache[d.toString()]
		} else {
			if (a == "object" || a == "function") {
				c = b.number++;
				b.cache[c.toString()] = d;
				return c
			}
		}
	},
	createFuze : function() {
		var a, c, b;
		a = [];
		c = function(d) {
			if (b) {
				d()
			} else {
				a.push(d)
			}
		};
		c.fire = function() {
			while (a.length) {
				a.shift()()
			}
			b = true
		};
		c.extinguish = function() {
			b = false
		};
		c.wettish = function() {
			this.fire();
			this.extinguish()
		};
		return c
	},
	error : function(a) {
		throw new Error(a)
	},
	queryString : function(b) {
		var d, c, a;
		d = location.href;
		c = new RegExp("(\\?|&)" + b + "=([^&#]*)(#|&|$)", "i");
		a = d.match(c);
		return a ? a[2] : ""
	},
	addEvent : function(a, c, b) {
		if (a.addEventListener) {
			a.addEventListener(c, b, false)
		} else {
			if (a.attachEvent) {
				a.attachEvent("on" + c, b)
			}
		}
	},
	stopDefault : function(a) {
		var a = window.event || a;
		if (a && a.preventDefault) {
			a.preventDefault()
		} else {
			window.event.returnValue = false
		}
		return false
	},
	getBytesLength : function(b) {
		var a = 0;
		for (i = 0; i < b.length; i++) {
			iCode = b.charCodeAt(i);
			if ((iCode >= 0 && iCode <= 255)
					|| (iCode >= 65377 && iCode <= 65439)) {
				a += 1
			} else {
				a += 2
			}
		}
		return a
	},
	overCut : function(b, a) {
		var c = this.getBytesLength(b);
		if (b && c > a) {
			return b.substring(0, a - 3) + "..."
		} else {
			return b
		}
	},
	setScrollwidth : (function() {
		var b = 50;
		var a = function(c, f, d) {
			this.init(c, f, d)
		};
		a.prototype = {
			init : function(c, f, d) {
				var h = this;
				this.isplaying = true;
				this.outwarper = c;
				this.content = f;
				this.maxWidth = d;
				var g = f.parentNode;
				this.offsetWidth = f.offsetWidth;
				this.reset();
				if (!this.timer) {
					this.timer = new M3.Timer(b, 0);
					this.timer.addEventListener("timer", function(j, k) {
						h.offsetWidth = f.offsetWidth;
						if (h.outwarper.scrollLeft >= h.offsetWidth) {
							h.outwarper.scrollLeft -= h.offsetWidth
						}
						if (h.isplaying) {
							h.outwarper.scrollLeft += 1
						}
					})
				}
				if (this.content.offsetWidth > this.maxWidth) {
					this.outwarper.style.width = this.maxWidth + "px";
					T.dom.addClass(this.content, "titcon");
					content_bak = this.content.cloneNode(1);
					g.appendChild(content_bak);
					g = null;
					this.start();
					this.outwarper.onmouseover = function() {
						h.stop()
					};
					this.outwarper.onmouseout = function() {
						h.start()
					}
				} else {
					this.outwarper.style.width = this.content.offsetWidth
							+ "px";
					this.stop()
				}
			},
			reset : function() {
				this.outwarper.style.width = this.content.offsetWidth + "px";
				var d = this.content.parentNode;
				var c = document.createDocumentFragment();
				this.reset_positon();
				T.dom.removeClass(this.content, "titcon");
				c.appendChild(this.content);
				d.innerHTML = "";
				d.appendChild(c);
				d = null
			},
			reset_positon : function() {
				this.outwarper.scrollLeft = 0
			},
			stop : function() {
				this.timer.stop()
			},
			start : function() {
				if (this.content.offsetWidth > this.maxWidth) {
					this.timer.start()
				}
			},
			setDirection : function(c) {
			},
			setSpeed : function(c) {
				var d = this;
				if (this.timer) {
					this.timer.stop()
				}
				this.timer = new M3.Timer(c, 0);
				this.timer.addEventListener("timer", function(f, g) {
					d.offsetWidth = content.offsetWidth;
					if (d.outwarper.scrollLeft >= d.offsetWidth) {
						d.outwarper.scrollLeft -= d.offsetWidth
					}
					d.outwarper.scrollLeft += 1
				});
				this.timer.start()
			}
		};
		return a
	})()
};
M3.convertTime = function(b) {
	var c, a;
	b = Math.round(b / 1000);
	c = Math.floor(b / 60);
	a = b % 60;
	return baidu.number.pad(c, 2) + ":" + baidu.number.pad(a, 2)
};
M3.txtonfocus = function(a, c, b) {
	if (b == "focus" && c.value == a) {
		c.value = ""
	}
	if (b == "blur" && c.value == "") {
		c.value = a
	}
};
M3.txtLimit = function(a, b, c) {
	return c(a < b + 1)
};
M3.dufFor = function(c, f) {
	var a = c.length, d = a % 8, b = 0;
	while (d) {
		f(c[b], b++)
	}
	d = Math.floor(a / 8);
	while (d) {
		f(c[b], b++);
		f(c[b], b++);
		f(c[b], b++);
		f(c[b], b++);
		f(c[b], b++);
		f(c[b], b++);
		f(c[b], b++);
		f(c[b], b++)
	}
};
M3.sort = function(a, c) {
	var b = a.slice(0);
	c = typeof c === "undefined" ? true : c;
	b = b.sort(function(f, d) {
		return c ? f - d : d - f
	});
	return b
};
M3.removeNode = function(a) {
	if (a && a.parentNode) {
		a.parentNode.removeChild(a)
	}
};
M3.Timer = M3.Class(function(b, a) {
	this._win = window;
	this._timer = function() {
	};
	this._listener = function() {
	};
	this._timerComplete = function() {
	};
	this._timerID = null;
	this._delay = this._remain = b;
	this._repeatCount = a || 0;
	this._currentCount = 0;
	this._isRunning = false;
	this._startTime = this._endTime = 0
},
		{
			_createTimer : function(b, a) {
				var c = this;
				if (a == 1) {
					return function() {
						return c._win.setTimeout(function() {
							c.reset();
							c._listener(c._delay, a);
							c._timerComplete()
						}, b)
					}
				} else {
					return function() {
						return c._win.setInterval(function() {
							if (a != 0 && c._currentCount >= a) {
								c.reset();
								c._timerComplete()
							} else {
								c._currentCount++;
								c._listener(b, c._currentCount)
							}
						}, b)
					}
				}
			},
			addEventListener : function(a, b) {
				if (a == "timer") {
					this._listener = b;
					this._timer = this._createTimer(this._delay,
							this._repeatCount)
				} else {
					if (a == "timerComplete") {
						this._timerComplete = b
					}
				}
			},
			reset : function() {
				this.stop();
				if (this._repeatCount == 1) {
					this._timer = this._createTimer(this._delay,
							this._repeatCount)
				}
				this._currentCount = 0;
				this._remain = this._delay;
				this._startTime = this._endTime = 0
			},
			start : function() {
				if (!this._timerID) {
					this._timerID = this._timer();
					if (this._repeatCount == 1) {
						this._startTime = new Date().getTime()
					}
					this._isRunning = true
				}
			},
			stop : function() {
				if (this._timerID) {
					if (this._repeatCount == 1) {
						this._win.clearTimeout(this._timerID)
					} else {
						this._win.clearInterval(this._timerID)
					}
					this._timerID = null;
					this._isRunning = false
				}
			},
			pause : function() {
				if (this._repeatCount == 1) {
					if (this._timerID) {
						this.stop();
						this._endTime = new Date().getTime();
						this._remain = this._remain
								- (this._endTime - this._startTime);
						if (this._remain > 0) {
							this._timer = this._createTimer(this._remain, 1)
						} else {
							this.reset()
						}
					}
				} else {
					this.stop()
				}
			},
			getCurrentCount : function() {
				return this._currentCount
			},
			isRunning : function() {
				return this._isRunning
			}
		});
M3.StopWatch = (function() {
	var b = 0;
	var a = function() {
		this.startTime = 0;
		this.isRunning = false;
		this.isReset = true;
		this.passedTime = 0;
		b++
	};
	a.prototype = {
		reset : function() {
			this.startTime = 0;
			this.pauseTime = 0;
			this.passedTime = 0;
			this.isRunning = false;
			this.isReset = true
		},
		start : function() {
			if (this.isReset) {
				this.reset();
				this.startTime = new Date().getTime()
			} else {
				if (!this.isRunning) {
					this.startTime = new Date().getTime()
				}
			}
			this.isRunning = true;
			this.isReset = false
		},
		pause : function() {
			if (!this.isReset && this.isRunning) {
				this.pauseTime = new Date().getTime();
				this.passedTime += this.pauseTime - this.startTime;
				this.isRunning = false
			}
		},
		isRunning : function() {
			return this.isRunning
		},
		isReset : function() {
			return this.isReset
		},
		getTime : function() {
			if (this.isReset) {
				return 0
			} else {
				if (this.isRunning) {
					return new Date().getTime() - this.startTime
							+ this.passedTime
				} else {
					return this.passedTime
				}
			}
		},
		getCounts : function() {
			return b
		}
	};
	return a
})();
var mbox = mbox || {};
mbox.comm = mbox.comm || {};
mbox.namespace = function() {
	var b = arguments, h = null, f, c, g;
	for (f = 0, len = b.length; f < len; f++) {
		g = ("" + b[f]).split(".");
		h = mbox;
		for (c = (g[0] == "mbox") ? 1 : 0; c < g.length; c = c + 1) {
			h[g[c]] = h[g[c]] || {};
			h = h[g[c]]
		}
	}
	return h
};
mbox.CODEMAP = {
	UNLOGIN : 22452,
	UNACTIVE : 22453,
	FORBIDDEN : 22231,
	RECOMMLIMIT : 22311,
	FAVORLIMIT : 22331,
	FAVORREPEAT : 22322,
	TOOFAST : 22011,
	IPFORBIDDEN : 22232,
	IPNOTFOUND : 22233,
	IPMISTAKE : 22234,
	NOLINK : 22156,
	LISTLIMIT : 22677,
	LISTDUP : 22678,
	NOTEXIST : 22679,
	SUCCESS : 22000
};
mbox.ACTION = {
	INIT : "playerInit",
	PLAYSTART : "playstart",
	LOADTITLE : "loadtitleinfo",
	LOADLINK : "load",
	PLAYSONG : "playsong",
	PLAYSONG100MS : "playsong100ms",
	PLAY60 : "60play",
	PLAYEND : "playend",
	PLAYCOMPLETE : "playcomplete",
	CLK : "click",
	PLAYSTATECHANGE : "playstatechange",
	PLAYING : "playing",
	PAUSE : "pause",
	STOP : "stop",
	PREBUFFER : "prebuffer",
	BUFFERING : "buffering",
	SHOWLOADING : "showloading",
	TOTALTIME : "totaltime",
	RESET : "resetplayer",
	VOLCHANGE : "volumechange",
	MUTECHANGE : "mutechange",
	PLAYMODECHANGE : "playmodechange",
	FAVOR : "favor",
	COMMENT : "comment",
	TITLE : "updatetitle",
	UPDATECURRTIME : "updateCurrentTime",
	UPDATETOTALTIME : "updateTotalTime",
	UPDATELOADED : "updateLoadedPrecent",
	UPDATEPLAYED : "updatePlayedPrecent",
	NEXTSONG : "nextSong",
	PREVSONG : "prevSong",
	PLAYINDEX : "playIndex",
	HIGHLIGHTINDEX : "highlight",
	REMOVESONG : "removeSong",
	ADDSONG : "add_song",
	ADDALBUM : "add_album",
	ADDTOPLAYLIST : "addPlayList",
	UPDATELIST : "updatePlatList",
	REMOVELIST : "removePlatList",
	SCROLLTO : "scrollToPlayList",
	SETCURRPLAY : "setCurrPlayList",
	SHOWLRC : "showLyric",
	NOLRC : "noLyric",
	LISTENBREAK : "listenBreak",
	ABROAD : "abroaduser",
	CLOSELISTENBREAK : "closeListenBreak",
	CLOSEABROAD : "closeAbroaduser",
	MEDIAERROR : "mediaerror",
	ERR_LINKFAIL : "linkfail",
	ERR_BUFERR : "buferr",
	ERR_PLAYERR : "playerr",
	ERR_LOADERR : "loadfileerr",
	CHECKLOGIN : "checkLogin",
	ADDPLAYEDTIMES : "addPlayedTimes",
	AUTO : "changeAutoStatus",
	SHOWPLAYLIST : "showplaylist",
	FOLDMOD : "foldmod",
	EXPANDMOD : "expandmod",
	UI_PLAY : "ui_play",
	UI_PREV : "ui_prev",
	UI_NEXT : "ui_next",
	UI_MODECHANGE : "ui_modechange",
	UI_PLAYCHANGE : "ui_playchange",
	UI_PLAYTIMER : "ui_playtimer",
	UI_VOLCHANGE : "ui_volchange",
	UI_SETMUTE : "ui_mutechange",
	UI_SETALBUM : "ui_setalbum",
	UI_FAVOR : "ui_favor",
	UI_RECOM : "ui_recommend",
	UI_PLAYINDEX : "ui_playIndex",
	UI_REMOVELIST : "ui_removeplaylist",
	UI_DOWNLOAD : "ui_download",
	COPYLRC : "copylrc"
};
(function() {
	var b = function(g) {
		return "PS" + g.replace(/_/g, "__").replace(/ /g, "_s")
	};
	var a = {
		searchList : [ "userData", "localStorage" ],
		methods : [ "init", "get", "set", "remove" ],
		status : {
			SUCCESS : 0,
			FAILURE : 1,
			OVERFLOW : 2
		},
		option : {}
	};
	var c = {
		localStorage : {
			size : 10 * 1024 * 1024,
			test : function() {
				return window.localStorage ? true : false
			},
			methods : {
				init : function() {
					this.store = window.localStorage
				},
				expand : function(g) {
					return b(this.name) + b(g)
				},
				set : function(j, n, l, k) {
					var g = a.status.SUCCESS;
					j = this.expand(j);
					var m;
					if (k && k.expires) {
						m = k.expires + "|" + n
					} else {
						m = "0|" + n
					}
					try {
						this.store.setItem(j, m)
					} catch (h) {
						g = a.status.OVERFLOW
					}
					if (l) {
						l.call(this, g, n)
					}
					return g
				},
				get : function(k, l) {
					var g = a.status.SUCCESS;
					k = this.expand(k);
					try {
						var m = this.store.getItem(k);
						if (m == null) {
							g = a.status.FAILURE
						}
						var o = m.indexOf("|");
						var n = m.substring(0, o);
						var h = (new Date()).getTime();
						if (n > h || n == "0") {
							m = m.substring(o + 1, m.length)
						} else {
							m = null;
							this.store.removeItem(k);
							g = a.status.FAILURE
						}
					} catch (j) {
						g = a.status.FAILURE
					}
					if (l) {
						l.call(this, g, m)
					}
					if (g == a.status.SUCCESS) {
						return m
					} else {
						return
					}
				},
				remove : function(j, k) {
					var g = a.status.SUCCESS;
					var l = null;
					j = this.expand(j);
					try {
						var m = this.store.getItem(j);
						if (m) {
							var n = m.indexOf("|");
							l = m.substring(n + 1, m.length);
							if (m == null) {
								g = a.status.FAILURE
							} else {
								this.store.removeItem(j)
							}
						} else {
							g = a.status.FAILURE
						}
					} catch (h) {
						g = a.status.FAILURE
					}
					if (k) {
						k.call(this, g, l)
					}
					return g
				}
			}
		},
		userData : {
			size : 64 * 1024,
			test : function() {
				return window.ActiveXObject ? true : false
			},
			methods : {
				init : function() {
					var h = "_storage_data_";
					var j = h + b(this.name);
					this.el = document.createElement("div");
					this.el.id = j;
					this.el.style.display = "none";
					this.el.addBehavior("#default#userData");
					var g = this;
					document.body.insertBefore(this.el,
							document.body.firstChild);
					baidu.on(window, "unload", function() {
						g.el = null
					})
				},
				expand : function(g) {
					return b(this.name) + b(g)
				},
				set : function(j, n, l, k) {
					j = this.expand(j);
					var g = a.status.SUCCESS;
					try {
						var m;
						if (k && k.expires) {
							this.el.expires = (new Date(k.expires + 8 * 60 * 60
									* 1000)).toUTCString();
							m = k.expires + "|" + n
						} else {
							m = "0|" + n
						}
						this.el.setAttribute(j, m);
						this.el.save(j)
					} catch (h) {
						g = a.status.OVERFLOW;
						n = null
					}
					if (l) {
						l.call(this, g, n)
					}
					return g
				},
				get : function(j, k) {
					j = this.expand(j);
					var g = a.status.SUCCESS;
					try {
						this.el.load(j)
					} catch (m) {
					}
					var l = this.el.getAttribute(j);
					if (l) {
						var o = l.indexOf("|");
						var n = l.substring(0, o);
						var h = (new Date()).getTime();
						if (n > h || n == "0") {
							l = l.substring(o + 1, l.length)
						} else {
							l = null;
							g = a.status.FAILURE
						}
					}
					if (l == null) {
						g = a.status.FAILURE;
						this.remove(j)
					}
					if (k) {
						k.call(this, g, l)
					}
					if (g == a.status.SUCCESS) {
						return l
					} else {
						return
					}
				},
				remove : function(j, k) {
					j = this.expand(j);
					var g = a.status.SUCCESS;
					var l = null;
					try {
						this.el.load(j);
						l = this.el.getAttribute(j);
						if (l == null) {
							g = a.status.FAILURE
						} else {
							var m = l.indexOf("|");
							l = l.substring(m + 1, l.length);
							this.el.expires = new Date(315532799000)
									.toUTCString();
							this.el.removeAttribute(j);
							this.el.save(j)
						}
					} catch (h) {
						g = a.status.FAILURE
					}
					if (k) {
						k.call(this, g, l)
					}
					return g
				}
			}
		},
		cookie : {
			size : 4 * 1024,
			test : function() {
				return true
			},
			methods : {
				expand : function(g) {
					return this.name + g
				},
				get : function(h, j) {
					var g = a.status.SUCCESS;
					h = this.expand(h);
					var k = baidu.cookie.get(h);
					if (k == null) {
						g = a.status.FAILURE
					}
					if (j) {
						j.call(this, g, k)
					}
				},
				set : function(h, l, k, j) {
					var g = a.status.SUCCESS;
					h = this.expand(h);
					if (j && j.expires) {
						j.expires = new Date(expires)
					}
					baidu.cookie.set(h, l, j);
					if (k) {
						k.call(this, g, l)
					}
				},
				remove : function(h, j) {
					var g = a.status.SUCCESS;
					h = this.expand(h);
					var k = baidu.cookie.get(h);
					baidu.cookie.remove(h);
					if (k == null) {
						g = a.status.FAILURE
					}
					if (j) {
						j.call(this, g, k)
					}
				}
			}
		}
	};
	var d = function(m) {
		var k = function() {
		};
		m.type = null;
		m.size = -1;
		for ( var j = 0, h = a.methods.length; j < h; j++) {
			m.Store.prototype[a.methods[j]] = k
		}
		if (a.option.backend) {
			var g = a.option.backend;
			if (c[g] && c[g].test()) {
				m.type = g;
				m.size = c[g].size;
				for (key in c[g].methods) {
					m.Store.prototype[key] = c[g].methods[key]
				}
			} else {
				for ( var j = 0, h = a.searchList.length; !m.type && j < h; j++) {
					var g = c[a.searchList[j]];
					if (g.test()) {
						m.type = a.searchList[j];
						m.size = g.size;
						for (key in g.methods) {
							m.Store.prototype[key] = g.methods[key]
						}
					}
				}
			}
		} else {
			for ( var j = 0, h = a.searchList.length; !m.type && j < h; j++) {
				var g = c[a.searchList[j]];
				if (g.test()) {
					m.type = a.searchList[j];
					m.size = g.size;
					for (key in g.methods) {
						m.Store.prototype[key] = g.methods[key]
					}
				}
			}
		}
	};
	var f = {
		version : "1.0",
		type : null,
		size : -1,
		getSupportList : function() {
			var g = [];
			for ( var j = 0, h = a.searchList.length; j < h; j++) {
				if (c[a.searchList[j]].test()) {
					g.push(a.searchList[j])
				}
			}
			return g
		},
		Store : function(g, j) {
			var h = /^[a-z][a-z0-9_ -]+$/i;
			if (!h.exec(g)) {
				throw new Error("Invalid name")
			}
			if (!f.type) {
				throw new Error("No suitable storage found")
			}
			this.name = g;
			a.option = j || {};
			a.option.domain = j.domain || location.hostname
					|| "localhost.localdomain";
			a.option.expires = a.option.expires || 365 * 24 * 60 * 60 * 1000;
			a.option.path = a.option.path || "/";
			this.init()
		},
		set : function(h, l, k, j) {
			var g = new f.Store("bd_storage", {});
			return g.set(h, l, k, j)
		},
		get : function(h, k, j) {
			var g = new f.Store("bd_storage", {});
			return g.get(h, k, j)
		},
		remove : function(h, j) {
			var g = new f.Store("bd_storage", {});
			return g.remove(h, j)
		}
	};
	d(f);
	mbox.storage = f
})();
mbox.url = function() {
	var n = "/", j = "artist/", d = "album/", c = "/diyalbum", o = "people/", k = "/collection", h = "/recommend", l = "account/profile", f = location.host, m = "song/", a = "https://passport.baidu.com/", b = "qukufile.qianqian.com", g = "http://nssug.baidu.com/";
	return {
		getArtist : function(p) {
			return n + j + p
		},
		getSongPage : function(p) {
			return n + m + p
		},
		getAlbum : function(p) {
			return n + d + p
		},
		getDiyAlbum : function(p) {
			return n + c + p
		},
		getDownload : function(p) {
			return "/song/" + p + "/download?from=tingbox"
		},
		getPeople : function(p) {
			return n + o + p
		},
		getRecommend : function(p) {
			return n + o + p + h
		},
		getCollection : function(p) {
			return n + o + p + k
		},
		getDiy : function(p) {
			return n + o + p + c
		},
		getHost : function() {
			return f
		},
		getPassportHost : function() {
			return a
		},
		getQukuHost : function() {
			return b
		},
		getSug : function() {
			return g
		}
	}
}();
mbox.user = (function() {
	var a = T.dom.query, c = T.fn.bind;
	var b = function(d) {
		this.isLogin = false;
		this.userdata = null;
		this.userinfo = a("#userinfo")[0];
		this.userinfo_hd = a("#userinfo_hd")[0];
		this.user_nm = a("#user_nm")[0];
		this.user_menu = a("#user_menu")[0];
		this.activewraper = a("#activewraper")[0];
		this.unloginwraper = a("#unloginwraper")[0];
		this.login_pic = a("#login_pic")[0];
		this.mytinghp = a("#mytinghp")[0];
		this.mytingfavor = a("#mytingfavor")[0];
		this.mydiy = a("#mydiy")[0];
		this.activebtn = a("#login-hook")[0];
		this.activeuname = a("#login-uname")[0];
		this.loginbtn = a("#login")[0];
		this.logoutbtn = a("#logout")[0];
		if (typeof ting == "undefined") {
			ting = {}
		}
		ting.userInfo = {};
		baidu.event.on(this.loginbtn, "click", c(function() {
			this.login()
		}, this));
		baidu.event.on(this.activebtn, "click", c(function() {
			this.active()
		}, this));
		baidu.event.on(this.logoutbtn, "click", c(function() {
			this.logout()
		}, this))
	};
	b.prototype = {
		init : function() {
		},
		setLoginOut : function() {
			this.userdata = null;
			this.isLogin = false;
			this.user_menu.style.display = "none";
			this.userinfo_hd.className = "hd clearfix unlogin";
			baidu.event.un(this.userinfo_hd, "mouseenter");
			baidu.event.un(this.userinfo_hd, "mouseleave")
		},
		setNotActived : function(f) {
			this.userinfo_hd.className = "hd clearfix notactive";
			var d = f.data.userName;
			if (d.length >= 20) {
				this.activeuname.innerHTML = baidu.string.encodeHTML(d)
						.substring(0, 15)
						+ "..."
			} else {
				this.activeuname.innerHTML = baidu.string.encodeHTML(d)
			}
		},
		setLogined : function(f, j) {
			this.isLogin = true;
			this.userdata = f;
			var h = f.data ? f.data.avatarMini : f.avatarMini;
			var d = f.data ? f.data.nickName : f.nickName;
			var g = f.data ? f.data.userId : f.userId;
			this.userinfo_hd.className = "hd clearfix logined";
			this.login_pic.src = baidu.string.decodeHTML(h)
					|| "/images/avatar_default_mini.png";
			if (d.length >= 20) {
				this.user_nm.innerHTML = baidu.string.encodeHTML(d).substring(
						0, 15)
						+ "..."
			} else {
				this.user_nm.innerHTML = baidu.string.encodeHTML(d)
			}
			this.mytinghp.href = mbox.url.getPeople(g);
			this.mytingfavor.href = mbox.url.getCollection(g);
			this.mydiy.href = mbox.url.getDiy(g);
			this.activewraper.style.display = "none";
			baidu.event.on(this.userinfo_hd, "mouseenter", c(function(k) {
				this.user_menu.style.display = "block";
				baidu.dom.addClass(this.userinfo, "bg")
			}, this));
			baidu.event.on(this.userinfo_hd, "mouseleave", c(function(k) {
				this.user_menu.style.display = "none";
				baidu.dom.removeClass(this.userinfo, "bg")
			}, this));
			mbox.data.getFavorSongIds( {
				onsuccess : j
			})
		},
		login : function() {
			this.checklogin(true)
		},
		logout : function() {
			this.markLogin(0);
			var d = location.href;
			setTimeout(function() {
				window.location.href = mbox.url.getPassportHost()
						+ "?logout&u=" + encodeURIComponent(d)
			}, 10)
		},
		active : function(g, f, d) {
			g = g || function() {
			};
			M3.dispatch(mbox.ACTION.EXPANDMOD, [ true ]);
			setTimeout(c(function() {
				ting.passport.popup("activate", {
					onSuccess : c(function(h) {
						this.checkLoginCallback(false, {
							data : h,
							errorCode : mbox.CODEMAP.SUCCESS
						});
						g(data)
					}, this),
					onCancel : c(function() {
						this.checklogin(false)
					}, this)
				}, {
					mbox : true,
					songLimit : f,
					ref : "tingbox",
					operation : d
				})
			}, this), 100)
		},
		checklogin : function(d, j, h, g) {
			var f = {
				mbox : true,
				ref : "tingbox",
				operation : g
			};
			h = h || {};
			for (key in h) {
				f[key] = h[key]
			}
			d = typeof d != "undefiend" ? d : true;
			this.getTingUserInfo( {
				onsuccess : c(function(k) {
					this.checkLoginCallback(d, k, f, j)
				}, this)
			})
		},
		checkLoginCallback : function(d, g, f, h) {
			h = h || function() {
			};
			ting.userInfo = g.data;
			switch (g.errorCode) {
			case mbox.CODEMAP.SUCCESS:
				this.setLogined(g, c(function() {
					this.markLogin(1);
					this.markUserType(g.data.userType);
					this.markTingId(g.data.userId);
					h(g)
				}, this));
				break;
			case mbox.CODEMAP.UNACTIVE:
				this.setNotActived(g);
				this.markLogin(2);
				this.markUserType("");
				this.markTingId("");
				if (d) {
					M3.dispatch(mbox.ACTION.EXPANDMOD, [ true ]);
					setTimeout(c(function() {
						ting.passport.popup("activate", {
							onSuccess : c(function(j) {
								this.checkLoginCallback(false, {
									data : j,
									errorCode : mbox.CODEMAP.SUCCESS
								});
								h()
							}, this),
							onCancel : c(function() {
								this.checklogin(false)
							}, this)
						}, f)
					}, this), 100)
				}
				break;
			case mbox.CODEMAP.UNLOGIN:
				this.markUserType("");
				this.markTingId("");
				this.markLogin(0);
				if (d) {
					M3.dispatch(mbox.ACTION.EXPANDMOD, [ true ]);
					setTimeout(c(function() {
						ting.passport.popup("login", {
							onSuccess : c(function(j) {
								this.checkLoginCallback(false, {
									data : j,
									errorCode : mbox.CODEMAP.SUCCESS
								});
								h()
							}, this),
							onCancel : c(function() {
								this.checklogin(false)
							}, this)
						}, f)
					}, this), 100)
				} else {
					this.setLoginOut()
				}
				break
			}
		},
		getTingUserInfo : function(f) {
			var d = "/data/user/info";
			baidu.ajax.request(d, {
				onsuccess : function(h, g) {
					f.onsuccess(T.json.parse(g))
				},
				noCache : true
			})
		},
		markLogin : function(d) {
			d = d.toString();
			var f = {
				path : "/",
				expires : 1000 * 60 * 60 * 24 * 30
			};
			baidu.cookie.set("u_lo", d, f)
		},
		getLoginType : function() {
			return baidu.cookie.get("u_lo") || ""
		},
		markTingId : function(f) {
			var d = {
				path : "/",
				expires : 1000 * 60 * 60 * 24 * 30
			};
			baidu.cookie.set("u_id", f, d)
		},
		getTingId : function() {
			return baidu.cookie.get("u_id") || ""
		},
		markUserType : function(d) {
			var f = {
				path : "/",
				expires : 1000 * 60 * 60 * 24 * 30
			};
			baidu.cookie.set("u_t", d, f)
		},
		getUserType : function() {
			return baidu.cookie.get("u_t") || ""
		}
	};
	return b
})();
mbox.user = new mbox.user();
mbox.comm.table = (function() {
	var a = 300, b = 50, h = 10, g = 0;
	var d = function() {
		return g++
	};
	var f = function(j, k) {
		if (k) {
			return j + '="' + k + '"'
		}
		return ""
	};
	var c = function(j) {
		j = j || {};
		this.container = j.container || "";
		this.tpl = j.tpl || "";
		this.delayLoad = typeof j.delay == "undefined" ? true : j.delay;
		this.mouseover = j.mouseover || null;
		this.mouseout = j.mouseout || null;
		this.click = j.click || null;
		this.dblclick = j.dblclick || null;
		this.mousedown = j.mousedown || null;
		this.beforeCreate = j.beforeDelay || function() {
		};
		this.onComplete = j.afterDelay || function() {
		};
		this.completed = false;
		this.delayLoadQueue = [];
		if (typeof this.container == "string") {
			this.container = baidu.g(this.container)
		}
		this.containerId = this.container.id;
		var k = d();
		this.tableId = "";
		this.tableClassName = "";
		this.tableDiv = document.createElement("div");
		this.tableDiv.className = "tablewraper";
		this.tableContainerId = this.tableDiv.id = "tableContainer_" + k;
		this.container.appendChild(this.tableDiv);
		this.definedEvents()
	};
	c.prototype = {
		create : function(l) {
			if (this.tpl && l) {
				var j = {}, k = false;
				if (this.delayLoad && l.trHtml && l.trHtml.length > a) {
					j = {
						id : l.id || this.tableId,
						className : l.className || this.tableClassName,
						trHtml : l.trHtml.slice(0, a)
					};
					k = true
				} else {
					j = l
				}
				this.tableDiv.innerHTML = this.createTableString(this.tpl, j);
				this.table = this.tableDiv.firstChild;
				this.tableId = this.table.id;
				this.tableClassName = this.table.className;
				if (this.table.rows[0]) {
					this.cellHeight = this.table.rows[0].clientHeight
				}
				if (k) {
					this.delayAddRows(l.trHtml.slice(a, l.trHtml.length))
				}
			}
		},
		createTableString : function(l, n) {
			var p = n.trHtml || [];
			var j = [];
			j.push('<table cellspacing="0" cellpadding="0" ' + f("id", n.id)
					+ " " + f("class", n.className) + ">");
			j.push("<tbody>");
			for ( var m = 0, k = p.length; m < k; m++) {
				var o = baidu.format(l, p[m]);
				j.push(o)
			}
			j.push("</tbody>");
			j.push("</table>");
			return j.join("")
		},
		definedEvents : function() {
			if (typeof this.mouseover == "function") {
				baidu.event.on(this.tableDiv, "mouseover", baidu.fn.bind(
						function(k) {
							k = window.event || k;
							var j = k.target || k.srcElement;
							j = this.getTr(j);
							if (j && this.mouseoverElem != j) {
								this.mouseover(k, j);
								this.mouseoverElem = j
							}
						}, this))
			}
			if (typeof this.mouseout == "function") {
				baidu.event.on(this.tableDiv, "mouseout", baidu.fn.bind(
						function(k) {
							k = window.event || k;
							var j = k.target || k.srcElement;
							j = this.getTr(j);
							if (j && this.mouseoutElem != j) {
								this.mouseout(k, j);
								this.mouseoutElem = j
							}
						}, this))
			}
			if (typeof this.click == "function") {
				baidu.event.on(this.tableDiv, "click", baidu.fn.bind(
						function(k) {
							k = window.event || k;
							var j = k.target || k.srcElement;
							j = this.getTr(j);
							if (j) {
								this.click(k, j)
							}
						}, this))
			}
			if (typeof this.dblclick == "function") {
				baidu.event.on(this.tableDiv, "dblclick", baidu.fn.bind(
						function(k) {
							k = window.event || k;
							var j = k.target || k.srcElement;
							j = this.getTr(j);
							if (j) {
								this.dblclick(k, j)
							}
						}, this))
			}
			if (typeof this.mousedown == "function") {
				baidu.event.on(this.tableDiv, "mousedown", baidu.fn.bind(
						function(k) {
							k = window.event || k;
							var j = k.target || k.srcElement;
							j = this.getTr(j);
							if (j) {
								this.mousedown(k, j)
							}
						}, this))
			}
		},
		update : function(j) {
			this.create( {
				trHtml : j
			})
		},
		addRow : function(n) {
			if (n && this.tpl && this.table) {
				if (n.length <= b) {
					var l = document.createElement("div");
					l.innerHTML = this.createTableString(this.tpl, {
						trHtml : n
					});
					var m = l.firstChild.rows;
					for ( var k = 0, j = m.length; k < j; k++) {
						this.table.lastChild.appendChild(m[0])
					}
					l = null
				} else {
					if (this.delayLoad) {
						this.delayAddRows(n, (this.timer ? false : true))
					} else {
						this.addRows(n)
					}
				}
				if (this.table.rows[0]) {
					this.cellHeight = this.table.rows[0].clientHeight
				}
			}
		},
		divData : function(m) {
			var l = [];
			var k = parseInt(m.length / a), n = m.length % a;
			if (k > 0) {
				for ( var j = 0; j < k; j++) {
					l.push(m.slice(j * a, (j + 1) * a))
				}
				if (n > 0) {
					l.push(m.slice(j * a, m.length))
				}
				return l
			} else {
				if (m.length > 0) {
					return [ m ]
				} else {
					return []
				}
			}
		},
		delayAddRows : function(l, j) {
			if (l && this.tpl && this.table) {
				this.beforeCreate();
				var k = this.divData(l);
				if (j) {
					this.addRows(k.shift())
				}
				if (!this.timer) {
					this.timer = setInterval(baidu.fn.bind(function() {
						if (k.length > 0) {
							this.addRows(k.shift())
						} else {
							if (this.timer) {
								clearInterval(this.timer);
								this.timer = null;
								var m = this.delayLoadQueue.shift();
								if (typeof m == "function") {
									m()
								}
							}
							this.onComplete()
						}
					}, this), h)
				} else {
					this.delayLoadQueue.push(baidu.fn.bind(function() {
						this.delayAddRows(l)
					}, this))
				}
			}
		},
		addRows : function(l) {
			if (l && l.length && this.tpl && this.table) {
				var k = document.createElement("div");
				k.innerHTML = this.createTableString(this.tpl, {
					trHtml : l
				});
				var j = k.firstChild.firstChild;
				this.table.appendChild(j);
				k = null
			}
		},
		remove : function(j) {
			if (j != -1) {
				this.table.deleteRow(j)
			} else {
				if (j == -1) {
					this.create( {
						id : this.tableId,
						className : this.tableClassName,
						trHtml : []
					})
				}
			}
		},
		removes : function(k) {
			if (k == -1) {
				this.remove(-1)
			} else {
				k = k.sort(function(m, l) {
					return m - l
				});
				var j = k.length;
				if (j == this.getLength()) {
					this.remove(-1)
				} else {
					while (j--) {
						this.remove(k[j])
					}
				}
			}
		},
		get : function(j) {
			return this.table.rows[j]
		},
		getLength : function() {
			return this.table.rows.length
		},
		getTr : function(j) {
			var k = j.tagName;
			if (k == "TABLE" || k == "TBODY" || j.id == this.tableContainerId) {
				return
			} else {
				if (k != "TR") {
					return this.getTr(j.parentNode)
				} else {
					return j
				}
			}
		},
		moveTo : function(j) {
			if (this.cellHeight && this.table.rows[0]) {
				var k = j * this.cellHeight - this.container.scrollTop;
				if (k < 0 || k > this.container.clientHeight - this.cellHeight) {
					this.container.scrollTop = j * this.cellHeight
				}
			}
		},
		getTableDom : function() {
			if (this.table) {
				return this.table
			}
		}
	};
	return c
})();