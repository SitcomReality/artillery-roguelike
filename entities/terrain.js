import { GAME_CONFIG } from '../config/constants.js';

export class Terrain {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.heights = new Array(width);
        this.generateTerrain();
    }
    
    generateTerrain() {
        // Generate random terrain heights
        for (let x = 0; x < this.width; x++) {
            const normalizedX = x / this.width;
            const baseHeight = GAME_CONFIG.TERRAIN_HEIGHT + 
                Math.sin(normalizedX * Math.PI * 4) * 30 +
                Math.sin(normalizedX * Math.PI * 8) * 15;
            
            this.heights[x] = Math.max(0, baseHeight + 
                (Math.random() - 0.5) * 40 * GAME_CONFIG.TERRAIN_ROUGHNESS);
        }
    }
    
    getHeightAt(x) {
        x = Math.floor(x);
        if (x < 0 || x >= this.width) return 0;
        return this.heights[x];
    }
    
    getSurfaceY(x) {
        return this.height - this.getHeightAt(x);
    }
    
    createCrater(centerX, centerY, radius) {
        const startX = Math.max(0, Math.floor(centerX - radius));
        const endX = Math.min(this.width - 1, Math.floor(centerX + radius));
        
        for (let x = startX; x <= endX; x++) {
            const distance = Math.abs(x - centerX);
            if (distance < radius) {
                const depth = (radius - distance) / radius;
                const craterDepth = depth * depth * radius * 0.8;
                
                const currentSurfaceY = this.getSurfaceY(x);
                const newSurfaceY = Math.max(currentSurfaceY, centerY - craterDepth);
                this.heights[x] = Math.max(0, this.height - newSurfaceY);
            }
        }
    }
    
    isPointInTerrain(x, y) {
        return y > this.getSurfaceY(x);
    }
}

