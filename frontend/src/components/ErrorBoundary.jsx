import React from 'react';
import { Button } from './ui';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center h-screen justify-center p-4">
                    <div className="z-30 h-[500px] lg:h-auto border border-gray-200 rounded-[5px]"
                        style={{ padding: '20px', width: '100%', maxWidth: '500px' }}>
                        <div className="flex flex-col items-center mb-8">
                            <h1 className="text-3xl font-semibold text-center text-gray-700">Something went wrong</h1>
                            <p className="text-gray-400 font-light text-md mt-2 text-center">
                                An unexpected error occurred. Our team has been notified.
                            </p>
                        </div>

                        {this.state.error && (
                            <div className="bg-red-50 border border-red-100 rounded p-4 mb-6 text-left overflow-auto max-h-48">
                                <p className="text-red-800 font-mono text-xs break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => window.history.back()} variant="outlined">
                                Go Back
                            </Button>
                            <Button onClick={this.handleReload} variant="primary">
                                Reload Page
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
