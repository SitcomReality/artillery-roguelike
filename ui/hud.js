export class HUD {
    constructor() {
        this.p1hpElement = document.getElementById('p1hp');
        this.p2hpElement = document.getElementById('p2hp');
        this.p1StatusElement = document.getElementById('player1Status');
        this.p2StatusElement = document.getElementById('player2Status');
        this.aimingInfoElement = document.getElementById('aimingInfo');
        this.aimAngleElement = document.getElementById('aimAngle');
        this.aimPowerElement = document.getElementById('aimPower');
        
        // Aiming indicators
        this.p1Angle = document.getElementById('p1Angle');
        this.p1Power = document.getElementById('p1Power');
        this.p2Angle = document.getElementById('p2Angle');
        this.p2Power = document.getElementById('p2Power');
        this.powerFill = {};
    }
    
    updatePlayerStatus(gameState) {
        this.p1hpElement.textContent = gameState.players[0].hp;
        this.p2hpElement.textContent = gameState.players[1].hp;
        
        // Update active player indication
        this.p1StatusElement.classList.toggle('player-active', gameState.currentPlayer === 0);
        this.p2StatusElement.classList.toggle('player-active', gameState.currentPlayer === 1);
    }
    
    showAimingInfo(playerId, angle, power, playerX, playerY) {
        const angleIndicator = playerId === 0 ? this.p1Angle : this.p2Angle;
        const powerIndicator = playerId === 0 ? this.p1Power : this.p2Power;
        
        // Position indicators above the tank
        const offsetX = playerId === 0 ? -40 : 40;
        angleIndicator.style.display = 'block';
        angleIndicator.style.left = `${playerX + offsetX}px`;
        angleIndicator.style.top = `${playerY - 70}px`;
        
        powerIndicator.style.display = 'flex';
        powerIndicator.style.left = `${playerX + offsetX}px`;
        powerIndicator.style.top = `${playerY - 100}px`;
        
        // Create structure if not exists
        if (!powerIndicator.querySelector('.power-gauge')) {
            powerIndicator.innerHTML = '<div class="power-gauge"><div class="power-fill"></div></div><div>POWER</div>';
            this.powerFill[playerId] = powerIndicator.querySelector('.power-fill');
        }
        
        // Update gauge
        if (this.powerFill[playerId]) {
            this.powerFill[playerId].style.width = `${power}%`;
        }
        
        // Rotate angle indicator
        const angleDeg = angle * 180 / Math.PI;
        angleIndicator.style.setProperty('--aim-angle', `${angleDeg}deg`);
    }
    
    hideAimingInfo() {
        this.p1Angle.style.display = 'none';
        this.p1Power.style.display = 'none';
        this.p2Angle.style.display = 'none';
        this.p2Power.style.display = 'none';
    }
}