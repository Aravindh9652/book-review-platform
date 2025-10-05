# 🚀 Book Review Platform - Deployment Guide

## 📋 **Deployment Links**

### **Backend API Deployment**
- **Platform**: Railway
- **Status**: Ready for deployment
- **Repository**: https://github.com/Aravindh9652/book-review-platform

### **Frontend Deployment**
- **Platform**: Vercel
- **Status**: Ready for deployment
- **Repository**: https://github.com/Aravindh9652/book-review-platform

## 🛠️ **Deployment Steps**

### **Backend Deployment (Railway)**

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose**: `Aravindh9652/book-review-platform`
6. **Set Root Directory**: `backend`
7. **Deploy!**

**Environment Variables to set in Railway:**
```
PORT=5000
JWT_SECRET=book-review-platform-super-secret-jwt-key-2024
NODE_ENV=production
```

### **Frontend Deployment (Vercel)**

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import**: `Aravindh9652/book-review-platform`
5. **Set Root Directory**: `frontend`
6. **Add Environment Variable**:
   - `REACT_APP_API_URL` = `https://your-railway-backend-url.railway.app/api`
7. **Deploy!**

## 🔗 **After Deployment**

### **Backend API URL**
```
https://your-project-name.railway.app
```

### **Frontend URL**
```
https://your-project-name.vercel.app
```

## ✅ **Testing**

1. **Visit Frontend URL**
2. **Register/Login**
3. **Add books**
4. **Test all features**

## 📝 **Notes**

- Backend uses in-memory database (data resets on restart)
- For production, consider using MongoDB Atlas
- All features work in deployed version
- JWT authentication works across domains
