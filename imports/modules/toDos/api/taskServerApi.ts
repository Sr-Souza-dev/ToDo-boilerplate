import { ITask, TaskSch } from './taskSch';
import { ProductServerBase } from '/imports/api/productServerBase';
import { TaskRecursos } from '../config/recursos';
import { userprofileServerApi } from '/imports/userprofile/api/UserProfileServerApi';
import { Meteor } from 'meteor/meteor';
import { getUser } from '/imports/libs/getUser';

class TaskServerApi extends ProductServerBase<ITask> {
    constructor() {
        super('tasks', TaskSch, {
            resources: TaskRecursos,
        });

        this.addTransformedPublication(
            'tasks.all', 
            (filter = {}, pagination = {}) =>{
                filter =  {
                    $or:[
                        {isPrivate: false, ...filter},
                        {createdby: getUser()._id, ...filter}
                    ]
                }
                
                return this.defaultListCollectionPublication(filter, {
                    projection: {title: 1, isPrivate: 1, isCompleted: 1, createdby: 1},
                    ...pagination
                })
            },
            (doc: ITask & {userName: string, userPhoto: string}) => {
                const userProfile = userprofileServerApi.getCollectionInstance().findOne({_id: doc.createdby});
                return {...doc, userName: userProfile?.username, userPhoto: userProfile?.photo}
            }
        );

        this.addTransformedPublication(
            'tasks.allMine', 
            (filter = {}, pagination = {}) =>{
                filter =  {
                    ...filter,
                    createdby: getUser()._id
                }
                
                return this.defaultListCollectionPublication(filter, {
                    projection: {title: 1, isPrivate: 1, isCompleted: 1, createdby: 1},
                    ...pagination
                })
            },
            (doc: ITask & {userName: string, userPhoto: string}) => {
                const userProfile = userprofileServerApi.getCollectionInstance().findOne({_id: doc.createdby});
                return {...doc, userName: userProfile?.username, userPhoto: userProfile?.photo}
            }
        );



        this.addTransformedPublication(
            'tasks.one', 
            (filter = {}) =>{
                console.log("entrou no ser tasks.one: ", filter)
                filter =  {
                    ...filter,
                    $or:[
                        {isPrivate: false},
                        {createdby: getUser()._id}
                    ]
                }
                console.log("entrou no ser tasks.one2: ", filter)
                
                return this.defaultDetailCollectionPublication(filter, {})
            },
            (doc: ITask & {userName: string, userPhoto: string}) => {
                const userProfile = userprofileServerApi.getCollectionInstance().findOne({_id: doc.createdby});
                return {...doc, userName: userProfile?.username, userPhoto: userProfile?.photo}
            }
        );
    }
}

export const taskServerApi = new TaskServerApi();