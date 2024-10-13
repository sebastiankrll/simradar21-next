import { getLiveData } from '@/components/map/utils/overlay'
import { FlightStore } from '@/types/zustand'
import { create } from 'zustand'

export const useFlightStore = create<FlightStore>((set, get) => ({
    feature: null,
    liveData: null,
    trackPoints: null,
    action: null,
    timer: null,
    setAction: (id) => set((state) => {
        if (state.action === id) return { action: null }
        return { action: id }
    }),
    setLiveData: (feature) => {
        if (feature === null) {
            const { timer } = get()
            if (timer === null) return
            clearInterval(timer)
            return
        }

        set((state) => ({ feature: state.feature = feature }))
        set((state) => ({ liveData: state.liveData = getLiveData(state.feature) }))

        const timerId = setInterval(() => {
            set((state) => ({ liveData: state.liveData = getLiveData(state.feature) }))
        }, 2000)
        set((state) => ({ timer: state.timer = timerId }))
    },
    setTrackPoints: (points) => set((state) => ({ trackPoints: state.trackPoints = points }))
}))