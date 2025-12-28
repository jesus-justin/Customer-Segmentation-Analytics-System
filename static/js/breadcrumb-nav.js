<!-- HTML Enhancement: Breadcrumb Navigation Support -->
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const breadcrumbData = window.breadcrumbPath || [];
        if (breadcrumbData.length > 0) {
            const breadcrumb = document.querySelector('.breadcrumb') || 
                             document.createElement('nav');
            breadcrumb.setAttribute('aria-label', 'Breadcrumb');
            
            breadcrumbData.forEach((item, index) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = item.url;
                a.textContent = item.label;
                li.appendChild(a);
                
                if (index === breadcrumbData.length - 1) {
                    li.setAttribute('aria-current', 'page');
                }
                breadcrumb.appendChild(li);
            });
        }
    });
</script>
