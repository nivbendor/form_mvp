import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AlertProps {
  title?: string;
  description: string;
  variant?: 'default' | 'destructive';
}

const Alert: React.FC<AlertProps> = ({ title, description, variant = 'default' }) => {
  return (
    <div className={`rounded-lg p-4 ${variant === 'destructive' ? 'bg-red-50' : 'bg-blue-50'}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className={`h-5 w-5 ${variant === 'destructive' ? 'text-red-400' : 'text-blue-400'}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${variant === 'destructive' ? 'text-red-800' : 'text-blue-800'}`}>
              {title}
            </h3>
          )}
          <div className={`mt-2 text-sm ${variant === 'destructive' ? 'text-red-700' : 'text-blue-700'}`}>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AlertTitle: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <h3 className="text-sm font-medium">{children}</h3>
);

export const AlertDescription: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="mt-2 text-sm">{children}</div>
);

export { Alert };