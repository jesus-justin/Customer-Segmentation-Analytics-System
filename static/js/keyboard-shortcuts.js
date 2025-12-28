<!-- JS Enhancement: Keyboard Shortcuts System -->
<script>
    const KeyboardShortcuts = {
        shortcuts: new Map(),
        register: function(key, callback) {
            this.shortcuts.set(key, callback);
        },
        init: function() {
            document.addEventListener('keydown', (e) => {
                const key = `${e.ctrlKey ? 'ctrl+' : ''}${e.key.toLowerCase()}`;
                if (this.shortcuts.has(key)) {
                    e.preventDefault();
                    this.shortcuts.get(key)();
                }
            });
        }
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        KeyboardShortcuts.init();
    });
</script>
