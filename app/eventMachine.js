'use strict';
import {defaults, systemEvents, system} from './defaults.js';
import {patchNumber} from './patchNumber.js';

export default function eventMachine(name, $target) {
  var self = this;

  var _pub = {}
  _pub['products'] = self.products || {};
  _pub['variants'] = self.variants || {};
  _pub['$target'] = $target || null;

  _pub['favorites'] = {
    size: Object.keys(_pub.products).length,
    totalPrice: getTotalPrice(_pub.products)
  }

  // EventBus
  if (typeof EventBus == 'object' && EventBus.publish) {
    EventBus.publish(name, _pub)
  }

  // jquery events
  var event = jQuery.Event( name );
  event['insalesFavorites'] = _pub;

  $(document).trigger( event );

  // Callback
  var methodName = getMethodName(self, name);

  if (self.options[methodName] && typeof self.options[methodName] == 'function') {
    self.options[methodName](_pub)
  }

}

function getMethodName(self, name) {
  var _methodName = '';

  $.each(systemEvents, function(index, el) {
    if (el === name) {
      _methodName = 'on' + capitalize(index);
    }
  });

  return _methodName
}

var capitalize = function(_string) {
    return _string.charAt(0).toUpperCase() + _string.slice(1);
}

function getTotalPrice(products) {
  var result = 0;
  $.each(products, function(index, el) {
    result += patchNumber(el.price);
  });

  return result;
}
