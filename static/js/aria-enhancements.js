<!-- HTML Enhancement: ARIA Labels and Attributes -->
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // Add ARIA labels to interactive elements
        document.querySelectorAll('[data-interactive]').forEach(el => {
            el.setAttribute('role', 'button');
            if (!el.hasAttribute('aria-label')) {
                el.setAttribute('aria-label', el.textContent || 'Interactive element');
            }
        });
        
        // Add aria-hidden to decorative elements
        document.querySelectorAll('[data-decorative]').forEach(el => {
            el.setAttribute('aria-hidden', 'true');
        });
        
        // Add aria-expanded to collapsible elements
        document.querySelectorAll('[data-collapsible]').forEach(el => {
            el.setAttribute('aria-expanded', 'false');
        });
    });
</script>
