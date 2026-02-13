import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import cookieParser from "cookie-parser";
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import router from './routes/adminRoutes.js';



//App Config
const app = express()

const port = process.env.PORT || 4000

//middlewares
app.use(cookieParser());
app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174","https://e-commerce-frontend-five-khaki.vercel.app
],
    credentials: true

  })
);


//connect database
connectDB();
connectCloudinary();

//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/admin', router
)

app.get('/', (req, res) => {
    res.send("API WORKING")
})

app.listen(port, () => console.log('Server started on PORT :' + port))
