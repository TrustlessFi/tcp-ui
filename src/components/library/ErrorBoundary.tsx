import { Component, ErrorInfo, ReactNode } from 'react'
import { connect } from 'react-redux'
import AppErrorDisplay from './AppErrorDisplay'
import { AppDispatch } from '../../app/store'
import { reportError, ErrorType } from '../Errors'

interface ErrorBoundaryProps {
  children: ReactNode
  dispatch: AppDispatch
}

class ErrorBoundary extends Component<ErrorBoundaryProps, {hasError: boolean}> {

  constructor (props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError (error: Error) {
    // Update state so the next render will show the fallback UI.
    console.warn('Error Boundary caught in getDerivedStateFromError: ', {error})

    return { hasError: true }
  }

  componentDidCatch (error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    reportError({
      errorType: ErrorType.RenderError,
      error: {
        ...error,
        ...errorInfo,
      }
    }, this.props.dispatch)
  }

  render () {
    return this.state.hasError
      ? <AppErrorDisplay />
      : this.props.children
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  dispatch: dispatch
})

export default connect(null, mapDispatchToProps)(ErrorBoundary)
