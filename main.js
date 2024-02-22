import mongoose from "mongoose";
import prompt from "prompt-sync";
import { productsModel, offersModel, suppliersModel, ordersModel } from "./create-database.js"

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
    
}

else if(input == 2){

    const productName = user("Enter a product name: ");

    const allCategories = await productsModel.distinct("category"); //Distinct excluderar andra object utom category
    console.log("All categories:")
    console.log(allCategories);

    const productCategory = user("Enter an existing category or add a new category: ");

    if(!allCategories.includes(productCategory)){
        const addNewCategory = user(`"${productCategory}" does not exist. Would you like to add it? (yes/no): `);

        if(addNewCategory.toLowerCase() == 'yes'){
            console.log(`the category "${productCategory}" has been added`);
        }
        else{
            console.log("Product has not been added. Choose and existing category or add a new category");
        }
    }

    const productPrice = parseInt(user("Enter the price for the product: "));
    const productCost = parseInt(user("Enter the product cost: "));
    const productStock = parseInt(user("Enter the stock amount for the product: "));

    const newProduct = new productsModel({
        name: productName,
        category: productCategory,
        price: productPrice,
        cost: productCost,
        stock: productStock,
    })

    await newProduct.save();
    console.log("New product has been added!")

}

else if(input == 3){

    const allCategories = await productsModel.distinct("category"); //Distinct excluderar andra object utom category
    console.log("All categories:")
    console.log(allCategories);

    const inputCategory = user("Enter a category: ")

    const viewProductByCategory = await productsModel.find({ category: inputCategory });

    console.log("Products in choosen category:")
    console.log(viewProductByCategory);

}

else if(input == 12){

    const allSuppliers = await suppliersModel.find({}); 
    console.log("All suppliers:")
    console.log(allSuppliers);

}

else if(input == 15){
    runApp = false;
}

else{
    console.log("Please choose a number between 1-15!")
}

}


await mongoose.connection.close();

