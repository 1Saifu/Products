import mongoose, { connect } from "mongoose";

const con = await connect("mongodb://127.0.0.1:27017/product-saifu-adam");

const {db} = await mongoose.connection;


// const categoriesCol = await db.collection("categories")
// const suppliersCol = await db.collection("suppliers");
// const productsCol = await db.collection("products");
// const offersCol = await db.collection("offers");
// const ordersCol = await db.collection("orders");
// const salesOrdersCol = await db.collection("salesOrders")


// const insertedCategories = await categoriesCol.insertMany([
//     { name: "Electronics" },
//     { name: "Clothing" },
//     { name: "Home Appliances" },
//     { name: "Beauty & Personal Care" },
//     { name: "Sports & Outdoors" },
// ])

// const electronicsCategoryId = insertedCategories.insertedIds[0];
// const fashionCategoryId = insertedCategories.insertedIds[1];
// const homeCategoryId = insertedCategories.insertedIds[2];
// const beautyCategoryId = insertedCategories.insertedIds[3];
// const sportsCategoryId = insertedCategories.insertedIds[4];


// const mySupplier = await suppliersCol.insertMany(
//     [
//         {
//             company: "Electronics Supplier Inc",
//             contact: "John Doe",
//             email: "John@electronsupplier.com",
//             category: electronicsCategoryId,
//         },
//         {
//             company: "Fashion Supplier Co",
//             contact: "Jane Smith",
//             email: "Jane@fashionsupplier.com",
//             category: fashionCategoryId,
//         },
//         {
//             company: "Sports Supplier Co",
//             contact: "Jackie Chan",
//             email: "Jackie@sportssupplier.com",
//             category: sportsCategoryId,
//         },
//         {
//             company: "Home Supplier Co",
//             contact: "Bruce Wayne",
//             email: "Bruce@homesupplier.com",
//             category: homeCategoryId,
//         },
//         {
//             company: "Beauty Supplier Co",
//             contact: "Britt Marie",
//             email: "Marie@beautysupplier.com",
//             category: beautyCategoryId,
//         },
//     ]
// )

// const electronicsSupplierId = mySupplier.insertedIds[0];
// const fashionSupplierId = mySupplier.insertedIds[1];
// const sportsSupplierId = mySupplier.insertedIds[2];
// const homeSupplierId = mySupplier.insertedIds[3];
// const beautySupplierId = mySupplier.insertedIds[4];


// const insertedProducts = await productsCol.insertMany(
//     [
//         {
//             name: "Laptop",
//             category: electronicsCategoryId,
//             price: 1000,
//             cost: 800,
//             stock: 50,
//             supplier: electronicsSupplierId,
//         },
//         {
//             name: "Smartphone",
//             category: electronicsCategoryId,
//             price: 800,
//             cost: 600,
//             stock: 40,
//             supplier: electronicsSupplierId,
//         },
//         {
//             name: "T-shirt",
//             category: fashionCategoryId,
//             price: 20,
//             cost: 10,
//             stock: 100,
//             supplier: fashionSupplierId,
//         },
//         {
//             name: "Refrigerator",
//             category: homeCategoryId,
//             price: 1200,
//             cost: 1000,
//             stock: 30,
//             supplier: homeSupplierId,
//         },
//         {
//             name: "Shampoo",
//             category: beautyCategoryId,
//             price: 10,
//             cost: 5,
//             stock: 80,
//             supplier: beautySupplierId,
//         },
//         {
//             name: "Soccer Ball",
//             category: sportsCategoryId,
//             price: 30,
//             cost: 20,
//             stock: 60,
//             supplier: sportsSupplierId,
//         }
//     ]
// )

// const productsId = insertedProducts.insertedIds;

// const insertedOffer = await offersCol.insertMany(
//     [
//         {
//             products: [productsId[0], productsId[1]],
//             price: 1800,
//             active: true,
//         },
//         {
//             products: [productsId[2], productsId[4]],
//             price: 30,
//             active: true,
//         },
//         {
//             products: [productsId[3], productsId[1], productsId[5]],
//             price: 1830,
//             active: false,
//         },
//     ]
// )

// ordersCol.insertMany(
//     [
//         {
//             offer: 1,
//             quantity: 2,
//             status: "pending",
//         },
//         {
//             offer: 3,
//             quantity: 1,
//             status: "pending",
//         },
//     ]
// )


const categoriesSchema = mongoose.Schema({
    name: {type: String}
})

const productsSchema = mongoose.Schema(
    {
        name: {type: String},
        category: {type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
        price: {type: Number},
        cost: {type: Number},
        stock: {type: Number},
        supplier: {type: mongoose.Schema.Types.ObjectId, ref: 'suppliers'},
        offer: {type: mongoose.Schema.Types.ObjectId, ref: 'offers'},
    }
);

const offersSchema = mongoose.Schema(
    {
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }],
        price: {type: Number},
        active: {type: Boolean},
    }
);

const suppliersSchema = mongoose.Schema(
    {
        company: {type: String},
        contact: {type: String},
        email: {type: String},
        category: {type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
    }
);

const ordersSchema = mongoose.Schema({
    offer: { type: mongoose.Schema.Types.ObjectId, ref: 'offers' }, // Reference to the 'offers' collection
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, // Reference to the 'products' collection
    quantity: { type: Number },
    status: { type: String },
});

const salesOrderSchema = mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId },
    totalRevenue: { type: Number },
    totalCost: { type: Number },
    profit: { type: Number },
    profitAfterTax: { type: Number },
    orderDate: { type: Date, default: Date.now }
});

const salesOrderModel = mongoose.model("sales_orders", salesOrderSchema);



const productsModel = mongoose.model("products", productsSchema);
const categoriesModel = mongoose.model("categories", categoriesSchema);
const offersModel = mongoose.model("offers", offersSchema);
const suppliersModel = mongoose.model("suppliers", suppliersSchema);
const ordersModel = mongoose.model("orders", ordersSchema);

export{ productsModel, offersModel, suppliersModel, ordersModel, categoriesModel,salesOrderModel };

