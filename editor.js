class RectangleDrawerContext {

    constructor(canvas) {
        this.canvas = canvas;
        this.count = 0;
        this.draw = false;
        this.element = null;
        this.last_rect = null;
        this.mouse = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
    }

    setMousePosition(event) {
        this.mouse.x1 = event.pageX + window.pageXOffset;
        this.mouse.y1 = event.pageY + window.pageYOffset;
    }

    updateElementShape() {
        if (this.element !== null) {
            this.element.style.width = Math.abs(this.mouse.x1 - this.mouse.x2) + 'px';
            this.element.style.height = Math.abs(this.mouse.y1 - this.mouse.y2) + 'px';
            this.element.style.left = (this.mouse.x1 < this.mouse.x2) ? this.mouse.x1 + 'px' : this.mouse.x2 + 'px';
            this.element.style.top = (this.mouse.y1 < this.mouse.y2) ? this.mouse.y1 + 'px' : this.mouse.y2 + 'px';
        }
    }

    enableDrawing() { this.draw = true; }
    disableDrawing() { this.draw = false; }

    createRectangle() {
        this.element = document.createElement('div');
        this.element.className = 'rectangle';
        this.element.style.left = this.mouse.x1 + 'px';
        this.element.style.top = this.mouse.y1 + 'px';
        this.canvas.appendChild(this.element);
    }

    mouseMoveHandler(event) {
        this.setMousePosition(event);
        this.updateElementShape();
    }

    mouseClickHandler() {
        if (this.element !== null) {
            this.canvas.style.cursor = "default";
            this.last_rect = this.element;
            this.element = null;
            this.count = this.count + 1;
        }
        else if (this.count < MAX_RECT_COUNT && this.draw) {
            this.mouse.x2 = this.mouse.x1;
            this.mouse.y2 = this.mouse.y1;
            this.createRectangle();
            this.canvas.style.cursor = "crosshair";
        }
    }
}

var drawer = new RectangleDrawerContext(document.getElementById('camera-image-canvas'));
drawer.canvas.addEventListener('mousemove', (event) => { drawer.mouseMoveHandler(event); });
drawer.canvas.addEventListener('click', (event) => { drawer.mouseClickHandler(); });
drawer.draw = true;

const MAX_RECT_COUNT = 8;
