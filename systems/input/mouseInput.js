export class MouseInput {
    constructor(canvas) {
        this.canvas = canvas;
        this.isDown = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.callbacks = {};
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDown = true;
            const rect = this.canvas.getBoundingClientRect();
            this.startX = e.clientX - rect.left;
            this.startY = e.clientY - rect.top;
            this.currentX = this.startX;
            this.currentY = this.startY;
            
            this.trigger('mousedown', { x: this.startX, y: this.startY });
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.currentX = e.clientX - rect.left;
            this.currentY = e.clientY - rect.top;
            
            if (this.isDown) {
                this.trigger('mousedrag', {
                    startX: this.startX,
                    startY: this.startY,
                    currentX: this.currentX,
                    currentY: this.currentY,
                    deltaX: this.currentX - this.startX,
                    deltaY: this.currentY - this.startY
                });
            }
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            if (this.isDown) {
                this.isDown = false;
                this.trigger('mouseup', {
                    startX: this.startX,
                    startY: this.startY,
                    endX: this.currentX,
                    endY: this.currentY,
                    deltaX: this.currentX - this.startX,
                    deltaY: this.currentY - this.startY
                });
            }
        });
    }
    
    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }
    
    trigger(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => callback(data));
        }
    }
}

