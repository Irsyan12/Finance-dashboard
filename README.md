# 💰 Finance Dashboard

A modern, beautiful, and feature-rich personal finance management application built with Vue 3, Supabase, and Tailwind CSS. Track your income, expenses, and financial goals with stunning glassmorphism UI design.

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

### 🎯 Core Functionality

- **💸 Transaction Management** - Add, edit, delete income and expense transactions
- **📊 Financial Analytics** - View detailed summaries and insights
- **🏷️ Category Management** - Organize transactions with custom categories
- **📅 Date Filtering** - Filter transactions by periods (week, month, quarter, year)
- **📈 Real-time Calculations** - Automatic balance, income, and expense calculations

### 🎨 Modern UI/UX

- **🌟 Glassmorphism Design** - Beautiful glass-like interface with backdrop blur effects
- **🌙 Dark Theme** - Elegant dark mode with gradient backgrounds
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **⚡ Smooth Animations** - Subtle transitions and hover effects
- **🎪 Interactive Elements** - Engaging user interactions with visual feedback

### 🔧 Technical Features

- **🔐 Secure Authentication** - Google OAuth integration via Supabase Auth
- **💾 Smart Caching** - Intelligent data caching for optimal performance
- **⚡ Real-time Updates** - Instant UI updates with optimistic updates
- **🛡️ Input Validation** - Comprehensive form validation and error handling
- **📋 Toast Notifications** - User-friendly feedback system

## 🚀 Live Demo

**[View Live Demo](https://finance-app.irsyanramadhan.my.id/login)**

### Dashboard Overview

Beautiful glassmorphism cards showing your financial overview with real-time calculations.

### Transaction Management

Modern form interfaces for adding and editing transactions with smart validation.

### Financial Analytics

Comprehensive charts and insights to understand your spending patterns.

## 🛠️ Tech Stack

### Frontend

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Heroicons** - Beautiful hand-crafted SVG icons

### Backend & Database

- **Supabase** - Open-source Firebase alternative
- **PostgreSQL** - Robust relational database via Supabase
- **Row Level Security** - Secure data access with Supabase RLS

### State Management & Utils

- **Pinia** - Intuitive Vue store for state management
- **Vue Router** - Official router for Vue.js applications
- **Date formatting** - Custom date utilities for financial data

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── icons/          # Custom SVG icon components
│   ├── modal/          # Modal components
│   ├── ui/             # UI components (buttons, inputs, etc.)
│   └── View/           # View-specific components
├── composables/        # Vue composition functions
├── views/              # Page components
├── stores/             # Pinia stores
├── services/           # API services and Supabase client
├── utils/              # Utility functions
├── router/             # Vue Router configuration
└── constants/          # Application constants
```

## 🎯 Key Features Explained

### Smart Caching System

- Reduces API calls by caching frequently accessed data
- Automatic cache invalidation on data mutations
- Per-user cache isolation for security

### Glassmorphism Design

- Modern glass-like UI with backdrop blur effects
- Gradient backgrounds and smooth animations
- Consistent design language throughout the app

### Responsive Finance Management

- Mobile-first design approach
- Touch-friendly interactions for mobile devices
- Adaptive layouts for all screen sizes

## 🚀 Deployment

### Deploy to Vercel

1. **Connect to GitHub**

   - Push your code to GitHub repository
   - Connect Vercel to your GitHub account

2. **Configure Environment Variables**

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Update Supabase Settings**
   - Set Site URL to your Vercel domain
   - Add Vercel domain to redirect URLs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Made with ❤️ using Vue 3, Supabase, and Tailwind CSS**
