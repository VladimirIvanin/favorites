'use strict;'
import {system} from './defaults.js';

export function getFavorites() {
  var self = this;
  return $.when(function () {
    var dfd = jQuery.Deferred();

    localforage.getItem(system.keyFavorites, function(err, localData) {
      if (localData) {
        self.logger('Данные получены из хранилища', localData);

        dfd.resolve( localData );
      }else{
        self.logger('Хранилище пусто');

        dfd.reject({});
      }
    });

    return dfd.promise();
  }())
}

// Сохранить товары в localforage
export function setFavorites (localData) {
  var self = this;
  localforage.setItem(system.keyFavorites, localData, function(err) {
    if (err) {
      self.logger('Не удалось сохранить избранное в localforage');
    }else{
      self.logger('Данные сохранены в localforage');
    }
  });
}
