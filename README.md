# Social Media App

This is a simple social media application that allows users to authenticate, create posts, and manage their profiles. The application uses the Noroff Social API for backend functionality and is built with HTML, CSS (using Tailwind), and JavaScript.

## Table of Contents

- [Project Setup](#project-setup)
- [Running the Application](#running-the-application)
- [Development Phases](#development-phases)
  - [Authentication Page](#1-authentication-page)
  - [Feed Page](#2-feed-page)
  - [Profile Page](#3-profile-page)
- [Styling](#styling)
- [Development and Build Scripts](#development-and-build-scripts)
- [Testing and Quality Assurance](#testing-and-quality-assurance)
- [Final Steps](#final-steps)

## Project Setup

1. **Create a GitHub Repository**
   - Initialize a new GitHub repository for the project.
   - Create and switch to a branch named `css-frameworks`.

2. **Set Up Project Structure**
   - Create the following folders and files:
     - `/index.html` - Authentication page
     - `/feed/index.html` - Feed page
     - `/profile/index.html` - Profile page
     - `/src/styles/` - Folder for SASS files
     - `/public/` - Folder for production-ready assets

3. **Initialize Node.js Project**
   - Run `npm init -y` to create `package.json`.
   - Add development and deployment scripts:
     - `dev` script for real-time updates during development.
     - `build` script to generate production-ready files.

4. **Install Dependencies**
   - Add your chosen CSS framework (Tailwind).
   - Install Tailwind CSS for custom styling.
   - Install other tools as needed for development (e.g., `watch`, `sass`, `postcss`).

## Running the Application

To run this application locally, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/social-media-app.git
   cd social-media-app
   ```

2. **Install Dependencies**
   Make sure you have Node.js and npm installed. Then run:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root of the project and add your API credentials:
   ```plaintext
   VITE_API_BASE_URL=https://v2.api.noroff.dev
   VITE_API_KEY=your_api_key_here
   ```

4. **Run the Development Server**
   Start the development server with:
   ```bash
   npm run dev
   ```

5. **Open the Application**
   Open your web browser and navigate to `http://localhost:3000` (or the port specified in your development server configuration).

## Development Phases

### 1. Authentication Page (`/index.html`)

- **Goal**: Create a login/registration form for user authentication.
- **Tasks**:
  - Design a form with fields for username and password.
  - Implement HTML form validation:
    - Password should require a minimum of 8 characters.
  - Use framework classes for styling (e.g., Bootstrap or Tailwind).

### 2. Feed Page (`/feed.html`)

- **Goal**: Develop a feed page with posts, search, and sorting features.
- **Tasks**:
  - Display a list of posts with thumbnails and brief descriptions.
  - Add a search bar at the top for filtering posts.
  - Include sorting options (e.g., by date or popularity).
  - Create a form for adding new posts with fields for title, description, and image upload.

### 3. Profile Page (`/profile.html`)

- **Goal**: Set up a user profile page with profile information and user posts.
- **Tasks**:
  - Design profile sections for:
    - Profile image and username display
    - Follow button
    - Follower/following count
    - User’s posts list

## Styling

1. **CSS Framework (Tailwind)**
   - Use framework classes for layout and responsive design on each page.
   - Ensure usability on mobile screens, including a mobile menu.


## Development and Build Scripts

- **Development**: Use the `dev` script to start a local server for real-time updates.
- **Build**: Use the `build` script to generate production-ready files.

## Testing and Quality Assurance

- Ensure all features are tested for functionality and usability.
- Perform cross-browser testing to ensure compatibility.

## Final Steps

- Review the code for any improvements or optimizations.
- Prepare the application for deployment.
