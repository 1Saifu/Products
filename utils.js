import { productsModel, offersModel } from "./create-database.js";

async function calculateTotalRevenue(order) {
    let totalRevenue = 0;

    // Assuming order.products and order.offers contain arrays of product and offer IDs
    for (let productId of order.products) {
        const product = await productsModel.findById(productId);
        console.log(product); // Verify product data return
        if (product) totalRevenue += product.price;
    }

    for (let offerId of order.offers) {
        const offer = await offersModel.findById(offerId);
        console.log(offer); // Verify offer data return
        if (offer) totalRevenue += offer.discountedPrice;
    }

    return totalRevenue;
}


async function calculateTotalCost(order) {
    let totalCost = 0;
    if (order.product) {
        const product = await productsModel.findById(order.product);
        totalCost = product.cost * order.quantity;
    } else if (order.offer) {
        const offer = await offersModel.findById(order.offer);
        totalCost = offer.price * order.quantity; // Assuming the 'price' here should be 'cost' if you're calculating cost
    }
    return totalCost;
}

export { calculateTotalRevenue, calculateTotalCost};
