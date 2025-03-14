import {systemEvents, systemSelectors} from './defaults.js';
import { kebabToCamel } from './bindTrigger.js';

export function removeToFavorites(target, id) {
  const self = this;
  const statusProduct = getStatusProduct(
    target, self.productIds,
    id,
    self.options.classes.added,
    self.options.classes.notAdded
  );

  if (!statusProduct.isActive && statusProduct.notAdded) {
    return;
  }

  self.removeFavorite(id)
    .then(response => {
        if (response) {
          self.updateProducts(response.products || [])
        } else {
          self.updateProducts([])
        }
      })
      .catch(error => {
        console.log(error);
        self.updateProducts([])
      })
      .finally(() => {
         updateProductStatus(target, self, id);
         handleProductListUpdate(self, target, systemEvents.remove);
      });
}

export function addToFavorites(target, id) {
  const self = this;
  const statusProduct = getStatusProduct(
    target, self.productIds,
    id,
    self.options.classes.added,
    self.options.classes.notAdded
  );

  if (id === '') {
    return;
  }

  if (statusProduct.isActive && statusProduct.isAdded) {
    return;
  }


  self.setFavorites(id)
    .then(response => {
      if (response) {
        self.updateProducts(response.products || [])
      } else {
        self.updateProducts([])
      }
    })
    .catch(error => {
      console.log(error);
      self.updateProducts([])
    })
    .finally(() => {
        updateProductStatus(target, self, id);
        handleProductListUpdate(self, target, systemEvents.add);
    });
}

function handleProductListUpdate(self, target, eventType) {
  if (self.products.length === 0) {
    self.eventMachine(eventType, target);
    if (Object.keys(self.products).length === 0) {
      self.eventMachine(systemEvents.empty, null);
    }
    self.eventMachine(systemEvents.update, target);
  } else {
    updateProductsAndTriggerEvents(self, target, eventType);
  }
}

function updateProductsAndTriggerEvents(self, target, eventType) { 
  self.eventMachine(eventType, target);
  if (Object.keys(self.products).length === 0) {
    self.eventMachine(systemEvents.empty, null);
  }
  self.eventMachine(systemEvents.update, target);
}

// переключить статусы
export function checkFavoritesProducts() {
  const self = this;
  
  document.querySelectorAll(`[${systemSelectors.trigger}]`).forEach(element => {
    updateProductStatus(element, self, element.dataset[kebabToCamel(systemSelectors.triggerParam)]);
  });
  
  document.querySelectorAll(`[${systemSelectors.add}]`).forEach(element => {
    updateProductStatus(element, self, element.dataset[kebabToCamel(systemSelectors.addParam)]);
  });
  
  document.querySelectorAll(`[${systemSelectors.remove}]`).forEach(element => {
    updateProductStatus(element, self, element.dataset[kebabToCamel(systemSelectors.removeParam)]);
  });
}

// переключить статус кнопки продукта
function updateProductStatus(target, self, id) {
  const statusProduct = getStatusProduct(
    target, self.productIds,
    id,
    self.options.classes.added,
    self.options.classes.notAdded
  );

  if (statusProduct.isActive) {
    target.classList.remove(self.options.classes.notAdded);
    if (self.options.replaceTitle) {
      target.setAttribute('title', self.options.titles.added);
    }
    if (!statusProduct.isAdded) {
      target.classList.add(self.options.classes.added);
    }

    if (self.options.buttonNotAddedText) {
      renderButtonText(self, target, statusProduct.isActive);
    }
  }

  if (!statusProduct.isActive) {
    target.classList.remove(self.options.classes.added);
    if (self.options.replaceTitle) {
      target.setAttribute('title', self.options.titles.notAdded);
    }
    if (!statusProduct.notAdded) {
      target.classList.add(self.options.classes.notAdded);
    }
    if (self.options.buttonNotAddedText) {
      renderButtonText(self, target, statusProduct.isActive);
    }
  }
}

function renderButtonText(self, target, isActive) {
  let text = self.options.buttonNotAddedText || '';
  if (isActive) {
    text = self.options.buttonAddedText || self.options.buttonNotAddedText;
  }
  target.innerHTML = text;
}

export function getStatusProduct(target, productIds, id, addedClass, notAddedClass) {
  const status = {
    isActive: productIds.includes(Number(id)),
    isAdded: target.classList.contains(addedClass),
    notAdded: target.classList.contains(notAddedClass),
  };
  return status;
}