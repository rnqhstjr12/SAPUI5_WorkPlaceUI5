// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log"],function(e){"use strict";var n={pendingEvents:{},subscribers:{},dispatchOperations:{},store:t(),dispatchTimeoutIds:new window.Set};function t(){return{nextKey:0,objectToKey:new window.WeakMap,keyToObject:{}}}function r(n,t,r){e.error(n,t,"sap.ushell.EventHub");return}function i(e){var n="An exception was raised while executing a registered callback on event '"+e.eventName+"'",t="Data passed to the event were: '"+e.eventData+"'";if(e.error.stack){t+=" Error details: "+e.error.stack}r(n,t,e.fnCausedBy)}function u(e,n,t){var r;try{r=n(t)}catch(r){i({eventName:e,eventData:t,fnCausedBy:n,error:r})}return r}function o(e){if(typeof arguments[2]==="function"){return E(e,arguments[2])}return arguments[2]}function a(e){if(typeof arguments[2]==="string"&&arguments[2].indexOf("<function")===0){return k(e,arguments[2])}return arguments[2]}function c(e,n,t){if(typeof n==="object"||typeof n==="function"){try{var i=[n,o.bind(null,e)];if(t){i.push(3)}return JSON.stringify.apply(JSON,i)}catch(e){r(""+e,e.stack,c)}}return n}function s(e,n){try{return JSON.parse(n,a.bind(null,e))}catch(e){return n}}function f(e,n,t){if(!e.subscribers[n]){e.subscribers[n]=[]}e.subscribers[n].push(t)}function l(e,n,t){e.subscribers[n]=(e.subscribers[n]||[]).map(function(e){return e.filter(function(e){return e.fn!==t})}).filter(function(e){return e.length>0})}function d(){var e,n=new Promise(function(n){e=n}),t={dispatching:n,cancelled:false,cancel:function(){t.cancelled=true},complete:function(){e()}};return t}function p(e,n){if(!e.subscribers.hasOwnProperty(n)){return null}var t=d(),r=e.subscribers[n],i=r.map(function(r){return h(e,n,r,t,0)});Promise.all(i).then(t.complete,t.complete);return t}function h(e,n,t,r,i){var u=t.length,o=t.slice(i);return o.reduce(function(i,u){return i.then(function(i){if(r.cancelled){if(i){l(e,n,u.fn)}return i}return v(e,n,u,t).then(function(e){if(e){r.cancelled=true}return e})})},Promise.resolve(false)).then(function(i){if(!i&&u<t.length){return h(e,n,t,r,u)}return i})}function v(e,n,t,r){return new Promise(function(i){var o=s(e,e.pendingEvents[n]);var a=setTimeout(function(){e.dispatchTimeoutIds.delete(a);if(t.called&&r.offed){i(false);return}t.called=true;var c=r.offed;u(n,t.fn,o);var s=r.offed;if(s){l(e,n,t.fn)}i(!c&&s)},0);e.dispatchTimeoutIds.add(a)})}function b(e,n,t){return function(){t.forEach(function(t){if(t.called){l(e,n,t.fn)}});t.offed=true;return{off:b(e,n,[])}}}function y(e,n,t){return function(r){var i={fn:r,called:false};t.push(i);if(e.pendingEvents.hasOwnProperty(n)){var u=e.dispatchOperations[n];if(!u){v(e,n,i,t)}else{u.dispatching.then(function(){if(!i.called){v(e,n,i,t)}})}}return{do:y(e,n,t),off:b(e,n,t)}}}function m(e,n){var t=[];f(e,n,t);return{do:y(e,n,t),off:b(e,n,t)}}function w(e,n){var t=m(e,n);t.off();return t}function g(e,n,t,r){var i=c(e,t);if(!r&&e.pendingEvents.hasOwnProperty(n)&&e.pendingEvents[n]===i){return this}e.pendingEvents[n]=i;var u=e.dispatchOperations[n];if(u){u.cancel()}var o=p(e,n);e.dispatchOperations[n]=o;return this}function O(e,n){return s(e,e.pendingEvents[n])}function j(){var e=Array.prototype.slice.call(arguments);e.shift();var n=0,t=new Array(e.length).join(",").split(",").map(function(){return 1}),r=[],i={do:function(u){e.forEach(function(i,o){i.do(function(i,o){r[i]=o;n+=t[i];t[i]=0;if(n===e.length){u.apply(null,r)}}.bind(null,o))});return{off:i.off}},off:function(){var n=e.reduce(function(e,n){return n.off()},function(){});return{off:n}}};return i}function P(e,n){var t=e.dispatchOperations[n];return t?t.dispatching:Promise.resolve()}function E(e,n){if(e.store.objectToKey.has(n)){return e.store.objectToKey.get(n)}e.store.nextKey++;var t="<"+typeof n+">#"+e.store.nextKey;e.store.keyToObject[t]=n;e.store.objectToKey.set(n,t);return t}function k(e,n){return e.store.keyToObject[n]}function T(e){var n={};n.emit=g.bind(n,e);n.on=m.bind(null,e);n.once=w.bind(null,e);n.last=O.bind(null,e);n.join=j.bind(null,e);n.wait=P.bind(null,e);n._reset=function(e){e.pendingEvents={};e.subscribers={};e.dispatchOperations={};e.store=t();e.dispatchTimeoutIds.forEach(clearTimeout);e.dispatchTimeoutIds=new window.Set}.bind(null,e);return n}function x(e){var n={pendingEvents:{},subscribers:{},dispatchOperations:{},store:t(),dispatchTimeoutIds:new window.Set},r=T(n),i=s(n,c(n,e));function u(e){var n=e.charAt(0);if(n.match(/[a-zA-Z0-9]/)){throw new Error("Invalid path separator '"+n+"'. Please ensure path starts with a non alphanumeric character")}var t=e.split(n);t.shift();return t}function o(e,n){var t=e,r="";if(arguments.length===2){t=n;r=e}return r+"/"+t.join("/")}function a(e){return Object.prototype.toString.apply(e)==="[object Array]"}function f(e){return Object(e)!==e}function l(e){return(a(e)?e.length:Object.keys(e).length)===0}function d(e,t,r,i){var u="",s=e,l=[];r.reduce(function(e,t,d){u=o(u,[t]);s=s[t];if(d===r.length-1){if(!f(i)&&!f(s)&&Object.keys(s).length>0){var p,h=Object.keys(s).reduce(function(e,n){e[n]=true;return e},{}),v=Object.keys(i).some(function(e){p=e;var n=h.hasOwnProperty(e);delete h[e];var t=!f(s[e])&&Object.keys(s[e]).length>0;return!n||t}),b=Object.keys(h).length>0,y=v||b;if(y){var m=v?"One or more values are not defined in the channel contract or are defined as a non-empty object/array, for example, check '"+p+"'.":"Some keys are missing in the event data: "+Object.keys(h).join(", ")+".";throw new Error("Cannot write value '"+c(n,i,true)+"' to path '"+u+"'. "+m+" All childrens in the value must appear in the channel contract and must have a simple value or should be defined as an empty complex value")}var w=Object.keys(i).map(function(e){return{serializedPath:o(u,[e]),value:i[e]}});Array.prototype.push.apply(l,w)}e[t]=i}else if(!e.hasOwnProperty(t)){e[t]=a(s)?[]:{}}l.push({serializedPath:u,value:e[t]});return e[t]},t);return l}function p(e,t){var r="",i=t.reduce(function(e,t){r+="/"+t;if(a(e)&&!t.match(/^[0-9]+$/)){throw new Error("Invalid array index '"+t+"' provided in path '"+r+"'")}if(!e.hasOwnProperty(t)){throw new Error("The item '"+t+"' from path "+r+" cannot be accessed in the object: "+c(n,e))}return e[t]},e);return i}function h(e,n,t){return n.reduce(function(e,r,i){var u=i===n.length-1;if(e.hasOwnProperty(r)){return e[r]}return u?t:{}},e)}function v(e,n){n.pop();var t=e,r=[];return n.reduce(function(e,n){t=t[n];r.push(n);e.push({serializedPath:o(r),value:t});return e},[])}function b(e){return e.map(function(e){var t=e.serializedPath;if(!n.subscribers.hasOwnProperty(t)||n.subscribers[t].length===0){return null}return{path:t,value:e.value}}).filter(function(e){return!!e})}function y(n,t){var o=u(n);p(e,o);var a=d(e,i,o,t);a.forEach(function(e){r.emit(e.serializedPath,e.value)})}function m(n){var t=u(n),r=p(e,t);return h(i,t,r)}function w(t){var i=u(t),a=o(i),d=r.last(a),h=n.pendingEvents.hasOwnProperty(a);if(h){return r.on(a)}d=p(e,i);if(typeof d!=="undefined"&&(f(d)||!l(s(r,c(r,d))))){r.emit(a,d)}return r.on(a)}function g(e){var n=w(e);n.off();return n}function O(e){var n=u(e),t=v(i,n),o=b(t).map(function(e){return r.wait(e.path,e.value)});return Promise.all(o.concat(r.wait(e)))}return{emit:y,on:w,once:g,last:m,wait:O,join:j.bind(null,r)}}var A=T(n);A.createChannel=x.bind(null);return A});
//# sourceMappingURL=EventHub.js.map