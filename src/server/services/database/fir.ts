import axios from "axios"
import AdmZip from 'adm-zip'
import { Feature, FeatureCollection, MultiPolygon } from "geojson"
import { checkVersion, closePolygons, setLabelPosition } from "./misc"

let prefixes: { [key: string]: string } = {}

export async function updateFIRs(version: string): Promise<{ version: string, data: Feature<MultiPolygon>[] }> {
    const newVersion = await checkVersion('https://api.github.com/repos/vatsimnetwork/vatspy-data-project/releases/latest', version)
    if (!newVersion) return { version: version, data: [] }

    try {
        const response = await axios({
            url: 'https://github.com/vatsimnetwork/vatspy-data-project/archive/refs/heads/master.zip',
            method: 'GET',
            responseType: 'arraybuffer',
        })

        const zip = new AdmZip(response.data)
        const zipEntries = zip.getEntries()
        const general = zipEntries.find(entry => entry.entryName.includes('VATSpy.dat'))?.getData().toString('utf-8')
        if (!general) return { version: version, data: [] }

        const firs = extractFIRs(general)
        const boundsJSON = zipEntries.find(entry => entry.entryName.includes('Boundaries.geojson'))?.getData().toString('utf-8')
        if (!boundsJSON) return { version: version, data: [] }

        const bounds = JSON.parse(boundsJSON) as FeatureCollection<MultiPolygon>
        const newFeatures = bounds.features.map(feature => {
            if (!feature.properties) feature.properties = {}
            feature.properties.name = firs[feature.properties.id]

            return feature
        })
        const labeledFeatures = setLabelPosition(newFeatures)
        const fixedFeatures = closePolygons(labeledFeatures)

        return { version: newVersion, data: fixedFeatures }
    } catch (error) {
        console.error(`Error checking for new FIR data: ${error}`)
    }

    return { version: version, data: [] }
}

function extractFIRs(data: string) {
    prefixes = {}

    const sectionStart = data.indexOf('[FIRs]')
    if (sectionStart === -1) {
        return {}
    }

    const lines = data.slice(sectionStart).split('\r\n')
    const firs: typeof prefixes = {}

    for (let line of lines) {
        line = line.trim()

        if (line === '') {
            break
        }

        if (line.startsWith(';') || line.startsWith('[FIRs]')) {
            continue
        }

        const [icao, name, prefix] = line.split('|')

        if (prefix === '') {
            prefixes[icao] = icao
        } else {
            prefixes[prefix] = icao
        }

        firs[icao] = name
    }

    return firs
}