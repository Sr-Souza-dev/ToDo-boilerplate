import { ProductBase } from "/imports/api/productBase";
import { TaskSch, ITask } from "./taskSch";

class TaskApi extends ProductBase<ITask> {
    constructor() {
        super('tasks', TaskSch,{
            enableCallMethodObserver : true,
            enableSubscribeObserver : true,
        });
    }
}

export const taskApi = new TaskApi();