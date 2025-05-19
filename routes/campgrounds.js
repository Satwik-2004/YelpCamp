const express= require('express');
const router= express.Router();
const catchAsync= require('../utils/catchAsync');
const Campground = require('../models/campground');
const { storage } = require('../cloudinary');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds= require('../controllers/campgrounds');
const multer= require('multer');
const sharp = require('sharp');
const memoryStorage = multer.memoryStorage();

const convertAvifToJpg = async (req, res, next) => {
    if (!req.files) return next();

    await Promise.all(req.files.map(async (file) => {
        if (file.mimetype === 'image/avif') {
            const convertedBuffer = await sharp(file.buffer).jpeg().toBuffer();
            file.buffer = convertedBuffer;
            file.mimetype = 'image/jpeg';
            file.originalname = file.originalname.replace(/\.avif$/, '.jpg');
        }
    }));

    next();
};

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/avif'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
};

const upload= multer({ storage: memoryStorage,fileFilter });

router.route('/')
     .get(catchAsync( campgrounds.index ))
     .post( isLoggedIn , upload.array('image') , convertAvifToJpg ,validateCampground, catchAsync( campgrounds.createCampground))    
    

    router.get('/new', isLoggedIn , campgrounds.renderNewForm);


router.route('/:id')
    .get( catchAsync( campgrounds.showCampgrounds))
    .put( isLoggedIn, isAuthor , upload.array('image') , validateCampground  ,catchAsync( campgrounds.updateCampground))
    .delete( isLoggedIn, isAuthor ,catchAsync( campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor , catchAsync( campgrounds.renderEditCampground));    


module.exports= router;