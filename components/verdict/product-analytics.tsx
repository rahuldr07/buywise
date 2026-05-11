import type { Alternative, PricePoint, ScoreCard } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface ProductAnalyticsProps {
  scores: ScoreCard[];
  priceHistory: PricePoint[];
  currentScore: number;
  currentPrice: number;
  alternative?: Alternative;
}

const scoreColors = ["#2867e8", "#23a866", "#e99b22", "#7b5af7"];

function shortScoreLabel(label: string) {
  return label.replace("Review Trust Score", "Trust").replace(" Score", "");
}

export function ProductAnalytics({
  scores,
  priceHistory,
  currentScore,
  currentPrice,
  alternative,
}: ProductAnalyticsProps) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <article className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(44,37,24,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-primary text-sm font-black">Price trend</p>
            <h2 className="font-display text-bw-ink mt-2 text-2xl font-black">
              Recent price movement
            </h2>
          </div>
          <span className="border-bw-border bg-bw-fog text-bw-ink rounded-full border px-3 py-1 text-sm font-black">
            {formatPrice(currentPrice)}
          </span>
        </div>

        <PriceLineChart points={priceHistory} />
      </article>

      <article className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(44,37,24,0.06)]">
        <div>
          <p className="text-primary text-sm font-black">Signal radar</p>
          <h2 className="font-display text-bw-ink mt-2 text-2xl font-black">
            Score shape by category
          </h2>
        </div>

        <RadarScoreChart scores={scores} />
      </article>

      <article className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(44,37,24,0.06)]">
        <div>
          <p className="text-primary text-sm font-black">Score bars</p>
          <h2 className="font-display text-bw-ink mt-2 text-2xl font-black">
            Component score breakdown
          </h2>
        </div>

        <div className="mt-6 space-y-4">
          {scores.map((score, index) => (
            <div key={score.id}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-bw-ink text-sm font-black">
                  {shortScoreLabel(score.label)}
                </span>
                <span className="font-display text-bw-ink text-lg font-black">{score.score}</span>
              </div>
              <div className="bg-bw-border h-3 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${score.score}%`,
                    backgroundColor: scoreColors[index % scoreColors.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(44,37,24,0.06)]">
        <div>
          <p className="text-primary text-sm font-black">Comparison</p>
          <h2 className="font-display text-bw-ink mt-2 text-2xl font-black">
            Current pick vs alternative
          </h2>
        </div>

        <div className="mt-6 space-y-5">
          <ComparisonBar label="Current" price={currentPrice} score={currentScore} />
          {alternative ? (
            <ComparisonBar
              label="Alternative"
              price={alternative.price}
              score={alternative.aiBuyScore}
            />
          ) : null}
        </div>
      </article>
    </section>
  );
}

function PriceLineChart({ points }: { points: PricePoint[] }) {
  const width = 560;
  const height = 260;
  const chartLeft = 42;
  const chartTop = 26;
  const chartWidth = 476;
  const chartHeight = 168;
  const prices = points.map((point) => point.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = Math.max(1, max - min);
  const coordinates = points.map((point, index) => {
    const x = chartLeft + (index / Math.max(1, points.length - 1)) * chartWidth;
    const y = chartTop + chartHeight - ((point.price - min) / range) * chartHeight;
    return { ...point, x, y };
  });
  const line = coordinates.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="border-bw-border bg-bw-paper mt-5 overflow-hidden rounded-[1.5rem] border">
      <svg
        aria-label="Recent price line chart"
        className="h-72 w-full"
        viewBox={`0 0 ${width} ${height}`}
      >
        <g stroke="#eadfc8" strokeWidth="1">
          {[0, 1, 2, 3].map((lineIndex) => {
            const y = chartTop + (lineIndex / 3) * chartHeight;
            return (
              <line key={lineIndex} x1={chartLeft} x2={chartLeft + chartWidth} y1={y} y2={y} />
            );
          })}
        </g>
        <polyline
          fill="none"
          points={line}
          stroke="#2867e8"
          strokeLinecap="round"
          strokeWidth="5"
        />
        {coordinates.map((point) => (
          <g key={point.date}>
            <circle
              cx={point.x}
              cy={point.y}
              fill="#ffffff"
              r="8"
              stroke="#2867e8"
              strokeWidth="4"
            />
            <text
              fill="#182019"
              fontSize="13"
              fontWeight="800"
              textAnchor="middle"
              x={point.x}
              y={224}
            >
              {point.date}
            </text>
            <text
              fill="#6d7169"
              fontSize="12"
              fontWeight="700"
              textAnchor="middle"
              x={point.x}
              y={242}
            >
              ${point.price}
            </text>
          </g>
        ))}
        <text fill="#6d7169" fontSize="12" fontWeight="800" x={chartLeft} y={18}>
          High ${max}
        </text>
        <text fill="#6d7169" fontSize="12" fontWeight="800" x={chartLeft} y={214}>
          Low ${min}
        </text>
      </svg>
    </div>
  );
}

function RadarScoreChart({ scores }: { scores: ScoreCard[] }) {
  const center = 140;
  const radius = 92;
  const levels = [0.25, 0.5, 0.75, 1];
  const polygon = scores
    .map((score, index) => {
      const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
      const distance = (score.score / 100) * radius;
      return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`;
    })
    .join(" ");

  return (
    <div className="border-bw-border bg-bw-paper mt-5 grid gap-5 rounded-[1.5rem] border p-4 md:grid-cols-[18rem_1fr] md:items-center">
      <svg aria-label="Score radar chart" className="mx-auto size-72" viewBox="0 0 280 280">
        {levels.map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            fill="none"
            r={radius * level}
            stroke="#eadfc8"
            strokeWidth="1.5"
          />
        ))}
        {scores.map((score, index) => {
          const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          return (
            <line
              key={score.id}
              stroke="#eadfc8"
              strokeWidth="1.5"
              x1={center}
              x2={x}
              y1={center}
              y2={y}
            />
          );
        })}
        <polygon
          fill="rgba(40,103,232,0.18)"
          points={polygon}
          stroke="#2867e8"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        {scores.map((score, index) => {
          const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
          const labelRadius = radius + 30;
          const x = center + Math.cos(angle) * labelRadius;
          const y = center + Math.sin(angle) * labelRadius;
          return (
            <text
              key={score.id}
              fill="#182019"
              fontSize="12"
              fontWeight="800"
              textAnchor="middle"
              x={x}
              y={y}
            >
              {shortScoreLabel(score.label)}
            </text>
          );
        })}
      </svg>

      <div className="space-y-3">
        {scores.map((score) => (
          <div
            key={score.id}
            className="border-bw-border flex items-center justify-between gap-4 rounded-full border bg-white px-4 py-3"
          >
            <span className="text-bw-muted text-sm font-black">{shortScoreLabel(score.label)}</span>
            <span className="font-display text-bw-ink text-xl font-black">{score.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonBar({ label, score, price }: { label: string; score: number; price: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <p className="text-bw-ink font-black">{label}</p>
          <p className="text-bw-muted text-sm font-bold">{formatPrice(price)}</p>
        </div>
        <span className="font-display text-bw-ink text-2xl font-black">{score}</span>
      </div>
      <div className="border-bw-border bg-bw-paper h-12 overflow-hidden rounded-full border p-1">
        <div
          className="bg-bw-green flex h-full items-center justify-end rounded-full pr-4 text-sm font-black text-white"
          style={{ width: `${score}%` }}
        >
          {score}/100
        </div>
      </div>
    </div>
  );
}
