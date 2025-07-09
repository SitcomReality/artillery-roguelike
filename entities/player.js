import { GAME_CONFIG } from '../config/constants.js';

export class Player {
    constructor(id, x, terrain) {
        this.id = id;
        this.x = x;
        this.terrain = terrain;
        this.updatePosition();
    }
    
    updatePosition() {
        this.y = this.terrain.getSurfaceY(this.x) - GAME_CONFIG.PLAYER.RADIUS;
    }
    
    takeDamage(damage) {
        this.hp = Math.max(0, this.hp - damage);
        return this.hp <= 0;
    }
    
    moveTo(x) {
        this.x = Math.max(GAME_CONFIG.PLAYER.RADIUS, 
                 Math.min(GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.PLAYER.RADIUS, x));
        this.updatePosition();
    }
    
    getCenter() {
        return { x: this.x, y: this.y };
    }
}

