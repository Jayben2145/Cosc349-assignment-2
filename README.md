# COSC349 Assignment 2 - Real Estate Website

## Introduction
This project is a real estate website designed to showcase properties and facilitate communication between potential buyers and the real estate agent (admin). The application allows the admin to:
- Upload and manage property listings with photos and locations.
- View and respond to contact forms submitted by users.

Users can:
- View available property listings.
- Submit contact forms for inquiries or requests (e.g., appraisals, assistance in finding a house based on specific requirements).

This website provides a centralized platform for the agent to display current properties for sale and manage client communications efficiently.

## Application Architecture
The application is structured with two core EC2 instances running Node.js web servers:
- **Admin Server**: Handles property management and views contact forms. Integrates with AWS Cognito for authentication.
- **User Front-End Server**: Displays property listings and provides contact forms for users.

Both servers interact with:
- **AWS RDS MySQL Database**: Stores data for properties and contact forms.
- **AWS Cognito**: Manages authentication for the admin site.

## Prerequisites
- AWS Account with permissions to create EC2 instances, RDS instances, and Cognito user pools.
- Google Cloud Console Account for Google Maps API.
- Google Maps API Key.

### Software Installed on EC2 Instances
- Node.js
- Git

## Deployment Instructions
### 1. Set Up EC2 Instances
#### Create EC2 Instances
- **Launch Instances**:
  - Name: Assign names (e.g., admin-server, user-server).
  - AMI: Select Ubuntu 64-bit x86.
  - Instance Type: Choose t2.micro.
  - Key Pair: Create or select an existing key pair.
- **Network Settings**:
  - Allow HTTP and HTTPS traffic.
  - Ensure both instances are on the same VPC (default VPC is acceptable).
- **Storage**: Leave at default (8 GiB, gp3).

#### Allocate Elastic IPs
- Navigate to **Elastic IPs** in the EC2 dashboard.
- Allocate new Elastic IP addresses for both instances.
- Associate each Elastic IP with the corresponding EC2 instance.

#### Configure EC2 Instances
For both instances:
- **Connect to the Instance**:
  ```sh
  ssh -i /path/to/your/key.pem ubuntu@your_elastic_ip
  ```

- **Update and Install Dependencies**:
  ```sh
  sudo apt-get update
  sudo apt-get install -y git nodejs npm iptables
  ```

- **Port Forwarding (if necessary)**:
  ```sh
  sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 4000
  ```

- **Clone the Repository**:
  ```sh
  git clone https://github.com/Jayben2145/Cosc349-assignment-2.git
  ```

- **Navigate to the Project Directory**:
  ```sh
  cd Cosc349-assignment-2
  ```

- **Create a .env File**:
  ```sh
  touch .env
  nano .env
  ```

- **Populate the .env File**:
  ```env
  GOOGLE_MAPS_API_KEY=your_google_api_key
  SECRET_KEY=your_secret_key
  DB_USER=your_db_username
  DB_PASSWORD=your_db_password
  DB_HOST=your_db_hostname
  DB_NAME=your_db_name
  ADMIN_PASSWORD_HASH=your_admin_password_hash (if used)
  SESSION_SECRET=your_session_secret
  NON_ADMIN_URL=http://your_user_server_ip
  ADMIN_URL=http://your_admin_server_ip
  COGNITO_USER_POOL_ID=your_cognito_user_pool_id
  COGNITO_CLIENT_ID=your_cognito_client_id
  COGNITO_CLIENT_SECRET=your_cognito_client_secret (if any)
  AWS_REGION=your_aws_region
  ```

- **Install Node.js Dependencies**:
  ```sh
  npm install
  ```

- **Start the Application**:
  - For the User Front-End Server:
    ```sh
    node app.js
    ```
  - For the Admin Server:
    ```sh
    node admin.js
    ```

### 2. Set Up AWS RDS MySQL Instance
#### Create RDS Instance
- **Go to the RDS dashboard** and create a new database.
- **Engine Options**: Choose MySQL.
- **Templates**: Select Free tier.
- **Settings**:
  - **DB Instance Identifier**: Provide a name.
  - **Master Username**: Set a username.
  - **Master Password**: Set a password.
- **Connectivity**:
  - Ensure it's in the same VPC as your EC2 instances.
  - Enable Public Accessibility if necessary.
- **Additional Configuration**:
  - **Initial Database Name**: Provide a database name.

#### Configure Security Group
- Modify the RDS instance's security group to allow inbound MySQL traffic (port 3306) from your EC2 instances.

#### Initialize the Database
- Connect to the RDS instance from one of your EC2 instances:
  ```sh
  mysql -h your_rds_endpoint -u your_db_username -p
  ```
- **Create Tables**: Run the SQL scripts provided in the SQLscripts directory of your repository to create the necessary tables.

### 3. Set Up AWS Cognito
#### Create a User Pool
- Navigate to the **Cognito dashboard** and create a new user pool.
- **Attributes**: Select Username for sign-in.
- **Password Policy**: Use default or customize as needed.
- **MFA and Verification**: Disable MFA and self-registration.
- **Email Settings**: Use Cognito's default email settings.
- **App Clients**: Create a new app client and enable all authentication flows. Note the App Client ID and Secret.
- **Create an Admin User**: In the user pool, create a new user for the admin. Set a temporary password and disable sending an invitation.

### 4. Obtain Google Maps API Key
- Sign in to the **Google Cloud Console**.
- Create a new project or select an existing one.
- Navigate to **APIs & Services > Credentials**.
- Create an API key.
- Enable the **Google Maps JavaScript API** for your project.

### 5. Update Security Groups
- Ensure the security groups for your EC2 instances allow inbound HTTP (port 80) and HTTPS (port 443) traffic.

## Usage Instructions
### User Front-End
- Access the user site at `http://your_user_server_ip`.
- Navigate through the property listings.
- Use the contact forms to send inquiries or requests.

### Admin Site
- Access the admin site at `http://your_admin_server_ip`.
- Log in using the Cognito admin user credentials.
- If it's the first login, you'll be prompted to change the temporary password.
- From the admin dashboard, you can:
  - Manage properties (add, edit, or hide listings).
  - View and manage contact forms submitted by users.

Note: The logout functionality may not be fully implemented.

## Development Setup
### Clone the Repository
```sh
git clone https://github.com/Jayben2145/Cosc349-assignment-2.git
```

### Install Dependencies
```sh
cd Cosc349-assignment-2
npm install
```

### Create a .env File
Follow the same steps as in the deployment instructions.

### Run the Application Locally
- **User site**:
  ```sh
  node app.js
  ```
- **Admin site**:
  ```sh
  node admin.js
  ```

### Access the Application
- **User site**: [http://localhost:4000](http://localhost:4000)
- **Admin site**: Adjust the port if necessary.

## Project Structure
- **app.js / admin.js**: Entry points for the user and admin servers.
- **routes/**: Contains all route handler files (`*.js`).
- **views/**: Contains all Pug templates for rendering HTML pages.
- **public/**: Contains static assets like photos, CSS files, and `scripts.js`.
- **models/**: Handles database models and interactions using Sequelize.
- **middleware/**: Custom middleware functions.
- **config/**: Configuration files for middleware and other settings.
- **SQLscripts/**: SQL scripts to create and initialize database tables.

## Notes
- **Authentication**: AWS Cognito is used for admin authentication.
- **Database Access**: The user site currently has read and write access to all tables, which should be restricted in a production environment.
- **Logout Functionality**: The logout route on the admin site may not be fully operational.
- **Security Considerations**: Ensure sensitive information (like API keys and passwords) is secured and not exposed in public repositories.

## License
This project is for educational purposes as part of the COSC349 assignment.

## Contact Information
For any questions or issues, please contact:
- **Name**: Your Name
- **Email**: your.email@example.com

## Acknowledgments
- **Friend's Requirements**: The project is based on guidelines provided by a friend needing a real estate website.
- **Open-Source Libraries**: Thank you to the maintainers of the Node.js packages and AWS services used in this project.

> Please replace placeholder texts (e.g., `your_google_api_key`, `your_db_username`) with your actual credentials or instructions on where to obtain them.
