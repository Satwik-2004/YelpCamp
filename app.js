if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}



const express= require('express');
const mongoose= require('mongoose');
const path= require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash= require('connect-flash');
const methodOverride= require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError= require('./utils/ExpressError');
const passport= require('passport');
const localStrategy= require('passport-local'); 
const User= require('./models/user');
const mongoSanitize= require('express-mongo-sanitize'); 
const helmet= require('helmet');

const Campground = require('./models/camground');
const Review = require('./models/review');


const campgroundRoutes= require('./routes/campgrounds');
const reviewRoutes= require('./routes/reviews');
const userRoutes= require('./routes/users');

const dbUrl=process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp_camp';
//  const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));
const db= mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database Connected');
});

const app=express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true }));
app.use(methodOverride('_method')); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret= process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
const sessionConfig= {
    store,
    name: 'Session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        //secure: true,
        expires: Date.now() + (1000*3600*24*7),
        maxAge: 1000*3600*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", 
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", 
];
const connectSrcUrls = [
    "https://api.maptiler.com/", 
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dhzyemopo/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // Pass the user from the session to all templates
  res.locals.currentUser = req.user;
  next();
});



app.use((req,res,next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req,res) => {
    res.render('home');
})


app.all('*', (req,res,next) => {
    next(new ExpressError('Page not Found! ', 404));
})

app.use((err,req,res,next) => {
    const { statusCode=500 } = err;
    if(!err.message) err.message= 'OH NO! Something went wrong!'
    res.status(statusCode).render('error', { err });
})
const port = process.env.PORT || 3000
app.listen(3000, ()=>{
    console.log(`Yelp at port ${port}`);
})