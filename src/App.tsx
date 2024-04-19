import Chart from "./components/Chart";
import {Box, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {useState, MouseEvent} from "react";
import Table from "./components/Table";
import {CHART} from "./data";


export default () => {
    const [alignment, setAlignment] = useState(CHART);

    const handleChange = (
        event: MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);
        console.log(newAlignment)
    };

    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Chart"
                >
                    <ToggleButton value="chart">Chart</ToggleButton>
                    <ToggleButton value="table">Table</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {alignment === CHART ?  <Chart/> : <Table/>}

        </>
    )
}



