(function() {
	function AddVoteBox(cfg) {
		var t = this;
		QZFL.object.extend(t, {
			title : "",
			onSuccess : QZFL.emptyFn,
			onSucess : QZFL.emptyFn,
			onError : QZFL.emptyFn,
			onClose : QZFL.emptyFn
		}, cfg);
		t.el = $e($(t.container));
		t.init();
	}
	QZFL.object
			.extend(
					AddVoteBox.prototype,
					{
						init : function() {
							var t = this;
						},
						show : function() {
							var t = this;
							if (t.el.find(".vote_wrap").elements.length) {
								t.el.show();
							} else {
								t.el.setHtml(t.getTemplate()).show();
								t.el.find(".close").bind("click",
										QZFL.event.bind(t, t.close));
								t.el.find(".vote_add_item").bind("focus",
										QZFL.event.bind(t, t.addOptions));
							}
						},
						hide : function() {
							var t = this;
							t.el.hide();
						},
						getTemplate : function() {
							return [
									'<span class="close x">×</span> <span class="c_tx3">您将发起一个关于以上内容的投票：</span>',
									'<div class="vote_wrap">',
									'<dl>',
									'<dt class="vote_side">投票选项：</dt>',
									'<dd class="vote_content">',
									'<div class="vote_options">',
									'<div class="vote_input_item">',
									'<input type="text" class="vote_input voteOption textinput" maxlength="50">',
									'</div>',
									'<div class="vote_input_item">',
									'<input type="text" class="vote_input voteOption textinput" maxlength="50">',
									'</div>',
									'<div class="vote_input_item">',
									'<input type="text" class="vote_input voteOption textinput" maxlength="50">',
									'</div>',
									'</div>',
									'<div class="vote_input_item"><input type="text" class="vote_input textinput vote_add_item"  readonly="readonly" value="+添加更多选项"></div>',
									'</dd>',
									'<dt class="vote_side">投票方式：</dt>',
									'<dd class="vote_content"><input type="radio" name="voteOptions" class="singleVote" id="singleSelect"><label for="singleSelect">单选</label><input name="voteOptions" type="radio" checked="1" class="multVote" id="multiSelect"><label for="multiSelect">多选</label></dd>',
									'</dl>',
									'<p class="c_tx3 vote_msg">该投票同步到微博后可能会暴露你的QQ号码</p>',
									'</div>',
									'<span class="arrow"><span class="arrow_out bor"></span><span class="arrow_in bor_bg"></span></span>' ]
									.join('');
						},
						close : function() {
							var t = this;
							t.el.hide();
							t.onClose();
						},
						destroy : function() {
							var t = this;
							t.el.find(".vote_wrap").remove();
							t.el.setHtml("").hide();
						},
						addOptions : function() {
							var t = this;
							var vo = t.el.find(".vote_options").elements[0];
							var el = QZFL.dom
									.createElementIn(
											"div",
											vo,
											false,
											{
												className : 'vote_input_item',
												innerHTML : '<input type="text" class="vote_input voteOption textinput" maxlength="50">'
											});
							setTimeout(function() {
								$e(el).find("input").elements[0].focus();
							}, 10);
							var items = $e(".vote_input_item", vo).elements;
							if (items.length >= 20) {
								t.el.find(".vote_add_item").remove();
							}
						},
						checkOptions : function() {
							var t = this;
							t.items = [];
							t.el.find(".voteOption").each(function() {
								var v = trim(this.value);
								if (v) {
									t.items.push(v);
								}
							});
							if (t.items.length == 0) {
								QZONE.FP.showMsgbox("输入投票选项", 3, 2000);
								return false;
							}
							return true;
						},
						getOptions : function() {
							var t = this;
							t.items = [];
							t.el.find(".voteOption").each(function() {
								var v = trim(this.value);
								if (v) {
									t.items.push(v);
								}
							});
							return t.items;
						},
						getLimit : function() {
							var t = this;
							return (t.el.find(".singleVote").getAttr("checked") ? 1
									: t.items.length)
						},
						isShowBox : function() {
							var t = this;
							if (t.el.hasClass("the_worlds_end")
									|| t.el.elements[0].style.display == "none") {
								return false;
							}
							return true;
						},
						getVoteId : function() {
							return this.voteId;
						},
						getTitle : function() {
							return this.title;
						},
						setTitle : function(c) {
							this.title = c;
						},
						post : function() {
							var t = this;
							if (!t.checkOptions()) {
								t.onError();
								return;
							}
							var url = "http://sns.qzone.qq.com/cgi-bin/vote/vote_cgi_create";
							var data = {
								uin : QZONE.FP.getQzoneConfig().loginUin,
								title : t.title,
								limit : t.getLimit(),
								num : t.items.length,
								source : 1
							};
							QZFL.object.each(t.items, function(v, i) {
								t.items[i] = encodeURIComponent(v);
							});
							var opt = [];
							for ( var i = 0; i < t.items.length; ++i) {
								opt.push('&option' + i + '=' + t.items[i]);
							}
							data = QZFL.util.genHttpParamString(data)
									+ opt.join('');
							var post = new QZFL.FormSender(url, "post", data,
									"utf-8");
							post.onSuccess = function(d) {
								if (d.vote_id) {
								} else {
									d.result = {
										"code" : d.result.code,
										"msg" : d.result.msg
									};
								}
								d.result = d.result || {
									"code" : "9998",
									"msg" : "对不起，服务繁忙，请稍候再试！"
								};
								if (d.result.code == 0) {
									t.voteId = d.vote_id;
									t.onSuccess(d);
									t.onSucess(d);
								} else {
									QZONE.FP.showMsgbox(d.result.msg, 5, 2000);
									t.onError(d);
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
								t.onError(d);
							}
							post.send();
						}
					});
	window.F4A = window.F4A || {};
	F4A.widget = F4A.widget || {};
	F4A.widget.AddVoteBox = AddVoteBox;
})();