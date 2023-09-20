import React from 'react';
import { IAppMenu } from '/imports/modules/modulesTypings';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Home from '@mui/icons-material/Home';

const menu: (IAppMenu | null)[] = [
    {
        path: '/',
        name: 'Início',
        icon: <Home/>,
    },

    {
        path: '/tasks',
        name: 'Minhas Tarefas',
        icon: <TaskAltIcon/>,
    },
]

export default menu;