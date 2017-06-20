'use strict';

import {defaults, systemEvents, system} from './defaults.js';
import {getProductList,getVariants} from './getProductList.js';
import {checkFavoritesProducts,addToFavorites,removeToFavorites} from './checkFavorites.js';
import {bindTrigger} from './bindTrigger.js';
import {getFavorites, setFavorites} from './getFavorites.js';
import initLocalforage from './initLocalforage.js';
import logger from './logger.js';
import eventMachine from './eventMachine.js';

class Favorites {
  constructor(options) {
    var self = this;
    this.options = $.extend(true, {}, defaults, options);
    this.system = system;

    this.productIds = [];
    this.variantIds = [];
    this.products = {};
    this.variants = {};

    this.logger = logger;
    this.getProductList = getProductList;
    this.getFavorites = getFavorites;
    this.setFavorites = setFavorites;
    this.bindTrigger = bindTrigger;
    this.eventMachine = eventMachine;
    this.checkFavoritesProducts = checkFavoritesProducts;
    this.addToFavorites = addToFavorites;
    this.removeToFavorites = removeToFavorites;

    // Localforage
    initLocalforage(function () {
      // получить id товаров из хранилища
      self.getFavorites().done(function (localData) {
        self.productIds = localData.products || [];
        self.variantIds = localData.variants || [];
        // биндинг кликов
        self.bindTrigger();
        // переключение классов
        self.checkFavoritesProducts();
        // получаем объекты товаров, присваиваем вариантам товар
        self.getProductList(localData.products).done(function (_products) {
          self.products = _products || {};
          self.variants = getVariants(_products, localData.variants) || {};
          self.eventMachine(systemEvents.filled, null);
          self.eventMachine(systemEvents.init, null);
          self.eventMachine(systemEvents.update, null);
        })
        .fail(function () {
          self.eventMachine(systemEvents.empty, null);
          self.eventMachine(systemEvents.init, null);
          self.eventMachine(systemEvents.update, null);
        });
      })
      .fail(function () {
        // биндинг кликов
        self.bindTrigger();
        // переключение классов
        self.checkFavoritesProducts();
        // избранное пусто
        self.eventMachine(systemEvents.empty, null);
        self.eventMachine(systemEvents.init, null);
        self.eventMachine(systemEvents.update, null);
      })
    })
  }
}

module.exports = Favorites;
