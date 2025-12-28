<!-- JS Enhancement: StorageManager for LocalStorage -->
<script>
    const StorageManager = {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('LocalStorage unavailable:', e);
            }
        },
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('LocalStorage read error:', e);
                return defaultValue;
            }
        },
        remove: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('LocalStorage delete error:', e);
            }
        },
        clear: () => {
            try {
                localStorage.clear();
            } catch (e) {
                console.warn('LocalStorage clear error:', e);
            }
        }
    };
</script>
