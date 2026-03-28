type SparklineProps = {
  data: Array<{ label: string; value: number }>;
};

export function SparklineChart({ data }: SparklineProps) {
  const width = 520;
  const height = 220;
  const paddingX = 18;
  const paddingY = 18;
  const maxValue = Math.max(...data.map((item) => item.value));
  const minValue = Math.min(...data.map((item) => item.value));
  const range = Math.max(1, maxValue - minValue);
  const stepX = data.length > 1 ? (width - paddingX * 2) / (data.length - 1) : 0;

  const points = data.map((item, index) => {
    const x = paddingX + index * stepX;
    const normalized = (item.value - minValue) / range;
    const y = height - paddingY - normalized * (height - paddingY * 2);
    return { ...item, x, y };
  });

  const d = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const area = `${d} L ${width - paddingX} ${height - paddingY} L ${paddingX} ${
    height - paddingY
  } Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full">
      <defs>
        <linearGradient id="workspace-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgb(34,211,238)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgb(34,211,238)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} rx="20" fill="rgba(255,255,255,0.02)" />
      {[0, 1, 2, 3].map((row) => (
        <line
          key={row}
          x1={paddingX}
          x2={width - paddingX}
          y1={paddingY + row * 42}
          y2={paddingY + row * 42}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
      ))}
      <path d={area} fill="url(#workspace-area)" />
      <path d={d} fill="none" stroke="rgb(45,212,191)" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, index) => (
        <g key={point.label}>
          <circle cx={point.x} cy={point.y} r="5.5" fill="rgb(45,212,191)" />
          {index === points.length - 1 ? (
            <circle cx={point.x} cy={point.y} r="12" fill="rgba(45,212,191,0.12)" />
          ) : null}
        </g>
      ))}
      {points.map((point, index) => (
        <text
          key={`${point.label}-label`}
          x={point.x}
          y={height - 2}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="11"
        >
          {index % 2 === 0 ? point.label : ""}
        </text>
      ))}
    </svg>
  );
}

type DonutChartProps = {
  data: Array<{ name: string; value: number; color: string }>;
};

export function DonutChart({ data }: DonutChartProps) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const segments = data.reduce<{
    items: Array<{ name: string; value: number; color: string; offset: number; dash: number }>;
    offset: number;
  }>(
    (acc, segment) => {
      const dash = (segment.value / 100) * circumference;
      acc.items.push({
        ...segment,
        dash,
        offset: acc.offset,
      });
      acc.offset += dash;
      return acc;
    },
    { items: [], offset: 0 }
  ).items;

  return (
    <div className="relative flex h-[208px] w-[208px] items-center justify-center">
      <svg viewBox="0 0 208 208" className="absolute inset-0">
        <circle cx="104" cy="104" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="22" />
        {segments.map((segment) => {
          return (
            <circle
              key={segment.name}
              cx="104"
              cy="104"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="22"
              strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
              strokeDashoffset={-segment.offset}
              strokeLinecap="round"
              transform="rotate(-90 104 104)"
            />
          );
        })}
      </svg>
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.28em] text-white/45">Traffic Mix</div>
        <div className="mt-2 text-3xl font-semibold text-white">100%</div>
        <div className="mt-1 text-sm text-white/60">Total source share</div>
      </div>
    </div>
  );
}
