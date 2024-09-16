import { getRawStorage, getVatsimStorage, setRawStorage, updateVatsimStorage } from '@/storage/vatsim'
import { VatsimData, VatsimTransceiversData } from '@/types/vatsim'
import axios from 'axios'
import { Redis } from 'ioredis'

const redisPub = new Redis()

let dataUpdateInProgress = false

export async function fetchVatsimData() {
    const rawDataStorage = getRawStorage()
    if (dataUpdateInProgress) return

    dataUpdateInProgress = true

    try {
        const vatsimData = await axios.get<VatsimData>('https://data.vatsim.net/v3/vatsim-data.json')

        if (!rawDataStorage.vatsim || vatsimData.data.general.update > rawDataStorage.vatsim?.general.update) {
            const transceivers = await axios.get<VatsimTransceiversData[]>('https://data.vatsim.net/v3/transceivers-data.json')

            rawDataStorage.vatsim = vatsimData.data
            rawDataStorage.transveivers = transceivers.data

            setRawStorage(rawDataStorage)
            updateVatsimData()
        }
    } catch (error) {
        console.error('Error fetching VATSIM data from API:', error)
        throw error
    }

    dataUpdateInProgress = false
}

function updateVatsimData() {
    updateVatsimStorage()
    pushVatsimStorage()
    console.log(new Date().toISOString() + ': VATSIM data updated.')
}

function pushVatsimStorage() {
    const vatsimDataStorage = getVatsimStorage()
    redisPub.publish('vatsim_storage', JSON.stringify(vatsimDataStorage))
}