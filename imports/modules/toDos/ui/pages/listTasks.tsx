import React from 'react';
import Box from '@mui/material/Box';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import { withTracker } from 'meteor/react-meteor-data';
import { IDefaultContainerProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { ReactiveVar } from 'meteor/reactive-var';
import { IConfigList } from '/imports/typings/IFilterProperties';
import { initSearch } from '/imports/libs/searchUtils';
import { taskApi } from '../../api/taskApi';
import ListPagination from '../components/listPagination';
import Typography from '@mui/material/Typography';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import { IListTasks } from '../../api/taskSch';
import { showNotification } from '/imports/ui/GeneralComponents/ShowNotification';
import { useLocation, useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


interface ITasks extends ITasksContainer {
    tasks: Array<IListTasks>;
    page: number;
    amoutPages: number;
    setPage: (page: number) => void;
    onSearch: (...params: any) => void;
    clearFilter: () => void;
    searchBy?: string;
    remove: (doc: IListTasks) => void;
    isLoading: boolean;
    justMine: boolean;
}
function Tasks(props: ITasks) {
    const {
        tasks,
        page,
        amoutPages,
        setPage,
        onSearch,
        searchBy,
        clearFilter,
        remove,
        navigate,
        isLoading,
        justMine
    } = props

    const [text, setText] = React.useState<string>(searchBy || '')

    // ******** Funções para trabalhar com a paginação e modivicação na Lista ***********
    function handleEditTask(id: string){
        console.log(id)
        navigate(`/task/${id}`)
    }
    function handleDeleteTask(task: IListTasks){
        remove(task)
    }
    function handlePageChange(event: React.ChangeEvent<unknown>, value: number){
        setPage(value)
    }

    // ************** Funções para trabalhar com a busca **************
    function change(e: React.ChangeEvent<HTMLInputElement>){
        clearFilter();
        if(text.length > 0 && e.target.value.length === 0){
            onSearch();
        }
        setText(e.target.value)
    }
    function keyPress(_: React.SyntheticEvent){
        if(text && text.trim().length > 0){
            onSearch(text.trim());
        } else { onSearch() }
    }


    return (
        <Box mx={{xs: 2, sm: 10}}>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Typography variant={'h5'} sx={{marginTop: '20px', marginBottom: '20px'}}>
                    {justMine ? "Minhas Tarefas" : "Tarefas"}
                </Typography>
                <IconButton edge="end" color="primary" onClick={()=>{navigate('/task')}}>
                    <AddCircleOutlineIcon sx={{width:'30px', height: '30px'}}/>
                </IconButton>


            </Box>
            <TextField
                name={'pesquisar'}
                label={'Pesquisar'}
                value={text}
                onChange={change}
                onKeyPress={keyPress}
                placeholder="Digite aqui o que deseja pesquisa..."
            />
            <ListPagination 
                tasks = {tasks}
                page = {page}
                amoutPages = {amoutPages}
                handleEditTask = {handleEditTask}
                handleDeleteTask = {handleDeleteTask}
                handlePageChange = {handlePageChange}
                isLoading = {isLoading}
            />
        </Box>
    )
}

export const tasksSubscribeOptions = new ReactiveVar<IConfigList & {viewComplexTable: boolean}>({
    pageProperties: {
        currentPage: 1,
        pageSize: 4
    },
    sortProperties: {field: 'lastupdate', sortAscending: false},
    filter: {},
    searchBy: '',
    viewComplexTable: false
})

const tasksSearch = initSearch(
    taskApi,
    tasksSubscribeOptions,
    ['title']
)
let onSearchTaskTyping: NodeJs.Timeout;

export default (props: IDefaultContainerProps) => {

    const location = useLocation();
    const pathArray = location.pathname.split('/');
    const state = pathArray[pathArray.length - 1];

    return <ListTaskContainer {...{...props, state}}/>
}

interface ITasksContainer extends IDefaultContainerProps {state: string | undefined}
const ListTaskContainer =  withTracker((props : ITasksContainer) => {

    const { state } = props;
    const justMine = state == "tasks" ? true : false;

    // Configurando os filtros de busca vindos da reactiveVar
    const config = tasksSubscribeOptions.get()
    const sort = {[config.sortProperties.field]: config.sortProperties.sortAscending ? 1 : -1}

    // Informações que serão passadas para o subscribe
    const filter = config.filter
    const limit = config.pageProperties.pageSize
    const skip = (config.pageProperties.currentPage - 1) * config.pageProperties.pageSize

    // Cadastrando ao subscribe
    const subhandle = taskApi.subscribe(justMine ? 'tasks.allMine':'tasks.all', filter, {sort, limit, skip})
    const tasks = subhandle?.ready() ? taskApi.find({}, { sort }).fetch() : []
    let isLoading = !subhandle?.ready();
    const amount = subhandle ? Math.ceil(subhandle.total/config.pageProperties.pageSize) : tasks.length

    // Trata parametros de busca
    tasksSearch.setActualConfig(config)

    // Função para mudar a página
    function setPage (page: number) {
        config.pageProperties.currentPage = page;
        tasksSubscribeOptions.set(config);
    }

    // Função para realizar a busca
    function onSearch(...params: any) {
        onSearchTaskTyping && clearTimeout(onSearchTaskTyping);
        onSearchTaskTyping = setTimeout(() => {
            config.pageProperties.currentPage = 1;
            tasksSubscribeOptions.set(config);
            tasksSearch.onSearch(...params);
        }, 200);
    }

    // Função para limpar os filtros
    function clearFilter() {
        config.filter = {};
        tasksSubscribeOptions.set(config);
    }

    // Função para remover uma tarefa
    function remove(doc: IListTasks) {
        taskApi.remove(doc, (e: IMeteorError) => {
            if (!e) {
                showNotification &&
                    showNotification({
                        type: 'success',
                        title: 'Operação realizada!',
                        description: `O exemplo foi removido com sucesso!`
                    });
            } else {
                showNotification &&
                    showNotification({
                        type: 'warning',
                        title: 'Operação não realizada!',
                        description: `Erro ao realizar a operação: ${e.reason}`
                    });
            }
        });
    }
    return {
        tasks,
        page: config.pageProperties.currentPage,
        amoutPages: amount,
        searchBy: config.searchBy,
        justMine,
        setPage,
        onSearch,
        clearFilter,
        remove,
        isLoading,
        ...props,
    }
})(showLoading(Tasks));