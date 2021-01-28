import {system} from './defaults.js';
import convertProperties from './convertProperties.js';

/**
 * Получить массив товаров из системы
 * productList - [1234,123456] массив из id;
 */
export function getProductList (productList) {
  var self = this;
  self.logger('getProductList start');
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
        // getList 2 раза пока не исправят баг
        Products.getList(productList)
        .done(function () {
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
        })
      .fail(function (onFail) {
        dfd.reject( {} );
      });
      }else{
        getApiProduct(self, productList).done(function (_productsObject) {
          self.logger('Товары из стандартного апи: ', _productsObject);
          $.each(_productsObject, function(index, _product) {
            convertProperties(_product);
          });

          dfd.resolve( _productsObject );
        })
        .fail(function (onFail) {
          dfd.reject( {} );
        });
      }

    }else{
      setTimeout(function () {
        self.logger('!isArray');
        dfd.reject( {} );
      }, 100)
    }

    return dfd.promise();
  }
}
// получить товары из апи
// _productsObject - объект
var getApiProduct = function (self, _products) {

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
