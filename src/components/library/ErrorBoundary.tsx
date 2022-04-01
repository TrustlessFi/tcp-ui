import { Component, ErrorInfo } from 'react'
import AppErrorDisplay from './AppErrorDisplay'

interface ErrorBoundaryProps {
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {

  constructor (props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError (error: Error) {
      // Update state so the next render will show the fallback UI.
    console.error('Error Boundary caught in getDerivedStateFromError: ', error)
    return { hasError: true }
  }

  componentDidCatch (error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error Boundary caught in componentDidCatch: ", error, errorInfo)
  }

  render () {
    console.log({errorboundaryState: this.state})
    return this.state.hasError
      ? <AppErrorDisplay />
      : this.props.children
  }
}

export default ErrorBoundary
