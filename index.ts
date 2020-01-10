const w : number = window.innerWidth
const h : number = window.innerHeight
const nodes : number = 5
const tracks : number = 5
const scGap : number = 0.02 / tracks
const strokeFactor : number = 90
const sizeFactor : number = 2.9
const foreColor : string = "indigo"
const backColor : string = "#bdbdbd"
const delay : number = 15
class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }

    static sinify(scale : number) : number {
        return Math.sin(scale * Math.PI)
    }
}

class DrawingUtil {

    static drawMovingSquare(context : CanvasRenderingContext2D, i : number, w : number, scale : number) {
        const gap : number = w / tracks
        const sf : number = ScaleUtil.sinify(scale)
        const sfi : number = ScaleUtil.divideScale(sf, i, tracks)
        const sfi1 : number = ScaleUtil.divideScale(sfi, 0, 2)
        const sfi2 : number = ScaleUtil.divideScale(sfi, 1, 2)
        context.save()
        context.translate(i * gap, -gap)
        context.fillRect(gap * sfi2, 0, gap * sfi1 - gap * sfi1, gap)
        context.restore()
    }

    static drawMSSNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.fillStyle = foreColor
        const gap : number = h / (nodes + 1)
        context.save()
        context.translate(0, gap * (i + 1))
        const scDiv : number = scale / tracks
        DrawingUtil.drawMovingSquare(context, Math.floor(scale / scDiv), w, scale)
        context.restore()
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += this.dir * scGap
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {

    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, delay)
        }
    }

    stop(cb : Function) {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class SSMNode {

    next : SSMNode
    prev : SSMNode
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i <  nodes - 1) {
            this.next = new SSMNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawMSSNode(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : SSMNode {
        var curr : SSMNode = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class SquareStepMover {

    curr : SSMNode = new SSMNode(0)
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.curr.draw(context)
    }

    update(cb : Function) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : Function) {
        this.curr.startUpdating(cb)
    }
}
