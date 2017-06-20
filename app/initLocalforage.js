'use strict';

export default function initLocalforage(cb) {
  if (typeof window.localforage == "undefined") {
    console.warn('Не подключен плагин localforage!');
    importScript("https://cdnjs.cloudflare.com/ajax/libs/localforage/1.5.0/localforage.min.js", function () {
      cb();
    });
  }else{
    cb();
  }
}

var importScript = (function (oHead) {

  function loadError (oError) {
    throw new URIError("The script " + oError.target.src + " is not accessible.");
  }

  return function (sSrc, fOnload) {
    var oScript = document.createElement("script");
    oScript.type = "text\/javascript";
    oScript.onerror = loadError;
    if (fOnload) { oScript.onload = fOnload; }
    oHead.appendChild(oScript);
    oScript.src = sSrc;
  }

})(document.head || document.getElementsByTagName("head")[0]);
