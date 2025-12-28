<!-- JS Enhancement: Animation Utilities -->
<script>
    const AnimationUtils = {
        fadeIn: (element, duration = 300) => {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ease-in`;
            setTimeout(() => {
                element.style.opacity = '1';
            }, 10);
        },
        slideUp: (element, duration = 300) => {
            element.style.transform = 'translateY(20px)';
            element.style.opacity = '0';
            element.style.transition = `all ${duration}ms ease-out`;
            setTimeout(() => {
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
            }, 10);
        },
        pulse: (element) => {
            element.classList.add('animate-pulse');
            setTimeout(() => element.classList.remove('animate-pulse'), 2000);
        },
        bounce: (element) => {
            element.style.animation = 'bounce 0.6s';
            setTimeout(() => element.style.animation = '', 600);
        }
    };
</script>
