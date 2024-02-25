import mongoose from "mongoose";
import prompt from "prompt-sync";
import { productsModel, offersModel, suppliersModel, ordersModel, categoriesModel, salesOrderModel} from "./create-database.js"

const user = prompt();

console.log("Welcome!")
console.log("1. Add new category")
console.log("2. Add new product")
console.log("3. View products by category")
console.log("4. View products by supplier")
console.log("5. View all offers within a price range")
console.log("6. View all offers that contain a product from a specific category")
console.log("7. View the number of offers based on the number of its products in stock")
console.log("8. Create order for products")
console.log("9. Create order for offers")
console.log("10. Ship orders")
console.log("11. Add a new supplier")
console.log("12. View suppliers")
console.log("13. View all sales")
console.log("14. View sum of all products")
console.log("15. exit")

let runApp = true;

while(runApp){

let input = user("Choose a number between 1-15: ")
if(input == 1){

    const allCategories = await categoriesModel.distinct("name"); //distinct chooses one object out of all of them
    console.log("All existing categories:")
    console.log(allCategories);
    
    const myNewCategory = user("Add a new category: ");

    const newCategory = new categoriesModel({
        name: myNewCategory
    });

    await newCategory.save(); //this will save it to the collection

    console.log("A new category has been added!");

}

else if(input == 2){

    const productName = user("Enter a product name: ");

    const allCategories = await categoriesModel.distinct("name"); 
    console.log("All existing categories:")
    console.log(allCategories);

    const productCategory = user("Enter an existing category or add a new category: ");

    let categoryObject = await categoriesModel.findOne({ name: productCategory }); //this will check if users category is inline with an existing category

    if(!allCategories.includes(productCategory)){ //includes checks in an array if its true or false, so if there is no category in the existing array with categorys then it will create a new one
        const addNewCategory = user(`"${productCategory}" does not exist. Would you like to add it? (yes/no): `);

        if(addNewCategory.toLowerCase() === 'yes'){
            const newCategory = new categoriesModel({
                name: productCategory
            })
            categoryObject = await newCategory.save();
            console.log(`the category "${productCategory}" has been added`);
        }
        else{
            console.log("Product has not been added. Choose and existing category or add a new category");
        }
    }
    
    const allSuppliers = await suppliersModel.find({}); 
    console.log("All suppliers:")
    console.log(allSuppliers);
    
    const supplierContact = user("Enter the supplier full name: ");
    
    let supplier= await suppliersModel.findOne({
        contact: supplierContact,
        category: categoryObject._id
    })

if(!supplier){

    const addNewSupplier = user("Supplier not found. Would you like to add a new supplier? (yes/no)");

    if(addNewSupplier.toLocaleLowerCase() === "yes"){

        const supplierCompany = user("Enter the company name: ")
        const supplierEmail = user("Enter the supplier email: ");

        supplier  = await suppliersModel.create({
        company: supplierCompany,
        contact: supplierContact,
        email: supplierEmail,
        category: categoryObject._id,
        })
        console.log(`${supplierContact} has been added!`)
    } else{
        console.log("Choose an existing supplier or add a new one")
    }
}

    //parseInt converts string to number
    const productPrice = parseInt(user("Enter the price for the product: "));
    const productCost = parseInt(user("Enter the product cost: "));
    const productStock = parseInt(user("Enter the stock amount for the product: "));

  
    const newProduct = await productsModel.create({
        name: productName,
        category: categoryObject._id,
        price: productPrice,
        cost: productCost,
        stock: productStock,
        supplier: supplier._id,
    })

    console.log(newProduct, "has been added!")

}

else if(input == 3){

    const allCategories = await categoriesModel.distinct("name"); 
    console.log("All existing categories:")
    console.log(allCategories);

    const inputCategory = user("Enter a category: ")

    const viewProductByCategory = await productsModel.aggregate([
        {
            $match: { //Match will check if the name of the input category as the existing categories
                category: {
                    $in: await categoriesModel.find({ name: inputCategory }).distinct("_id")
                }
            }
        },
        {
            $lookup: { //Lookup will combine documents
                from: "suppliers", //This takes the supplier collection
                localField: "supplier", //This takes the supplier object from products collection
                foreignField: "_id", //This combines the 2
                as: "suppliersInfo" //the 2 will be known as this
            }
        },
        {
            $project: { //This is what will view, 1 will show the info and 0 will not show the info
                name: 1,
                price: 1,
                cost: 1,
                stock: 1,
                supplier: "$suppliersInfo.contact"
            }
        }

    ]);

    console.log("Products in choosen category:")
    console.log(viewProductByCategory);

}

else if(input == 4){

    const allSuppliers = await suppliersModel.distinct("contact"); 
    console.log("All suppliers:")
    console.log(allSuppliers);

    const enterSupplier = user("Enter the name of a supplier: ");
    const supplier = await suppliersModel.findOne({ contact: enterSupplier });

    if(supplier){
        const suppliersProduct = await productsModel.find({ supplier: supplier._id });
        console.log(`All products from ${enterSupplier}:`);
        console.log(suppliersProduct);
    }
    else{
        console.log(`Products from ${enterSupplier} not found`);
    }

}

else if(input == 5){

    const minPriceInput = parseInt(user("Enter the minimum price: "));
    const maxPriceInput = parseInt(user("Enter the maxmimum price: "));

    const myOfferRange = await offersModel.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "products",
                foreignField: "_id",
                as: "productsInfo"
            }
        },
        {
            $match: {
                price: { $gte: minPriceInput, $lte: maxPriceInput }
            }
        },
        {
            $project: {
                _id: 0,
                price: 1,
                active: 1,
                products: {
                    $map: {
                        input: "$productsInfo",
                        as: "product",
                        in: "$$product.name"
                    }
                }
            }
        }
    ]);

    console.log(`Offers within the price range ${minPriceInput} - ${maxPriceInput}`);
    console.log(myOfferRange);
    
}

else if(input == 6){

    const allCategories = await categoriesModel.distinct("name"); 
    console.log("All existing categories:")
    console.log(allCategories);

    const offerCategory = user("Enter a category to view offers: ");

    const result = await offersModel.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "products",
                foreignField: "_id",
                as: "productsInfo"
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "productsInfo.category",
                foreignField: "_id",
                as: "categoryInfo"
            }
        },
        {
            $match: {
                "categoryInfo.name": offerCategory
            }
        },
        {
            $project: {
                _id: 0,
                price: 1,
                active: 1,
                products: "$productsInfo.name"
            }
        }
    ]);

    if(result.length > 0){ 
        console.log(`All offers containing products from the category ${offerCategory}:`);
        console.log(result);
    }else{
        console.log(`No offer found in ${offerCategory}:`);
    }

}


else if (input == 7) {
    const offersStockStatus = await offersModel.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "products",
                foreignField: "_id",
                as: "productsDetails"
            }
        },
        {
            $addFields: {
                allInStock: {
                    $allElementsTrue: {
                        $map: {
                            input: "$productsDetails",
                            as: "product",
                            in: { $gt: ["$$product.stock", 0] }
                        }
                    }
                },
                someInStock: {
                    $gt: [{ $size: { $filter: {
                        input: "$productsDetails",
                        as: "product",
                        cond: { $gt: ["$$product.stock", 0] }
                    }}}, 0]
                }
            }
        },
        {
            $group: {
                _id: null,
                allProductsInStock: { $sum: { $cond: ["$allInStock", 1, 0] }},
                someProductsInStock: { $sum: { $cond: [{ $and: ["$someInStock", { $not: "$allInStock" }] }, 1, 0] }},
                noProductsInStock: { $sum: { $cond: [{ $not: "$someInStock" }, 1, 0] }}
            }
        }
    ]);

    console.log("Offers based on stock availability:");
    console.log(offersStockStatus);
}



else if (input == 8) {
    const productName = user("Enter the product name: ");
    const product = await productsModel.findOne({ name: productName });
    if (!product) {
        console.log("Product not found.");
        break;
    }

    const quantity = parseInt(user("Enter the quantity: "), 10);
    if (quantity > product.stock) {
        console.log("Insufficient stock.");
        break;
    }

    const order = new ordersModel({
        product: product._id, // Assuming your ordersSchema is adjusted to reference products
        quantity,
        status: "pending"
    });

    await order.save();
    console.log("Order created successfully for product:", productName);
}



else if (input == 9) {
    console.log("Creating an order for an offer.");

    // Display all offers to the user
    const offers = await offersModel.find({}).populate('products'); // Assuming 'products' field holds product IDs
    console.log("Available offers:");
    offers.forEach((offer, index) => {
        // Assuming offer documents contain a 'products' field with product names after population
        const productNames = offer.products.map(product => product.name).join(", ");
        console.log(`${index + 1}. Offer ID: ${offer._id}, Products: ${productNames}, Price: $${offer.price}`);
    });

    // Prompt the user to select an offer
    const offerIndex = parseInt(user("Enter the number of the offer you want to order: ")) - 1;
    
    const selectedOffer = offers[offerIndex];

    // Prompt for the quantity
    const quantity = parseInt(user("Enter the quantity: "));


    // Create the order for the selected offer
    const newOrder = new ordersModel({
        offer: selectedOffer._id,
        quantity: quantity,
        status: "pending",
    });

    // Save the order
    await newOrder.save();

    console.log("Order created successfully for the selected offer.");
}

else if (input == 10) {
    // Retrieve all pending orders with populated 'offer' field
    const pendingOrders = await ordersModel.find({ status: "pending" }).populate('offer');

    if (pendingOrders.length === 0) {
        console.log("No pending orders to ship.");
        continue; // Continue to the next iteration of the loop
    }

    console.log("Pending Orders:");
    pendingOrders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order._id}`);
    });

    const orderIndex = user("Enter the number of the order to be shipped: ");
    const selectedOrder = pendingOrders[orderIndex - 1];

    if (!selectedOrder) {
        console.log("Invalid selection.");
        continue; // Continue to the next iteration of the loop
    }

    // Check if the selected order contains valid offer ObjectId references
    if (!selectedOrder.offer || !Array.isArray(selectedOrder.offer) || selectedOrder.offer.length === 0) {
        console.log("No valid offers found in the selected order.");
        continue; // Continue to the next iteration of the loop
    }

    // Check if each offer reference is a valid ObjectId
    const isValidOfferReferences = selectedOrder.offer.every(offer => mongoose.Types.ObjectId.isValid(offer._id));

    if (!isValidOfferReferences) {
        console.log("Invalid offer references in the selected order.");
        continue; // Continue to the next iteration of the loop
    }

    // Update the status of the selected sales order to "shipped"
    selectedOrder.status = "shipped";
    await selectedOrder.save();

    // Decrease the stock quantities of the products and offers included in the selected order
    for (const offer of selectedOrder.offer) {
        // Decrease the stock of the offer
        const updatedOffer = await offersModel.findById(offer._id);
        updatedOffer.stock -= 1;
        await updatedOffer.save();
    }

    console.log("Order has been shipped successfully.");
}


else if (input == 11) {
const allSuppliers = await suppliersModel.find({}); 
    console.log("All suppliers:")
    console.log(allSuppliers);
    
    const supplierContact = user("Enter a full name for new supplier: ");
    
    let supplier= await suppliersModel.findOne({
        contact: supplierContact,
    })

if(!supplier){

        const supplierCompany = user("Enter the company name: ")
        const supplierEmail = user("Enter the supplier email: ");

        supplier  = await suppliersModel.create({
        company: supplierCompany,
        contact: supplierContact,
        email: supplierEmail,
        })

        console.log(`${supplierContact} has been added!`)

        const newCategoryName = user("Enter a new category for the supplier: ");
        const newCategory = new categoriesModel({
            name: newCategoryName
        })

        await newCategory.save()

        console.log(`The category ${newCategoryName} has been added to the supplier!`)
}
}


else if(input == 12){

    const allSuppliers = await suppliersModel.find({}); 
    console.log("All suppliers:")
    console.log(allSuppliers);

}
else if (input == 13) {
    console.log("Viewing all sales orders.");

    const salesOrders = await ordersModel.find({}).populate('product offer').exec();

    if (!salesOrders.length) {
        console.log("No sales orders found.");
    } else {
        salesOrders.forEach((order, index) => {
            let totalCost = 0;
            if (order.product) {
                totalCost = order.quantity * order.product.price;
            } else if (order.offer) {
                totalCost = order.offer.price;
            }
            console.log(`Order ID: ${order._id}, Date: ${order.date ? order.date.toISOString().split('T')[0] : 'N/A'}, Status: ${order.status}, Total Cost: $${totalCost}`);
        });
    }
}


else if (input == 14) {
    const allOrders = await ordersModel.find({ status: 'shipped' }).populate('offer product');

    let totalProfit = 0;
    for (let order of allOrders) {
        if (order.product) {
            // For orders directly linked to products
            const product = await productsModel.findById(order.product);
            const profitPerProduct = (product.price - product.cost) * order.quantity;
            totalProfit += profitPerProduct;
        } else if (order.offer) {
            // For orders linked to offers
            const offer = await offersModel.findById(order.offer).populate({
                path: 'products',
                model: 'Product'
            });
            let offerProfit = 0;
            for (let product of offer.products) {
                const profitPerProduct = (product.price - product.cost) * order.quantity; // Assuming same quantity for all products in the offer
                offerProfit += profitPerProduct;
            }
            totalProfit += offerProfit;
        }
    }

    console.log(`Total profit from all shipped orders (excluding taxes): $${totalProfit}`);
}


else if(input == 15){
    runApp = false;
    break;
}

else{
    console.log("Please choose a number between 1-15!")
}

}


await mongoose.connection.close();

