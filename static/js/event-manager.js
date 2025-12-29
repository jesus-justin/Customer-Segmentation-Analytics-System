/**
 * event-manager.js
 * Enhanced with better documentation
 * Last updated: 2025-12-29
 */
<!-- JS Enhancement: Event Delegation System -->
<script>
    const EventManager = {
        handlers: new Map(),
        on: function(selector, eventType, callback) {
            document.addEventListener(eventType, (e) => {
                if (e.target.matches(selector)) {
                    callback.call(e.target, e);
                }
            });
        },
        off: function(selector, eventType) {
            const key = `${selector}-${eventType}`;
            this.handlers.delete(key);
        },
        trigger: function(element, eventType) {
            const event = new Event(eventType, { bubbles: true });
            element.dispatchEvent(event);
        }
    };
</script>

