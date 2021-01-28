'use strict';
import {systemEvents, systemSelectors} from './defaults.js';
import {patchNumber} from './patchNumber.js';

export function bindTrigger() {
  var self = this;
  self.logger('bindTrigger');

  // Переключатель
  $(document).on('click', getDataAttrName(systemSelectors.trigger), function(event) {
    event.preventDefault();
    self.eventMachine(systemEvents.before, $(this));
    var id = $(this).data( systemSelectors.triggerParam );

    if (!testValidId(id)) {
      console.warn('Не валидный id', id);
      return;
    }
    if (self.productIds.indexOf(id) > -1) {
      self.logger('removeToFavorites');
      self.removeToFavorites($(this), id);
    }else{
      self.logger('addToFavorites');
      self.addToFavorites($(this), id);
    }
  });

  // Добавить в избранное
  $(document).on('click', getDataAttrName(systemSelectors.add), function(event) {
    event.preventDefault();
    self.eventMachine(systemEvents.before, $(this));
    var id = $(this).data( systemSelectors.addParam);

    if (!testValidId(id)) {
      console.warn('Не валидный id', id);
      return;
    };

    self.addToFavorites($(this), id);
  });

  // Удалить из избранного
  $(document).on('click', getDataAttrName(systemSelectors.remove), function(event) {
    event.preventDefault();
    self.eventMachine(systemEvents.before, $(this));
    var id = $(this).data( systemSelectors.removeParam);

    if (!testValidId(id)) {
      console.warn('Не валидный id', id);
      return;
    }

    self.removeToFavorites($(this), id);
  });

  $(document).on(systemEvents.update, function(event) {
    // шаблон списка продуктов (принимает переменную products)
    self.options.productsListTemplate(event.insalesFavorites.products);
    // шаблон списка вариантов (принимает переменную variants)
    self.options.variantsListTemplate(event.insalesFavorites.variants);
  });


  $(document).on(systemEvents.update, function(event) {
    var template = self.options.counterTemplate
    var productsSize = self.productIds.length;
    if (productsSize == 0) {
      template = self.options.counterTemplateEmpty || self.options.counterTemplate;
    }
    var _counterContent = template.replace( '%c%', productsSize )
    var $counter = $(getDataAttrName( systemSelectors.counter ));
    $counter.html( _counterContent ).data(systemSelectors.counterParam, productsSize).attr(systemSelectors.counter, productsSize);

    if (productsSize == 0) {
      $counter.addClass(self.options.classes.empty).removeClass(self.options.classes.full)
    }else{
      $counter.removeClass(self.options.classes.empty).addClass(self.options.classes.full)
    }
    // переключить классы
    self.checkFavoritesProducts()
  });

}

function getDataAttrName(name, value) {
  let resultName = (value) ? name + '="'+value+'"' : name;

  return '[' + resultName + ']';
}

function testValidId(id) {
  var patchId = patchNumber(id);
  return patchId > 1;
}
