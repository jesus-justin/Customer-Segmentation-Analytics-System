<!-- HTML Enhancement: Icon Accessibility -->
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // Mark decorative icons with aria-hidden
        document.querySelectorAll('.icon-decorative').forEach(icon => {
            icon.setAttribute('aria-hidden', 'true');
        });
        
        // Add aria-label to icons with meaning
        document.querySelectorAll('i[class*="fas"][data-label]').forEach(icon => {
            icon.setAttribute('aria-label', icon.dataset.label);
        });
    });
</script>
