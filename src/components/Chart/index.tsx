import {LineChart} from '@mui/x-charts/LineChart';
import {MouseEvent, useState} from "react";
import {ImpressionType} from "./helpers";
import useChartsData, {COMPOSITE_TYPE, CTR_TYPE, EV_PM_TYPE} from "./hooks/useChartsData";
import {Box, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {COMPOSED, CTR, EV_PM} from "../../data";

export default () => {
    const [impressionType, setImpressionType] = useState<ImpressionType>(CTR_TYPE);
    const chartsDataAPI = useChartsData()
    const [alignment, setAlignment] = useState<AlignmentType>('ctr');

    const onChange: OnChangeType = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const ctr = (chartsDataAPI.clicksRate / chartsDataAPI.timePoints.length) * 100
    const evpm = (chartsDataAPI.impressionsRate / chartsDataAPI.timePoints.length) * 1000

    const IMPRESSIONS_RATE = {
        [CTR]: ctr,
        [EV_PM]: evpm,
        [COMPOSED]: {ctr, evpm}
    }

    const series = impressionType === CTR_TYPE ?
        [{data: chartsDataAPI.ctrSeriesData}] :
        impressionType === EV_PM_TYPE ?
            [{data: chartsDataAPI.evPmSeriesData}] :
            [{data: chartsDataAPI.ctrSeriesData}, {data: chartsDataAPI.evPmSeriesData}]

    const onClick: onClickType = (type) =>
        () => setImpressionType(type)

    return (
        <div>
            <Box sx={{width: 'max-content', margin: 'auto'}}>
                <LineChart
                    xAxis={[{data: chartsDataAPI.timePoints}]}
                    series={series}
                    width={1000}
                    height={400}
                />
            </Box>

            <div style={{width: 'max-content', margin: 'auto', marginTop: '18px'}}>
                {alignment === COMPOSED && (
                    <>
                        <div>CTR - {Math.round(IMPRESSIONS_RATE[COMPOSED][CTR])} %</div>
                        <div>EvPM - {Math.round(IMPRESSIONS_RATE[COMPOSED][EV_PM])}</div>
                    </>
                )}
                {alignment === CTR && <div>CTR - {Math.round(IMPRESSIONS_RATE[CTR])} %</div>}
                {alignment === EV_PM && <div>CTR - {Math.round(IMPRESSIONS_RATE[EV_PM])}</div>}
            </div>

            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '18px'}}>
                <ToggleButtonGroup color="primary" onChange={onChange} value={alignment} exclusive>
                    <ToggleButton value="ctr" onClick={onClick(CTR_TYPE)}>
                        CTR
                    </ToggleButton>

                    <ToggleButton value="evpm" onClick={onClick(EV_PM_TYPE)}>
                        EvPM
                    </ToggleButton>

                    <ToggleButton value="composed" onClick={onClick(COMPOSITE_TYPE)}>
                        Composed
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </div>
    );
}
type onClickType = (type: ImpressionType) => () => void
type OnChangeType = (event: MouseEvent<HTMLElement>, newAlignment: AlignmentType) => void
type AlignmentType = `ctr` | `evpm` | `composed`

