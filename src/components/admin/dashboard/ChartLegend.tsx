'use client'

interface ChartLegendItem {
    name: string
    value: number
    color: string
}

interface ChartLegendProps {
    data: ChartLegendItem[]
}

export function ChartLegend({ data }: ChartLegendProps) {
    const total = data.reduce((s, d) => s + d.value, 0)
    return (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {data.map((item) => {
                const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0'
                return (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                        <span
                            className="inline-block size-3 shrink-0"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-foreground">{item.name}</span>
                        <span className="text-muted-foreground">{pct}%</span>
                    </div>
                )
            })}
        </div>
    )
}
