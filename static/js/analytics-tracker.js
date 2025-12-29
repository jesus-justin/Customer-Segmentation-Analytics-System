/**
 * analytics-tracker.js
 * Enhanced with better documentation
 * Last updated: 2025-12-29
 */
<!-- JS Enhancement: Analytics Tracking -->
<script>
    const Analytics = {
        events: [],
        trackEvent: function(category, action, label = '') {
            const event = {
                timestamp: new Date(),
                category,
                action,
                label,
                url: window.location.href
            };
            this.events.push(event);
            if (window.gtag) {
                gtag('event', action, { event_category: category, event_label: label });
            }
        },
        trackPageView: function() {
            this.trackEvent('pageview', 'view', document.title);
        },
        getEvents: function() {
            return this.events;
        }
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        Analytics.trackPageView();
    });
</script>

