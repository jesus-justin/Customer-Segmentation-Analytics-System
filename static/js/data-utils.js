/**
 * data-utils.js
 * Enhanced with better documentation
 * Last updated: 2025-12-29
 */
<!-- JS Enhancement: Data Utilities for Array Operations -->
<script>
    const DataUtils = {
        filterBy: (array, key, value) => array.filter(item => item[key] === value),
        sortBy: (array, key, order = 'asc') => {
            return [...array].sort((a, b) => {
                if (order === 'asc') return a[key] > b[key] ? 1 : -1;
                return a[key] < b[key] ? 1 : -1;
            });
        },
        groupBy: (array, key) => {
            return array.reduce((acc, item) => {
                const group = item[key];
                if (!acc[group]) acc[group] = [];
                acc[group].push(item);
                return acc;
            }, {})
        },
        sumBy: (array, key) => array.reduce((sum, item) => sum + (item[key] || 0), 0),
        averageBy: (array, key) => {
            const sum = DataUtils.sumBy(array, key);
            return array.length > 0 ? sum / array.length : 0;
        }
    };
</script>

