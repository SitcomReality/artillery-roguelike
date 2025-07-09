import { GAME_CONFIG } from '../config/constants.js';

export class Projectile {
    constructor(x, y, vx, vy, owner, upgrades = {}) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.owner = owner;
        this.upgrades = upgrades;
        this.trail = [];
        this.active = true;
        this.drillDistance = 0;
        this.age = 0; // Age in frames
    }
    
    update() {
        if (!this.active) return;
        
        this.age++;
        
        // Store trail position
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > GAME_CONFIG.PROJECTILE.TRAIL_LENGTH) {
            this.trail.shift();
        }
        
        // Apply physics
        this.x += this.vx;
        this.y += this.vy;
        this.vy += GAME_CONFIG.GRAVITY;
        
        // Check bounds
        if (this.x < 0 || this.x > GAME_CONFIG.CANVAS_WIDTH || 
            this.y > GAME_CONFIG.CANVAS_HEIGHT) {
            this.active = false;
        }
    }
    
    checkCollision(terrain, players) {
        // Check terrain collision
        if (terrain.isPointInTerrain(this.x, this.y)) {
            if (this.upgrades.drill && this.drillDistance < this.upgrades.drill) {
                this.drillDistance++;
                return null; // Continue drilling
            }
            return { type: 'terrain', x: this.x, y: this.y };
        }
        
        // Check player collision
        for (const player of players) {
            // Don't collide with owner for the first few frames
            if (player.id === this.owner && this.age < 10) {
                continue;
            }

            const dx = this.x - player.x;
            const dy = this.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < GAME_CONFIG.PLAYER.RADIUS + GAME_CONFIG.PROJECTILE.RADIUS) {
                return { type: 'player', target: player, x: this.x, y: this.y };
            }
        }
        
        return null;
    }
    
    explode() {
        this.active = false;
        return {
            x: this.x,
            y: this.y,
            radius: GAME_CONFIG.PROJECTILE.EXPLOSION_RADIUS + (this.upgrades.explosionRadius || 0),
            damage: GAME_CONFIG.PROJECTILE.BASE_DAMAGE + (this.upgrades.damage || 0),
            cluster: this.upgrades.cluster || 0
        };
    }
}