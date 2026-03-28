'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { LinkAction } from '../types/domain';
import { useDiscovery } from './DiscoveryShell';

interface ActionLinkProps {
  action: LinkAction;
  children: ReactNode;
  className?: string;
  unavailableClassName?: string;
}

export default function ActionLink({
  action,
  children,
  className = '',
  unavailableClassName,
}: ActionLinkProps) {
  const { openDiscovery } = useDiscovery();

  if (action.type === 'internal') {
    return (
      <Link href={action.href} className={className}>
        {children}
      </Link>
    );
  }

  if (action.type === 'external') {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
      >
        {children}
      </a>
    );
  }

  if (action.type === 'command') {
    return (
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={(event) => openDiscovery(event.currentTarget)}
        className={`appearance-none border-0 bg-transparent p-0 text-left ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <span
      aria-disabled="true"
      title={action.reason}
      className={unavailableClassName || className}
    >
      {children}
    </span>
  );
}
