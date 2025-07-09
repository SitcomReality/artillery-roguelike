import { getRandomUpgrades } from '../../config/upgrades.js';

export class UpgradeSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.modal = document.getElementById('upgradeModal');
        this.optionsContainer = document.getElementById('upgradeOptions');
        this.onUpgradeSelected = null;
    }
    
    showUpgradeMenu() {
        const upgrades = getRandomUpgrades(3);
        this.optionsContainer.innerHTML = '';
        
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

