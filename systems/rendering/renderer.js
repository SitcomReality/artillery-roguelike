import { GAME_CONFIG } from '../../config/constants.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
    }
    
    clear() {
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    renderTerrain(terrain) {
        this.ctx.fillStyle = '#8B4513';
        this.ctx.beginPath();
        this.ctx.moveTo(0, terrain.height);
        
        for (let x = 0; x < terrain.width; x++) {
            this.ctx.lineTo(x, terrain.getSurfaceY(x));
        }
        
        this.ctx.lineTo(terrain.width, terrain.height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Grass on top
        this.ctx.strokeStyle = '#228B22';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, terrain.getSurfaceY(0));
        
        for (let x = 1; x < terrain.width; x++) {
            this.ctx.lineTo(x, terrain.getSurfaceY(x));
        }
        
        this.ctx.stroke();
    }
    
    renderPlayer(player, gameState) {
        const isActive = gameState.currentPlayer === player.id;
        
        this.ctx.fillStyle = GAME_CONFIG.PLAYER.COLORS[player.id];
        if (isActive) {
            this.ctx.shadowColor = this.ctx.fillStyle;
            this.ctx.shadowBlur = 10;
        }
        
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y, GAME_CONFIG.PLAYER.RADIUS, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
        
        // Health bar
        const barWidth = 30;
        const barHeight = 4;
        const healthPercent = gameState.players[player.id].hp / GAME_CONFIG.PLAYER.INITIAL_HP;
        
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(
            player.x - barWidth / 2, 
            player.y - GAME_CONFIG.PLAYER.RADIUS - 15, 
            barWidth, 
            barHeight
        );
        
        this.ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : 
                           healthPercent > 0.2 ? '#FFC107' : '#F44336';
        this.ctx.fillRect(
            player.x - barWidth / 2, 
            player.y - GAME_CONFIG.PLAYER.RADIUS - 15, 
            barWidth * healthPercent, 
            barHeight
        );
    }
    
    renderProjectile(projectile) {
        // Trail
        if (projectile.trail.length > 1) {
            this.ctx.strokeStyle = 'rgba(255, 255, 68, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(projectile.trail[0].x, projectile.trail[0].y);
            
            for (let i = 1; i < projectile.trail.length; i++) {
                this.ctx.lineTo(projectile.trail[i].x, projectile.trail[i].y);
            }
            
            this.ctx.stroke();
        }
        
        // Projectile
        this.ctx.fillStyle = GAME_CONFIG.PROJECTILE.COLOR;
        this.ctx.beginPath();
        this.ctx.arc(projectile.x, projectile.y, GAME_CONFIG.PROJECTILE.RADIUS, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    renderExplosion(explosion) {
        const alpha = Math.max(0, 1 - explosion.age / explosion.maxAge);
        
        this.ctx.fillStyle = `rgba(255, 100, 0, ${alpha * 0.7})`;
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius * (1 + explosion.age / explosion.maxAge), 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    renderAimLine(player, angle, power) {
        const length = GAME_CONFIG.UI.AIM_LINE_LENGTH * (power / 100);
        const endX = player.x + Math.cos(angle) * length;
        const endY = player.y + Math.sin(angle) * length;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(player.x, player.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
}

