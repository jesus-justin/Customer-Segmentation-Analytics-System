<!-- JS Enhancement: String Utilities for Text Operations -->
<script>
    const StringUtils = {
        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
        truncate: (str, length) => str.length > length ? str.substring(0, length) + '...' : str,
        slugify: (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        camelCase: (str) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }),
        kebabCase: (str) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
        isEmail: (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str),
        stripHtml: (str) => str.replace(/<[^>]*>/g, '')
    };
</script>
