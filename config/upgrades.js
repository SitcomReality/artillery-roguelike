export const UPGRADE_TYPES = {
    DAMAGE_BOOST: {
        id: 'damage_boost',
        name: 'Damage Boost',
        description: 'Increases damage by 5',
        effect: { damage: 5 },
        weight: 10
    },
    
    EXPLOSION_RADIUS: {
        id: 'explosion_radius',
        name: 'Bigger Boom',
        description: 'Increases explosion radius by 10',
        effect: { explosionRadius: 10 },
        weight: 10
    },
    
    DOUBLE_SHOT: {
        id: 'double_shot',
        name: 'Double Shot',
        description: 'Fire two projectiles with slight spread',
        effect: { multiShot: 2 },
        weight: 5
    },
    
    CLUSTER_BOMB: {
        id: 'cluster_bomb',
        name: 'Cluster Bomb',
        description: 'Splits into 3 smaller bombs on impact',
        effect: { cluster: 3 },
        weight: 7
    },
    
    DRILL_SHOT: {
        id: 'drill_shot',
        name: 'Drill Shot',
        description: 'Penetrates terrain before exploding',
        effect: { drill: 30 },
        weight: 6
    },
    
    GRAPPLE_SHOT: {
        id: 'grapple_shot',
        name: 'Grapple Shot',
        description: 'Pull yourself to the impact point',
        effect: { grapple: true },
        weight: 4
    },
    
    BARRIER_WALL: {
        id: 'barrier_wall',
        name: 'Barrier Wall',
        description: 'Place a destructible wall',
        effect: { barrier: true },
        weight: 3
    },
    
    TELEPORT: {
        id: 'teleport',
        name: 'Teleport',
        description: 'Instantly move to a new position',
        effect: { teleport: true },
        weight: 4
    }
};

export function getRandomUpgrades(count = 3) {
    const upgrades = Object.values(UPGRADE_TYPES);
    const weightedUpgrades = [];
    
    upgrades.forEach(upgrade => {
        for (let i = 0; i < upgrade.weight; i++) {
            weightedUpgrades.push(upgrade);
        }
    });
    
    const selected = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * weightedUpgrades.length);
        const upgrade = weightedUpgrades[randomIndex];
        
        if (!selected.includes(upgrade)) {
            selected.push(upgrade);
        }
    }
    
    return selected;
}

