// App.js
import React, { useState, useMemo } from "react";
import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";

// 🔥 JSON hiring process fetch from Streamlit iframe page
const urlParams = new URLSearchParams(window.location.search);

// stages: JSON array of stages passed from Streamlit
let stages = [];
try {
  const raw = urlParams.get("data");
  stages = raw ? JSON.parse(raw) : [];
} catch (e) {
  console.error("Invalid stages JSON from Streamlit:", e);
  stages = [];
}

const company = urlParams.get("company") || "Company";
const domain = urlParams.get("domain") || "Role";

// ---- Single stage box component ----
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
  // expanded = kis stage ka index open hai (null = koi nahi)
  const [expanded, setExpanded] = useState(null);

  const { nodes, edges } = useMemo(() => {
    const ns = [];
    const es = [];

    const gapX = 300;
    const topY = 140; // thoda neeche so title ke niche aaye

    // ---------- MAIN ROW STAGES ----------
    stages.forEach((s, i) => {
      const stageId = `stage-${i}`;

      ns.push({
        id: stageId,
        position: { x: i * gapX + 60, y: topY },
        data: {
          label: (
            <StageNode
              label={s.title}
              time={s.time}
              number={i + 1}
              onClick={() =>
                setExpanded((cur) => (cur === i ? null : i))
              }
            />
          ),
        },
      });

      // dotted animated connector between stages
      if (i < stages.length - 1) {
        const nextId = `stage-${i + 1}`;
        es.push({
          id: `e-${stageId}-${nextId}`,
          source: stageId,
          target: nextId,
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

    // ---------- SUB-FLOW for ACTIVE STAGE ----------
    if (expanded !== null && stages[expanded]) {
      const s = stages[expanded];
      const stageId = `stage-${expanded}`;

      const baseX = expanded * gapX + 60;
      const midY = topY + 160;
      const bottomY = midY + 160;

      const sections = s.sections || [];

      // ellipse section nodes
      sections.forEach((sec, j) => {
        const offsetX = (j - (sections.length - 1) / 2) * 220;
        const secId = `${stageId}-sec-${j}`;

        ns.push({
          id: secId,
          position: { x: baseX + offsetX, y: midY },
          data: { label: <div className="sec-node">{sec.name}</div> },
        });

        es.push({
          id: `e-${stageId}-${secId}`,
          source: stageId,
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

      // bottom topics box
      const detailId = `${stageId}-details`;
      ns.push({
        id: detailId,
        position: { x: baseX - 100, y: bottomY },
        data: {
          label: (
            <div className="topics-box">
              {sections.map((sec) => (
                <div key={sec.name} className="topics-section">
                  <div className="topics-section-title">{sec.name}</div>
                  <ul>
                    {(sec.topics || []).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ),
        },
      });

      // connect each section to details box
      sections.forEach((sec, j) => {
        const secId = `${stageId}-sec-${j}`;
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
        <h2>
          {company} — {domain} Hiring Process
        </h2>
        <p>
          This flowchart shows the hiring stages of {company}. Click any stage
          to view sections and topic breakup.
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
