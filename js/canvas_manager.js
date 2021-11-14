
class CanvasManager {
    constructor() {
        let $mainCanvas = $('#mainCanvas');
        this.canvas = $mainCanvas.get(0);
        this.canvas.width = $mainCanvas.parent().width();
        this.canvas.height = $('#commitColumn').height();
        this.ctx = this.canvas.getContext('2d');
    }

    updateCommitTable(entryList) {
        let self = this;

        self.canvas.height = entryList.length * 30;
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

        let y = 20;
        for (let entry of entryList) {
            new CanvasRow(20, y, entry).draw(self.ctx, self.canvas);
            y += 30;
        }
    }
}
