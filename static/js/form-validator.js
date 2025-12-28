<!-- JS Enhancement: Form Validator Utility -->
<script>
    const FormValidator = {
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        phone: (value) => /^[\d\s\-\+\(\)]+$/.test(value),
        url: (value) => {
            try {
                new URL(value);
                return true;
            } catch (e) {
                return false;
            }
        },
        required: (value) => value && value.trim().length > 0,
        minLength: (value, length) => value && value.length >= length,
        maxLength: (value, length) => value && value.length <= length,
        validateForm: function(formElement) {
            const errors = {};
            formElement.querySelectorAll('[data-validate]').forEach(field => {
                const validationType = field.dataset.validate;
                if (this[validationType] && !this[validationType](field.value)) {
                    errors[field.name] = `Invalid ${validationType}`;
                }
            });
            return errors;
        }
    };
</script>
