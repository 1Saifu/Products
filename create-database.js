import mongoose, { connect } from "mongoose";

const con = await connect("mongodb://127.0.0.1:27017/product-saifu-adam");

const {db} = await mongoose.connection;


const productsCol = await db.collection("products");
const offersCol = await db.collection("offers");
const suppliersCol = await db.collection("suppliers");
const ordersCol = await db.collection("orders");


const mySupplier = await suppliersCol.insertMany(
    [
        {
            name: "Electronics Supplier Inc",
            contact: "John Doe",
            email: "John@electronsupplier.com"
        },
        {
            name: "Fashion Supplier Co",
            contact: "Jane Smith",
            email: "Jane@fashionsupplier.com",
        },
        {
            name: "Sports Supplier Co",
            contact: "Jackie Chan",
            email: "Jackie@sportssupplier.com",
        },
        {
            name: "Home Supplier Co",
            contact: "Bruce Wayne",
            email: "Bruce@homesupplier.com",
        },
    ]
)

const electronicsSupplierId = mySupplier.insertedIds[0];
const fashionSupplierId = mySupplier.insertedIds[1];
const sportsSupplierId = mySupplier.insertedIds[2];
const homeSupplierId = mySupplier.insertedIds[3];

productsCol.insertMany(
    [
        {
            name: "Laptop",
            category: "Electronics",
            price: 1000,
            cost: 800,
            stock: 50,
            supplier: electronicsSupplierId,
        },
        {
            name: "Smartphone",
            category: "Electronics",
            price: 800,
            cost: 600,
            stock: 40,
            supplier: electronicsSupplierId,
        },
        {
            name: "T-shirt",
            category: "Clothing",
            price: 20,
            cost: 10,
            stock: 100,
            supplier: fashionSupplierId,
        },
        {
            name: "Refrigerator",
            category: "Home Appliances",
            price: 1200,
            cost: 1000,
            stock: 30,
            supplier: homeSupplierId,
        },
        {
            name: "Shampoo",
            category: "Beauty & Personal Care",
            price: 10,
            cost: 5,
            stock: 80,
            supplier: fashionSupplierId,
        },
        {
            name: "Soccer Ball",
            category: "Sports & Outdoors",
            price: 30,
            cost: 20,
            stock: 60,
            supplier: sportsSupplierId,
        }
    ]
)

offersCol.insertMany(
    [
        {
            products: "Laptop,Smartphone",
            price: 1800,
            active: true,
        },
        {
            products: "T-shirt,Shampoo",
            price: 30,
            active: true,
        },
        {
            products: "Refrigerator,Smartphone,Soccer Ball",
            price: 1830,
            active: false,
        },
    ]
)


ordersCol.insertMany(
    [
        {
            offer: 1,
            quantity: 2,
            status: "pending",
        },
        {
            offer: 3,
            quantity: 1,
            status: "pending",
        },
    ]
)


const productsSchema = mongoose.Schema(
    {
        name: {type: String},
        category: {type: String},
        price: {type: Number},
        cost: {type: Number},
        stock: {type: Number},
        supplier: {type: mongoose.Schema.Types.ObjectId, ref: 'suppliers'},
    }
);

const offersSchema = mongoose.Schema(
    {
        products: {type: String},
        price: {type: Number},
        active: {type: Boolean},
    }
);

const suppliersSchema = mongoose.Schema(
    {
        name: {type: String},
        contact: {type: String},
        email: {type: String},
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

export{ productsModel, offersModel, suppliersModel, ordersModel };