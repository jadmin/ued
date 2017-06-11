(function() {
	function VoteViewer(cfg) {
		var t = this;
		QZFL.object
				.extend(
						t,
						{
							voteId : "",
							uuid : '',
							getinfo_cgi : 'http://sns.qzone.qq.com/cgi-bin/vote/vote_cgi_getinfo',
							getinfo_payload : {},
							getjoined_cgi : 'http://sns.qzone.qq.com/cgi-bin/vote/vote_cgi_getjoined',
							getjoined_payload : {},
							join_cgi : 'http://sns.qzone.qq.com/cgi-bin/vote/vote_cgi_join',
							join_payload : {},
							isShowTitle : false,
							isShowClose : true,
							owner_uin : 0,
							choice : [],
							onShowSucess : QZFL.emptyFn,
							onShowError : QZFL.emptyFn,
							onChoiceSucess : QZFL.emptyFn,
							onChoiceError : QZFL.emptyFn,
							onClose : QZFL.emptyFn,
							isShowDesc : false,
							isShowVoteResult : false,
							isShowVotePreviewResult : true,
							isHasViewBorder : true,
							isShowVotePic : true,
							isShowOptionPic : true,
							isShowJubao : false,
							isHasAnonymousButton : false
						}, cfg);
		t.isInPengyou = false;
		if (document.domain == "pengyou.com") {
			t.isInPengyou = true;
		}
		var rexp = /(home|www)\.pengyou.com/g;
		if (t.isInPengyou && rexp.test(parent.location.host)) {
			t.isInPengyouVoteApp = false;
		} else {
			t.isInPengyouVoteApp = true;
		}
		if (location.host.indexOf("pengyou.qq.com") == 0) {
			t.isInPengyou = true;
			t.isInPengyouVoteApp = false;
		}
		t.el = $e($(t.container));
		t.init();
	}
	QZFL.object
			.extend(
					VoteViewer.prototype,
					{
						init : function() {
							var t = this;
							t.sendPV("/vote/voteViewer/init");
							if (t.isInPengyou) {
								var host = (parent.siDomain || "qzonestyle.gtimg.cn");
								QZFL.css
										.insertCSSLink("http://" + host
												+ "/qzone_v6/qz_vote.v2.css",
												"qz_vote");
							} else {
								var host = (parent.siDomain || "qzonestyle.gtimg.cn");
								QZFL.css
										.insertCSSLink("http://" + host
												+ "/qzone_v6/qz_vote.v2.css",
												"qz_vote");
							}
						},
						monitorPV : function(path) {
							var t = this;
							if (!t.isInPengyou) {
								try {
									if (QZAPP
											&& QZAPP.Vote
											&& QZAPP.Vote.Monitor
											&& QZAPP.Vote.Monitor.listExpandVoteDetail
											&& QZAPP.Vote.Monitor.listExpandVoteDetail.isClicked) {
										t
												.sendPV(QZAPP.Vote.Monitor.listExpandVoteDetail.referredId
														+ path);
										QZAPP.Vote.Monitor.listExpandVoteDetail.isClicked = false;
									}
								} catch (error) {
								}
							}
						},
						show : function() {
							var t = this;
							var arg = arguments;
							var url = t.getinfo_cgi;
							var data = {
								ugc : 1,
								uin : QZONE.FP.getQzoneConfig().loginUin,
								vote_id : t.voteId,
								owner_uin : t.ownerUin,
								topicid : t.topicId
							};
							if (!QZFL.ICPlugin) {
								var containerParent = $e(t.container)
										.getParent();
								if (containerParent.hasClass("f_ct")
										&& t.el.hasClass("f_ct_vote")) {
									var count_f_ct_vote = containerParent
											.getParent().find(".f_ct_vote");
									if (count_f_ct_vote
											&& count_f_ct_vote.elements
											&& count_f_ct_vote.elements.length > 1) {
										QZFL.dom
												.removeElement($(t.container).parentNode);
										return;
									}
								}
							}
							QZFL.object.extend(data, t.getinfo_payload);
							var get = new QZFL.JSONGetter(url, null, data,
									"utf-8");
							get.onSuccess = function(d) {
								d.result = d.result || {
									"code" : "9998",
									"msg" : "对不起，服务繁忙，请稍候再试！"
								};
								if (d.result.code == 0) {
									if (d.vote_info) {
										t.owner_uin = d.vote_info.owner_uin;
										t.doShow(d.vote_info);
									} else if (d.data) {
										t.owner_uin = d.data.owner_uin;
										t.doShow(d.data);
										t.monitorPV("/ShowSuccess");
									}
								} else if (d.result.code == 1003) {
									QZONE.FP.showLoginBox("vote", function() {
										arg.callee.apply(t, arg)
									});
								} else {
									QZONE.FP.showMsgbox(d.result.msg, 5, 2000);
									t.onShowError(d);
								}
							}
							get.onError = function(d) {
								var d = {
									result : {
										"code" : "9999",
										"msg" : "对不起，网络繁忙，请稍候再试！"
									}
								};
								QZONE.FP.showMsgbox(d.result.msg, 5, 2000);
								t.onShowError(d);
							}
							get.send("_Callback");
						},
						isQQ : function(str) {
							var reg = /^\d*$/;
							return reg.test(str);
						},
						getPreviewVoteResultTemplate : function(voteItem) {
							var contentLen = 50;
							return [
									'<div class="vote_result">',
									'<h6 class="c_tx3">投票结果如下：</h6>',
									'<p class="c_tx3">',
									'<a href="',
									voteItem.voteUrl,
									'"; target="_blank" class="c_tx3" >',
									escHTML(voteItem.result
											.substring(
													0,
													(voteItem.result.length > contentLen ? contentLen
															: voteItem.result.length))),
									(voteItem.result.length > contentLen ? '...'
											: ''), '</a></p>', '</div>' ]
									.join('');
						},
						getSubmitTemplate : function() {
							var t = this;
							var res = "";
							if (!t.isHasAnonymousButton) {
								res = t.voteData.joined ? '<span class="bg6">已投票</span>'
										: '<a href="javascript:void(0);" class="gb_bt voteSubmit">投票</a>';
							} else {
								res = t.voteData.joined ? '<span class="bg6">已投票</span><span class="c_tx3"></span>'
										: '<a href="javascript:void(0);" class="gb_bt gb_bt_select voteSubmit"><span>投票</span><b class="expand_trig " trigAnonymous="1"><b trigAnonymous="1"></b></b></a><div class="bt_select bor bg voteSubmitAnonymous"><a href="javascript:void(0);" >私密投票</a></div>';
							}
							return res;
						},
						showAnonymousButton : function(e) {
							var target = QZFL.event.getTarget(e);
						},
						doShow : function(d) {
							var t = this;
							t.voteDate = d;
							t.voteData = d;
							var items = t.voteData.options || [];
							var total = 0;
							var i = 0;
							for (i = 0; i < items.length; ++i) {
								total += items[i].count;
							}
							total = Math.max(total, 1);
							var html = [], snippet = '';
							for (i = 0; i < items.length; ++i) {
								var item = items[i];
								var style = '';
								if (item.width > item.height) {
									if (item.width > 100) {
										style = 'width:100px;';
									}
								} else {
									if (item.height > 100) {
										style = 'height:100px;';
									}
								}
								t.uuid = t.uuid || t.topicId || t.owner_uin;
								snippet = [
										'<li class="',
										(item.pic ? 'li_img' : ''),
										'">',
										'<input type="',
										(t.voteData.limit == 1 ? 'radio'
												: 'checkbox'),
										'" name="voteOpt',
										t.uuid,
										t.voteData.vote_id,
										'" ',
										(t.voteData.joined ? 'disabled="disabled"'
												: ''),
										' class="vote_check" id="vote_',
										t.uuid,
										t.voteData.vote_id,
										'_opt',
										i,
										'" />',
										'<div class="vote_cont">',
										'<label for="vote_',
										t.uuid,
										t.voteData.vote_id,
										'_opt',
										i,
										'"',
										(item.pic ? 'class="label_img"' : ''),
										'>',
										((item.pic && t.isShowOptionPic) ? ('<b class="img_holder"><img class="bor3 vote_box_img_src" '
												+ 'order="'
												+ i
												+ '" src="'
												+ item.pic
												+ '" alt="" style="'
												+ style + '"/></b>')
												: ''),
										'<span>',
										item.text,
										'</span>',
										'</label>',
										'<label for="vote_',
										t.uuid,
										t.voteData.vote_id,
										'_opt',
										i,
										'">',
										'<div class="vote_count">',
										'<div class="bar bg2">',
										'<div class="bar_inner bg6" style="width:',
										parseInt(item.count * 100 / total),
										'%"></div>', '</div>',
										'<div class="number c_tx3">',
										item.count, '票(',
										parseInt(item.count * 100 / total),
										'%)</div>', '</div>', '</label>',
										'</div>', '</li>' ].join('');
								html.push(snippet);
							}
							if (t.voteData.result) {
								var voteUrlid = t.voteData.topic_id
										|| t.voteData.vote_id || "";
								if (t.isInPengyou) {
									if (t.isQQ(t.voteData.owner_uin)) {
										t.voteData.voteUrl = "http://user.qzone.qq.com/"
												+ t.voteData.owner_uin
												+ "/vote/" + voteUrlid;
									} else {
										t.voteData.voteUrl = 'http://baseapp.pengyou.com/'
												+ t.voteData.owner_uin
												+ '/vote/' + voteUrlid;
									}
								} else {
									t.voteData.voteUrl = "http://user.qzone.qq.com/"
											+ t.voteData.owner_uin
											+ "/vote/"
											+ voteUrlid;
								}
							}
							if (t.isShowDesc) {
								if (!t.voteData.isVoteDescFormated) {
									t.voteData.desc = t
											.formatVoteDesc(t.voteData.desc);
									t.voteData.isVoteDescFormated = true;
								} else {
								}
							}
							snippet = [
									'<div class="'
											+ (t.isHasViewBorder ? 'lbor3' : '')
											+ ' qz_vote'
											+ (t.isInPengyou ? ' qz_vote_pengyou'
													: '') + '">',
									(t.isShowTitle ? ('<h2>' + t.voteData.title)
											+ '</h2>'
											: ''),
									(t.isShowDesc ? ('<p>' + t.voteData.desc)
											+ '</p>' : ''),
									((t.voteData.pic_url && t.isShowVotePic) ? [
											'<p><img', '  src="',
											t.voteData.pic_url, '"', '></p>' ]
											.join('')
											: ''),
									'<ul class="qz_vote_list">',
									html.join(""),
									'</ul>',
									((t.voteData.result && t.isShowVotePreviewResult) ? t
											.getPreviewVoteResultTemplate(t.voteData)
											: ''),
									'<div class="vote_op">',
									t.getSubmitTemplate(),
									(t.isShowClose ? '<a href="javascript:void(0);" onclick="return false;" class="vote_op_fold voteClose">收起↑</a>'
											: ''),
									(t.isShowJubao ? '<a href="javascript:void(0);" onclick="return false;" class="link_jubao">举报</a>'
											: ''),
									'</div>',
									((t.voteData.result && t.isShowVoteResult && t.voteData.joined) ? t
											.getVoteResultTemplate(t.voteData)
											: ''), '</div>' ].join("");
							t.el.setHtml(snippet);
							if (t.voteData.result && t.isShowVotePreviewResult) {
								$e(t.el.find(".vote_result").elements[0])
										.hide();
							}
							if (t.voteData.pic_url && t.isShowVotePic) {
								var _maxWidth = t.getImgMaxWidth();
								var _voteImg = null;
								var imgElements = t.el.find("img");
								if (imgElements && imgElements.elements
										&& imgElements.elements.length > 0) {
									_voteImg = $(imgElements.elements[0]);
								}
								if (_voteImg) {
									var resizeImgWidth = function() {
										if (_voteImg && _voteImg.width
												&& _voteImg.height) {
											if (_voteImg.width > _voteImg.height) {
												if (_voteImg.width > _maxWidth) {
													_voteImg.width = _maxWidth;
												}
											} else {
												if (_voteImg.height > _maxWidth) {
													_voteImg.height = _maxWidth;
												}
											}
											$e(_voteImg).show();
										}
									};
									_voteImg.onload = resizeImgWidth;
								}
							}
							var img_div = [
									'<div class="vote_box_img_big bgr2 "  id="qzVoteImgPreviewDiv_img" style="position:absolute;display:none;z-index: 1024;opacity: 1;">',
									'<img src="http://qlogo3.store.qq.com/qzone/262479316/262479317/100" alt="" width="260" height="260" />',
									'</div>' ].join('');
							if (t.isInPengyou) {
								var qzVoteImgPreviewDiv = $(parent.document
										.getElementById("qzVoteImgPreviewDiv"));
							} else {
								var qzVoteImgPreviewDiv = $('qzVoteImgPreviewDiv');
							}
							if (!qzVoteImgPreviewDiv) {
								if (t.isInPengyou) {
									qzVoteImgPreviewDiv = parent.document
											.createElement('div');
								} else {
									qzVoteImgPreviewDiv = document
											.createElement('div');
								}
								qzVoteImgPreviewDiv.id = 'qzVoteImgPreviewDiv';
								qzVoteImgPreviewDiv.innerHTML = img_div;
								if (t.isInPengyou) {
									parent.document.body
											.appendChild(qzVoteImgPreviewDiv);
								} else {
									document.body
											.appendChild(qzVoteImgPreviewDiv);
								}
								setTimeout(function() {
									$e(qzVoteImgPreviewDiv).onMouseOut(
											function() {
												$e(qzVoteImgPreviewDiv).hide();
											});
								}, 100);
							}
							if (t.voteData.joined) {
								if (t.voteData.result) {
									$e(t.el.find(".vote_result").elements[0])
											.show();
								}
								t.getMyChoice();
							} else {
								QZFL.object
										.each(
												t.choice,
												function(v) {
													if (t.el.find("input").elements[v]) {
														t.el.find("input").elements[v].checked = 1;
														if (t.isInPengyou) {
															$e(
																	t.el
																			.find("input").elements[v].parentNode)
																	.addClass(
																			'check_item bg2 bor3');
														} else {
															$e(
																	t.el
																			.find("input").elements[v].parentNode)
																	.addClass(
																			'check_item bg2 bor3');
														}
													}
												});
								t.el.find(".vote_bar").bind(
										"click",
										function() {
											var el = $e(this.parentNode).find(
													"input");
											if (el.getAttr("checked")) {
												el.setAttr("checked", 0)
											} else {
												el.setAttr("checked", 1)
											}
										});
							}
							t.el.find(".voteClose").bind("click",
									QZFL.event.bind(t, t.close));
							t.el.find(".voteSubmit").bind("click",
									QZFL.event.bind(t, t.submitChoice));
							t.el.find(".voteSubmitAnonymous")
									.bind(
											"click",
											QZFL.event.bind(t,
													t.submitChoiceAnonymous));
							t.el.find(".link_jubao").bind("click",
									QZFL.event.bind(t, t.jubao));
							t.el.find(".voteSubmitAnonymous").hide();
							t.el.show();
							t.onShowSucess();
							var parent_node = t.el;
							if (t.isInPengyou) {
								var imgTarget = $e(parent.document
										.getElementById("qzVoteImgPreviewDiv_img"));
							} else {
								var imgTarget = $e('#qzVoteImgPreviewDiv_img');
							}
							$e(parent_node)
									.onHover(
											function(e) {
												var target = QZONE.event
														.getTarget(e);
												if ($e(target).hasClass(
														'vote_box_img_src')) {
													var b = $e(target).getXY();
													var c = $e(parent_node)
															.getXY();
													var imgLeft = c[0] + 135;
													var imgTop = b[1];
													var _img = new Image();
													_img.src = target.src;
													var style = '';
													var max_width = t
															.getImgMaxWidth();
													if (_img.width > _img.height) {
														if (_img.width > max_width) {
															style = 'width:'
																	+ max_width
																	+ 'px;';
														}
													} else {
														if (_img.height > max_width) {
															style = 'height:'
																	+ max_width
																	+ 'px;';
														}
													}
													$e(qzVoteImgPreviewDiv)
															.show();
													if (t.isInPengyou
															&& t.isInPengyouVoteApp) {
														imgLeft = imgLeft + 235;
														imgTop = imgTop + 55;
													}
													imgTarget.show();
													imgTarget
															.setStyle(
																	'left',
																	imgLeft
																			+ 'px')
															.setStyle(
																	'top',
																	imgTop
																			+ 'px')
															.setHtml(
																	'<img src="'
																			+ target.src
																			+ '" style="z-index:1024;'
																			+ style
																			+ '" />')
															.show();
												} else {
													imgTarget.hide();
												}
											});
							$e(parent_node).find('li').onMouseOver(function(e) {
								var target = QZONE.event.getTarget(e);
								$e(parent_node).find('li').each(function(v) {
									$e(v).addClass("fuckie6");
								});
								$e(this).addClass('hover_item bg2');
							});
							$e(parent_node).find('li').onMouseOut(function(e) {
								if ($e(this).hasClass('check_item')) {
									$e(this).removeClass('hover_item');
								} else {
									$e(this).removeClass('hover_item bg2');
								}
							});
							if (!t.voteData.joined) {
								$e(parent_node)
										.find('li')
										.onClick(
												function(e) {
													var target = QZFL.event
															.getTarget(e);
													var targetInput = $e(target)
															.find("input");
													if (targetInput) {
														if (targetInput
																.getAttr("checked")) {
															if (targetInput
																	.getAttr("type") == "checkbox") {
																targetInput
																		.setAttr(
																				"checked",
																				false);
															}
														} else {
															targetInput
																	.setAttr(
																			"checked",
																			true);
														}
													}
													$e(parent_node)
															.find('li')
															.each(
																	function() {
																		var el = $e(
																				this)
																				.find(
																						"input");
																		if (el
																				.getAttr("checked")) {
																			if (t.isInPengyou) {
																				$e(
																						this)
																						.addClass(
																								'check_item bg2 bor3');
																			} else {
																				$e(
																						this)
																						.addClass(
																								'check_item bg2 bor3');
																			}
																		} else {
																			$e(
																					this)
																					.removeClass(
																							'check_item bg2 bor3');
																		}
																	});
												});
							}
						},
						jubao : function() {
							t = this;
							if (t.isInPengyou) {
								var url = [ 'http://jubao.qq.com/cn/jubao',
										'?entryname=campus', '&appname=campus',
										'&subapp=vote', '&jubaotype=article',
										"&topicid=", t.voteData.topic_id,
										'&uin=', t.voteData.owner_uin ]
										.join('');
								window.open(url);
							} else {
								QZONE.FP.showReportBox( {
									entryname : 'qzone',
									appname : 'qzone',
									subapp : 'vote',
									jubaotype : 'article',
									uin : t.voteData.owner_uin,
									topicid : t.voteData.topic_id
								});
							}
						},
						getImgMaxWidth : function() {
							var g_v = top.g_version != undefined ? top.g_version
									: 6;
							var max_width = (5 == g_v) ? 315 : 400;
							return max_width;
						},
						getMyChoice : function() {
							var t = this;
							if (t.voteData && t.voteData.joined
									&& t.voteData.choices) {
								QZFL.object
										.each(
												t.voteData.choices || [],
												function(v) {
													var idx = parseInt(v.choice);
													var ele = t.el
															.find("input").elements[idx];
													if (ele) {
														ele.checked = 1;
													}
												});
							} else {
								QZFL.console.print("voteData.choices is null");
							}
						},
						close : function() {
							var t = this;
							if (!QZFL.ICPlugin) {
								var containerParent = $e(t.container)
										.getParent();
								if (containerParent
										&& containerParent.hasClass("f_ct")) {
									QZFL.dom
											.removeElement($(t.container).parentNode);
									t.onClose();
								} else {
									t.el.hide();
									t.onClose();
								}
							} else {
								t.el.hide();
								t.onClose();
							}
						},
						destroy : function() {
							var t = this;
							t.el.find(".qz_vote").remove();
							t.el.setHtml("").hide();
						},
						checkChoice : function() {
							var t = this;
							t.choice = [];
							var i = 0;
							t.el.find("input").each(function() {
								if (this.checked) {
									t.choice.push(i);
								}
								i++;
							});
							if (t.choice.length == 0) {
								QZONE.FP.showMsgbox("请选择投票选项", 3, 2000);
								return false;
							}
							if (t.choice.length > t.voteData.limit) {
								QZONE.FP.showMsgbox("最多只能选" + t.voteData.limit
										+ "项", 3, 2000);
								return false;
							}
							return true;
						},
						submitChoice : function(e) {
							var t = this;
							var arg = arguments;
							var no_feed = 0;
							var target = QZFL.event.getTarget(e);
							if (target.getAttribute("trigAnonymous")) {
								var eles = t.el.find(".voteSubmitAnonymous").elements;
								if (eles && eles.length > 0) {
									if ($e(eles[0]).hasClass(
											"isShowAnonymousButton")) {
										$e(eles[0]).hide();
										$e(eles[0]).removeClass(
												"isShowAnonymousButton");
									} else {
										$e(eles[0]).show();
										$e(eles[0]).addClass(
												"isShowAnonymousButton");
									}
								}
								return;
							}
							t.submitChoiceWith(no_feed);
							t.sendPV("/vote/voteViewer/submitChoice");
						},
						submitChoiceWith : function(no_feed) {
							var t = this;
							var arg = arguments;
							if (!t.checkChoice()) {
								return;
							}
							var url = t.join_cgi;
							var data = {
								uin : QZONE.FP.getQzoneConfig().loginUin,
								vote_id : t.voteId,
								owner_uin : t.ownerUin,
								topicid : t.topicId,
								topic_id : (!(t.topic_id) ? "" : t.topic_id),
								choice : t.choice.join("|"),
								guest_uin : QZONE.FP.getQzoneConfig().loginUin,
								with_result : 0,
								no_feed : no_feed || 0,
								words : ''
							};
							QZFL.object.extend(data, t.join_payload);
							if (t.verifyCode) {
								QZFL.object.extend(data, {
									verify : t.verifyCode
								});
							}
							t.verifyCode = null;
							var post = new QZFL.FormSender(url, "post", data,
									"utf-8");
							post.onSuccess = function(d) {
								if (typeof d.vote_id != "undefined") {
									d.result = {
										"code" : 0,
										"msg" : "suc"
									};
								}
								d.result = d.result || {
									"code" : "9998",
									"msg" : "对不起，服务繁忙，请稍候再试！"
								};
								if (d.result.code == 0) {
									QZONE.FP.showMsgbox("投票成功", 4, 2000);
									t.refreshVotedData();
									t.onChoiceSucess(d);
								} else if (d.result.code == 1003) {
									QZONE.FP.showLoginBox("vote", function() {
										arg.callee.apply(t, arg)
									});
								} else if (d.result.code == -9982) {
									QZONE.FP.showVerifyBox(3, function(
											verifyCode) {
										t.verifyCode = verifyCode;
										t.submitChoiceWith(no_feed);
									}, true);
								} else if (d.result.code == 2010) {
									QZONE.FP.showMsgbox("您已经投过票了", 3, 2000);
									t.show();
									t.onChoiceSucess(d);
								} else {
									QZONE.FP.showMsgbox(d.result.msg, 5, 3000);
									t.onChoiceError(d);
								}
							}
							post.onError = function(d) {
								var d = {
									result : {
										"code" : "9999",
										"msg" : "对不起，网络繁忙，请稍候再试！"
									}
								};
								QZONE.FP.showMsgbox(d.result.msg, 5, 2000);
								t.onChoiceError(d);
							}
							post.send();
						},
						refreshVotedData : function() {
							var t = this;
							t.voteData.choices = [];
							if (t.choice) {
								QZFL.object.each(t.choice || [], function(v) {
									t.voteData.choices.push( {
										"choice" : v,
										"text" : ""
									});
								});
								var temp = {};
								for ( var k = 0; k < t.voteData.choices.length; k++) {
									temp = t.voteData.options[t.voteData.choices[k].choice];
									if (temp) {
										temp.count++;
									}
								}
								t.voteData.joined = 1;
								t.doShow(t.voteData);
							} else {
								QZFL.console.print("choice is null");
							}
						},
						submitChoiceAnonymous : function() {
							var t = this;
							var no_feed = 2;
							t.submitChoiceWith(no_feed);
							t.sendPV("/vote/voteViewer/submitChoiceAnonymous");
						},
						getVoteResultTemplate : function(voteItem) {
							return [ '<h2 >投票结果：</h2>',
									escHTML(voteItem.result) ].join('');
						},
						sendPV : function(url) {
							var t = this;
							var dm = (t.isInPengyou ? "xiaoyou.qq.com"
									: "apppolling.qzone.qq.com");
							var tc = window.TCISD;
							if (tc) {
								tc.pv(dm, url);
							}
						},
						formatVoteDesc : function(desc) {
							var t = this;
							var regexEm = t.formatVoteDesc.regexEm = t.formatVoteDesc.regexEm
									|| new RegExp(
											'((news|telnet|nttp|file|http|ftp|https)://)(([-A-Za-z0-9_]+(\\.[-A-Za-z0-9_]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!*()<>{},;:@&=?/~#%\'`]*)*',
											'ig');
							var urls = regexEm.exec(desc);
							var urlArray = [];
							while (urls != null) {
								if (urls && urls.length > 1) {
									urlArray.push(urls[0]);
								}
								urls = regexEm.exec(desc);
							}
							var tmp = '';
							for ( var i = 0; i < urlArray.length; i++) {
								tmp = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_urlcheck?url='
										+ encodeURIComponent(urlArray[i]);
								tmp = '<a target="_blank" href="' + tmp + '" >'
										+ urlArray[i] + '</a>';
								desc = desc.replace(urlArray[i], tmp);
							}
							return desc;
						}
					});
	window.F4A = window.F4A || {};
	F4A.widget = F4A.widget || {};
	F4A.widget.VoteViewer = VoteViewer;
})();
(function() {
	function showVoteDetail(cfg) {
		var simple = cfg.simpleContainer;
		var simpleParent = $e(simple).getParent();
		if (simpleParent.find(".mod_vote_feed_af").elements.length) {
			return;
		}
		var simple_f_ct_vote = $e(simple).find(".f_ct_vote");
		var simpleParent_f_ct_vote = simpleParent.find(".f_ct_vote");
		var flaglength = 0;
		if (simpleParent_f_ct_vote && simpleParent_f_ct_vote.elements
				&& simpleParent_f_ct_vote.elements.length) {
			if (simple_f_ct_vote && simple_f_ct_vote.elements
					&& simple_f_ct_vote.elements.length) {
				flaglength = simpleParent_f_ct_vote.elements.length
						- simple_f_ct_vote.elements.length;
			} else {
				flaglength = simpleParent_f_ct_vote.elements.length;
			}
		}
		if (flaglength > 0) {
			return;
		}
		var div = document.createElement("div");
		div.className = "f_ct_vote";
		div.style.display = "none";
		simple.parentNode.insertBefore(div, simple);
		var choice = [];
		if (cfg.target) {
			$e(simple).find("li").each(function(o, idx) {
				if (QZFL.dom.isAncestor(o, cfg.target)) {
					choice.push(idx);
				}
			});
		}
		var config = {
			container : div,
			voteId : cfg.voteId,
			ownerUin : cfg.ownerUin || "",
			topicId : cfg.topicId || "",
			uuid : cfg.uuid,
			choice : choice,
			onShowSucess : function() {
				$e(simple).hide();
			},
			onShowError : function() {
				QZFL.dom.removeElement(div);
				div = null
			},
			onClose : function() {
				$e(simple).show();
				QZFL.dom.removeElement(div);
				div = null;
			}
		};
		QZFL.object.extend(config, cfg);
		var vote = new F4A.widget.VoteViewer(config);
		vote.show();
	}
	if (QZONE.ICPlugin) {
		QZONE.ICPlugin.Vote = {
			bootstrap : function(cfg) {
				var param = splitHttpParamString(cfg.config);
				showVoteDetail( {
					simpleContainer : cfg.qzDom,
					voteId : param.voteid,
					ownerUin : param.owneruin
							|| QZONE.FP.getQzoneConfig().ownerUin,
					topicId : param.topicid,
					uuid : cfg.feedID || '',
					target : QZONE.event.getTarget(cfg.event)
				});
			}
		};
	}
	F4A.widget.showVoteDetail = showVoteDetail;
})();