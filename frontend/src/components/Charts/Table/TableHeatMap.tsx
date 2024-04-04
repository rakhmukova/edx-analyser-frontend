import * as React from 'react';
import {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import {Box, Button} from '@mui/material';
import {SlMagnifier} from 'react-icons/sl';
import './TableHeatMap.css';
import ModalWindow from '../ModalWindow';
import TableHeatMapInsideWindow from './TableHeatMapInsideModalWindow';
import {getGreenColorScale} from '../../../utils/utils';

interface RowData {
    id: number;
    user: string;
    timeSec: number;
    medianTime?: number;
}

export type TableHeatMapProps = {
    rows: RowData[];
    boxTitle: string;
    columnName: string;
    columnCount: string;
    columnMedian?: string;
    labelText: string;
    paperSize: string;
}


export default function TableHeatMap(props: TableHeatMapProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setPage(0); // Переход на первую страницу при изменении поискового запроса
    }, [searchTerm]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const filteredRows = props.rows.filter(row =>
        row.user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    // Calculate statistics
    const timeSecArray = props.rows.map(row => row.timeSec);
    const minTime = Math.min(...timeSecArray);
    const maxTime = Math.max(...timeSecArray);
    const timeRange = maxTime - minTime;

    const timeMedianArray = props.rows.map(row => row.medianTime);
    const minMedianTime = Math.min(...timeMedianArray);
    const maxMedianTime = Math.max(...timeMedianArray);
    const medianTimeRange = maxMedianTime - minMedianTime;

    return (
        <Paper sx={{overflow: 'hidden', padding: '10px', width: props.paperSize}}>
            <Box
                sx={{
                    fontSize: 16,
                    p: 1,
                    color: '#405479',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    {props.boxTitle}
                    <Button onClick={handleModalOpen}>
                        <SlMagnifier/>
                    </Button>
                </Box>
            </Box>
            <TextField
                size="small"
                label={props.labelText}
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                sx={{
                    marginBottom: '10px',
                    '&:hover': {
                        borderColor: 'blue', // Цвет границы при наведении курсора
                    },
                }} // Добавлено смещение для выравнивания с кнопкой модального окна
            />
            <ModalWindow open={modalOpen} handleClose={handleModalClose}>
                <TableHeatMapInsideWindow{...props}/>
            </ModalWindow>
            <TableContainer sx={{height: 400}}>
                <Table stickyHeader size="small" aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{props.columnName}</TableCell>
                            <TableCell>{props.columnCount}</TableCell>
                            <TableCell>{props.columnMedian}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                        {filteredRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, _) => (
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
                                    <TableCell
                                        style={{
                                            backgroundColor: row.medianTime ? getGreenColorScale(medianTimeRange, row.medianTime) : 'white',
                                            padding: '8px'
                                        }}
                                    >
                                        {row.medianTime}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
