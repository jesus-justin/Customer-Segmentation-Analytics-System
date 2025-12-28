<!-- JS Enhancement: Performance Monitor -->
<script>
    const PerformanceMonitor = {
        marks: {},
        startMeasure: function(name) {
            this.marks[name] = performance.now();
        },
        endMeasure: function(name) {
            if (this.marks[name]) {
                const duration = performance.now() - this.marks[name];
                console.log(`${name}: ${duration.toFixed(2)}ms`);
                delete this.marks[name];
                return duration;
            }
        },
        getMetrics: function() {
            return {
                navigation: performance.getEntriesByType('navigation')[0],
                paints: performance.getEntriesByType('paint'),
                resources: performance.getEntriesByType('resource').slice(0, 5)
            };
        }
    };
</script>
