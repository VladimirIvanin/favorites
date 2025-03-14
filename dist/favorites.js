(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Favorites = factory());
})(this, function() {
  "use strict";/*!
 * favorites v1.0.0
 * https://github.com/VladimirIvanin/favorites/
 */

  const defaults = {
    counterTemplate: "(%c%)",
    // regexp %c%
    counterTemplateEmpty: null,
    // regexp %c%
    buttonNotAddedText: null,
    // текст не активной кнопки
    buttonAddedText: null,
    // текст активной кнопки
    productsListTemplate: function() {
    },
    // шаблон списка продуктов (принимает переменную products)
    variantsListTemplate: function() {
    },
    // шаблон списка вариантов (принимает переменную variants)
    debug: false,
    useApi: false,
    onFull: function() {
    },
    // В избранном есть товары
    onEmpty: function() {
    },
    // В избранное не добавлены товары
    onAdd: function() {
    },
    // Товар добавлен в избранное
    onRemove: function() {
    },
    // Товар удален из избранного
    onInit: function() {
    },
    // Инициализация
    onBefore: function() {
    },
    // Перед действием
    onUpdate: function() {
    },
    // Обновление
    replaceTitle: true,
    // заменять title кнопок
    titles: {
      added: "Добавлен в избранное",
      notAdded: "Добавить в избранное"
    },
    classes: {
      added: "is-added",
      notAdded: "not-added",
      empty: "is-empty",
      full: "is-full"
    }
  };
  const systemEvents = {
    full: "full:insales:favorites",
    // В избранном есть товары
    empty: "empty:insales:favorites",
    // В избранное не добавлены товары
    add: "add:insales:favorites",
    // Товар добавлен в избранное
    remove: "remove:insales:favorites",
    // Товар удален из избранного
    init: "init:insales:favorites",
    // Инициализация
    before: "before:insales:favorites",
    // Перед действием
    update: "update:insales:favorites"
    // Обновление
  };
  const systemSelectors = {
    add: "data-favorites-add",
    // добавить
    addParam: "favorites-add",
    // добавить
    addVariant: "data-favorites-variant-add",
    // добавить вариант
    addVariantParam: "favorites-variant-add",
    // добавить вариант
    addVariantProduct: "data-favorites-variant-product",
    // добавить вариант
    addVariantProductParam: "favorites-variant-product",
    // добавить вариант
    remove: "data-favorites-remove",
    // удалить
    removeParam: "favorites-remove",
    // удалить
    counter: "data-favorites-counter",
    // счетчик
    counterParam: "favorites-counter",
    // счетчик
    trigger: "data-favorites-trigger",
    // переключатель
    triggerParam: "favorites-trigger",
    // переключатель
    clearFavorites: "data-clear-favorites"
    // очистить избранное
  };
  function patchNumber(num) {
    const isString = typeof num === "string";
    const isNumber = typeof num === "number";
    if (!isNumber && !isString) {
      return 0;
    }
    if (isString) {
      num = isNaN(+num.replace(/,/g, ".")) ? 1 : +num.replace(/,/g, ".");
    }
    const isFloat = (n) => Number(n) === n && n % 1 !== 0;
    return Number(isFloat(num) ? num.toFixed(2) : num);
  }
  function bindTrigger() {
    const self2 = this;
    self2.logger("bindTrigger");
    const getAllElements = (selector) => document.querySelectorAll(selector);
    const handleFavoriteAction = (event, idParam, action) => {
      event.preventDefault();
      const target = event.target.closest(getDataAttrName(idParam.selector));
      if (!target)
        return;
      self2.eventMachine(systemEvents.before, target);
      const id = target.dataset[kebabToCamel(idParam.param)];
      if (!isValidId(id)) {
        console.warn("Не валидный id", id);
        return;
      }
      if (action === "toggle") {
        if (self2.productIds.includes(Number(id))) {
          self2.logger("removeToFavorites");
          self2.removeToFavorites(target, Number(id));
        } else {
          self2.logger("addToFavorites");
          self2.addToFavorites(target, Number(id));
        }
      } else if (action === "add") {
        self2.addToFavorites(target, Number(id));
      } else if (action === "remove") {
        self2.removeToFavorites(target, Number(id));
      }
    };
    document.addEventListener("click", (event) => {
      const triggerElement = event.target.closest(getDataAttrName(systemSelectors.trigger));
      if (triggerElement) {
        handleFavoriteAction(event, {
          selector: systemSelectors.trigger,
          param: systemSelectors.triggerParam
        }, "toggle");
      }
    });
    document.addEventListener("click", (event) => {
      const addElement = event.target.closest(getDataAttrName(systemSelectors.add));
      if (addElement) {
        handleFavoriteAction(event, {
          selector: systemSelectors.add,
          param: systemSelectors.addParam
        }, "add");
      }
    });
    document.addEventListener("click", (event) => {
      const removeElement = event.target.closest(getDataAttrName(systemSelectors.remove));
      if (removeElement) {
        handleFavoriteAction(event, {
          selector: systemSelectors.remove,
          param: systemSelectors.removeParam
        }, "remove");
      }
    });
    const updateProductsList = (event) => {
      self2.options.productsListTemplate(event.detail.products);
      self2.options.variantsListTemplate(event.detail.variants);
    };
    const updateCounter = (event) => {
      const productsSize = self2.productIds.length;
      let template = productsSize === 0 ? self2.options.counterTemplateEmpty || self2.options.counterTemplate : self2.options.counterTemplate;
      const _counterContent = template.replace("%c%", productsSize);
      const counters = getAllElements(getDataAttrName(systemSelectors.counter));
      counters.forEach((counter) => {
        counter.innerHTML = _counterContent;
        counter.dataset[kebabToCamel(systemSelectors.counterParam)] = productsSize;
        counter.setAttribute(systemSelectors.counter, productsSize);
        if (productsSize === 0) {
          counter.classList.add(self2.options.classes.empty);
          counter.classList.remove(self2.options.classes.full);
        } else {
          counter.classList.remove(self2.options.classes.empty);
          counter.classList.add(self2.options.classes.full);
        }
      });
      self2.checkFavoritesProducts();
    };
    document.addEventListener(systemEvents.update, updateProductsList);
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
  function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  }
  function removeToFavorites(target, id) {
    const self2 = this;
    const statusProduct = getStatusProduct(
      target,
      self2.productIds,
      id,
      self2.options.classes.added,
      self2.options.classes.notAdded
    );
    if (!statusProduct.isActive && statusProduct.notAdded) {
      return;
    }
    self2.removeFavorite(id).then((response) => {
      if (response) {
        self2.updateProducts(response.products || []);
      } else {
        self2.updateProducts([]);
      }
    }).catch((error) => {
      console.log(error);
      self2.updateProducts([]);
    }).finally(() => {
      updateProductStatus(target, self2, id);
      handleProductListUpdate(self2, target, systemEvents.remove);
    });
  }
  function addToFavorites(target, id) {
    const self2 = this;
    const statusProduct = getStatusProduct(
      target,
      self2.productIds,
      id,
      self2.options.classes.added,
      self2.options.classes.notAdded
    );
    if (id === "") {
      return;
    }
    if (statusProduct.isActive && statusProduct.isAdded) {
      return;
    }
    self2.setFavorites(id).then((response) => {
      if (response) {
        self2.updateProducts(response.products || []);
      } else {
        self2.updateProducts([]);
      }
    }).catch((error) => {
      console.log(error);
      self2.updateProducts([]);
    }).finally(() => {
      updateProductStatus(target, self2, id);
      handleProductListUpdate(self2, target, systemEvents.add);
    });
  }
  function handleProductListUpdate(self2, target, eventType) {
    if (self2.products.length === 0) {
      self2.eventMachine(eventType, target);
      if (Object.keys(self2.products).length === 0) {
        self2.eventMachine(systemEvents.empty, null);
      }
      self2.eventMachine(systemEvents.update, target);
    } else {
      updateProductsAndTriggerEvents(self2, target, eventType);
    }
  }
  function updateProductsAndTriggerEvents(self2, target, eventType) {
    self2.eventMachine(eventType, target);
    if (Object.keys(self2.products).length === 0) {
      self2.eventMachine(systemEvents.empty, null);
    }
    self2.eventMachine(systemEvents.update, target);
  }
  function checkFavoritesProducts() {
    const self2 = this;
    document.querySelectorAll(`[${systemSelectors.trigger}]`).forEach((element) => {
      updateProductStatus(element, self2, element.dataset[kebabToCamel(systemSelectors.triggerParam)]);
    });
    document.querySelectorAll(`[${systemSelectors.add}]`).forEach((element) => {
      updateProductStatus(element, self2, element.dataset[kebabToCamel(systemSelectors.addParam)]);
    });
    document.querySelectorAll(`[${systemSelectors.remove}]`).forEach((element) => {
      updateProductStatus(element, self2, element.dataset[kebabToCamel(systemSelectors.removeParam)]);
    });
  }
  function updateProductStatus(target, self2, id) {
    const statusProduct = getStatusProduct(
      target,
      self2.productIds,
      id,
      self2.options.classes.added,
      self2.options.classes.notAdded
    );
    if (statusProduct.isActive) {
      target.classList.remove(self2.options.classes.notAdded);
      if (self2.options.replaceTitle) {
        target.setAttribute("title", self2.options.titles.added);
      }
      if (!statusProduct.isAdded) {
        target.classList.add(self2.options.classes.added);
      }
      if (self2.options.buttonNotAddedText) {
        renderButtonText(self2, target, statusProduct.isActive);
      }
    }
    if (!statusProduct.isActive) {
      target.classList.remove(self2.options.classes.added);
      if (self2.options.replaceTitle) {
        target.setAttribute("title", self2.options.titles.notAdded);
      }
      if (!statusProduct.notAdded) {
        target.classList.add(self2.options.classes.notAdded);
      }
      if (self2.options.buttonNotAddedText) {
        renderButtonText(self2, target, statusProduct.isActive);
      }
    }
  }
  function renderButtonText(self2, target, isActive) {
    let text = self2.options.buttonNotAddedText || "";
    if (isActive) {
      text = self2.options.buttonAddedText || self2.options.buttonNotAddedText;
    }
    target.innerHTML = text;
  }
  function getStatusProduct(target, productIds, id, addedClass, notAddedClass) {
    const status = {
      isActive: productIds.includes(Number(id)),
      isAdded: target.classList.contains(addedClass),
      notAdded: target.classList.contains(notAddedClass)
    };
    return status;
  }
  function getLang() {
    return new URLSearchParams(window.location.search).get("lang") || "";
  }
  async function makeRequest(url, method, data = null) {
    const self2 = this;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      self2.logger(`Запрос ${method} к ${url} выполнен успешно`, result);
      return result;
    } catch (error) {
      self2.logger(`Ошибка при выполнении ${method} запроса к ${url}`, error);
      throw error;
    }
  }
  async function getFavorites() {
    const self2 = this;
    try {
      const lang = getLang();
      const requestUrl = `${window.location.origin}/front_api/favorites.json`;
      let path = new URL(requestUrl);
      if (lang) {
        path.searchParams.set("lang", lang);
      }
      return await makeRequest.call(self2, path.toString(), "GET");
    } catch (error) {
      self2.logger("Не удалось получить избранное с сервера", error);
      return {};
    }
  }
  async function setFavorites(productId) {
    const lang = getLang();
    const fields = {
      lang,
      product: {
        id: parseInt(productId)
      }
    };
    try {
      return await makeRequest.call(this, "/front_api/favorites.json", "POST", fields);
    } catch (error) {
      this.logger("Не удалось добавить товар в избранное на сервере", error);
      throw error;
    }
  }
  async function removeFavorite(productId) {
    const lang = getLang();
    const fields = { lang };
    try {
      return await makeRequest.call(this, `/front_api/favorites/${parseInt(productId)}.json`, "DELETE", fields);
    } catch (error) {
      this.logger("Не удалось удалить товар из избранного на сервере", error);
      throw error;
    }
  }
  function logger(name, variable) {
    const self2 = this;
    if (self2.options.debug) {
      console.info("==favorites==");
      console.log(name);
      if (variable) {
        console.log(variable);
      }
      console.info("=============");
    }
  }
  function eventMachine(name, target) {
    const self2 = this;
    const _products = self2.products || {};
    const _variants = self2.variants || {};
    Object.keys(_products).forEach((index) => {
      if (!self2.productIds.includes(_products[index].id)) {
        delete _products[index];
      }
    });
    Object.keys(_variants).forEach((index) => {
      if (!self2.productIds.includes(_variants[index].product_id)) {
        delete _variants[index];
      }
    });
    const _pub = {
      products: _products,
      target: target || null,
      favorites: {
        size: _products.length,
        totalPrice: getTotalPrice(_products)
      }
    };
    if (typeof EventBus === "object" && EventBus.publish) {
      EventBus.publish(name, _pub);
    }
    const event = new CustomEvent(name, {
      detail: { insalesFavorites: _pub },
      bubbles: true
    });
    document.dispatchEvent(event);
    const methodName = getMethodName(name);
    if (self2.options[methodName] && typeof self2.options[methodName] === "function") {
      self2.options[methodName](_pub);
    }
  }
  function getMethodName(name) {
    let _methodName = "";
    Object.entries(systemEvents).forEach(([index, el]) => {
      if (el === name) {
        _methodName = "on" + capitalize(index);
      }
    });
    return _methodName;
  }
  const capitalize = (_string) => {
    return _string.charAt(0).toUpperCase() + _string.slice(1);
  };
  function getTotalPrice(products) {
    return products.reduce((total, product) => {
      return total + patchNumber(product.price);
    }, 0);
  }
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
      this.getFavorites().then((response) => {
        if (response) {
          this.updateProducts(response.products || []);
          this.logger("productIds loaded", this.productIds);
          this.bindTrigger();
          this.checkFavoritesProducts();
          this.triggerEvents(this.products.length > 0);
        } else {
          this.updateProducts([]);
          this.bindTrigger();
          this.checkFavoritesProducts();
          this.triggerEmptyEvents();
        }
      }).catch((error) => {
        console.log(error);
        this.updateProducts([]);
        this.triggerEmptyEvents();
      });
    }
    updateProducts(products) {
      this.products = products || [];
      this.productIds = this.products.map((product) => product.id);
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
      this.logger("getFavorites empty");
      this.triggerEvents(false);
    }
  }
  return Favorites;
});
