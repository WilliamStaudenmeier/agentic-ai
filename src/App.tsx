import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Progress from '@radix-ui/react-progress'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as Select from '@radix-ui/react-select'
import * as Slider from '@radix-ui/react-slider'
import * as Switch from '@radix-ui/react-switch'
import * as Tabs from '@radix-ui/react-tabs'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  Bot, Check, ChevronDown, CirclePause, CirclePlay, Code2, Ellipsis,
  FlaskConical, Network, Plus, RotateCcw, Search, ShieldCheck,
  Sparkles, X, Zap,
} from 'lucide-react'
import './App.css'

const scenarios = {
  launch: {
    label: 'Prepare product launch brief',
    goal: 'Research the market, draft positioning, validate claims, and assemble a launch-ready brief.',
  },
  incident: {
    label: 'Investigate checkout regression',
    goal: 'Trace the reported regression, isolate likely causes, test a fix, and prepare a concise incident report.',
  },
  research: {
    label: 'Map renewable energy trends',
    goal: 'Collect current signals, compare sources, identify themes, and produce a decision-ready research memo.',
  },
}

const agents = [
  { name: 'Orchestrator', role: 'Plans and delegates', icon: Network, color: 'coral' },
  { name: 'Researcher', role: 'Collects evidence', icon: Search, color: 'blue' },
  { name: 'Builder', role: 'Creates the artifact', icon: Code2, color: 'gold' },
  { name: 'Critic', role: 'Checks quality', icon: ShieldCheck, color: 'green' },
]

const events = [
  ['ORCHESTRATOR', 'Objective parsed into four dependent tasks', 'PLAN'],
  ['ORCHESTRATOR', 'Research task delegated with source constraints', 'DELEGATE'],
  ['RESEARCHER', 'Scanning trusted sources and recent signals', 'TOOL'],
  ['RESEARCHER', 'Evidence bundle returned with 8 findings', 'RESULT'],
  ['ORCHESTRATOR', 'Draft task unblocked and assigned', 'DELEGATE'],
  ['BUILDER', 'Synthesizing findings into structured brief', 'TOOL'],
  ['BUILDER', 'First draft submitted for quality review', 'RESULT'],
  ['CRITIC', 'Checking claims, structure, and completeness', 'REVIEW'],
  ['CRITIC', 'Review passed with two minor refinements', 'RESULT'],
  ['ORCHESTRATOR', 'Final artifact assembled and run completed', 'DONE'],
]

const tasks = [
  { title: 'Decompose objective', owner: 'Orchestrator', end: 1 },
  { title: 'Gather evidence', owner: 'Researcher', end: 4 },
  { title: 'Build first draft', owner: 'Builder', end: 7 },
  { title: 'Validate output', owner: 'Critic', end: 9 },
]

type ScenarioKey = keyof typeof scenarios

function App() {
  const [scenario, setScenario] = useState<ScenarioKey>('launch')
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState([1])
  const [autoRetry, setAutoRetry] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [customGoal, setCustomGoal] = useState('')
  const [activeGoal, setActiveGoal] = useState('')

  const complete = step >= events.length
  const progress = Math.round((step / events.length) * 100)

  useEffect(() => {
    if (!running || complete) return
    const timer = window.setTimeout(() => {
      if (step === events.length - 1) {
        setStep(events.length)
        setRunning(false)
        return
      }
      setStep(step + 1)
    }, 1200 / speed[0])
    return () => window.clearTimeout(timer)
  }, [running, complete, step, speed])

  const reset = () => {
    setRunning(false)
    setStep(0)
  }

  const changeScenario = (value: ScenarioKey) => {
    setScenario(value)
    setActiveGoal('')
    reset()
  }

  const createObjective = () => {
    if (!customGoal.trim()) return
    setActiveGoal(customGoal.trim())
    setCustomGoal('')
    setDialogOpen(false)
    reset()
  }

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="app-shell">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="Agentic AI home">
            <span className="brand-mark"><Sparkles size={18} /></span>
            <span>Agentic AI</span>
            <span className="lab-label">SIM LAB</span>
          </a>
          <div className="header-actions">
            <span className="simulation-note"><span /> Local simulation</span>
            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
              <Dialog.Trigger asChild>
                <button className="button primary"><Plus size={16} /> New objective</button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="dialog-content">
                  <div className="dialog-heading">
                    <div><Dialog.Title>New objective</Dialog.Title><Dialog.Description>Give the simulated team a mission to plan and execute.</Dialog.Description></div>
                    <Dialog.Close className="icon-button" aria-label="Close"><X size={18} /></Dialog.Close>
                  </div>
                  <label htmlFor="objective">Objective</label>
                  <textarea id="objective" value={customGoal} onChange={(event) => setCustomGoal(event.target.value)} placeholder="e.g. Compare three launch markets and recommend one" />
                  <button className="button primary wide" onClick={createObjective}>Create simulation</button>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </header>

        <main id="top">
          <section className="intro">
            <div>
              <p className="eyebrow"><Zap size={14} /> Deterministic multi-agent sandbox</p>
              <h1>Watch a team of agents think in systems.</h1>
              <p className="intro-copy">Explore planning, delegation, tool use, and review through a transparent simulation.</p>
            </div>
            <div className="run-summary">
              <div><span>RUN</span><strong>#A-024</strong></div>
              <div><span>ELAPSED</span><strong>{String(Math.floor(step * 1.7)).padStart(2, '0')}:<small>{String((step * 7) % 60).padStart(2, '0')}</small></strong></div>
              <div><span>EVENTS</span><strong>{String(step).padStart(2, '0')}</strong></div>
            </div>
          </section>

          <section className="control-strip" aria-label="Simulation controls">
            <div className="scenario-control">
              <span>SCENARIO</span>
              <Select.Root value={scenario} onValueChange={(value) => changeScenario(value as ScenarioKey)}>
                <Select.Trigger className="select-trigger" aria-label="Choose scenario"><Select.Value /><Select.Icon><ChevronDown size={16} /></Select.Icon></Select.Trigger>
                <Select.Portal><Select.Content className="select-content" position="popper"><Select.Viewport>{Object.entries(scenarios).map(([key, value]) => <Select.Item className="select-item" value={key} key={key}><Select.ItemText>{value.label}</Select.ItemText><Select.ItemIndicator><Check size={14} /></Select.ItemIndicator></Select.Item>)}</Select.Viewport></Select.Content></Select.Portal>
              </Select.Root>
            </div>
            <div className="speed-control">
              <span>SPEED</span>
              <Slider.Root className="slider" value={speed} onValueChange={setSpeed} min={0.5} max={2} step={0.5} aria-label="Simulation speed">
                <Slider.Track className="slider-track"><Slider.Range className="slider-range" /></Slider.Track><Slider.Thumb className="slider-thumb" />
              </Slider.Root>
              <strong>{speed[0]}x</strong>
            </div>
            <div className="retry-control"><div><span>AUTO-RETRY</span><small>Recover failed tasks</small></div><Switch.Root className="switch" checked={autoRetry} onCheckedChange={setAutoRetry}><Switch.Thumb className="switch-thumb" /></Switch.Root></div>
            <button className="button run-button" onClick={() => complete ? (reset(), setRunning(true)) : setRunning(!running)}>
              {running ? <CirclePause size={18} /> : <CirclePlay size={18} />} {running ? 'Pause run' : complete ? 'Run again' : 'Start run'}
            </button>
            <DropdownMenu.Root>
              <Tooltip.Root><Tooltip.Trigger asChild><DropdownMenu.Trigger className="icon-button more-button" aria-label="More run actions"><Ellipsis size={19} /></DropdownMenu.Trigger></Tooltip.Trigger><Tooltip.Portal><Tooltip.Content className="tooltip" sideOffset={6}>Run actions</Tooltip.Content></Tooltip.Portal></Tooltip.Root>
              <DropdownMenu.Portal><DropdownMenu.Content className="menu-content" align="end"><DropdownMenu.Item className="menu-item" onSelect={reset}><RotateCcw size={15} /> Reset run</DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Portal>
            </DropdownMenu.Root>
          </section>

          <section className="workspace">
            <div className="agents-panel">
              <div className="section-heading"><div><p>AGENT ROSTER</p><h2>Specialist team</h2></div><span>{agents.length} online</span></div>
              <div className="agent-list">
                {agents.map((agent, index) => {
                  const activeAgent = Math.min(Math.floor(step / 2.5), 3)
                  const status = complete || activeAgent > index ? 'done' : activeAgent === index && running ? 'active' : 'queued'
                  const Icon = agent.icon
                  return <div className={`agent-row ${status}`} key={agent.name}>
                    <div className={`agent-icon ${agent.color}`}><Icon size={19} /></div>
                    <div className="agent-name"><strong>{agent.name}</strong><span>{agent.role}</span></div>
                    <span className="agent-status">{status === 'done' ? 'Complete' : status === 'active' ? 'Working' : 'Ready'}</span>
                  </div>
                })}
              </div>
              <div className="goal-box"><span>CURRENT OBJECTIVE</span><p>{activeGoal || scenarios[scenario].goal}</p></div>
            </div>

            <Tabs.Root className="activity-panel" defaultValue="trace">
              <div className="activity-header">
                <Tabs.List className="tabs-list"><Tabs.Trigger value="trace">Live trace</Tabs.Trigger><Tabs.Trigger value="tasks">Task graph</Tabs.Trigger></Tabs.List>
                <div className={`live-indicator ${running ? 'is-live' : ''}`}><span /> {complete ? 'COMPLETE' : running ? 'LIVE' : 'PAUSED'}</div>
              </div>
              <Tabs.Content value="trace" className="tab-content">
                <ScrollArea.Root className="trace-scroll"><ScrollArea.Viewport className="trace-viewport">
                  {step === 0 && <div className="empty-trace"><Bot size={28} /><strong>Agents are standing by</strong><span>Start the run to watch their reasoning unfold.</span></div>}
                  {events.slice(0, step).map((event, index) => <div className="trace-event" key={`${event[0]}-${index}`}>
                    <span className="event-time">{String(index * 2).padStart(2, '0')}:{String((index * 7) % 60).padStart(2, '0')}</span>
                    <span className={`event-dot dot-${event[0].toLowerCase()}`} />
                    <div><span className="event-agent">{event[0]}</span><p>{event[1]}</p></div>
                    <span className="event-type">{event[2]}</span>
                  </div>)}
                  {complete && <div className="completion-card"><Check size={20} /><div><strong>Objective complete</strong><span>All tasks passed review in this simulated run.</span></div></div>}
                </ScrollArea.Viewport><ScrollArea.Scrollbar className="scrollbar"><ScrollArea.Thumb className="scroll-thumb" /></ScrollArea.Scrollbar></ScrollArea.Root>
              </Tabs.Content>
              <Tabs.Content value="tasks" className="tab-content task-content">
                {tasks.map((task, index) => { const state = step >= task.end ? 'complete' : step >= (index === 0 ? 0 : tasks[index - 1].end) ? 'active' : 'waiting'; return <div className={`task-row ${state}`} key={task.title}><span className="task-index">0{index + 1}</span><div><strong>{task.title}</strong><span>{task.owner}</span></div><span className="task-state">{state}</span></div> })}
              </Tabs.Content>
              <div className="progress-footer"><div><span>RUN PROGRESS</span><strong>{progress}%</strong></div><Progress.Root className="progress-root" value={progress}><Progress.Indicator className="progress-indicator" style={{ transform: `translateX(-${100 - progress}%)` }} /></Progress.Root></div>
            </Tabs.Root>
          </section>

          <section className="principles">
            <div><FlaskConical size={19} /><strong>Reproducible</strong><span>Every scenario follows inspectable rules.</span></div>
            <div><Network size={19} /><strong>Collaborative</strong><span>Agents delegate through explicit handoffs.</span></div>
            <div><ShieldCheck size={19} /><strong>Verified</strong><span>Every result passes a quality review.</span></div>
          </section>
        </main>
      </div>
    </Tooltip.Provider>
  )
}

export default App