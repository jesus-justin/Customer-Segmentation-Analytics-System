<!-- JS Enhancement: Math Utilities -->
<script>
    const MathUtils = {
        clamp: (value, min, max) => Math.min(Math.max(value, min), max),
        lerp: (a, b, t) => a + (b - a) * t,
        random: (min, max) => Math.random() * (max - min) + min,
        randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        round: (value, decimals) => Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals),
        distance: (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
        percent: (value, total) => (value / total) * 100
    };
</script>
