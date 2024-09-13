import { Layer } from 'ol/layer'
import { Options } from 'ol/layer/Layer'
import { VectorStyle } from 'ol/render/webgl/VectorStyleRenderer'
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js'
import aircraftSprite from '@/assets/images/sprites/aircraftSprite.png'
import airportSprite from '@/assets/images/sprites/airportSprite.png'
import airportLabelSprite from '@/assets/images/sprites/airportLabelSprite.png'

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

export const webglConfig = {
    flights: {
        variables: {
            callsign: 'all'
        },
        filter: [
            'any',
            ['==', ['var', 'callsign'], 'all'],
            ['==', ['var', 'callsign'], ['get', 'callsign']],
        ],
        'icon-src': aircraftSprite.src,
        'icon-size': [49, 44],
        'icon-offset': [
            'case', ['==', ['get', 'hover'], 0], [
                'match', ['get', 'shape'],
                'A225', [0, 44],
                'A306', [0, 88],
                'A310', [0, 132],
                'A318', [0, 176],
                'A319', [0, 220],
                'A19N', [0, 220],
                'A320', [0, 264],
                'A20N', [0, 264],
                'A321', [0, 308],
                'A21N', [0, 308],
                'A332', [0, 352],
                'A338', [0, 352],
                'A333', [0, 396],
                'A339', [0, 396],
                'A337', [0, 440],
                'A343', [0, 484],
                'A346', [0, 528],
                'A359', [0, 572],
                'A35K', [0, 616],
                'A388', [0, 660],
                'AT43', [0, 704],
                'AT45', [0, 704],
                'AT46', [0, 704],
                'AT72', [0, 748],
                'AT73', [0, 748],
                'AT75', [0, 748],
                'AT76', [0, 748],
                'B461', [0, 792],
                'B462', [0, 836],
                'B463', [0, 880],
                'B736', [0, 924],
                'B737', [0, 968],
                'B37M', [0, 968],
                'B738', [0, 1012],
                'B38M', [0, 1012],
                'B739', [0, 1056],
                'B39M', [0, 1056],
                'B744', [0, 1100],
                'B748', [0, 1144],
                'B752', [0, 1188],
                'B753', [0, 1232],
                'B762', [0, 1276],
                'B763', [0, 1320],
                'B764', [0, 1364],
                'B772', [0, 1408],
                'B77L', [0, 1408],
                'B773', [0, 1452],
                'B77W', [0, 1452],
                'B788', [0, 1496],
                'B789', [0, 1540],
                'B78X', [0, 1584],
                'BLCF', [0, 1628],
                'C25A', [0, 1672],
                'C25B', [0, 1672],
                'C25C', [0, 1672],
                'C525', [0, 1672],
                'C30J', [0, 1716],
                'C500', [0, 1760],
                'C550', [0, 1760],
                'C560', [0, 1760],
                'C56X', [0, 1760],
                'C5M', [0, 1804],
                'C700', [0, 1848],
                'C750', [0, 1848],
                'CRJ7', [0, 1892],
                'CRJ9', [0, 1936],
                'CRJX', [0, 1980],
                [0, 264]
            ], [
                'match', ['get', 'shape'],
                'A225', [49, 44],
                'A306', [49, 88],
                'A310', [49, 132],
                'A318', [49, 176],
                'A319', [49, 220],
                'A19N', [49, 220],
                'A320', [49, 264],
                'A20N', [49, 264],
                'A321', [49, 308],
                'A21N', [49, 308],
                'A332', [49, 352],
                'A338', [49, 352],
                'A333', [49, 396],
                'A339', [49, 396],
                'A337', [49, 440],
                'A343', [49, 484],
                'A346', [49, 528],
                'A359', [49, 572],
                'A35K', [49, 616],
                'A388', [49, 660],
                'AT43', [49, 704],
                'AT45', [49, 704],
                'AT46', [49, 704],
                'AT72', [49, 748],
                'AT73', [49, 748],
                'AT75', [49, 748],
                'AT76', [49, 748],
                'B461', [49, 792],
                'B462', [49, 836],
                'B463', [49, 880],
                'B736', [49, 924],
                'B737', [49, 968],
                'B37M', [49, 968],
                'B738', [49, 1012],
                'B38M', [49, 1012],
                'B739', [49, 1056],
                'B39M', [49, 1056],
                'B744', [49, 1100],
                'B748', [49, 1144],
                'B752', [49, 1188],
                'B753', [49, 1232],
                'B762', [49, 1276],
                'B763', [49, 1320],
                'B764', [49, 1364],
                'B772', [49, 1408],
                'B77L', [49, 1408],
                'B773', [49, 1452],
                'B77W', [49, 1452],
                'B788', [49, 1496],
                'B789', [49, 1540],
                'B78X', [49, 1584],
                'BLCF', [49, 1628],
                'C25A', [49, 1672],
                'C25B', [49, 1672],
                'C25C', [49, 1672],
                'C525', [49, 1672],
                'C30J', [49, 1716],
                'C500', [49, 1760],
                'C550', [49, 1760],
                'C560', [49, 1760],
                'C56X', [49, 1760],
                'C5M', [49, 1804],
                'C700', [49, 1848],
                'C750', [49, 1848],
                'CRJ7', [49, 1892],
                'CRJ9', [49, 1936],
                'CRJX', [49, 1980],
                [49, 264]
            ]
        ],
        'icon-rotate-with-view': true,
        'icon-scale': ['array',
            ['interpolate', ['exponential', 2], ['zoom'], 16.5, 1, 18, Math.pow(2, 1.5)],
            ['interpolate', ['exponential', 2], ['zoom'], 16.5, 1, 18, Math.pow(2, 1.5)]
        ],
        'icon-rotation': ['+',
            ['get', 'prevRotation'],
            ['*',
                ['clamp', ['-', ['time'], ['get', 'tOffset']], 0, 1],
                ['case',
                    ['>', ['-', ['get', 'rotation'], ['get', 'prevRotation']], Math.PI],
                    ['-', ['-', ['get', 'rotation'], ['get', 'prevRotation']], ['*', 2, Math.PI]],
                    ['<', ['-', ['get', 'rotation'], ['get', 'prevRotation']], -Math.PI],
                    ['+', ['-', ['get', 'rotation'], ['get', 'prevRotation']], 2 * Math.PI],
                    ['-', ['get', 'rotation'], ['get', 'prevRotation']]
                ]
            ]
        ]
    },
    shadows: {
        variables: {
            callsign: 'all'
        },
        filter: [
            'any',
            ['==', ['var', 'callsign'], 'all'],
            ['==', ['var', 'callsign'], ['get', 'callsign']],
        ],
        'icon-src': aircraftSprite.src,
        'icon-size': [49, 44],
        'icon-offset': [
            'match', ['get', 'shape'],
            'A225', [98, 44],
            'A306', [98, 88],
            'A310', [98, 132],
            'A318', [98, 176],
            'A319', [98, 220],
            'A19N', [98, 220],
            'A320', [98, 264],
            'A20N', [98, 264],
            'A321', [98, 308],
            'A21N', [98, 308],
            'A332', [98, 352],
            'A338', [98, 352],
            'A333', [98, 396],
            'A339', [98, 396],
            'A337', [98, 440],
            'A343', [98, 484],
            'A346', [98, 528],
            'A359', [98, 572],
            'A35K', [98, 616],
            'A388', [98, 660],
            'AT43', [98, 704],
            'AT45', [98, 704],
            'AT46', [98, 704],
            'AT72', [98, 748],
            'AT73', [98, 748],
            'AT75', [98, 748],
            'AT76', [98, 748],
            'B461', [98, 792],
            'B462', [98, 836],
            'B463', [98, 880],
            'B736', [98, 924],
            'B737', [98, 968],
            'B37M', [98, 968],
            'B738', [98, 1012],
            'B38M', [98, 1012],
            'B739', [98, 1056],
            'B39M', [98, 1056],
            'B744', [98, 1100],
            'B748', [98, 1144],
            'B752', [98, 1188],
            'B753', [98, 1232],
            'B762', [98, 1276],
            'B763', [98, 1320],
            'B764', [98, 1364],
            'B772', [98, 1408],
            'B77L', [98, 1408],
            'B773', [98, 1452],
            'B77W', [98, 1452],
            'B788', [98, 1986],
            'B789', [98, 1540],
            'B78X', [98, 1584],
            'BLCF', [98, 1628],
            'C25A', [98, 1672],
            'C25B', [98, 1672],
            'C25C', [98, 1672],
            'C525', [98, 1672],
            'C30J', [98, 1716],
            'C500', [98, 1760],
            'C550', [98, 1760],
            'C560', [98, 1760],
            'C56X', [98, 1760],
            'C5M', [98, 1804],
            'C700', [98, 1848],
            'C750', [98, 1848],
            'CRJ7', [98, 1892],
            'CRJ9', [98, 1936],
            'CRJX', [98, 1980],
            [98, 264]
        ],
        'icon-rotate-with-view': true,
        'icon-opacity': 0.3,
        'icon-scale': ['array',
            ['interpolate', ['exponential', 2], ['zoom'], 16.5, 1, 18, Math.pow(2, 1.5)],
            ['interpolate', ['exponential', 2], ['zoom'], 16.5, 1, 18, Math.pow(2, 1.5)]
        ],
        'icon-displacement': ['array',
            ['interpolate', ['exponential', 2], ['zoom'], 16.5, [
                'interpolate', ['linear'], ['get', 'altitude'], 3000, ['*', ['sqrt', 2], ['cos', ['-', ['get', 'rotation'], Math.PI / 4]]], 45000, ['*', 4, ['*', ['sqrt', 2], ['cos', ['-', ['get', 'rotation'], Math.PI / 4]]]]
            ], 18, ['*', [
                'interpolate', ['linear'], ['get', 'altitude'], 3000, ['*', ['sqrt', 2], ['cos', ['-', ['get', 'rotation'], Math.PI / 4]]], 45000, ['*', 4, ['*', ['sqrt', 2], ['cos', ['-', ['get', 'rotation'], Math.PI / 4]]]]
            ], Math.pow(2, 1.5)]],
            ['interpolate', ['exponential', 2], ['zoom'], 16.5, [
                'interpolate', ['linear'], ['get', 'altitude'], 3000, ['*', ['sqrt', 2], ['sin', ['-', ['get', 'rotation'], Math.PI / 4]]], 45000, ['*', 4, ['*', ['sqrt', 2], ['sin', ['-', ['get', 'rotation'], Math.PI / 4]]]]
            ], 18, ['*', [
                'interpolate', ['linear'], ['get', 'altitude'], 3000, ['*', ['sqrt', 2], ['sin', ['-', ['get', 'rotation'], Math.PI / 4]]], 45000, ['*', 4, ['*', ['sqrt', 2], ['sin', ['-', ['get', 'rotation'], Math.PI / 4]]]]
            ], Math.pow(2, 1.5)]]
        ],
        'icon-rotation': ['+',
            ['get', 'prevRotation'],
            ['*',
                ['clamp', ['-', ['time'], ['get', 'tOffset']], 0, 1],
                ['case',
                    ['>', ['-', ['get', 'rotation'], ['get', 'prevRotation']], Math.PI],
                    ['-', ['-', ['get', 'rotation'], ['get', 'prevRotation']], ['*', 2, Math.PI]],
                    ['<', ['-', ['get', 'rotation'], ['get', 'prevRotation']], -Math.PI],
                    ['+', ['-', ['get', 'rotation'], ['get', 'prevRotation']], 2 * Math.PI],
                    ['-', ['get', 'rotation'], ['get', 'prevRotation']]
                ]
            ]
        ]
    },
    airports: {
        variables: {
            show: 'all',
        },
        filter: ['all', ['in', ['get', 'type'], [
            'literal', [
                ['case', ['<', ['resolution'], 3000], 'large_airport', 'none'],
                ['case', ['<', ['resolution'], 1000], 'medium_airport', 'none'],
                ['case', ['<', ['resolution'], 300], 'small_airport', 'none']
            ]
        ]],
            ['==', ['var', 'show'], 'all']
        ],
        'icon-src': airportSprite.src,
        'icon-size': [32, 32],
        'icon-offset': ['case',
            ['==', ['get', 'hover'], '1'], [32, 0],
            [0, 0]
        ],
        'icon-scale': ['case',
            ['==', ['get', 'type'], 'small_airport'], 0.7,
            ['==', ['get', 'type'], 'medium_airport'], 0.85,
            1
        ],
        'icon-rotate-with-view': false
    },
    airportTops: {
        'icon-src': airportSprite.src,
        'icon-size': [32, 32],
        'icon-offset': ['case',
            ['==', ['get', 'hover'], '1'], [32, 0],
            [0, 0]
        ],
        'icon-scale': ['case',
            ['==', ['get', 'type'], 'small_airport'], 0.7,
            ['==', ['get', 'type'], 'medium_airport'], 0.85,
            1
        ],
        'icon-rotate-with-view': false
    },
    airportLabels: {
        variables: {
            dep: '',
            arr: '',
        },
        filter: ['any',
            ['==', ['var', 'dep'], ['get', 'icao']],
            ['==', ['var', 'arr'], ['get', 'icao']],
            ['==', ['var', 'dep'], '']
        ],
        'icon-src': airportLabelSprite.src,
        'icon-size': [36, 36],
        'icon-offset': ['case',
            ['any',
                ['all', ['==', ['get', 'type'], 'small_airport'], ['<', ['resolution'], 300]],
                ['all', ['==', ['get', 'type'], 'medium_airport'], ['<', ['resolution'], 1000]],
                ['all', ['==', ['get', 'type'], 'large_airport'], ['<', ['resolution'], 3000]],
                ['==', ['var', 'dep'], ['get', 'icao']],
                ['==', ['var', 'arr'], ['get', 'icao']],
            ], ['array', 0, ['get', 'offset']],
            ['array', 36, ['get', 'offset']]
        ],
        'icon-scale': ['array',
            ['*',
                ['case',
                    ['==', ['get', 'type'], 'small_airport'], 0.7,
                    ['==', ['get', 'type'], 'medium_airport'], 0.85,
                    1
                ],
                ['case',
                    ['any',
                        ['==', ['var', 'dep'], ['get', 'icao']],
                        ['==', ['var', 'arr'], ['get', 'icao']],
                    ], 1,
                    ['interpolate', ['exponential', 2], ['zoom'], 3, 0.6, 5, 1]
                ]
            ],
            ['*',
                ['case',
                    ['==', ['get', 'type'], 'small_airport'], 0.7,
                    ['==', ['get', 'type'], 'medium_airport'], 0.85,
                    1
                ],
                ['case',
                    ['any',
                        ['==', ['var', 'dep'], ['get', 'icao']],
                        ['==', ['var', 'arr'], ['get', 'icao']],
                    ], 1,
                    ['interpolate', ['exponential', 2], ['zoom'], 3, 0.6, 5, 1]
                ]
            ]
        ],
        'icon-rotate-with-view': false
    },
    sun: {
        'fill-color': [77, 95, 131, 0.07]
    },
    firs: {
        'stroke-color': ['case', ['==', ['get', 'type'], 'tracon'], [222, 89, 234], [77, 95, 131]],
        'stroke-width': 1,
        'stroke-offset': 0,
        'fill-color': ['case', ['==', ['get', 'hover'], 1],
            ['case', ['==', ['get', 'type'], 'tracon'], [222, 89, 234, 0.4], [77, 95, 131, 0.4]],
            ['case', ['==', ['get', 'type'], 'tracon'], [222, 89, 234, 0.1], [77, 95, 131, 0.1]]
        ]
    }
}