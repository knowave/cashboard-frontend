import { SimulationScenarios } from '../features/simulation/SimulationScenarios'

export function SimulationPage() {
  return (
    <>
      <header className="page-header">
        <div>
          <span>Planner</span>
          <h1>Simulation</h1>
        </div>
        <p>Compare savings strategies against projected balances.</p>
      </header>
      <SimulationScenarios />
    </>
  )
}
