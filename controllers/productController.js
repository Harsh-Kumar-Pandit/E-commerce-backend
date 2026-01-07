const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
        //sees if the image is uploaded or not and stores in variable
        const image1 = req.files?.image1?.[0];
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        console.log(name, description, price, category, subCategory, sizes, bestseller)
        console.log(image1, image2, image3, image4);
        res.json({message: "add product"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
};
const listProduct = async (req, res) => {};
const removeProduct = async (req, res) => {};
const singleProduct = async (req, res) => {};

export { addProduct, listProduct, removeProduct, singleProduct };
