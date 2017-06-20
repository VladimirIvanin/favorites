# Избранное для платформы InSales

## CDN

```
  <script src="https://cdn.jsdelivr.net/gh/VladimirIvanin/favorites@0.1.0/dist/favorites.js"></script>
```

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
