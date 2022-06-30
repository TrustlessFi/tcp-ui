import axios from 'axios'
import { assertUnreachable } from './'

export enum RequestType {
  POST = 'POST',
}

class AsyncJsonRequest<
  InputType,
  OutputType,
  > {
  readonly requestURL: string
  readonly requestType: RequestType
  readonly resultProcessor: ((result: Record<string, any>) => OutputType)

  constructor (config: {
    requestURL: string
    resultProcessor: ((result: Record<string, any>) => OutputType)
    requestType: RequestType
  }) {
    this.requestURL = config.requestURL
    this.requestType = config.requestType
    this.resultProcessor = config.resultProcessor
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
    return await this.getRequest()(this.requestURL, input)
      .then(response => this.resultProcessor(response.data))
      .catch(asyncExecutionError => {
        console.error({asyncExecutionError})
        throw asyncExecutionError
      })

  }
}

export default AsyncJsonRequest
