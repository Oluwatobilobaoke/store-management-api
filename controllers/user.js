const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Product = require('../models/product')
const ErrorResponse = require('../utils/error-handler');
const Category = require('../models/category');

// Search Attendant by FirstName
exports.getAttendantByFirstName = asyncHandler(async (req, res, next) => {
    const { name } = req.query;

    const attendant = await User.find({
        $text: { $search: name },
        role: 'attendant',
    }).sort({
        name: 1,
    });
    res.status(200).json({ success: true, payload: attendant });
});

//Get all attendants
exports.getAllAttendant = asyncHandler(async (req, res, next) => {
    const attendants = await User.find({ role: 'attendant' });

    res.status(200).json({ success: true, payload: attendants });
});

//Get attendants by Id
exports.getAttendantById = asyncHandler(async (req, res, next) => {
    const attendant = await User.findById(req.params.attendantId);

    if (attendant.role !== 'attendant')
        return next(new ErrorResponse('user is not an attendant', 400));

    res.status(200).json({ success: true, payload: attendant });
});

//Deactivate Attendant
exports.deactivateAttendant = asyncHandler(async (req, res, next) => {
    const attendant = await User.findOneAndUpdate(
        { _id: req.params.attendantId, role: 'attendant' },
        { isActive: false },
        { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, payload: attendant });
});


// Admin making an Attendant an Admin
exports.makeAttendantAdmin = asyncHandler(async (req, res, next) => {
    const attendant = await User.findOneAndUpdate(
        { _id: req.params.attendantId, role: 'attendant' },
        { isAdmin: true },
        { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, payload: attendant });
});


// Creates a product
exports.createProduct = asyncHandler(async (req, res, next) => {

    const {title, price, description } = req.body;

    const cat = await Category.findById(req.params.categoryId);
    
    if (!cat) return next(new ErrorResponse('Invalid category provided', 404));
    
    //create the product
    const product = await Product.create({
        title,
        price,
        description,
        category: req.params.categoryId,
        userId: req.user._id,
    });

    res.status(201).json({
        success: true,
        payload: product
    })
})

// Get all Products in a category by id
exports.getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find({ category: req.params.categoryId }).populate(
        'category',
        '-_id -description -__v -createdAt'
    );

    res.status(200).json({ success: true, payload: products });
});

// Get a Product in a category by id
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findOne({
        _id: req.params.productId,
        category: req.params.categoryId,
    }).populate('category', '-_id -description -__v -createdAt');

    res.status(200).json({ succes: true, payload: product });
});

// Update a Product in a Category by Id
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { title, price, description } = req.body;

    const cat = await Category.findById(req.params.categoryId);
    if (!cat) return next(new ErrorResponse('Invalid category provided', 404));

    const fieldsToUpdate = {
        title,
        price,
        description,
    };
    const product = await Product.findByIdAndUpdate(
        req.params.productId,
        fieldsToUpdate,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(201).json({ success: true, message: "Product updated successfully", payload: product });
});

// Delete Product in a Category by id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const cat = await Category.findById(req.params.categoryId);
    if (!cat) return next(new ErrorResponse('Invalid category provided', 404));

    await Product.findByIdAndDelete(req.params.ProductId);

    res.status(200).json({ success: true, message: "Successfully deleted the Product", payload: {} });
});

//Search Products in a Category by name
exports.getProductsByName = asyncHandler(async (req, res, next) => {
    const { title } = req.query;
    const products = await product.find({ $text: { $search: title } }).sort({
        title: 1,
    });

    res.status(200).json({ success: true, payload: products });
});
