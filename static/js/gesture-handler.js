<!-- Advanced JS: Advanced Gesture and Touch Handler -->
<script>
    const GestureHandler = {
        touchStartX: 0,
        touchEndX: 0,
        touchStartY: 0,
        touchEndY: 0,
        handlers: {},
        
        registerSwipe: function(element, direction, callback) {
            const key = `${element}-${direction}`;
            this.handlers[key] = callback;
            
            document.addEventListener('touchend', (e) => {
                this.detectSwipe(direction, callback);
            }, false);
        },
        
        detectSwipe: function(direction, callback) {
            const diffX = this.touchStartX - this.touchEndX;
            const diffY = this.touchStartY - this.touchEndY;
            const threshold = 50;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > threshold && direction === 'left') {
                    callback();
                } else if (diffX < -threshold && direction === 'right') {
                    callback();
                }
            } else {
                if (diffY > threshold && direction === 'up') {
                    callback();
                } else if (diffY < -threshold && direction === 'down') {
                    callback();
                }
            }
        },
        
        registerLongPress: function(element, duration, callback) {
            let pressTimer;
            
            element.addEventListener('touchstart', () => {
                pressTimer = setTimeout(callback, duration);
            });
            
            element.addEventListener('touchend', () => {
                clearTimeout(pressTimer);
            });
        },
        
        registerPinch: function(element, callback) {
            let lastDistance = 0;
            
            element.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2) {
                    const touch1 = e.touches[0];
                    const touch2 = e.touches[1];
                    
                    const distance = Math.hypot(
                        touch2.clientX - touch1.clientX,
                        touch2.clientY - touch1.clientY
                    );
                    
                    if (lastDistance !== 0) {
                        const scale = distance / lastDistance;
                        callback(scale);
                    }
                    
                    lastDistance = distance;
                }
            });
        }
    };
</script>
