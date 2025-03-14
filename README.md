# Избранное для платформы InSales

## Простой пример

> Важно! Кнопку добавления в избранное стоит размещать внутри формы продукта.

```js
var Favorite = new Favorites({
  // debug: true,
  buttonNotAddedText: 'Добавлен в избранное', // текст не активной кнопки
  buttonAddedText: 'Добавить в избранное', // текст активной кнопки
  onUpdate: function (data) {
    console.log(data.products);
  }
});

// если нужно переинициализировать классы на иконках
// Favorite.checkFavoritesProducts()
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


## События / callbacks

Модуль поддерживает EventBus (для common.js v2)

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


// Callback
var Favorite = new Favorites({
  onAdd: function (data) {
    console.log('Товар добавлен в избранное');
    console.log(data);
  }
});
```
