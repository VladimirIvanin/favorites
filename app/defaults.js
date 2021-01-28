export const defaults = {
  counterTemplate: '(%c%)', // regexp %c%
  counterTemplateEmpty: null, // regexp %c%
  buttonNotAddedText: null, // текст не активной кнопки
  buttonAddedText: null, // текст активной кнопки
  productsListTemplate: function(){}, // шаблон списка продуктов (принимает переменную products)
  variantsListTemplate: function(){}, // шаблон списка вариантов (принимает переменную variants)
  debug: false,
  useApi: false,
  onFull: function(){}, // В избранном есть товары
  onEmpty: function(){}, // В избранное не добавлены товары
  onAdd: function(){}, // Товар добавлен в избранное
  onRemove: function(){}, // Товар удален из избранного
  onInit: function(){}, // Инициализация
  onBefore: function(){}, // Перед действием
  onUpdate: function(){}, // Обновление
  replaceTitle: true, // заменять title кнопок
  titles: {
    added: 'Добавлен в избранное',
    notAdded: 'Добавить в избранное'
  },
  classes: {
    added: 'is-added',
    notAdded: 'not-added',
    empty: 'is-empty',
    full: 'is-full'
  }
};

export const system = {
  keyProducts: 'favorites_products', // ключ от локальных товаров
  keyFavorites: 'favorites_data', // ключ от объекта плагина
  keyStore: 'favorites_store_insales', // ключ от объекта плагина
}

export const systemEvents = {
  full: 'full:insales:favorites', // В избранном есть товары
  empty: 'empty:insales:favorites', // В избранное не добавлены товары
  add: 'add:insales:favorites', // Товар добавлен в избранное
  remove: 'remove:insales:favorites', // Товар удален из избранного
  init: 'init:insales:favorites', // Инициализация
  before: 'before:insales:favorites', // Перед действием
  update: 'update:insales:favorites', // Обновление
}

export const systemSelectors = {
  add: 'data-favorites-add', // добавить
  addParam: 'favorites-add', // добавить
  addVariant: 'data-favorites-variant-add', // добавить вариант
  addVariantParam: 'favorites-variant-add', // добавить вариант
  addVariantProduct: 'data-favorites-variant-product', // добавить вариант
  addVariantProductParam: 'favorites-variant-product', // добавить вариант
  remove: 'data-favorites-remove', // удалить
  removeParam: 'favorites-remove', // удалить
  counter: 'data-favorites-counter', // счетчик
  counterParam: 'favorites-counter', // счетчик
  trigger: 'data-favorites-trigger', // переключатель
  triggerParam: 'favorites-trigger', // переключатель
  clearFavorites: 'data-clear-favorites' // очистить избранное
}
