function checkNonTxDomain4Dom(c,k){var b=c.getElementsByTagName("SCRIPT");var f=c.getElementsByTagName("IFRAME");var g=c.getElementsByTagName("FRAME");var a=c.getElementsByTagName("FORM");var j=/^https?:\/\/\d+\.\d+\.\d+\.\d+.*?[\s\"\']/g;var e=/^https?:\/\/.+?[\s\"\']/g;for(var d=0;d<b.length;d++){var l;while(l=j.exec(b[d].innerHTML)){k.script=k.script.concat(l)}while(l=e.exec(b[d].innerHTML)){for(var h=0;h<l.length;++h){if(isAntiTxDomain(l[h])){k.script.push(l[h])}}}}for(var d=0;d<b.length;d++){if(isAntiTxDomain(b[d].src)){k.script.push(b[d].src)}}for(var d=0;d<f.length;d++){if(isAntiTxDomain(f[d].src)){k.iframe.push(f[d].src)}}for(var d=0;d<g.length;d++){if(isAntiTxDomain(g[d].src)){k.frame.push(g[d].src)}}for(var d=0;d<a.length;d++){if(isAntiTxDomain(a[d].action)){k.form.push(a[d].action)}}for(var h=0;h<k.script.length;++h){k.da.push("script::"+encodeURIComponent(k.script[h]))}for(var h=0;h<k.iframe.length;++h){k.da.push("iframe::"+encodeURIComponent(k.iframe[h]))}for(var h=0;h<k.frame.length;++h){k.da.push("frame::"+encodeURIComponent(k.frame[h]))}for(var h=0;h<k.form.length;++h){k.da.push("form::"+encodeURIComponent(k.form[h]))}}function checkNonTxDomain(g,c){if(Math.random()>g){return}try{var b={script:[],form:[],iframe:[],frame:[],da:[]};var a={script:[],form:[],iframe:[],frame:[],da:[]};checkNonTxDomain4Dom(document,b);if(b.da.length>0){var f=new Image();b.da.push(encodeURIComponent(window.location.href));f.src="http://cr.sec.qq.com/cr?id="+c+"&d=datapt=v1.2|"+b.da.join("|")}try{if(parent.window!=window){checkNonTxDomain4Dom(parent.document,a);if(a.da.length>0){var f=new Image();a.da.push(encodeURIComponent(parent.window.location.href));f.src="http://cr.sec.qq.com/cr?id="+c+"&d=datapp=v1.2|"+a.da.join("|")}}}catch(d){}}catch(d){}}function isAntiTxDomain(a){var b=/^https?:\/\/.+?/;if(/^(https?:\/\/)[\w\-.]+((\.(qq|paipai|soso|taotao|wenwen|tenpay|macromedia|gtimg|imrworldwide)\.com)|(\.(gtimg|qlogo)\.cn))($|\/|\\)/i.test(a)||!b.test(a)){return false}return true};
/*  |xGv00|0c57c78a16cfe43db7963888c7a1b3c7 */