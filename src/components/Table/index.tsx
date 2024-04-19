import {ChangeEvent, MouseEvent, useMemo, useState} from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import x from "../../mockData/x.json"
import {Box, Stack, TablePagination, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {createTableBodyCellList, createTableHeadCellList, reduce} from "./helpers";
import {AlignmentType} from "./types";
import {CTR, EV_PM, MM_DMA, SITE_ID} from "../../data";

export default () => {
    const [state, setState] = useState(x)
    const [alignment, setAlignment] = useState<AlignmentType>(MM_DMA);
    const [clickEvent, setClickEvent] = useState<ClickEventText>({[MM_DMA]: CTR});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const MM_DMM_MAP = useMemo(reduce(state, MM_DMA), [state.length])
    const SITE_ID_MAP = useMemo(reduce(state, SITE_ID), [state.length])
    const tableHeadCellMap = alignment === MM_DMA ? MM_DMM_MAP : alignment === SITE_ID ? SITE_ID_MAP : SITE_ID_MAP
    const tableHeadCellList = useMemo(createTableHeadCellList(alignment, clickEvent[alignment]), [alignment, clickEvent[alignment]])
    const tableBodyCellList = useMemo(createTableBodyCellList(tableHeadCellMap, alignment), [alignment])

    const onChange: OnChangeHandlerType = (event, newAlignment) => {
        if (newAlignment) setAlignment(newAlignment);
    };

    const onChangePage: OnChangePageHandlerType = (event, newPage) => {
        setPage(newPage);
    };

    const onChangeRowsPerPage: OnChangeRowsPerPageHandlerType = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const onClick = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
        let key: AlignmentType = MM_DMA
        if (`value` in e.target) {
            key = e.target.value as AlignmentType
        }
        setClickEvent(clickEvent => ({[key]: clickEvent[key] === CTR ? EV_PM : CTR}))
    }

    return (
        <Stack direction={{xs: 'column'}} alignItems="center" spacing={{xs: 5}} gap="18">

            <TableContainer component={Paper} sx={{minWidth: 250, maxWidth: 600}}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            {tableHeadCellList.map((cellElem) =>
                                <TableCell key={cellElem}>{cellElem}</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableBodyCellList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                            <TableRow
                                key={i}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {row[alignment]}
                                </TableCell>
                                <TableCell>{row.impressions}</TableCell>
                                <TableCell>{row[clickEvent[alignment] || MM_DMA]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={tableBodyCellList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onChangePage}
                    onRowsPerPageChange={onChangeRowsPerPage}
                />
            </TableContainer>

            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '18px'}}>
                <ToggleButtonGroup color="primary" onChange={onChange} value={alignment} exclusive>
                    <ToggleButton value={MM_DMA} onClick={onClick}>
                        dma {clickEvent[MM_DMA] && `| ${clickEvent[MM_DMA]}`}
                    </ToggleButton>

                    <ToggleButton value={SITE_ID} onClick={onClick}>
                        site {clickEvent[SITE_ID] && `| ${clickEvent[SITE_ID]}`}
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

        </Stack>
    );
}

type OnChangeRowsPerPageHandlerType = (event: ChangeEvent<HTMLInputElement>) => void

type OnChangePageHandlerType = (event: unknown, newPage: number) => void

type OnChangeHandlerType = (event: MouseEvent<HTMLElement>, newAlignment: AlignmentType) => void

type ClickEventText = { [key in AlignmentType]?: `ctr` | `evpm` }


