import { useState } from 'react'
import { Terminal, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/Button'

export function Playground() {
  const [command, setCommand] = useState('')
  const [output, setOutput] = useState<{ type: 'command' | 'plan' | 'success', text: string | React.ReactNode }[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    const newCommand = command
    setCommand('')
    setOutput(prev => [...prev, { type: 'command', text: `➜ governos plan "${newCommand}"` }])
    setIsProcessing(true)

    setTimeout(() => {
      setOutput(prev => [
        ...prev,
        { type: 'success', text: '✔ Analyzed intent' },
        { type: 'success', text: '✔ Generated workflow spec' },
        { type: 'success', text: '✔ Policy checks passed' },
        {
          type: 'plan',
          text: (
            <div className="mt-4 mb-2">
              <p className="text-white/80">Proposed Plan:</p>
              <p>1. Mock execution for intent: <span className="text-purple-400">`{newCommand}`</span></p>
              <p>2. Verify policies and dry-run</p>
              <br />
              <p className="text-yellow-400">⚠️ Risk Level: Low (Auto-approved in Playground)</p>
            </div>
          )
        }
      ])
      setIsProcessing(false)
    }, 1500)
  }

  return (
    <div className="container px-4 py-32 mx-auto md:px-6 min-h-screen flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl text-center mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Playground</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Try out GovernOS locally in this mocked environment. Type an intent to see how it plans execution.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full max-w-4xl"
      >
        <div className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden glass">
          <div className="flex items-center px-4 py-3 border-b border-white/10 bg-muted/30">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-destructive/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto flex items-center text-xs text-muted-foreground font-mono">
              <Terminal className="mr-2 h-3 w-3" /> governos shell
            </div>
          </div>

          <div className="p-6 h-[400px] overflow-y-auto font-mono text-sm leading-relaxed text-muted-foreground bg-black/40 flex flex-col">
            <div className="flex-1 space-y-1">
              <p>Welcome to GovernOS Playground v1.0</p>
              <p>Type a command to generate an execution plan.</p>
              <br />
              {output.map((item, i) => (
                <div key={i}>
                  {item.type === 'command' && <p className="mt-4"><span className="text-blue-400">➜</span> {item.text}</p>}
                  {item.type === 'success' && <p className="text-green-400">{item.text}</p>}
                  {item.type === 'plan' && item.text}
                </div>
              ))}
              {isProcessing && (
                <p className="animate-pulse mt-2 text-primary">Processing intent...</p>
              )}
            </div>

            <form onSubmit={handleCommand} className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
              <span className="text-blue-400 font-bold">➜</span>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="e.g. Scale web tier to 5 replicas"
                className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder:text-muted-foreground/50 font-mono focus:ring-0"
                disabled={isProcessing}
                autoFocus
              />
              <Button type="submit" size="sm" variant="outline" className="px-3" disabled={isProcessing || !command.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
