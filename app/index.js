'use strict';

import {defaults, systemEvents, system} from './defaults.js';
import {getProductList,getVariants} from './getProductList.js';
import {checkFavoritesProducts,addToFavorites,removeToFavorites} from './checkFavorites.js';
import {bindTrigger} from './bindTrigger.js';
import {getFavorites, setFavorites} from './getFavorites.js';
import initLocalforage from './initlocalforage.js';
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
    this.store = {};

    // self.store
    initLocalforage(function () {
      self.store = localforage.createInstance({
        name: system.keyStore
      });

      self.store.ready().then(function() {
        self.logger('store.ready');
        self.getFavorites().done(function (localData) {
          self.logger('getFavorites done');
          self.productIds = localData.products || [];
          self.variantIds = localData.variants || [];
          try {
            // биндинг кликов
            self.bindTrigger();
            // переключение классов
            self.checkFavoritesProducts();
          } catch (e) {
            console.log(e)
          }

          self.logger('productIds done', self.productIds);

          if (self.productIds.length == 0) {
            self.logger('getFavorites empty');
            // избранное пусто
            self.eventMachine(systemEvents.empty, null);
            self.eventMachine(systemEvents.init, null);
            self.eventMachine(systemEvents.update, null);
          }else{
            // получаем объекты товаров, присваиваем вариантам товар
            self.getProductList(localData.products).done(function (_products) {
              self.products = _products || {};
              self.variants = getVariants(_products, localData.variants) || {};
              self.logger('getProductList done', _products);
              if (Object.keys(self.products).length == 0) {
                self.eventMachine(systemEvents.empty, null);
                self.eventMachine(systemEvents.init, null);
                self.eventMachine(systemEvents.update, null);
              }else{
                self.eventMachine(systemEvents.full, null);
                self.eventMachine(systemEvents.init, null);
                self.eventMachine(systemEvents.update, null);
              }
            })
            .fail(function () {
              self.logger('getProductList fail');
              self.eventMachine(systemEvents.empty, null);
              self.eventMachine(systemEvents.init, null);
              self.eventMachine(systemEvents.update, null);
            });
          }
        })
        .fail(function (e) {
          console.log(e);
        })
      }).catch(function (e) {
          console.log(e);
      });
    })
  }
}

module.exports = Favorites;
