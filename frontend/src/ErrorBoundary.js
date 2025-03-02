import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // You could add a call to an error reporting service here
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Oops! Something went wrong.</h1>
          <p>We're sorry for the inconvenience. Please try again later.</p>
          <button onClick={this.resetErrorBoundary}>Try Again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
