import React, { useState, useMemo } from "react";
import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";

const stages = [
  {
    id: "s1",
    title: "Online Aptitude Test",
    time: "40–45 min",
    sections: [
      {
        name: "Quantitative",
        topics: [
          "Percentages / Ratios — 2–3 Q",
          "Profit & Loss / Simple Interest — 2–3 Q",
          "Time, Speed, Work — 2–3 Q",
        ],
      },
      {
        name: "Logical Reasoning",
        topics: [
          "Series / Patterns — 2–3 Q",
          "Puzzles / Seating — 2–3 Q",
          "Data Sufficiency — 1–2 Q",
        ],
      },
      {
        name: "Verbal Ability",
        topics: [
          "Reading Comprehension — 3–4 Q",
          "Grammar / Error Spotting — 2–3 Q",
          "Vocabulary — 1–2 Q",
        ],
      },
    ],
  },
  {
    id: "s2",
    title: "Technical Assessment",
    time: "45–60 min",
    sections: [
      {
        name: "Coding",
        topics: [
          "Arrays / Strings — 1–2 Q",
          "Recursion — 1 Q",
          "Basic DP — 1 Q",
        ],
      },
    ],
  },
  {
    id: "s3",
    title: "Technical Interview",
    time: "30–45 min",
    sections: [
      {
        name: "Interview",
        topics: ["Project discussion", "DSA round", "Core CS subjects"],
      },
    ],
  },
  {
    id: "s4",
    title: "HR Interview",
    time: "20–30 min",
    sections: [
      {
        name: "HR",
        topics: ["Behavioural questions", "Offer & Joining discussion"],
      },
    ],
  },
];

function StageNode({ label, time, number, onClick }) {
  return (
    <div className="stage-node" onClick={onClick}>
      <div className="stage-circle">{number}</div>
      <div>
        <div className="stage-title">{label}</div>
        <div className="stage-time">⏱ {time}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [expanded, setExpanded] = useState(null);

  const { nodes, edges } = useMemo(() => {
    const ns = [];
    const es = [];

    const gapX = 300;
    const topY = 140; // thoda neeche so title ke niche aaye

    // main row
    stages.forEach((s, i) => {
      ns.push({
        id: s.id,
        position: { x: i * gapX + 60, y: topY },
        data: {
          label: (
            <StageNode
              label={s.title}
              time={s.time}
              number={i + 1}
              onClick={() =>
                setExpanded((cur) => (cur === s.id ? null : s.id))
              }
            />
          ),
        },
      });

      // dotted animated connector
      if (i < stages.length - 1) {
        es.push({
          id: `e-${s.id}-${stages[i + 1].id}`,
          source: s.id,
          target: stages[i + 1].id,
          type: "smoothstep",
          animated: true,
          style: {
            strokeDasharray: "8 4",
            stroke: "#38bdf8",
            strokeWidth: 2,
          },
        });
      }
    });

    // sub-flow for active stage
    if (expanded) {
      const s = stages.find((x) => x.id === expanded);
      const idx = stages.findIndex((x) => x.id === expanded);
      const baseX = idx * gapX + 60;
      const midY = topY + 160;
      const bottomY = midY + 160;

      // ellipse sections
      s.sections.forEach((sec, j) => {
        const offsetX = (j - (s.sections.length - 1) / 2) * 220;
        const secId = `${s.id}-sec-${j}`;

        ns.push({
          id: secId,
          position: { x: baseX + offsetX, y: midY },
          data: { label: <div className="sec-node">{sec.name}</div> },
        });

        es.push({
          id: `e-${s.id}-${secId}`,
          source: s.id,
          target: secId,
          type: "smoothstep",
          animated: true,
          style: {
            strokeDasharray: "8 4",
            stroke: "#4ade80",
            strokeWidth: 2,
          },
        });
      });

      // bottom details card
      const detailId = `${s.id}-details`;
      ns.push({
        id: detailId,
        position: { x: baseX - 100, y: bottomY },
        data: {
          label: (
            <div className="topics-box">
              {s.sections.map((sec) => (
                <div key={sec.name} className="topics-section">
                  <div className="topics-section-title">{sec.name}</div>
                  <ul>
                    {sec.topics.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ),
        },
      });

      s.sections.forEach((sec, j) => {
        const secId = `${s.id}-sec-${j}`;
        es.push({
          id: `e-${secId}-${detailId}`,
          source: secId,
          target: detailId,
          type: "smoothstep",
          animated: true,
          style: {
            strokeDasharray: "6 4",
            stroke: "#60a5fa",
            strokeWidth: 2,
          },
        });
      });
    }

    return { nodes: ns, edges: es };
  }, [expanded]);

  return (
    <div className="hp-react-root">
      <div className="hp-react-header">
        <h2>Infosys — Software Developer Hiring Process</h2>
        <p>
          This flowchart shows the typical stages. Click on each box to view
          sections and question breakup.
        </p>
      </div>

      <div className="hp-react-flow">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background
            variant="dots"
            gap={24}
            size={1}
            color="rgba(148,163,184,0.35)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
