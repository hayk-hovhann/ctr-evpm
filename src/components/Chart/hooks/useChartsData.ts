import {useEffect, useState} from "react";
import y from "../../../mockData/y.json";

export const FIRST_CLICK = `fclick`
export const REGISTRATION = `registration`
export const CTR_TYPE = `CTR`
export const EV_PM_TYPE = `EV_PM`
export const COMPOSITE_TYPE = `CTR_EV_PM`

const useChartsData = () => {
    const [state, setState] = useState(y.slice(1, 50));
    const [chartData, setChartData] = useState<ChartDataType | null>(null);

    useEffect(() => {
        if (state) {
            const data: InitDataType = state.reduce((total, current, i) => {
                    const isPrevImpression = new RegExp(`v?${REGISTRATION}$`).test(current.tag)

                    const prevClick = current.tag === FIRST_CLICK || /^v.*/.test(current.tag) ? total.prevClick + 1 : total.prevClick
                    const prevImpression = isPrevImpression ? total.prevImpression + 1 : total.prevImpression

                    return {
                        prevClick,
                        prevImpression,
                        seriesData: [...total.seriesData, {timePoint: i, click: prevClick, impression: prevImpression}],
                    }
                },
                initData
            )

            const ctrSeriesData = data.seriesData.map(({click}) => click)
            const evPmSeriesData = data.seriesData.map(({impression}) => impression)
            const clicksRate = data.prevClick
            const impressionsRate = data.prevImpression

            setChartData({ctrSeriesData, evPmSeriesData, clicksRate, impressionsRate})
            console.log(data)
        }

    }, [state?.length])

    return ({
        ctrSeriesData: chartData?.ctrSeriesData || [],
        evPmSeriesData: chartData?.evPmSeriesData || [],
        clicksRate: chartData?.clicksRate || 0,
        impressionsRate: chartData?.impressionsRate || 0,
        timePoints: state.map((_, i) => i) || 0
    })
}

export default useChartsData

const initData: InitDataType = {
    prevClick: 0,
    prevImpression: 0,
    seriesData: []
}

type ChartDataType = {
    ctrSeriesData: number[],
    evPmSeriesData: number[],
    clicksRate: number,
    impressionsRate: number
}

type InitDataType = {
    prevClick: number,
    prevImpression: number,
    seriesData: { timePoint: number, click: number, impression: number }[]
}