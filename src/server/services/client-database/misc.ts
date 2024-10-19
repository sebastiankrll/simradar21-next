import axios from "axios"
import { Feature, MultiPolygon } from "geojson"

export async function checkVersion(url: string, version: string): Promise<null | string> {
    try {
        const response = await axios.get(url)
        const release = response.data.tag_name

        if (release !== version) {
            return release
        }
    } catch (error) {
        console.error(`Error checking for updates: ${error}`)
    }

    return null
}

export function setLabelPosition(features: Feature<MultiPolygon>[]) {
    return features.map(feature => {
        if (!feature.properties) {
            feature.properties = {}
        }

        if (!feature.properties.label_lon && !feature.properties.label_lat) {
            let lonlat = null

            for (const multiPoly of feature.geometry.coordinates) {
                for (const ring of multiPoly) {
                    for (const coord of ring) {
                        if (!lonlat || coord[0] + coord[1] < lonlat[0] + lonlat[1]) {
                            lonlat = coord
                        }
                    }
                }
            }

            if (lonlat) {
                feature.properties.label_lon = lonlat[0]
                feature.properties.label_lat = lonlat[1]
            }
        }

        return feature
    })
}

export function closePolygons(features: Feature<MultiPolygon>[]) {
    return features.map(feature => {

        for (const multiPoly of feature.geometry.coordinates) {
            for (const ring of multiPoly) {
                const first = ring[0]
                const last = ring[ring.length - 1]

                if (first[0] !== last[0] || first[1] !== last[1]) {
                    ring.push(first)
                }
            }
        }

        return feature
    })
}