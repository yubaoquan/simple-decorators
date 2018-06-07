import * as decorator from './decorator'
const {
    Config,
    Controller,
    Interceptor,
    Get,
    Post,
    Delete,
    Use,
    Set,
    UseMiddlewares,
    ScheduleJobs,
} = decorator

function getApplicationConfig(): Types.obj {
    const g: any = global
    g.applicationConfig = g.applicationConfig || {
        routes: [],
        middlewares: [],
        controllers: [],
        interceptors: [],
        scheduleJobs: [],
        attributes: {},
    }
    return g.applicationConfig
}

export {
    // <decorator>
    Config,
    Controller,
    Interceptor,
    Get,
    Post,
    Delete,
    Use,
    Set,
    ScheduleJobs,
    UseMiddlewares,
    // </decorator>
    getApplicationConfig,
}
