import mongoose, { connect } from "mongoose";

const con = await connect("mongodb://127.0.0.1:27017/product-saifu-adam");

const {db} = await mongoose.connection;




const productsSchema = mongoose.Schema(
    {
        name: {type: String},
        category: {type: String},
        price: {type: Number},
        cost: {type: Number},
        stock: {type: Number},
    }
);

const offersSchema = mongoose.Schema(
    {
        products: {type: String},
        price: {type: Number},
        active: {type: String},
    }
);

const suppliersSchema = mongoose.Schema(
    {
        name: {type: String},
        contact: {type: String},
    }
);

const ordersSchema = mongoose.Schema(
    {
        offer: {type: Number},
        quantity: {type: Number},
        status: {type: String},
    }
);

const productsModel = mongoose.model("products", productsSchema);
const offersModel = mongoose.model("offers", offersSchema);
const suppliersModel = mongoose.model("suppliers", suppliersSchema);
const ordersModel = mongoose.model("orders", ordersSchema);