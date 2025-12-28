<!-- JS Enhancement: DOM Utilities -->
<script>
    const DOMUtils = {
        createElement: (tag, className = '', text = '') => {
            const el = document.createElement(tag);
            if (className) el.className = className;
            if (text) el.textContent = text;
            return el;
        },
        addClass: (element, className) => element.classList.add(className),
        removeClass: (element, className) => element.classList.remove(className),
        toggleClass: (element, className) => element.classList.toggle(className),
        hasClass: (element, className) => element.classList.contains(className),
        setAttributes: (element, attrs) => {
            Object.keys(attrs).forEach(key => {
                element.setAttribute(key, attrs[key]);
            });
        },
        getParent: (element, selector) => element.closest(selector)
    };
</script>
