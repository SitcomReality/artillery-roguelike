import { GAME_CONFIG } from '../config/constants.js';

export class GameState {
    constructor() {
        this.currentPlayer = 0;
        this.gamePhase = 'upgrade'; // 'upgrade', 'aiming', 'firing', 'waiting'
        this.players = [
            {
                id: 0,
                x: GAME_CONFIG.PLAYER.STARTING_POSITIONS[0],
                y: 0,
                hp: GAME_CONFIG.PLAYER.INITIAL_HP,
                upgrades: {
                    damage: 0,
                    explosionRadius: 0,
                    multiShot: 1,
                    cluster: 0,
                    drill: 0,
                    grapple: false,
                    barrier: false,
                    teleport: false
                }
            },
            {
                id: 1,
                x: GAME_CONFIG.PLAYER.STARTING_POSITIONS[1],
                y: 0,
                hp: GAME_CONFIG.PLAYER.INITIAL_HP,
                upgrades: {
                    damage: 0,
                    explosionRadius: 0,
                    multiShot: 1,
                    cluster: 0,
                    drill: 0,
                    grapple: false,
                    barrier: false,
                    teleport: false
                }
            }
        ];
        this.projectiles = [];
        this.explosions = [];
        this.terrain = null;
        this.winner = null;
    }
    
    getCurrentPlayer() {
        return this.players[this.currentPlayer];
    }
    
    switchPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        this.gamePhase = 'upgrade';
    }
    
    applyUpgrade(upgrade) {
        const player = this.getCurrentPlayer();
        const effect = upgrade.effect;
        
        Object.keys(effect).forEach(key => {
            if (typeof effect[key] === 'boolean') {
                player.upgrades[key] = effect[key];
            } else {
                player.upgrades[key] += effect[key];
            }
        });
    }
    
    takeDamage(playerId, damage) {
        this.players[playerId].hp = Math.max(0, this.players[playerId].hp - damage);
        
        if (this.players[playerId].hp <= 0) {
            this.winner = playerId === 0 ? 1 : 0;
        }
    }
    
    isGameOver() {
        return this.winner !== null;
    }
}

