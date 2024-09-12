import { rawDataStorage, updateVatsimStorage, vatsimDataStorage } from '@/server/storage/vatsim'
import { VatsimData, VatsimTransceiversData } from '@/types/data/vatsim'
import axios from 'axios'
import { createClient } from 'redis'

const redisPub = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect()

let dataUpdateInProgress = false

export async function fetchVatsimData() {
    if (dataUpdateInProgress) return

    dataUpdateInProgress = true

    try {
        const vatsimData = await axios.get<VatsimData>('https://data.vatsim.net/v3/vatsim-data.json')

        if (!rawDataStorage.vatsim || vatsimData.data.general.update > rawDataStorage.vatsim?.general.update) {
            const transceivers = await axios.get<VatsimTransceiversData[]>('https://data.vatsim.net/v3/transceivers-data.json')

            rawDataStorage.vatsim = vatsimData.data
            rawDataStorage.transveivers = transceivers.data

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
    console.log('VATSIM data updated.')
}

function pushVatsimStorage() {
    redisPub.publish('vatsim_storage', JSON.stringify(vatsimDataStorage))
}