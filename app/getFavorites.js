'use strict;'
import {system} from './defaults.js';

export function getFavorites() {
  var self = this;
  return $.when(_getFavorites())

  function _getFavorites () {
    var dfd = jQuery.Deferred();

    self.store.getItem(system.keyFavorites).then(function(localData) {
        self.logger('Данные получены из хранилища', localData);
        dfd.resolve( localData );
    }).catch(function(err) {
        self.logger('Хранилище пусто');
        dfd.reject({});
    });

    return dfd.promise();
  }
}

// Сохранить товары в self.store
export function setFavorites (localData) {
  var self = this;
  if (!localData) {
    return;
  }
  self.store.setItem(system.keyFavorites, localData, function(err) {
    if (err) {
      self.logger('Не удалось сохранить избранное в self.store');
    }else{
      self.logger('Данные сохранены в self.store');
    }
  });
}
