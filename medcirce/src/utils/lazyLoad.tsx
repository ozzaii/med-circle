import React, { lazy, Suspense, ComponentType } from 'react';
import { LoadingSpinner } from '../components/LoadingStates';

interface LazyLoadOptions {
  fallback?: React.ReactNode;
  delay?: number;
}

export function lazyLoadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): React.LazyExoticComponent<T> {
  const { fallback = <LoadingSpinner message="Yükleniyor..." />, delay = 200 } = options;

  const LazyComponent = lazy(async () => {
    const start = Date.now();
    const module = await importFunc();
    const elapsed = Date.now() - start;

    // Add artificial delay to prevent flash of loading state
    if (elapsed < delay) {
      await new Promise(resolve => setTimeout(resolve, delay - elapsed));
    }

    return module;
  });

  return LazyComponent;
}

interface WithSuspenseProps {
  fallback?: React.ReactNode;
}

export function withSuspense<P extends object>(
  Component: ComponentType<P>,
  fallback: React.ReactNode = <LoadingSpinner />
): ComponentType<P> {
  return (props: P) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}

// Preload component for critical routes
export function preloadComponent(
  importFunc: () => Promise<any>
): void {
  importFunc();
}

// Intersection Observer for lazy loading on scroll
export function useLazyLoad(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  options: IntersectionObserverInit = {}
): void {
  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, callback, options]);
}

// Retry logic for failed lazy loads
export function withRetry<T extends ComponentType<any>>(
  LazyComponent: React.LazyExoticComponent<T>,
  maxRetries: number = 3
): React.FC<React.ComponentProps<T>> {
  return (props) => {
    const [retryCount, setRetryCount] = React.useState(0);

    return (
      <React.Suspense
        fallback={<LoadingSpinner message="Yükleniyor..." />}
      >
        <ErrorBoundaryWithRetry
          onRetry={() => setRetryCount(count => count + 1)}
          maxRetries={maxRetries}
          retryCount={retryCount}
        >
          <LazyComponent {...props} key={retryCount} />
        </ErrorBoundaryWithRetry>
      </React.Suspense>
    );
  };
}

interface ErrorBoundaryWithRetryProps {
  children: React.ReactNode;
  onRetry: () => void;
  maxRetries: number;
  retryCount: number;
}

class ErrorBoundaryWithRetry extends React.Component<
  ErrorBoundaryWithRetryProps,
  { hasError: boolean }
> {
  constructor(props: ErrorBoundaryWithRetryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Lazy load error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
    this.props.onRetry();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      const { retryCount, maxRetries } = this.props;
      
      if (retryCount >= maxRetries) {
        return (
          <div className="p-8 text-center">
            <p className="text-red-400 mb-4">Bileşen yüklenemedi</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Sayfayı Yenile
            </button>
          </div>
        );
      }

      return (
        <div className="p-8 text-center">
          <p className="text-gray-400 mb-4">Yükleme hatası</p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Tekrar Dene ({retryCount + 1}/{maxRetries})
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}