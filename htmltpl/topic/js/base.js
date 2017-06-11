if (!window.XN) {
	window.XN = {}
}
XN.Type = {
	createNamespace : function(c) {
		if (!XN.__namespaces) {
			XN.__namespaces = {}
		}
		if (!XN.__rootNamespaces) {
			XN.__rootNamespaces = []
		}
		if (XN.__namespaces[c]) {
			return
		}
		var e = window;
		var a = c.split(".");
		for ( var d = 0; d < a.length; d++) {
			var b = a[d];
			var f = e[b];
			if (!f) {
				e[b] = f = {};
				if (d == 0) {
					XN.__rootNamespaces[XN.__rootNamespaces.length] = f
				}
			}
			e = f
		}
	},
	createEnum : function(a, c) {
		var b = function() {
		};
		b.prototype = a;
		for ( var d in a) {
			b[d] = a[d]
		}
		if (c) {
			b.__flags = true
		}
		return b
	},
	createClass2 : function(a, b) {
		a.prototype.constructor = a;
		this.extend(a, XN.Type.Methods);
		a.__baseType = b || Object;
		if (b) {
			a.__basePrototypePending = true
		}
	},
	createClass : function(b) {
		var a = b.ctor || function() {
		};
		if (b.static_ctor) {
			this.addStaticInit(b.static_ctor)
		}
		if (b.instance) {
			a.prototype = b.instance
		}
		if (b.statics) {
			this.extend(a, b.statics)
		}
		this.createClass2(a, b.base);
		return a
	},
	addStaticInit : function(a) {
		if (!XN.Type._pendingInits) {
			XN.Type._pendingInits = []
		}
		XN.Type._pendingInits[XN.Type._pendingInits.length] = a;
		window.setTimeout(XN.Type.runPendingInits, 0)
	},
	runPendingInits : function() {
		if (XN.Type._pendingInits) {
			var b = XN.Type._pendingInits;
			XN.Type._pendingInits = null;
			var d = b.length;
			for ( var a = 0; a < d; a++) {
				b[a]()
			}
		}
	},
	extend : function(a, c) {
		for ( var b in c) {
			a[b] = c[b]
		}
		return a
	},
	getInstanceType : function(a) {
		return a.constructor
	}
};
XN.Type.Methods = {
	setupBase : function() {
		if (this.__basePrototypePending) {
			var c = this.__baseType;
			if (c.__basePrototypePending) {
				c.setupBase()
			}
			for ( var b in c.prototype) {
				var a = c.prototype[b];
				if (!this.prototype[b]) {
					this.prototype[b] = a
				}
			}
			delete this.__basePrototypePending
		}
	},
	constructBase : function(a, b) {
		if (this.__basePrototypePending) {
			this.setupBase()
		}
		if (!b) {
			this.__baseType.apply(a)
		} else {
			this.__baseType.apply(a, b)
		}
	},
	callBase : function(b, d, c) {
		var a = this.__baseType.prototype[d];
		if (!c) {
			return a.apply(b)
		} else {
			return a.apply(b, c)
		}
	},
	get_baseType : function() {
		return this.__baseType || null
	}
};
XN.Type.createNamespace("XN");
XN.Sys = function() {
};
XN.Sys.isUndefined = function(a) {
	return (a === undefined)
};
XN.Sys.isNullOrUndefined = function(a) {
	return (a === null) || (a === undefined)
};
XN.Sys.isNullOrEmpty = function(a) {
	return !a || !a.length
};
XN.Sys.parseBool = function(a) {
	return (a.toLowerCase() == "true")
};
XN.Sys.trim = function(a) {
	return a.replace(/^\s*|\s*$/g, "")
};
XN.Sys.compare = function(c, b, a) {
	if (a) {
		if (c) {
			c = c.toUpperCase()
		}
		if (b) {
			b = b.toUpperCase()
		}
	}
	c = c || "";
	b = b || "";
	if (c == b) {
		return 0
	}
	if (c < b) {
		return -1
	}
	return 1
};
XN.Sys.quote = function(c) {
	var a = {
		"\b" : "\\b",
		"\t" : "\\t",
		"\n" : "\\n",
		"\f" : "\\f",
		"\r" : "\\r",
		'"' : '\\"',
		"\\" : "\\\\"
	};
	var b = /["\\\x00-\x1f\x7f-\x9f]/g;
	return b.test(c) ? '"'
			+ c.replace(b, function(d) {
				var e = a[d];
				if (e) {
					return e
				}
				e = d.charCodeAt();
				return "\\u00" + Math.floor(e / 16).toString(16)
						+ (e % 16).toString(16)
			}) + '"' : '"' + c + '"'
};
XN.Sys.startsWith = function(a, b) {
	return a.substring(0, b.length) == b
};
XN.Sys.format = function(b) {
	if (!XN.Sys.format._formatRE) {
		XN.Sys.format._formatRE = /(\{[^\}\{]+\})/g
	}
	var a = arguments;
	return b.replace(XN.Sys.format._formatRE, function(f, c) {
		var d = parseInt(c.substr(1));
		var e = a[d + 1];
		if (XN.Sys.isNullOrUndefined(e)) {
			return ""
		}
		return e.toString()
	})
};
XN.Sys.htmlDecode = function(a) {
	htmlDecMap = {
		"&amp;" : "&",
		"&lt;" : "<",
		"&gt;" : ">",
		"&quot;" : '"'
	};
	htmlDecRE = /(&amp;|&lt;|&gt;|&quot;)/gi;
	a = a.replace(htmlDecRE, function(c, b) {
		b = b.toLowerCase();
		return htmlDecMap[b]
	});
	return a
};
XN.Sys.htmlEncode = function(a) {
	htmlEncMap = {
		"&" : "&amp;",
		"<" : "&lt;",
		">" : "&gt;",
		'"' : "&quot;"
	};
	htmlEncRE = /([&<>"])/g;
	if (htmlEncRE.test(a)) {
		a = a.replace(htmlEncRE, function(c, b) {
			return htmlEncMap[b]
		})
	}
	return a
};
XN.Sys.endsWith = function(a, b) {
	return a.length >= b.length && a.substring(a.length - b.length) == b
};
XN.Sys.contains = function(b, d) {
	var c = XN.Sys.indexOf(b, d);
	return (c >= 0)
};
XN.Sys.add = function(b, c) {
	b[b.length] = c
};
XN.Sys.remove = function(b, d) {
	var c = XN.Sys.indexOf(b, d);
	if (c >= 0) {
		b.splice(c, 1);
		return true
	}
	return false
};
XN.Sys.indexOf = function(b, e) {
	var d = b.length;
	if (d) {
		for ( var c = 0; c < d; c++) {
			if (b[c] === e) {
				return c
			}
		}
	}
	return -1
};
XN.Sys.copyArray = function(b) {
	return b.slice()
};
XN.Sys.addRange = function(b, c) {
	var e = c.length;
	for ( var d = 0; d < e; d++) {
		b[b.length] = c[d]
	}
};
XN.Sys.clear = function(b) {
	if (b.length > 0) {
		b.splice(0, b.length)
	}
};
XN.Sys.clearKeys = function(a) {
	for ( var b in a) {
		delete a[b]
	}
};
XN.Sys.containsKey = function(b, a) {
	return b[a] !== undefined
};
XN.Sys.getKeyCount = function(b) {
	var a = 0;
	for ( var c in b) {
		a++
	}
	return a
};
XN.Sys.isAssignableFrom = function(b, a) {
	while (b != a) {
		if (b.__baseType) {
			b = b.__baseType
		} else {
			return false
		}
	}
	return true
};
XN.Sys.createException = function(c, a, b) {
	var d = new Error(c);
	if (a) {
		d.userData = a
	}
	if (b) {
		d.innerException = b
	}
	return d
};
XN.Type.createClass2(XN.Sys);
XN.Debug = XN.Type.createClass( {
	statics : {
		logLevel : 0,
		assert : function(b, a) {
			if (XN.Debug.logLevel > 0 && !b) {
				a = "Assert failed: " + a;
				if (confirm(a + "\r\n\r\nBreak into debugger?")) {
					XN.Debug._fail(a)
				}
			}
		},
		writeLine : function(a) {
			a += "; [In " + document.URL + "]";
			if (XN.Debug.logLevel > 0) {
				if (window.console) {
					if (window.console.debug) {
						window.console.debug(a)
					} else {
						if (window.console.log) {
							window.console.log(a)
						}
					}
				} else {
					if (window.opera && window.opera.postError) {
						window.opera.postError(a)
					}
				}
			}
		},
		logLine : function(a, b) {
			if (a <= XN.Debug.logLevel) {
				XN.Debug.writeLine(b)
			}
		},
		_fail : function(a) {
			XN.Debug.writeLine(a)
		},
		_dumpCore : function(g, b, a, h, f) {
			if (b === null) {
				g.appendLine(h + a + ": null");
				return
			}
			switch (typeof (b)) {
			case "undefined":
				g.appendLine(h + a + ": undefined");
				break;
			case "number":
			case "string":
			case "boolean":
				g.appendLine(h + a + ": " + b);
				break;
			default:
				if (b instanceof Date || b instanceof RegExp) {
					g.appendLine(h + a + ": " + b);
					break
				}
				if (XN.Sys.contains(f, b)) {
					g.appendLine(h + a + ": ...");
					break
				}
				f[f.length] = b;
				var l = h + "  ";
				if (b.tagName) {
					g.appendLine(h + a + ": <" + b.tagName + ">");
					var c = b.attributes;
					for ( var d = 0; d < c.length; d++) {
						var e = c[d].nodeValue;
						if (e) {
							XN.Debug._dumpCore(g, e, c[d].nodeName, l, f)
						}
					}
				} else {
					g.appendLine(h + a + ": ");
					for ( var j in b) {
						var k = b[j];
						if (!(k instanceof Function)) {
							XN.Debug._dumpCore(g, k, j, l, f)
						}
					}
				}
				XN.Sys.remove(f, b);
				break
			}
		},
		dump : function(b, a) {
			if ((!a || !a.length) && (b !== null)) {
				a = typeof (b)
			}
			if (!a || !a.length) {
				return
			}
			var c = new XN.StringBuilder();
			XN.Debug._dumpCore(c, b, a, "", []);
			XN.Debug.writeLine(c.toString())
		},
		fail : function(a) {
			XN.Debug._fail(a)
		}
	}
});
XN.Enum = function() {
};
XN.Enum.parse = function Enum$parse(a, l) {
	var j = a.prototype;
	if (!a.__flags) {
		for ( var e in j) {
			if (e === l) {
				return j[e]
			}
		}
	} else {
		var c = l.split("|");
		var h = 0;
		var g = true;
		for ( var d = c.length - 1; d >= 0; d--) {
			var b = XN.Sys.trim(c[d]);
			var k = false;
			for ( var e in j) {
				if (e === b) {
					h |= j[e];
					k = true;
					break
				}
			}
			if (!k) {
				g = false;
				break
			}
		}
		if (g) {
			return h
		}
	}
	throw "Invalid Enumeration Value in XN.Enum.parse; enumType: " + a
			+ "; string: " + l
};
XN.Enum.toString = function Enum$toString(a, d) {
	var b = a.prototype;
	if (!a.__flags || (d === 0)) {
		for ( var c in b) {
			if (b[c] === d) {
				return c
			}
		}
		throw "Invalid (NoMultiple-Type) Enumeration Value in XN.Enum.toString; enumType: "
				+ a + "; value: " + d
	} else {
		var e = [];
		for ( var c in b) {
			if (b[c] & d) {
				if (e.length) {
					e[e.length] = " | "
				}
				e[e.length] = c
			}
		}
		if (!e.length) {
			throw "Invalid (Multiple-Type) Enumeration Value in XN.Enum.toString; enumType: "
					+ a + "; value: " + d
		}
		return e.join("")
	}
};
XN.Type.createClass2(XN.Enum);
XN.Enum = function() {
};
XN.Enum.parse = function Enum$parse(a, l) {
	var j = a.prototype;
	if (!a.__flags) {
		for ( var e in j) {
			if (e === l) {
				return j[e]
			}
		}
	} else {
		var c = l.split("|");
		var h = 0;
		var g = true;
		for ( var d = c.length - 1; d >= 0; d--) {
			var b = XN.Sys.trim(c[d]);
			var k = false;
			for ( var e in j) {
				if (e === b) {
					h |= j[e];
					k = true;
					break
				}
			}
			if (!k) {
				g = false;
				break
			}
		}
		if (g) {
			return h
		}
	}
	throw "Invalid Enumeration Value in XN.Enum.parse; enumType: " + a
			+ "; string: " + l
};
XN.Enum.toString = function Enum$toString(a, d) {
	var b = a.prototype;
	if (!a.__flags || (d === 0)) {
		for ( var c in b) {
			if (b[c] === d) {
				return c
			}
		}
		throw "Invalid (NoMultiple-Type) Enumeration Value in XN.Enum.toString; enumType: "
				+ a + "; value: " + d
	} else {
		var e = [];
		for ( var c in b) {
			if (b[c] & d) {
				if (e.length) {
					e[e.length] = " | "
				}
				e[e.length] = c
			}
		}
		if (!e.length) {
			throw "Invalid (Multiple-Type) Enumeration Value in XN.Enum.toString; enumType: "
					+ a + "; value: " + d
		}
		return e.join("")
	}
};
XN.Type.createClass2(XN.Enum);
XN.Delegate = function() {
};
XN.Delegate.Null = function() {
};
XN.Delegate._create = function Delegate$_create(a) {
	var b = function() {
		if (a.length == 2) {
			return a[1].apply(a[0], arguments)
		} else {
			var d = a.slice();
			for ( var c = 0; c < d.length; c += 2) {
				d[c + 1].apply(d[c], arguments)
			}
			return null
		}
	};
	b.invoke = b;
	b._targets = a;
	return b
};
XN.Delegate.create = function Delegate$create(a, b) {
	if (!a) {
		return b
	}
	return XN.Delegate._create( [ a, b ])
};
XN.Delegate.combine = function Delegate$combine(b, a) {
	if (!b) {
		if (!a._targets) {
			return XN.Delegate.create(null, a)
		}
		return a
	}
	if (!a) {
		if (!b._targets) {
			return XN.Delegate.create(null, b)
		}
		return b
	}
	var d = b._targets ? b._targets : [ null, b ];
	var c = a._targets ? a._targets : [ null, a ];
	return XN.Delegate._create(d.concat(c))
};
XN.Delegate.remove = function Delegate$remove(e, c) {
	if (!e || (e === c)) {
		return null
	}
	if (!c) {
		return e
	}
	var a = e._targets;
	var b = null;
	var f;
	if (c._targets) {
		b = c._targets[0];
		f = c._targets[1]
	} else {
		f = c
	}
	for ( var d = 0; d < a.length; d += 2) {
		if ((a[d] === b) && (a[d + 1] === f)) {
			if (a.length == 2) {
				return null
			}
			a.splice(d, 2);
			return XN.Delegate._create(a)
		}
	}
	return e
};
XN.Type.createClass2(XN.Delegate);
XN.StringBuilder = XN.Type.createClass( {
	ctor : function(a) {
		if ((a !== undefined) && (a !== null)) {
			this._parts = [ a ]
		} else {
			this._parts = []
		}
	},
	instance : {
		get_isEmpty : function() {
			return (this._parts.length == 0)
		},
		append : function(a) {
			if ((a !== undefined) && (a !== null)) {
				XN.Sys.add(this._parts, a)
			}
		},
		appendLine : function(a) {
			this.append(a);
			this.append("\r\n")
		},
		clear : function() {
			XN.Sys.clear(this._parts)
		},
		toString : function() {
			return this._parts.join("")
		}
	}
});
XN.ArrayEnumerator = function ArrayEnumerator$(a) {
	this._array = a;
	this._index = -1
};
XN.ArrayEnumerator.prototype = {
	get_current : function() {
		return this._array[this._index]
	},
	moveNext : function() {
		this._index++;
		return (this._index < this._array.length)
	},
	reset : function() {
		this._index = -1
	}
};
XN.Type.createClass2(XN.ArrayEnumerator);
XN.FeatureLoader = XN.Type.createClass( {
	ctor : function() {
		this._loadedFeatures = {};
		this._requestedFeatures = {};
		this._scriptsToLoad = [];
		this._loadedStyleSheets = {}
	},
	static_ctor : function() {
		XN.FeatureLoader.singleton = new XN.FeatureLoader()
	},
	statics : {
		onScriptLoaded : function(c) {
			XN.Type.runPendingInits();
			var d = XN.FeatureLoader.singleton;
			d._isWaiting = false;
			var f = d._loadedFeatures;
			var b = new XN.ArrayEnumerator(c);
			while (b.moveNext()) {
				var a = b.get_current();
				XN.Debug.assert(!XN.Sys.containsKey(f, a), "Feature " + c
						+ " was already loaded.");
				var e = d._getFeatureInfo(a);
				if (e) {
					d._loadedStyleSheetsForFeature(e)
				}
				f[a] = true
			}
			window.setTimeout(XN.Delegate.create(d, d.checkRequestQueue), 0)
		}
	},
	instance : {
		get_requestQueue : function() {
			return window.self.XN.Bootstrap.FeatureRequestQueue
		},
		get_featureMap : function() {
			return window.self.XN.Bootstrap.FeatureMap
		},
		get_customFeatureMap : function() {
			return XN.Bootstrap.CustomFeatureMap
		},
		isFeatureRequestedAndLoaded : function(a) {
			return XN.Sys.containsKey(this._loadedFeatures, a)
					&& XN.Sys.containsKey(this._requestedFeatures, a)
		},
		_getFeatureInfo : function(a) {
			var b = null;
			if (this.get_customFeatureMap()) {
				b = this.get_customFeatureMap()[a]
			}
			if (!b) {
				b = this.get_featureMap()[a]
			}
			return b
		},
		_addFeature : function(a) {
			var c = this._getFeatureInfo(a);
			if (!c) {
				XN.Debug.assert(false, "Unknown feature: " + a)
			} else {
				if (c.dependencies) {
					var b = new XN.ArrayEnumerator(c.dependencies);
					while (b.moveNext()) {
						var d = b.get_current();
						this._addFeature(d)
					}
				}
				if (!XN.Sys.containsKey(this._loadedFeatures, a)
						&& !XN.Sys.containsKey(this._requestedFeatures, a)
						&& !XN.Sys.contains(this._scriptsToLoad, c.src)) {
					XN.Sys.add(this._scriptsToLoad, c.src)
				}
			}
		},
		checkRequestQueue : function() {
			var f = this.get_requestQueue();
			var k = new XN.ArrayEnumerator(f);
			while (k.moveNext()) {
				var d = k.get_current();
				if (!d.addedToScriptsQueue) {
					var h = new XN.ArrayEnumerator(d.features);
					while (h.moveNext()) {
						var l = h.get_current();
						this._addFeature(l)
					}
					d.addedToScriptsQueue = true
				}
			}
			var a = [];
			for ( var e = 0; e < f.length; e++) {
				var d = f[e];
				var b = 0;
				for ( var c = 0; c < d.features.length; c++) {
					var l = d.features[c];
					this._requestedFeatures[l] = true;
					if (XN.Sys.containsKey(this._loadedFeatures, l)) {
						b++
					}
				}
				if (b === d.features.length) {
					XN.Sys.add(a, d)
				}
			}
			var g = new XN.ArrayEnumerator(a);
			while (g.moveNext()) {
				var d = g.get_current();
				XN.Sys.remove(f, d);
				if (d.callback) {
					d.callback()
				}
			}
			this._loadNextScript()
		},
		_loadNextScript : function() {
			if (!this._isWaiting) {
				if (this._scriptsToLoad.length > 0) {
					var a = this._scriptsToLoad[0];
					this._scriptsToLoad.splice(0, 1);
					this._isWaiting = true;
					var b = document.createElement("script");
					b.type = "text/javascript";
					b.src = a;
					document.getElementsByTagName("head")[0].appendChild(b)
				}
			}
		},
		_loadedStyleSheetsForFeature : function(b) {
			if (b.styleSheets) {
				var a = new XN.ArrayEnumerator(b.styleSheets);
				while (a.moveNext()) {
					var c = a.get_current();
					this._loadStyleSheet(c)
				}
			}
		},
		_loadStyleSheet : function(a) {
			if (!XN.Sys.containsKey(this._loadedStyleSheets, a)) {
				var b = document.createElement("link");
				b.setAttribute("rel", "stylesheet");
				b.setAttribute("type", "text/css");
				b.setAttribute("href", a);
				document.getElementsByTagName("head")[0].appendChild(b);
				this._loadedStyleSheets[a] = true
			}
		},
		_isWaiting : false
	}
});
XN.FeatureLoader.onScriptLoaded( [ "Base" ]);
XN.Type.createNamespace("XN");
XN.Waitable = XN.Type.createClass( {
	ctor : function() {
	},
	instance : {
		onChange : function() {
			if (this.__changed) {
				this.__changed(this)
			}
		},
		waitUntilReady : function(b) {
			if (this.get_isReady()) {
				b(this.result)
			} else {
				var a = null;
				a = XN.Delegate.create(this, function(c) {
					this.remove_changed(a);
					b(this.result)
				});
				this.add_changed(a)
			}
		},
		waitForValue : function(a, b) {
			this.waitForCondition(XN.Delegate.create(this, function(c) {
				if (this.get_isReady() && this.result === a) {
					b();
					return true
				}
				return false
			}))
		},
		waitForCondition : function(b) {
			if (!b(this)) {
				var a = null;
				a = XN.Delegate.create(this, function(c) {
					if (b(c)) {
						this.remove_changed(a)
					}
				});
				this.add_changed(a)
			}
		},
		resetChange : function() {
			this.__changed = null
		},
		result : null,
		add_changed : function(a) {
			this.__changed = XN.Delegate.combine(this.__changed, a)
		},
		remove_changed : function(a) {
			this.__changed = XN.Delegate.remove(this.__changed, a)
		},
		__changed : null
	}
});
XN.SimpleWaitable = XN.Type.createClass( {
	base : XN.Waitable,
	ctor : function() {
		XN.SimpleWaitable.constructBase(this)
	},
	instance : {
		get_isReady : function() {
			return this._isReady$1
		},
		setResult : function(a, b) {
			this.result = a;
			this._isReady$1 = (!b);
			this.onChange()
		},
		_isReady$1 : false
	}
});
XN.DependentWaitable = XN.Type.createClass( {
	base : XN.Waitable,
	ctor : function() {
		this._dependents$1 = [];
		XN.DependentWaitable.constructBase(this)
	},
	instance : {
		get_isReady : function() {
			return this._waitItems$1 <= 0
		},
		addDependent : function(a) {
			if (!a.get_isReady()) {
				XN.Sys.add(this._dependents$1, a);
				this._waitItems$1++;
				a.add_changed(XN.Delegate.create(this,
						this._dependent_OnReady$1))
			}
		},
		removeAll : function() {
			var b = new XN.ArrayEnumerator(this._dependents$1);
			while (b.moveNext()) {
				var a = b.get_current();
				a.remove_changed(XN.Delegate.create(this,
						this._dependent_OnReady$1))
			}
			this._dependents$1 = [];
			this._waitItems$1 = 0
		},
		_dependent_OnReady$1 : function(a) {
			a.remove_changed(XN.Delegate
					.create(this, this._dependent_OnReady$1));
			this._waitItems$1--;
			if (!this._waitItems$1) {
				this.onChange()
			}
		},
		_waitItems$1 : 0
	}
});
XN.PendingResult = XN.Type.createClass( {
	base : XN.SimpleWaitable,
	ctor : function() {
		XN.PendingResult.constructBase(this)
	},
	instance : {
		exception : null,
		setPendingResult : function(a, b) {
			var c = a;
			if (!b && c && !XN.Sys.isUndefined(c.error_code)) {
				b = XNIntern.Utility.createException(c.error_msg, c);
				XN.Debug.assert(false, Connect_Config.mainsite_name
						+ " API error: " + c.error_msg);
				a = null
			}
			this.exception = b;
			this.setResult(a)
		}
	}
});
XN.$create_Size = function XN_Size(a, c) {
	var b = {};
	b.w = a;
	b.h = c;
	return b
};
XN.$create_Point = function XN_Point(a, c) {
	var b = {};
	b.x = a;
	b.y = c;
	return b
};
XN.FeedStorySetting = XN.Type.createEnum( {
	preview : 1,
	autoaccept : 2,
	doNotSend : 3
}, false);
XN.FeedStorySize = XN.Type.createEnum( {
	oneLine : 1,
	shortStory : 2,
	full : 4
}, false);
XN.Type.createNamespace("XNIntern");
XNIntern.HostName = XN.Type.createEnum( {
	IE : 0,
	MOZILLA : 1,
	SAFARI : 2,
	OPERA : 3,
	OTHER : 4
}, false);
XNIntern.SimulateCookie = XN.Type.createClass( {
	static_ctor : function() {
		XNIntern.SimulateCookie.cookies = []
	},
	statics : {
		set : function(a, h, k, e, j) {
			var b = {};
			b[a] = encodeURIComponent(h);
			if (j) {
				var g = new Date();
				var c = new Date(g.getTime() + 3600000 * 24 * j);
				b.expires = c.toUTCString()
			}
			if (k) {
				b.path = k
			}
			if (e) {
				b.domain = e
			}
			for ( var f = 0; f < XNIntern.SimulateCookie.cookies.length; f++) {
				var d = XNIntern.SimulateCookie.cookies[f];
				if (a in d) {
					XNIntern.SimulateCookie.cookies[f] = b;
					return
				}
			}
			XNIntern.SimulateCookie.cookies.push(b)
		},
		getValue : function(a) {
			for ( var c = 0; c < XNIntern.SimulateCookie.cookies.length; c++) {
				var b = XNIntern.SimulateCookie.cookies[c];
				if (b[a]) {
					return b[a]
				}
			}
			return null
		}
	}
});
XNIntern.Cookie = XN.Type.createClass( {
	ctor : function() {
	},
	statics : {
		set : function(c, f, g, e, h) {
			if (XN.Sys.isNullOrUndefined(f)) {
				f = ""
			}
			if (XN.Main.appSettings
					&& XN.Main.appSettings.acceptCookie === false) {
				XNIntern.SimulateCookie.set(c, f, g, e, h);
				return
			}
			var d = c + "=" + encodeURIComponent(f) + ";";
			if (h) {
				var b = new Date();
				var a = new Date(b.getTime() + 3600000 * 24 * h);
				d += "expires=" + a.toUTCString() + ";"
			}
			if (g) {
				d += "path=" + g + ";"
			}
			if (e) {
				d += "domain=" + e + ";"
			}
			document.cookie = d
		},
		clear : function(a, c, b) {
			XNIntern.Cookie.set(a, "", c, b, -10)
		},
		getValue : function(b) {
			var e = b + "=";
			if (XN.Main.appSettings
					&& XN.Main.appSettings.acceptCookie === false) {
				var a = XNIntern.SimulateCookie.getValue(b);
				return a
			}
			var a = document.cookie.split(";");
			for ( var d = 0; d < a.length; d++) {
				var f = a[d];
				f = XN.Sys.trim(f);
				if (!f.indexOf(e)) {
					f = decodeURIComponent(f.substr(e.length));
					return f
				}
			}
			return null
		}
	}
});
XNIntern.XNGlobals = XN.Type.createClass( {
	ctor : function() {
	},
	statics : {
		get_xn_StaticResourceVersions : function() {
			return XN.Bootstrap.StaticResourceVersions
		}
	}
});
XNIntern.HostInfo = XN.Type.createClass( {
	ctor : function() {
		var d = window.navigator.userAgent.toLowerCase();
		var c;
		var a = null;
		if ((c = d.indexOf("msie")) >= 0) {
			this._hostName = XNIntern.HostName.IE;
			a = d.substr(c + 5)
		} else {
			if ((c = d.indexOf("firefox")) >= 0) {
				this._hostName = XNIntern.HostName.MOZILLA;
				a = d.substr(c + 8)
			} else {
				if ((c = d.indexOf("safari")) >= 0) {
					this._hostName = XNIntern.HostName.SAFARI;
					a = d.substr(c + 7)
				} else {
					if ((c = d.indexOf("opera")) >= 0) {
						this._hostName = XNIntern.HostName.OPERA;
						a = d.substr(c + 6)
					} else {
						if ((c = d.indexOf("gecko")) >= 0) {
							this._hostName = XNIntern.HostName.MOZILLA;
							a = window.navigator.appVersion
						} else {
							this._hostName = XNIntern.HostName.OTHER
						}
					}
				}
			}
		}
		if (a) {
			var b = parseFloat(a);
			this.majorVersion = parseInt(b);
			if ((c = a.indexOf(".")) >= 0) {
				this.minorVersion = parseInt(a.substr(c + 1))
			}
		}
	},
	statics : {
		isStrictMode : function() {
			return document.compatMode != "BackCompat"
		}
	},
	instance : {
		get_hostName : function() {
			return this._hostName
		},
		majorVersion : 0,
		minorVersion : 0,
		_hostName : 0
	}
});
XNIntern.AppInfo = XN.Type.createClass( {
	ctor : function() {
		this._hostInfo = new XNIntern.HostInfo()
	},
	statics : {
		get_singleton : function() {
			if (!XNIntern.AppInfo._current) {
				XNIntern.AppInfo._current = new XNIntern.AppInfo()
			}
			return XNIntern.AppInfo._current
		}
	},
	instance : {
		get_hostInfo : function() {
			return this._hostInfo
		},
		_hostInfo : null
	}
});
XNIntern.Uri = XN.Type.createClass( {
	ctor : function(a) {
		this._uriString = a
	},
	statics : {
		create : function(d, b) {
			var c;
			if (XNIntern.Uri.isAbsoluteUri(b)) {
				c = b
			} else {
				if (b.charAt(0) === "/") {
					c = d.get_schemeAndDomain() + b
				} else {
					var a = d.get_uriString().lastIndexOf("/");
					c = d.get_uriString().substr(0, a + 1) + b
				}
			}
			return new XNIntern.Uri(c)
		},
		isAbsoluteUri : function(a) {
			return a.indexOf("://") > 0
		},
		addQueryParameters : function(b, a) {
			if (b.indexOf("?") > 0) {
				return b + "&" + a
			} else {
				return b + "?" + a
			}
		},
		createQueryString : function(d) {
			var c = "";
			var b = d;
			for ( var a in b) {
				if (!b.hasOwnProperty(a)) {
					continue
				}
				var e = {
					key : a,
					value : b[a]
				};
				c += e.key + "=" + encodeURIComponent((e.value)) + "&"
			}
			if (c !== "" && c.charAt(c.length - 1) === "&") {
				c = c.substr(0, c.length - 1)
			}
			return c
		}
	},
	instance : {
		get_uriString : function() {
			return this._uriString
		},
		get_pathAndQuery : function() {
			var a = this._uriString.indexOf("://");
			if (a >= 0) {
				a = this._uriString.indexOf("/", a + 3);
				if (a >= 0) {
					return this._uriString.substr(a)
				}
			}
			return this._uriString
		},
		get_schemeAndDomain : function() {
			var b = this._uriString.indexOf("http://");
			if (b) {
				b = this._uriString.indexOf("https://")
			}
			if (!b) {
				var a = this._uriString.indexOf("/", 8);
				if (a >= 0) {
					return this._uriString.substr(0, a)
				} else {
					return this._uriString
				}
			}
			throw new Error("This object is not an absolute URI.")
		},
		get_queryParameters : function() {
			if (!this._queryParameters) {
				this._queryParameters = {};
				var g;
				var c = this._uriString.indexOf("?");
				if (c > -1) {
					g = this._uriString.substr(c + 1);
					c = g.indexOf("#");
					if (c > 0) {
						g = g.substring(0, c)
					}
					var a = g.split("&");
					var e = new XN.ArrayEnumerator(a);
					while (e.moveNext()) {
						var d = e.get_current();
						c = d.indexOf("=");
						if (c > 0) {
							var b = d.substr(0, c);
							var f = d.substr(c + 1);
							this._queryParameters[b] = decodeURIComponent(f)
						}
					}
				}
			}
			return this._queryParameters
		},
		_queryParameters : null,
		_uriString : null
	}
});
XNIntern.JSON = function XN_JSON() {
};
XNIntern.JSON.deserialize = function XN_JSON$deserialize(s,
		convert64bitIntToString) {
	if (XN.Sys.isNullOrEmpty(s)) {
		return null
	}
	if (convert64bitIntToString) {
		if (!XNIntern.JSON._64bitIntRegex) {
			XNIntern.JSON._64bitIntRegex = new RegExp(
					'([^\\\\]":)([0-9]{11,20})(,|}|])', "gm")
		}
		s = s.replace(XNIntern.JSON._64bitIntRegex, '$1"$2"$3')
	}
	return eval("(" + s + ")")
};
XNIntern.JSON.serialize = function XN_JSON$serialize(a) {
	if (XN.Sys.isNullOrUndefined(a)) {
		return ""
	}
	var b = new XN.StringBuilder();
	XNIntern.JSON._serializeCore(b, a);
	return b.toString()
};
XNIntern.JSON._serializeCore = function XN_JSON$_serializeCore(j, b) {
	if (XN.Sys.isNullOrUndefined(b)) {
		j.append("null");
		return
	}
	var m = typeof (b);
	switch (m) {
	case "boolean":
		j.append(b.toString());
		return;
	case "number":
		j.append((isFinite(b)) ? b.toString() : "null");
		return;
	case "string":
		j.append(XN.Sys.quote(b));
		return;
	case "object":
		if (b instanceof Array) {
			j.append("[");
			var k = b;
			var c = k.length;
			var f = true;
			for ( var e = 0; e < c; e++) {
				if (typeof (k[e]) == "function") {
					continue
				}
				if (f) {
					f = false
				} else {
					j.append(",")
				}
				XNIntern.JSON._serializeCore(j, k[e])
			}
			j.append("]")
		} else {
			if (b instanceof Date) {
				var h = b;
				var p = Date.UTC(h.getUTCFullYear(), h.getUTCMonth(), h
						.getUTCDate(), h.getUTCHours(), h.getUTCMinutes(), h
						.getUTCSeconds(), h.getUTCMilliseconds());
				j.append('"\\@');
				j.append(p.toString());
				j.append('@"')
			} else {
				if (b instanceof RegExp) {
					j.append(b.toString())
				} else {
					XN.Debug.logLine(8,
							"XNIntern.JSON._serializeCore: Start an object {");
					j.append("{");
					var f = true;
					var n = b;
					for ( var g in n) {
						var l = {
							key : g,
							value : n[g]
						};
						if (XN.Sys.startsWith(l.key, "$")) {
							continue
						}
						if (typeof (l.value) == "function") {
							continue
						}
						if (f) {
							f = false
						} else {
							j.append(",")
						}
						j.append('"' + l.key + '"');
						j.append(":");
						XNIntern.JSON._serializeCore(j, l.value)
					}
					XN.Debug.logLine(8,
							"XNIntern.JSON._serializeCore: Ended an object }");
					j.append("}")
				}
			}
		}
		return;
	default:
		j.append("null");
		return
	}
};
XNIntern.Flash = XN.Type
		.createClass( {
			ctor : function() {
			},
			static_ctor : function() {
				XNIntern.Flash.xdComm = null;
				XNIntern.Flash.curMajor = 0;
				XNIntern.Flash.curMinor = 0;
				XNIntern.Flash.versionDetected = false
			},
			statics : {
				hasRequireVersion : function() {
					return XNIntern.Flash._verifyMinimumVersion(9, 0)
				},
				_verifyMinimumVersion : function(i, e) {
					if (!XNIntern.Flash.versionDetected) {
						var a = [ "0", "0" ];
						var b = XNIntern.AppInfo.get_singleton().get_hostInfo()
								.get_hostName() === XNIntern.HostName.IE;
						var d = navigator.plugins;
						if (d && d.length > 0) {
							if (d["Shockwave Flash 2.0"]
									|| d["Shockwave Flash"]) {
								var j;
								if (d["Shockwave Flash 2.0"]) {
									j = (d["Shockwave Flash 2.0"].description)
								} else {
									j = (d["Shockwave Flash"].description)
								}
								var k = j.split(" ");
								a = k[2].split(".")
							}
						} else {
							if (b) {
								var h = null;
								var c;
								try {
									c = new ActiveXObject(
											"ShockwaveFlash.ShockwaveFlash.7");
									h = c.GetVariable("$version")
								} catch (g) {
								}
								if (!a) {
									try {
										c = new ActiveXObject(
												"ShockwaveFlash.ShockwaveFlash.6");
										h = "WIN 6,0,21,0"
									} catch (f) {
									}
								}
								if (!XN.Sys.isNullOrEmpty(h)) {
									a = h.split(" ")[1].split(",")
								}
							}
						}
						if (XNIntern.AppInfo.get_singleton().get_hostInfo()
								.get_hostName() === XNIntern.HostName.MOZILLA) {
							XN.Debug
									.logLine(1,
											"Cannot use Flash on Firefox due to a possible bug in Flash");
							XNIntern.Flash.curMajor = 0;
							XNIntern.Flash.curMinor = 0
						} else {
							if (XNIntern.Utility.isSecure() && b) {
								XN.Debug
										.logLine(1,
												"Currenty, Flash is not used on IE in SSL pages");
								XNIntern.Flash.curMajor = 0;
								XNIntern.Flash.curMinor = 0
							} else {
								XNIntern.Flash.curMajor = parseInt(a[0]);
								XNIntern.Flash.curMinor = parseInt(a[1])
							}
						}
						XNIntern.Flash.versionDetected = true
					}
					return XNIntern.Flash.curMajor > i
							|| (XNIntern.Flash.curMajor === i && XNIntern.Flash.curMinor >= e)
				},
				_createFlashObject : function(e, c) {
					var a;
					if (XNIntern.AppInfo.get_singleton().get_hostInfo()
							.get_hostName() === XNIntern.HostName.IE) {
						a = XN.Sys
								.format(
										'<object width="1" height=""  id="{0}" name="{1}" type="application/x-shockwave-flash" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ><param name="movie" value="{2}" /> <param name="quality" value="high" /> <param name="bgcolor" value="#869ca7" /> <param name="allowScriptAccess" value="always" /> </object>',
										e, e, c)
					} else {
						a = XN.Sys
								.format(
										"<embed width='1' height='1' type='application/x-shockwave-flash' pluginspage='http://www.adobe.com/go/getflashplayer' allowscriptaccess='always' name='{0}' id='{1}' bgcolor='#869ca7' quality='high'  src='{2}' />",
										e, e, c)
					}
					var d = document.createElement("div");
					XN.XdComm.Server.singleton.get_hiddenIFrameContainer()
							.appendChild(d);
					d.innerHTML = a;
					if (XNIntern.AppInfo.get_singleton().get_hostInfo()
							.get_hostName() === XNIntern.HostName.IE) {
						var b = d.parentNode;
						while (b && b.tagName !== "HTML") {
							if (b.tagName === "FORM") {
								window[e] = b[e];
								break
							}
							b = b.parentNode
						}
						return window[e]
					} else {
						return document[e]
					}
				},
				get_xdComm : function() {
					if (!XNIntern.Flash.xdComm
							&& XN.Bootstrap.siteVars.use_flash
							&& XNIntern.Flash.hasRequireVersion()) {
						XN.Debug.logLine(3, "Create Flash XdComm object");
						XNIntern.Flash.xdComm = new XN.SimpleWaitable();
						var a = null;
						var b = false;
						window.XN_OnFlashConnectReady = function() {
							XN.Debug.logLine(3, "Flash XdComm ready");
							b = true;
							if (a) {
								XNIntern.Flash.xdComm.setResult(a)
							}
						};
						a = XNIntern.Flash
								._createFlashObject(
										"flashXdComm",
										XNIntern.XNGlobals
												.get_xn_StaticResourceVersions()["xd_comm_swf_url"]);
						if (a && b) {
							XNIntern.Flash.xdComm.setResult(a)
						}
					}
					return XNIntern.Flash.xdComm
				},
				decode : function(a) {
					if (a && a.length && typeof a != "string") {
						a = a[0]
					}
					if (!a || typeof a != "string") {
						return a
					}
					a = a.replace(/\&custom_lt\;/g, "<");
					a = a.replace(/\&custom_gt\;/g, ">");
					a = a.replace(/\&custom_backslash\;/g, "\\");
					a = a.replace(/\\0/g, "\x00");
					return a
				}
			}
		});
XNIntern.UIHelper = XN.Type.createClass( {
	ctor : function() {
	},
	statics : {
		findElementById : function(b, g) {
			if (b.id === g) {
				return b
			}
			var f = b.childNodes.length;
			for ( var d = 0; d < f; d++) {
				var e = b.childNodes[d];
				var a = XNIntern.UIHelper.findElementById(e, g);
				if (a) {
					return a
				}
			}
			return null
		}
	}
});
XNIntern.Utility = XN.Type
		.createClass( {
			ctor : function() {
			},
			statics : {
				getConnectServerUrl : function(a) {
					return XN.Sys
							.format(
									XNIntern.XNGlobals
											.get_xn_StaticResourceVersions()["base_url_format"],
									a)
				},
				getNonConnectServerUrl : function(a) {
					var b = XNIntern.XNGlobals.get_xn_StaticResourceVersions()["base_url_format"];
					if (b.indexOf("connect." + Connect_Config.domain) >= 0) {
						b = "http://{0}." + Connect_Config.domain + "/";
						return XN.Sys.format(b, a)
					} else {
						return XNIntern.Utility.getConnectServerUrl(a)
					}
				},
				getLoginoutUrl : function(a) {
					return XN.Sys
							.format(
									XNIntern.XNGlobals
											.get_xn_StaticResourceVersions()["loginout_url"],
									a)
				},
				isSecure : function() {
					return window.location.href.indexOf("https") === 0
				},
				id64BitEquals : function(b, a) {
					var d = "";
					var c = "";
					if (typeof (b) === "number") {
						if (b > 2147483647) {
							XN.Debug
									.logLine(
											1,
											"This integer is great than 32 bit and can't be properly in comparison in JavaScript. It should be stored as string instead.")
						}
						d = b.toString()
					} else {
						d = b
					}
					if (typeof (a) === "number") {
						if (a > 2147483647) {
							XN.Debug
									.logLine(
											1,
											"This integer is great than 32 bit and can't be properly in comparison in JavaScript. It should be stored as string instead.")
						}
						c = a.toString()
					} else {
						c = a
					}
					return !XN.Sys.compare(d, c, false)
				},
				waitForLoaded : function(b, c) {
					var a = null;
					a = function(d) {
						XNIntern.Utility.removeEventListener(b, "load", a);
						c()
					};
					XNIntern.Utility.addEventListener(b, "load", a)
				},
				waitForWindowReady : function(c) {
					if ((window.XN_IsDomContentReady)) {
						c()
					} else {
						var b = null;
						var a = (XNIntern.AppInfo.get_singleton()
								.get_hostInfo().get_hostName() !== XNIntern.HostName.IE) ? "DOMContentLoaded"
								: "load";
						b = function(d) {
							XNIntern.Utility.removeEventListener(window.self,
									a, b);
							c()
						};
						XNIntern.Utility.addEventListener(window.self, a, b)
					}
				},
				get_windowLocation : function() {
					var b = XN.$create_Point(0, 0);
					var a, c;
					if (window.screenLeft) {
						a = window.screenLeft;
						c = window.screenTop
					} else {
						a = window.screenX;
						c = window.screenY
					}
					b.x = a;
					b.y = c;
					if (XN.Sys.isUndefined(b.x)) {
						b.x = 0
					}
					if (XN.Sys.isUndefined(b.y)) {
						b.y = 0
					}
					return b
				},
				get_windowSize : function() {
					var a = XN
							.$create_Size(
									(window && window.innerWidth)
											|| (document
													&& document.documentElement && document.documentElement.clientWidth)
											|| (document && document.body && document.body.clientWidth)
											|| 0,
									(window && window.innerHeight)
											|| (document
													&& document.documentElement && document.documentElement.clientHeight)
											|| (document && document.body && document.body.clientHeight)
											|| 0);
					return a
				},
				get_documentSize : function() {
					if (document.body.scrollWidth) {
						s = XN.$create_Size(Math.max(document.body.scrollWidth,
								document.documentElement.scrollWidth), Math
								.min(document.body.scrollHeight,
										document.documentElement.scrollHeight))
					} else {
						s = XN.$create_Size(0, 0)
					}
					var b = document.body;
					if (b.offsetWidth < b.scrollWidth) {
						right = b.scrollWidth + b.offsetLeft
					} else {
						var d = b.childNodes;
						right = 0;
						for ( var c = 0; c < d.length; c++) {
							var e = d[c];
							var a = e.offsetWidth + e.offsetLeft;
							if (a > right) {
								right = a
							}
						}
					}
					s.w = right;
					if (s.w <= 0 && document.documentElement
							&& document.documentElement.scrollWidth) {
						s.w = document.documentElement.scrollWidth
					}
					if (s.h <= 0 && document.documentElement
							&& document.documentElement.scrollHeight) {
						s.h = document.documentElement.scrollHeight
					}
					return s
				},
				get_isInUserActionCallstack : function() {
					var c = XNIntern.Utility.get_currentEvent();
					if (!c) {
						return false
					} else {
						var b = [ "onclick", "oncontextmenu", "ondblclick",
								"onfocus", "onkeydown", "onkeypress",
								"onkeyup", "onmousedown", "onmousemove",
								"onmouseout", "onmouseover", "onmouseup",
								"click", "ctextmenu", "dblclick", "focus",
								"keydown", "keypress", "keyup", "mousedown",
								"mousemove", "mouseout", "mouseover", "mouseup" ];
						var a = c.type;
						return a && XN.Sys.contains(b, a)
					}
				},
				get_currentEvent : function() {
					var c = window.event;
					if (!c) {
						var d = arguments.callee;
						var b = [];
						var a;
						while (true) {
							XN.Sys.add(b, d);
							a = d.caller;
							if (!a) {
								break
							}
							if (XN.Sys.indexOf(b, a) >= 0) {
								XN.Debug
										.logLine(
												1,
												"XN.Connect.get_isInUserActionCallstack(): we can't correctly make a detection because of recursion in call stack");
								return null
							}
							d = a
						}
						c = d.arguments.length == 1 && d.arguments[0]
								&& d.arguments[0].type ? d.arguments[0] : null
					}
					return c
				},
				addEventListener : function(a, c, b) {
					if (a.addEventListener) {
						a.addEventListener(c, b, false)
					} else {
						if (a.attachEvent) {
							b._ieEventHandler = function() {
								b(window.event)
							};
							(a).attachEvent("on" + c, (b._ieEventHandler))
						}
					}
				},
				removeEventListener : function(a, c, b) {
					if (a.removeEventListener) {
						a.removeEventListener(c, b, false)
					} else {
						if (a.detachEvent) {
							a.detachEvent("on" + c, (b._ieEventHandler))
						}
					}
				},
				createXMLHttpRequest : function() {
					if (!XN.XMLHttpRequest) {
						if (!window.XMLHttpRequest) {
							XN.XMLHttpRequest = function() {
								var b = [ "Msxml2.XMLHTTP", "Microsoft.XMLHTTP" ];
								for ( var d = 0; d < b.length; d++) {
									try {
										var a = new ActiveXObject(b[d]);
										return a
									} catch (c) {
									}
								}
							}
						} else {
							XN.XMLHttpRequest = window.XMLHttpRequest
						}
					}
					return new XN.XMLHttpRequest()
				},
				getIFrameDocument : function(e, a, f) {
					var d = (window.self.frames)[e];
					var c = null;
					if (window.location.hostname === document.domain) {
						try {
							c = d.document
						} catch (b) {
							XN.Debug
									.logLine(1,
											"Failed to get frameWindow.document, will try again later")
						}
					}
					if (c) {
						f(c)
					} else {
						XNIntern.Utility.waitForLoaded(a, function() {
							f(d.document)
						})
					}
				},
				isConnectSession : function(a) {
					if (!a) {
						throw new Error("session key is null")
					}
					return a.substr(0, 2) === "3."
				},
				isStrInt : function(a) {
					return parseInt(a).toString() === a
				},
				createException : function(c, a, b) {
					return XN.Sys.createException(c, a, b)
				}
			}
		});
XN.Type.createNamespace("XN.UI");
XN.UI.DomResources = XN.Type.createClass( {
	ctor : function() {
	},
	static_ctor : function() {
		XN.UI.DomResources._dicts = []
	},
	statics : {
		addResourceDict : function(a) {
			XN.Sys.add(XN.UI.DomResources._dicts, a)
		},
		getResourceById : function(e) {
			var d = XN.UI.DomResources._dicts.length;
			var b;
			for ( var a = 0; a < d; a++) {
				b = ((XN.UI.DomResources._dicts[a])).getClonedElement(e);
				if (b) {
					return b
				}
			}
			return null
		}
	}
});
XN.UI.DomResDict = XN.Type
		.createClass( {
			ctor : function(a) {
				this._docFragment = document.createDocumentFragment();
				var b = document.createElement("div");
				b.innerHTML = a;
				this._docFragment.appendChild(b)
			},
			statics : {
				_getElementInFragment : function(a, g) {
					if (XNIntern.AppInfo.get_singleton().get_hostInfo()
							.get_hostName() === XNIntern.HostName.IE) {
						return a.getElementById(g)
					} else {
						var d = [];
						var e = a.childNodes;
						var b;
						var f;
						for (f = 0; f < e.length; f++) {
							b = e[f];
							if (b.nodeType == 1) {
								d[d.length] = b
							}
						}
						while (d.length) {
							b = d.shift();
							if (b.id == g) {
								return b
							}
							e = b.childNodes;
							if (e.length != 0) {
								for (f = 0; f < e.length; f++) {
									b = e[f];
									if (b.nodeType == 1) {
										d.push(b)
									}
								}
							}
						}
						return null
					}
				}
			},
			instance : {
				getClonedElement : function(b) {
					var a = XN.UI.DomResDict._getElementInFragment(
							this._docFragment, "RES_ID_" + b);
					if (a) {
						return a.cloneNode(true)
					} else {
						return null
					}
				},
				_docFragment : null
			}
		});
XN.$create_SessionRecord = function XN_SessionRecord(f, e, b, a, c, g) {
	var d = {};
	d.session_key = f;
	d.uid = e;
	d.expires = b;
	d.secret = a;
	d.sig = g;
	d.base_domain = c;
	return d
};
XN.ApiClient = XN.Type
		.createClass( {
			ctor : function(c) {
				this._sessionWaitable = new XN.SimpleWaitable();
				this._apiKey = c;
				if (!XN.Main.apiKey) {
					XN.Main.apiKey = c
				}
				var b = XNIntern.Utility.getNonConnectServerUrl("api");
				this._serverAddress = b + "restserver.do";
				this._isLoggedIn = window.location.href.match("xn_sig_user") != null;
				var a = XN.ApiClient._getSessionFromUrl(document.URL);
				if (!a) {
					if (XN.Main.get_isInCanvas() && !this._isLoggedIn) {
						this._setSessionCookies(null)
					} else {
						a = this._getSessionFromCookies()
					}
				}
				if (a && !XN.ApiClient.sessionIsExpired(a)) {
					this.set_session(a)
				}
			},
			static_ctor : function() {
				XN.ApiClient.createSessionDelegate = XN.ApiClient.defaultCreateSession;
				var a = [ "connect_getUnconnectedFriendsCount",
						"feed_publishUserAction",
						"feed_publishTemplatizedAction", "feed_publish",
						"feed_getFeedList", "friends_get",
						"friends_getFriends", "friends_areFriends",
						"friends_getAppUsers", "friends_getAppFriends",
						"notifications_send", "notifications_sendEmail",
						"users_getInfo", "users_getLoggedInUser",
						"users_hasAppPermission", "users_isAppAdded",
						"profile_setXNML", "blog_addComment",
						"blog_getComments", "photos_getComments",
						"photos_addComment", "photos_get", "profile_getXNML",
						"connect_getStatusFeeds", "connect_getEvents",
						"status_set", "status_getComment",
						"status_getEmoticons", "status_gets",
						"status_addComment" ];
				for ( var b = 0; b < a.length; b++) {
					XN.ApiClient.prototype[a[b]] = function() {
						var c = arguments;
						XN_RequireFeatures( [ "Api" ], function() {
							XN.Main.apiClient[c.callee.restMethod].apply(
									XN.Main.apiClient, c)
						})
					};
					XN.ApiClient.prototype[a[b]].restMethod = a[b]
				}
			},
			statics : {
				sessionIsExpired : function(a) {
					if (!a.expires) {
						return false
					} else {
						if (a.expires !== undefined) {
							var b = Math.round((new Date()).getTime() / 1000);
							var d = a.expires;
							var c = !(d > b);
							return c
						}
					}
					return true
				},
				defaultCreateSession : function(a, b) {
					window.location = a._createLoginUrl()
				},
				getSessionFromSigParams : function(c) {
					var n = "xn_sig_session_key";
					var b = "xn_sig_user";
					var m = "xn_sig_expires";
					var i = "xn_sig_ss";
					var h = "xn_sig";
					var k = "xn_sig_base_domain";
					if (XN.Sys.containsKey(c, n) && XN.Sys.containsKey(c, b)
							&& XN.Sys.containsKey(c, m)
							&& XN.Sys.containsKey(c, i)
							&& XN.Sys.containsKey(c, h)) {
						var f = c[h];
						var a = c[b];
						var d = c[i];
						var g = c[n];
						var e = parseInt(c[m]);
						var j = c[k];
						if (f && a && d && g && e !== -1) {
							var l = XN.$create_SessionRecord(g, a, e, d, j, f);
							return l
						}
					}
					return null
				},
				_getSessionFromUrl : function(b) {
					var c = "session";
					var d = new XNIntern.Uri(b);
					if (XN.Sys.containsKey(d.get_queryParameters(), c)) {
						var a = d.get_queryParameters()[c];
						return XNIntern.JSON.deserialize(a)
					}
					return XN.ApiClient.getSessionFromSigParams(d
							.get_queryParameters())
				}
			},
			instance : {
				get_session : function() {
					return this._session
				},
				set_session : function(a) {
					if (a !== this._session) {
						this._session = a;
						if (this._session) {
							XN.Main.set_baseDomain(this._session.base_domain)
						}
						this._setSessionCookies(a);
						this._sessionWaitable.setResult(a, !a)
					}
					return a
				},
				get_sessionWaitable : function() {
					return this._sessionWaitable
				},
				requireLogin : function(a) {
					if (this._session) {
						if (a) {
							a(null)
						}
					} else {
						XN.ApiClient.createSessionDelegate(this, XN.Delegate
								.create(this, function(b) {
									XN.Debug.assert(b,
											"Invalid session returned");
									this._session = b
								}))
					}
				},
				_getSessionFromCookies : function() {
					var f = XNIntern.Cookie.getValue(this._apiKey);
					var e = XNIntern.Cookie.getValue(this._apiKey + "_user");
					var a = XNIntern.Cookie.getValue(this._apiKey + "_ss");
					var b = XNIntern.Cookie.getValue(this._apiKey
							+ "_session_key");
					var c = parseInt(XNIntern.Cookie.getValue(this._apiKey
							+ "_expires"));
					if (f && e && a && b && c !== -1) {
						var d = XN.$create_SessionRecord(b, e, c, a, XN.Main
								.get_baseDomain(), f);
						return d
					}
					return null
				},
				_setSessionCookies : function(a) {
					if (a && a.expires !== undefined && a.secret
							&& a.session_key && a.uid && a.sig) {
						XNIntern.Cookie.set(this._apiKey, a.sig, "/", XN.Main
								.get_baseDomain(), 0);
						XNIntern.Cookie.set(this._apiKey + "_user", a.uid, "/",
								XN.Main.get_baseDomain(), 0);
						XNIntern.Cookie.set(this._apiKey + "_ss", a.secret,
								"/", XN.Main.get_baseDomain(), 0);
						XNIntern.Cookie
								.set(this._apiKey + "_session_key",
										a.session_key, "/", XN.Main
												.get_baseDomain(), 0);
						XNIntern.Cookie.set(this._apiKey + "_expires",
								a.expires.toString(), "/", XN.Main
										.get_baseDomain(), 0)
					} else {
						if (!a) {
							XNIntern.Cookie.clear(this._apiKey, "/", XN.Main
									.get_baseDomain());
							XNIntern.Cookie.clear(this._apiKey + "_user", "/",
									XN.Main.get_baseDomain());
							XNIntern.Cookie.clear(this._apiKey + "_ss", "/",
									XN.Main.get_baseDomain());
							XNIntern.Cookie.clear(
									this._apiKey + "_session_key", "/", XN.Main
											.get_baseDomain());
							XNIntern.Cookie.clear(this._apiKey + "_expires",
									"/", XN.Main.get_baseDomain())
						}
					}
				},
				_createLoginUrl : function() {
					var a = XNIntern.Utility.getLoginoutUrl("login");
					var b = {
						return_session : 1,
						nochrome : 1,
						xnconnect : 1,
						connect_display : "popup",
						api_key : this._apiKey,
						v : XN.Main.version,
						next : document.URL,
						cancel_url : document.URL,
						channel_url : XN.XdComm.Server.singleton
								.get_receiverUrl()
					};
					if (XN.Sys.containsKey(XN.Main.appSettings,
							"permsToRequestOnConnect")) {
						b.req_perms = XN.Main.appSettings.permsToRequestOnConnect
					}
					a = XNIntern.Uri.addQueryParameters(a, XNIntern.Uri
							.createQueryString(b));
					return a
				},
				_refreshSession : function(e) {
					var a = XNIntern.Utility.getConnectServerUrl("www")
							+ "session_state.do";
					var c = "api_key="
							+ this._apiKey.toString()
							+ "&session_key="
							+ ((!this._session) ? "null"
									: this._session.session_key.toString());
					var d = {};
					d["Content-Type"] = "application/x-www-form-urlencoded";
					var b = new XN._xdJsonRequest(this.getXdHttpClient(),
							"POST", a, c, d);
					b.callback = XN.Delegate
							.create(
									this,
									function(f, g) {
										if (f) {
											var h = f;
											if (!h.error) {
												this._session = h.session;
												this
														._setSessionCookies(this._session);
												if (e) {
													e(null)
												}
											} else {
												if (h.error === -1) {
													XN.Debug
															.assert(false,
																	"User has not authorized the application.")
												} else {
													if (h.error === -2) {
														XN.Debug
																.assert(
																		false,
																		"User is not logged into "
																				+ Connect_Config.mainsite_name
																				+ ".")
													} else {
														if (h.error === -3) {
															XN.Debug
																	.assert(
																			false,
																			"Unknown error while refreshing user session.")
														}
													}
												}
											}
										}
									});
					b.sendRequest()
				},
				get_apiKey : function() {
					return this._apiKey
				},
				getXdHttpClient : function() {
					if (this._xdHttpClient) {
						return this._xdHttpClient
					}
					var b = XNIntern.Utility.getNonConnectServerUrl("api");
					var a = b
							+ "static/client_restserver.html?r="
							+ XNIntern.XNGlobals
									.get_xn_StaticResourceVersions()["api_server"];
					var c = b
							+ "static/xd_receiver.html?r="
							+ XNIntern.XNGlobals
									.get_xn_StaticResourceVersions()["api_channel"];
					if (XN.Debug.logLevel > 0) {
						a = XNIntern.Uri.addQueryParameters(a, "debug_level="
								+ XN.Debug.logLevel.toString())
					}
					XN.Debug.logLine(2,
							"XN.ApiClient constructor: api xdServerUrl = " + a);
					this._xdHttpClient = new XN._xdHttpRequestClient(a, c,
							"xn_api_server");
					return this._xdHttpClient
				},
				_apiKey : null,
				_session : null,
				_serverAddress : null,
				_lastCallId : 0,
				_xdHttpClient : null,
				_isLoggedIn : false
			}
		});
XN.Main = XN.Type
		.createClass( {
			ctor : function() {
			},
			static_ctor : function() {
				XN.Main.apiKey = null;
				XN.Main.apiClient = null;
				XN.Main.appSecret = null;
				XN.Main.version = "1.0";
				XN.Main.__initCalled = null;
				XN.Main.appSettings = {};
				XN.Main._initialized = null;
				XN.Main._baseDomain = null;
				XN.Main._isBaseDomainInitialized = false;
				XN.Main._isInCanvas = -1;
				XN.Main._isInitialNoSession = false;
				XN.Main._publicSessionData = new XN.SimpleWaitable()
			},
			statics : {
				init : function(c, b, a) {
					if (typeof (c) === "object" && !b && !a) {
						a = arguments[0];
						c = null;
						b = null
					}
					if (XN.Main.apiClient) {
						XN.Debug
								.writeLine("Error: XN.Main.init() has already been called.")
					} else {
						XN.Main.apiKey = (c) ? c : a.apiKey;
						if (!XN.Main.apiKey) {
							XN.Debug.logLine(0, "API Key is not specified");
							throw new Error("API Key is not specified")
						}
						if (!b && a) {
							b = a.xdChannelUrl
						}
						XN.XdComm.Server.singleton.set_receiverUrl(b);
						XN.Main.apiClient = new XN.ApiClient(XN.Main.apiKey);
						XN.Main._isInitialNoSession = !XN.Main
								.get_sessionState().result;
						if (a) {
							XN.Main.appSettings = a;
							XN.Main._processOptionalAppSettings()
						}
						XN.Debug.logLine(2, "Starting XN.Main.init()...");
						(XN.Main.get_initialized()).setResult(true)
					}
					if (XN.Main.__initCalled) {
						XN.Main.__initCalled()
					}
					XN.Connect
							.get_status()
							.waitUntilReady(
									function(d) {
										var e = new XNIntern.Uri(document.URL);
										if (e.get_queryParameters()["xnc"] === "1"
												&& d === XN.ConnectState.appNotAuthorized) {
											XN_RequireFeatures(
													[ "Expose" ],
													function() {
														XNIntern.Expose
																.shadow();
														XN.Connect
																.requireSession(XNIntern.Expose.clearShadow)
													})
										}
									});
					if (!XN.FeatureLoader.singleton
							.isFeatureRequestedAndLoaded("EXNML")
							&& ((document.namespaces && document.namespaces.xn) || document.documentElement
									.hasAttribute("xmlns:xn"))) {
						XN_RequireFeatures( [ "EXNML" ], function() {
							XN.EXNML.Context.singleton.init()
						})
					}
				},
				_reloadIfSessionStateChanged : function() {
					XN.Main
							.get_sessionWaitable()
							.add_changed(
									function(a) {
										window
												.setTimeout(
														function() {
															var b = !a.result;
															if (b !== XN.Main._isInitialNoSession
																	&& XN.Main.appSettings.reloadIfSessionStateChanged) {
																XN.Debug
																		.logLine(
																				3,
																				"reloading ...");
																window
																		.setTimeout(
																				function() {
																					window.location
																							.reload(true)
																				},
																				0)
															}
														}, 0)
									})
				},
				_processOptionalAppSettings : function() {
					var b = XN.Main.appSettings;
					for ( var a in b) {
						var c = {
							key : a,
							value : b[a]
						};
						switch (c.key) {
						case "debugLogLevel":
							XN.Debug.logLevel = c.value;
							break;
						case "apiKey":
						case "xdChannelUrl":
						case "fetchSignedPublicSessionData":
						case "ifUserConnected":
						case "ifUserNotConnected":
						case "doNotUseCachedConnectState":
						case "permsToRequestOnConnect":
						case "delayCookieOnClick":
						case "acceptCookie":
						case "forceLoginPopup":
							break;
						case "reloadIfSessionStateChanged":
							XN.Main._reloadIfSessionStateChanged();
							break;
						default:
							XN.Debug.logLine(1, "Invalid app setting key: "
									+ c.key);
							break
						}
					}
					if (XN.Main.appSettings.ifUserConnected
							|| XN.Main.appSettings.ifUserNotConnected) {
						XN.Connect.ifUserConnectedAppSetting(
								XN.Main.appSettings.ifUserConnected,
								XN.Main.appSettings.ifUserNotConnected)
					}
				},
				get_sessionState : function() {
					return XN.Main.get_sessionWaitable()
				},
				get_sessionWaitable : function() {
					XN.Debug.assert(XN.Main.apiClient,
							"XN.Main.init() is not called yet");
					return XN.Main.apiClient.get_sessionWaitable()
				},
				get_initialized : function() {
					if (!XN.Main._initialized) {
						XN.Main._initialized = new XN.SimpleWaitable()
					}
					return XN.Main._initialized
				},
				get_baseDomain : function() {
					if (!XN.Main._isBaseDomainInitialized) {
						if (XN.Main.apiKey) {
							XN.Main._baseDomain = XNIntern.Cookie
									.getValue("base_domain_" + XN.Main.apiKey)
						} else {
							throw new Error(
									"Can't get BaseDomain property when API key is not set")
						}
					}
					return XN.Main._baseDomain
				},
				set_baseDomain : function(b) {
					XN.Main._isBaseDomainInitialized = true;
					if (XN.Sys.isNullOrEmpty(b)) {
						XN.Main._baseDomain = null
					} else {
						XN.Main._baseDomain = b
					}
					if (XN.Main.apiKey) {
						var a = "base_domain_" + XN.Main.apiKey;
						if (!XN.Main._baseDomain) {
							XNIntern.Cookie.clear(a, "/", null)
						} else {
							XNIntern.Cookie.set(a, XN.Main._baseDomain, "/",
									XN.Main._baseDomain, 0)
						}
					} else {
						throw new Error(
								"Can't set BaseDomain property when api key is set")
					}
					return b
				},
				get_isInCanvas : function() {
					if (XN.Main._isInCanvas === -1) {
						XN.Main._isInCanvas = (window.parent != window && window.location.href
								.match("xn_sig_in_iframe=1") != null) ? 1 : 0
					}
					return XN.Main._isInCanvas === 1
				},
				add_initCalled : function(a) {
					XN.Main.__initCalled = XN.Delegate.combine(
							XN.Main.__initCalled, a)
				},
				remove_initCalled : function(a) {
					XN.Main.__initCalled = XN.Delegate.remove(
							XN.Main.__initCalled, a)
				}
			}
		});
XN.FeatureLoader.onScriptLoaded( [ "Common" ]);
XN.Type.createNamespace("XN.XdComm");
XN.$create_XdHttpRequestResult = function XN_XdHttpRequestResult(e, a, d, c) {
	var b = {};
	b.status = a;
	b.statusText = d;
	b.responseText = c;
	b.id = e;
	return b
};
XN.XdComm.$create__packet = function XN_XdComm__packet() {
	return {}
};
XN.XdComm._packetType = XN.Type.createEnum( {
	data : 0,
	dataFragment : 1,
	dataFragmentEnd : 2,
	udpSingle : 3,
	ack : 4
}, false);
XN.XdComm.PacketDataFormat = XN.Type.createEnum( {
	JSON : 0,
	rawText : 1,
	OBJ : 2
}, false);
XN.XdComm.PageRelation = XN.Type.createEnum( {
	parent : 1,
	child : 2,
	self : 3,
	opener : 4,
	openee : 5
}, false);
XN.XdComm.$create_XdRpcMethodInfo = function XN_XdComm_XdRpcMethodInfo(c, b) {
	var a = {};
	XN.Debug
			.assert((!c) ^ (!b),
					"One and only one of method or asyncMethod parameters must not be null.");
	a.method = c;
	a.asyncMethod = b;
	return a
};
XN.XdComm._receiveChannel = XN.Type
		.createClass( {
			ctor : function(b, a) {
				this._fragDataDict = {};
				this._ackList = [];
				this._id = b;
				this._endPoint = a
			},
			instance : {
				_onReceivedPacket : function(d) {
					XN.Debug.logLine(3, "XdComm: Received packet, packet.t = "
							+ d.t + ", packet.id = " + d.id);
					var e = null;
					if (d.t === XN.XdComm._packetType.dataFragment
							|| d.t === XN.XdComm._packetType.dataFragmentEnd) {
						var a = this._fragDataDict[d.id.toString()];
						if (!a) {
							a = new XN.XdComm._fragDataHolder();
							this._fragDataDict[d.id.toString()] = a
						}
						e = a._addSegment(d);
						if (e) {
							delete this._fragDataDict[e.id.toString()]
						}
					} else {
						e = d
					}
					if (e) {
						if (!e.id) {
							XN.Debug.logLine(3,
									"XdComm: received the id=0 packet!");
							this._endPoint = new XN.XdComm.EndPoint(e.sf, e.sr,
									e.sc);
							if (this._queuedPackets) {
								var b = new XN.ArrayEnumerator(
										this._queuedPackets);
								while (b.moveNext()) {
									var c = b.get_current();
									XN.Debug.logLine(5,
											"XdComm: process queued packet, queuedPacket.t = "
													+ c.t
													+ ", queuedPacket.id = "
													+ c.id);
									this._onFullDataReceived(c)
								}
								this._queuedPackets = null
							}
						}
						if (this._endPoint) {
							this._onFullDataReceived(e)
						} else {
							if (!this._queuedPackets) {
								this._queuedPackets = []
							}
							XN.Debug
									.logLine(5,
											"XdComm: add to queued packet list, fullPacket.t = "
													+ e.t
													+ ", fullPacket.id = "
													+ e.id);
							XN.Sys.add(this._queuedPackets, e)
						}
					}
				},
				_onFullDataReceived : function(d) {
					XN.Debug.logLine(3,
							"XdComm: _onFullDataReceived packet.t = " + d.t
									+ ", packet.id = " + d.id);
					var c = XN.XdComm.Server.singleton;
					c._onFullDataReceived(d, this._endPoint);
					XN.Sys.add(this._ackList, d.id);
					XN.Debug.logLine(4, "XdComm: ack list length = "
							+ this._ackList.length);
					if (this._ackList.length > 5) {
						XN.Debug.logLine(5, "ReceiveChannel.Ack: "
								+ this._ackList.toString());
						var b = XN.XdComm.$create__packet();
						b.t = XN.XdComm._packetType.ack;
						b.sid = c._id;
						b.sc = c.get_receiverUrl();
						b.sf = window.name;
						b.sr = XN.XdComm._sendChannel
								._getReverseRelation(this._endPoint.relation);
						var a = c._createPacketUrl(b, this._endPoint);
						a += encodeURIComponent(XNIntern.JSON
								.serialize(this._ackList));
						c._removeIframe(this._ackIframe);
						this._ackIframe = c._createHiddenIFrame(a);
						XN.Sys.clear(this._ackList)
					}
				},
				_queuedPackets : null,
				_endPoint : null,
				_ackIframe : null,
				_id : null
			}
		});
XN.XdComm._fragDataHolder = XN.Type.createClass( {
	ctor : function() {
		this._segments = {};
		this._totalSegments = -1
	},
	instance : {
		_addSegment : function(c) {
			if (c.t === XN.XdComm._packetType.dataFragmentEnd) {
				this._totalSegments = c.fid + 1
			}
			if (!c.fid) {
				this._combinedPacket = c
			}
			this._segments[c.fid.toString()] = c.d;
			if (this._totalSegments !== -1
					&& this._totalSegments === XN.Sys
							.getKeyCount(this._segments)) {
				var a = new XN.StringBuilder();
				for ( var b = 0; b < this._totalSegments; b++) {
					a.append(this._segments[b.toString()])
				}
				this._combinedPacket.d = a.toString();
				this._combinedPacket.t = XN.XdComm._packetType.data;
				return this._combinedPacket
			} else {
				return null
			}
		},
		_combinedPacket : null
	}
});
XN.XdComm._sendChannel = XN.Type.createClass( {
	ctor : function(a) {
		this._iframes = {};
		this._endPoint = a
	},
	statics : {
		_getReverseRelation : function(a) {
			switch (a) {
			case XN.XdComm.PageRelation.child:
				return XN.XdComm.PageRelation.parent;
			case XN.XdComm.PageRelation.parent:
				return XN.XdComm.PageRelation.child;
			case XN.XdComm.PageRelation.self:
				return XN.XdComm.PageRelation.self;
			default:
				throw new Error("Unknown relation")
			}
		}
	},
	instance : {
		_send : function(g, i) {
			var f = XN.XdComm.Server.singleton;
			var b = XNIntern.JSON.serialize(i);
			var d = b.length;
			var h = 0;
			var j = false;
			var e = 0;
			while (!j) {
				var k = XN.XdComm._packetType.data;
				var c = XN.XdComm.$create__packet();
				c.id = this._sendIdCount;
				if (!this._sendIdCount && !h) {
					c.sc = f.get_receiverUrl();
					c.sf = window.name;
					c.sr = XN.XdComm._sendChannel
							._getReverseRelation(this._endPoint.relation)
				}
				if (!h) {
					c.h = g
				}
				var a;
				if (!h && d <= f._maxPacketDataLength) {
					a = b;
					j = true
				} else {
					c.fid = e++;
					var m = d - h;
					if (m > f._maxPacketDataLength) {
						m = f._maxPacketDataLength;
						k = XN.XdComm._packetType.dataFragment
					} else {
						k = XN.XdComm._packetType.dataFragmentEnd;
						j = true
					}
					a = b.substr(h, m);
					h += m
				}
				c.sid = f._id;
				c.t = k;
				var l = f._createPacketUrl(c, this._endPoint);
				XN.Debug.logLine(4,
						"XN.XdComm._sendChannel._send: packet url = "
								+ decodeURIComponent(l));
				l += encodeURIComponent(a);
				XN.Debug.logLine(4,
						"XN.XdComm._sendChannel._send: iframeSrc = "
								+ decodeURIComponent(l));
				this._addIframe(l, c)
			}
			this._sendIdCount++
		},
		_onAck : function(g) {
			XN.Debug.logLine(5, "SendChannel.OnAck: " + g.toString());
			var e = new XN.ArrayEnumerator(g);
			while (e.moveNext()) {
				var a = e.get_current();
				var b = a.toString();
				var f = this._iframes[b];
				var d = new XN.ArrayEnumerator(f);
				while (d.moveNext()) {
					var c = d.get_current();
					XN.XdComm.Server.singleton._removeIframe(c)
				}
				delete this._iframes[b]
			}
		},
		_addIframe : function(e, d) {
			var b = XN.XdComm.Server.singleton._createHiddenIFrame(e);
			var a = d.id.toString();
			var c = this._iframes[a];
			if (!c) {
				this._iframes[a] = c = []
			}
			XN.Sys.add(c, b)
		},
		_sendIdCount : 0,
		_endPoint : null
	}
});
XN.XdComm.EndPoint = XN.Type.createClass( {
	ctor : function(a, b, c) {
		this.frameName = (!a) ? "" : a;
		this.relation = b;
		this.channelUrl = c;
		this.UID = 0
	},
	instance : {
		isEqual : function(a) {
			return a.frameName === this.frameName
					&& a.relation === this.relation && a.UID === this.UID
		},
		frameName : null,
		relation : 0,
		channelUrl : null,
		UID : 0,
		origin : null
	}
});
XN.XdComm.Server = XN.Type
		.createClass( {
			ctor : function() {
				this._sendChannels = [];
				this._receiveChannels = [];
				this._handlers = {};
				this._dataRequestQueues = {};
				this._nativeXdState = -1;
				this._nativeMsgsSendQueue = {};
				this._nativeMsgsReceiveQueue = {};
				this._id = Math.random().toString().substr(0, 5);
				XN.Debug.logLine(2, "Init XdComm.Server with ID " + this._id
						+ " for " + document.URL);
				switch (XNIntern.AppInfo.get_singleton().get_hostInfo()
						.get_hostName()) {
				case XNIntern.HostName.IE:
					this._maxPacketDataLength = 1024;
					break;
				case XNIntern.HostName.MOZILLA:
					this._maxPacketDataLength = 100000;
					break;
				case XNIntern.HostName.SAFARI:
					this._maxPacketDataLength = 100000;
					break;
				case XNIntern.HostName.OPERA:
					this._maxPacketDataLength = 190000;
					break;
				default:
					this._maxPacketDataLength = 1024;
					break
				}
				if (this.get__hasNativeXd()) {
					XNIntern.Utility.addEventListener(window.self, "message",
							XN.Delegate.create(this, this._onMessageEvent))
				}
			},
			static_ctor : function() {
				XN.XdComm.Server.singleton = new XN.XdComm.Server();
				XN.XdComm.Server.postMessageHeader = "XN_msg:";
				XN.XdComm.Server.postMessageAckHeader = "XN_msg_ack:"
			},
			statics : {
				init : function(a) {
					XN.XdComm.Server.singleton.set_receiverUrl(a)
				}
			},
			instance : {
				get_receiverUrl : function() {
					return this._receiverUrl
				},
				set_receiverUrl : function(b) {
					if (!b) {
						XN.Debug
								.logLine(
										0,
										"Cross Domain Channel cannot be null. We will use the current page as cross domain channel, but it would be inefficient");
						b = XN.Bootstrap.createDefaultXdChannelUrl()
					}
					var a = XNIntern.Uri.create(new XNIntern.Uri(document.URL),
							b);
					if (window.location.hostname !== document.domain) {
						XN.Debug
								.logLine(
										2,
										"You appear to have changed the document.domain property.\nIf you run into problems with the Connect library, please refer to\n todo for\nhelp.")
					}
					this._receiverUrl = a.get_uriString();
					return b
				},
				send : function(b, a, c) {
					if (XN.Debug.logLevel > 2) {
						XN.Debug.writeLine("Server.send: handler=" + a);
						XN.Debug.dump(c, "data");
						XN.Debug.dump(b, "endPoint")
					}
					if (this.get__hasNativeXd()
							&& XN.Bootstrap.siteVars.use_postMessage) {
						this._postMessage(b, a, c)
					} else {
						this._sendWithIframe(b, a, c)
					}
				},
				_sendWithIframe : function(b, a, f) {
					var e = null;
					var d = new XN.ArrayEnumerator(this._sendChannels);
					while (d.moveNext()) {
						var c = d.get_current();
						if (b.isEqual(c._endPoint)) {
							e = c
						}
					}
					if (!e) {
						e = new XN.XdComm._sendChannel(b);
						XN.Sys.add(this._sendChannels, e)
					}
					e._send(a, f)
				},
				_postMessage : function(g, c, f) {
					var a = XN.XdComm.$create__packet();
					a.sc = this.get_receiverUrl();
					a.sf = window.name;
					a.sr = XN.XdComm._sendChannel
							._getReverseRelation(g.relation);
					a.h = c;
					a.nd = f;
					a.df = XN.XdComm.PacketDataFormat.OBJ;
					a.id = this._nativeMsgId;
					a.sid = this._id;
					this._nativeMsgId++;
					var b;
					switch (g.relation) {
					case XN.XdComm.PageRelation.child:
						b = window.frames[g.frameName];
						break;
					case XN.XdComm.PageRelation.opener:
						b = window.opener;
						break;
					case XN.XdComm.PageRelation.parent:
						b = window.parent;
						break;
					default:
						throw new Error(
								"Can't send message to endpoint with type = "
										+ XN.Enum.toString(
												XN.XdComm.PageRelation,
												g.relation))
					}
					var j = XN.XdComm.Server.postMessageHeader
							+ XNIntern.JSON.serialize(a);
					var h = (g.origin) ? g.origin : "*";
					var i = 1;
					var d = -1;
					var e = XN.Delegate.create(this, function() {
						XN.Debug.logLine(2, "Send with native postMessage: "
								+ i.toString() + "rd try");
						i++;
						if (i < 100) {
							b.postMessage(j, h)
						} else {
							window.clearInterval(d);
							XN.Debug.logLine(0,
									"Message couldn't be delivered: msg=" + j);
							delete this._nativeMsgsSendQueue[a.id.toString()]
						}
					});
					e();
					d = window.setInterval(e, 500);
					this._nativeMsgsSendQueue[a.id.toString()] = d
				},
				_onMessageEvent : function(h) {
					var k = h.data;
					if (!k.indexOf(XN.XdComm.Server.postMessageHeader)) {
						k = k.substr(XN.XdComm.Server.postMessageHeader.length);
						var a = XNIntern.JSON.deserialize(k);
						var j = new XNIntern.Uri(h.origin);
						var d = new XNIntern.Uri(a.sc);
						var g = XN.XdComm.Server.postMessageAckHeader + a.sid
								+ a.id.toString();
						((h.source)).postMessage(g, h.origin);
						var b = a.sid + a.id.toString();
						if (!this._nativeMsgsReceiveQueue[b]) {
							this._nativeMsgsReceiveQueue[b] = true;
							var f = new XN.XdComm.EndPoint(a.sf, a.sr, a.sc);
							this._ensureReceiveChannel(a.sid, f);
							this._onFullDataReceived(a, f)
						}
					} else {
						if (!k.indexOf(XN.XdComm.Server.postMessageAckHeader)) {
							k = k
									.substr(XN.XdComm.Server.postMessageAckHeader.length);
							if (!k.indexOf(this._id)) {
								var i = parseInt(k.substr(this._id.length));
								var c = this._nativeMsgsSendQueue[i.toString()];
								if (c) {
									delete this._nativeMsgsSendQueue[i
											.toString()];
									window.clearInterval(c)
								}
							} else {
								XN.Debug
										.logLine(0,
												"Ignore XdComm Ack message because send id does not match")
							}
						}
					}
				},
				createUdpUrl : function(a, c, b) {
					return this._createUdpUrlWithFormat(a, c, b,
							XN.XdComm.PacketDataFormat.JSON)
				},
				createUdpUrlWithRawText : function(a, c, b) {
					return this._createUdpUrlWithFormat(a, c, b,
							XN.XdComm.PacketDataFormat.rawText)
				},
				_createUdpUrlWithFormat : function(c, e, d, g) {
					var f = XN.XdComm.$create__packet();
					f.t = XN.XdComm._packetType.udpSingle;
					f.h = c;
					f.sid = this._id;
					if (g !== XN.XdComm.PacketDataFormat.JSON) {
						f.df = g
					}
					var b = this._createPacketUrl(f, d);
					var a = XNIntern.JSON.serialize(e);
					if (a.length > this._maxPacketDataLength) {
						throw new Error("data length is too long")
					}
					b += encodeURIComponent(a);
					return b
				},
				unregisterDataHandler : function(a) {
					XN.Debug.logLine(2, "Unregister data handler " + a);
					if (!XN.Sys.containsKey(this._handlers, a)) {
						throw new Error("Handler doesn't exist")
					}
					delete this._handlers[a]
				},
				registerDataHandler : function(b, e) {
					XN.Debug.logLine(2, "Register data handler " + b);
					if (XN.Sys.containsKey(this._handlers, b)) {
						throw new Error("Handler already exists")
					}
					this._handlers[b] = e;
					var a = this._dataRequestQueues[b];
					if (a) {
						var g = new XN.ArrayEnumerator(a);
						while (g.moveNext()) {
							var h = g.get_current();
							XN.Debug.logLine(2, "handle queued request");
							var c = null;
							var d = new XN.ArrayEnumerator(
									this._receiveChannels);
							while (d.moveNext()) {
								var f = d.get_current();
								if (f._id === h.sid) {
									c = f._endPoint;
									break
								}
							}
							XN.Debug.assert(c, "can't find endpoint");
							e(this._getDataObject(h), c)
						}
					}
				},
				isDataHandlerRegistered : function(a) {
					return this._handlers[a]
				},
				get_hiddenIFrameContainer : function() {
					if (!this._hiddenIframeContainer) {
						this._hiddenIframeContainer = document
								.getElementById("XN_HiddenContainer");
						XN.Debug
								.assert(this._hiddenIframeContainer,
										"Can't find the DOM element with id XN_HiddenContainer")
					}
					return this._hiddenIframeContainer
				},
				createNamedHiddenIFrameForIE : function(a, f, d, c) {
					XN.Debug.logLine(2, "Create Named Hidden Iframe: name = "
							+ a + "; src = " + decodeURIComponent(f));
					var e = document.createElement("div");
					e = XN.XdComm.Server.singleton.get_hiddenIFrameContainer()
							.appendChild(e);
					if (!this._iframeCreated
							&& XNIntern.AppInfo.get_singleton().get_hostInfo()
									.get_hostName() === XNIntern.HostName.IE) {
						e.innerHTML = "<iframe src='javascript:false' ></iframe>";
						this._iframeCreated = true
					}
					if (!d) {
						d = "XN_SERVER_IFRAME"
					}
					var b = '<iframe name="' + a + '" ';
					if (c) {
						b += c
					}
					b += ' src="' + f + '" class="' + d
							+ '" scrolling="no" frameborder="0"></iframe>';
					e.innerHTML = b;
					XN.Debug.logLine(2,
							"Create Named Hidden Iframe: iframe_markup = " + b);
					return e.childNodes[0]
				},
				createNamedHiddenIFrame : function(a, e, d, c) {
					XN.Debug.logLine(2, "Create Named Hidden Iframe: name = "
							+ a + "; src = " + decodeURIComponent(e));
					var b = document.createElement("iframe");
					b.src = e;
					if (a) {
						b.name = a
					}
					b.style.position = "absolute";
					b.style.visibility = "hidden";
					b.style.width = "1px";
					b.style.height = "1px";
					if (d) {
						b.className = d
					}
					document.body.appendChild(b);
					return b
				},
				createNamedIFrameDomNode : function(a, f, d, c) {
					var e = document.createElement("div");
					if (!this._iframeCreated
							&& XNIntern.AppInfo.get_singleton().get_hostInfo()
									.get_hostName() === XNIntern.HostName.IE) {
						e.innerHTML = "<iframe src='javascript:false' ></iframe>";
						this._iframeCreated = true
					}
					if (!d) {
						d = "XN_SERVER_IFRAME"
					}
					var b = '<iframe name="' + a + '" ';
					if (c) {
						b += c
					}
					b += ' src="' + f + '" class="' + d
							+ '" scrolling="no" frameborder="0"></iframe>';
					e.innerHTML = b;
					return e.childNodes[0]
				},
				onReceiverLoaded : function(a) {
					XN.Debug.logLine(2,
							"CROSS DOMAIN receiver: onReceiverLoaded");
					if (a) {
						window.setTimeout(XN.Delegate.create(this, function() {
							this._onHashReceived(a)
						}), 0)
					}
				},
				_createPacketUrl : function(b, a) {
					var d = XNIntern.JSON.serialize(b);
					XN.Debug.logLine(4, "_createPacketUrl: serializedPacket = "
							+ d);
					d = encodeURIComponent(d);
					if (a.channelUrl.indexOf("http")) {
						throw new Error("Invalid channel url " + a.channelUrl)
					}
					var c = a.channelUrl + "#";
					if (XN.Debug.logLevel > 4) {
						c += "debug=1&"
					}
					if (a.relation === XN.XdComm.PageRelation.child) {
						XN.Debug
								.assert(
										a.frameName,
										"XdComm.Server.CreatePacketUrl: end point does not have child name name specified");
						c += "fname=" + a.frameName + "&"
					} else {
						if (a.relation === XN.XdComm.PageRelation.self) {
							c += "fname=_parent&"
						} else {
							if (a.relation === XN.XdComm.PageRelation.opener) {
								c += "fname=_opener&"
							} else {
								if (a.relation === XN.XdComm.PageRelation.openee) {
									throw new Error("Can't handle endPoint "
											+ XN.Enum.toString(
													XN.XdComm.PageRelation,
													a.relation))
								}
							}
						}
					}
					c += d;
					return c
				},
				_createHiddenIFrame : function(b) {
					XN.Debug.logLine(2, "Create unamed hidden iframe "
							+ decodeURIComponent(b));
					var a = null;
					return XN.XdComm.Server.singleton.createNamedHiddenIFrame(
							a, b)
				},
				_removeIframe : function(a) {
					if (XN.Debug.logLevel > 4) {
						XN.Debug.writeLine("Remove iframe in " + document.URL)
					}
					if (a) {
						var b = a.parentNode;
						if (b) {
							b.removeChild(a)
						}
					}
				},
				_onHashReceived : function(g) {
					if (XN.Debug.logLevel > 3) {
						XN.Debug.writeLine(">>>>>> " + document.URL);
						XN.Debug.writeLine("received hash "
								+ decodeURIComponent(g))
					}
					var i;
					if (XN.Sys.startsWith(g, "session=")) {
						i = decodeURIComponent(g);
						var d = i.substr(8);
						if (d === "loggedout") {
							if (XN.Sys.containsKey(this._handlers, "xnLogout")) {
								var a = this._handlers.xnLogout;
								a(d, null)
							}
						} else {
							if (XN.Sys.containsKey(this._handlers, "xnLogin")) {
								var c = this._handlers.xnLogin;
								c(d, null)
							}
						}
					} else {
						var f = encodeURIComponent("}");
						var n = g.indexOf(f) + f.length;
						var e = decodeURIComponent(g.substring(0, n));
						var h = g.substr(n);
						var b = XNIntern.JSON.deserialize(e);
						b.d = h;
						switch (b.t) {
						case XN.XdComm._packetType.udpSingle:
							this._onFullDataReceived(b, new XN.XdComm.EndPoint(
									b.sf, b.sr, b.sc));
							break;
						case XN.XdComm._packetType.ack:
							XN.Debug.logLine(4, "Received ack-type packet!");
							var l = new XN.XdComm.EndPoint(b.sf, b.sr, b.sc);
							var m = new XN.ArrayEnumerator(this._sendChannels);
							while (m.moveNext()) {
								XN.Debug.logLine(10,
										"Check send channel for ack ...");
								var j = m.get_current();
								if (l.isEqual(j._endPoint)) {
									XN.Debug
											.logLine(5,
													"Got a send channel matching endpoint!");
									j._onAck(this._getDataObject(b))
								}
							}
							break;
						default:
							var k = this._ensureReceiveChannel(b.sid, null);
							k._onReceivedPacket(b);
							break
						}
					}
				},
				_ensureReceiveChannel : function(a, c) {
					var b = null;
					var e = new XN.ArrayEnumerator(this._receiveChannels);
					while (e.moveNext()) {
						var d = e.get_current();
						if (d._id === a) {
							b = d;
							break
						}
					}
					if (!b) {
						b = new XN.XdComm._receiveChannel(a, c);
						XN.Sys.add(this._receiveChannels, b)
					}
					return b
				},
				_onFullDataReceived : function(d, b) {
					if (XN.Debug.logLevel > 3) {
						XN.Debug.dump(d, "received full packet");
						XN.Debug.dump(b, "sender")
					}
					if (XN.Sys.containsKey(this._handlers, d.h)) {
						var c = this._handlers[d.h];
						if (d.h == "xnOAuthClosingDialog") {
							c(d.d, b)
						} else {
							c(this._getDataObject(d), b)
						}
					} else {
						XN.Debug.logLine(2,
								"queue request to unknown handler {0} " + d.h);
						var a = this._dataRequestQueues[d.h];
						if (!a) {
							this._dataRequestQueues[d.h] = a = []
						}
						XN.Sys.add(a, d)
					}
				},
				_getDataObject : function(b) {
					var a = b.d;
					switch (b.df) {
					case XN.XdComm.PacketDataFormat.rawText:
						return a;
					case XN.XdComm.PacketDataFormat.OBJ:
						return b.nd;
					case XN.XdComm.PacketDataFormat.JSON:
					default:
						return XNIntern.JSON.deserialize(decodeURIComponent(a))
					}
				},
				get__hasNativeXd : function() {
					if (this._nativeXdState === -1) {
						if ((XNIntern.AppInfo.get_singleton().get_hostInfo()
								.get_hostName() === XNIntern.HostName.IE && XNIntern.AppInfo
								.get_singleton().get_hostInfo().majorVersion < 8)) {
							this._nativeXdState = 0
						} else {
							this._nativeXdState = window.postMessage != null ? 1
									: 0
						}
					}
					return this._nativeXdState === 1
				},
				_receiverUrl : null,
				_hiddenIframeContainer : null,
				_iframeCreated : false,
				_id : null,
				_maxPacketDataLength : 0,
				_nativeMsgId : 0
			}
		});
XN.XdComm.XdRpcClient = XN.Type.createClass( {
	ctor : function(b, c, a) {
		this._requestQueue = {};
		this._serverEndPoint = a;
		this._rpcClientName = c;
		this._rcpServerName = b;
		XN.XdComm.Server.singleton.registerDataHandler(c, XN.Delegate.create(
				this, this._onDataReceived))
	},
	instance : {
		send : function(b, a, e) {
			XN.Debug.logLine(3, "XdRpcClient.Send: " + b);
			var d = this._idCount++;
			var c = [ d, this._rpcClientName, b, a, (e) ? true : false ];
			this._requestQueue[d.toString()] = e;
			XN.XdComm.Server.singleton.send(this._serverEndPoint,
					this._rcpServerName, c)
		},
		_onDataReceived : function(b, a) {
			var e = b;
			var c = e[0];
			var d = this._requestQueue[c];
			if (d) {
				d(e[1])
			}
		},
		detachClient : function() {
			XN.XdComm.Server.singleton
					.unregisterDataHandler(this._rpcClientName)
		},
		_serverEndPoint : null,
		_rpcClientName : null,
		_rcpServerName : null,
		_idCount : 0
	}
});
XN.XdComm.XdRpcServer = XN.Type.createClass( {
	ctor : function(a, b) {
		if (b) {
			this.registeredMethodMap = b
		} else {
			this.registeredMethodMap = {}
		}
		XN.XdComm.Server.singleton.registerDataHandler(a, XN.Delegate.create(
				this, this._onDataReceived))
	},
	instance : {
		_onDataReceived : function(e, b) {
			var c = e;
			if (c.length !== 5) {
				XN.Debug.assert(false,
						"XdRpcServer.OnDataReceived: invalid parameters.")
			}
			var a = c[0];
			var f = c[1];
			var g = c[2];
			if (g == "setCanvasSize") {
				if (this.lastMaxRequestId && a <= this.lastMaxRequestId) {
					XN.Debug.logLine(1, "Drop a method call: " + g
							+ "; requestId = " + a + "; lastMaxRequestId = "
							+ this.lastMaxRequestId);
					return
				}
				this.lastMaxRequestId = a
			}
			var i = c[3];
			var d = c[4];
			if (!XN.Sys.containsKey(this.registeredMethodMap, g)) {
				XN.Debug.assert(false, "XD RPC server: method " + g
						+ " is not allowed or doesn't exist.");
				return
			}
			var h = this.registeredMethodMap[g];
			XN.Debug.logLine(3, "XdRpcServer.Received: " + g);
			if (h.method) {
				var j = h.method(i, b);
				if (d) {
					XN.XdComm.Server.singleton.send(b, f, [ a, j ])
				}
			} else {
				if (h.asyncMethod) {
					h.asyncMethod(i, XN.Delegate.create(this, function(k) {
						if (d) {
							XN.XdComm.Server.singleton.send(b, f, [ a, k ])
						}
					}), b)
				} else {
					XN.Debug.assert(false, "MethodInfo for " + g
							+ " does not contain any function pointers.")
				}
			}
		},
		registeredMethodMap : null
	}
});
XN._xdHttpRequestClient = XN.Type
		.createClass( {
			ctor : function(b, c, a) {
				if (!XN.Bootstrap.siteVars.use_flash
						|| !XNIntern.Flash.hasRequireVersion()) {
					XN.Debug.logLine(2,
							"XN._xdHttpRequestClient constructor: api server_iframe_name = "
									+ a + "requestServerUrl = " + b);
					XN.XdComm.Server.singleton.createNamedHiddenIFrame(a, b,
							"XN_SERVER_IFRAME", null);
					this._serverEndPoint = new XN.XdComm.EndPoint(a,
							XN.XdComm.PageRelation.child, c)
				} else {
					if (!window.XN_OnXdHttpResult) {
						XN.Debug.logLine(2, "Set window.XN_OnXdHttpResult");
						window.XN_OnHttpResult = XN._xdHttpRequestClient._onFlashDataReceived
					}
				}
			},
			static_ctor : function() {
				XN._xdHttpRequestClient._requestQueue = {};
				XN._xdHttpRequestClient._handlerRegistered = false;
				XN._xdHttpRequestClient._idCount = 0
			},
			statics : {
				_ensureListenerStarted : function() {
					if (!XN._xdHttpRequestClient._handlerRegistered) {
						XN.XdComm.Server.singleton.registerDataHandler(
								"http_client",
								XN._xdHttpRequestClient._onDataReceived);
						XN._xdHttpRequestClient._handlerRegistered = true
					}
				},
				_onFlashDataReceived : function(c, b) {
					c = unescape(c);
					XN.Debug.logLine(3,
							"_onFlashDataReceived: In flash callback: responseText (before decoded) = "
									+ c);
					c = XNIntern.Flash.decode(c);
					XN.Debug.logLine(3,
							"_onFlashDataReceived: In flash callback: decoded responseText = "
									+ c);
					var a = XN
							.$create_XdHttpRequestResult(b, 200, "Success", c);
					window.setTimeout(function() {
						XN._xdHttpRequestClient._onDataReceived(a, null)
					}, 0)
				},
				_onDataReceived : function(c, b) {
					XN.Debug.logLine(3, "XdHttpRequestClient: got result ");
					var a = c;
					var d = XN._xdHttpRequestClient._requestQueue[a.id];
					d(a)
				}
			},
			instance : {
				send : function(a, b, f, e, i) {
					if (!XN.Bootstrap.siteVars.use_flash
							|| !XNIntern.Flash.hasRequireVersion()) {
						var d = new XNIntern.Uri(b);
						var g = d.get_pathAndQuery();
						XN._xdHttpRequestClient._ensureListenerStarted();
						var c = XN._xdHttpRequestClient._idCount++;
						var h = [ c, a, g, f, e ];
						XN._xdHttpRequestClient._requestQueue[c.toString()] = i;
						XN.Debug.logLine(3,
								"XdHttpRequestClient: send request for " + b);
						XN.XdComm.Server.singleton.send(this._serverEndPoint,
								"http_server", h)
					} else {
						XNIntern.Flash
								.get_xdComm()
								.waitUntilReady(
										XN.Delegate
												.create(
														this,
														function(j) {
															var k = j;
															XN.Debug
																	.logLine(
																			3,
																			"XdHttpRequestClient: send flash request for url = "
																					+ b
																					+ ", method = "
																					+ a
																					+ ", requestBody = "
																					+ f);
															if (XN.Debug.logLevel > 3) {
																XN.Debug
																		.dump(
																				e,
																				"XdHttpRequestClient: send flash request: extraHeaders")
															}
															var l = k
																	.sendXdHttpRequest(
																			b,
																			f);
															XN.Debug
																	.logLine(
																			4,
																			"XdHttpRequestClient: send flash request: requestId from flash = "
																					+ l);
															XN._xdHttpRequestClient._requestQueue[l
																	.toString()] = i
														}))
					}
				},
				_serverEndPoint : null
			}
		});
XN._xdJsonRequest = XN.Type
		.createClass( {
			ctor : function(a, e, b, c, d) {
				this._method = e;
				this._url = b;
				this._requestBody = c;
				this._extraHeaders = d;
				this._xdHttpClient = a
			},
			instance : {
				sendRequest : function() {
					this._xdHttpClient
							.send(
									this._method,
									this._url,
									this._requestBody,
									this._extraHeaders,
									XN.Delegate
											.create(
													this,
													function(d) {
														if (d.status < 400) {
															var e = d.responseText;
															var a;
															try {
																a = XNIntern.JSON
																		.deserialize(
																				e,
																				true)
															} catch (c) {
																var b = XNIntern.Utility
																		.createException(
																				"JSON exception during deserialization.",
																				e,
																				c);
																this
																		.callback(
																				null,
																				c);
																return
															}
															this.callback(a,
																	null)
														} else {
															var c = new Error(
																	XN.Sys
																			.format(
																					"HTTP request failure status code='{0}', text='{1}'",
																					d.status,
																					d.statusText));
															this.callback(null,
																	c)
														}
													}))
				},
				callback : null,
				_method : null,
				_url : null,
				_requestBody : null,
				_extraHeaders : null,
				_xdHttpClient : null
			}
		});
XN.FeatureLoader.onScriptLoaded( [ "XdComm" ]);
XN.Type.createNamespace("XN.IFrameUtil");
XN.IFrameUtil._resizeUtil = XN.Type
		.createClass( {
			ctor : function(a) {
				this.allowWidthChange = a
			},
			instance : {
				setCanvasHeight : function(b, c) {
					var a = b;
					XN.Debug
							.logLine(2, "ResizeUtil: set canvas height to " + a);
					if (!a) {
						XN.Debug
								.assert(false,
										"Called ResizeUtil.SetCanvasHeight() with invalid input paramters.")
					} else {
						var d = this._getIFrameElement(c.frameName);
						d.style.height = a
					}
					return null
				},
				setCanvasSize : function(b, c) {
					var g = b;
					var f = g.w;
					var a = g.h;
					XN.Debug.logLine(2, XN.Sys.format(
							"ResizeUtil: set canvas size to {0}, {1}", f, a));
					if (a) {
						var e = this._getIFrameElement(c.frameName);
						e.style.height = a
					}
					if (f) {
						if (this.allowWidthChange) {
							var e = this._getIFrameElement(c.frameName), h = false, d = e.parentNode;
							while (d) {
								if (d.nodeType == 1
										&& d.id == "RES_ID_xn_pop_dialog_table") {
									h = true;
									if (XN.Sys.endsWith(f, "px")) {
										f = f.substring(0, f.length - 2)
									}
									d.style.width = (f - 0 + 20) + "px";
									break
								}
								d = d.parentNode
							}
							if (!h) {
								e.style.width = f
							}
						} else {
							XN.Debug.assert(false,
									"Iframe width change is disallowed.")
						}
					}
					return null
				},
				getCanvasInfo : function(b, c) {
					var g = this._getIFrameElement(c.frameName);
					var d = Vector2.getViewportDimensions();
					var h = Vector2.getDocumentDimensions();
					var e = Vector2.getScrollPosition(null);
					var f = Vector2.getElementPosition(g, "document");
					var a = {
						window : {
							w : d.x,
							h : d.y
						},
						page : {
							w : h.x,
							h : h.y
						},
						scrollPos : {
							x : e.x,
							y : e.y
						},
						canvas : {
							w : g.offsetWidth,
							h : g.offsetHeight
						},
						canvasPos : {
							x : f.x,
							y : f.y
						}
					};
					return a
				},
				changeUrlSuffix : function(a, b) {
					var c = a;
					PlatformCanvasController.singleton
							.changeUrlSuffix(c, false);
					return null
				},
				refreshUrl : function(a, b) {
					var c = a;
					PlatformCanvasController.refreshUrl(c);
					return null
				},
				scrollTo : function(a, b) {
					window.scrollTo(a.x, a.y);
					return null
				},
				_getIFrameElement : function(e) {
					var d = document.getElementsByTagName("iframe");
					var c = null;
					for ( var a = 0; a < d.length; a++) {
						var b = d[a];
						if (b.name === e) {
							c = b
						}
					}
					return c
				},
				attachToWindowResizeEvent : function(a, c, b) {
					this.add__windowSizeChangedCallback(c);
					XNIntern.Utility.addEventListener(window.self, "resize",
							XN.Delegate.create(this, function(f) {
								if (this.__windowSizeChangedCallback) {
									var d = this.getCanvasInfo(null, b);
									this.__windowSizeChangedCallback(d)
								}
							}))
				},
				requireLogin : function(a, c, b) {
					PlatformCanvasController.singleton.requireLogin()
				},
				closeLogin : function(a, c, b) {
					PlatformCanvasController.singleton.closeLogin()
				},
				showFeedDialog : function(a, d, b) {
					var c = a;
					a.callback = d;
					XNML_Impl.showFeedDialog(a)
				},
				showPermissionDialog : function(a, c, b) {
					XNML_Impl.showPermissionDialog(a, c)
				},
				allowWidthChange : false,
				add__windowSizeChangedCallback : function(a) {
					this.__windowSizeChangedCallback = XN.Delegate.combine(
							this.__windowSizeChangedCallback, a)
				},
				remove__windowSizeChangedCallback : function(a) {
					this.__windowSizeChangedCallback = XN.Delegate.remove(
							this.__windowSizeChangedCallback, a)
				},
				__windowSizeChangedCallback : null
			}
		});
XN.IFrameUtil.serverMethods = XN.Type.createClass( {
	ctor : function() {
	},
	instance : {
		checkboxFeedReady : function(b, c) {
			var a = b;
			if (XN.IFrameUtil.CanvasUtilServer.checkboxFeedCallback) {
				XN.IFrameUtil.CanvasUtilServer.checkboxFeedCallback(a.code,
						a.errMsg);
				XN.IFrameUtil.CanvasUtilServer.checkboxFeedCallback = undefined
			}
		},
		appBookmark : function(a, c, b) {
			XNML_Impl.appBookmark()
		},
		requestPayment : function(a, b) {
			Paymentprocessor.requestPayment(b, a)
		},
		requestPaymentRecords : function(a, b) {
			Paymentprocessor.requestPaymentRecords(b, a)
		}
	}
});
XN.IFrameUtil.CanvasUtilServer = XN.Type
		.createClass( {
			ctor : function() {
			},
			static_ctor : function() {
				XN.IFrameUtil.CanvasUtilServer._rpcServer = null;
				XN.IFrameUtil.CanvasUtilServer._rpcClient = null;
				XN.IFrameUtil.CanvasUtilServer._resizeUtil = null
			},
			statics : {
				run : function(a) {
					if (!XN.IFrameUtil.CanvasUtilServer._rpcServer) {
						XN.IFrameUtil.CanvasUtilServer._resizeUtil = new XN.IFrameUtil._resizeUtil(
								a);
						XN.IFrameUtil.CanvasUtilServer._serverMethods = new XN.IFrameUtil.serverMethods();
						var b = {
							setCanvasHeight : XN.XdComm
									.$create_XdRpcMethodInfo(
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._resizeUtil,
															XN.IFrameUtil.CanvasUtilServer._resizeUtil.setCanvasHeight),
											null),
							setCanvasSize : XN.XdComm
									.$create_XdRpcMethodInfo(
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._resizeUtil,
															XN.IFrameUtil.CanvasUtilServer._resizeUtil.setCanvasSize),
											null),
							getCanvasInfo : XN.XdComm
									.$create_XdRpcMethodInfo(
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._resizeUtil,
															XN.IFrameUtil.CanvasUtilServer._resizeUtil.getCanvasInfo),
											null),
							scrollTo : XN.XdComm
									.$create_XdRpcMethodInfo(
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._resizeUtil,
															XN.IFrameUtil.CanvasUtilServer._resizeUtil.scrollTo),
											null),
							changeUrlSuffix : XN.XdComm
									.$create_XdRpcMethodInfo(
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._resizeUtil,
															XN.IFrameUtil.CanvasUtilServer._resizeUtil.changeUrlSuffix),
											null),
							refreshUrl : XN.XdComm
									.$create_XdRpcMethodInfo(
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._resizeUtil,
															XN.IFrameUtil.CanvasUtilServer._resizeUtil.refreshUrl),
											null),
							setInnerReceiver : XN.XdComm
									.$create_XdRpcMethodInfo(
											XN.IFrameUtil.CanvasUtilServer.setInnerReceiver,
											null),
							attachToWindowResizeEvent : XN.XdComm
									.$create_XdRpcMethodInfo(
											null,
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._resizeUtil,
															XN.IFrameUtil.CanvasUtilServer._resizeUtil.attachToWindowResizeEvent)),
							requireLogin : XN.XdComm
									.$create_XdRpcMethodInfo(
											null,
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._resizeUtil,
															XN.IFrameUtil.CanvasUtilServer._resizeUtil.requireLogin)),
							closeLogin : XN.XdComm
									.$create_XdRpcMethodInfo(
											null,
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._resizeUtil,
															XN.IFrameUtil.CanvasUtilServer._resizeUtil.closeLogin)),
							showFeedDialog : XN.XdComm
									.$create_XdRpcMethodInfo(
											null,
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._resizeUtil,
															XN.IFrameUtil.CanvasUtilServer._resizeUtil.showFeedDialog)),
							showPermissionDialog : XN.XdComm
									.$create_XdRpcMethodInfo(
											null,
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._resizeUtil,
															XN.IFrameUtil.CanvasUtilServer._resizeUtil.showPermissionDialog)),
							checkboxFeedReady : XN.XdComm
									.$create_XdRpcMethodInfo(
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._serverMethods,
															XN.IFrameUtil.CanvasUtilServer._serverMethods.checkboxFeedReady),
											null),
							appBookmark : XN.XdComm
									.$create_XdRpcMethodInfo(
											null,
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._serverMethods,
															XN.IFrameUtil.CanvasUtilServer._serverMethods.appBookmark)),
							requestPayment : XN.XdComm
									.$create_XdRpcMethodInfo(
											null,
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._serverMethods,
															XN.IFrameUtil.CanvasUtilServer._serverMethods.requestPayment)),
							requestPaymentRecords : XN.XdComm
									.$create_XdRpcMethodInfo(
											null,
											XN.Delegate
													.create(
															XN.IFrameUtil.CanvasUtilServer._serverMethods,
															XN.IFrameUtil.CanvasUtilServer._serverMethods.requestPaymentRecords))
						};
						XN.Debug.assert(XN.XdComm.Server.singleton
								.get_receiverUrl(),
								"XN.XdComm.Server not initialized");
						XN.IFrameUtil.CanvasUtilServer._rpcServer = new XN.XdComm.XdRpcServer(
								"iframeOuterServer", b)
					} else {
						if (a
								&& !XN.IFrameUtil.CanvasUtilServer._resizeUtil.allowWidthChange) {
							XN.IFrameUtil.CanvasUtilServer._resizeUtil.allowWidthChange = true
						}
					}
				},
				setInnerReceiver : function(b, a) {
					var c = b;
					XN.Debug.logLine(2, XN.Sys.format(
							"CanvasClient: set innner url to  {0}",
							c.receiverUrl));
					XN.IFrameUtil.CanvasUtilServer
							.refreshRpcClient(c.receiverUrl);
					return null
				},
				loadNewUrl : function(a) {
					XN.IFrameUtil.CanvasUtilServer.ensureRpcClient();
					XN.IFrameUtil.CanvasUtilServer._rpcClient.send(
							"loadNewUrl", a, null)
				},
				loginResponse : function(a, b) {
					XN.IFrameUtil.CanvasUtilServer.ensureRpcClient();
					if (!a) {
						XN.IFrameUtil.CanvasUtilServer._rpcClient.send(
								"loginResponse", null, null)
					} else {
						XN.IFrameUtil.CanvasUtilServer._rpcClient.send(
								"loginResponse", b, null)
					}
				},
				feedResponse : function() {
					XN.IFrameUtil.CanvasUtilServer.ensureRpcClient();
					XN.IFrameUtil.CanvasUtilServer._rpcClient.send(
							"feedResponse", null, null)
				},
				sendCheckboxFeed : function(b) {
					XN.IFrameUtil.CanvasUtilServer.ensureRpcClient();
					XN.IFrameUtil.CanvasUtilServer.checkboxFeedCallback = b.callback;
					var a = XN.Connect.formFeedInfo(b);
					XN.IFrameUtil.CanvasUtilServer._rpcClient.send(
							"sendCheckboxFeed", a, null)
				},
				refreshRpcClient : function(b) {
					XN.Debug.assert(b, "Inner receiver url is null.");
					if (XN.IFrameUtil.CanvasUtilServer._rpcClient) {
						XN.IFrameUtil.CanvasUtilServer._rpcClient
								.detachClient()
					}
					var a = new XN.XdComm.EndPoint("xniframe_canvas",
							XN.XdComm.PageRelation.child, b);
					a.UID = Math.floor(Math.random() * 1000000);
					XN.IFrameUtil.CanvasUtilServer._rpcClient = new XN.XdComm.XdRpcClient(
							"iframeInnerServer", "iframeOuterClient", a)
				},
				ensureRpcClient : function() {
					XN.Debug.assert(XN.IFrameUtil.CanvasUtilServer._rpcClient,
							"Inner iframe server not ready.")
				}
			}
		});
XN.Type.createNamespace("XN.UI");
XN.UI.DomResources = XN.Type.createClass( {
	ctor : function() {
	},
	static_ctor : function() {
		XN.UI.DomResources._dicts = []
	},
	statics : {
		addResourceDict : function(a) {
			XN.Sys.add(XN.UI.DomResources._dicts, a)
		},
		getResourceById : function(e) {
			var d = XN.UI.DomResources._dicts.length;
			var b;
			for ( var a = 0; a < d; a++) {
				b = ((XN.UI.DomResources._dicts[a])).getClonedElement(e);
				if (b) {
					return b
				}
			}
			return null
		}
	}
});
XN.UI.DomResDict = XN.Type
		.createClass( {
			ctor : function(a) {
				this._docFragment = document.createDocumentFragment();
				var b = document.createElement("div");
				b.innerHTML = a;
				this._docFragment.appendChild(b)
			},
			statics : {
				_getElementInFragment : function(a, g) {
					if (XNIntern.AppInfo.get_singleton().get_hostInfo()
							.get_hostName() === XNIntern.HostName.IE) {
						return a.getElementById(g)
					} else {
						var d = [];
						var e = a.childNodes;
						var b;
						var f;
						for (f = 0; f < e.length; f++) {
							b = e[f];
							if (b.nodeType == 1) {
								d[d.length] = b
							}
						}
						while (d.length) {
							b = d.shift();
							if (b.id == g) {
								return b
							}
							e = b.childNodes;
							if (e.length != 0) {
								for (f = 0; f < e.length; f++) {
									b = e[f];
									if (b.nodeType == 1) {
										d.push(b)
									}
								}
							}
						}
						return null
					}
				}
			},
			instance : {
				getClonedElement : function(b) {
					var a = XN.UI.DomResDict._getElementInFragment(
							this._docFragment, "RES_ID_" + b);
					if (a) {
						return a.cloneNode(true)
					} else {
						return null
					}
				},
				_docFragment : null
			}
		});
XN.UI.PopupPlacement = XN.Type.createEnum( {
	center : 1,
	topCenter : 2,
	hidden : 3
}, false);
XN.UI.UIElement = XN.Type.createClass( {
	ctor : function() {
	},
	statics : {
		addCssClass : function(d, b) {
			var c = " " + d.className + " ";
			var a = " " + b + " ";
			if (c.indexOf(a) < 0) {
				d.className = d.className + " " + b
			}
		},
		containsCssClass : function(c, a) {
			var b = " " + c.className + " ";
			return b.indexOf(" " + a + " ") >= 0
		},
		removeCssClass : function(f, d) {
			var e = " " + f.className + " ";
			var b = " " + d + " ";
			var c = e.indexOf(b);
			if (c >= 0) {
				var a = e.substring(1, c)
						+ e.substring(c + b.length, e.length - 1);
				f.className = a
			}
		}
	},
	instance : {
		get_domElement : function() {
			return this._domElement
		},
		set_domElement : function(a) {
			this._domElement = a;
			return a
		},
		setLeft : function(a) {
			this._domElement.style.left = a.toString() + "px"
		},
		setTop : function(a) {
			this._domElement.style.top = a.toString() + "px"
		},
		setWidth : function(a) {
			this._domElement.style.width = a.toString() + "px"
		},
		_domElement : null
	}
});
XN.UI.Popup = XN.Type
		.createClass( {
			base : XN.UI.UIElement,
			ctor : function() {
				this._placement$1 = XN.UI.PopupPlacement.center;
				this._offset$1 = XN.$create_Point(0, 0);
				this._popupHeight$1 = -1;
				this._popupWidth$1 = -1;
				XN.UI.Popup.constructBase(this)
			},
			static_ctor : function() {
				XN.UI.Popup._borderSize$1 = 22;
				XN.UI.Popup._popupContainer$1 = null
			},
			statics : {
				get__popupContainer$1 : function() {
					if (!XN.UI.Popup._popupContainer$1) {
						XN.UI.Popup._popupContainer$1 = document
								.getElementById("xn_popupContainer");
						if (!XN.UI.Popup._popupContainer$1) {
							var a = document.createElement("div");
							a.className = "xn_resetstyles xn_popupContainer";
							XN.UI.Popup._popupContainer$1 = document.body
									.appendChild(a)
						}
					}
					return XN.UI.Popup._popupContainer$1
				}
			},
			instance : {
				setContentWidth : function(a) {
					this._popupWidth$1 = a + XN.UI.Popup._borderSize$1
				},
				setContentHeight : function(a) {
					this._popupHeight$1 = a + XN.UI.Popup._borderSize$1
				},
				show : function() {
					if (!this._loadedInDom$1) {
						XN.UI.UIElement.addCssClass(this.get_domElement(),
								"xn_popup");
						XN.UI.Popup.get__popupContainer$1().appendChild(
								this.get_domElement());
						this._loadedInDom$1 = true
					}
					this.sizing();
					this.onAfterShow()
				},
				sizing : function() {
					if (!this._loadedInDom$1) {
						return false
					}
					if (this._popupWidth$1 >= 0) {
						this.get_domElement().style.width = this._popupWidth$1
								.toString()
								+ "px"
					}
					if (this._popupHeight$1 >= 0) {
						this.get_domElement().style.height = this._popupHeight$1
								.toString()
								+ "px"
					}
					var f = XN.$create_Size(this.get_domElement().offsetWidth,
							this.get_domElement().offsetHeight);
					var a = null;
					var c = XNIntern.Utility.get_windowSize();
					var e = document.documentElement;
					var b = (this.hidden) ? XN.UI.PopupPlacement.hidden : this
							.get_placement();
					var d;
					if (document.documentElement
							&& document.documentElement.scrollTop > 0) {
						d = document.documentElement.scrollTop
					} else {
						d = document.body.scrollTop
					}
					switch (b) {
					case XN.UI.PopupPlacement.topCenter:
						a = XN.$create_Point(e.scrollLeft + c.w / 2, d + 125);
						a.x -= (f.w / 2);
						break;
					case XN.UI.PopupPlacement.center:
						a = XN.$create_Point(e.scrollLeft + c.w / 2, d + c.h
								/ 2);
						a.x -= (f.w / 2);
						a.y -= (f.h / 2);
						break;
					case XN.UI.PopupPlacement.hidden:
						a = XN.$create_Point(-100 - f.w, -100 - f.h);
						break
					}
					a.x += this._offset$1.x;
					a.y += this._offset$1.y;
					if (a.x < 0 && b !== XN.UI.PopupPlacement.hidden) {
						a.x = 0
					}
					if (a.y < 0 && b !== XN.UI.PopupPlacement.hidden) {
						a.y = 0
					}
					var g = this.get_location();
					if (g) {
						if (g.x !== undefined) {
							a.x = g.x
						}
						if (g.y !== undefined) {
							a.y = g.y
						}
					}
					this.setLeft(a.x);
					this.setTop(a.y);
					return true
				},
				onAfterShow : function() {
				},
				close : function(a) {
					if (this.__closing$1) {
						this.__closing$1(a)
					}
					if (XNIntern.AppInfo.get_singleton().get_hostInfo()
							.get_hostName() !== XNIntern.HostName.IE) {
						XN.UI.Popup.get__popupContainer$1().removeChild(
								this.get_domElement())
					} else {
						var b = this.get_domElement();
						b.style.display = "none";
						window.setTimeout(XN.Delegate.create(this, function() {
							if (b.parentNode) {
								b.parentNode.removeChild(b)
							}
						}), 4000)
					}
					if (this.__closed$1) {
						this.__closed$1(a)
					}
				},
				get_placementTarget : function() {
					return this._placementTarget$1
				},
				set_placementTarget : function(a) {
					this._placementTarget$1 = a;
					return a
				},
				get_offset : function() {
					return this._offset$1
				},
				set_offset : function(a) {
					this._offset$1 = a;
					return a
				},
				get_placement : function() {
					return this._placement$1
				},
				set_placement : function(a) {
					this._placement$1 = a;
					return a
				},
				get_location : function() {
					return this._specifiedLoc
				},
				set_location : function(a) {
					this._specifiedLoc = a;
					return a
				},
				add_closing : function(a) {
					this.__closing$1 = XN.Delegate.combine(this.__closing$1, a)
				},
				remove_closing : function(a) {
					this.__closing$1 = XN.Delegate.remove(this.__closing$1, a)
				},
				__closing$1 : null,
				add_closed : function(a) {
					this.__closed$1 = XN.Delegate.combine(this.__closed$1, a)
				},
				remove_closed : function(a) {
					this.__closed$1 = XN.Delegate.remove(this.__closed$1, a)
				},
				__closed$1 : null,
				_placementTarget$1 : null,
				_loadedInDom$1 : false,
				hidden : false
			}
		});
XN.UI.PopupDialog = XN.Type.createClass( {
	base : XN.UI.Popup,
	ctor : function(g, f, c, d, a, e) {
		XN.UI.PopupDialog.constructBase(this);
		this._content$2 = f;
		this._showLoading$2 = c;
		if (d) {
			this.hidden = true
		}
		this.set_domElement(XN.UI.DomResources
				.getResourceById("xn_pop_dialog_table"));
		this._contentParent$2 = XNIntern.UIHelper.findElementById(this
				.get_domElement(), "xn_dialog_content");
		this._header$2 = XNIntern.UIHelper.findElementById(this
				.get_domElement(), "xn_dialog_header");
		this._header$2.innerHTML = XN.Sys.htmlEncode(g);
		var b = XNIntern.UIHelper.findElementById(this.get_domElement(),
				"xn_dialog_cancel_button");
		this._loader$2 = XNIntern.UIHelper.findElementById(this
				.get_domElement(), "xn_dialog_loading_spinner");
		if (b) {
			if (e) {
				b.parentNode.removeChild(b)
			} else {
				this._closeButtonEventListener = XN.Delegate.create(this,
						this._onCloseButtonClicked$2);
				XNIntern.Utility.addEventListener(b, "click",
						this._closeButtonEventListener)
			}
		}
		if (f) {
			this._contentParent$2.appendChild(f)
		}
		if (a || XN.isInKaixinCanvas._inKaixin) {
			this._header$2.style.margin = "0px";
			this._header$2.parentNode
					.removeChild(this._header$2.previousSibling);
			this._header$2.parentNode.style.backgroundPosition = "-100px 0"
		}
	},
	static_ctor : function() {
		XN.UI.PopupDialog._xdClosingDialogDict$2 = null
	},
	statics : {
		_createConfirmationDialog : function(e, a, f) {
			var c = new XN.UI.PopupDialog(e, a, false, false);
			c.add_closing(f);
			var b = XNIntern.UIHelper.findElementById(a, "xn_confirm");
			var d = XNIntern.UIHelper.findElementById(a, "xn_cancel");
			if (b) {
				XNIntern.Utility.addEventListener(b, "click", function(g) {
					c.close(true)
				})
			}
			if (d) {
				XNIntern.Utility.addEventListener(d, "click", function(g) {
					c.close(false)
				})
			}
			return c
		},
		_onXdClosingDialogHandler$2 : function(e, d) {
			var f = e;
			var c = f.token;
			var a = f.result;
			var b = XN.UI.PopupDialog._xdClosingDialogDict$2[c];
			if (b) {
				XN.Debug.logLine(3, "Close dialog");
				b.close(a)
			} else {
				XN.Debug.logLine(1, "Invalid token to close dialog: " + c)
			}
		},
		_onXdOAuthClosingDialogHandler$2 : function(c, e) {
			var f;
			var h = "";
			var a = "";
			var k;
			if (c.indexOf("?") > 0) {
				f = c.indexOf("?");
				h = c.substring(0, f);
				a = c.substring(f + 1);
				if (a.indexOf("error") >= 0) {
					k = false
				} else {
					k = true
				}
			} else {
				if (c.indexOf("&") > 0) {
					f = c.indexOf("&");
					h = c.substring(0, f);
					a = c.substring(f + 1);
					if (a.indexOf("error") >= 0) {
						k = false
					} else {
						k = true
					}
				} else {
					h = c
				}
			}
			var i = XNIntern.JSON.deserialize(decodeURIComponent(h));
			var j = i.url + "?" + a;
			XN.XdComm.Server.singleton._createHiddenIFrame(j);
			var b = i.token;
			var g = XN.UI.PopupDialog._xdClosingDialogDict$2[b];
			if (g) {
				XN.Debug.logLine(3, "Close dialog");
				g.close(k)
			} else {
				XN.Debug.logLine(1, "Invalid token to close dialog: " + b)
			}
		},
		_onXdChangeCloseButtonEventHandler$2 : function(f, e) {
			var g = f;
			var d = g.token;
			var a = g.result;
			var c = XN.UI.PopupDialog._xdClosingDialogDict$2[d];
			if (c) {
				var b = XNIntern.UIHelper.findElementById(c.get_domElement(),
						"xn_dialog_cancel_button");
				if (b) {
					XNIntern.Utility.removeEventListener(b, "click",
							c._closeButtonEventListener);
					c._closeButtonEventListener = XN.Delegate.create(c,
							a ? c._onCloseButtonClicked$1
									: c._onCloseButtonClicked$2);
					XNIntern.Utility.addEventListener(b, "click",
							c._closeButtonEventListener)
				}
			} else {
				XN.Debug.logLine(1, "Invalid token to close dialog: " + d)
			}
		}
	},
	instance : {
		_onCloseButtonClicked$1 : function(a) {
			this.close(true)
		},
		_onCloseButtonClicked$2 : function(a) {
			this.close(false)
		},
		get__content : function() {
			return this._content$2
		},
		set__content : function(a) {
			if (this._content$2) {
				this._contentParent$2.removeChild(this._content$2)
			}
			this._content$2 = a;
			this._contentParent$2.appendChild(this._content$2);
			return a
		},
		_createCrossDomainClosingLink : function(a) {
			if (!XN.UI.PopupDialog._xdClosingDialogDict$2) {
				XN.UI.PopupDialog._xdClosingDialogDict$2 = {};
				XN.XdComm.Server.singleton.registerDataHandler(
						"xnClosingDialog",
						XN.UI.PopupDialog._onXdClosingDialogHandler$2);
				XN.XdComm.Server.singleton.registerDataHandler(
						"xnChangeCloseButtonEvent",
						XN.UI.PopupDialog._onXdChangeCloseButtonEventHandler$2)
			}
			var b = XN.Sys
					.getKeyCount(XN.UI.PopupDialog._xdClosingDialogDict$2)
					.toString()
					+ "_" + Math.random().toString();
			XN.UI.PopupDialog._xdClosingDialogDict$2[b] = this;
			var c = {
				token : b,
				result : a
			};
			var d = new XN.XdComm.EndPoint(null, XN.XdComm.PageRelation.self,
					XN.XdComm.Server.singleton.get_receiverUrl());
			return XN.XdComm.Server.singleton.createUdpUrl("xnClosingDialog",
					c, d)
		},
		_createOAuthDialogHandleObject : function() {
			if (!XN.UI.PopupDialog._xdClosingDialogDict$2) {
				XN.UI.PopupDialog._xdClosingDialogDict$2 = {}
			}
			token = "OAuthDialog";
			XN.UI.PopupDialog._xdClosingDialogDict$2[token] = this
		},
		onAfterShow : function() {
			if (this._showLoading$2) {
				XN.UI.UIElement
						.addCssClass(this._loader$2, "xn_dialog_loading");
				XNIntern.Utility.waitForLoaded(this._content$2, XN.Delegate
						.create(this, function() {
							XN.UI.UIElement.removeCssClass(this._loader$2,
									"xn_dialog_loading");
							if (this.hidden) {
								this.hidden = false;
								this.sizing()
							}
						}))
			}
		},
		_content$2 : null,
		_contentParent$2 : null,
		_header$2 : null,
		_loader$2 : null,
		_showLoading$2 : false
	}
});
XN.UI.XNMLPopupDialog = XN.Type.createClass( {
	base : XN.UI.PopupDialog,
	ctor : function(c, a) {
		XN.UI.XNMLPopupDialog.constructBase(this, [ c, null, false, false ]);
		var b = document.createElement("div");
		this.set__content(b);
		this.setXNMLContent(a)
	},
	instance : {
		setXNMLContent : function(a) {
			this.get__content().setAttribute("xnml", a)
		},
		setContentWidth : function(a) {
			XN.UI.XNMLPopupDialog.callBase(this, "setContentWidth", [ a ]);
			this.get__content()
					.setAttribute("iframeWidth", a.toString() + "px")
		},
		setContentHeight : function(a) {
			this.get__content().setAttribute("iframeHeight",
					a.toString() + "px");
			this.get_offset().y = -a / 2
		},
		onAfterShow : function() {
			XN.UI.XNMLPopupDialog.callBase(this, "onAfterShow");
			var a = this.get__content();
			XN_RequireFeatures( [ "EXNML" ], function() {
				serverXnml = new XN.EXNML.ServerXnml(a);
				XN.EXNML.Host.addElement(serverXnml)
			})
		}
	}
});
XN.Helper = XN.Type.createClass( {
	ctor : function() {
	},
	statics : {
		invokeAsCallbackOrRedirect : function(b) {
			if (!b) {
				return
			}
			if (XN.Sys.isAssignableFrom(XN.Type.getInstanceType(b), String)) {
				window.location = b
			} else {
				var c = b;
				var a = XN.Main.apiClient.get_session();
				c((a) ? a.uid : null)
			}
		}
	}
});
XN.ConnectState = XN.Type.createEnum( {
	connected : 1,
	userNotLoggedIn : 2,
	appNotAuthorized : 3
}, false);
XN.$create_UserInfoRecord = function XN_UserInfoRecord(e, a, c, d) {
	var b = {};
	b.connectState = e;
	b.oneLineStorySetting = a;
	b.shortStorySetting = c;
	b.shareAuth = d;
	return b
};
XN.RequireConnect = XN.Type.createEnum( {
	doNotRequire : 0,
	require : 1,
	promptConnect : 2
}, false);
XN.Type.createNamespace("XN.Connect");
XN.Connect = XN.Type
		.createClass( {
			ctor : function() {
				this._status = new XN.SimpleWaitable()
			},
			static_ctor : function() {
				XN.Connect._singleton = new XN.Connect();
				XN.Connect._loginMethod = "popup";
				XN.Connect._logoutMethod_infoDialog = "info_dialog";
				XN.Connect._logoutMethod_prompt = "prompt";
				XN.Connect._logoutMethod_noUI = "no_ui";
				XN.Connect._logoutMethod = XN.Connect._logoutMethod_infoDialog;
				XN.UI.DomResources
						.addResourceDict(new XN.UI.DomResDict(
								'\n<table id="RES_ID_xn_pop_dialog_table" class="xn_pop_dialog_table">\n <tr><td class="xn_pop_topleft"></td><td class="xn_pop_border"></td><td class="xn_pop_topright"></td></tr>\n <tr><td class="xn_pop_border"></td><td class="xn_pop_content" id="pop_content">\n<div class ="xn_pop_content_container">\n<h2 class="xn_resetstyles"><a id="xn_dialog_cancel_button" href="#" onclick="return false;">\u5173\u95ed</a><div class="xn_dialog_icon"/></div><span class="xn_dialog_header" id="xn_dialog_header"></span><div class="xn_dialog_loading_spinner" id="xn_dialog_loading_spinner">&nbsp;</div></h2>\n<div id="xn_dialog_content" class="xn_dialog_content"></div>\n</div>\n</td><td class="xn_pop_border"></td></tr>\n <tr><td class="xn_pop_bottomleft"></td><td class="xn_pop_border"></td><td class="xn_pop_bottomright"></td></tr>\n</table>\n<div id="RES_ID_xn_logout_confirmation" class="xn_logout_confirm_content">\n  <div class="xn_confirmation_stripes"></div>\n  <div class="xn_confirmation_content">\n    <p>Do you want to log out of both this site and todo???</p>\n  </div>\n  <div class="xn_dialog_buttons">\n      <input id="xn_confirm" type="button" class="xn_inputsubmit" value="Logout"/>\n      <input id="xn_cancel" type="button" class="xn_inputbutton xn_inputaux" value="Cancel"/>\n  </div>\n</div>\n<div id="RES_ID_xn_logout_info" class="xn_logout_confirm_content">\n  <div class="xn_confirmation_stripes"></div>\n  <div class="xn_confirmation_content">\u4f60\u5c06\u4ece\u6b64\u7f51\u7ad9\u548c'
										+ Connect_Config.mainsite_name_cn
										+ '\u9000\u51fa\u767b\u5f55\uff01</div>\n  <div class="xn_action xn_clearfix">\n<div class="xn_center"><input id="xn_confirm" type="button" class="xn_input_submit xn_gray" value="\u5173\u95ed"/>\n</div></div>\n</div>\n'))
			},
			statics : {
				_changeDialogCloseButtonEvent : function(a) {
					if (!a) {
						return
					}
					a = a
							.replace("xnClosingDialog",
									"xnChangeCloseButtonEvent").replace(
									"fname=_parent&", "");
					XN.XdComm.Server.singleton._createHiddenIFrame(a)
				},
				reset : function() {
					if (XN.IFrameUtil.CanvasUtilServer._rpcServer) {
						XN.IFrameUtil.CanvasUtilServer._rpcServer.lastMaxRequestId = -1
					}
				},
				get_status : function() {
					var a = XN.Connect._singleton;
					a._ensureQueryStatus();
					XN.Debug.logLine(2, "XN.Connect.get_status(): is ready? "
							+ a._status.get_isReady());
					return a._status
				},
				logout : function(a) {
					XN.Connect
							._handleLogout(
									a,
									function(c) {
										XN.Debug.logLine(2,
												"_handleLogout callback: logoutConfirmed? "
														+ c);
										if (c) {
											XN.Connect.reset();
											var d = XN.Connect._singleton;
											var e = XNIntern.Uri
													.addQueryParameters(
															XN.XdComm.Server.singleton
																	.get_receiverUrl(),
															"xn_login&fname=_parent&session=loggedout");
											d._ensureLoginHandler();
											d._logoutCallback = a;
											var b = XNIntern.Utility
													.getLoginoutUrl("logout")
													+ "?api_key="
													+ XN.Main.apiKey
													+ "&next="
													+ encodeURIComponent(e);
											d._logoutIframe = XN.XdComm.Server.singleton
													.createNamedHiddenIFrame(
															"xnLogout", b,
															"xn_logout", null)
										} else {
											if (a) {
												a(false)
											}
										}
									})
				},
				logoutAndRedirect : function(a) {
					XN.Connect._handleLogout(null, function(c) {
						if (c) {
							var d = XN.Connect._singleton;
							var e = XNIntern.Uri.create(
									new XNIntern.Uri(document.URL), a)
									.get_uriString();
							var b = XNIntern.Utility.getConnectServerUrl("www")
									+ "logout.do?app_key="
									+ XN.Main.apiKey
									+ "&session_key="
									+ encodeURIComponent(XN.Main.apiClient
											.get_session().session_key)
									+ "&next=" + encodeURIComponent(e);
							d.set__userInfo(null);
							XN.Main.apiClient.set_session(null);
							window.location = b
						}
					})
				},
				ifUserConnected : function(a, b) {
					XN.Connect.get_status().waitForCondition(function(c) {
						XN.Connect._handleConnectStateLogout(a, b, c);
						return false
					})
				},
				ifUserConnectedAppSetting : function(a, b) {
					XN.Connect.get_status().add_changed(function(c) {
						XN.Connect._handleConnectStateLogout(a, b, c)
					})
				},
				_handleConnectStateLogout : function(a, c, b) {
					if (b.get_isReady()) {
						window.setTimeout(function() {
							var d = b.result === XN.ConnectState.connected;
							XN.Helper.invokeAsCallbackOrRedirect((d) ? a : c)
						}, 0)
					}
				},
				listenForIframeConnect : function() {
					var a = XN.Connect._singleton;
					XN.Main.apiClient.get_sessionWaitable().waitUntilReady(
							XN.Delegate.create(a, a._apiClient_SessionReady))
				},
				clientConnectSetup : function(b) {
					var a = XN.Connect._singleton;
					XN.Connect.listenForIframeConnect();
					XN.Connect.get_status().add_changed(function(c) {
						var d = XN.Connect.get_status().result;
						b(d === XN.ConnectState.connected)
					})
				},
				_handleLogout : function(b, a) {
					XN.Debug.logLine(2, "_handleLogout:  appCallback = " + b
							+ ", confirmationCallback = " + a);
					XN.Connect
							.get_status()
							.waitUntilReady(
									function(c) {
										var d = XN.Main.apiClient.get_session();
										if (d) {
											if (XN.Connect._logoutMethod === XN.Connect._logoutMethod_infoDialog) {
												XN.Connect._createInfoDialog(a)
											} else {
												if (XN.Connect._logoutMethod === XN.Connect._logoutMethod_noUI) {
													a(true)
												} else {
													XN.UI.PopupDialog
															._createConfirmationDialog(
																	"Logging Out of "
																			+ Connect_Config.mainsite_name,
																	XN.UI.DomResources
																			.getResourceById("xn_logout_confirmation"),
																	a).show()
												}
											}
										} else {
											XN.Debug
													.logLine(2,
															"Cannot logout because user does not have a session");
											if (b) {
												b(false)
											}
										}
									})
				},
				requireSession : function(c, b) {
					if (XN.Sys.isUndefined(b) && !XN.Sys.isUndefined(c)
							&& typeof (c) !== "function") {
						b = (c);
						c = null
					}
					var a = XN.SessionDialog.getActive();
					if (!a) {
						XN.SessionDialog.make().setIsUserActionHint(b)
								.setUseBrowserPopup(
										XN.Main.appSettings.forceLoginPopup)
								.request()
					} else {
						a.focus()
					}
					if (c) {
						if (XN.Main.appSettings
								&& XN.Main.appSettings.delayCookieOnClick
								&& XN.Connect.cacheCookie) {
							XN.Debug.logLine(4,
									"Delay set Cookie in requireSession...");
							XN.Main.apiClient
									.set_session(XN.Connect.cacheCookie);
							XN.Connect.cacheCookie = undefined
						}
						XN.Connect.get_status().waitForValue(
								XN.ConnectState.connected, c)
					}
				},
				_createInfoDialog : function(b) {
					var a = null;
					a = XN.UI.PopupDialog._createConfirmationDialog(
							"\u9000\u51fa" + Connect_Config.mainsite_name_cn,
							XN.UI.DomResources
									.getResourceById("xn_logout_info"),
							function(c) {
								a = null
							});
					a.setWidth(400);
					a.show();
					a.add_closed(function(c) {
						if (b) {
							b(true)
						}
					});
					window.setTimeout(function() {
						if (a) {
							a.close(false)
						}
					}, 2000)
				},
				pollLoginStatus : function(a, c, d) {
					var b = XN.Connect._singleton;
					if (b.get__userInfo().connectState === XN.ConnectState.connected) {
						if (d) {
							d()
						}
						return
					}
					b._pollTries = c;
					b._pollInterval = a;
					b._onConnectedCallback = d;
					window.setTimeout(function() {
						b._refreshQueryStatus()
					}, b._pollInterval)
				},
				forceSessionRefresh : function(b) {
					var a = XN.Connect._singleton;
					++a._pollTries;
					a._onConnectedCallback = b;
					a._refreshQueryStatus()
				},
				get_loggedInUser : function() {
					var a = XN.Main.apiClient.get_session();
					return (a) ? a.uid : null
				},
				getSignedPublicSessionData : function(b) {
					var a = XN.Connect._singleton;
					XN.Connect.get_status().waitUntilReady(
							function(c) {
								if (a._publicSessionData
										&& XN.Main.apiClient.get_session()) {
									b(a._publicSessionData, null)
								} else {
									if (!XN.Main.apiClient.get_session()) {
										b(null, null)
									} else {
									}
								}
							})
				},
				addSignedPublicSessionDataToUrl : function(a, b) {
					XN.Connect.getSignedPublicSessionData(function(c, d) {
						if (c) {
							a = XNIntern.Uri.addQueryParameters(a,
									"public_session_data="
											+ encodeURIComponent(XNIntern.JSON
													.serialize(c)))
						}
						b(a, null)
					})
				},
				_showStandardDialog : function(e, d, c, a) {
					var b = new XN.UI.PopupDialog(e, d, true, true);
					b.setContentWidth(c);
					b.setContentHeight(a);
					b.set_placement(XN.UI.PopupPlacement.topCenter);
					b.show();
					return b
				},
				get__useBrowserPopupForLogin : function() {
					return (XN.Connect._loginMethod !== "iframe")
				},
				inviteConnectUsers : function() {
					XN.Main.get_sessionWaitable().waitUntilReady(
							function(a) {
								var b = new XN.UI.XNMLPopupDialog(
										"Invite Your Friends to Connect", "");
								var c = b._createCrossDomainClosingLink(false);
								b.setXNMLContent('<xn:connect-form action="'
										+ c + '" view="dialog" />');
								b.setContentWidth(474);
								b.setContentHeight(350);
								b.show()
							})
				},
				showPermissionDialog : function(a, d, c) {
					var b = XN.Connect._singleton;
					if (b._permissionDialog) {
						return
					}
					XN.Connect
							.get_status()
							.waitUntilReady(
									function(e) {
										if (e != XN.ConnectState.connected) {
											XN.Connect
													.requireSession(function() {
														XN.Connect
																.showPermissionDialog(
																		a, d, c)
													})
										} else {
											permStr = (a instanceof Array) ? a
													.join(",") : a;
											permStr = permStr.replace(/\s*/g,
													"");
											XN.IFrameUtil.CanvasUtilServer
													.run(true);
											b._permformNum++;
											var j = "xn_permsIFrame_"
													+ b._permformNum;
											var k = XN.XdComm.Server.singleton
													.createNamedIFrameDomNode(
															j,
															XN.XdComm.Server.singleton
																	.get_receiverUrl(),
															"xn_permission_iframe",
															null);
											k.style.height = "170px";
											b._permissionDialog = new XN.UI.PopupDialog(
													"\u8bf7\u6c42\u4f60\u7684\u6388\u6743",
													k, true, false);
											b._permissionDialog
													.add_closed(function(l) {
														b._permissionDialog = null;
														if (d) {
															if (l instanceof Array) {
																if (a instanceof Array) {
																	if (l.length == a.length) {
																		l = true
																	}
																} else {
																	l = true
																}
															}
															d(l)
														}
													});
											b._permissionDialog
													.set_placement(XN.UI.PopupPlacement.topCenter);
											b._permissionDialog
													.setContentWidth(500);
											if (c) {
												b._permissionDialog
														.set_location(c)
											}
											b._permissionDialog.show();
											var i = b._permissionDialog
													._createCrossDomainClosingLink(true);
											var g = b._permissionDialog
													._createCrossDomainClosingLink(false);
											var h = XN.XdComm.Server.singleton
													.get_receiverUrl();
											var f = {
												api_key : XN.Main.apiKey,
												v : XN.Main.version,
												preview : "true",
												next : i,
												cancel : g,
												channel_url : h,
												ext_perm : permStr
											};
											if (e === XN.ConnectState.connected) {
												f.session_key = XN.Main.apiClient
														.get_session().session_key
											}
											XNIntern.Utility
													.getIFrameDocument(
															j,
															k,
															function(l) {
																b
																		._postToConnectServerInIFrame(
																				l,
																				"connect/promptPermissions.do",
																				f)
															})
										}
									})
				},
				showAuthorizeAccessDialog : function(c, a) {
					var b = XN.Connect._singleton;
					if (b._authorizeAccessDialog) {
						return
					}
					XN.Connect
							.get_status()
							.waitUntilReady(
									function(d) {
										XN.IFrameUtil.CanvasUtilServer
												.run(true);
										b._permformNum++;
										var h = "xn_authorizeAccessIFrame_"
												+ b._permformNum;
										var j = XN.XdComm.Server.singleton
												.createNamedIFrameDomNode(
														h,
														XN.XdComm.Server.singleton
																.get_receiverUrl(),
														"xn_authorize_access_iframe",
														null);
										j.style.height = "102px";
										j.style.width = "500px";
										b._authorizeAccessDialog = new XN.UI.PopupDialog(
												"\u6dfb\u52a0\u5e94\u7528", j,
												true, false, true, false);
										b._authorizeAccessDialog
												.add_closed(function(k) {
													b._authorizeAccessDialog = null;
													if (k) {
														c()
													} else {
														a()
													}
												});
										b._authorizeAccessDialog
												.set_placement(XN.UI.PopupPlacement.topCenter);
										b._authorizeAccessDialog
												.setContentWidth(500);
										b._authorizeAccessDialog.show();
										var i = b._authorizeAccessDialog
												._createCrossDomainClosingLink(true);
										var f = b._authorizeAccessDialog
												._createCrossDomainClosingLink(false);
										var g = XN.XdComm.Server.singleton
												.get_receiverUrl();
										var e = {
											api_key : XN.Main.apiKey,
											v : XN.Main.version,
											preview : "true",
											next : i,
											cancel : f,
											channel_url : g
										};
										XNIntern.Utility
												.getIFrameDocument(
														h,
														j,
														function(k) {
															b
																	._postToConnectServerInIFrame(
																			k,
																			"connect/tos.do",
																			e)
														})
									})
				},
				showOAuthAuthorizeAccessDialog : function(d, a, c) {
					var b = XN.Connect._singleton;
					if (b._authorizeAccessDialog) {
						return
					}
					XN.Connect
							.get_status()
							.waitUntilReady(
									function(m) {
										XN.IFrameUtil.CanvasUtilServer
												.run(true);
										b._permformNum++;
										b._authorizeAccessDialog = new XN.UI.PopupDialog(
												null, null, true, false, true,
												false);
										var i = "xn_authorizeAccessIFrame_"
												+ b._permformNum;
										b._authorizeAccessDialog
												._createOAuthDialogHandleObject();
										var h = "https://graph.renren.com/oauth/authorize?";
										var e = "redirect_uri="
												+ encodeURIComponent(c.redirect_uri);
										var k;
										if (c.response_type) {
											k = "response_type="
													+ c.response_type
										} else {
											k = "response_type=code"
										}
										var g = "client_id=" + c.client_id;
										var l = h + e + "&" + k + "&" + g;
										if (c.scope) {
											l += "&scope="
													+ encodeURIComponent(c.scope)
										}
										if (c.state) {
											l += "&state="
													+ encodeURIComponent(c.state)
										}
										l += "&display=iframe";
										var f = XN.XdComm.Server.singleton
												.createNamedIFrameDomNode(
														i,
														l,
														"xn_authorize_access_iframe",
														null);
										if (c.height) {
											f.style.height = c.height
										} else {
											f.style.height = "310px"
										}
										f.style.width = "500px";
										b._authorizeAccessDialog
												.set__content(f);
										var j = b._authorizeAccessDialog._header$2.parentNode;
										j.parentNode.removeChild(j);
										b._authorizeAccessDialog
												.add_closed(function(n) {
													b._authorizeAccessDialog = null;
													if (n) {
														d()
													} else {
														a()
													}
												});
										b._authorizeAccessDialog
												.set_placement(XN.UI.PopupPlacement.topCenter);
										b._authorizeAccessDialog
												.setContentWidth(500);
										b._authorizeAccessDialog.show()
									})
				},
				closeOAuthDialog : function(a) {
					var c = "OAuthDialog";
					var b = XN.UI.PopupDialog._xdClosingDialogDict$2[c];
					if (b) {
						XN.Debug.logLine(3, "Close dialog");
						b.close(a)
					} else {
						XN.Debug.logLine(1, "Invalid token to close dialog: "
								+ c)
					}
				},
				showAddSectionButton : function(f, b) {
					var e = XN.Connect._singleton;
					var d = {
						api_key : XN.Main.apiKey,
						section : f,
						channel_url : XN.XdComm.Server.singleton
								.get_receiverUrl()
					};
					var h = "xn_section" + f;
					var a = "xnShowAddSection_" + f;
					var c = XN.XdComm.Server.singleton
							.createNamedHiddenIFrame(
									h,
									XN.XdComm.Server.singleton
											.get_receiverUrl(),
									"xn_addSection",
									XN.Sys
											.format('style="width:130px; height:25px" frameborder="0" allowTransparency="true"'));
					b.appendChild(c);
					if (!XN.XdComm.Server.singleton.isDataHandlerRegistered(a)) {
						XN.XdComm.Server.singleton.registerDataHandler(a,
								function(i, j) {
									XN.Connect._showAddSectionDialog(i)
								})
					}
					var g = (window.self.frames)[h];
					e._postToConnectServerInIFrame(g.document,
							"connect/section_button.do", d)
				},
				_showAddSectionDialog : function(g) {
					var c = XN.Connect._singleton;
					if (c._addSectionDialog) {
						return false
					}
					XN.IFrameUtil.CanvasUtilServer.run(false);
					var h = {
						section : g,
						api_key : XN.Main.apiKey,
						channel_url : XN.XdComm.Server.singleton
								.get_receiverUrl()
					};
					c._addSectionNum++;
					var e = "xn_sectionIFrame_" + c._addSectionNum;
					var a = 0;
					var i = 0;
					var f = "";
					if (g === "info") {
						a = 718;
						i = 350;
						f = "Add application section to your Info tab?"
					} else {
						a = 430;
						i = 321;
						f = "Add application to your profile?"
					}
					var d = XN.XdComm.Server.singleton.createNamedHiddenIFrame(
							e, XN.XdComm.Server.singleton.get_receiverUrl(),
							"xn_addSection", 'frameborder="0"');
					d.style.height = XN.Sys.format("{0}px", i);
					d.style.width = XN.Sys.format("{0}px", a);
					var b = "xnCloseAddSection_" + g;
					c._addSectionDialog = XN.Connect._showStandardDialog(f, d,
							a, i);
					c._addSectionDialog.add_closed(function(j) {
						c._addSectionDialog = null
					});
					if (!XN.XdComm.Server.singleton.isDataHandlerRegistered(b)) {
						XN.XdComm.Server.singleton.registerDataHandler(b,
								function(k, j) {
									c._addSectionDialog.close(true)
								})
					}
					XNIntern.Utility.getIFrameDocument(e, d, function(j) {
						c._postToConnectServerInIFrame(j,
								"connect/prompt_section.do", h)
					});
					return true
				},
				showShareDialog : function(a, b) {
					XN_RequireFeatures( [ "Connect.Share" ], function() {
						XN.Connect.showShareDialog(a, b)
					})
				},
				showFeedDialog : function(b, a) {
					XN_RequireFeatures( [ "Connect.Feed" ], function() {
						XN.Connect.showFeedDialog(b, a)
					})
				},
				showDelayFeedDialog : function(a) {
					XN_RequireFeatures( [ "Connect.Feed" ], function() {
						XN.Connect.showDelayFeedDialog(a)
					})
				},
				formCheckbox : function() {
					var a = '<iframe frameborder="0" name="xniframe_canvas"src="'
							+ XNIntern.Utility.getConnectServerUrl("www")
							+ "ceFeed.do?api_key="
							+ XN.Main.apiKey
							+ "&preview=true&channel_url="
							+ encodeURIComponent(XN.XdComm.Server.singleton
									.get_receiverUrl())
							+ '" style="width: 100% ;height: 20px;"></iframe>';
					return a
				},
				sendCheckboxFeed : function(a) {
					XN.Connect.get_status().waitUntilReady(function(b) {
						var c = b;
						if (c != XN.ConnectState.connected) {
							return
						}
						XN.IFrameUtil.CanvasUtilServer.sendCheckboxFeed(a)
					})
				},
				formFeedInfo : function(i) {
					var d = i.template_bundle_id;
					var h = i.template_data;
					var g = i.body_general ? i.body_general : "";
					var k = i.callback;
					var f = i.user_message ? i.user_message : "";
					var a = XN.FeedStorySize.shortStory;
					var c = XN.RequireConnect.require;
					var b = {
						template_id : d.toString()
					};
					if (h) {
						b.template_data = h
					}
					if (g) {
						b.body_general = g
					}
					var e = XN.Connect._singleton;
					var j = {
						preview : "false",
						feed_info : XNIntern.JSON.serialize(b),
						api_key : XN.Main.apiKey,
						callback : k,
						channel_url : XN.XdComm.Server.singleton
								.get_receiverUrl(),
						user_message : f
					};
					j.session_key = XN.Main.apiClient.get_session().session_key;
					j.size = (a).toString();
					return j
				}
			},
			instance : {
				get__userInfo : function() {
					return this._userInfo
				},
				set__userInfo : function(a) {
					if (a !== this._userInfo) {
						this._userInfo = a;
						this._setInfoCookies(a)
					}
					return a
				},
				_getInfoFromCookies : function() {
					var a = XNIntern.JSON.deserialize(XNIntern.Cookie
							.getValue("xnsetting_" + XN.Main.apiKey));
					if (a
							&& (a.connectState === XN.ConnectState.userNotLoggedIn
									|| a.connectState === XN.ConnectState.appNotAuthorized || a.connectState === XN.ConnectState.connected)
							&& a.oneLineStorySetting > 0
							&& a.shortStorySetting > 0) {
						return a
					}
					return null
				},
				_setInfoCookies : function(a) {
					if (a && a.oneLineStorySetting > 0
							&& a.shortStorySetting > 0) {
						XNIntern.Cookie.set("xnsetting_" + XN.Main.apiKey,
								XNIntern.JSON.serialize(a), "/", XN.Main
										.get_baseDomain(), 1)
					} else {
						if (!a) {
							XNIntern.Cookie.clear(
									"xnsetting_" + XN.Main.apiKey, "/", XN.Main
											.get_baseDomain())
						}
					}
				},
				_ensureQueryStatus : function() {
					XN.Debug.logLine(2,
							"XN.Connect.get_status() -- _ensureQueryStatus(): loginStatus iframe created? "
									+ this._loginStatusIFrameCreated);
					if (!XN.XdComm.Server.singleton
							.isDataHandlerRegistered("refreshLoginStatus")) {
						XN.XdComm.Server.singleton.registerDataHandler(
								"refreshLoginStatus",
								XN.Connect.forceSessionRefresh)
					}
					if (!this._loginStatusIFrameCreated) {
						if (XN.Main.appSettings
								&& !XN.Main.appSettings.doNotUseCachedConnectState) {
							var a = this._getInfoFromCookies();
							if (XN.Debug.logLevel > 2) {
								XN.Debug.dump(a, "UserInfo from cookie")
							}
							if (a
									&& (a.connectState === XN.ConnectState.userNotLoggedIn
											|| a.connectState === XN.ConnectState.appNotAuthorized || a.connectState === XN.ConnectState.connected)) {
								this.set__userInfo(a);
								this._status.setResult(a.connectState)
							}
						}
						this._refreshQueryStatus()
					}
				},
				_refreshQueryStatus : function() {
					XN.Debug.logLine(2,
							"XN.Connect._refreshQueryStatus(): loginStatus iframe created? "
									+ this._loginStatusIFrameCreated
									+ ", poll count = " + this._pollTries);
					if (!this._loginStatusIFrameCreated || this._pollTries > 0) {
						this._loginStatusIFrameCreated = true;
						if (this._pollTries > 0) {
							this._pollTries--
						}
						this._setInfoCookies(null);
						if (!this._rpcServer) {
							this._rpcServer = new XN.XdComm.XdRpcServer(
									"loginServer",
									{
										InitLogin : XN.XdComm
												.$create_XdRpcMethodInfo(
														XN.Delegate
																.create(
																		this,
																		this._initLogin),
														null)
									})
						}
						this._ensureLoginHandler();
						XN.Debug
								.assert(XN.Main.apiKey, "API key can't be null");
						var a = XNIntern.Utility.getConnectServerUrl("www")
								+ "login_status.do?api_key="
								+ XN.Main.apiKey
								+ ((XN.Main.appSettings.fetchSignedPublicSessionData) ? "&public_session_data=1"
										: "")
								+ "&extern="
								+ !XN.Main.get_isInCanvas()
								+ "&channel="
								+ encodeURIComponent(XN.XdComm.Server.singleton
										.get_receiverUrl());
						XN.XdComm.Server.singleton.createNamedHiddenIFrame(
								"loginStatus", a, null, null)
					}
				},
				_ensureLoginHandler : function() {
					if (!XN.XdComm.Server.singleton
							.isDataHandlerRegistered("xnLogout")) {
						XN.XdComm.Server.singleton.registerDataHandler(
								"xnLogout", XN.Delegate.create(this,
										this._onLogoutHandler))
					}
				},
				_onLogoutHandler : function(b, a) {
					XN.Debug.logLine(2, "User logged out");
					if (this._logoutIframe) {
						if (this._logoutIframe.parentNode) {
							this._logoutIframe.parentNode
									.removeChild(this._logoutIframe)
						}
						this._logoutIframe = null
					}
					XN.Main.apiClient.set_session(null);
					this.set__userInfo(null);
					this._status.setResult(XN.ConnectState.userNotLoggedIn);
					if (this._logoutCallback) {
						this._logoutCallback(true)
					}
				},
				_setupSession : function(c) {
					var a = XN.Connect._singleton;
					if (this._dialogInfo) {
						a._feedStatusRefetch()
					} else {
						this._feedStatusMustBeRefetched = true;
						XN.Main.apiClient.set_session(c);
						var b = this._getInfoFromCookies();
						if (b) {
							b.connectState = XN.ConnectState.connected;
							b.shortStorySetting = XN.FeedStorySetting.preview;
							this.set__userInfo(b)
						}
					}
				},
				_feedStatusRefetch : function() {
					this._status.setResult(XN.ConnectState.connected, true);
					this._checkForPendingFeedDialog();
					this._loginStatusIFrameCreated = false;
					this._refreshQueryStatus();
					this._feedStatusMustBeRefetched = false
				},
				_closeAllDialogs : function(a) {
					XN.SessionDialog.closeAll();
					if (this._feedformDialog) {
						this._feedformDialog.close(false);
						this._feedformDialog = null
					}
					if (this._addSectionDialog) {
						this._addSectionDialog.close(false);
						this._addSectionDialog = null
					}
					if (this._permissionDialog) {
						this._permissionDialog.close(false);
						this._permissionDialog = null
					}
					if (a) {
						a()
					}
				},
				switchUser : function() {
					this._closeAllDialogs(XN.Delegate.create(this, function() {
						XN.Connect.requireSession(null)
					}))
				},
				_initLogin : function(i, e) {
					XN.Debug.logLine(2, "In XN.Connect._initLogin");
					if (XN.Debug.logLevel > 2) {
						XN.Debug.dump(i, "XN.Connect._initLogin arg");
						XN.Debug.dump(e, "XN.Connect._initLogin sender")
					}
					var h = i;
					var g = h.session;
					var d = h.settings;
					var c = h.connectState;
					var j = d.feedStorySettings;
					XN.Main.set_baseDomain(h.baseDomain);
					this._publicSessionData = h.publicSessionData;
					var f;
					var b;
					if (j) {
						f = j.one_line;
						b = j["short"]
					} else {
						f = XN.FeedStorySetting.doNotSend;
						b = XN.FeedStorySetting.doNotSend
					}
					if (d.loginMethod) {
						XN.Connect._loginMethod = d.loginMethod
					}
					if (d.logoutMethod) {
						XN.Connect._logoutMethod = d.logoutMethod
					}
					this.set__userInfo(XN.$create_UserInfoRecord(c, f, b,
							d.shareAuth));
					XN.Debug.logLine(2,
							"In XN.Connect._initLogin: got connectState = "
									+ XN.Enum.toString(XN.ConnectState, c));
					switch (c) {
					case XN.ConnectState.userNotLoggedIn:
						XN.Main.apiClient.set_session(null);
						this._status.setResult(XN.ConnectState.userNotLoggedIn);
						break;
					case XN.ConnectState.appNotAuthorized:
						XN.Main.apiClient.set_session(null);
						this._status
								.setResult(XN.ConnectState.appNotAuthorized);
						break;
					case XN.ConnectState.connected:
						var a = XN.Main.apiClient;
						if (XN.Main.appSettings
								&& XN.Main.appSettings.delayCookieOnClick) {
							XN.Connect.cacheCookie = g
						} else {
							if (!a.get_session()
									|| XNIntern.Utility.isConnectSession(a
											.get_session().session_key)
									|| !XN.Main.get_isInCanvas()) {
								a.set_session(g)
							}
						}
						this._status.setResult(XN.ConnectState.connected);
						break
					}
					if (c === XN.ConnectState.connected) {
						if (this._onConnectedCallback) {
							this._onConnectedCallback()
						}
						this._pollTries = 0;
						this._onConnectedCallback = null
					} else {
						if (this._pollTries > 0) {
							window.setTimeout(XN.Delegate.create(this,
									function() {
										this._refreshQueryStatus()
									}), this._pollInterval)
						} else {
							this._onConnectedCallback = null
						}
					}
					XN.Debug.logLine(4, "Out of XN.Connect._initLogin");
					return null
				},
				_checkForPendingFeedDialog : function() {
					var b = XN.Connect._singleton;
					var a = {
						template_bundle_id : b._dialogInfo.template_bundle_id,
						template_data : b._dialogInfo.template_data,
						body_general : b._dialogInfo.body_general,
						callback : b._dialogInfo.callback,
						user_message_prompt : b._dialogInfo.user_message_prompt,
						user_message : b._dialogInfo.user_message.value
					};
					if (b._dialogInfo) {
						XN.Connect.get_status().waitUntilReady(
								XN.Delegate.create(this, function(c) {
									window.setTimeout(XN.Delegate.create(this,
											function() {
												XN.Connect.showFeedDialog(a);
												b._dialogInfo = null
											}), 0)
								}))
					}
				},
				_apiClient_SessionReady : function(a) {
					this._status.setResult(XN.ConnectState.connected)
				},
				_postToConnectServerInIFrame : function(g, e, h) {
					g.open();
					var c = new XN.StringBuilder();
					c
							.append('\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" >\n<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title></title></head>\n<body>');
					c
							.append(XN.Sys
									.format(
											'<form method="post" action="{0}" id="tempform" name="tempform" accept-charset="UTF-8">',
											XNIntern.Utility
													.getConnectServerUrl("www")
													+ e));
					var b = h;
					for ( var a in b) {
						var f = {
							key : a,
							value : b[a]
						};
						c
								.append(XN.Sys
										.format(
												'<input type="hidden" name="{0}" id="{1}" value="{2}"  />',
												f.key, f.key, XN.Sys
														.htmlEncode(f.value)))
					}
					c
							.append("\n</form>\n    <script type=\"text/javascript\">\n      window.setTimeout(function(){document.forms['tempform'].submit();}, 0);\n    <\/script>\n</body>\n</html>\n        ");
					var d = c.toString();
					g.write(d);
					g.close()
				},
				_loginStatusIFrameCreated : false,
				_pollInterval : 0,
				_pollTries : 0,
				_onConnectedCallback : null,
				_feedStatusMustBeRefetched : false,
				_rpcServer : null,
				_feedformDialog : null,
				_addSectionDialog : null,
				_shareDialog : null,
				_permissionDialog : null,
				_feedformNum : 0,
				_shareformNum : 0,
				_permformNum : 0,
				_sessionlessFeedFrameNum : 0,
				_addSectionNum : 0,
				_dialogInfo : null,
				_userInfo : null,
				_logoutCallback : null,
				_logoutIframe : null,
				_sessionlessPublishCallback : null,
				_publicSessionData : null
			}
		});
XN.SessionDialog = XN.Type
		.createClass( {
			ctor : function() {
				this._connect = XN.Connect._singleton;
				this._channelUrl = XN.XdComm.Server.singleton.get_receiverUrl();
				this._cancelChannelUrl = XN.XdComm.Server.singleton
						.get_receiverUrl();
				this._apiKey = XN.Main.apiKey;
				this._initializeSession = true
			},
			static_ctor : function() {
				XN.SessionDialog._singleton = null
			},
			statics : {
				closeAll : function() {
					if (XN.SessionDialog._singleton) {
						XN.SessionDialog._singleton.destroy();
						XN.SessionDialog._singleton = null
					}
				},
				make : function() {
					XN.SessionDialog.closeAll();
					XN.SessionDialog._singleton = new XN.SessionDialog();
					return XN.SessionDialog._singleton
				},
				getActive : function() {
					if (XN.SessionDialog._singleton
							&& XN.SessionDialog._singleton.isActive()) {
						return XN.SessionDialog._singleton
					}
					return null
				}
			},
			instance : {
				setIsUserActionHint : function(a) {
					this._isUserActionHint = a;
					return this
				},
				setUseBrowserPopup : function(a) {
					this._forceBrowserPopup = a;
					return this
				},
				setTarget : function(a) {
					this._overrideTarget = a;
					return this
				},
				setInitializeSession : function(a) {
					this._initializeSession = a;
					return this
				},
				setChannelUrl : function(a) {
					this._channelUrl = a;
					return this
				},
				setCancelChannelUrl : function(a) {
					this._cancelChannelUrl = a;
					return this
				},
				setApiKey : function(a) {
					this._apiKey = a;
					return this
				},
				_onCancelLoginHandler : function(b, a) {
					this._cancelCallback()
				},
				_cancelCallback : function() {
					if (this.__cancelled) {
						this.__cancelled()
					}
					this.destroy()
				},
				_sessionCallback : function() {
					if (!this._session) {
						this._session = XN.Main.apiClient.get_session()
					}
					if (this.__sessionGranted) {
						this.__sessionGranted(this._session)
					}
					this.destroy()
				},
				_handleSession : function(a, b) {
					switch (a) {
					case XN.ConnectState.userNotLoggedIn:
						this._show(false, b);
						break;
					case XN.ConnectState.appNotAuthorized:
						this._show(true, b);
						break;
					default:
						break
					}
				},
				_ensureHandlers : function() {
					if (!XN.XdComm.Server.singleton
							.isDataHandlerRegistered("xnLogin")) {
						XN.XdComm.Server.singleton.registerDataHandler(
								"xnLogin", XN.Delegate.create(this,
										this._onLoginHandler))
					}
					if (!XN.XdComm.Server.singleton
							.isDataHandlerRegistered("xnCancelLogin")) {
						XN.XdComm.Server.singleton.registerDataHandler(
								"xnCancelLogin", XN.Delegate.create(this,
										this._onCancelLoginHandler))
					}
				},
				_onLoginHandler : function(d, b) {
					this._close();
					var c = XN.Connect._singleton;
					var e = d;
					var a = (d).split("&");
					this._session = XNIntern.JSON.deserialize(a[0], true);
					if (this._initializeSession) {
						this._connect._setupSession(this._session)
					} else {
						this._sessionCallback()
					}
				},
				_show : function(a, e) {
					this._ensureHandlers();
					var d = this._forceBrowserPopup
							|| (XN.Connect.get__useBrowserPopupForLogin() && !a);
					var c = false;
					if (d && !e) {
						d = false
					}
					if (XN.Main.apiClient) {
						XN.Main.apiClient.get_sessionWaitable().waitUntilReady(
								XN.Delegate.create(this._connect,
										this._connect._apiClient_SessionReady))
					}
					if (XN.Main.get_isInCanvas()) {
						this._showNativeDialog()
					} else {
						var b = this._createLoginUrl(d);
						if (!d && !c && !this._tosDialog) {
							this._showIframeLoginDialog(b, a)
						} else {
							if (d) {
								this._showBrowserPopupLogin(b);
								if (!this._loginWindow
										|| this._loginWindow == window) {
									c = true
								}
							}
						}
					}
					if (c) {
						XN.Debug
								.logLine(
										1,
										"Can't create login window because the call is not inside an user action event handler, will redirect instead");
						XN.Main.apiClient.requireLogin(null)
					}
				},
				_showNativeDialog : function() {
					if (this._isActive) {
						this._xnmlDialog = true;
						XN.CanvasClient.requireLogin(XN.Delegate.create(this,
								function(a) {
									this._session = XN.ApiClient
											.getSessionFromSigParams(a);
									if (this._initializeSession) {
										this._connect
												._setupSession(this._session)
									}
									this._sessionCallback()
								}), XN.Delegate.create(this,
								this._cancelCallback))
					}
				},
				_showBrowserPopupLogin : function(c) {
					var e = XNIntern.Utility.get_windowLocation();
					var b = XNIntern.Utility.get_windowSize();
					var d = XN.$create_Size(448, 426);
					var a = XN.$create_Point(
							Math.max(0, e.x + (b.w - d.w) / 2), Math.max(0, e.y
									+ (b.h - d.h) / 2));
					this._close();
					if (this._isActive) {
						this._loginWindow = window
								.open(
										c,
										"_blank",
										XN.Sys
												.format(
														"location=yes,left={0},top={1},width={2},height={3},resizable=yes",
														a.x, a.y, d.w, d.h),
										true)
					}
				},
				isActive : function() {
					if (this._isActive && this._loginWindow
							&& this._loginWindow.closed) {
						this._isActive = false
					}
					return this._isActive
				},
				focus : function() {
					if (this._loginWindow && !this._loginWindow.closed) {
						this._loginWindow.focus()
					}
				},
				_createLoginUrl : function(h) {
					var f, e;
					var b;
					if (h) {
						f = "_opener";
						e = "popup";
						b = XN.XdComm.PageRelation.opener
					} else {
						f = "_parent";
						e = "dialog";
						b = XN.XdComm.PageRelation.self
					}
					if (this._overrideTarget) {
						f = this._overrideTarget
					}
					var g = XNIntern.Uri.addQueryParameters(this._channelUrl,
							"xn_login&fname=" + f);
					var a = XNIntern.Utility.getLoginoutUrl("login");
					var d = XN.XdComm.Server.singleton.createUdpUrl(
							"xnCancelLogin", null, new XN.XdComm.EndPoint(null,
									b, this._cancelChannelUrl));
					var c = {
						return_session : 1,
						nochrome : 1,
						xnconnect : 1,
						connect_display : e,
						api_key : this._apiKey,
						v : XN.Main.version,
						next : g,
						cancel_url : d,
						channel_url : this._channelUrl
					};
					if (XN.Sys.containsKey(XN.Main.appSettings,
							"permsToRequestOnConnect")) {
						c.req_perms = XN.Main.appSettings.permsToRequestOnConnect
					}
					a = XNIntern.Uri.addQueryParameters(a, XNIntern.Uri
							.createQueryString(c));
					return a
				},
				_showIframeLoginDialog : function(c, a) {
					XN.IFrameUtil.CanvasUtilServer.run(true);
					var b = "\u4e0e\u4eba\u4eba\u8fde\u63a5";
					if (this._isActive) {
						this._tosDialog = new XN.UI.PopupDialog(b, null, true,
								false);
						var d = XN.XdComm.Server.singleton
								.createNamedIFrameDomNode("dialogContent", c,
										"xn_tosIFrame", null);
						if (!a) {
							d.style.height = "340px"
						} else {
							d.style.height = "288px"
						}
						this._tosDialog.set__content(d);
						this._tosDialog.add_closed(XN.Delegate.create(this,
								function(e) {
									this._tosDialog = null;
									if (!e) {
										this._cancelCallback()
									}
								}));
						this._tosDialog.show()
					}
				},
				request : function() {
					this._isActive = true;
					var a = XNIntern.Utility.get_isInUserActionCallstack()
							|| this._isUserActionHint;
					if (XN.Connect.get__useBrowserPopupForLogin()
							&& !XN.Connect.get_status().get_isReady() && a) {
						this._waitForDialog();
						this._handleSession(XN.ConnectState.userNotLoggedIn, a)
					} else {
						XN.Connect.get_status().waitUntilReady(
								XN.Delegate.create(this, function(b) {
									var c = b;
									if (c === XN.ConnectState.connected) {
										this._sessionCallback()
									} else {
										this._waitForDialog();
										this._handleSession(c, a)
									}
								}))
					}
					a = false
				},
				listen : function() {
					this._ensureHandlers()
				},
				_waitForDialog : function() {
					XN.Connect.get_status().waitForValue(
							XN.ConnectState.connected,
							XN.Delegate.create(this, this._sessionCallback))
				},
				_close : function() {
					if (this._tosDialog) {
						this._tosDialog.close(true);
						this._tosDialog = null
					}
					if (this._loginWindow) {
						this._loginWindow.close();
						this._loginWindow = null
					}
					if (this._xnmlDialog) {
						XN.CanvasClient.closeLogin();
						this._xnmlDialog = false
					}
					if (XNIntern.Expose) {
						XNIntern.Expose.clearShadow()
					}
				},
				destroy : function() {
					this._close();
					this.__sessionGranted = null;
					this.__cancelled = null;
					this._isActive = false;
					if (XN.XdComm.Server.singleton
							.isDataHandlerRegistered("xnLogin")) {
						XN.XdComm.Server.singleton
								.unregisterDataHandler("xnLogin")
					}
					if (XN.XdComm.Server.singleton
							.isDataHandlerRegistered("xnCancelLogin")) {
						XN.XdComm.Server.singleton
								.unregisterDataHandler("xnCancelLogin")
					}
				},
				add_sessionGranted : function(a) {
					this.__sessionGranted = XN.Delegate.combine(
							this.__sessionGranted, a)
				},
				remove_sessionGranted : function(a) {
					this.__sessionGranted = XN.Delegate.remove(
							this.__sessionGranted, a)
				},
				addSessionHandler : function(a) {
					this.add_sessionGranted(a);
					return this
				},
				add_cancelled : function(a) {
					this.__cancelled = XN.Delegate.combine(this.__cancelled, a)
				},
				remove_cancelled : function(a) {
					this.__cancelled = XN.Delegate.remove(this.__cancelled, a)
				},
				addCancelHandler : function(a) {
					this.add_cancelled(a);
					return this
				},
				__cancelled : null,
				__sessionGranted : null,
				_isActive : false,
				_isUserActionHint : true,
				_forceBrowserPopup : false,
				_loginWindow : null,
				_tosDialog : null,
				_xnmlDialog : false,
				_apiKey : null,
				_channelUrl : null,
				_cancelChannelUrl : null,
				_overrideTarget : null,
				_session : null,
				_initializeSession : false
			}
		});
XNIntern.LoginStatus = XN.Type
		.createClass( {
			ctor : function() {
			},
			instance : {
				init : function(d, f, c, b, i, e, a) {
					if (!this._rpcClient) {
						var g = new XN.XdComm.EndPoint(null,
								XN.XdComm.PageRelation.parent, d);
						if (XN.Sys.isNullOrEmpty(a)) {
							XN.Debug
									.logLine(
											1,
											"Disable use of postMessage because parent_window_url parameter is null or empty therefore we cannot securely send message using postMessage");
							XN.Bootstrap.siteVars.use_postMessage = false
						} else {
							g.origin = a
						}
						this._rpcClient = new XN.XdComm.XdRpcClient(
								"loginServer", "loginStatus", g)
					}
					var h = {
						session : f,
						settings : c,
						connectState : b,
						baseDomain : i,
						publicSessionData : e
					};
					this._rpcClient.send("InitLogin", h, null)
				},
				_rpcClient : null
			}
		});
XN.FeatureLoader.onScriptLoaded( [ "Connect" ]);
if (XN.Main.get_isInCanvas()) {
	XN_RequireFeatures( [ "CanvasUtil" ])
};