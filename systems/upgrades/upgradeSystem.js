import { getRandomUpgrades } from '../../config/upgrades.js';
import { GAME_CONFIG } from '../../config/constants.js';

export class UpgradeSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.modal = document.getElementById('upgradeModal');
        this.optionsContainer = document.getElementById('upgradeOptions');
        this.playerIndicator = document.getElementById('upgradePlayerIndicator');
        this.onUpgradeSelected = null;
    }
    
    showUpgradeMenu() {
        const upgrades = getRandomUpgrades(3);
        this.optionsContainer.innerHTML = '';
        
        const currentPlayerId = this.gameState.currentPlayer;
        this.playerIndicator.textContent = `Player ${currentPlayerId + 1}`;
        this.playerIndicator.style.color = GAME_CONFIG.PLAYER.COLORS[currentPlayerId];
        
        upgrades.forEach(upgrade => {
            const button = document.createElement('button');
            button.className = 'upgrade-option';
            button.innerHTML = `
                <strong>${upgrade.name}</strong><br>
                <small>${upgrade.description}</small>
            `;
            
            button.onclick = () => {
                this.selectUpgrade(upgrade);
            };
            
            this.optionsContainer.appendChild(button);
        });
        
        this.modal.style.display = 'block';
    }
    
    selectUpgrade(upgrade) {
        this.gameState.applyUpgrade(upgrade);
        this.modal.style.display = 'none';
        
        if (this.onUpgradeSelected) {
            this.onUpgradeSelected(upgrade);
        }
    }
}