import React from 'react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  public state: State = {
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  public render() {
    if (this.state.error) {
      return (
        <div className="error">
          <h1>[{this.state.error.name}] - An error occurred</h1>
          <pre>{this.state.error.message}</pre>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
