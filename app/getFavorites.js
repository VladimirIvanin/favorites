'use strict;'
import {system} from './defaults.js';

export function getFavorites() {
  var self = this;
  return $.when(function () {
    var dfd = jQuery.Deferred();

    self.store.getItem(system.keyFavorites, function(err, localData) {
      if (localData) {
        self.logger('Данные получены из хранилища', localData);
        dfd.resolve( localData );
      }else{
        self.logger('Хранилище пусто', err);
        dfd.resolve( {} );
      }
    });

    return dfd.promise();
  }())
}

// Сохранить товары в self.store
export function setFavorites (localData) {
  var self = this;
  self.store.setItem(system.keyFavorites, localData, function(err) {
    if (err) {
      self.logger('Не удалось сохранить избранное в self.store');
    }else{
      self.logger('Данные сохранены в self.store');
    }
  });
}
