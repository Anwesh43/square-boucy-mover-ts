const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.02
const strokeFactor : number = 90
const sizeFactor : number = 2.9
const foreColor : string = "indigo"
const backColor : string = "#bdbdbd"
const nodes : number = 5
const tracks : number = 5

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
