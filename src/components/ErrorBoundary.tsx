import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#f9fafb',
        }}>
          <div style={{
            maxWidth: '600px',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <h1 style={{ color: '#e91e8c', marginTop: 0 }}>⚠️ Something went wrong</h1>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              The application encountered an error. Please check the following:
            </p>
            <ul style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              <li>Ensure environment variables are set in Vercel</li>
              <li>Check browser console for detailed error messages</li>
              <li>Try refreshing the page</li>
            </ul>
            {this.state.error && (
              <details style={{ marginTop: '1rem' }}>
                <summary style={{ cursor: 'pointer', color: '#e91e8c', fontWeight: 'bold' }}>
                  Error Details
                </summary>
                <pre style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '0.875rem',
                  color: '#dc2626',
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#e91e8c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

