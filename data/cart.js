export const cart = [];

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
}
