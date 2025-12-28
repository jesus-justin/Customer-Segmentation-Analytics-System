<!-- HTML Enhancement: Semantic Landmark Roles -->
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // Add semantic roles for better accessibility
        const mainContent = document.querySelector('main') || document.body;
        mainContent.setAttribute('role', 'main');
        
        // Mark navigation regions
        document.querySelectorAll('nav').forEach(nav => {
            nav.setAttribute('role', 'navigation');
        });
        
        // Mark section regions
        document.querySelectorAll('section').forEach(section => {
            section.setAttribute('role', 'region');
        });
    });
</script>
