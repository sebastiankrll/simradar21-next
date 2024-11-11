import { CronJob } from 'cron'
import { updateVatsimData } from '../services/vatsim'
import { updateDatabaseData } from '../services/client-database'

CronJob.from({
    cronTime: '* * * * * *',
    onTick: async () => {
        await updateVatsimData()
    },
    start: true,
    runOnInit: true
})

CronJob.from({
    cronTime: '0 6 * * *',
    onTick: async () => {
        await updateDatabaseData()
    },
    start: true,
    runOnInit: true,
    timeZone: 'utc'
})