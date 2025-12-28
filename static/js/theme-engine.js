<!-- Advanced JS: Theme Customization Engine -->
<script>
    const ThemeEngine = {
        themes: {
            light: {
                primary: '#2563eb',
                secondary: '#10b981',
                background: '#ffffff',
                text: '#1e293b',
                accent: '#f59e0b'
            },
            dark: {
                primary: '#60a5fa',
                secondary: '#34d399',
                background: '#0f172a',
                text: '#f1f5f9',
                accent: '#fbbf24'
            },
            ocean: {
                primary: '#0369a1',
                secondary: '#06b6d4',
                background: '#f0f9ff',
                text: '#0c2340',
                accent: '#0ea5e9'
            },
            forest: {
                primary: '#15803d',
                secondary: '#059669',
                background: '#f0fdf4',
                text: '#1b4332',
                accent: '#84cc16'
            }
        },
        
        applyTheme: function(themeName) {
            const theme = this.themes[themeName] || this.themes.light;
            const root = document.documentElement;
            
            Object.entries(theme).forEach(([key, value]) => {
                root.style.setProperty(`--theme-${key}`, value);
            });
            
            localStorage.setItem('selectedTheme', themeName);
        },
        
        createCustomTheme: function(name, colors) {
            this.themes[name] = colors;
            this.applyTheme(name);
        },
        
        getAvailableThemes: function() {
            return Object.keys(this.themes);
        },
        
        initializeFromStorage: function() {
            const savedTheme = localStorage.getItem('selectedTheme') || 'light';
            this.applyTheme(savedTheme);
        }
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        ThemeEngine.initializeFromStorage();
    });
</script>
