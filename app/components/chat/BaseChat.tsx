import type { UIMessage } from 'ai';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Zap, Code2, Rocket } from 'lucide-react';
import React, { type RefCallback } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import styles from './BaseChat.module.scss';
import { Messages } from './Messages.client';
import { ModelSelector } from './ModelSelector';
import { SendButton } from './SendButton.client';
import { MigrationBanner } from '~/components/migration/MigrationBanner';
import { Menu } from '~/components/sidebar/Menu.client';
import { AnimatedBadge } from '~/components/ui/AnimatedBadge';
import { FeatureCard } from '~/components/ui/FeatureCard';
import { GradientText } from '~/components/ui/GradientText';
import { IconButton } from '~/components/ui/IconButton';
import { Workbench } from '~/components/workbench/Workbench.client';
import { classNames } from '~/utils/classNames';

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement | null> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: UIMessage[];
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
}

const TEXTAREA_MIN_HEIGHT = 76;

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      messageRef,
      scrollRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      enhancingPrompt = false,
      promptEnhanced = false,
      messages,
      input = '',
      sendMessage,
      handleInputChange,
      enhancePrompt,
      handleStop,
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

    return (
      <div
        ref={ref}
        className={classNames(
          styles.BaseChat,
          'relative flex h-full w-full overflow-hidden bg-gradient-to-br from-bolt-elements-background-depth-1 via-bolt-elements-background-depth-1/95 to-bolt-elements-background-depth-2',
        )}
        data-chat-visible={showChat}
      >
        <ClientOnly>{() => <Menu />}</ClientOnly>
        <div ref={scrollRef} className="flex overflow-y-auto w-full h-full">
          <div className={classNames(styles.Chat, 'flex flex-col flex-grow min-w-[var(--chat-min-width)] h-full')}>
            {!chatStarted && (
              <motion.div
                id="intro"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto mt-[10vh] flex w-full max-w-3xl flex-col items-center gap-8 px-6 text-center"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300"
                >
                  <Sparkles className="h-3 w-3" />
                  Powered by 19+ AI models
                </motion.div>

                {/* Heading */}
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl font-bold tracking-tight text-bolt-elements-textPrimary sm:text-5xl lg:text-6xl"
                  >
                    Build something{' '}
                    <GradientText>amazing</GradientText>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="mx-auto max-w-xl text-base text-bolt-elements-textSecondary sm:text-lg"
                  >
                    Describe your idea and watch it come to life. Full-stack apps, from prompt to deployment.
                  </motion.p>
                </div>

                {/* Feature Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid w-full gap-3 sm:grid-cols-3"
                >
                  <FeatureCard
                    icon={Zap}
                    title="Live Preview"
                    description="See changes instantly in a real browser environment."
                    gradient
                    delay={0}
                  />
                  <FeatureCard
                    icon={Code2}
                    title="Full Stack"
                    description="Frontend, backend, database — all in one conversation."
                    gradient
                    delay={0}
                  />
                  <FeatureCard
                    icon={Rocket}
                    title="One-click Deploy"
                    description="From idea to production in minutes, not hours."
                    gradient
                    delay={0}
                  />
                </motion.div>
              </motion.div>
            )}
            <div
              className={classNames('px-6 pt-10 sm:pt-12', {
                'h-full flex flex-col': chatStarted,
              })}
            >
              <ClientOnly>
                {() => (
                  <div className="w-full max-w-chat mx-auto mb-4">
                    <MigrationBanner />
                  </div>
                )}
              </ClientOnly>
              <ClientOnly>
                {() => {
                  return chatStarted ? (
                    <Messages
                      ref={messageRef}
                      className="flex flex-col w-full flex-1 max-w-chat px-4 pb-6 mx-auto z-[1]"
                      messages={messages}
                      isStreaming={isStreaming}
                    />
                  ) : null;
                }}
              </ClientOnly>
              <div
                className={classNames('relative z-[2] mx-auto w-full max-w-chat', {
                  'sticky bottom-0': chatStarted,
                })}
              >
                <div className="rounded-2xl border border-bolt-elements-borderColor/50 bg-bolt-elements-background-depth-2/95 shadow-xl shadow-black/20 backdrop-blur-xl ring-1 ring-inset ring-white/[0.04]">
                  <textarea
                    ref={textareaRef}
                    className="w-full resize-none rounded-2xl border-none bg-transparent px-5 pb-3 pt-4 text-sm text-bolt-elements-textPrimary outline-none placeholder:text-bolt-elements-textTertiary leading-relaxed"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        if (event.shiftKey) {
                          return;
                        }

                        event.preventDefault();

                        sendMessage?.(event);
                      }
                    }}
                    value={input}
                    onChange={(event) => {
                      handleInputChange?.(event);
                    }}
                    style={{
                      minHeight: TEXTAREA_MIN_HEIGHT,
                      maxHeight: TEXTAREA_MAX_HEIGHT,
                    }}
                    placeholder="How can BoltDIY help you today?"
                    translate="no"
                  />
                  <ClientOnly>
                    {() => (
                      <SendButton
                        show={input.length > 0 || isStreaming}
                        isStreaming={isStreaming}
                        onClick={(event) => {
                          if (isStreaming) {
                            handleStop?.();
                            return;
                          }

                          sendMessage?.(event);
                        }}
                      />
                    )}
                  </ClientOnly>
                  <div className="flex items-start justify-between px-5 pb-4 text-sm">
                    <div className="flex gap-1 items-center">
                      <IconButton
                        title="Enhance prompt"
                        disabled={input.length === 0 || enhancingPrompt}
                        className={classNames({
                          '!opacity-100': enhancingPrompt,
                          '!text-bolt-elements-item-contentAccent pr-1.5 enabled:hover:!bg-bolt-elements-item-backgroundAccent':
                            promptEnhanced,
                        })}
                        onClick={() => enhancePrompt?.()}
                      >
                        {enhancingPrompt ? (
                          <>
                            <Loader2 className="w-5 h-5 text-bolt-elements-loader-progress animate-spin" />
                            <div className="ml-1.5">Enhancing prompt...</div>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" />
                            {promptEnhanced && <div className="ml-1.5 text-xs">Prompt enhanced</div>}
                          </>
                        )}
                      </IconButton>
                    </div>
                    <div className="flex gap-3 items-center">
                      <ClientOnly>{() => <ModelSelector />}</ClientOnly>
                      {input.length > 3 ? (
                        <div className="text-xs text-bolt-elements-textSecondary">
                          Use <kbd className="kdb">Shift</kbd> + <kbd className="kdb">Return</kbd> for a new line
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="pb-8" />
              </div>
            </div>
          </div>
          <ClientOnly>{() => <Workbench chatStarted={chatStarted} isStreaming={isStreaming} />}</ClientOnly>
        </div>
      </div>
    );
  },
);
