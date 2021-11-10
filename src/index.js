const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors');

//routes
const authRoutes = require("./routes/auth"); //signin, signup
const adminRoutes = require("./routes/admin/auth"); //admin signin, admin signup
const categoryRoutes = require("./routes/category"); //create categories
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const adminOrderRoute = require("./routes/admin/order.routes");


//environment varaibles
env.config()

//mongo connection
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(()=>{
    console.log('Database Connected')
})
mongoose.set('useFindAndModify', false);

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoute);



app.listen(process.env.PORT, ()=>{
    console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`);
})