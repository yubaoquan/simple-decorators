import { Application } from 'express'
import * as express from 'express'
import { getApplicationConfig } from './index'

export default class App {
    config: Types.obj
    app: Application
    port: number

    constructor(port?: number) {
        this.app = express()
        this.config = getApplicationConfig()
        this.port = port || this.config.port
    }

    init(): void {
        this.initAttributes()
        this.initMiddlewares()
        this.initRoutes()
    }

    run(): void {
        this.init()
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}!`)
            this.config.scheduleJobs.forEach((job: Function) => job())
        })
    }

    initAttributes(): void {
        const attributes: Types.obj = this.config.attributes || {}
        Object.keys(attributes).forEach((key: any) => {
            this.app.set(key, attributes[key])
        })
    }

    initMiddlewares(): void {
        this.config.middlewares.forEach((middleware: any) => this.app.use(middleware))
    }

    initRoutes(): void {
        const { interceptors, controllers } = this.config;
        [...interceptors, ...controllers].forEach((router: any) => this.initSingleRouter(router))
    }

    initSingleRouter(controller: any): void {
        getApplicationConfig().routes
            .filter((route: any) => route.controller === controller.target)
            .forEach((route: any) => {
                let path: string | RegExp | string[] = route.path
                if (controller.path && typeof route.path === 'string') {
                    path = `${controller.path}${route.path}`
                }
                if (route.methodName === 'use') {
                    return this.app.use(...route.methods)
                }
                return (this.app as any)[route.methodName || 'get'](path, ...route.methods)
            })
    }
}
