export class HUD {
    constructor() {
        this.p1hpElement = document.getElementById('p1hp');
        this.p2hpElement = document.getElementById('p2hp');
        this.p1StatusElement = document.getElementById('player1Status');
        this.p2StatusElement = document.getElementById('player2Status');
        this.aimingInfoElement = document.getElementById('aimingInfo');
        this.aimAngleElement = document.getElementById('aimAngle');
        this.aimPowerElement = document.getElementById('aimPower');
    }
    
    updatePlayerStatus(gameState) {
        this.p1hpElement.textContent = gameState.players[0].hp;
        this.p2hpElement.textContent = gameState.players[1].hp;
        
        // Update active player indication
        this.p1StatusElement.classList.toggle('player-active', gameState.currentPlayer === 0);
        this.p2StatusElement.classList.toggle('player-active', gameState.currentPlayer === 1);
    }
    
    showAimingInfo(angle, power) {
        this.aimAngleElement.textContent = Math.round(angle * 180 / Math.PI);
        this.aimPowerElement.textContent = Math.round(power);
        this.aimingInfoElement.style.display = 'block';
    }
    
    hideAimingInfo() {
        this.aimingInfoElement.style.display = 'none';
    }
}

