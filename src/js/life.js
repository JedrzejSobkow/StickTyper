export class LifeModel {
    constructor(maxLife = 100) {
        this.maxLife = maxLife;
        this.currentLife = maxLife;
    }

    decreaseLife() {
        this.currentLife = Math.max(0, Math.min(this.maxLife, this.currentLife - 1));
    }

    getLifePercentage() {
        return 100 - (this.currentLife / this.maxLife * 100);
    }
}

export class LifeView {
    constructor(heartSelector) {
        this.heartFill = document.querySelector(heartSelector);
    }

    updateHeart(percentage) {
        this.heartFill.style.clipPath = `inset(${percentage}% 0 0 0)`;
    }
}

export class LifeController {
    constructor(model, view, life_loss_speed) {
        this.model = model;
        this.view = view;
        this.life_interval = null;
        this.life_loss_speed = life_loss_speed;

        this.view.updateHeart(this.model.getLifePercentage()); 
    }

    startDecreasingLife() {
        if (!this.life_interval) {
            this.life_interval = setInterval(() => {
                this.model.decreaseLife();
                this.view.updateHeart(this.model.getLifePercentage());
            }, 100 * this.life_loss_speed);
        }
    }

    stopDecreasingLife() {
        clearInterval(this.life_interval);
        this.life_interval = null;
    }


    updateCollisionState(collision_detected) {
        if (collision_detected) {
            this.startDecreasingLife();
        }
        else {
            this.stopDecreasingLife();
        }
    }
}
