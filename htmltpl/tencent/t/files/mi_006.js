MI.WebQQ={};(function(){function g(){if(!h){h=true;var b=document.createElement("script"),a=document.createElement("link");a[d]("id","EQQ_SkinCss");a[d]("type","text/css");a[d]("charset","utf-8");a[d]("rel","stylesheet");a[d]("href",m);j.appendChild(a);b[d]("type","text/javascript");b[d]("src",n);document.body.appendChild(b);o(k,"mousedown",g);setTimeout(function(){h=false},15E3)}}var i=window.attachEvent?function(b,a,e){b.attachEvent("on"+a,e)}:function(b,a,e){b.addEventListener(a,e,false)},o=window.attachEvent?function(b,a,e){b.detachEvent("on"+a,e)}:function(b,a,e){b.removeEventListener(a,e,false)},l=Array(15),p=function(b){for(var a=(new Date).getTime(),e=l.length;e--;){var f=l[e];if(f){if(f.timestamp+imgTimeout*1E3<a){f.timestamp=a;f.img.src=b+"&t="+(new Date).getTime();break}}else{f={img:new Image,timestamp:a};a=f.img;i(a,"load",function(){f.timestamp=0});i(a,"error",function(){f.timestamp=0});a.src=b+"&t="+(new Date).getTime();break}}};MI.WebQQ.chatQueue=[];MI.WebQQ.chat=function(){MI.WebQQ.chatQueue.push([].slice.call(arguments));g()};MI.WebQQ.report2m=function(b){p("http://tj.qstatic.com/getlog?m=1$"+b)};var d="setAttribute",m="http://mat1.gtimg.com/www/mb/css/webqq/eqq.main_110621.css",n=MI.version.WebQQFull,j=document.getElementsByTagName("head")?document.getElementsByTagName("head")[0]:document.documentElement,c=document.createElement("link");c[d]("id","EQQ_Pre_SkinCss");c[d]("type","text/css");c[d]("charset","utf-8");c[d]("rel","stylesheet");c[d]("href","http://mat1.gtimg.com/www/mb/css/webqq/eqq.pre.load_110621.css");j.appendChild(c);if(document.getElementById("EQQ_Container"))c=document.getElementById("EQQ_Container");else{c=document.createElement("div");c.id="EQQ_Container";c.style.cssText="position:fixed;right:275px;bottom:0;_position:absolute;_top:expression(documentElement.scrollTop+documentElement.clientHeight-this.offsetHeight);_left:expression(documentElement.scrollLeft+documentElement.clientWidth-this.offsetWidth-275);z-index:6000;border:0 solid red;font:12px/1.5 tahoma,helvetica,clean,sans-serif;color:#333;"}c.innerHTML='                <div id="EQQ_MainBar" class="EQQ_mainBar">                        <div id="EQQ_StartButton" class="EQQ_startButton" title="'+_("点击登录微博聊天")+'">                            <div id="EQQ_StartButtonIcon" class="EQQ_startButtonIcon"><\!--WebQQ logo--\></div>                            <\!--<div id="EQQ_InfoShow" class="EQQ_infoShow">'+_("在线聊天")+'</div>--\>                        </div>                        <\!--                        <div id="EQQ_lock" class="EQQ_lock" >                                                    </div>                        <div id="EQQ_MsgBoxButton" class="EQQ_msgBoxButton" href="###" title="'+_("消息盒子")+'">                            <img id="EQQ_AvatarInMsgBoxButton" class="EQQ_avatarInMsgBoxButton" src="http://imgcache.qq.com/ac/b.gif" />                            <div class="unreadMsgInMsgBoxButton">                                (<span id="EQQ_MsgCounterInMsgBox" title="'+_("未读消息")+'">99</span>)                            </div>                        </div>                        --\>                        <\!--<div class="EQQ_mainBar_bg_outer"><div class="EQQ_mainBar_bg"></div></div>--\>                </div>                <\!--                <div id="EQQ_CustomBar" class="EQQ_customBar">                    <div class="EQQ_rightBorder">'+_("右侧")+'</div>                    <div id="EQQ_CustomContainer" class="EQQ_customContainer"></div>                </div>                --\>                <div id="EQQ_TaskBar" class="EQQ_taskBar">                    <div id="EQQ_Line_1" class="EQQ_line"><\!--'+_("分割线")+'--\></div>                    <div id="EQQ_ExtendButton" class="EQQ_noExtendButton"><div class="EQQ_extendButton_bg"><\!--'+_("左右收缩按钮")+'--\></div></div>                    <div id="EQQ_ChatBuddyList" class="EQQ_chatBuddyList">                    </div>                </div>        ';document.body.appendChild(c);document.getElementById("EQQ_MainBar").style.display="block";var k=document.getElementById("EQQ_MainBar");i(k,"mousedown",g);var h=false;if(MI.user.fun.chat)g();else{if(c=document.getElementById("EQQ_StartButton"))c[d]("title",_("点击开启微博聊天功能"));document.getElementById("EQQ_StartButtonIcon").className="EQQ_startButtonIconForbidden"}})();/*  |xGv00|b1e298f696ecf726133ef27c50889854 */