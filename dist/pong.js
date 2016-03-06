!function(){"use strict";function t(t,e){return e={exports:{}},t(e,e.exports),e.exports}function e(t){t=t||"";var e=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css",n.styleSheet?n.styleSheet.cssText=t:n.appendChild(document.createTextNode(t)),e.appendChild(n)}function n(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(n){}return e}function o(t){return!!t&&"object"==typeof t}function a(t){if(!o(t)||I.call(t)!=m||n(t))return!1;var e=j(t);if(null===e)return!0;var a=e.constructor;return"function"==typeof a&&a instanceof a&&w.call(a)==x}function r(t,e,n){function o(){p===y&&(p=y.slice())}function c(){return u}function i(t){if("function"!=typeof t)throw new Error("Expected listener to be a function.");var e=!0;return o(),p.push(t),function(){if(e){e=!1,o();var n=p.indexOf(t);p.splice(n,1)}}}function f(t){if(!a(t))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if("undefined"==typeof t.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(d)throw new Error("Reducers may not dispatch actions.");try{d=!0,u=s(u,t)}finally{d=!1}for(var e=y=p,n=0;n<e.length;n++)e[n]();return t}function l(t){if("function"!=typeof t)throw new Error("Expected the nextReducer to be a function.");s=t,f({type:O.INIT})}if("function"==typeof e&&"undefined"==typeof n&&(n=e,e=void 0),"undefined"!=typeof n){if("function"!=typeof n)throw new Error("Expected the enhancer to be a function.");return n(r)(t,e)}if("function"!=typeof t)throw new Error("Expected the reducer to be a function.");var s=t,u=e,y=[],p=y,d=!1;return f({type:O.INIT}),{dispatch:f,subscribe:i,getState:c,replaceReducer:l}}function c(t){var e=4294967295,n=t,o=987654321;return function(){return o=36969*(65535&o)+(o>>16)&e,n=18e3*(65535&n)+(n>>16)&e,((o<<16)+n&e)/4294967296+.5}}function i(t){return+t.toString().replace(".","")}function f(t,e,n,o){var a=c(o);return X(n).map(function(){return{x:t,y:e,a:a()*Math.PI*2,v:a()*(Z-Y)+Y,color:Math.floor(16777215*a())}})}function l(t,e){var n=t.ball,o=t.hold,a=t.player,r=t.computer,c=t.particles,l=Math.cos(n.a)*S,s=Math.sin(n.a)*S,u=n.x+l*e,y=n.y+s*e,p=n.a+n.va*e,d=n.va;return o>0?Object.assign({},t,{hold:o-e}):u>k/2+C/2?Object.assign({},t,{hold:U,ball:Object.assign({},_.ball)}):-k/2-C/2>u?Object.assign({},t,{hold:U,ball:Object.assign({},_.ball,{a:Math.PI+B})}):(y>M/2-C/2&&(y=M/2-C/2,p=Math.atan2(-s,l),c=c.concat(f(u,y,z,i(p)))),-M/2+C/2>y&&(y=-M/2+C/2,p=Math.atan2(-s,l),c=c.concat(f(u,y,z,i(p)))),-R+H/2+C/2>u&&y>a.y-N/2&&y<a.y+N/2&&Math.cos(p)<0&&(u=-R+H/2+C/2,p=Math.atan2(s,-l),d+=a.vy*D,c=c.concat(f(u,y,z,i(p)))),u>R-H/2-C/2&&y>r.y-N/2&&y<r.y+N/2&&Math.cos(p)>0&&(u=R-H/2-C/2,p=Math.atan2(s,-l),d+=r.vy*D,c=c.concat(f(u,y,z,i(p)))),d=Math.max(Math.min(d,A),-A),Object.assign({},t,{ball:Object.assign({},n,{x:u,y:y,a:p,va:d}),particles:c}))}function s(t,e,n){var o=t.vy,a=t.y+o*n,r=-M/2+N/2;r>a&&(o=-o,a=r);var c=M/2-N/2;return a>c&&(o=-o,a=c),e[F]&&(o-=P),e[J]&&(o+=P),o*=T*n,Object.assign({},t,{vy:o,y:a})}function u(t,e,n){var o=t.vy,a=t.y+o*n,r=-M/2+N/2;r>a&&(o=-o,a=r);var c=M/2-N/2;return a>c&&(o=-o,a=c),Math.cos(e.a)>0&&(e.y<t.y-q&&(o-=Q),e.y>t.y+q&&(o+=Q)),o*=T*n,Object.assign({},t,{vy:o,y:a})}function y(t,e){return t.map(function(t){var n=Math.cos(t.a)*t.v,o=Math.sin(t.a)*t.v,a=t.x+n*e,r=t.y+o*e;return a>k/2||-k/2>a?null:r>M/2||-M/2>r?null:Object.assign({},t,{x:a,y:r})}).filter(function(t){return t})}function p(){var t=arguments.length<=0||void 0===arguments[0]?_:arguments[0],e=arguments[1];switch(e.type){case"tick":var n=Object.assign({},t,l(t,e.dt));return Object.assign({},n,{player:s(n.player,n.keys,e.dt),computer:u(n.computer,n.ball,e.dt),particles:y(n.particles,e.dt)});case"keyUp":case"keyDown":return Object.assign({},t,{keys:Object.assign({},t.keys,b.defineProperty({},e.keyCode,"keyDown"===e.type))});default:return t}}function d(t,e,n,o,a){var r=arguments.length<=5||void 0===arguments[5]?0:arguments[5],c=arguments.length<=6||void 0===arguments[6]?K:arguments[6];t.save(),t.translate(e,n),t.rotate(r),t.fillStyle=c,t.fillRect(-o/2,-a/2,o,a),t.restore()}function h(t){var e=document.getElementById("pong").getContext("2d");e.fillStyle=L,e.fillRect(0,0,k*E,M*E),e.save(),e.scale(E,E),e.translate(k/2,M/2),t.particles.forEach(function(t){return d(e,t.x,t.y,W,W,0,"#"+t.color.toString(16))}),d(e,t.ball.x,t.ball.y,C,C,t.ball.a),d(e,-R,t.player.y,H,N),d(e,R,t.computer.y,H,N),e.restore()}function v(){var t=(new Date-$)/1e3;$=new Date,V.dispatch({type:"tick",dt:t}),h(V.getState()),window.requestAnimationFrame(v)}var b={};b.defineProperty=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t};var m="[object Object]",g=Object.prototype,w=Function.prototype.toString,x=w.call(Object),I=g.toString,j=Object.getPrototypeOf,O={INIT:"@@redux/INIT"},k=600,M=400,E=2,C=20,S=400,D=.002,A=2,B=Math.PI/9,R=k/2-20,H=10,N=70,T=57,P=40,Q=20,q=25,U=2,W=2,Y=100,Z=300,z=200,F=38,J=40,L="#fff",K="#666",G=t(function(t){t.exports=function(t,e){var n="number"==typeof t,o="number"==typeof e;n&&!o?(e=t,t=0):n||o||(t=0,e=0),t=0|t,e=0|e;var a=e-t;if(0>a)throw new Error("array length must be positive");for(var r=new Array(a),c=0,i=t;a>c;c++,i++)r[c]=i;return r}}),X=G&&"object"==typeof G&&"default"in G?G["default"]:G,_={hold:0,ball:{x:0,y:0,a:B,va:0},player:{y:0,vy:0},computer:{y:0,vy:0},particles:[],keys:{}};e('@font-face{font-family:Inconsolata;font-style:normal;font-weight:400;src:local(Inconsolata),url(//fonts.gstatic.com/s/inconsolata/v11/BjAYBlHtW3CJxDcjzrnZCGfQcKutQXcIrRfyR5jdjY8.eot#) format("eot"),url(//fonts.gstatic.com/s/inconsolata/v11/BjAYBlHtW3CJxDcjzrnZCI4P5ICox8Kq3LLUNMylGO4.woff2) format("woff2"),url(//fonts.gstatic.com/s/inconsolata/v11/BjAYBlHtW3CJxDcjzrnZCIbN6UDyHWBl620a-IRfuBk.woff) format("woff")}@font-face{font-family:Inconsolata;font-style:normal;font-weight:700;src:local("Inconsolata Bold"),local(Inconsolata-Bold),url(//fonts.gstatic.com/s/inconsolata/v11/AIed271kqQlcIRSOnQH0ybFt29aCHKT7otDW9l62Aag.eot#) format("eot"),url(//fonts.gstatic.com/s/inconsolata/v11/AIed271kqQlcIRSOnQH0yYlIZu-HDpmDIZMigmsroc4.woff2) format("woff2"),url(//fonts.gstatic.com/s/inconsolata/v11/AIed271kqQlcIRSOnQH0yTqR_3kx9_hJXbbyU8S6IN0.woff) format("woff")}@import \'https://fonts.googleapis.com/css?family=Inconsolata\';body{background:#fafafa;font-family:Inconsolata,monospace;font-size:18px;height:100%;margin:0;position:fixed;text-align:center;width:100%}a,body{color:#666}#pong{height:100%}.about{bottom:0;left:0;padding:4px;position:absolute;right:0}');var V=r(p),$=new Date;window.requestAnimationFrame(v),window.addEventListener("keydown",function(t){V.dispatch({type:"keyDown",keyCode:t.keyCode})}),window.addEventListener("keyup",function(t){V.dispatch({type:"keyUp",keyCode:t.keyCode})})}();
//# sourceMappingURL=pong.js.map