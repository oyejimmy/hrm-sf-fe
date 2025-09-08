import React, { useState } from "react";
import TrainingDashboard from "./components/TrainingDashboard";
import RoadmapModal from "./components/RoadmapModal";
import RoadmapViewer from "./components/RoadmapViewer";
import TrainingTable from "./components/TrainingTable";
import { Training, RoadmapTrack } from "./types";

const TrainingManagement: React.FC = () => {
  const [roadmapVisible, setRoadmapVisible] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<RoadmapTrack | null>(null);

  const dummyTrainings: Training[] = [
    { id: "1", employeeName: "Alice", department: "IT", track: "Frontend Development", status: "In Progress", progress: 60, deadline: "2025-09-30" },
    { id: "2", employeeName: "Bob", department: "Finance", track: "Accounting Basics", status: "Completed", progress: 100, deadline: "2025-08-20" },
  ];

  const dummyTracks: RoadmapTrack[] = [
    {
      id: "fe",
      title: "Frontend Development",
      description: "Learn React, TypeScript, and UI frameworks",
      milestones: [
        { id: "1", topic: "HTML & CSS", description: "Basics of HTML/CSS", resources: ["https://developer.mozilla.org/"], estimatedTime: "2 weeks", completed: false },
        { id: "2", topic: "React Basics", description: "Intro to React.js", resources: ["https://react.dev"], estimatedTime: "3 weeks", completed: false },
      ],
    },
  ];

  const handleSelectTrack = (track: RoadmapTrack) => {
    setSelectedTrack(track);
    setRoadmapVisible(false);
  };

  const handleToggleModule = (moduleId: string) => {
    if (!selectedTrack) return;
    setSelectedTrack({
      ...selectedTrack,
      milestones: selectedTrack.milestones.map((m) =>
        m.id === moduleId ? { ...m, completed: !m.completed } : m
      ),
    });
  };

  return (
    <div>
      <TrainingDashboard totalEmployees={50} completed={40} inProgress={30} notStarted={30} />

      <button onClick={() => setRoadmapVisible(true)}>Assign Roadmap</button>

      <RoadmapModal
        visible={roadmapVisible}
        onClose={() => setRoadmapVisible(false)}
        tracks={dummyTracks}
        onSelect={handleSelectTrack}
      />

      {selectedTrack && (
        <RoadmapViewer track={selectedTrack} onToggleModule={handleToggleModule} />
      )}

      <TrainingTable data={dummyTrainings} />
    </div>
  );
};

export default TrainingManagement;
