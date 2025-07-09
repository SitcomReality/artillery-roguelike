export class ExplosionSystem {
    static createExplosion(x, y, radius, damage, terrain, players) {
        // Create terrain crater
        terrain.createCrater(x, y, radius);
        
        // Update player positions
        players.forEach(player => player.updatePosition());
        
        // Apply damage to players
        const damageResults = [];
        players.forEach(player => {
            const distance = Math.sqrt(
                Math.pow(player.x - x, 2) + Math.pow(player.y - y, 2)
            );
            
            if (distance < radius) {
                const damageFalloff = 1 - (distance / radius);
                const actualDamage = Math.round(damage * damageFalloff);
                
                if (actualDamage > 0) {
                    damageResults.push({
                        playerId: player.id,
                        damage: actualDamage
                    });
                }
            }
        });
        
        return damageResults;
    }
    
    static createClusterExplosions(centerX, centerY, count, parentDamage, terrain, players) {
        const explosions = [];
        const angleStep = (Math.PI * 2) / count;
        
        for (let i = 0; i < count; i++) {
            const angle = i * angleStep;
            const distance = 20 + Math.random() * 30;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            const clusterDamage = Math.round(parentDamage * 0.6);
            const clusterRadius = 20;
            
            explosions.push({
                x, y,
                radius: clusterRadius,
                damage: clusterDamage,
                delay: i * 100 // Staggered explosions
            });
        }
        
        return explosions;
    }
}

