import React, { useState } from "react";
import ReactFlow, {
  Background,
  Handle
} from "reactflow";
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
          "Time, Speed, Work — 2–3 Q"
        ]
      },
      {
        name: "Logical Reasoning",
        topics: [
          "Series / Patterns — 2–3 Q",
          "Puzzles / Seating — 2–3 Q",
          "Data Sufficiency — 1–2 Q"
        ]
      },
      {
        name: "Verbal Ability",
        topics: [
          "Reading Comprehension — 3–4 Q",
          "Grammar / Error Spotting — 2–3 Q",
          "Vocabulary / Fill in the blanks — 1–2 Q"
        ]
      }
    ]
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
          "Dynamic Programming — 1 Q"
        ]
      }
    ]
  },
  {
    id: "s3",
    title: "Technical Interview",
    time: "30–45 min",
    sections: [
      {
        name: "Interview",
        topics: [
          "Project discussion",
          "DSA & problem solving",
          "Core subjects"
        ]
      }
    ]
  },
  {
    id: "s4",
    title: "HR Interview",
    time: "20–30 min",
    sections: [
      {
        name: "HR",
        topics: [
          "Behavioural questions",
          "Salary, role & joining discussion"
        ]
      }
    ]
  }
];

export default function App() {
  const [active, setActive] = useState(null);

  const baseNodes = stages.map((stg, index) => ({
    id: stg.id,
    position: { x: 300 * index + 60, y: 250 },
    data: {
      label: (
        <div
          onClick={() => setActive(active === stg.id ? null : stg.id)}
          className="main-stage"
        >
          <div className="circle">{index + 1}</div>
          <strong>{stg.title}</strong>
          <div className="time">⏱ {stg.time}</div>
        </div>
      )
    },
    style: { border: "none", background: "transparent" }
  }));

  let subNodes = [];
  let edges = [];

  if (active) {
    const stage = stages.find(s => s.id === active);

    stage.sections.forEach((sec, i) => {
      const y = 420;
      const x = 200 + i * 250;

      subNodes.push({
        id: `${sec.name}`,
        position: { x, y },
        data: { label: <div className="sec-badge">{sec.name}</div> },
        style: { border: "none", background: "transparent" }
      });

      edges.push({
        id: `e-${stage.id}-${sec.name}`,
        source: stage.id,
        target: sec.name,
        animated: true,
        style: { strokeDasharray: "6", strokeWidth: 2, stroke: "#4ade80" }
      });
    });

    const topics = stage.sections.flatMap(sec => sec.topics);
    subNodes.push({
      id: `${stage.id}-topics`,
      position: { x: 500, y: 550 },
      data: {
        label: (
          <div className="topics-box">
            {stage.sections.map(sec => (
              <div key={sec.name} className="topics-sec">
                <b>{sec.name}</b>
                <ul>
                  {sec.topics.map(t => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )
      },
      style: { border: "none", background: "transparent" }
    });

    stage.sections.forEach(sec => {
      edges.push({
        id: `e-${sec.name}-topics`,
        source: sec.name,
        target: `${stage.id}-topics`,
        animated: true,
        style: { strokeDasharray: "4 4", strokeWidth: 2, stroke: "#38bdf8" }
      });
    });
  }

  return (
    // <div className="wrapper">
    //   <div className="title-card">
    //     <h2>Infosys — Software Developer Hiring Process</h2>
    //     <p>This flowchart shows the typical stages. Click on each box to view sections and question breakup.</p>
    //   </div>

      <div className="flow-area">
        <ReactFlow
          nodes={[...baseNodes, ...subNodes]}
          edges={edges}
          fitView
          zoomOnScroll
        >
          <Background variant="dots" gap={22} size={1} color="#1e293b" />
        </ReactFlow>
      </div>
    //</div>
  );
}
