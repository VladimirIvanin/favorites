'use strict;'
import {defaults, systemEvents, system, systemSelectors} from './defaults.js';
import {getVariants} from './getProductList.js';
import {patchNumber} from './patchNumber.js';

export function removeToFavorites($target, id) {
  var self = this;
  var statusProduct = getStatusProduct(
    $target, self.productIds,
    id,
    self.options.classes.added,
    self.options.classes.notAdded
  );

  if (!statusProduct.isActive && statusProduct.notAdded) {
    return;
  }

  self.productIds = removeItemArray(self.productIds, id);
  self.productIds = unique(self.productIds);

  var _variantId = getVariantId($target);
  if (_variantId) {
    self.variantIds = removeItemArray(self.variantIds, _variantId);
    self.variantIds = unique(self.variantIds);
  }

  self.setFavorites({
    products: self.productIds,
    variants: self.variantIds
  });

  triggerDataProduct($target, self, id)

  self.getProductList(self.productIds).done(function (_products) {
    self.products = _products || {};
    self.variants = getVariants(_products, self.variantIds) || {};

    self.eventMachine(systemEvents.remove, $target);
    if (Object.keys(self.products).length == 0) {
      self.eventMachine(systemEvents.empty, null);
    }
    self.eventMachine(systemEvents.update, $target);
  }).fail(function () {
      self.products = {};
      self.variants = {};

      self.eventMachine(systemEvents.remove, $target);
      if (Object.keys(self.products).length == 0) {
        self.eventMachine(systemEvents.empty, null);
      }
      self.eventMachine(systemEvents.update, $target);
  });

}

export function addToFavorites($target, id) {
  var self = this;
  var statusProduct = getStatusProduct(
    $target, self.productIds,
    id,
    self.options.classes.added,
    self.options.classes.notAdded
  );

  if (statusProduct.isActive && statusProduct.isAdded) {
    return;
  }

  self.productIds.push(id);
  self.productIds = unique(self.productIds);

  var _variantId = getVariantId($target);
  if (_variantId) {
    self.variantIds.push(_variantId);
    self.variantIds = unique(self.variantIds);
  }

  self.setFavorites({
    products: self.productIds,
    variants: self.variantIds
  });

  triggerDataProduct($target, self, id)

  self.getProductList(self.productIds).done(function (_products) {
    self.products = _products || {};
    self.variants = getVariants(_products, self.variantIds) || {};

    self.eventMachine(systemEvents.add, $target);
    if (Object.keys(self.products).length == 0) {
      self.eventMachine(systemEvents.empty, null);
    }
    self.eventMachine(systemEvents.update, $target);
  });

}

function getVariantId($target) {
  var result = false;

  var $form = $target.parents('form:first');
  var $productBlock = $target.parents('[data-product-id]:first');

  var $variant_id = $productBlock.find('[name="variant_id"]');
  if ($variant_id.length > 0) {
    result = patchNumber( $variant_id.val() )
  }else{
    $variant_id = $form.find('[name="variant_id"]');
    if ($variant_id.length > 0) {
      result = patchNumber( $variant_id.val() )
    }
  }

  return result;
}

// переключить статусы
export function checkFavoritesProducts() {
  var self = this;
  $('['+systemSelectors.trigger+']').each(function(index, val) {
    triggerDataProduct($(this), self, $(this).data(systemSelectors.triggerParam))
  });
  $('['+systemSelectors.add+']').each(function(index, val) {
    triggerDataProduct($(this), self, $(this).data(systemSelectors.addParam))
  });
  $('['+systemSelectors.remove+']').each(function(index, val) {
    triggerDataProduct($(this), self, $(this).data(systemSelectors.removeParam))
  });
}

// переключить статус кнопки продукта
function triggerDataProduct($target, self, id) {
  var statusProduct = getStatusProduct(
    $target, self.productIds,
    id,
    self.options.classes.added,
    self.options.classes.notAdded
  );

  if (statusProduct.isActive) {
    $target.removeClass(self.options.classes.notAdded);
    if (self.options.replaceTitle) {
      $target.attr('title', self.options.titles.added);
    }
    if (!statusProduct.isAdded) {
      $target.addClass(self.options.classes.added);
    }

    if (self.options.buttonNotAddedText) {
      renderButtonText(self,  $target, statusProduct.isActive)
    }
  }

  if (!statusProduct.isActive) {
    $target.removeClass(self.options.classes.added);
    if (self.options.replaceTitle) {
      $target.attr('title', self.options.titles.notAdded);
    }
    if (!statusProduct.notAdded) {
      $target.addClass(self.options.classes.notAdded);
    }
    if (self.options.buttonNotAddedText) {
      renderButtonText(self,  $target, statusProduct.isActive)
    }
  }
}


function renderButtonText(self,  $target, isActive) {
  if (isActive) {
    var text = self.options.buttonAddedText || self.options.buttonNotAddedText;
    $target.html(text);
  }else{
    var text = self.options.buttonNotAddedText || '';
    $target.html(text);
  }
}


export function getStatusProduct($target, productIds, id, addedClass, notAddedClass) {
  var status = {
    isActive: productIds.indexOf(id) > -1,
    isAdded: $target.hasClass(addedClass),
    notAdded: $target.hasClass(notAddedClass),
  }
  return status;
}

var unique = function (_array) {
  var unique = [];
  for (var i = 0; i < _array.length; i++) {
    if (unique.indexOf(_array[i]) == -1) {
      unique.push(_array[i]);
    }
  }
  return unique;
}

function removeItemArray(_array, id) {
  return _array.filter(function(i) {
  	return i != id
  });
}
