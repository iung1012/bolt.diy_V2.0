#!/bin/sh

BINDINGS=""

add_binding() {
  local name=$1
  local val=$(eval echo "\$$name")
  if [ -n "$val" ]; then
    BINDINGS="$BINDINGS --binding ${name}=${val}"
  fi
}

add_binding ANTHROPIC_API_KEY
add_binding OPENAI_API_KEY
add_binding GOOGLE_API_KEY
add_binding DEEPSEEK_API_KEY
add_binding XAI_API_KEY
add_binding MISTRAL_API_KEY
add_binding SUPABASE_URL
add_binding SUPABASE_ANON_KEY
add_binding SUPABASE_SERVICE_ROLE_KEY
add_binding VITE_SUPABASE_URL
add_binding VITE_SUPABASE_ANON_KEY
add_binding VITE_LOG_LEVEL

echo "Starting wrangler pages dev on port 8788..."
exec wrangler pages dev ./build/client $BINDINGS --port 8788 --ip 0.0.0.0 --no-show-interactive-dev-session
