class OverlayBot {

	/**
	 * OverlayBot constructor. Overlay for a single Bot
	 * @param {object} overlay the actual overlay object in the html structure
     * @param {string} serial serial ID of the bot
	 */
    constructor(overlay, serial, socket) {
        this.overlay = overlay;
        this.serial = serial
        this.socket = socket;
        this.overlay.attr("id", "overlay-bot" + serial);
        this.overlay.on('click',(event) => {
            this.hide();
        });
        this.isHidden = true;
    }
        
    /**
	 * make the overlay visible over the bot 
	 * @param {string} title title to be displayed on overlay
	 */
	show(service) {
        if (this.isHidden) {
            this.isHidden = false;
            this.overlay.show("scale");
            this.overlay.find("h4").text(JSON.stringify(service));
        }
    }

    hide() {
        this.isHidden = true;
        this.overlay.children(".overlay_card").remove();
        this.overlay.hide("scale");
    }
}