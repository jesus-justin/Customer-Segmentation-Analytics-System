<!-- Advanced JS: Advanced State Management -->
<script>
    const StateStore = {
        state: {},
        subscribers: new Map(),
        history: [],
        maxHistory: 50,
        
        setState: function(key, value) {
            const oldValue = this.state[key];
            this.state[key] = value;
            
            this.history.push({
                timestamp: new Date(),
                key,
                oldValue,
                newValue: value
            });
            
            if (this.history.length > this.maxHistory) {
                this.history.shift();
            }
            
            this.notifySubscribers(key, value);
        },
        
        getState: function(key) {
            return this.state[key];
        },
        
        subscribe: function(key, callback) {
            if (!this.subscribers.has(key)) {
                this.subscribers.set(key, []);
            }
            this.subscribers.get(key).push(callback);
            
            return () => {
                const callbacks = this.subscribers.get(key);
                const index = callbacks.indexOf(callback);
                if (index > -1) callbacks.splice(index, 1);
            };
        },
        
        notifySubscribers: function(key, value) {
            if (this.subscribers.has(key)) {
                this.subscribers.get(key).forEach(callback => {
                    callback(value);
                });
            }
        },
        
        getHistory: function(key) {
            return this.history.filter(entry => entry.key === key);
        },
        
        clearHistory: function() {
            this.history = [];
        }
    };
</script>
