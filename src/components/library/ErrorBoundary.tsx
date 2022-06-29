import { Component, ErrorInfo, ReactNode } from 'react'
import { connect } from 'react-redux'
import AppErrorDisplay from './AppErrorDisplay'
import { addRenderError } from '../../slices/errors'
import { AppDispatch } from '../../app/store'

interface ErrorBoundaryProps {
  children: ReactNode
  addRenderError: (error: {}) => unknown
}

class ErrorBoundary extends Component<ErrorBoundaryProps, {hasError: boolean}> {

  constructor (props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError (error: Error) {
      // Update state so the next render will show the fallback UI.
    console.error('Error Boundary caught in getDerivedStateFromError: ', {error})

    return { hasError: true }
  }

  componentDidCatch (error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    const errorObject = {error, errorInfo}

    this.props.addRenderError({errorObject})

    console.error("Error Boundary caught in componentDidCatch: ", errorObject)
  }

  render () {
    return this.state.hasError
      ? <AppErrorDisplay />
      : this.props.children
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addRenderError: (error: {}) => dispatch(addRenderError(error))
})

export default connect(null, mapDispatchToProps)(ErrorBoundary)
