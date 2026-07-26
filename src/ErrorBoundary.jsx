import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      // Retornamos un div vacío o un spinner nativo minimalista si el canvas 3D falla
      return (
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #f97316', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;