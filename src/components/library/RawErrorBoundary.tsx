import { Component, ErrorInfo } from "react"
import Center from './Center'
import SpacedList from './SpacedList'
import LargeText from './LargeText'
import Text from './Text'

interface ErrorBoundaryProps {
  ignoreError: boolean
}

interface ErrorBoundaryState {
  error: Error | null
}

class RawErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public static defaultProps = { ignoreError: false }

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      // Update state so the next render will show the fallback UI.
    console.error('Error Boundary caught in getDerivedStateFromError: ', error)
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error Boundary caught in componentDidCatch: ", error, errorInfo)
  }

  render() {
    return this.state.error !== null && !this.props.ignoreError
      ? (
        <Center style={{ marginTop: '20%', flexDirection: 'column' }}>
          <SpacedList>
          <LargeText>
            Something went wrong.
          </LargeText>
          <Text>
            Cause: {this.state.error.cause}
          </Text>
          <Text>
            Message: {this.state.error.message}
          </Text>
          <Text>
            Name: {this.state.error.name}
          </Text>
          <Text>
            Stack: {this.state.error.stack}
          </Text>
          </SpacedList>
        </Center>
      ) : this.props.children
  }
}

export default RawErrorBoundary
