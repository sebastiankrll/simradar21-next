import { CronJob } from 'cron'
import { fetchVatsimData } from '../services/vatsim'

CronJob.from({
    cronTime: '* * * * * *',
    onTick: async () => {
        await fetchVatsimData()
    },
    start: true,
    runOnInit: true
})