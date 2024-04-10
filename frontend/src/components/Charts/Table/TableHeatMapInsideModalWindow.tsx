import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import { Box } from '@mui/material'
import './TableHeatMap.css'
import AggregateMeasureBox from '../Box/AggregateMeasureBox'
import { getGreenColorScale } from '../../../utils/utils'

interface VideoViewsData {
    id: number;
    user: string;
    timeSec: number;
}

export type TableHeatMapProps = {
    rows: VideoViewsData[];
    boxTitle: string;
    columnName: string;
    columnCount: string;
    labelText: string;
}

export default function TableHeatMapInsideWindow(props: TableHeatMapProps) {
    const [_, setPage] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        setPage(0) // Переход на первую страницу при изменении поискового запроса
    }, [searchTerm])


    const filteredRows = useMemo(() => {
        return props.rows.filter(row =>
            row.user.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [props.rows, searchTerm])

    // Calculate statistics
    const timeSecArray = props.rows.map(row => row.timeSec)
    const minTime = useMemo(() => Math.min(...timeSecArray), [timeSecArray])
    const maxTime = useMemo(() => Math.max(...timeSecArray), [timeSecArray])
    const timeRange = useMemo(() => maxTime - minTime, [maxTime, minTime])
    const meanTime = useMemo(() => Math.round(timeSecArray.reduce((acc, val) => acc + val, 0) / timeSecArray.length), [timeSecArray])
    const medianTime = useMemo(() => {
        const sortedArray = [...timeSecArray].sort((a, b) => a - b)
        return timeSecArray.length % 2 === 0
            ? Math.round((sortedArray[sortedArray.length / 2 - 1] + sortedArray[sortedArray.length / 2]) / 2)
            : Math.round(sortedArray[(sortedArray.length - 1) / 2])
    }, [timeSecArray])

    return (
        <div className={'modal-window-content'}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: '#F0F3FB',
                    boxShadow: 24,
                    p: 2,
                    borderRadius: 2,
                    // display: 'flex',
                    justifyContent: 'space-between'
                    // height: '80%',
                    // overflowY: 'auto'
                }}
            >
                <Box
                    sx={{
                        fontSize: 20,
                        p: 1,
                        color: '#405479',
                        alignItems: 'center',
                        fontWeight: 'normal'
                    }}
                >
                    {props.boxTitle}
                </Box>
                <Box
                    sx={{
                        display: 'flex'
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: '#fff',
                            borderRadius: 2,
                            p: 2
                        }}
                    >
                        <TextField
                            size="small"
                            label={props.labelText}
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            // fullWidth
                            sx={{ marginBottom: '16px', width: 800 }}
                        />
                        <div style={{ backgroundColor: '#fff', overflowY: 'auto' }}>
                            <TableContainer sx={{ height: 440, width: 800 }}>
                                <Table stickyHeader size="small" aria-label="sticky table">

                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>{props.columnName}</TableCell>
                                            <TableCell>{props.columnCount}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        {filteredRows.map((row, index) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                <TableCell component="th">
                                                    {row.id}
                                                </TableCell>
                                                <TableCell>
                                                    {row.user}
                                                </TableCell>
                                                <TableCell
                                                    style={{
                                                        backgroundColor: row.timeSec ? getGreenColorScale(timeRange, row.timeSec) : 'white',
                                                        padding: '8px'
                                                    }}
                                                >
                                                    {row.timeSec}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </Box>
                    {/* </Box> */}
                    <Box
                        sx={{
                            // p: 2,
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            marginLeft: '20px',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div className={'one-box'}>
                            <AggregateMeasureBox measure={'Минимум'} value={minTime} />
                        </div>

                        <div className={'one-box'}>
                            <AggregateMeasureBox measure={'Maксимум'} value={maxTime} />
                        </div>

                        <div className={'one-box'}>
                            <AggregateMeasureBox measure={'Среднее значение'} value={meanTime} />
                        </div>

                        <div className={'one-box'}>
                            <AggregateMeasureBox measure={'Медиана'} value={medianTime} />
                        </div>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}
