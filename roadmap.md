# Roadmap for Social Media App Project

This roadmap outlines the steps for developing a basic social media app with authentication, a feed, and a profile page. The project will use a CSS framework (Tailwind or Bootstrap) and SASS for styling.

## Table of Contents
- [Project Setup](#project-setup)
- [Development Phases](#development-phases)
  - [Authentication Page](#1-authentication-page--indexhtml-)
  - [Feed Page](#2-feed-page--feedindexhtml-)
  - [Profile Page](#3-profile-page--profileindexhtml-)
- [Styling](#styling)
- [Development and Build Scripts](#development-and-build-scripts)
- [Testing and Quality Assurance](#testing-and-quality-assurance)
- [Final Steps](#final-steps)

---

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
   - Install tailwindcss for custom styling.
   - Install other tools as needed for development (e.g., `watch`, `sass`, `postcss`).

---

## Development Phases

### 1. Authentication Page ( `/index.html` )

- **Goal**: Create a login/registration form for user authentication.
- **Tasks**:
  - Design a form with fields for username and password.
  - Implement HTML form validation:
    - Password should require a minimum of 8 characters.
  - Set the form’s `action` attribute to `/profile`.
  - Use framework classes for styling (e.g., Bootstrap or Tailwind).
  - Add custom styling as necessary.

### 2. Feed Page ( `/feed/index.html` )

- **Goal**: Develop a feed page with posts, search, and sorting features.
- **Tasks**:
  - Display a list of posts with thumbnails and brief descriptions.
  - Add a search bar at the top for filtering posts.
  - Include sorting options (e.g., by date or popularity).
  - Create a form for adding new posts with fields for title, description, and image upload.
  - Apply CSS framework styling and custom SASS.

### 3. Profile Page ( `/profile/index.html` )

- **Goal**: Set up a user profile page with profile information and user posts.
- **Tasks**:
  - Design profile sections for:
    - Profile image and username display
    - Follow button
    - Follower/following count
    - User’s posts list
  - Style using the selected CSS framework and add SASS customizations.

---

## Styling

1. **CSS Framework (Tailwind or Bootstrap)**
   - Use framework classes for layout and responsive design on each page.
   - Ensure usability on mobile screens, including a mobile menu.

2. **SASS Customization**
   - Organize SASS files into components (e.g., `auth.scss`, `feed.scss`, `profile.scss`).
   - Utilize SASS features like variables, nesting, and mixins for modular, maintainable styling.

---

## Development and Build Scripts

1. **Development Script**
   - Add a `dev` script in `package.json` for real-time updates during development.
   - Example: `"dev": "sass --watch src/styles:public/css"`

2. **Deployment Script**
   - Set up a `build` script for generating production-ready files.
   - Minify CSS and assets for optimal performance.
   - Example: `"build": "sass src/styles:public/css --style compressed"`

---

## Testing and Quality Assurance

1. **HTML & CSS Validation**
   - Ensure all HTML and CSS follow standards.
   - Check for accessibility, particularly in forms and buttons.

2. **Cross-Browser and Device Testing**
   - Test on major browsers (Chrome, Firefox, Safari) and different device screen sizes.

---

## Final Steps

1. **Commit and Push Changes**
   - Commit all changes and push to the `css-frameworks` branch on GitHub.
   - Confirm the final project is organized and ready for review.

2. **Documentation**
   - Add a `README.md` with setup instructions, project details, and usage notes.
   - Document styling decisions or framework customizations if relevant.

3. **Deployment**
   - Deploy the app to a hosting platform (e.g., GitHub Pages, Netlify, or Vercel).

---

This roadmap serves as a checklist and timeline for project completion. Follow each phase to ensure a structured and organized development process.
