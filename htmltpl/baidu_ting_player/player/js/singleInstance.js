var singleInstance = function() {
	var methodName = "__methodName", argsValue = "__argsValue", features = "resizable=0,scrollbars=0,status=0,toolbar=0,menubar=0,location=0";
	var getSearchArgs = function(search) {
		search = search ? search : window.location.search;
		var qs = search.length > 0 ? search.substring(1) : "", args = {}, items = qs
				.split("&"), len = items.length;
		for ( var i = 0; i < len; i++) {
			var item = items[i].split("="), name = decodeURIComponent(item[0]), value = decodeURIComponent(item[1]);
			args[name] = value
		}
		return args
	};
	var validatorArgs = function(url) {
		var res = true;
		for ( var i = 0, len = url.length; i < len; i++) {
			var s = url.charAt(i), cc = url.charCodeAt(i);
			var reg = /^([\w_\,\.\% ]+)$/;
			res = reg.test(s) || cc > 255;
			if (!res) {
				break
			}
		}
		return res
	};
	var isTop = function() {
		return window.top === window.self
	};
	var fn = function(conf) {
		conf = conf || {};
		this.singlePage = conf.single || "", this.singleSuffix = conf.suffix
				|| "html", this.bridgePage = conf.bridge || "";
		this.height = conf.height || "";
		this.width = conf.width || "";
		this.top = conf.top || "";
		this.left = conf.left || "";
		this.path = conf.path || ""
	};
	fn.prototype = {
		openBox : function(method, args) {
			if (!validatorArgs(method + args)) {
				return
			}
			var _method = method ? (methodName + "=" + method) : "", _args = args ? ("&"
					+ argsValue + "=" + args)
					: "", _linksign = (_method || _args) ? "?" : "";
			var url = this.path + this.bridgePage + ".html" + _linksign
					+ _method + _args;
			var size = [];
			size.push("height=" + this.height);
			size.push("width=" + this.width);
			size.push("left=" + this.left);
			size.push("top=" + this.top);
			var w = window.open(url, this.bridgePage, features + ","
					+ size.join(","));
			w && w.focus()
		},
		initBridgePage : function(conf) {
			conf = conf || {};
			this.bridgePage = conf.bridge || "";
			this.singlePage = conf.single || "";
			this.singleSuffix = conf.suffix || "html";
			this.path = conf.path || "";
			if (isTop()) {
				location.href = this.singlePage + "." + this.singleSuffix
						+ location.search
			} else {
				window.name = this.getBridgeName();
				if (location.search) {
					var srh = getSearchArgs();
					var method = srh[methodName], args = srh[argsValue];
					if (validatorArgs(method + args)) {
						try {
							eval("top." + method + '("' + args + '")')
						} catch (e) {
						}
					} else {
						try {
							eval("top." + method + "(null)")
						} catch (e) {
						}
					}
				}
			}
		},
		initSinglePage : function(conf) {
			conf = conf || {};
			this.singlePage = conf.single || "";
			this.singleSuffix = conf.suffix || "html";
			this.path = conf.path || "";
			window.name = this.getSinglePageName();
			var hash = location.hash;
			if (hash.indexOf("#loaded") < 0) {
				if (location.search) {
					var srh = getSearchArgs();
					var method = srh[methodName], args = srh[argsValue];
					if (validatorArgs(method + args)) {
						try {
							eval(method + '("' + args + '")');
						} catch (e) {
						}
					} else {
						try {
							eval("top." + method + "(null)")
						} catch (e) {
						}
					}
				}
			}
		},
		getSinglePageName : function() {
			return this.singlePage
		},
		getBridgeName : function() {
			return this.bridgePage
		}
	};
	return fn
}();