# Quick Start Guide - Landing Page

Get your Customer Segmentation Analytics landing page up and running in minutes!

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git (for version control)
- Modern web browser

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/jesus-justin/Customer-Segmentation-Analytics-System.git
cd Customer-Segmentation-Analytics-System
```

### Step 2: Install Dependencies

```bash
pip install -r config/requirements.txt
```

### Step 3: Start the Application

```bash
cd src
python app.py
```

### Step 4: Access the Landing Page

Open your browser and navigate to:
```
http://localhost:5000
```

You should see the professional landing page!

## Quick Navigation

- **Landing Page**: `http://localhost:5000/`
- **Analytics Dashboard**: `http://localhost:5000/analytics`
- **Results Page**: After processing data

## Making Changes

### Update Landing Page Content

Edit `templates/home.html`:
```html
<!-- Hero Section -->
<h1 class="hero-title">
    Transform Customer Data Into
    <span class="gradient-text">Your Custom Text</span>
</h1>
```

### Customize Colors

Edit `static/css/landing.css`:
```css
:root {
    --primary-color: #2563eb;  /* Change to your brand color */
    --primary-light: #60a5fa;
    --primary-dark: #1e40af;
}
```

### Add New Features

1. Edit HTML in `templates/home.html`
2. Add styles in `static/css/landing.css`
3. Add interactions in `static/js/landing.js`

## Common Tasks

### Change Hero Image/Animation

The hero section uses gradient orbs. To customize:
```css
.orb-1 {
    background: linear-gradient(135deg, #YOUR-COLOR1, #YOUR-COLOR2);
}
```

### Update Statistics

Edit the stats in `templates/home.html`:
```html
<div class="stat-item">
    <div class="stat-number">99.9%</div>
    <div class="stat-label">Accuracy</div>
</div>
```

### Modify Navigation Links

Update links in `templates/home.html`:
```html
<div class="nav-links">
    <a href="#features" class="nav-link">Features</a>
    <a href="#your-section" class="nav-link">Your Section</a>
</div>
```

## Testing

### Test Responsive Design

1. Open browser DevTools (F12)
2. Click device toolbar icon
3. Test different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1200px)

### Test Accessibility

1. Navigate using keyboard (Tab key)
2. Check focus indicators are visible
3. Test with screen reader
4. Verify color contrast

### Test Performance

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Generate report
4. Aim for 90+ scores

## Deployment

### Local Testing
Already running at `http://localhost:5000`

### Production Deployment
See `docs/DEPLOYMENT.md` for detailed instructions on:
- Heroku deployment
- Docker deployment
- Traditional server deployment

## Troubleshooting

### Issue: Page not loading

**Solution**: Check if Flask is running
```bash
# Make sure you're in the src directory
cd src
python app.py
```

### Issue: Styles not applying

**Solution**: Clear browser cache
- Chrome: Ctrl + Shift + Delete
- Firefox: Ctrl + Shift + Delete
- Safari: Cmd + Option + E

### Issue: Animations not working

**Solution**: Check JavaScript console for errors
- Press F12
- Go to Console tab
- Look for any red errors

### Issue: Mobile menu not working

**Solution**: Ensure JavaScript is loaded
```html
<!-- Check this line exists in home.html -->
<script src="{{ url_for('static', filename='js/landing.js') }}"></script>
```

## Features Overview

### What's Included

✅ Professional hero section with animations
✅ Interactive features showcase
✅ Step-by-step workflow visualization
✅ Benefits and statistics sections
✅ Mobile-responsive navigation
✅ Scroll animations
✅ Preloader
✅ Scroll-to-top button
✅ SEO optimization

### What You Can Customize

- Colors and gradients
- Text content
- Images and icons
- Animation speeds
- Layout and spacing
- Font styles

---

## Operations & Auto-start

### Health and Status
- `GET /health` — basic health probe
- `GET /api/status` — shows whether data is loaded and clusters are ready

### Save/Restore Analysis
- `POST /api/save-state` — persist current analysis; state auto-loads on restart

### Sample Dataset
- `POST /api/sample-data` — loads the bundled sample data for demos

### Windows Auto-start (login)
Run in PowerShell:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File config\windows\register-startup-task.ps1
```
This registers a Scheduled Task that launches the app after you log in. Use `config\windows\start_app.ps1` to launch immediately and add the firewall rule if needed.

## Next Steps

1. **Customize Content**: Update text to match your branding
2. **Add Images**: Replace placeholders with actual images
3. **Brand Colors**: Update CSS variables with your colors
4. **Test Thoroughly**: Check all breakpoints and browsers
5. **Deploy**: Follow deployment guide to go live

## Resources

- **Full Documentation**: `docs/LANDING_PAGE.md`
- **Design System**: `docs/DESIGN_SYSTEM.md`
- **API Docs**: `docs/API_DOCUMENTATION.md`
- **Changelog**: `docs/CHANGELOG.md`

## Getting Help

### Documentation
- Check the `docs/` folder for detailed guides
- Review code comments in source files

### Common Questions

**Q: How do I change the color scheme?**
A: Edit CSS variables in `static/css/landing.css`

**Q: Can I add more sections?**
A: Yes! Copy existing section structure in `home.html`

**Q: How do I optimize images?**
A: Use tools like TinyPNG or ImageOptim before adding

**Q: Is it mobile-friendly?**
A: Yes! The design is fully responsive

## Contributing

Want to improve the landing page?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Check existing documentation
- Review troubleshooting section
- Open an issue on GitHub

---

**Happy Coding!** 🚀

Start customizing and make this landing page your own!


<!-- Last updated: 2025-12-29 16:27:31 -->

