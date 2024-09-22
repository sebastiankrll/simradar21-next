import { getLiveData } from '@/components/map/utils/overlays'
import { FlightStore } from '@/types/zustand'
import { create } from 'zustand'

export const useFlightStore = create<FlightStore>((set, get) => ({
    feature: null,
    liveData: null,
    trackData: null,
    timer: null,
    updateLiveData: (feature) => {
        set((state) => ({ feature: state.feature = feature }))

        const timerId = setInterval(() => {
            set((state) => ({ liveData: state.liveData = getLiveData(state.feature) }))
        }, 2000)
        set((state) => ({ liveData: state.liveData = getLiveData(state.feature) }))

        set((state) => ({ timer: state.timer = timerId }))
    },
    resetLiveData: () => {
        const { timer } = get()
        if (timer === null) return
        clearInterval(timer)
    },
    setTrackData: (points) => set((state) => ({ trackData: state.trackData = points }))
}))