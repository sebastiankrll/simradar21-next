import { SliderStore } from '@/types/zustand'
import { create } from 'zustand'

export const useSliderStore = create<SliderStore>((set) => ({
    page: '',
    setPage: (newPage) => set((state) => ({ page: state.page = newPage }))
}))