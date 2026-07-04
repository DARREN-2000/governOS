import { useState, useRef, useEffect } from 'react'
import { Terminal, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/Button'

export function Playground() {
  const [command, setCommand] = useState('')
  const [output, setOutput] = useState<{ type: 'command' | 'plan' | 'success' | 'error' | 'info', text: string | React.ReactNode }[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [output, isProcessing])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1
        setHistoryIndex(nextIndex)
        setCommand(history[history.length - 1 - nextIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const prevIndex = historyIndex - 1
        setHistoryIndex(prevIndex)
        setCommand(history[history.length - 1 - prevIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCommand('')
      }
    }
  }

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    const newCommand = command
    setCommand('')
    setHistory(prev => [...prev, newCommand])
    setHistoryIndex(-1)

    setOutput(prev => [...prev, { type: 'command', text: `➜ governos plan "${newCommand}"` }])

    if (newCommand.trim().toLowerCase() === 'help') {
      setOutput(prev => [
        ...prev,
        {
          type: 'info',
          text: (
            <div className="mt-2 text-white/80">
              <p>Available playground commands:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <li><span className="text-primary">deploy [app]</span> - Simulate a deployment</li>
                <li><span className="text-primary">scale [service] [number]</span> - Simulate scaling a service</li>
                <li><span className="text-primary">restart [pod]</span> - Simulate restarting a resource</li>
                <li><span className="text-primary">rollback [app]</span> - Rollback a deployment</li>
                <li><span className="text-primary">provision [resource]</span> - Provision infrastructure</li>
                <li><span className="text-primary">destroy [resource]</span> - Destroy resources</li>
                <li><span className="text-primary">analyze [target]</span> - Analyze system state</li>
                <li><span className="text-primary">audit [target]</span> - Run security audit</li>
                <li><span className="text-primary">status</span> - View system status</li>
                <li><span className="text-primary">history</span> - View execution history</li>
                <li><span className="text-primary">whoami</span> - Display current identity</li>
                <li><span className="text-primary">help</span> - Show this help message</li>
                <li><span className="text-primary">clear</span> - Clear the terminal</li>
              </ul>
            </div>
          )
        }
      ])
      return
    }

    if (newCommand.trim().toLowerCase() === 'status') {
      setOutput(prev => [
        ...prev,
        {
          type: 'info',
          text: (
            <div className="mt-2 text-green-400 font-mono">
              <p>System Status: ONLINE</p>
              <p>Control Plane: HEALTHY</p>
              <p>Worker Nodes: 3/3 READY</p>
              <p>Active Policies: 12</p>
            </div>
          )
        }
      ])
      return
    }

    if (newCommand.trim().toLowerCase() === 'history') {
      setOutput(prev => [
        ...prev,
        {
          type: 'info',
          text: (
            <div className="mt-2 text-white/80 font-mono">
              <p>Recent Executions:</p>
              {history.length > 0 ? (
                <ul className="list-decimal pl-5 mt-1">
                  {history.slice(-5).map((cmd, i) => (
                    <li key={i}>{cmd}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground mt-1">No execution history found.</p>
              )}
            </div>
          )
        }
      ])
      return
    }

    if (newCommand.trim().toLowerCase() === 'whoami') {
      setOutput(prev => [
        ...prev,
        {
          type: 'info',
          text: (
            <div className="mt-2 text-blue-400 font-mono">
              <p>User: admin@governos.local</p>
              <p>Role: Super Admin</p>
              <p>Permissions: ['*']</p>
              <p>Session Expires: 23h 59m</p>
            </div>
          )
        }
      ])
      return
    }

    if (newCommand.trim().toLowerCase() === 'clear') {
      setOutput([])
      return
    }

    setIsProcessing(true)

    const lowerCmd = newCommand.toLowerCase()
    let action = 'Mock execution for intent'
    let target = newCommand
    let risk = 'Low'
    let delay = 1500
    let steps = [
      'Verify target state and policies',
      'Run pre-flight checks and dry-run',
      'Execute target operation'
    ]

    if (lowerCmd.includes('deploy')) {
      action = 'Deploy service to production environment'
      target = newCommand.replace(/deploy/i, '').trim() || 'app'
      risk = 'High'
      delay = 2000
      steps = [
        'Pull latest container image',
        'Apply configuration changes',
        'Perform rolling deployment',
        'Verify health checks'
      ]
    } else if (lowerCmd.includes('scale')) {
      action = 'Scale replica count'
      target = newCommand.replace(/scale/i, '').trim() || 'deployment'
      risk = 'Medium'
      delay = 1200
      steps = [
        'Calculate required capacity',
        'Update deployment replica count',
        'Wait for new pods to be ready'
      ]
    } else if (lowerCmd.includes('restart')) {
      action = 'Rolling restart of workloads'
      target = newCommand.replace(/restart/i, '').trim() || 'pods'
      risk = 'Medium'
      delay = 1800
      steps = [
        'Cordon existing nodes',
        'Evict current workloads',
        'Restart workload pods sequentially'
      ]
    } else if (lowerCmd.includes('rollback')) {
      action = 'Rollback deployment to previous version'
      target = newCommand.replace(/rollback/i, '').trim() || 'app'
      risk = 'High'
      delay = 2500
      steps = [
        'Identify previous stable revision',
        'Drain traffic from current revision',
        'Restore previous configuration',
        'Verify service stability'
      ]
    } else if (lowerCmd.includes('provision')) {
      action = 'Provision new cloud resources'
      target = newCommand.replace(/provision/i, '').trim() || 'resource'
      risk = 'High'
      delay = 3000
      steps = [
        'Validate Infrastructure as Code',
        'Acquire cloud provider locks',
        'Create requested resources',
        'Apply default security policies'
      ]
    } else if (lowerCmd.includes('destroy')) {
      action = 'Destroy cloud resources permanently'
      target = newCommand.replace(/destroy/i, '').trim() || 'resource'
      risk = 'Critical'
      delay = 3500
      steps = [
        'Isolate resources from network',
        'Take final data snapshots',
        'Decommission resources',
        'Release allocated IPs/Storage'
      ]
    } else if (lowerCmd.includes('analyze')) {
      action = 'Analyze system state and performance'
      target = newCommand.replace(/analyze/i, '').trim() || 'target'
      risk = 'Low'
      delay = 1000
      steps = [
        'Collect metrics and logs',
        'Identify performance bottlenecks',
        'Generate optimization recommendations'
      ]
    } else if (lowerCmd.includes('audit')) {
      action = 'Run security compliance audit'
      target = newCommand.replace(/audit/i, '').trim() || 'target'
      risk = 'Low'
      delay = 2000
      steps = [
        'Scan for known vulnerabilities',
        'Check IAM permissions',
        'Verify compliance with CIS benchmarks',
        'Generate audit report'
      ]
    }

    setTimeout(() => {
      setOutput(prev => [
        ...prev,
        { type: 'success', text: '✔ Analyzed intent' },
        { type: 'success', text: '✔ Generated workflow spec' },
        { type: 'success', text: '✔ Policy checks passed' },
        {
          type: 'plan',
          text: (
            <div className="mt-4 mb-4 p-4 border border-white/10 bg-black/40 rounded-lg">
              <p className="text-white/90 font-bold border-b border-white/10 pb-2 mb-2">Proposed Execution Plan:</p>
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-muted-foreground">1.</span>
                  <span>{action}: <span className="text-purple-400 font-semibold">{target}</span></span>
                </p>
                {steps.map((step, idx) => (
                  <p key={idx} className="flex items-start gap-2">
                    <span className="text-muted-foreground">{idx + 2}.</span>
                    <span>{step}</span>
                  </p>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <p className={risk === 'Critical' ? 'text-red-500 font-bold animate-pulse' : risk === 'High' ? 'text-destructive font-bold' : risk === 'Medium' ? 'text-yellow-400' : 'text-green-400'}>
                  {risk === 'Critical' ? '🚨' : risk === 'High' ? '⛔' : risk === 'Medium' ? '⚠️' : '✅'} Risk Level: {risk} {risk === 'Low' && '(Auto-approved)'}
                </p>
                <span className="text-xs text-muted-foreground">Est. Time: {(delay / 1000).toFixed(1)}s</span>
              </div>
            </div>
          )
        }
      ])
      setIsProcessing(false)
    }, delay)
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

              <div className="mt-4 mb-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="h-6 text-xs bg-white/5 border-white/10 text-muted-foreground hover:text-white" onClick={() => setCommand('status')}>status</Button>
                <Button variant="outline" size="sm" className="h-6 text-xs bg-white/5 border-white/10 text-muted-foreground hover:text-white" onClick={() => setCommand('analyze frontend')}>analyze frontend</Button>
                <Button variant="outline" size="sm" className="h-6 text-xs bg-white/5 border-white/10 text-muted-foreground hover:text-white" onClick={() => setCommand('audit iam')}>audit iam</Button>
                <Button variant="outline" size="sm" className="h-6 text-xs bg-white/5 border-white/10 text-muted-foreground hover:text-white" onClick={() => setCommand('provision database')}>provision database</Button>
                <Button variant="outline" size="sm" className="h-6 text-xs bg-white/5 border-white/10 text-muted-foreground hover:text-destructive" onClick={() => setCommand('destroy cache-cluster')}>destroy cache-cluster</Button>
                <Button variant="outline" size="sm" className="h-6 text-xs bg-white/5 border-white/10 text-muted-foreground hover:text-white" onClick={() => setCommand('help')}>help</Button>
              </div>

              <br />
              {output.map((item, i) => (
                <div key={i}>
                  {item.type === 'command' && <p className="mt-4 text-white"><span className="text-blue-400">➜</span> {typeof item.text === 'string' ? item.text.replace('➜ ', '') : item.text}</p>}
                  {item.type === 'success' && <p className="text-green-400 flex items-center gap-2"><span className="text-green-500">✔</span> {typeof item.text === 'string' ? item.text.replace('✔ ', '') : item.text}</p>}
                  {item.type === 'error' && <p className="text-destructive flex items-center gap-2"><span className="text-destructive">✖</span> {item.text}</p>}
                  {item.type === 'info' && item.text}
                  {item.type === 'plan' && item.text}
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-2 mt-2 text-primary">
                  <span className="animate-spin text-lg leading-none">⟳</span>
                  <span className="animate-pulse">Processing intent...</span>
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>

            <form onSubmit={handleCommand} className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
              <span className="text-blue-400 font-bold">➜</span>
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. deploy production (try 'help')"
                  className="w-full bg-transparent border-none outline-none text-white/90 placeholder:text-muted-foreground/50 font-mono focus:ring-0"
                  disabled={isProcessing}
                  autoFocus
                  autoComplete="off"
                />
                {!isProcessing && command === '' && (
                   <span className="absolute left-[200px] w-2 h-4 bg-primary/50 animate-pulse pointer-events-none hidden sm:block"></span>
                )}
              </div>
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
