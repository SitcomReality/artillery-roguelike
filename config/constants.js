export const GAME_CONFIG = {
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 600,
    GRAVITY: 0.3,
    TERRAIN_HEIGHT: 100,
    TERRAIN_ROUGHNESS: 0.1,
    
    PLAYER: {
        INITIAL_HP: 100,
        RADIUS: 15,
        STARTING_POSITIONS: [150, 1050], // x positions for player 1 and 2
        COLORS: ['#ff4444', '#4444ff']
    },
    
    PROJECTILE: {
        RADIUS: 3,
        BASE_DAMAGE: 10,
        EXPLOSION_RADIUS: 30,
        TRAIL_LENGTH: 8,
        COLOR: '#ffff44'
    },
    
    PHYSICS: {
        MAX_VELOCITY: 20,
        BOUNCE_DAMPING: 0.3,
        EXPLOSION_FORCE: 50
    },
    
    UI: {
        AIM_LINE_LENGTH: 100,
        POWER_SCALE: 0.1
    }
};

