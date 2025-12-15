import { AlertTriangle, RefreshCw, Wifi, WifiOff, ServerCrash } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  type?: 'network' | 'server' | 'generic' | 'notFound';
}

export function ErrorState({ 
  title, 
  message, 
  onRetry, 
  retryLabel = 'Try Again',
  type = 'generic' 
}: ErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return <WifiOff className="h-12 w-12 text-muted-foreground" />;
      case 'server':
        return <ServerCrash className="h-12 w-12 text-muted-foreground" />;
      case 'notFound':
        return <AlertTriangle className="h-12 w-12 text-muted-foreground" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-muted-foreground" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Error';
      case 'server':
        return 'Server Error';
      case 'notFound':
        return 'Not Found';
      default:
        return 'Something went wrong';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'network':
        return 'Please check your internet connection and try again.';
      case 'server':
        return 'Our servers are experiencing issues. Please try again later.';
      case 'notFound':
        return 'The requested resource could not be found.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6 text-center space-y-4">
        {getIcon()}
        <div>
          <h3 className="font-semibold text-lg">{title || getDefaultTitle()}</h3>
          <p className="text-muted-foreground text-sm mt-2">
            {message || getDefaultMessage()}
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      type="network"
      onRetry={onRetry}
    />
  );
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      type="server"
      onRetry={onRetry}
    />
  );
}

export function NotFoundError() {
  return (
    <ErrorState
      type="notFound"
      title="Page Not Found"
      message="The page you're looking for doesn't exist."
    />
  );
}

export function EmptyState({ 
  title, 
  message, 
  action 
}: { 
  title: string; 
  message: string; 
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {action}
    </div>
  );
}