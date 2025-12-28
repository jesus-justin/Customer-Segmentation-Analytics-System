<!-- Advanced JS: Scroll Animation Manager -->
<script>
    const ScrollAnimationManager = {
        observedElements: new Map(),
        
        observeElements: function(selector, animationClass) {
            const elements = document.querySelectorAll(selector);
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(animationClass);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            });
            
            elements.forEach(el => observer.observe(el));
            this.observedElements.set(selector, observer);
        },
        
        unobserveAll: function() {
            this.observedElements.forEach(observer => {
                observer.disconnect();
            });
            this.observedElements.clear();
        }
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        ScrollAnimationManager.observeElements('.card', 'animate-slide-up');
        ScrollAnimationManager.observeElements('[data-animate]', 'animate-fade-scale');
    });
</script>
