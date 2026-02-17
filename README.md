# Employee Management Backoffice

Employee Management Backoffice is a web application designed to manage employee records efficiently.  
It provides features such as authentication, employee listing, adding new employees, and viewing detailed employee information.

The project is built with **Angular** and follows a clean, responsive UI approach.

---

## Project Overview

This application helps users manage employee data through a simple backoffice interface, including:

- Login authentication.
- Dashboard.
- Employee list management.
- Employee creation form.
- Employee detail view with formatted information.

--- 

## Tech Stack

- **Angular**
- **Typescript**
- **TailwindCSS**
- **NgRx** (State Management)
- **MSW (Mock Service Worker)** for mock API simulation
- **Dexie IndexedDB** for local dummy database storage

---

## Employee Data Structure

Employe attributes used in the application:

```json
{
  "employee": {
    "username": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "birthDate": "datetime",
    "basicSalary": "double",
    "status": "string",
    "group": "string",
    "description": "string"
  }
}
```

--- 

## Applicatyion Page

The application consists of the following main pages:

### 1. Login Page

Features:

- Username and password input fields.
- Login button with validation.
- Dummy authentication for demonstration purposes.

### 2. Employee List Page

Displays employee records with management tools.

Features:

- Shows a list of employees (dummy dataset).
- Pagination support.
- Sorting functionality.
- Search filtering with multiple parameters (AND rule).
- Page size selector.
- Action buttons:
  - Edit (dummy).
  - Delete (dummy).
- Action Notifications:
  - Edit -> Yellow alert.
  - Delete -> Red alert.

### 3. Add Employee Page

Form page for creating a new employee record.

Features:

- All fields are required.
- Input validations:
  - BirthDate uses a datepicker (cannot exceed today).
  - Email must be valid.
  - Basic salary must be numeric.
- Group selection dropdown with searchable options
  - Contains at least 10 predefined groups.

Buttons:
  - **Save** -> stores employee data.
  - **Cancel** -> navigates back to the employee list.

### 4. Employee Detail Page

Displays complete employee information.

Features:

- shows all employee attributes.
- Salary formatting example:

```
Rp 10.000.000
```

- **OK Button** navigates back to the employee list page.
- **Search/filter** state remains preserved when returning.

---

## Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Sandydht/employee-management-backoffice.git
cd employee-management-backoffice
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
ng serve 
```

The application will be available at: [http://localhost:4200](http://localhost:4200)

--- 

## Demo Login Credentials

```
Username: user1
Password: password123
```

---

## Notes 
- The project uses mock data and simulated API requests.
- No backend service is required.
- Designed with clean UI and responsive layout principles.