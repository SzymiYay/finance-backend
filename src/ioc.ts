import { IocContainer, ServiceIdentifier } from 'tsoa'
import { container } from 'tsyringe'
import './container'

export const iocContainer: IocContainer = {
  get<T>(controller: ServiceIdentifier<T>): T {
    return container.resolve(controller as any)
  }
}
