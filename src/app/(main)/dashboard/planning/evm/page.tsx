import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEvmByProject, getForecast } from "@/lib/services/analytics";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(
    amount,
  );
}

function formatIndex(value: number) {
  return value.toFixed(2);
}

export default async function EvmPage() {
  const [evm, forecast] = await Promise.all([getEvmByProject("ITPMS-001"), getForecast("ITPMS-001")]);

  if (!evm) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Earned Value Management</h1>
          <p className="text-muted-foreground text-sm">No EVM data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Earned Value Management</h1>
        <p className="text-muted-foreground text-sm">ITPMS-001 — Performance metrics computed by backend.</p>
      </div>

      {/* Core EVM Values */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Planned Value (PV)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl tabular-nums">{formatCurrency(evm.plannedValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Earned Value (EV)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl tabular-nums">{formatCurrency(evm.earnedValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Actual Cost (AC)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl tabular-nums">{formatCurrency(evm.actualCost)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Variances & Indices */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Schedule Variance (SV)</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`font-semibold text-lg tabular-nums ${evm.scheduleVariance < 0 ? "text-red-600" : "text-green-600"}`}
            >
              {formatCurrency(evm.scheduleVariance)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Cost Variance (CV)</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`font-semibold text-lg tabular-nums ${evm.costVariance < 0 ? "text-red-600" : "text-green-600"}`}
            >
              {formatCurrency(evm.costVariance)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">SPI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`font-semibold text-lg tabular-nums ${evm.spiIndex < 1 ? "text-red-600" : "text-green-600"}`}>
              {formatIndex(evm.spiIndex)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">CPI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`font-semibold text-lg tabular-nums ${evm.cpiIndex < 1 ? "text-red-600" : "text-green-600"}`}>
              {formatIndex(evm.cpiIndex)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Forecast */}
      {forecast && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-sm">Estimate at Completion (EAC)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg tabular-nums">{formatCurrency(forecast.estimateAtCompletion)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-sm">Estimate to Complete (ETC)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg tabular-nums">{formatCurrency(forecast.estimateToComplete)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-sm">Variance at Completion (VAC)</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`font-semibold text-lg tabular-nums ${forecast.varianceAtCompletion < 0 ? "text-red-600" : "text-green-600"}`}
              >
                {formatCurrency(forecast.varianceAtCompletion)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-sm">Projected End Date</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg">
                {new Date(forecast.projectedEndDate).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
