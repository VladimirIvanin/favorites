# Избранное для платформы InSales

## Простой пример

> Важно! Кнопку добавления в избранное стоит размещать внутри формы продукта.

```js
var Favorite = new Favorites({
  // debug: true,
  // если кнопка содержит текст
  // buttonNotAddedText: 'Добавить в избранное', 
  // buttonAddedText: 'Добавлен в избранное', 
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

## Параметры

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| counterTemplate | string | '(%c%)' | Шаблон счетчика, %c% заменяется на количество |
| counterTemplateEmpty | string | null | Шаблон пустого счетчика |
| buttonNotAddedText | string | null | Текст неактивной кнопки |
| buttonAddedText | string | null | Текст активной кнопки |
| debug | boolean | false | Режим отладки |
| replaceTitle | boolean | true | Заменять title кнопок |
| titles | object | { added: 'Добавлен в избранное', notAdded: 'Добавить в избранное' } | Тексты для title |
| classes | object | { added: 'is-added', notAdded: 'not-added', empty: 'is-empty', full: 'is-full' } | CSS классы |

## События / callbacks

Модуль поддерживает EventBus (для common.js v2) и jQuery события

| Событие | Назначение | Callback |
|---------|-----------|----------|
| init:insales:favorites | Инициализация | onInit |
| before:insales:favorites | Перед добавлением/удалением | onBefore |
| add:insales:favorites | Товар добавлен в избранное | onAdd |
| remove:insales:favorites | Товар удален из избранного | onRemove |
| update:insales:favorites | Обновление | onUpdate |
| empty:insales:favorites | В избранном нет товаров | onEmpty |
| full:insales:favorites | В избранном есть товары | onFull |

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

## HTML атрибуты

| Атрибут | Описание |
|---------|----------|
| data-favorites-trigger="ID" | Переключатель (добавить/удалить) |
| data-favorites-add="ID" | Только добавить в избранное |
| data-favorites-remove="ID" | Только удалить из избранного |
| data-favorites-counter | Счетчик избранного |
