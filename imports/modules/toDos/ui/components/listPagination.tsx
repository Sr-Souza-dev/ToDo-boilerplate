import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from '@mui/material/Pagination';
import { getUser } from '/imports/libs/getUser';
import { IListTasks } from '../../api/taskSch'

import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';


interface IListPagination {
    tasks: Array<IListTasks>;
    amoutPages: number;
    page: number;
    handleEditTask: (id: string) => void;
    handleDeleteTask: (task: IListTasks) => void;
    handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
    isLoading?: boolean;
}

export default function ListPagination({tasks, amoutPages, page, handleEditTask, handleDeleteTask, handlePageChange, isLoading = false} : IListPagination){
    const sxIcon = {
        marginRight: '10px',
        color: 'text.disabled',
    }

    return (
        <Box sx={{minHeight:{sm:'50vh', xs:'67vh', display:'flex', flexDirection:'column', justifyContent:'space-between'}}}>
            {isLoading ?
                <Typography variant='h6' sx={{textAlign: 'center', marginTop: '40px'}}>
                    Carregando...
                </Typography>
            : tasks.length > 0 ?
                <List sx={{ width: '100%', minWidth: '200px', bgcolor: 'background.paper', margin: '0px', padding: '0px', marginBottom: '10px'}}>
                    {tasks.map((task : IListTasks, index : any) => (
                    <div key={index}>
                        <ListItem alignItems="flex-start"
                        sx={{minWidth: '350px',margin: '0px', padding: '0px'}}
                        secondaryAction={
                            <Box sx={{display: 'flex', alignItems:'center'}}>
                                {!!task.isPrivate && task.createdby == getUser()._id  && (
                                    <Typography variant='overline' sx={{borderRadius: 10, marginRight: '10px', backgroundColor: 'secondary.main', paddingRight: '9px', paddingLeft: '9px', color: 'white'}}>
                                        Privado
                                    </Typography>
                                )}
                                {task.isCompleted ? <CheckCircleIcon sx={sxIcon}/> : <PendingIcon sx={sxIcon}/>}
                                {task.createdby == getUser()._id && (
                                <IconButton edge="end" aria-label="delete" color="primary" onClick={()=>handleDeleteTask(task)}>
                                    <DeleteIcon />
                                </IconButton>
                                )}
                            </Box>
                        }
                        >
                        <ListItemButton onClick={() => handleEditTask(task._id)}>
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src={task.userPhoto} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={task.title}
                                secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline', marginRight: '10px', fontWeight: 'bold'}}
                                        component="span"
                                        variant="body2" 
                                        gutterBottom
                                        color="text.primary"
                                    >
                                        {task.userName}
                                    </Typography>
                                
                                </React.Fragment>
                                }
                            />
                            
                        </ListItemButton>


                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </div>
                    ))}
                </List>
            :
                <Typography variant='h6' sx={{textAlign: 'center', marginTop: '40px'}}>
                    Não há tarefas cadastradas!
                </Typography>
            }
            <Pagination 
                count={amoutPages} 
                color="primary" 
                page={page}
                onChange={handlePageChange}
                sx={{
                    marginTop: '15px',
                    justifyContent: 'center',
                    display: 'flex',
                }}
            />
    </Box>
);}