import {cart,RemoveFromCart,updateDeliveryOption,saveLocalStorageCart,updateQuantity} from '../data/cart.js';
import {products,getProduct} from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { renderCheckoutHeader } from './checkout/checkoutHeader.js';

function renderOrderSummary(){
  let cartSummaryHTML='';

  cart.forEach((cartItems) =>{
      const product_Id = cartItems.productId;

      const matchingProduct = getProduct(product_Id);

      const deliveryOptionId = cartItems.deliveryOptionId;

      let deliveryOption;

      deliveryOptions.forEach((option) =>{
        if(option.id === deliveryOptionId){
          deliveryOption = option;
        }
      });

      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays,'days');
      const dateString = deliveryDate.format('dddd, MMMM D');


      cartSummaryHTML+=`
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
              <div class="delivery-date">
                Delivery date: ${dateString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${matchingProduct.image}">

                <div class="cart-item-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-price">
                    $${formatCurrency(matchingProduct.priceCents)}
                  </div>
                  <div class="product-quantity">
                    <span>
                      Quantity: <span class="quantity-label">${cartItems.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
                      Update
                    </span>
                    <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                    <span class="save-quantity-link link-primary js-save-link" data-product-id=${matchingProduct.id}>Save</span>
                    <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id=${matchingProduct.id}>
                      Delete
                    </span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                ${deliveryOptionsHTML(matchingProduct, cartItems)}
                </div>
              </div>
            </div>
      `;
  });


  function deliveryOptionsHTML(matchingProduct, cartItems) {
    let deliveryHTML = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const dateString = today.add(deliveryOption.deliveryDays, 'days').format('dddd, MMMM D');
      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
      const isChecked = (deliveryOption.id === cartItems.deliveryOptionId);
      const inputId = `do-${matchingProduct.id}-${deliveryOption.id}`;

      deliveryHTML += `
        <div class="delivery-option">
          <input
            id="${inputId}"
            type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}"
            data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${deliveryOption.id}"
            ${isChecked ? 'checked' : ''} />
          <label for="${inputId}">
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </label>
        </div>
      `;
    });

    return deliveryHTML;
  }



  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-quantity-link').forEach((link) =>{
    
    link.addEventListener('click', () =>{

          const product_Id = link.dataset.productId;

          RemoveFromCart(product_Id);

          const container = document.querySelector(`.js-cart-item-container-${product_Id}`);

          container.remove();
  
          renderPaymentSummary();

          renderCheckoutHeader();
    });

  });

  document.querySelectorAll('.js-update-quantity-link').forEach((link)=>{
    link.addEventListener('click',() =>{
      const product_Id = link.dataset.productId;
      console.log(product_Id);
      const container = document.querySelector(`.js-cart-item-container-${product_Id}`);
      container.classList.add('is-editing-quantity');
    });
  });

  document.querySelectorAll('.js-save-link').forEach((link)=> {
    link.addEventListener('click', ()=>{
      const productId = link.dataset.productId;
      const container =document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.remove('is-editing-quantity');

      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
      const newQuantity = Number(quantityInput.value);
      const quantityLabel = container.querySelector('.quantity-label');
      quantityLabel.textContent = newQuantity;
      updateQuantity(productId, newQuantity);
      saveLocalStorageCart();
      renderCheckoutHeader();
      
      renderPaymentSummary();

      renderOrderSummary();
    });
  });


  // ✅ Event listener for delivery option changes
  document.addEventListener('change', (e) => {
    if (!e.target.matches('.delivery-option-input')) return;

    const productId = e.target.dataset.productId;
    const deliveryOptionId = e.target.dataset.deliveryOptionId;

    updateDeliveryOption(productId, deliveryOptionId);

    // Update the delivery date shown in the UI
    const item = cart.find(c => c.productId === productId);
    const opt = deliveryOptions.find(o => o.id === item.deliveryOptionId);
    const newDate = dayjs().add(opt.deliveryDays, 'days').format('dddd, MMMM D');
    document.querySelector(`.js-cart-item-container-${productId} .delivery-date`)
      .textContent = `Delivery date: ${newDate}`;
    renderPaymentSummary();
  });
  let total_quan =0; 

  cart.forEach((items) => {
    total_quan += items.quantity;
  });


  document.querySelector('.js-return-to-home-link').innerHTML = `${total_quan} items`;
}
renderCheckoutHeader();

renderPaymentSummary();

renderOrderSummary();

