# Избранное для платформы InSales

## CDN

```
<<<<<<< HEAD
  <script src="https://cdn.jsdelivr.net/gh/VladimirIvanin/favorites@0.6.0/dist/favorites.js"></script>
=======
  <script src="https://cdn.jsdelivr.net/gh/VladimirIvanin/favorites@0.5.6/dist/favorites.js"></script>
>>>>>>> 1d14e437394bab5b1cdfabd6bea005ee1ee48fbb
```


## Простой пример

> Важно! Кнопку добавления в избранное стоит размещать внутри формы продукта.

```js
var Favorite = new Favorites({
  onUpdate: function (data) {
    console.log(data.products);
    // Пример работает только с common.js v2
    // Рендер списка товаров
    $('.js-favorite').html(Template.render(data, 'favorite'));

    // инициализация инстансов нужна после динамического добавления товаров
    Products.getList(_.map(data.products, 'id'))
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

```html
<!-- Код для вставки на страницу избранного -->
<!-- Для избранного можно создать отдельный шаблон page.favorite.liquid -->
<div class="js-favorite"></div>

<script type="text/template" data-template-id="favorite">

    <div class="products-favorite">

      <div class="row is-grid">
        <% _.forEach(products, function (product){  %>
        <div class="cell-4 cell-6-sm cell-12-xs">
          <form class="card cards-col" action="{{ cart_url }}" method="post" data-product-id="<%= product.id %>">
            <div class="card-info">

              <div class="card-image">

                <a href="<%= product.url %>" class="image-inner">
                  <div class="image-wraps">
                    <span class="image-container is-square">
                      <span class="image-flex-center">
                        <img src="<%= product.first_image.large_url %>">
                      </span>
                    </span>
                  </div>
                </a>
              </div>

              <div class="card-title">
                <a href="<%= product.url %>">
                  <%= product.title %>
                </a>
              </div>

            </div>

            <div class="card-prices">
              <div class="row flex-center flex-bottom">
                <div class="card-price">
                  <%= Shop.money.format(product.variants[0].price) %>
                </div>
                <% if (product.variants[0].old_price){ %>
                  <div class="card-old_price">
                    <%= Shop.money.format(product.variants[0].old_price) %>
                  </div>
                  <% } %>
                </div>
              </div>


            <div class="card-action show-flex flex-bottom">
              <div class="hide">
                <input type="hidden" name="variant_id" value="<%= product.variants[0].id %>" >
                <div data-quantity class="hide">
                  <input type="text" name="quantity" value="1" />
                  <span data-quantity-change="-1">-</span>
                  <span data-quantity-change="1">+</span>
                </div>
              </div>
            </div>


            <div class="card-action-inner">
              <button class="bttn-favorite is-added" data-favorites-trigger="<%= product.id %>"></button>
              <% if (product.variants.size > 1){ %>
                <a href="<%= product.url %>" class="bttn-prim">Подробнее</a>
              <% }else{ %>
                <button data-item-add class="bttn-prim" type="button">В корзину</button>
              <% } %>
            </div>

          </form>
        </div>
        <% }) %>
      </div>

    </div>

</script>
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
