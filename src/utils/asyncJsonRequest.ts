import axios from 'axios'
import { assertUnreachable } from './'

export enum RequestType {
  POST = 'POST',
}

const hook = () => {}
type hook = typeof hook

class AsyncJsonRequest<
  InputType,
  OutputType,
  > {
  readonly requestURL: string
  readonly requestType: RequestType
  readonly resultProcessor: ((result: Record<string, any>) => OutputType)
  readonly startHook = hook
  readonly endHook = hook
  readonly failHook = hook

  constructor (config: {
    requestURL: string
    resultProcessor: ((result: Record<string, any>) => OutputType)
    requestType: RequestType
    startHook?: hook
    endHook?: hook
    failHook?: hook
  }) {
    const { requestURL, resultProcessor, requestType, startHook, endHook, failHook} = config
    this.requestURL = requestURL
    this.requestType = requestType
    this.resultProcessor = resultProcessor

    if (startHook) this.startHook = startHook
    if (endHook) this.endHook = endHook
    if (failHook) this.failHook = failHook
  }

  private getRequest () {
    switch (this.requestType) {
      case RequestType.POST:
        return axios.post
      default:
        assertUnreachable(this.requestType)
    }
    throw ''
  }

  async execute (input: InputType) {
    this.startHook()
    return await this.getRequest()(this.requestURL, input)
      .then(response => {
        this.endHook()
        return this.resultProcessor(response.data)
      })
      .catch(asyncExecutionError => {
        console.error({asyncExecutionError})
        this.failHook()
        throw asyncExecutionError
      })

  }
}

export default AsyncJsonRequest
