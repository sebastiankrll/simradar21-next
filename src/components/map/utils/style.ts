import { FeatureLike } from 'ol/Feature'
import { Fill, Style, Text } from 'ol/style'
import { StyleLike } from 'ol/style/Style'

export function getFIRStyle(feature: FeatureLike, resolution: number): StyleLike | undefined {
    let maxResolution = 4000

    if (feature.get('type') === 'tracon') {
        maxResolution = 3000
    }

    if (resolution >= maxResolution) {
        return
    }

    return new Style({
        text: new Text({
            text: feature.get('desc'),
            font: '600 12px Manrope, sans-serif',
            fill: new Fill({ color: 'white' }),
            backgroundFill: feature.get('hover') === 0 ? new Fill({ color: 'rgb(77, 95, 131)' }) : new Fill({ color: 'rgb(234, 89, 121)' }),
            padding: [4, 3, 2, 5],
            textAlign: 'center'
        }),
    })
}