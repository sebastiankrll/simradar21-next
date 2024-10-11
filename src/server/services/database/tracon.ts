import axios from "axios"
import AdmZip from 'adm-zip'
import { Feature, MultiPolygon } from "geojson"
import { checkVersion, closePolygons, setLabelPosition } from "./misc"

let prefixes: { [key: string]: string } = {}

export async function updateTRACONs(version: string): Promise<{ version: string, data: Feature<MultiPolygon>[] }> {
    const newVersion = await checkVersion('https://api.github.com/repos/vatsimnetwork/simaware-tracon-project/releases/latest', version)
    if (!newVersion) return { version: version, data: [] }

    const features = [] as Feature<MultiPolygon>[]

    try {
        const response = await axios({
            url: 'https://github.com/vatsimnetwork/simaware-tracon-project/archive/refs/heads/main.zip',
            method: 'GET',
            responseType: 'arraybuffer',
        })

        const zip = new AdmZip(response.data)
        const zipEntries = zip.getEntries()

        zipEntries.forEach((entry) => {
            const entryName = entry.entryName

            if (entryName.startsWith('simaware-tracon-project-main/Boundaries') && entryName.endsWith('.json')) {
                const jsonData = entry.getData().toString('utf8')
                const feature = JSON.parse(jsonData)

                if (feature.properties) {
                    if (feature.properties.suffix) {
                        feature.properties.id = feature.properties.prefix[0] + '_' + feature.properties.suffix
                    } else {
                        feature.properties.id = feature.properties.prefix[0]
                    }

                    prefixes[feature.properties.id] = feature.properties.id
                    features.push(feature)
                }
            }
        })

        const labeledFeatures = setLabelPosition(features)
        const fixedFeatures = closePolygons(labeledFeatures)

        return { version: newVersion, data: fixedFeatures }
    } catch (error) {
        console.error('Error checking for new TRACON data:', error)
    }

    return { version: version, data: [] }
}