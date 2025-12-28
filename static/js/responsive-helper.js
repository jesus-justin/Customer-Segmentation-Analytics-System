<!-- JS Enhancement: Responsive Helper Utilities -->
<script>
    const ResponsiveHelper = {
        isMobile: () => window.innerWidth < 768,
        isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,
        isDesktop: () => window.innerWidth >= 1024,
        onResize: function(callback) {
            window.addEventListener('resize', callback);
        },
        getCurrentDevice: function() {
            if (this.isMobile()) return 'mobile';
            if (this.isTablet()) return 'tablet';
            return 'desktop';
        }
    };
</script>
