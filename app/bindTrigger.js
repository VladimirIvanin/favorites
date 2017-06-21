'use strict';
import {defaults, systemEvents, system, systemSelectors} from './defaults.js';
import {getStatusProduct} from './checkFavorites.js';

export function bindTrigger() {
  var self = this;

  // Переключатель
  $(document).on('click', getDataAttrName(systemSelectors.trigger), function(event) {
    event.preventDefault();
    self.eventMachine(systemEvents.before, $(this));
    var id = $(this).data( systemSelectors.triggerParam );

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
    var id = $(this).data( systemSelectors.addParam)

    self.addToFavorites($(this), id);
  });

  // Удалить из избранного
  $(document).on('click', getDataAttrName(systemSelectors.remove), function(event) {
    event.preventDefault();
    self.eventMachine(systemEvents.before, $(this));
    var id = $(this).data( systemSelectors.removeParam)

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

    if (self.productIds.length == 0) {
      template = self.options.counterTemplateEmpty || self.options.counterTemplate;
    }
    var _counterContent = template.replace( '%c%', self.productIds.length )
    var $counter = $(getDataAttrName( systemSelectors.counter ));
    $counter.html( _counterContent );

    if (self.productIds.length == 0) {
      $counter.addClass(self.options.classes.empty).removeClass(self.options.classes.full)
    }else{
      $counter.removeClass(self.options.classes.empty).addClass(self.options.classes.full)
    }
  });

}

function getDataAttrName(name, value) {
  const resultName = (value) ? name + '="'+value+'"' : name;

  return '[' + resultName + ']';
}
