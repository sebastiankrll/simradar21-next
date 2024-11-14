import { Layer } from 'ol/layer'
import { Options } from 'ol/layer/Layer'
import { VectorStyle } from 'ol/render/webgl/VectorStyleRenderer'
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js'

export class WebGLLayer extends Layer {
    style: VectorStyle | null

    constructor(options: Options & { style?: VectorStyle }) {
        super(options)
        this.style = options.style || null
    }

    createRenderer() {
        return new WebGLVectorLayerRenderer(this, {
            style: this.style as VectorStyle,
        })
    }
}