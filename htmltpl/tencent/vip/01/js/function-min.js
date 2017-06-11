document.domain = "qq.com";
expire = new Date((+new Date()) + 1 * 3600000);
cookie = {};
cookie.expires = expire;
cookie.path = "/";
cookie.domain = window.document.location.host;
var iconElm = $("#iconElm");
var safeElm = $("#safeElm");
var speedElm = $("#speedElm");
var level_num = new Array(0, 1000, 2000, 3500, 5500, 8000, 11000, 99999);
var my_act_flag = false;
var bind;
var Uname;
var safeLV;
var act_status = new Array("");
var gift_status = new Array("");
var fail_reason = [ "成功,无错误", "抱歉，现在系统繁忙，请您稍后再试", "抱歉，现在系统繁忙，请您稍后再试", "抽奖失败",
		"抱歉，本小时礼包已派送完毕，欢迎下个时段再来参加活动，下手要快哦！",
		"抱歉，本小时礼包已派送完毕，欢迎下个时段再来参加活动，下手要快哦！",
		"此QQ帐号已成功领取该礼包，每个QQ帐号每个礼包限领一次，感谢您的支持！",
		"此QQ帐号已成功领取该礼包，每个QQ帐号每个礼包限领一次，感谢您的支持！", "对不起，您不符合参加此次活动的条件",
		"抱歉，现在系统繁忙，请您稍后再试", "抱歉，现在系统繁忙，请您稍后再试",
		"对不起，本活动已过期，敬请关注QQ电脑管家的其他活动，感谢您的支持！", "您已经领取过本级别的礼包，感谢您的参与",
		"抱歉，现在系统繁忙，请您稍后再试", "抱歉，现在系统繁忙，请您稍后再试", "抱歉，现在系统繁忙，请您稍后再试",
		"此QQ帐号已成功领取该礼包，每个QQ帐号每个礼包限领一次，感谢您的支持！",
		"此QQ帐号已成功领取该礼包，每个QQ帐号每个礼包限领一次，感谢您的支持！",
		"抱歉，还未到发放礼包时间，请稍后再来参加活动，感谢您的关注！" ];
$(function() {
	check_login();
	$(".login_btn").click(function() {
		if (encodeURIComponent(Uname) == "undefined") {
			login()
		}
	});
	$("#day_act img").each(function(a) {
		$(this).mouseover(function() {
			$(".info_msg").show();
			$(".info_msg").css( {
				left : $(this).offset().left + "px",
				top : ($(this).offset().top + $(this).height()) + "px"
			});
			$(".info_msg").html(tips_info[a]);
		});
		$(this).mouseout(function() {
			$(".info_msg").hide();
		});
		$(this).click(function() {
			if (encodeURIComponent(Uname) == "undefined") {
				login();
			}
		})
	});
	$("#day_act .act_close").toggle(function() {
		$(this).removeClass("act_open");
		$(this).parent("h2").next(".act_wrap").slideUp("fast");
	}, function() {
		$(this).addClass("act_open");
		$(this).parent("h2").next(".act_wrap").slideDown("fast");
	});
	$("#my_act_link").click(function() {
		show_my_act();
	});
	$(".share_wb").click(function() {
		share_wb();
	});
	$(".share_qzone").click(function() {
		share_qzone();
	});
	sent_tcss();
	fn_act_status();
	fn_gift_status();
});
$("#day_act .act_row:last").css("border", "none");
$(".act_title a").focus(function() {
	this.blur();
});
$("#day_act_a").click(function() {
	$(this).addClass("set");
	$("#my_act_a").css("border-left", "none");
	$("#my_act_a").removeClass("set");
	$("#day_act").show();
	$("#my_act").hide();
});
/* 点击[已领取的特权]事件 */
$("#my_act_a").click(function() {
	show_my_act();
});
function show_my_act() {
	//if (encodeURIComponent(Uname) != "undefined") {
		$("#my_act_a").addClass("set");
		$("#my_act_a").css("border-left", "1px solid #c4d4dd");
		$("#day_act_a").removeClass("set");
		$("#day_act").hide();
		$("#my_act").show();
		get_my_act();
		my_act_event();
	/*} else {
		login();
	}*/
}
function my_act_event() {
	$("#my_act .toggle").toggle(function() {
		$(this).removeClass("on");
		$(this).addClass("off");
		$(this).html("收缩详情");
		$(this).prev("span").css("height", "auto")
	}, function() {
		$(this).removeClass("off");
		$(this).addClass("on");
		$(this).html("展开详情");
		$(this).prev("span").css("height", "3em")
	});
	$("#my_act .copy").click(function() {
		var a = $(this).prev("font").text();
		if ($.browser.msie) {
			window.clipboardData.setData("Text", a);
			alert("CDKEY复制成功。")
		} else {
			alert("您所用的浏览器不支持复制，请手动复制。")
		}
	})
}
function sent_tcss() {
	$.ajax( {
		type : "GET",
		url : "http://pingjs.qq.com/ping.js",
		success : function() {
			if (typeof (pgvMain) == "function") {
				pgvMain()
			}
		},
		dataType : "script",
		cache : true
	});
	$(document).click(function(b) {
		var e = "isd.tq";
		var a = "data-stats";
		var f = /^(?!\.)[\w-]+(?:\.[\w-]+)*?$/;
		if ("function" !== typeof (pgvSendClick)) {
			return
		}
		var g = b.target;
		if (!g || 1 !== g.nodeType) {
			return
		}
		var h = $(g).closest("a[" + a + "],input[" + a + "]");
		if (0 === h.length) {
			return
		}
		var d = h.attr(a);
		if (!f.test(d)) {
			return
		}
		var c = {
			hottag : e + "." + d
		};
		pgvSendClick(c)
	})
}
function changeimg() {
	$("#vfcode").attr("src",
			"http://captcha.qq.com/getimage?aid=13000402&" + Math.random());
	$("#vfvalue").focus()
}
function getactivity() {
	$(".act_cell .act_wrap a").each(
			function() {
				if (gift_status) {
					for ( var a = 0; a < gift_status.length; a++) {
						if ($(this).attr("bind") == gift_status[a].id) {
							$(this).addClass("s1");
							$(this).attr("fag", "no")
						}
					}
				}
				if (act_status) {
					for ( var c = 0; c < act_status.length; c++) {
						if (act_status[c].left_flag == 0
								&& $(this).attr("fag") != "no") {
							var b = $("#day_act a[bind='" + act_status[c].id
									+ "']");
							b.addClass("s2");
							b.attr("fag", "no")
						}
					}
				}
			});
	$(".act_cell .act_wrap a").bind("click", function() {
		if ($(this).attr("fag") != "no") {
			bind = $(this).attr("bind");
			if (encodeURIComponent(Uname) != "undefined") {
				$.blockUI( {
					message : $("#captcha_msg"),
					css : {
						top : "45%",
						left : "50%",
						width : "300px",
						border : "3px solid #9EC5E6",
						margin : "-75px 0 0 -150px"
					}
				});
				$("#captcha_msg .close").click(function() {
					$.unblockUI()
				});
				$("#vfvalue").val("");
				changeimg()
			} else {
				login();
			}
		}
	})
}
$("#vfsend")
		.click(
				function() {
					$.ajax( {
								url : "http://hd.guanjia.qq.com/fcgi-bin/hdjoin?logic=gj&cb=gift_result",
								dataType : "jsonp",
								jsonp : "gift_result",
								type : "get",
								cache : false,
								data : "Uin=" + getUinNum(appcookie("uin"))
										+ "&skey=" + appcookie("skey")
										+ "&Uname=&id=" + bind + "&verifycode="
										+ $("#vfvalue").val()
							})
				});
function gift_result(c) {
	var b = $("#act_msg h4");
	var g = $("#act_msg p");
	var d = $("#act_msg .act_msg_ps");
	var h = $("#act_msg s");
	if (c.ret == "suc") {
		if (c.result == "OK" && bind == c.hd_id
				&& getUinNum(appcookie("uin")) == c.hd_uin) {
			b.text("奖品领取成功");
			h.removeClass("error");
			g.html('恭喜,您已成功领取礼品:<br/><b style="color:#090;">' + c.hd_name
					+ "</b>");
			if (c.result_info.indexOf("CDKEY") >= 0) {
				var e;
				if (c.hd_name.indexOf("会员特权体验卡") >= 0) {
					e = "http://vip.qq.com/clubcyk/"
				} else {
					if (c.hd_name.indexOf("QQ飞车") >= 0) {
						e = "http://speed.qq.com/act/a20080331ty/"
					} else {
						if (c.hd_name.indexOf("QQ仙侠") >= 0) {
							e = "http://xxz.qq.com/web201008/cdkey.shtml"
						} else {
							if (c.hd_name.indexOf("功夫西游") >= 0) {
								e = "http://gf.qq.com/web201109/cdkey.shtml"
							} else {
								if (c.hd_name.indexOf("QQ天堂岛") >= 0) {
									e = "http://ttd.qq.com/web201110/cdkey.shtml"
								}
							}
						}
					}
				}
				d.html("<dl><dt>礼包换领方法：</dt><dd>1、复制CDKEY：<font>"
								+ c.result_info.substr(6)
								+ '</font><a href="#" id="copy_cdkey"></a></dd><dd>2、前往 <a href="'
								+ e
								+ '" target="_blank">兑换页面</a> 兑换礼包</dd></dl>');
				copy_cdkey(c.result_info)
			} else {
				d.html("<dl><dd>"
								+ c.result_info
								+ '</dd><dd><a href="#" target="_blank" class="link"></a></dd></dl>')
			}
			var f = $("#day_act a[bind='" + c.hd_id + "']");
			f.addClass("s1");
			f.unbind("click")
		} else {
			if (c.result == "FAIL" && bind == c.hd_id
					&& getUinNum(appcookie("uin")) == c.hd_uin) {
				b.text("奖品领取失败！");
				h.addClass("error");
				g.html(fail_reason[c.fail_reason]);
				d.html('<dl><dd><a href="#" onclick="$.unblockUI()" class="ok"></a></dd></dl>')
			} else {
				b.text("奖品领取失败！");
				h.addClass("error");
				g.html("服务器繁忙，请稍后再试。");
				d.html('<dl><dd><a href="#" onclick="$.unblockUI()" class="ok"></a></dd></dl>')
			}
		}
	} else {
		if (c.ret == "登录失败,请稍后重试!") {
			show_login();
			return false;
		} else {
			if (c.ret.indexOf("验证码") >= 0) {
				b.text("校验验证码错误！");
				h.addClass("error");
				g.html("校验验证码错误，请刷新验证码重试。");
				d.html('<dl><dd><a href="#" onclick="$.unblockUI()" class="ok"></a></dd></dl>')
			} else {
				b.text("奖品领取失败！");
				h.addClass("error");
				g.html("服务器连接失败，请稍后再试。");
				d.html('<dl><dd><a href="#" onclick="$.unblockUI()" class="ok"></a></dd></dl>')
			}
		}
	}
	$.blockUI( {
		message : $("#act_msg"),
		css : {
			top : "45%",
			left : "50%",
			width : "410px",
			border : "3px solid #9EC5E6",
			margin : "-75px 0 0 -205px"
		}
	});
	$("#act_msg .close").click(function() {
		$.unblockUI();
	})
}
function check_login() {
	if (appcookie("uin")) {
		$.ajax( {
					url : "http://c.pc.qq.com/fcgi-bin/plogin?cb=getstatus_callback&type=1",
					dataType : "jsonp",
					jsonp : "getstatus_callback",
					type : "get",
					cache : false,
					data : "Uin=" + getUinNum(appcookie("uin")) + "&skey="
							+ appcookie("skey")
				})
	} else {
		$(".nologin").show();
		$(".logined").hide();
		
		/*$(".nologin").hide();
		$(".logined").show();*/
	}
}
function getstatus_callback(b) {
	if (b.ret && b.ret == "suc" && b.opt_ret && b.opt_ret == 0) {
		$(".nologin").hide();
		$(".logined").show();
		$("#face").attr(
				"src",
				"http://id.qq.com/cgi-bin/face?u="
						+ getUinNum(appcookie("uin")));
		$("#uname").html(b.Uname + "(" + getUinNum(appcookie("uin")) + ")");
		Uname = b.Uname;
		set_status(b);
		set_safety()
	} else {
		$(".nologin").show();
		$(".logined").hide()
	}
}
function set_status(b) {
	if (b.icon_status == 0) {
		iconElm.addClass("icon_off")
	} else {
		iconElm.addClass("icon_on")
	}
	if (b.acc_today != 1) {
		$.ajax( {
			url : "http://c.pc.qq.com/fcgi-bin/ploginstat?cb=day_callback",
			dataType : "jsonp",
			jsonp : "day_callback",
			type : "get",
			cache : false,
			data : "Uin=" + getUinNum(appcookie("uin")) + "&skey="
					+ appcookie("skey")
		})
	} else {
		speedElm.attr("title", "今日QQ等级加速完成");
		speedElm.addClass("speed_ok")
	}
}
function day_callback(a) {
	if (a.ret && a.ret == "suc") {
		if (a.login_stat == 0) {
			speedElm.attr("title", "启动QQ电脑管家登录QQ号，QQ等级额外增加一天");
			speedElm.addClass("speed_no")
		} else {
			if (a.login_stat == 1) {
				speedElm.attr("title", "使用QQ电脑管家为QQ等级加速中");
				speedElm.addClass("speed_go")
			} else {
				if (a.login_stat == 3) {
					speedElm.attr("title", "QQ等级加速中断！请检查是否断网或注销QQ帐号等情况");
					speedElm.addClass("speed_break")
				} else {
					return true
				}
			}
		}
	}
}
function set_safety() {
	$.ajax( {
		url : "http://c.pc.qq.com/fcgi-bin/pcmgrsafeinfo?cb=safe_callback",
		dataType : "jsonp",
		jsonp : "safe_callback",
		type : "get",
		cache : false,
		data : "Uin=" + getUinNum(appcookie("uin")) + "&skey=" + appcookie("skey")
	})
}
function safe_callback(b) {
	if (b.ret == "suc") {
		safeLV = b.safe_level;
		safeElm.addClass("safe_lv" + b.safe_level);
		$(".bar_wrap .now_lv").addClass("lv" + b.safe_level);
		$(".bar_wrap .next_lv").addClass("lv" + (parseInt(b.safe_level) + 1));
		$(".now_score").html(b.now_score);
		$(".last_score").html(b.last_score);
		$(".safe_speed font").html(b.speed);
		if (b.speed > 0 && b.speed <= 7) {
			$(".safe_speed .speed_show").css("background-position", "0 -311px")
		} else {
			if (b.speed > 7 && b.speed <= 14) {
				$(".safe_speed .speed_show").css("background-position",
						"0 -325px")
			} else {
				if (b.speed > 14 && b.speed <= 20) {
					$(".safe_speed .speed_show").css("background-position", "0 -339px")
				} else {
					if (b.speed >= 21) {
						$(".safe_speed .speed_show").css("background-position", "0 -353px")
					}
				}
			}
		}
		set_bar(b.now_score, b.safe_level);
		set_act(b.safe_level)
	}
}
function set_act(a) {
	if (a == 0) {
		$("#day_act .act_row:first")
				.children("h2")
				.append('<font style="color:#e9773b;">您还不是安全达人，不能领取等级特权礼包。<a href="http://guanjia.qq.com/help/user.html#user_3" target="_blank">如何成为安全达人</a></font>')
	} else {
		$("#day_act .act_row")
				.each(
						function(b) {
							if (b < a - 1) {
								$(this).children(".act_wrap").hide();
								$(this).children("h2").children(".act_close")
										.click();
								$(this).children("h2").append(
										'<font style="color:#a5a5a5;">此为低等级礼包，您可直接领取LV'
												+ safeLV + "等级特权礼包</font>")
							}
							if (b == a - 1) {
								$(this).addClass("act_cell");
								$(this).children("h2").append(
										"<font>欢迎领取本级别礼包！等级越高礼包越珍贵哦！</font>");
								getactivity()
							}
							if (b > a - 1) {
								$(this).addClass("albg");
								$(this).children("h2")
									   .append('<font style="color:#e9773b;">您的安全达人等级不够，完成安全成长任务，快速升级！</font>')
							}
						})
	}
}
function fn_gift_status() {
	if (appcookie("uin")) {
		$.ajax( {
					url : "http://hd.guanjia.qq.com/fcgi-bin/hduhd?cb=giftstatus_callback",
					dataType : "jsonp",
					jsonp : "giftstatus_callback",
					type : "get",
					cache : false,
					data : "Uin=" + getUinNum(appcookie("uin")) + "&skey="
							+ appcookie("skey")
							+ "&logic=gj&PageSize=99&PageIndex=1"
				})
	}
}
function giftstatus_callback(b) {
	b.ret == "suc" ? gift_status = b.results : null
}
function fn_act_status() {
	if (appcookie("uin")) {
		$.ajax( {
					url : "http://hd.guanjia.qq.com/fcgi-bin/hdquery?cb=actstatus_callback",
					dataType : "jsonp",
					jsonp : "actstatus_callback",
					type : "get",
					cache : false,
					data : "Uin=" + getUinNum(appcookie("uin")) + "&skey="
							+ appcookie("skey")
							+ "&logic=gj&PageSize=99&PageIndex=1"
				})
	}
}
function actstatus_callback(b) {
	b.ret == "suc" ? act_status = b.results : null;
	getactivity()
}
function my_act_init(a) {
	$("#my_act_page").pagination(a, {
		num_edge_entries : 2,
		num_display_entries : 5,
		prev_text : "上一页",
		next_text : "下一页",
		callback : MyActCallback,
		items_per_page : 6
	});
	my_act_flag = true;
}
function MyActCallback(a, b) {
	my_act_flag ? get_my_act(a + 1) : null;
}
function get_my_act(a) {
	/*if (!appcookie("uin")) {
		login();
	}*/
	$.ajax( {
				url : "http://hd.guanjia.qq.com/fcgi-bin/hduhd?cb=activetygjlist_callback",
				dataType : "jsonp",
				jsonp : "activetygjlist_callback",
				type : "get",
				cache : false,
				data : "Uin=" + getUinNum(appcookie("uin")) + "&skey="
						+ appcookie("skey") + "&logic=gj&PageSize=6&PageIndex="
						+ a
			})
}
function activetygjlist_callback(b) {
	act_fag = true;
	var e = b.results;
	$("#my_act table").empty();
	if (e) {
		for ( var d = 0; d < e.length; d++) {
			var g;
			var f;
			e[d].days == 0 ? g = "<em>今天</em>" : g = "<em>" + e[d].days
					+ "</em>天前";
			e[d].result_info.indexOf("CDKEY") >= 0 ? f = "<b>"
					+ e[d].result_info
					+ '<a href="#" class="copy">复制CDKEY</a></b>' : f = "<b>"
					+ e[d].name + "</b>";
			var c = [
					"<tr>",
					'<td width="40%" valign="top">',
					g + "  <span>" + e[d].insert_time + "</span ><br />",
					"<strong>" + e[d].name + "</strong>",
					"</td>",
					'<td class="info">',
					f,
					"<span>" + e[d].description + "</span>",
					'<a href="#" data-stats="more.id' + e[d].id
							+ '" class="toggle on">展开详情</a>', "</td>", "</tr>" ]
					.join("");
			$("#my_act table").append(c)
		}
		my_act_event();
		!my_act_flag ? my_act_init(b.TotalCnt) : null
	} else {
		$("#my_act").empty();
		$("#my_act").append("您还未领取任何特权礼包");
	}
}
function login() {
	$.blockUI( {
		message : $("#loginframe"),
		css : {
			top : "50%",
			left : "55%",
			width : "372px",
			border : "none"
		}
	});
	var a = window.location + "";
	a = a.indexOf("#") == -1 ? a : a.substring(0, a.indexOf("#"));
	$("#login_ifr")
			.attr(
					"src",
					"http://ui.ptlogin2.qq.com/cgi-bin/login?f_url=loginerroralert&reset_text=%D6%D8%D6%C3&style=0&qlogin_auto_login=0&appid=13000402&s_url="
							+ encodeURIComponent(a))
}
$("#loginout").click(function() {
	var a = cookie;
	a.domain = "qq.com";
	appcookie("skey", "", a);
	appcookie("uin", "", a);
	window.location.reload();
});
function set_bar(d, e) {
	var a = level_num[parseInt(e) + 1] - level_num[e];
	var c = 268;
	var b = parseInt(c * (d - level_num[e]) / a);
	$(".bar_lv").animate( {
		width : b
	}, 2000)
}
function appcookie(q, d, a) {
	if (typeof d == "undefined") {
		if (0 < document.cookie.length) {
			var c = document.cookie.match(new RegExp("(^| )" + q
					+ "=([^;]*)(;|$)"));
			return (null === c) ? "" : c[2]
		}
		return ""
	} else {
		if (appcookie(q) == d) {
			return
		} else {
			a = $.extend( {
				expires : 1,
				path : "/",
				domain : window.document.location.hostname
			}, a || {});
			if (d === null) {
				d = "";
				a.expires = -1
			}
			var p = "";
			if (a.expires
					&& (typeof a.expires == "number" || a.expires.toUTCString)) {
				var o;
				if (typeof a.expires == "number") {
					o = new Date();
					o.setTime(o.getTime() + (a.expires * 1 * 60 * 60 * 1000))
				} else {
					o = a.expires
				}
				p = o.toUTCString()
			}
			var b = a.path ? "; path=" + (a.path) : "";
			var n = a.domain ? "; domain=" + (a.domain) : jQuery.getHost();
			var r = a.secure ? "; secure" : "";
			document.cookie = q + "=" + d + "; path=" + b + "; domain=" + n
					+ "; expires=" + p
		}
	}
}
function share_wb() {
	var m = [
			"#安全等级特权# 我的安全达人等级是" + safeLV + "级，可以获得LV" + safeLV
					+ "等级豪华大礼包！等级越高礼包越珍贵哦！赶快来领取吧！“活动地址”",
			"#安全等级特权# 完成各种安全任务就能获得安全成长值！并且获得相应等级的豪华大礼包！等级越高礼包越珍贵哦！赶快来领取吧！“活动地址”",
			"#安全等级特权# 点亮安全达人图标，即可领取丰富特权！三重礼包等你来领~~~“活动地址”",
			"#安全等级特权# 我是安全达人，级别已经达到了LV"
					+ safeLV
					+ "！可以获得“QQ会员特权体验卡”、“QQ飞车安全达人礼包”、“拍拍优惠券”三重大礼包，你也来领取吧！“活动地址”",
			"#安全等级特权# QQ安全成长体系全新推出了“等级特权”，安全达人们可以根据自身的等级领取相应的礼包！我的安全达人等级是"
					+ safeLV + "级，你的咧？“活动地址”",
			"#安全等级特权# 赶快点亮安全达人图标，获得安全等级特权！等级越高，礼包越豪华！通过完成安全任务就能提高安全等级~“活动地址”" ];
	var i = parseInt(Math.random() * 6);
	var j = encodeURIComponent(m[i]);
	var n = encodeURIComponent("http://tq.guanjia.qq.com");
	var k = encodeURI("key18e84210bb4140868311e3459da3f81a");
	var g = encodeURI("");
	var h = encodeURIComponent("http://guanjia.qq.com/");
	var l = "http://v.t.qq.com/share/share.php?title=" + j + "&url=" + n
			+ "&appkey=" + k + "&site=" + h + "&pic=" + g;
	window.open(
					l,
					"",
					"width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no")
}
function share_qzone() {
	var c = {
		url : "http://tq.guanjia.qq.com/",
		desc : "QQ安全成长体系全新推出了“安全等级特权”，安全达人们可以根据自身的等级领取相应的礼包！等级越高礼包越珍贵哦！赶快来领取吧！",
		summary : "安全等级特权是为QQ安全达人量身定做的多重尊贵特权，包括价值丰厚的大礼包、不定期的用户回馈活动等。轻松完成安全成长任务，即可免费领取相应等级特权。等级越高，享受的特权越尊贵。",
		title : "点亮安全达人图标，即可领取丰富特权！",
		site : "http://guanjia.qq.com/"
	};
	var b = [];
	for ( var a in c) {
		b.push(a + "=" + encodeURIComponent(c[a] || ""))
	}
	window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + b.join("&"));
}
function copy_cdkey(b) {
	var a = b.substr(6);
	if ($.browser.msie) {
		$("#copy_cdkey").click(function() {
			window.clipboardData.setData("Text", a);
			alert("CDKEY复制成功。");
		})
	} else {
		$("#copy_cdkey").click(function() {
			alert("您所用的浏览器不支持复制，请手动复制。");
		})
	}
}
function getUinNum(a) {
	var b = 0;
	if (a.charAt(0) == "o" || a.charAt(0) == "0") {
		b = b + 1;
		while (a.charAt(b) == "0") {
			b++;
		}
		a = a.substr(b, a.length);
	}
	return a;
}
function ptlogin2_onResize(d, c) {
	$("#login_ifr").hide().css( {
		width : d + "px",
		height : c + "px"
	}).show();
	$("#loginframe").css( {
		width : d + "px",
		height : c + "px"
	})
}
function ptlogin2_onClose() {
	$.unblockUI();
};