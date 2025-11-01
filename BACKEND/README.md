# Backend - Food Delivery Admin Panel

## Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Start MongoDB (default URI used: mongodb://localhost:27017/food_admin_panel)
3. Run server:
   ```bash
   npm run dev
   ```

## Logging
- Winston used for logging with files at /backend/logs/*.log
- Request logger middleware logs ip, email_id (if provided in body or x-user-email header), method, route, status, body, and duration.
