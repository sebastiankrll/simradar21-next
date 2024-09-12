import { CronJob } from 'cron'
import { fetchVatsimData } from '../services/vatsim'

CronJob.from({
    cronTime: '* * * * * *',
    onTick: async () => {
        fetchVatsimData()
    },
    start: true,
    runOnInit: true
})