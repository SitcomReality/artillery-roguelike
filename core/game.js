import { GAME_CONFIG } from '../config/constants.js';
import { GameState } from './gameState.js';
import { Terrain } from '../entities/terrain.js';
import { Player } from '../entities/player.js';
import { Projectile } from '../entities/projectile.js';
import { Renderer } from '../systems/rendering/renderer.js';
import { MouseInput } from '../systems/input/mouseInput.js';
import { UpgradeSystem } from '../systems/upgrades/upgradeSystem.js';
import { ExplosionSystem } from '../systems/physics/explosion.js';
import { HUD } from '../ui/hud.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.gameState = new GameState();
        this.renderer = new Renderer(this.canvas);
        this.mouseInput = new MouseInput(this.canvas);
        this.upgradeSystem = new UpgradeSystem(this.gameState);
        this.hud = new HUD();
        
        this.terrain = new Terrain(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        this.players = [
            new Player(0, GAME_CONFIG.PLAYER.STARTING_POSITIONS[0], this.terrain),
            new Player(1, GAME_CONFIG.PLAYER.STARTING_POSITIONS[1], this.terrain)
        ];
        
        this.gameState.terrain = this.terrain;
        this.explosions = [];
        this.currentAim = { angle: 0, power: 0 };
        this.isAiming = false;
        
        this.setupEventHandlers();
        this.startGame();
    }
    
    setupEventHandlers() {
        this.mouseInput.on('mousedown', (data) => {
            if (this.gameState.gamePhase === 'aiming') {
                this.isAiming = true;
            }
        });
        
        this.mouseInput.on('mousedrag', (data) => {
            if (this.isAiming && this.gameState.gamePhase === 'aiming') {
                const player = this.players[this.gameState.currentPlayer];
                const angle = Math.atan2(data.deltaY, data.deltaX);
                const power = Math.min(100, Math.sqrt(data.deltaX * data.deltaX + data.deltaY * data.deltaY) * 2);
                
                this.currentAim = { angle, power };
                
                // Pass player ID and position
                this.hud.showAimingInfo(
                    this.gameState.currentPlayer,
                    angle, 
                    power,
                    player.x,
                    player.y
                );
            }
        });
        
        this.mouseInput.on('mouseup', (data) => {
            if (this.isAiming && this.gameState.gamePhase === 'aiming') {
                this.isAiming = false;
                this.hud.hideAimingInfo();
                this.fire();
            }
        });
        
        this.upgradeSystem.onUpgradeSelected = (upgrade) => {
            this.gameState.gamePhase = 'aiming';
        };
    }
    
    startGame() {
        this.upgradeSystem.showUpgradeMenu();
        this.gameLoop();
    }
    
    fire() {
        const player = this.players[this.gameState.currentPlayer];
        const upgrades = this.gameState.getCurrentPlayer().upgrades;
        
        const velocity = this.currentAim.power * GAME_CONFIG.UI.POWER_SCALE;
        const vx = Math.cos(this.currentAim.angle) * velocity;
        const vy = Math.sin(this.currentAim.angle) * velocity;
        
        // Create projectile(s)
        const projectileCount = upgrades.multiShot || 1;
        
        for (let i = 0; i < projectileCount; i++) {
            const spread = projectileCount > 1 ? (i - (projectileCount - 1) / 2) * 0.1 : 0;
            const adjustedAngle = this.currentAim.angle + spread;
            const adjustedVx = Math.cos(adjustedAngle) * velocity;
            const adjustedVy = Math.sin(adjustedAngle) * velocity;
            
            const projectile = new Projectile(
                player.x, 
                player.y, 
                adjustedVx, 
                adjustedVy, 
                this.gameState.currentPlayer,
                upgrades
            );
            
            this.gameState.projectiles.push(projectile);
        }
        
        this.gameState.gamePhase = 'firing';
    }
    
    updateProjectiles() {
        this.gameState.projectiles = this.gameState.projectiles.filter(projectile => {
            if (!projectile.active) return false;
            
            projectile.update();
            
            const collision = projectile.checkCollision(this.terrain, this.players);
            if (collision) {
                const explosion = projectile.explode();
                this.handleExplosion(explosion);
                return false;
            }
            
            return projectile.active;
        });
    }
    
    handleExplosion(explosion) {
        // Visual explosion effect
        this.explosions.push({
            x: explosion.x,
            y: explosion.y,
            radius: explosion.radius,
            age: 0,
            maxAge: 30
        });
        
        // Apply damage and terrain destruction
        const damageResults = ExplosionSystem.createExplosion(
            explosion.x, 
            explosion.y, 
            explosion.radius, 
            explosion.damage, 
            this.terrain, 
            this.players
        );
        
        // Apply damage to game state
        damageResults.forEach(result => {
            this.gameState.takeDamage(result.playerId, result.damage);
        });
        
        // Handle cluster bombs
        if (explosion.cluster > 0) {
            const clusterExplosions = ExplosionSystem.createClusterExplosions(
                explosion.x, 
                explosion.y, 
                explosion.cluster, 
                explosion.damage, 
                this.terrain, 
                this.players
            );
            
            // Add delayed cluster explosions
            clusterExplosions.forEach((cluster, index) => {
                setTimeout(() => {
                    this.handleExplosion(cluster);
                }, cluster.delay);
            });
        }
    }
    
    updateExplosions() {
        this.explosions = this.explosions.filter(explosion => {
            explosion.age++;
            return explosion.age < explosion.maxAge;
        });
    }
    
    checkTurnEnd() {
        if (this.gameState.gamePhase === 'firing' && this.gameState.projectiles.length === 0) {
            if (this.gameState.isGameOver()) {
                this.gameState.gamePhase = 'gameover';
            } else {
                this.gameState.switchPlayer();
                this.upgradeSystem.showUpgradeMenu();
            }
        }
    }
    
    render() {
        this.renderer.clear();
        this.renderer.renderTerrain(this.terrain);
        
        // Render players
        this.players.forEach(player => {
            this.renderer.renderPlayer(player, this.gameState);
        });
        
        // Render projectiles
        this.gameState.projectiles.forEach(projectile => {
            this.renderer.renderProjectile(projectile);
        });
        
        // Render explosions
        this.explosions.forEach(explosion => {
            this.renderer.renderExplosion(explosion);
        });
        
        // Render aim line
        if (this.isAiming && this.gameState.gamePhase === 'aiming') {
            const player = this.players[this.gameState.currentPlayer];
            this.renderer.renderAimLine(player, this.currentAim.angle, this.currentAim.power);
        }
        
        // Update HUD
        this.hud.updatePlayerStatus(this.gameState);
        
        // Game over screen
        if (this.gameState.gamePhase === 'gameover') {
            this.renderer.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.renderer.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.renderer.ctx.fillStyle = '#fff';
            this.renderer.ctx.font = '48px Arial';
            this.renderer.ctx.textAlign = 'center';
            this.renderer.ctx.fillText(
                `Player ${this.gameState.winner + 1} Wins!`, 
                this.canvas.width / 2, 
                this.canvas.height / 2
            );
        }
    }
    
    gameLoop() {
        this.updateProjectiles();
        this.updateExplosions();
        this.checkTurnEnd();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game
new Game();