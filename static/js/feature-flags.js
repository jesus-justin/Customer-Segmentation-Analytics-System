/**
 * feature-flags.js
 * Enhanced with better documentation
 * Last updated: 2025-12-29
 */
<!-- HTML Enhancement: Feature Flagging Support -->
<script>
    window.FeatureFlags = {
        enabled: {},
        
        check: function(featureName) {
            return this.enabled[featureName] === true;
        },
        
        enable: function(featureName) {
            this.enabled[featureName] = true;
            document.querySelectorAll(`[data-feature="${featureName}"]`).forEach(el => {
                el.style.display = '';
            });
        },
        
        disable: function(featureName) {
            this.enabled[featureName] = false;
            document.querySelectorAll(`[data-feature="${featureName}"]`).forEach(el => {
                el.style.display = 'none';
            });
        }
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-enhance]').forEach(el => {
            const feature = el.dataset.enhance;
            if (window.FeatureFlags.check(feature)) {
                el.classList.add('enhanced');
            }
        });
    });
</script>

