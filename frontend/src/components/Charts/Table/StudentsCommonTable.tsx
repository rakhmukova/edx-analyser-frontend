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
import {Box} from '@mui/material';
import {PiStudentBold} from 'react-icons/pi';
import {getBlueColorScale, getColorByCompletionStatus, getColumnRange} from '../../../utils/utils';
import {StudentData} from '../../../models/students'

export type StudentsCommonTableProps = {
    students: Array<StudentData>;
    boxTitle: string;
    username: string,
    completionStatus: string,
    daysOnline: string,
    timeOnCourse: string,
    videoWatching: string,
    textbookScrolling: string,
    promblemsSolving: string,
    forumActivity: string,
}

export default function StudentsCommonTable(props: StudentsCommonTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, _] = useState('');

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

    const daysOnlineRange = getColumnRange('daysOnline', props.students);
    const timeOnCourseRange = getColumnRange('timeOnCourse', props.students);
    const videoWatching = getColumnRange('videoWatching', props.students);
    const textbookScrolling = getColumnRange('textbookScrolling', props.students);
    const problemsSolving = getColumnRange('problemsSolved', props.students);
    const forumActivity = getColumnRange('forumActivity', props.students);

    const cellStyle = {fontSize: '16px', color: '#405479'}

    return (
        <Paper sx={{overflow: 'hidden', padding: '10px', width: '88%'}}>
            <Box
                sx={{
                    fontSize: 16,
                    p: 1,
                    color: '#405479',
                    alignItems: 'center',
                }}
            >

            </Box>
            <TableContainer>
                <Table stickyHeader size="small" aria-label="sticky table" sx={{borderSpacing: '8px 0', borderCollapse: 'separate', color: '#405479'}}>
                    <TableHead style={{color: '#405479'}}>
                        <TableRow>
                            <TableCell style={cellStyle}>{props.username}</TableCell>
                            <TableCell style={cellStyle}>{props.daysOnline}</TableCell>
                            <TableCell style={cellStyle}>{props.timeOnCourse}</TableCell>
                            <TableCell style={cellStyle}>{props.videoWatching}</TableCell>
                            <TableCell style={cellStyle} sx={{marginRight: '8px'}}>{props.textbookScrolling}</TableCell>
                            <TableCell style={cellStyle}>{props.promblemsSolving}</TableCell>
                            <TableCell style={cellStyle}>{props.forumActivity}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                        {props.students
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((studentData, index) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={studentData.id}>
                                    <TableCell
                                        style={{fontSize: '16px', color: '#405479'}}
                                    >
                                        <PiStudentBold size={24} color={getColorByCompletionStatus(studentData.completionStatus)}/>
                                        {studentData.username}
                                    </TableCell>

                                    <TableCell
                                        style={{
                                            fontSize: '16px', color: '#405479',
                                            backgroundColor: studentData.daysOnline ? getBlueColorScale(daysOnlineRange.range, daysOnlineRange.minVal, studentData.daysOnline) : 'white'
                                        }}
                                    >
                                        {studentData.daysOnline}
                                    </TableCell>

                                    <TableCell
                                        style={{
                                            fontSize: '16px',
                                            color: '#405479',
                                            backgroundColor: studentData.timeOnCourse ? getBlueColorScale(timeOnCourseRange.range, timeOnCourseRange.minVal, studentData.timeOnCourse) : 'white'
                                        }}
                                    >
                                        {studentData.timeOnCourse}
                                    </TableCell>

                                    <TableCell
                                        style={{
                                            fontSize: '16px', color: '#405479',
                                            backgroundColor: studentData.videoWatching ? getBlueColorScale(videoWatching.range, videoWatching.minVal, studentData.videoWatching) : 'white',
                                            padding: '8px',
                                        }}
                                    >
                                        {studentData.videoWatching}
                                    </TableCell>

                                    <TableCell
                                        style={{
                                            fontSize: '16px', color: '#405479',
                                            backgroundColor: studentData.textbookScrolling ? getBlueColorScale(textbookScrolling.range, textbookScrolling.minVal, studentData.textbookScrolling) : 'white',
                                            padding: '8px'
                                        }}
                                    >
                                        {studentData.textbookScrolling}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            fontSize: '16px', color: '#405479',
                                            backgroundColor: studentData.problemsSolved ? getBlueColorScale(problemsSolving.range, problemsSolving.minVal, studentData.problemsSolved) : 'white',
                                            padding: '8px'
                                        }}
                                    >
                                        {studentData.problemsSolved}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            fontSize: '16px', color: '#405479',
                                            backgroundColor: studentData.forumActivity ? getBlueColorScale(forumActivity.range, forumActivity.minVal, studentData.forumActivity) : 'white',
                                            padding: '8px'
                                        }}
                                    >
                                        {studentData.forumActivity}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 50, 100]}
                component="div"
                count={props.students.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}