'use strict';
import {systemEvents, systemSelectors} from './defaults.js';
import {patchNumber} from './patchNumber.js';

export function bindTrigger() {
  const self = this;
  self.logger('bindTrigger');

  // Helper functions
  const getElement = (selector) => document.querySelector(selector);
  const getAllElements = (selector) => document.querySelectorAll(selector);
  
  const handleFavoriteAction = (event, idParam, action) => {
    event.preventDefault();
    const target = event.target.closest(getDataAttrName(idParam.selector));
    if (!target) return;
    
    self.eventMachine(systemEvents.before, target);
    const id = target.dataset[kebabToCamel(idParam.param)];

    if (!isValidId(id)) {
      console.warn('Не валидный id', id);
      return;
    }
    
    if (action === 'toggle') {
      if (self.productIds.includes(Number(id))) {
        self.logger('removeToFavorites');
        self.removeToFavorites(target, Number(id));
      } else {
        self.logger('addToFavorites');
        self.addToFavorites(target, Number(id));
      }
    } else if (action === 'add') {
      self.addToFavorites(target, Number(id));
    } else if (action === 'remove') {
      self.removeToFavorites(target, Number(id));
    }
  };

  // Переключатель
  document.addEventListener('click', (event) => {
    const triggerElement = event.target.closest(getDataAttrName(systemSelectors.trigger));
    if (triggerElement) {
      handleFavoriteAction(event, {
        selector: systemSelectors.trigger,
        param: systemSelectors.triggerParam
      }, 'toggle');
    }
  });

  // Добавить в избранное
  document.addEventListener('click', (event) => {
    const addElement = event.target.closest(getDataAttrName(systemSelectors.add));
    if (addElement) {
      handleFavoriteAction(event, {
        selector: systemSelectors.add,
        param: systemSelectors.addParam
      }, 'add');
    }
  });

  // Удалить из избранного
  document.addEventListener('click', (event) => {
    const removeElement = event.target.closest(getDataAttrName(systemSelectors.remove));
    if (removeElement) {
      handleFavoriteAction(event, {
        selector: systemSelectors.remove,
        param: systemSelectors.removeParam
      }, 'remove');
    }
  });

  const updateCounter = (event) => {
    const productsSize = self.productIds.length;
    let template = productsSize === 0 
      ? (self.options.counterTemplateEmpty || self.options.counterTemplate)
      : self.options.counterTemplate;
    
    const _counterContent = template.replace('%c%', productsSize);
    const counters = getAllElements(getDataAttrName(systemSelectors.counter));
    
    counters.forEach(counter => {
      counter.innerHTML = _counterContent;
      counter.dataset[kebabToCamel(systemSelectors.counterParam)] = productsSize;
      counter.setAttribute(systemSelectors.counter, productsSize);

      if (productsSize === 0) {
        counter.classList.add(self.options.classes.empty);
        counter.classList.remove(self.options.classes.full);
      } else {
        counter.classList.remove(self.options.classes.empty);
        counter.classList.add(self.options.classes.full);
      }
    });
    
    // переключить классы
    self.checkFavoritesProducts();
  };

  document.addEventListener(systemEvents.update, updateCounter);
}

function getDataAttrName(name, value) {
  const resultName = value ? `${name}="${value}"` : name;
  return `[${resultName}]`;
}

function isValidId(id) {
  const patchId = patchNumber(id);
  return patchId > 1;
}

export function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}