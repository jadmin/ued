XN.Type.createNamespace("XN.Cache");
XN.Cache.$create__cachedItem = function XN_Cache__cachedItem(b, c) {
	var a = {};
	a.data = b;
	a.createTime = c;
	return a
};
XN.Cache.$create__JSCacheMap = function XN_Cache__JSCacheMap() {
	return {}
};
XN.Cache.CacheManager = XN.Type
		.createClass( {
			ctor : function() {
			},
			static_ctor : function() {
				XN.Cache.CacheManager._initialized = new XN.SimpleWaitable();
				XN.Cache.CacheManager._jsCacheMap = XN.Cache.$create__JSCacheMap
			},
			statics : {
				clearAll : function() {
					if (XN.Bootstrap.siteVars.use_flash
							&& XNIntern.Flash.get_xdComm()) {
						XNIntern.Flash.get_xdComm().waitUntilReady(function(a) {
							(a).clearAllCache()
						})
					} else {
						XN.Cache.CacheManager._jsCacheMap = XN.Cache.$create__JSCacheMap
					}
				},
				_changeContext : function(a) {
					if (XN.Bootstrap.siteVars.use_flash
							&& XNIntern.Flash.hasRequireVersion()) {
						XNIntern.Flash.get_xdComm().waitUntilReady(
								function(b) {
									XN.Debug.logLine(3,
											"CacheManager.ChangeContext to "
													+ a);
									(b).setCacheContext(a);
									XN.Cache.CacheManager._initialized
											.setResult(true)
								})
					} else {
						XN.Cache.CacheManager._jsCacheMap = XN.Cache.$create__JSCacheMap;
						XN.Cache.CacheManager._initialized.setResult(true)
					}
				},
				_getValue : function(b) {
					if (XN.Bootstrap.siteVars.use_flash) {
						try {
							var a = XNIntern.Flash.get_xdComm();
							if (a && a.get_isReady()) {
								var c = (a.result).getCache(b);
								if (c) {
									c = XNIntern.Flash.decode(c);
									if (XN.Debug.logLevel > 4) {
										XN.Debug
												.writeLine("CacheManager.GetValue key = "
														+ b
														+ ", returns value = "
														+ c)
									}
									return XNIntern.JSON.deserialize(c)
								}
							}
						} catch (d) {
							XN.Debug.logLine(1,
									"CacheManager.GetValue failed on key " + b
											+ " exception=" + d.toString())
						}
					}
					XN.Debug.logLine(4,
							"CacheManager.GetValue from JS for key = " + b);
					return XN.Cache.CacheManager._jsCacheMap[b]
				},
				_setValue : function(b, d) {
					if (XN.Bootstrap.siteVars.use_flash) {
						try {
							var a = XNIntern.Flash.get_xdComm();
							if (a && a.get_isReady()) {
								var c = XNIntern.JSON.serialize(d);
								if (XN.Debug.logLevel > 4) {
									XN.Debug
											.writeLine("CacheManager.SetValue key="
													+ b + ", value=" + c)
								}
								(a.result).setCache(b, XNIntern.JSON
										.serialize(d));
								return
							}
						} catch (f) {
							XN.Debug.logLine(1,
									"CacheManager.SetValue failed on key " + b
											+ " exception=" + f.toString())
						}
					}
					XN.Debug.logLine(4, "CacheManager.SetValue to JS for key="
							+ b + ", value=" + c);
					XN.Cache.CacheManager._jsCacheMap[b] = d
				},
				get__initialized : function() {
					return XN.Cache.CacheManager._initialized
				}
			}
		});
XN.Type.createNamespace("XN.EXNML.Common");
XN.EXNML.Common.Constants = XN.Type.createClass( {
	ctor : function() {
	},
	static_ctor : function() {
		XN.EXNML.Common.Constants.GENDER_MALE_SINGULAR = "male";
		XN.EXNML.Common.Constants.GENDER_FEMALE_SINGULAR = "female"
	}
});
XN.Type.createNamespace("XN.EXNML");
XN.EXNML.OperatorType = XN.Type.createEnum( {
	and : 0,
	or : 1,
	xor : 2,
	not : 3,
	greaterThan : 4,
	lessThan : 5,
	equals : 6
}, false);
XN.EXNML._elementState = XN.Type.createEnum( {
	none : 0,
	onProcessCalled : 1,
	onDataReadyCalled : 2,
	waitForCondition : 4,
	ready : 8
}, false);
XN.EXNML.$create_ElementsRegistration = function XN_EXNML_ElementsRegistration(
		b, c, a) {
	var d = {};
	d.nameSpace = b;
	d.name = c;
	d.implementationType = a;
	return d
};
XN.EXNML.Element = XN.Type
		.createClass( {
			ctor : function(a) {
				this._dependents = new XN.DependentWaitable();
				this.domElement = a;
				this.domElement._xnElement = this
			},
			statics : {
				_fromDomElement : function(a) {
					return a._xnElement
				}
			},
			instance : {
				process : function() {
					if (XN.Debug.logLevel > 2) {
						XN.Debug.dump(this.domElement,
								"Start processing XNML tag")
					}
					this._state = XN.EXNML._elementState.none;
					var conditionAttribute = this._getAttribute("condition",
							null);
					if (conditionAttribute) {
						if (typeof (conditionAttribute) === "string") {
							this._conditionResult = eval(conditionAttribute)
						} else {
							XN.Debug.assert(
									typeof (conditionAttribute) === "function",
									"Invalid condition value");
							var conditionFunction = conditionAttribute;
							this._conditionResult = conditionFunction()
						}
					}
					var result = true;
					var resultReady = true;
					var pendingResult = this._conditionResult;
					if (!XN.Sys.isNullOrUndefined(this._conditionResult)) {
						if (XN.Type.getInstanceType(this._conditionResult) === Boolean) {
							result = this._conditionResult
						} else {
							resultReady = pendingResult.get_isReady();
							result = pendingResult.result
						}
					}
					if (!resultReady) {
						this._state |= XN.EXNML._elementState.waitForCondition;
						(this._conditionResult).add_changed(XN.Delegate.create(
								this, this._onConditionChanged))
					}
					if ((resultReady && result)
							|| (!resultReady && !this._getAttribute(
									"noPreProcess", false))) {
						this.onProcess();
						this._state |= XN.EXNML._elementState.onProcessCalled;
						this._checkDataReady()
					} else {
						if (resultReady && !result) {
							this.onConditionFalse();
							this.set_isReady(true)
						}
					}
				},
				refresh : function() {
					if ((this._state & XN.EXNML._elementState.waitForCondition)
							&& this._conditionResult) {
						(this._conditionResult).remove_changed(XN.Delegate
								.create(this, this._onConditionChanged))
					}
					this._state = XN.EXNML._elementState.none;
					this._conditionResult = null;
					this._dependents.resetChange();
					this._dependents.removeAll();
					XN.UI.UIElement.removeCssClass(this.domElement,
							"XN_ElementReady");
					this.clearVisual();
					this.process()
				},
				_onConditionChanged : function(a) {
					if (a.get_isReady()) {
						a.remove_changed(XN.Delegate.create(this,
								this._onConditionChanged));
						this._state &= ~XN.EXNML._elementState.waitForCondition;
						if (a.result) {
							if (!(this._state & XN.EXNML._elementState.onProcessCalled)) {
								this.onProcess();
								this._state |= XN.EXNML._elementState.onProcessCalled
							}
							this._checkDataReady()
						} else {
							this.onConditionFalse();
							this.set_isReady(true)
						}
					}
				},
				onConditionFalse : function() {
					XN.UI.UIElement.addCssClass(this.domElement,
							"XN_ElementConditionFalse");
					this.domElement.style.display = "none"
				},
				get_isReady : function() {
					return (this._state & XN.EXNML._elementState.ready)
				},
				set_isReady : function(a) {
					if (a !== this.get_isReady()) {
						if (a) {
							this._state |= XN.EXNML._elementState.ready
						} else {
							this._state &= ~XN.EXNML._elementState.ready
						}
						if (a) {
							XN.UI.UIElement.addCssClass(this.domElement,
									"XN_ElementReady")
						} else {
							XN.UI.UIElement.removeCssClass(this.domElement,
									"XN_ElementReady")
						}
						if (this.__isReadyChanged) {
							this.__isReadyChanged(this, null)
						}
					}
					return a
				},
				onProcess : function() {
				},
				onDataReady : function() {
				},
				clearVisual : function() {
					this.domElement.innerHTML = ""
				},
				_getAttributeFromList : function(b, a, e) {
					var f = this._getAttribute(b, a);
					var c = new XN.ArrayEnumerator(e);
					while (c.moveNext()) {
						var d = c.get_current();
						if (f === d) {
							return d
						}
					}
					return a
				},
				_getAttribute : function(b, a) {
					var c = this.domElement.getAttribute(b);
					if (!c) {
						c = a
					}
					return c
				},
				_getBoolAttribute : function(b, a) {
					var d = a;
					var c = this.domElement.getAttribute(b);
					if (c) {
						d = XN.Sys.parseBool(c)
					}
					return d
				},
				addDataToWait : function(a) {
					this._dependents.addDependent(a)
				},
				_checkDataReady : function() {
					if (this._dependents.get_isReady()) {
						if (!(this._state & XN.EXNML._elementState.waitForCondition)) {
							this.onDataReady()
						}
					} else {
						this._dependents.waitUntilReady(XN.Delegate.create(
								this, function(a) {
									this._checkDataReady()
								}))
					}
				},
				add_isReadyChanged : function(a) {
					this.__isReadyChanged = XN.Delegate.combine(
							this.__isReadyChanged, a)
				},
				remove_isReadyChanged : function(a) {
					this.__isReadyChanged = XN.Delegate.remove(
							this.__isReadyChanged, a)
				},
				__isReadyChanged : null,
				domElement : null,
				_conditionResult : null,
				_state : 0
			}
		});
XN.EXNML.Operator = XN.Type
		.createClass( {
			base : XN.DependentWaitable,
			ctor : function(d, b) {
				XN.EXNML.Operator.constructBase(this);
				this._op$2 = d;
				this._operands$2 = b;
				var c = new XN.ArrayEnumerator(b);
				while (c.moveNext()) {
					var a = c.get_current();
					if (XN.Sys.isAssignableFrom(XN.Type.getInstanceType(a),
							XN.Waitable)) {
						this.addDependent(a)
					}
				}
			},
			statics : {
				and : function(b, a) {
					return new XN.EXNML.Operator(XN.EXNML.OperatorType.and, [
							b, a ])
				},
				or : function(b, a) {
					return new XN.EXNML.Operator(XN.EXNML.OperatorType.or, [ b,
							a ])
				},
				xor : function(b, a) {
					return new XN.EXNML.Operator(XN.EXNML.OperatorType.xor, [
							b, a ])
				},
				not : function(a) {
					return new XN.EXNML.Operator(XN.EXNML.OperatorType.not,
							[ a ])
				},
				greaterThan : function(b, a) {
					return new XN.EXNML.Operator(
							XN.EXNML.OperatorType.greaterThan, [ b, a ])
				},
				lessThan : function(b, a) {
					return new XN.EXNML.Operator(
							XN.EXNML.OperatorType.lessThan, [ b, a ])
				},
				equals : function(b, a) {
					return new XN.EXNML.Operator(XN.EXNML.OperatorType.equals,
							[ b, a ])
				}
			},
			instance : {
				onChange : function() {
					this._evaluate$2();
					XN.EXNML.Operator.callBase(this, "onChange")
				},
				_evaluate$2 : function() {
					switch (this._op$2) {
					case XN.EXNML.OperatorType.and:
						this.result = this._getOperandValue$2(0)
								&& this._getOperandValue$2(1);
						break;
					case XN.EXNML.OperatorType.not:
						this.result = !this._getOperandValue$2(0);
						break;
					case XN.EXNML.OperatorType.or:
						this.result = this._getOperandValue$2(0)
								|| this._getOperandValue$2(1);
						break;
					case XN.EXNML.OperatorType.xor:
						this.result = this._getOperandValue$2(0)
								^ this._getOperandValue$2(1);
						break;
					case XN.EXNML.OperatorType.greaterThan:
						this.result = this._getOperandValue$2(0) > this
								._getOperandValue$2(1);
						break;
					case XN.EXNML.OperatorType.lessThan:
						this.result = this._getOperandValue$2(0) < this
								._getOperandValue$2(1);
						break;
					case XN.EXNML.OperatorType.equals:
						this.result = this._getOperandValue$2(0) === this
								._getOperandValue$2(1);
						break
					}
				},
				_getOperandValue$2 : function(a) {
					var b = this._operands$2[a];
					if (XN.Sys.isAssignableFrom(XN.Type.getInstanceType(b),
							XN.Waitable)) {
						return (b).result
					} else {
						return b
					}
				},
				_op$2 : 0,
				_operands$2 : null
			}
		});
XN.EXNML.Conditions = XN.Type.createClass( {
	ctor : function() {
	},
	static_ctor : function() {
		XN.EXNML.Conditions._table = new XN.EXNML._permisionTable()
	},
	statics : {
		ifCanSee : function(a, b) {
			return XN.EXNML.Conditions._table.ifCanSee(a, b)
		}
	}
});
XN.EXNML._permisionTable = XN.Type
		.createClass( {
			ctor : function() {
				this._calls = {}
			},
			instance : {
				ifCanSee : function(e, f) {
					var d = e + f;
					var a;
					var b = this._calls[d];
					if (!b) {
						a = new XN.PendingResult();
						b = {
							uid : e,
							what : f,
							result : a
						};
						this._calls[d] = b;
						var c = XN.EXNML.Context.singleton;
						if (!this._subscribedToEvent) {
							c.add_beforeSendBatchRequest(XN.Delegate.create(
									this, this._beforeSendBatchRequest));
							this._subscribedToEvent = true
						}
						c.requestBatchProcess()
					} else {
						a = b.result
					}
					return a
				},
				_beforeSendBatchRequest : function() {
					var h = [];
					var f = [];
					var a = [];
					var e = this._calls;
					for ( var c in e) {
						var g = {
							key : c,
							value : e[c]
						};
						var b = g.value;
						XN.Sys.add(h, b.uid);
						XN.Sys.add(f, b.what);
						XN.Sys.add(a, b.result)
					}
					this._calls = {};
					var d = XN.Main.apiClient.privacy_canSee(h, f,
							XN.EXNML.Context.singleton.get_batchSequencer());
					d
							.waitUntilReady(XN.Delegate
									.create(
											this,
											function(k) {
												var m = a.length;
												var l = d.result;
												if (l) {
													XN.Debug
															.assert(
																	m === l.length,
																	"Returns results does not contains the exepcted number of items");
													for ( var j = 0; j < m; j++) {
														(a[j])
																.setPendingResult(
																		l[j],
																		d.exception)
													}
												} else {
													for ( var j = 0; j < m; j++) {
														(a[j])
																.setPendingResult(
																		null,
																		d.exception)
													}
												}
											}))
				},
				_subscribedToEvent : false
			}
		});
XN.Type.createNamespace("XN.EXNML.Cache");
XN.EXNML.Cache.UserCache = XN.Type.createClass( {
	ctor : function() {
		this._timerId = -1;
		this._xnml_cache_max_age = XN.Bootstrap.siteVars.xnml_cache_max_age;
		this._pendingResults = [];
		this._pendingUids = [];
		this._pendingFields = []
	},
	statics : {
		findUserInfo : function(d, b) {
			for ( var c = 0; c < b.length; c++) {
				var a = b[c];
				if (a && a.uid && a.uid == d) {
					return a
				}
			}
			return null
		}
	},
	instance : {
		get : function(d, c) {
			var a = new XN.PendingResult();
			var f = this.get_cacheKey(d);
			var k = XN.Cache.CacheManager._getValue(f);
			var b = 0;
			if (k) {
				var h = (new Date()).getTime() - k.createTime;
				if (h < this._xnml_cache_max_age) {
					var g = false;
					var e = k.data;
					var j = XN.EXNML.Cache.UserCache.findUserInfo(d, e);
					if (j) {
						for (b = 0; b < c.length; b++) {
							if (typeof (j[c[b]]) == "undefined") {
								g = true
							}
						}
					}
					if (!g) {
						XN.Debug.logLine(5,
								"UserCache get: got valid result from cache for uid = "
										+ d);
						a.setPendingResult(k.data, null);
						return a
					}
				}
			}
			if (!XN.Sys.contains(this._pendingUids, d)) {
				XN.Sys.add(this._pendingUids, d)
			}
			for (b = 0; b < c.length; b++) {
				if (!XN.Sys.contains(this._pendingFields, c[b])) {
					XN.Sys.add(this._pendingFields, c[b])
				}
			}
			XN.Sys.add(this._pendingResults, a);
			if (this._timerId === -1) {
				this._timerId = window.setTimeout(XN.Delegate.create(this,
						function() {
							this.get_UserDataFromRest()
						}), 0)
			}
			return a
		},
		get_UserDataFromRest : function() {
			this._timerId = -1;
			var b = XN.Sys.copyArray(this._pendingResults);
			this._pendingResults = [];
			var c = XN.Sys.copyArray(this._pendingUids);
			this._pendingUids = [];
			var a = XN.Sys.copyArray(this._pendingFields);
			this._pendingFields = [];
			XN.Main.apiClient.users_getInfo(c.join(","), a.join(","),
					XN.Delegate.create(this, function(d, j) {
						if (!j) {
							var f = (new Date()).getTime();
							var k = XN.Cache.$create__cachedItem(d, f);
							var h = 0;
							for (h = 0; h < c.length; h++) {
								var g = c[h];
								var l = this.get_cacheKey(g);
								XN.Cache.CacheManager._setValue(l, k)
							}
							for (h = 0; h < b.length; h++) {
								var e = b[h];
								e.setPendingResult(d, j)
							}
						}
					}))
		},
		get_cacheKey : function(a) {
			return "user_cache_v1.0_" + a.toString()
		},
		_xnml_cache_max_age : 0,
		_timerId : -1
	}
});
XN.EXNML.Context = XN.Type
		.createClass( {
			ctor : function() {
				this.resources = new XN.EXNML.Resources.ResourceDict();
				this.userCache = null;
				this._timerId = -1;
				this._connectStatus = XN.ConnectState.userNotLoggedIn;
				XN.Main.add_initCalled(XN.Delegate.create(this, this.init))
			},
			static_ctor : function() {
				XN.EXNML.Context.singleton = null;
				XN.EXNML.Context.singleton = new XN.EXNML.Context()
			},
			instance : {
				init : function() {
					XN.Debug.logLine(2, "Start constructing XN.EXNML.Context!");
					if (XN.FeatureLoader.singleton
							.isFeatureRequestedAndLoaded("EXNML")) {
						if (!this._initialized) {
							this._initialized = true;
							XN.Debug
									.logLine(2,
											"In XN.EXNML.Context: before call XN.Connect.get_status()");
							this._connectStatus = XN.Connect.get_status().result;
							this._connectStatusReady = XN.Connect.get_status()
									.get_isReady();
							XN.Debug
									.logLine(2,
											"In XN.EXNML.Context: before call XN.Cache.CacheManager._changeContext()");
							XN.Cache.CacheManager._changeContext(XN.Connect
									.get_loggedInUser());
							XN.Connect.get_status().add_changed(
									XN.Delegate.create(this,
											this._onConnectStatusChanged))
						}
						if (XN.EXNML.Host.autoParseDomTree) {
							XN.EXNML.Host.parseDomTree()
						}
					} else {
						XN.Debug
								.logLine(
										4,
										"Skip EXNML.Context initialization because EXNML feature is not loaded by request")
					}
				},
				requestBatchProcess : function() {
					if (this._timerId === -1) {
						this._timerId = window.setTimeout(XN.Delegate.create(
								this, this._onTimer), 0)
					}
				},
				get_batchSequencer : function() {
					if (!this._batchSequencer) {
						this._batchSequencer = new XN.BatchSequencer();
						this._batchSequencer.isParallel = true;
						this.requestBatchProcess()
					}
					return this._batchSequencer
				},
				_onTimer : function() {
					XN.Connect.get_status().waitUntilReady(
							XN.Delegate.create(this, function(a) {
								if (this.__beforeSendBatchRequest) {
									this.__beforeSendBatchRequest()
								}
								this._timerId = -1;
								if (this._batchSequencer) {
									this._batchSequencer.execute(null);
									this._batchSequencer = null
								}
							}))
				},
				getUserCache : function() {
					if (!this.userCache) {
						this.userCache = new XN.EXNML.Cache.UserCache()
					}
					return this.userCache
				},
				get_unconnectedFriendsCount : function() {
					if (!this._unconnectedFriendsCount) {
						this._unconnectedFriendsCount = new XN.PendingResult();
						XN.Connect
								.get_status()
								.waitUntilReady(
										XN.Delegate
												.create(
														this,
														function(e) {
															var d = XN.Cache.CacheManager
																	._getValue("UnconnectedFriendsCount");
															var b = true;
															if (d) {
																var a = (new Date())
																		.getTime()
																		- d.createTime;
																if (a < XN.Cache.CacheManager._maxUsableAge) {
																	this._unconnectedFriendsCount
																			.setPendingResult(
																					d.data,
																					null);
																	if (a < XN.Cache.CacheManager._refreshInternal) {
																		b = false
																	}
																}
															}
															if (b) {
																var c = XN.Main.apiClient
																		.connect_getUnconnectedFriendsCount(this
																				.get_batchSequencer());
																c
																		.waitUntilReady(XN.Delegate
																				.create(
																						this,
																						function(
																								f) {
																							this._unconnectedFriendsCount
																									.setPendingResult(
																											c.result,
																											c.exception);
																							XN.Cache.CacheManager
																									._setValue(
																											"UnconnectedFriendsCount",
																											XN.Cache
																													.$create__cachedItem(
																															c.result,
																															(new Date())
																																	.getTime()))
																						}))
															}
														}))
					}
					return this._unconnectedFriendsCount
				},
				_onConnectStatusChanged : function(a) {
					XN.Debug.logLine(2,
							"In XN.EXNML.Context_onConnectStatusChanged");
					var b = XN.Connect.get_status().result;
					XN.Cache.CacheManager._changeContext(XN.Connect
							.get_loggedInUser());
					if (this._connectStatusReady && b !== this._connectStatus
							&& b === XN.ConnectState.connected) {
						this._onConnectStateChangedToConnected()
					}
					this._connectStatusReady = XN.Connect.get_status()
							.get_isReady();
					this._connectStatus = b
				},
				_onConnectStateChangedToConnected : function() {
					XN.Debug
							.logLine(2,
									"Connect state changed from from ready but unconnected to ready and connected");
					this.userCache = null;
					this._unconnectedFriendsCount = null;
					XN.EXNML.Host.refresh()
				},
				add_beforeSendBatchRequest : function(a) {
					this.__beforeSendBatchRequest = XN.Delegate.combine(
							this.__beforeSendBatchRequest, a)
				},
				remove_beforeSendBatchRequest : function(a) {
					this.__beforeSendBatchRequest = XN.Delegate.remove(
							this.__beforeSendBatchRequest, a)
				},
				userCache : null,
				__beforeSendBatchRequest : null,
				_batchSequencer : null,
				_unconnectedFriendsCount : null,
				_connectStatusReady : false,
				_initialized : false
			}
		});
XN.EXNML.Host = XN.Type
		.createClass( {
			ctor : function() {
			},
			static_ctor : function() {
				XN.EXNML.Host.autoParseDomTree = true;
				XN.EXNML.Host._xnmlElements = [];
				XN.EXNML.Host._registeredElements = null;
				XN.EXNML.Host._areElementsReady = new XN.SimpleWaitable();
				XN.EXNML.Host._readyElementsCount = 0;
				XN.UI.DomResources
						.addResourceDict(new XN.UI.DomResDict(
								'<a id="RES_ID_xn_login"><img id="xn_login_image" class="xnconnect_login_button"/></a>\n<a id="RES_ID_xn_share" class="xnconnect_share_button"><img id="xn_share_image" /></a>'));
				var a = [
						XN.EXNML.$create_ElementsRegistration("xn",
								"login-button", "XN.EXNML.LoginButton"),
						XN.EXNML.$create_ElementsRegistration("xn", "name",
								"XN.EXNML.Name"),
						XN.EXNML.$create_ElementsRegistration("xn",
								"profile-pic", "XN.EXNML.ProfilePic"),
						XN.EXNML.$create_ElementsRegistration("xn",
								"container", "XN.EXNML.ContainerElement"),
						XN.EXNML.$create_ElementsRegistration("xn",
								"serverxnml", "XN.EXNML.ServerXnml"),
						XN.EXNML.$create_ElementsRegistration("xn",
								"share-button", "XN.EXNML.ShareButton"),
						XN.EXNML.$create_ElementsRegistration("xn",
								"live-stream", "XN.EXNML.LiveStream"),
						XN.EXNML.$create_ElementsRegistration("xn",
								"friendpile", "XN.EXNML.Friendpile") ];
				XN.EXNML.Host._registeredElements = (a)
			},
			statics : {
				registerCustomTag : function(b, c, a) {
					XN.Sys.add(XN.EXNML.Host._registeredElements, XN.EXNML
							.$create_ElementsRegistration(b, c, a))
				},
				parseDomTree : function(dom) {
					XN.Debug.logLine(2,
							"In starting of XN.EXNML.Host.parseDomTree...");
					XN.Cache.CacheManager
							.get__initialized()
							.waitUntilReady(
									function(isCacheReady) {
										XN.Debug
												.logLine(
														2,
														"XN.EXNML.Host.parseDomTree starts to run after XN.Cache.CacheManager initialized!");
										var domElement = dom || document.body, peddingElems = [], tagTypes = [], loadedTypes = 0, processElement = function() {
											if (tagTypes.length != loadedTypes) {
												return
											}
											for ( var i = 0; i < peddingElems.length; i++) {
												var peddingElem = peddingElems[i], fn = eval(peddingElem.type);
												if (fn
														&& !XN.EXNML.Element
																._fromDomElement(peddingElem.dom)) {
													XN.EXNML.Host
															._addElementToList(new fn(
																	peddingElem.dom))
												}
											}
											var length = XN.EXNML.Host._xnmlElements.length;
											if (length > 0) {
												XN.EXNML.Host._readyElementsCount = 0;
												XN.EXNML.Host._areElementsReady
														.setResult(false, true);
												XN.Connect
														.get_status()
														.waitUntilReady(
																function(r) {
																	for ( var i = 0; i < length; i++) {
																		var element = XN.EXNML.Host._xnmlElements[i];
																		element
																				.process()
																	}
																})
											}
										};
										var $enum1 = new XN.ArrayEnumerator(
												XN.EXNML.Host._registeredElements);
										while ($enum1.moveNext()) {
											var entry = $enum1.get_current();
											var xnmlDoms = XN.EXNML.ConnectUtility
													.getElementsByTagNameNS(
															domElement,
															entry.nameSpace,
															entry.name);
											for ( var i = 0; i < xnmlDoms.length; i++) {
												var element = XN.EXNML.Element
														._fromDomElement(xnmlDoms[i]);
												if (!element) {
													var fn = eval(entry.implementationType);
													if (fn) {
														element = new fn(
																xnmlDoms[i]);
														XN.EXNML.Host
																._addElementToList(element)
													} else {
														XN.Sys
																.add(
																		peddingElems,
																		{
																			type : entry.implementationType,
																			dom : xnmlDoms[i]
																		});
														var tagType = entry.implementationType
																.replace("XN.",
																		"");
														if (!XN.Sys.contains(
																tagTypes,
																tagType)) {
															XN.Sys.add(
																	tagTypes,
																	tagType);
															XN_RequireFeatures(
																	[ tagType ],
																	function() {
																		loadedTypes++;
																		processElement()
																	})
														}
													}
												}
											}
										}
										processElement()
									})
				},
				refresh : function() {
					var c = XN.EXNML.Host._xnmlElements.length;
					if (c > 0) {
						XN.Debug
								.logLine(2,
										"Host.Refresh: refresh all existing EXNML elements");
						XN.EXNML.Host._readyElementsCount = 0;
						XN.EXNML.Host._areElementsReady.setResult(false, true);
						for ( var b = 0; b < c; b++) {
							var a = XN.EXNML.Host._xnmlElements[b];
							a.refresh()
						}
					}
				},
				get_areElementsReady : function() {
					return XN.EXNML.Host._areElementsReady
				},
				addElement : function(a) {
					XN.Connect.get_status().waitUntilReady(
							function(b) {
								XN.Cache.CacheManager.get__initialized()
										.waitUntilReady(function(c) {
											XN.EXNML.Host._addElementToList(a);
											a.process()
										})
							})
				},
				addElements : function(c) {
					var b = new XN.ArrayEnumerator(c);
					while (b.moveNext()) {
						var a = b.get_current();
						XN.EXNML.Host.addElement(a)
					}
				},
				_addElementToList : function(a) {
					XN.Sys.add(XN.EXNML.Host._xnmlElements, a);
					if (a.get_isReady()) {
						XN.EXNML.Host._readyElementsCount++;
						XN.EXNML.Host._checkReadyState()
					} else {
						a
								.add_isReadyChanged(XN.EXNML.Host._elementIsReadyChanged)
					}
				},
				_elementIsReadyChanged : function(a, b) {
					(a)
							.remove_isReadyChanged(XN.EXNML.Host._elementIsReadyChanged);
					XN.EXNML.Host._readyElementsCount++;
					XN.EXNML.Host._checkReadyState()
				},
				_checkReadyState : function() {
					var a = XN.EXNML.Host._readyElementsCount === XN.EXNML.Host._xnmlElements.length;
					if (a && !XN.EXNML.Host._areElementsReady.get_isReady()) {
						XN.EXNML.Host._areElementsReady.setResult(true)
					}
				}
			}
		});
XN.EXNML.ConnectUtility = XN.Type
		.createClass( {
			ctor : function() {
			},
			statics : {
				upperCaseFirstChar : function(a) {
					if (a.length > 0) {
						return a.substr(0, 1).toUpperCase() + a.substr(1)
					} else {
						return a
					}
				},
				getElementsByTagNameNS : function(c, f, b) {
					var a = null;
					switch (XNIntern.AppInfo.get_singleton().get_hostInfo()
							.get_hostName()) {
					case XNIntern.HostName.MOZILLA:
						b = f + ":" + b;
						a = c.getElementsByTagNameNS("*", b);
						break;
					case XNIntern.HostName.SAFARI:
					case XNIntern.HostName.OPERA:
						b = f + ":" + b;
						a = c.getElementsByTagName(b);
						break;
					case XNIntern.HostName.IE:
						var e = document.namespaces;
						if (e && XN.Sys.containsKey(e, f)) {
							a = c.getElementsByTagName(b)
						} else {
							b = f + ":" + b;
							a = c.getElementsByTagName(b);
							if (a && a.length > 0) {
								var d = "You appear to be using the EXNML tag "
										+ b
										+ " in your HTML markup. However, you are missing corresponding xmlns attribute in your <HTML> tag. That xmlns attribute is required in Internet Explorer. For example, to use EXNML tags with the 'xn' namespace such as <xn:login-button></xn:login-button>, you must place xmlns:xn=\"http://www."
										+ Connect_Config.domain
										+ '/2009/xnml" in the <HTML> tag';
								XN.Debug.logLine(0, d);
								throw new Error(d)
							}
						}
						break;
					default:
						a = c.getElementsByTagName(b);
						break
					}
					return a
				},
				normalizeInt64ForId : function(b) {
					if (b) {
						var a = typeof (b);
						if (a === "string" && (b).length < 12) {
							b = parseInt(b)
						}
					}
					return b
				}
			}
		});
XN.Type.createNamespace("XN.EXNML.Resources");
XN.EXNML.Resources.ResourceDict = XN.Type.createClass( {
	ctor : function() {
		this._stringResources = {
			link : "<a class='XN_Link' target='_blank' href='{0}'>{1}</a>",
			no_network : "no network"
		}
	},
	instance : {
		getResourceString : function(a) {
			return this._stringResources[a]
		},
		_stringResources : null
	}
});
XN.FeatureLoader.onScriptLoaded( [ "EXNML" ]);