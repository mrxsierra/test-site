# Test Management Site

This is a demo Vanilla JavaScript application for managing tests. It provides the following features:

## Live Demo

![Live Project](https://mrxsierra.github.io/test-site/)

## Features
- **Test Management**: Create, manage, update, and delete tests.
- **Test Taking**: Take tests with a specified duration.
- **Results and History**: View test results and history.
- **User Management**: Login, logout, and change passwords.
- **Demo Data**: Load demo data from the sidebar menu. If no tests exist, a button will appear to load demo data.
- **Dashboard**: View various statistics on the dashboard.

## Technical Details
- **Frontend**:
  - **HTML**: Modular structure with reusable components like `sidebar.html`, `topnav.html`, and `profile.html`.
  - **CSS**: Custom styles defined in `styles/css/styles.css` with support for light and dark themes.
  - **JavaScript**: Dynamic UI updates and functionality implemented in modular files under `js/`.
- **Data Storage**: Uses `localStorage` and `sessionStorage` for storing user profiles, test data, and results.
- **Libraries**:
  - **Bootstrap**: For responsive design and UI components.
  - **Plotly.js**: For rendering charts on the dashboard.
  - **PapaParse** and **XLSX.js**: For parsing CSV and Excel files.

## Folder Structure
- **HTML Assets (`html_assets/`)**:
  - `sidebar.html`: Sidebar navigation for the application.
  - `topnav.html`: Top navigation bar with theme toggle and login/logout buttons.
  - `profile.html`: User profile section with options to view tests and results.
  - `pass_change.html`: Password change form.
  - `register.html`: Login and registration forms.
  - `select_tt.html`: Test selection and duration setup form.

- **JavaScript (`js/`)**:
  - `main.js`: Initializes the application, including sidebar, top navigation, and theme toggle.
  - `index_content.js`: Handles the dynamic content for the homepage.
  - `dashboard_content.js`: Manages the dashboard, including statistics and charts.
  - `results_content.js`: Displays user results in a table format.
  - `tests_content.js`: Handles test creation, reading, updating, and deletion.
  - `toggle_theme.js`: Manages light and dark theme toggling.
  - **Utility Scripts (`utility/`)**:
    - `file_handle.js`: Handles file uploads, test data parsing, and localStorage operations.
    - `login.js`: Manages user authentication and profile operations.
    - `test_taker.js`: Implements the test-taking functionality with timer and anomaly detection.
    - `data.js`: Contains sample test data.
    - `temp_data.js`: Defines classes for `Test`, `Question`, and `Tests`.
    - `temp_profile.js`: Defines classes for `User`, `Profiles`, and `Result`.
    - `load.js`: Loads demo data into the application.

- **CSS (`styles/css/`)**:
  - `styles.css`: Contains all styles for the application, including responsive design and theme support.

- **HTML Pages**:
  - `index.html`: Homepage with a welcome message and profile section.
  - `dashboard.html`: Admin dashboard with statistics and charts.
  - `tests.html`: Test management page for creating, updating, and deleting tests.
  - `results.html`: Results page for viewing test results.

## Key Functionalities
1. **Test Management**:
   - Upload tests via CSV/Excel files.
   - Add, update, and delete tests dynamically.
   - View test details and questions.

2. **Test Taking**:
   - Select a test and set a duration.
   - Answer questions with a timer and anomaly detection (e.g., tab switching).

3. **User Management**:
   - Register and log in users.
   - Change passwords.
   - View user-specific results and logs.

4. **Dashboard**:
   - View statistics like total tests, users, tests taken, and anomalies.
   - Visualize data using charts.

5. **Demo Data**:
   - Load sample test data for demonstration purposes.

## Notes
- This is a demo application for test management purposes.
- The application is designed to showcase basic functionality and is not intended for production use.
