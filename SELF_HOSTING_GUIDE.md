# IMPRO - HR Information System: Self-Hosting Guide (LAN with NGINX)

This guide provides instructions on how to self-host the IMPRO HR Information System on a Local Area Network (LAN) using NGINX as a reverse proxy. This setup is ideal for internal company use where the application needs to be accessible to employees within the local network.

## Table of Contents
1.  [Prerequisites](#1-prerequisites)
2.  [Server Setup](#2-server-setup)
3.  [Application Deployment](#3-application-deployment)
4.  [NGINX Configuration](#4-nginx-configuration)
5.  [Testing and Access](#5-testing-and-access)
6.  [Troubleshooting](#6-troubleshooting)

## 1. Prerequisites

Before you begin, ensure you have the following:

-   **A Server Machine:** A dedicated machine (physical or virtual) within your LAN to host the application. This server should have:
    -   **Operating System:** Ubuntu Server (recommended) or any other Linux distribution.
    -   **Node.js (v18.x or higher):** Installed on the server.
    -   **npm or Yarn:** Installed on the server.
    -   **Git:** Installed on the server.
    -   **NGINX:** Installed on the server.
-   **Static IP Address:** The server should have a static IP address within your LAN (e.g., `192.168.1.100`).
-   **SSH Access:** Ability to connect to the server via SSH.
-   **Firewall Configuration:** Basic understanding of firewall rules (e.g., `ufw` on Ubuntu).

## 2. Server Setup

### 2.1. Connect to Your Server

Use SSH to connect to your server machine:

```bash
ssh user@your_server_ip
```
Replace `user` with your username and `your_server_ip` with the server's static IP address.

### 2.2. Install Node.js and npm

If Node.js and npm are not already installed, follow these steps (for Ubuntu):

```bash
sudo apt update
sudo apt install curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
Verify installation:

```bash
node -v
npm -v
```

### 2.3. Install NGINX

NGINX will act as a reverse proxy, forwarding requests from your network to the Next.js application.

```bash
sudo apt install nginx
```

Start NGINX and enable it to start on boot:

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.4. Configure Firewall

Allow HTTP and HTTPS traffic through your firewall:

```bash
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'
sudo ufw enable
```

## 3. Application Deployment

### 3.1. Transfer Project Files

Transfer your `combined-payroll-project` folder to the server. You can use `scp` or `git clone`.

**Option A: Using `scp` (if you have the zip file locally)**

From your local machine:

```bash
scp /path/to/combined-payroll-system-final-enhanced.zip user@your_server_ip:/home/user/
```

Then, on the server:

```bash
unzip combined-payroll-system-final-enhanced.zip
mv combined-payroll-project /var/www/impro-hris # Or your preferred directory
cd /var/www/impro-hris
```

**Option B: Using `git clone` (if your project is in a Git repository)**

On the server:

```bash
cd /var/www/
sudo git clone <your-repository-url> impro-hris
cd impro-hris
```

### 3.2. Install Dependencies and Build

Navigate to your project directory on the server and install dependencies, then build the Next.js application for production.

```bash
cd /var/www/impro-hris
npm install
npm run build
```

### 3.3. Configure Environment Variables

Create a `.env.local` file in the root of your project (`/var/www/impro-hris/.env.local`) with the following:

```env
NEXTAUTH_SECRET="your_super_secret_key_here" # Generate a strong, random string
NEXTAUTH_URL="http://your_server_ip" # Use your server's LAN IP or domain
DATABASE_URL="file:./database.sqlite"
NODE_ENV=production
```

**Explanation of `NODE_ENV=production`:**
This environment variable tells Next.js to run in production mode. In production mode, Next.js optimizes the application for performance, disables development-only features, and provides a more stable and secure environment.

### 3.4. Database Setup

Ensure your database is set up and seeded. If you transferred the `database.sqlite` file, it should be ready. Otherwise, run:

```bash
npm run db:generate
npm run db:push
npm run db:seed # Optional, if you want example data
```

### 3.5. Start the Application in Production Mode

Use a process manager like `PM2` to keep your Next.js application running continuously in the background. Install PM2 globally:

```bash
sudo npm install -g pm2
```

Start your application with PM2:

```bash
pm2 start npm --name 


"`impro-hris`" -- run start
```

This command starts your Next.js application in production mode using `npm run start` (which Next.js uses for production builds) and names the PM2 process `impro-hris`.

To ensure PM2 starts your application on server reboot:

```bash
pm2 startup systemd
pm2 save
```

## 4. NGINX Configuration

NGINX will act as a reverse proxy, directing incoming web requests to your running Next.js application.

### 4.1. Create NGINX Configuration File

Create a new NGINX configuration file for your application:

```bash
sudo nano /etc/nginx/sites-available/impro-hris
```

Add the following content to the file. Replace `your_server_ip` with your server's actual LAN IP address.

```nginx
server {
    listen 80;
    server_name your_server_ip;

    location / {
        proxy_pass http://localhost:3000; # Or the port your Next.js app is running on (e.g., 3001, 3002)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Explanation of NGINX Directives:**

-   `listen 80;`: NGINX listens for incoming HTTP requests on port 80.
-   `server_name your_server_ip;`: Specifies the domain name or IP address that this server block should respond to. Use your server's LAN IP.
-   `location / { ... }`: Defines how NGINX should handle requests for the root URL (`/`).
-   `proxy_pass http://localhost:3000;`: This is the core of the reverse proxy. It forwards all requests to the Next.js application running on `localhost:3000` (or whatever port your app is actually using).
-   `proxy_set_header ...`: These directives are crucial for passing original client information (like IP address, host, and protocol) to the Next.js application, which is important for features like authentication and logging.

### 4.2. Enable the NGINX Configuration

Create a symbolic link from `sites-available` to `sites-enabled` to activate your configuration:

```bash
sudo ln -s /etc/nginx/sites-available/impro-hris /etc/nginx/sites-enabled/
```

Remove the default NGINX configuration file to avoid conflicts:

```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 4.3. Test NGINX Configuration and Restart

Test your NGINX configuration for syntax errors:

```bash
sudo nginx -t
```

If the test is successful, restart NGINX to apply the changes:

```bash
sudo systemctl restart nginx
```

## 5. Testing and Access

Once NGINX is configured and your Next.js application is running via PM2, you should be able to access the application from any device on your LAN by navigating to your server's IP address in a web browser (e.g., `http://192.168.1.100`).

## 6. Troubleshooting

-   **Application Not Accessible:**
    -   Check if the Next.js application is running using `pm2 list`.
    -   Verify NGINX status with `sudo systemctl status nginx`.
    -   Check NGINX error logs: `sudo tail -f /var/log/nginx/error.log`.
    -   Ensure firewall rules are correct (`sudo ufw status`).
    -   Confirm `NEXTAUTH_URL` in `.env.local` matches your server's IP or domain.
-   **502 Bad Gateway Error:** This usually means NGINX can't connect to your Next.js application. Double-check the `proxy_pass` URL in your NGINX configuration and ensure your Next.js app is running on the correct port.
-   **Permissions Issues:** Ensure the user running the Next.js application (e.g., `www-data` or your SSH user) has read/write access to the project directory and the `database.sqlite` file.

This guide should help you successfully deploy and host the IMPRO HR Information System on your local network. For further customization or advanced NGINX configurations (e.g., SSL/HTTPS), consult the official NGINX documentation.

