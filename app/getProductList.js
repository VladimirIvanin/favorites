'use strict';
import {system} from './defaults.js';
import convertProperties from './convertProperties.js';

/**
 * Получить массив товаров из системы
 * productList - [1234,123456] массив из id;
 */
export function getProductList (productList) {
  var self = this;
  return $.when(_getProducts())

  function _getProducts() {
    var dfd = jQuery.Deferred();
    var isArray = (Object.prototype.toString.call( productList ) == '[object Array]');
    var resultList = {};

    if (!isArray) {
      self.logger('Список id, не является массивом', productList);
      dfd.reject(resultList);
    }

    if (isArray && productList.length == 0) {
      self.logger('Список id пуст', productList);
      dfd.reject(resultList);
    }

    if (isArray && productList.length > 0) {

      // товары с помощью common js v2
      if (typeof Products == 'object' && Products.getList) {
        Products.getList(productList)
        .done(function (_productsObject) {
          var productsObject = convertProductList(_productsObject);
          var sizeProductsObject = Object.keys(productsObject).length;
          if (sizeProductsObject > 0) {
            self.logger('Товары из апи common js: ', productsObject);
            $.each(productsObject, function(index, _product) {
              convertProperties(_product);
            });
            dfd.resolve( productsObject );
          }else{
            dfd.reject( {} );
          }
        })
        .fail(function (onFail) {
          dfd.reject( {} );
        });
      }else{
        // получаем товары сохраненные в локальном хранилище
        getLocalProduct(self, system.keyProducts).done(function (_productsList) {
          var missingList = [];
          $.each(productList, function(index, el) {
            if (!_productsList[el]) {
              missingList.push( el )
            }
          });

          // если не достает каких то товаров, получить их из апи
          if (missingList.length > 0) {
            getApiProduct(self, missingList).done(function (_productsObject) {
              self.logger('Товары из стандартного апи: ', _productsObject);
              $.each(_productsObject, function(index, _product) {
                convertProperties(_product);
              });
              dfd.resolve( $.extend(true, {}, _productsList, _productsObject) );
            })
            .fail(function (onFail) {
              dfd.reject( {} );
            });
          }else{
            $.each(_productsList, function(index, _product) {
              convertProperties(_product);
            });
            dfd.resolve( _productsList );
          }
        }).fail(function () {
          // если в хранилище нет товаров, берем из стандартного апи
          getApiProduct(self, productList).done(function (_productsObject) {
            var sizeProductsObject = Object.keys(_productsObject).length;
            if (sizeProductsObject > 0) {
              setLocalProduct(self, system.keyProducts, _productsObject)
              self.logger('Товары из стандартного апи: ', _productsObject);
              $.each(_productsObject, function(index, _product) {
                convertProperties(_product);
              });
              dfd.resolve( convertProductList(_productsObject) );
            }else{
              dfd.reject( {} );
            }
          })
          .fail(function (onFail) {
            dfd.reject( {} );
          });
        });
      }

    }

    return dfd.promise();
  }
}

// Сохранить товары в localforage
const setLocalProduct = function (self, keyProducts, products) {
  localforage.setItem(keyProducts, products, function(err) {
    if (err) {
      self.logger('Не удалось сохранить товары в localforage');
    }else{
      self.logger('Данные сохранены в localforage');
    }
  });
}

// Получить данные из хранилища
// localData - объект
const getLocalProduct = function (self, keyProducts) {
  return $.when(_getLocalData())

  function _getLocalData() {
    var dfd = jQuery.Deferred();

    localforage.getItem(keyProducts, function(err, localData) {
      if (localData) {
        self.logger('Данные получены из хранилища', localData);

        dfd.resolve( convertProductList(localData) );
      }else{
        self.logger('Хранилище пусто');

        dfd.reject('Хранилище пусто');
      }
    });

    return dfd.promise();
  }
};

// получить товары из апи
// _productsObject - объект
const getApiProduct = function (self, _products) {

  return $.when(_getLocalData(_products))

  function _getLocalData(_products) {
    var dfd = jQuery.Deferred();
    var _mainIds = _products.join(',');
    if (_products.length > 0 && _mainIds != '') {
    $.post('/products_by_id/'+ _products.join(',') +'.json')
      .done(function (_productsObject) {
        if (_productsObject.status == 'ok') {
          self.logger('Товары из апи: ', _productsObject.products);
          dfd.resolve( convertProductList(_productsObject.products) );
        }else{
          dfd.resolve( {} );
        }
      })
      .fail(function (onFail) {
        dfd.resolve( {} );
      });
    }else{
      dfd.resolve( {} );
    }

    return dfd.promise();
  }
};

export function getVariants (productList, variantIds) {
  var result = {};
  $.each(variantIds, function(index, variantId) {
    $.each(productList, function(index, product) {
      $.each(product.variants, function(index, variant) {
        if (variantId == variant.id) {
          result[variantId] = variant;
          result[variantId].product = product;
        }
      });
    });
  });

  return result;
}

export function convertProductList (productList) {
  var result = {};
  $.each(productList, function(index, el) {
    if (el && el.id) {
      result[el.id] = el;
    }
  });

  return result;
}
