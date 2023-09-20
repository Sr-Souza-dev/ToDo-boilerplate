import React from 'react';
import ListTasks from "../ui/pages/listTasks";
import ShowTaskContainer from '../ui/pages/showTask';

import { TaskRecursos } from "./recursos";
import { IRoute } from '/imports/modules/modulesTypings'

const tasksRoutes: IRoute[] = [
    {
        path: '/tasks',
        component: ListTasks,
        isProtected: true,
        resources: [TaskRecursos.VIEW],
    },
    {
        path: '/',
        component: ListTasks,
        isProtected: true,
        resources: [TaskRecursos.VIEW],
    },
    {
        path: '/task',
        component: ShowTaskContainer,
        isProtected: true,
        resources: [TaskRecursos.VIEW, TaskRecursos.CREATE],
    },
    {
        path: '/task/:id',
        component: ShowTaskContainer,
        isProtected: true,
        resources: [TaskRecursos.VIEW, TaskRecursos.EDIT],
    }
];

export default tasksRoutes;