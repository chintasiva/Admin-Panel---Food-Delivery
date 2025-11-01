# Food Delivery Admin Panel (Full-stack)

This repository contains a minimal full-stack admin panel (backend + frontend) to manage users, categories, products and orders.

## Structure
- /backend - Node.js + Express + Mongoose API
- /frontend - React minimal admin interface

## Quick start
1. Start MongoDB locally.
2. Run backend:
   cd backend
   npm install
   npm run dev
3. Run frontend:
   cd frontend
   npm install
   npm run dev

The backend provides logging (winston) and a request logger that logs ip, email (if provided), method, route, status, body and duration.

