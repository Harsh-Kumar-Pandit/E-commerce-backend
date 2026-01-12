import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;
    //sees if the image is uploaded or not and stores in variable
    const image1 = req.files?.image1?.[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    //filtering images if not undefined
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    //storing in cloudinary

    const imageurl = [];

    for (const item of images) {
      const absolutePath = path.resolve(item.path);

      try {
        const result = await cloudinary.uploader.upload(absolutePath, {
          resource_type: "image",
        });
        imageurl.push(result.secure_url);
      } finally {
        // always delete local file
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      }
    }

    const productData = {
        name,
      description,
      price: Number(price),
      images: imageurl,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: req.body.bestseller === "true",
      date: Date.now()
    }
    

    const product = new productModel(productData);

    await product.save()

    res.json({success:true, message: "add product" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});

        res.status(200).json({
            success: true,
            message: "All Products",
            products
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
};
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)

        res.json({
            success:true,
            message: "Product removed"
        })
    } catch (error) {
        res.status(500).json({
      success: false,
      message: error.message,
    });
    }
};
const singleProduct = async (req, res) => {
    try {
         const { productId } = req.body
    const product = await productModel.findById(productId)
    res.json({
        success:true,
        product
    })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
   
};

export { addProduct, listProduct, removeProduct, singleProduct };
