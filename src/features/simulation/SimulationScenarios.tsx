import { scenarios } from '../../constants/mockData'
import { formatCurrency } from '../../utils/formatters'

export function SimulationScenarios() {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Simulation</h2>
        <span>48 month horizon</span>
      </div>
      <div className="scenario-grid">
        {scenarios.map((scenario) => (
          <article key={scenario.id} className="scenario-card">
            <strong>{scenario.name}</strong>
            <span>{formatCurrency(scenario.projectedBalance)}</span>
            <small>
              {formatCurrency(scenario.monthlySavings)} monthly for {scenario.horizonMonths} months
            </small>
          </article>
        ))}
      </div>
    </section>
  )
}
