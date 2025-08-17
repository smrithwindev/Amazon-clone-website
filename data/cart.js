export let cart = JSON.parse(localStorage.getItem('my_cart_items'));

if(!cart){
    cart = [{
    productId :"e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity : 2
},
{
    productId : "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity : 1
}];
}

function saveLocalStorageCart() {
    localStorage.setItem('my_cart_items', JSON.stringify(cart));
}

export function addToCart(product_Id){
let matchingItem;

cart.forEach((item) =>{
    if(product_Id === item.productId){
        matchingItem = item;
    }
});                                     // here item is refered to each entire object and not just the productId 

if(matchingItem){
    matchingItem.quantity +=1;
}
else
{ 
cart.push(
    {
        productId : product_Id,
        quantity:1
    }
);
}
saveLocalStorageCart(); // Save the updated cart to localStorage
}


export function RemoveFromCart(productId)
{
    let newCart = [];

    cart.forEach((cartItem) =>{
        if(productId !== cartItem.productId){
            newCart.push(cartItem);
        }
    });
    cart = newCart; // Update the cart with the new array without the removed item

    saveLocalStorageCart(); // Save the updated cart to localStorage
 
}