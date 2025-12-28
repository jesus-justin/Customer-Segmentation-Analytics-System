<!-- HTML Enhancement: Tooltip System -->
<script>
    const TooltipManager = {
        init: function() {
            document.querySelectorAll('[data-tooltip]').forEach(element => {
                element.addEventListener('mouseenter', (e) => {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'tooltip-popup';
                    tooltip.textContent = element.dataset.tooltip;
                    document.body.appendChild(tooltip);
                    
                    const rect = element.getBoundingClientRect();
                    tooltip.style.position = 'fixed';
                    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
                    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                    
                    element.tooltip = tooltip;
                });
                
                element.addEventListener('mouseleave', (e) => {
                    if (element.tooltip) {
                        element.tooltip.remove();
                        delete element.tooltip;
                    }
                });
            });
        }
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        TooltipManager.init();
    });
</script>
