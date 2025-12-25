# Deployment Guide

## Overview
This guide provides instructions for deploying the Customer Segmentation Analytics System in different environments.

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Production Deployment](#production-deployment)
4. [Environment Variables](#environment-variables)

---

## Local Development

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- Git

### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/Customer-Segmentation-Analytics-System.git
cd Customer-Segmentation-Analytics-System

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 4. Verify dependencies
python verify_requirements.py

# 5. Run the application
python app.py
```

The application will be available at `http://localhost:5000`

---

## Docker Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 1.29+

### Setup Steps

```bash
# 1. Build and run containers
docker-compose up -d

# 2. Verify running containers
docker-compose ps

# 3. View logs
docker-compose logs -f web

# 4. Stop containers
docker-compose down
```

The application will be available at `http://localhost:5000`

### Docker Commands

```bash
# Rebuild image
docker-compose build

# Run in foreground (see logs)
docker-compose up

# Run in background
docker-compose up -d

# Stop containers
docker-compose stop

# Remove containers and volumes
docker-compose down -v

# Access container shell
docker exec -it customer-segmentation-app bash
```

---

## Production Deployment

### Recommended Stack
- **Web Server**: Gunicorn or uWSGI
- **Reverse Proxy**: Nginx
- **Database**: PostgreSQL (optional, for future scaling)
- **Monitoring**: Prometheus + Grafana
- **Containerization**: Docker + Docker Compose

### Deployment Steps

#### Option 1: Using Gunicorn

```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn (4 workers)
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# With configuration file (gunicorn.conf.py)
gunicorn -c gunicorn.conf.py app:app
```

#### Option 2: Using Docker (Recommended)

```bash
# Update docker-compose.yml for production
# Set FLASK_ENV=production
# Set DEBUG=False
# Configure SSL/TLS

# Deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Nginx Configuration Example

```nginx
upstream app {
    server web:5000;
}

server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/ssl/certs/certificate.crt;
    ssl_certificate_key /etc/ssl/private/private.key;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Upload size limit
        client_max_body_size 16M;
    }

    location /static/ {
        alias /app/static/;
        expires 30d;
    }
}
```

### Security Checklist

- [ ] Change `SECRET_KEY` in `.env` to a strong random string
- [ ] Set `FLASK_ENV=production`
- [ ] Set `DEBUG=False`
- [ ] Use HTTPS/SSL certificates
- [ ] Set up firewall rules
- [ ] Configure rate limiting
- [ ] Enable CSRF protection
- [ ] Implement authentication if needed
- [ ] Set up logging and monitoring
- [ ] Regular security updates

### Environment Variables for Production

```
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=<generate-with-secrets.token_urlsafe(32)>
SERVER_HOST=0.0.0.0
SERVER_PORT=5000
LOG_LEVEL=WARNING
ENABLE_PROFILING=False
```

---

## Environment Variables

### Development
See `.env.example` or `.env` for available options:

```
FLASK_ENV=development
FLASK_DEBUG=True
SERVER_HOST=localhost
SERVER_PORT=5000
LOG_LEVEL=DEBUG
```

### Production
```
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=<strong-random-key>
SERVER_HOST=0.0.0.0
SERVER_PORT=5000
LOG_LEVEL=WARNING
MAX_UPLOAD_SIZE=16
```

---

## Monitoring & Logging

### Logs Location
- Development: `logs/app_YYYYMMDD.log`
- Docker: `docker-compose logs web`

### Health Check
```bash
curl http://localhost:5000/
```

### Performance Monitoring
Consider implementing:
- Application Performance Monitoring (APM) with New Relic or DataDog
- Error tracking with Sentry
- Log aggregation with ELK Stack or Splunk
- Metrics collection with Prometheus

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
# Linux/macOS:
lsof -i :5000

# Windows:
netstat -ano | findstr :5000

# Kill process
# Linux/macOS:
kill -9 <PID>

# Windows:
taskkill /PID <PID> /F
```

### Permission Denied (Docker)
```bash
# Add user to docker group
sudo usermod -aG docker $USER
```

### Out of Memory
- Reduce worker count in Gunicorn
- Implement caching
- Monitor data upload sizes

---

## Rollback Procedure

```bash
# Stop current deployment
docker-compose down

# Revert to previous version
git checkout <previous-version>

# Rebuild and restart
docker-compose up -d
```

---

## Support

For issues or questions, please:
1. Check the logs: `docker-compose logs web`
2. Review the README.md
3. Check API.md for endpoint documentation
4. Open an issue on GitHub
