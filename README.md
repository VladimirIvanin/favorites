# Избранное для платформы InSales

## CDN

```
  <script src="https://cdn.jsdelivr.net/gh/VladimirIvanin/favorites@0.5.0/dist/favorites.js"></script>
```


## Простой пример

> Важно! Кнопку добавления в избранное стоит размещать внутри формы продукта.

```js
var Favorite = new Favorites({
  onUpdate: function (data) {
    console.log(data.products);
  }
});
```

```html

<p>
  Счетчик избранного: <span data-favorites-counter></span>
</p>

<form action="{{ cart_url }}" method="post" data-product-id="{{ product.id }}">
  {% if product.show_variants? %}
    <select name="variant_id" data-product-variants>
      {% for variant in product.variants %}
        <option value="{{ variant.id }}">{{ variant.title | escape }}</option>
      {% endfor %}
    </select>
  {% else %}
    <input type="hidden" name="variant_id" value="{{product.variants.first.id}}" >
  {% endif %}

  <div data-quantity>
    <input type="text" name="quantity" value="1" />
    <span data-quantity-change="-1">-</span>
    <span data-quantity-change="1">+</span>
  </div>

  <button type="button" data-favorites-trigger="{{ product.id }}">
    Добавить в избранное
  </button>

  <button type="submit" data-item-add>
    Добавить в корзину
  </button>
</form>
```


## Зависимости

- jQuery 1.9+
- localForage (для common.js v2 не требуется)

## События / callbacks

Модуль поддерживает EventBus (для common.js v2), jQuery events, а также обратные вызовы переданные в настройках.

| Событие                  | Назначение                      | Callback |
|--------------------------|---------------------------------|----------|
| init:insales:favorites   | Инициализация                   | onInit   |
| before:insales:favorites | Перед добавлением/удалением     | onBefore |
| add:insales:favorites    | Товар добавлен в избранное      | onAdd    |
| remove:insales:favorites | Товар удален из избранного      | onRemove |
| update:insales:favorites | Обновление                      | onUpdate |
| empty:insales:favorites  | В избранном нет товаров | onEmpty  |
| full:insales:favorites | В избранном есть товары         | onFull |

```js
// EventBus
EventBus.subscribe('add:insales:favorites', function (data) {
  console.log('Товар добавлен в избранное');
  console.log(data);
});

// jQuery
$(document).on('add:insales:favorites', function(event) {
  console.log('Товар добавлен в избранное');
  console.log(event.insalesFavorites);
});

// Callback
var Favorite = new Favorites({
  onAdd: function (data) {
    console.log('Товар добавлен в избранное');
    console.log(data);
  }
});
```

## Плагины для InSales

- [Отправка сообщений](https://github.com/VladimirIvanin/InSalesFeedback)
- [Ранее просмотренные товары](https://github.com/VladimirIvanin/RecentlyView)
- [Определение местоположения пользователя](https://github.com/VladimirIvanin/geoManager)
