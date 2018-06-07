import { Application } from 'express'
import { getApplicationConfig } from '../index'

function Set(obj: Types.obj): Function {
    return function(application: Application): void {
        const { attributes } = getApplicationConfig()
        Object.assign(attributes, obj)
    }
}

function UseMiddlewares(args: any[]): Function {
    return function(): void {
        const { middlewares } = getApplicationConfig()
        middlewares.push(...args)
    }
}

function ScheduleJobs(jobs: Function[]): Function {
    return function(): void {
        const { scheduleJobs } = getApplicationConfig()
        scheduleJobs.push(...jobs)
    }
}

function Routes(routes: any[]): Function {
    return function(): void {
        const { controllers, interceptors } = getApplicationConfig()
        const router: any = [...controllers, ...interceptors]
            .find((router: any) => routes.includes(router.target))
        router.enable = true
    }
}

function Config(params: Types.obj = {}): Function {
    return function(): void {
        const applicationConfig: Types.obj = getApplicationConfig()
        const {
            interceptors,
            controllers,
            attributes,
            middlewares,
            scheduleJobs,
        } = applicationConfig

        // set port to listen
        applicationConfig.port = params.port

        // sort and enable routers
        applicationConfig.interceptors = interceptors
            .filter((item: any) => params.interceptors.includes(item.target))
            .sort((a: any, b: any) => {
                const index1: number = params.interceptors.indexOf(a.target)
                const index2: number = params.interceptors.indexOf(b.target)
                return index1 - index2
            })

        applicationConfig.controllers = controllers
            .filter((item: any) => params.controllers.includes(item.target))
            .sort((a: any, b: any) => {
                const index1: number = params.controllers.indexOf(a.target)
                const index2: number = params.controllers.indexOf(b.target)
                return index1 - index2
            })

        // inject schedule jobs
        scheduleJobs.push(...params.scheduleJobs)

        // inject middlewares
        middlewares.push(...params.middlewares)

        // set attributes
        Object.assign(attributes, params.set)

    }
}

export {
    Set,
    Config,
    Routes,
    ScheduleJobs,
    UseMiddlewares,
}
