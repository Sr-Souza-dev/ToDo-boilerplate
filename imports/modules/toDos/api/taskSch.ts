import { IDoc } from '/imports/typings/IDoc';

export const TaskSch = {
    title: {
        type: String,
        label: 'Título',
        defaultValue: '',
        optional: false,
    },
    description: {
        type: String, 
        label: 'Descrição',
        defaultValue: '',
        optional: true,
    },
    isPrivate: {
        type: Boolean, 
        label: 'Pessoal',
        defaultValue: false,
        optional: true,
    },
    isCompleted: {
        type: Boolean,
        label: 'Concluído',
        defaultValue: false,
        optional: true,
    },
}
export interface ITask extends IDoc{
    title: string;
    description: string;
    isPrivate: boolean;
    isCompleted: boolean;
}

export interface IListTasks extends ITask {
    userName: string;
    userPhoto: string;
}