import {AlignmentType, ClickEventType, StateType} from "../types";
import {CTR, IMPRESSIONS, MM_DMA, SITE_ID} from "../../../data";

export const reduce: ReduceHelperType = (state, key) => () => {
    return state.reduce((total, current) => {
        total[current[key]] = [...(total[current[key]] || []), current]
        return total
    }, {} as ReduceHelperReturnType)
}

const CTR_TEXT = `CTR`
const EvPM_TEXT = `EvPM`

export const createTableHeadCellList: CreateTableHeadCellListType = (alignment, clickEvent) => () => {
    const clickEventType = clickEvent === CTR ? CTR_TEXT : EvPM_TEXT

    if (alignment === MM_DMA) return [MM_DMA, IMPRESSIONS, clickEventType]
    return [SITE_ID, IMPRESSIONS, clickEventType]
}

export const createTableBodyCellList: CreateTableBodyCellListHelperType = (MM_DMM_MAP, specificKey) =>
    () => {
        return Object.entries(MM_DMM_MAP).map(([key, list]) => {

            let regTimeOccurrences: Record<string, number> = {}
            list.forEach((impression, i) => {
                regTimeOccurrences[impression.reg_time] = (regTimeOccurrences[impression.reg_time] || 0) + 1;
            })
            let clickThroughCount = 0
            const regTimeOccurrencesList = Object.values(regTimeOccurrences)
            regTimeOccurrencesList.forEach(count => count > 1 ? clickThroughCount += 1 : clickThroughCount)

            const impressionsCount = regTimeOccurrencesList.length
            const ctr = (clickThroughCount / impressionsCount) * 100
            const evpm = (list.length / impressionsCount) * 1000

            return ({
                [specificKey]: key,
                impressions: impressionsCount,
                ctr: `${Math.round(ctr)}%`,
                evpm: Math.round(evpm)
            })
        })
    }

type CreateTableBodyCellListHelperType = (MM_DMM_MAP: ReduceHelperReturnType, specificKey: AlignmentType) => () => {
    [x: string]: string | number;
    ctr: string,
    evpm: number,
    impressions: number
}[]

type CreateTableHeadCellListType = (alignment: AlignmentType, clickEvent?: ClickEventType) => () => string[]

type ReduceHelperType = (state: StateType[], key: keyof StateType) =>
    () => ReduceHelperReturnType

type ReduceHelperReturnType = { [key: string]: StateType[] }