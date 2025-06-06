const Campground = require('../models/campground');
const { cloudinary }= require("../cloudinary"); 
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req,res) => {
    const campgrounds= await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm= (req,res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground= async (req,res,next) => {
    
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    
    
  // In your createCampground function
campground.images = req.files.map(f => ({ 
    url: f.path,
    filename: f.filename 
}));
    campground.author= req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampgrounds = async (req,res) => {
    const { id }= req.params;
    const campground= await Campground.findById(id).populate(
        {path: 'reviews',
        populate:{ path: 'author' },
        }).populate('author');
        console.log('Campground found:', !!campground);
        console.log('Images array length:', campground?.images?.length);
        console.log('Images data:', campground?.images);
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground  });
}

module.exports.renderEditCampground = async (req,res) => {
    const { id } = req.params;
    const campground= await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', { campground });  
}

module.exports.updateCampground = async (req,res) => {
    const { id } = req.params;
    const campground= await Campground.findById(id);
    campground.set({...req.body.campground}) ;   
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0]?.geometry || campground.geometry;

    if (req.files.length > 0) {
        const imgs = req.files.map(f => ({ 
            url: f.path, 
            filename: f.filename 
        }));
        campground.images.push(...imgs);
    }
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
    await campground.updateOne({$pull: { images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully updated the campground!'); 
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req,res) => {
    const { id }= req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
};