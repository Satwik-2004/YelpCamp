# YelpCamp


YelpCamp is a comprehensive web application that allows users to discover, review, and create campgrounds. Think of it as a "Yelp for camping" where outdoor enthusiasts can share their favorite camping spots and experiences.

## Live Demo

[View the application live](https://yelpcamp-0swd.onrender.com)

## Features

- **User Authentication**: Secure login/registration system with password protection
- **Campground Management**: Create, view, edit, and delete campgrounds
- **User Reviews**: Leave and manage reviews for campgrounds
- **Interactive Maps**: Integrated map displays with location markers
- **Image Management**: Upload and display multiple images for each campground
- **Responsive Design**: Mobile-friendly interface for on-the-go access
- **Flash Messages**: Informative notifications for user actions
- **Authorization**: Proper permission control for user-specific actions

## Tech Stack

### Frontend
- EJS (Embedded JavaScript templates)
- Bootstrap 5
- CSS3
- JavaScript
- MapTiler API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js (Authentication)
- JOI (Validation)
- Cloudinary (Image storage)
- Helmet (Security)

## Installation

To run YelpCamp locally, follow these steps:

1. Clone the repository:
```
git clone https://github.com/Satwik-2004/YelpCamp.git
```

2. Navigate to the project directory:
```
cd YelpCamp
```

3. Install dependencies:
```
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
MAPBOX_TOKEN=your_mapbox_token
DB_URL=your_mongodb_connection_string
SECRET=your_session_secret
```

5. Start the application:
```
npm start
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Architecture

The application follows the MVC (Model-View-Controller) architecture:

- **Models**: MongoDB schemas for Campground, User, and Review
- **Views**: EJS templates for rendering pages
- **Controllers**: Logic for handling requests and responses
- **Routes**: Express routes for different endpoints
- **Middleware**: Custom middleware for authentication, error handling, etc.

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | / | Landing page |
| GET | /campgrounds | Display all campgrounds |
| POST | /campgrounds | Create a new campground |
| GET | /campgrounds/new | Form to create a new campground |
| GET | /campgrounds/:id | Show details of a specific campground |
| PUT | /campgrounds/:id | Update a specific campground |
| DELETE | /campgrounds/:id | Delete a specific campground |
| GET | /campgrounds/:id/edit | Form to edit a campground |
| POST | /campgrounds/:id/reviews | Create a review for a campground |
| DELETE | /campgrounds/:id/reviews/:reviewId | Delete a review |
| GET | /register | User registration form |
| POST | /register | Register a new user |
| GET | /login | User login form |
| POST | /login | Log in a user |
| GET | /logout | Log out a user |

## Acknowledgements

This project was developed as part of [Colt Steele's Web Developer Bootcamp](https://www.udemy.com/course/the-web-developer-bootcamp/), with personal modifications and improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[Satwik](https://github.com/Satwik-2004)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
