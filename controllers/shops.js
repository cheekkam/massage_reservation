//@desc     Get all Shops
//@route    GET /api/v1/Shops

const Shop = require("../models/Shop");

//@access   Public
exports.getShops= async (req,res,next)=>{
    try{
        let query;
        // Copy req.query
        const reqQuery = {...req.query};
        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];
        // Loop over remove fields and delete them from reqQuery
        removeFields.forEach(param=>delete reqQuery[param]);

        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

        query = Shop.find(JSON.parse(queryStr)).populate('appointments');
        const shops = await query;
        
        // Select fields
        if (req.query.select){
            const fields=req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort){
            const sortBy=req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('createdAt');
        }
        
        // Pagination
        const page = parseInt(req.query.page,10) || 1;
        const limit = parseInt(req.query.limit,10) || 25;
        const startindex = (page-1)*limit;
        const endIndex = page*limit;
        const total = await Shop.countDocuments();
        query = query.skip(startindex).limit(limit);

        // Pagination result
        const pagination = {};
        if (endIndex<total) {
            pagination.next={
                page: page+1,
                limit
            }
        }
        if (startindex>0) {
            pagination.prev={
                page: page-1,
                limit
            }
        }
        res.status(200).json({success:true, count:shops.length, data:shops});

    } catch(err) {
        res.status(400).json({success:false});
    }
};

//@desc     Get single Shops
//@route    GET /api/v1/Shops/:id
//@access   Public
exports.getShop=async (req,res,next)=>{
    try{
        const shop = await Shop.findById(req.params.id);
        if(!shop) {
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:shop});
    } catch(err) {
        res.status(400).json({success:false});
    }
};

//@desc     Update Shop
//@route    PUT /api/v1/Shops/:id
//@access   Private
exports.updateShop= async (req,res,next)=>{
    try{
        const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        });
        if(!shop) {
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:shop});
    } catch(err) {
        res.status(400).json({success:false});
    }
};