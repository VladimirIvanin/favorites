'use strict';

import { defaults, systemEvents } from './defaults.js';
import { checkFavoritesProducts, addToFavorites, removeToFavorites } from './checkFavorites.js';
import { bindTrigger } from './bindTrigger.js';
import { getFavorites, setFavorites, removeFavorite } from './api.js';
import logger from './logger.js';
import eventMachine from './eventMachine.js';

class Favorites {
  constructor(options) {
    this.options = { ...defaults, ...options };
    
    this.productIds = [];
    this.products = [];
    
    this.logger = logger;
    this.getFavorites = getFavorites;
    this.setFavorites = setFavorites;
    this.removeFavorite = removeFavorite;
    this.bindTrigger = bindTrigger;
    this.eventMachine = eventMachine;
    this.checkFavoritesProducts = checkFavoritesProducts;
    this.addToFavorites = addToFavorites;
    this.removeToFavorites = removeToFavorites;
    
    this.init();
  }
  
  init() {
    try {
      this.loadFavorites();
    } catch (e) {
      console.log(e);
    }
  }
  
  loadFavorites() {
    this.getFavorites()
      .then(response => {
        if (response) {
          this.updateProducts(response.products || [])
          
          this.logger('productIds loaded', this.productIds);
          
          // Bind click events after loading favorites
          this.bindTrigger();
          // Toggle classes after loading favorites
          this.checkFavoritesProducts();
          
          this.triggerEvents(this.products.length > 0);
        } else {
          this.updateProducts([])
          // Bind click events after loading favorites
          this.bindTrigger();
          // Toggle classes after loading favorites
          this.checkFavoritesProducts();
          this.triggerEmptyEvents();
        }
      })
      .catch(error => {
        console.log(error);
        this.updateProducts([])
        this.triggerEmptyEvents();
      });
  }

  updateProducts(products) {
    this.products = products || [];
    this.productIds = this.products.map(product => product.id);
  }
  
  triggerEvents(hasProducts) {
    if (hasProducts) {
      this.eventMachine(systemEvents.full, null);
    } else {
      this.eventMachine(systemEvents.empty, null);
    }
    
    this.eventMachine(systemEvents.init, null);
    this.eventMachine(systemEvents.update, null);
  }
  
  triggerEmptyEvents() {
    this.logger('getFavorites empty');
    this.triggerEvents(false);
  }
}

export default Favorites;