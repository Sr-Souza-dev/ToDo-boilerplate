import React from 'react';
import { IDefaultContainerProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import SimpleForm from '/imports/ui/components/SimpleForm/SimpleForm';
import { PageLayout } from '/imports/ui/layouts/PageLayout';
import { taskApi } from '../../api/taskApi';
import Box from '@mui/material/Box';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import SwitchField from '/imports/ui/components/SimpleFormFields/SwitchField/SwitchField';
import CheckBoxField from '/imports/ui/components/SimpleFormFields/CheckBoxField/CheckBoxField';
import Stack from '@mui/material/Stack';
import Typographe from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { ITask } from '../../api/taskSch';

interface IShowTask extends IDefaultContainerProps {
    hasId: boolean;
    save: (doc: ITask) => void;
    doc: any;
}

function ShowTask(props: IShowTask){
    const { 
        hasId, 
        doc, 
        navigate, 
        loading,
        save,
        user,
    } = props;
    function handleSubmit(doc: ITask){
        save(doc)
    }

    const [ isMine, setIsMine ] = React.useState(false);
    const [ editMode, setEditMode ] = React.useState(true);

    React.useEffect(() => {
        if(hasId){
            setEditMode(false);
            console.log("Documente recupe: ", doc);
            if( doc.createdby == user?._id){
                setIsMine(true);
            }
        }
    },[doc]);

    return (
        <PageLayout
            key={"showTask"}
            title={hasId ? editMode ? "Editar Tarefa" : "Visualizar Tarefa" : "Cadastrar Tarefa"}
            onBack={() => window.history.back()}
        >
            <Box mx={{sm: 5, md: 10, xs: 1}}>
                {hasId && doc?.createdby && (
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
                        <Box>
                            <Typographe variant={'h6'}>Criado por: </Typographe>
                            <Typographe variant={'body1'}>{doc?.userName}</Typographe>
                        </Box>

                        <Avatar src={doc?.userPhoto} sx={{width:'60px', height: '60px'}}/>
                    </Box>
                )}
                {isMine && (
                    <SwitchField
                        name='editMode'
                        key='editMode'
                        label='Editar'
                        value={editMode}
                        onChange={(_, value) => setEditMode(value.value)}
                        sxContainer={{ justifyContent: 'flex-end'}}
                    />
                )}
                <SimpleForm
                    key={"showTaskForm"}
                    mode={editMode ? "edit" : "view"}
                    schema={taskApi.schema}
                    doc={doc}
                    onSubmit={handleSubmit}
                    loading={loading}
                    styles={{width: '100%'}}
                >
                    <Stack direction={'column'} spacing={2}>
                        <TextField
                            key={"title"}
                            placeholder='Degite o título da tarefa'
                            name={"title"}
                        />

                        <TextField
                            key={"description"}
                            placeholder='Degite a descrição da tarefa'
                            name={"description"}
                            rows={5}
                            multiline={true}
                        />

                        <Stack direction={'row'} mx={3} justifyContent={'space-between'}>
                            {(isMine || !hasId) && (
                                <SwitchField
                                    key={"isPrivate"}
                                    name={"isPrivate"}
                                />
                            )}
                            {hasId && (
                                <CheckBoxField
                                    key={"isCompleted"}
                                    name={"isCompleted"}
                                />
                            )}
                        </Stack>
                        
                        {editMode && (
                            <Button
                                id={"submit"}
                                type={"submit"}
                                variant={"contained"}
                                color={"primary"}
                                sx={{
                                    display: 'flex',
                                    alignSelf: 'center',
                                    width: {xs:'100%', sm: '50%'},
                                }}
                            >
                                {hasId ? "Atualizar" : "Cadastrar"}
                            </Button>
                        )}
                    </Stack>
                </SimpleForm>
            </Box>
        </PageLayout>    
    );
}

export default (props: IDefaultContainerProps) => {
    const { id } = useParams();
    return (
        <ShowTaskContainer {...{...props, id}} />
    )
}


interface IShowTaskProps extends IDefaultContainerProps {id : string | undefined}
const ShowTaskContainer = withTracker((props: IShowTaskProps) => {

    const { showNotification, id } = props;

    const subHandle = !!id ? taskApi.subscribe('tasks.one', {_id:id}) : null;
    const doc = id && subHandle?.ready() ? taskApi.findOne() : {};

    function save (doc: ITask){
        const option = !!id ? "update" : "insert";
        taskApi[option](doc, (error: IMeteorError, response: string) => {
            if(error){
                showNotification && showNotification({
                    type: 'error',
                    title: 'Operação não realizada',
                    description:`Erro ao realizar a operação: ${error.reason}`,
                })
            }else{ 
                showNotification && showNotification({
                    type: 'success',
                    title: 'Operação realizada com sucesso',
                    description:`A tarefa foi ${!!id ? "atualizada" : "cadastrada"} com sucesso`,
                })
                window.history.back()
            }
        })
    }

    return {
        hasId: !!id,
        doc,
        save,
        ...props
    }
})(showLoading(ShowTask));

