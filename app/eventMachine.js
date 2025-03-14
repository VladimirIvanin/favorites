import {systemEvents} from './defaults.js';
import {patchNumber} from './patchNumber.js';

export default function eventMachine(name, target) {
  const self = this;

  const _products = self.products || {};
  const _variants = self.variants || {};

  // Filter out products not in productIds
  Object.keys(_products).forEach(index => {
    if (!self.productIds.includes(_products[index].id)) {
      delete _products[index];
    }
  });

  // Filter out variants not in productIds
  Object.keys(_variants).forEach(index => {
    if (!self.productIds.includes(_variants[index].product_id)) {
      delete _variants[index];
    }
  });

  const _pub = {
    products: _products,
    target: target || null,
    favorites: {
      size: _products.length,
      totalPrice: getTotalPrice(_products)
    }
  };

  // EventBus
  if (typeof EventBus === 'object' && EventBus.publish) {
    EventBus.publish(name, _pub);
  }

  // Custom event
  const event = new CustomEvent(name, { 
    detail: { insalesFavorites: _pub },
    bubbles: true
  });
  document.dispatchEvent(event);

  // Callback
  const methodName = getMethodName(name);
  if (self.options[methodName] && typeof self.options[methodName] === 'function') {
    self.options[methodName](_pub);
  }
}

function getMethodName(name) {
  let _methodName = '';
  
  Object.entries(systemEvents).forEach(([index, el]) => {
    if (el === name) {
      _methodName = 'on' + capitalize(index);
    }
  });

  return _methodName;
}

const capitalize = (_string) => {
  return _string.charAt(0).toUpperCase() + _string.slice(1);
};

function getTotalPrice(products) {
  return products.reduce((total, product) => {
    return total + patchNumber(product.price);
  }, 0);
}