import { getLiveData } from '@/components/map/utils/overlays'
import { FlightStore } from '@/types/zustand'
import { create } from 'zustand'

export const useFlightStore = create<FlightStore>((set, get) => ({
    feature: null,
    liveData: null,
    timer: null,
    updateData: (feature) => {
        set((state) => ({ feature: state.feature = feature }))

        const timerId = setInterval(() => {
            set((state) => ({ liveData: state.liveData = getLiveData(state.feature) }))
        }, 2000)
        set((state) => ({ liveData: state.liveData = getLiveData(state.feature) }))

        set((state) => ({ timer: state.timer = timerId }))
    },
    resetData: () => {
        const { timer } = get()
        if (timer === null) return
        clearInterval(timer)
        console.log('Timer reset')
    }
}))