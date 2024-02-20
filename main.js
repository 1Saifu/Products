import mongoose from "mongoose";
import prompt from "prompt-sync";

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

else if(input == 15){
    runApp = false;
}

else{
    console.log("Please choose a number between 1-15!")
}

}


await mongoose.connection.close();

