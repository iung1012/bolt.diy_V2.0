import { useStore } from '@nanostores/react';
import { Zap } from 'lucide-react';
import { ClientOnly } from 'remix-utils/client-only';

import { ConnectionStatus } from './ConnectionStatus';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ModelBadge } from '~/components/chat/ModelBadge';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames(
        'flex items-center justify-between bg-bolt-elements-background-depth-1 px-5 h-[var(--header-height)] transition-colors z-[50]',
        {
          'border-b border-transparent': !chat.started,
          'border-b border-bolt-elements-borderColor/60': chat.started,
        },
      )}
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-2.5 group shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
          <Zap className="h-4 w-4 text-white fill-white" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-bolt-elements-textPrimary">
          Bolt<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">DIY</span>
        </span>
      </a>

      {/* Center - Chat Title */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm w-full px-4">
        <div className="truncate text-center text-sm font-medium text-bolt-elements-textSecondary">
          <ClientOnly>{() => <ChatDescription />}</ClientOnly>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <ClientOnly>{() => <ConnectionStatus />}</ClientOnly>
        <ClientOnly>{() => <ModelBadge />}</ClientOnly>
        {chat.started && (
          <ClientOnly>
            {() => <HeaderActionButtons />}
          </ClientOnly>
        )}
      </div>
    </header>
  );
}
