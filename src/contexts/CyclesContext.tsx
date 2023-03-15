import { ReactNode, createContext, useState } from 'react'
interface CreateCycleData {
  task: string
  minutesAmount: number
}
interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  FinishedDate?: Date
}
interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycledId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinishied: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  InterruptCurrentCycle: () => void
}
interface CyclesContextProviderProps {
  children: ReactNode
}
export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycledId, setactiveCycledId] = useState<string | null>(null)
  const [amountSecondsPassed, setamountSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycledId)
  function setSecondsPassed(seconds: number) {
    setamountSecondsPassed(seconds)
  }
  function markCurrentCycleAsFinishied() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycledId) {
          return { ...cycle, FinishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }
  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setactiveCycledId(id)
    setamountSecondsPassed(0)
  }

  function InterruptCurrentCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycledId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setactiveCycledId(null)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycledId,
        markCurrentCycleAsFinishied,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        InterruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
