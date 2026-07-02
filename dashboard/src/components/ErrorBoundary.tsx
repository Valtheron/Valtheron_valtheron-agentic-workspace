import { Component, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/** Catches render errors in child components and shows a fallback UI */
class ErrorBoundaryInner extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReload={this.handleReload} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ error, onReload }: { error?: Error; onReload: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <motion.div
        className="max-w-md w-full bg-[#0C1117] border border-[#1E2A3A] rounded-2xl p-8 flex flex-col items-center gap-5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-14 h-14 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-[#EF4444]" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-[#E8E8EC] mb-1">
            Something went wrong
          </h2>
          <p className="text-sm text-[#6B7B8D] leading-relaxed">
            An error occurred in this view. The error has been isolated so the rest of the app remains usable.
          </p>
        </div>

        {error && (
          <div className="w-full bg-[#070A0E] rounded-lg p-3 border border-[#1E2A3A] overflow-hidden">
            <p className="text-xs font-mono text-[#EF4444] truncate">{error.name}: {error.message}</p>
          </div>
        )}

        <div className="flex gap-3 w-full">
          <button
            onClick={onReload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3DDC97] text-[#070A0E] rounded-lg text-sm font-medium hover:bg-[#32C687] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reload
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E2A3A] text-[#E8E8EC] rounded-lg text-sm font-medium hover:bg-[#243447] transition-colors"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/** Wrap route-level views to isolate crashes */
export default function ErrorBoundary(props: Props) {
  return (
    <ErrorBoundaryInner {...props} />
  );
}
