var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
const firebase = require('../services/firebase');
const collectionId = "product";

module.exports = router;

router.use(asyncHandler(async function(req, res, next){
    const headers = req.headers;
    try{
        if(!firebase.verifyIdToken(headers.idtoken, headers.uid)){
            return res.json({status:"Access is prohibited"})
        }
        next();
    }catch(err){
        console.error('[Users API Middleware] : ${err}')
        return res.json({status:"Access is prohibited"})
    }
}));

router.get('/', asyncHandler( async (req, res, next) => {
    //Business Logic
    const products = await firebase.getCollection(collectionId)
    return res.json({
        products : products
    });
}));

router.post('/new', asyncHandler( async (req, res, next) => {
    //Business logic
    try{
        const payload = req.body; //Get Request Body
        const documentId = payload.productName;
        const status = await firebase.setDocument(collectionId, documentId, payload);
        return res.json({
            status: status
        });
    } catch( error ){
        console.error(error);
        return res.json({
            status: 500
        });
    }
}));

