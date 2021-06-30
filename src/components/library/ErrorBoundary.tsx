import { Component, ErrorInfo } from "react";
import Center from './Center'

interface ErrorBoundaryProps {
  ignoreError: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public static defaultProps = { ignoreError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

 static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    console.error('Error Boundary caught in getDerivedStateFromError: ', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error Boundary caught in componentDidCatch: ", error, errorInfo);
  }

  render() {
    return this.state.hasError && !this.props.ignoreError
      ? (
        <Center style={{ marginTop: '20%', flexDirection: 'column' }}>
          <h3>Something went wrong.</h3>
          <h5>See console for more information.</h5>
        </Center>
      ) : this.props.children
  }
}

export default ErrorBoundary;
