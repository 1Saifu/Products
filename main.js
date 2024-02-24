import mongoose from "mongoose";
import prompt from "prompt-sync";
import { productsModel, offersModel, suppliersModel, ordersModel, categoriesModel } from "./create-database.js"

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

    const allCategories = await categoriesModel.distinct("name"); 
    console.log("All existing categories:")
    console.log(allCategories);
    
    const myNewCategory = user("Add a new category: ");

    const newCategory = new categoriesModel({
        name: myNewCategory
    });

    await newCategory.save();

    console.log("A new category has been added!");

}

else if(input == 2){

    const productName = user("Enter a product name: ");

    const allCategories = await categoriesModel.distinct("name"); 
    console.log("All existing categories:")
    console.log(allCategories);

    const productCategory = user("Enter an existing category or add a new category: ");

    const categoryObject = await categoriesModel.findOne({ name: productCategory });

    if(!allCategories.includes(productCategory)){
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
    
    const supplierName = user("Enter the supplier name: ");
    
    let supplier= await suppliersModel.findOne({
        name: supplierName,
        category: categoryObject._id
    })

if(!supplier){

    const supplierContact = user("Enter the supplier contact: ");
    const supplierEmail = user("Enter the supplier email: ");

    const addNewSupplier = user("Supplier not found. Would you like to add a new supplier? (yes/no)");

    if(addNewSupplier.toLocaleLowerCase() === "yes"){
        supplier  = await suppliersModel.create({
        name: supplierName,
        contact: supplierContact,
        email: supplierEmail,
        category: categoryObject._id,
        })
        console.log(`${supplierName} has been added!`)
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
            $match: {
                category: {
                    $in: await categoriesModel.find({ name: inputCategory }).distinct("_id")
                }
            }
        },
        {
            $lookup: {
                from: "suppliers",
                localField: "supplier",
                foreignField: "_id",
                as: "suppliersInfo"
            }
        },
        {
            $project: {
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

    const allCategories = await productsModel.distinct("category"); 
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
            $match: {
                "productsInfo.category": offerCategory
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

    console.log(`All offers containing products from the category ${offerCategory}:`);
    console.log(result);

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

