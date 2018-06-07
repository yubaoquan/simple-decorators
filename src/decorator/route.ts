import { getApplicationConfig } from '../index'

function Get(path: string | string[] | RegExp = '', middlewares: any[] = []): any {
    return method(path, middlewares, 'get')
}

function Post(path: string | string[] | RegExp = '', middlewares: any[] = []): Function {
    return method(path, middlewares, 'post')
}

function Delete(path: string | string[] | RegExp = '', middlewares: any[] = []): Function {
    return method(path, middlewares, 'delete')
}

function method(path: string | string[] | RegExp, middlewares: any[], methodName: string): Function {
    return function(target: any, propertyKey: string): void {
        getApplicationConfig().routes.push({
            path, methodName,
            methods: middlewares.concat(target[propertyKey]),
            controller: target.constructor,
        })
    }
}

function Use(path: string | string[] | RegExp = '/'): Function {
    return function(target: any, propertyKey: string): void {
        getApplicationConfig().routes.push({
            path: path,
            methodName: 'use',
            methods: [target[propertyKey]],
            controller: target.constructor,
        })
    }
}

function Controller(path: string = ''): Function {
    return (target: any): void => {
        getApplicationConfig().controllers.push({ target, path })
    }
}

function Interceptor(path: string = ''): Function {
    return (target: any): void => {
        getApplicationConfig().interceptors.push({ target, path })
    }
}

export {
    Get,
    Post,
    Delete,
    Use,
    Controller,
    Interceptor,
}
