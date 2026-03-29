import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LogEntry {
  time: string;
  message: string;
  type: "default" | "success" | "error" | "processing" | "info";
}

interface Scene {
  id: number;
  start: string;
  end: string;
  duration: string;
  status: "pending" | "done" | "failed";
}

const Editor = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"progress" | "logs" | "scenes">("progress");
  const [threads, setThreads] = useState(4);
  const [outputPath, setOutputPath] = useState("");
  const [imagesFolder, setImagesFolder] = useState("");
  const [audioFile, setAudioFile] = useState("");
  const [outputFolder, setOutputFolder] = useState("");
  const [numScenes, setNumScenes] = useState(50);
  const [transition, setTransition] = useState("Fade");
  const [zoomEffect, setZoomEffect] = useState("Mix");
  const [logs, setLogs] = useState<LogEntry[]>([{ time: "00:00", message: "Ready to start...", type: "default" }]);
  const [scenes] = useState<Scene[]>([]);
  const [steps] = useState([
    { emoji: "🎙️", name: "Transcribing Audio", status: "pending" as const },
    { emoji: "✂️", name: "Cutting Into Scenes", status: "pending" as const },
    { emoji: "🖼️", name: "Matching Images", status: "pending" as const },
    { emoji: "🎬", name: "Rendering Video", status: "pending" as const },
  ]);

  const statusColors: Record<string, string> = {
    pending: "text-muted-foreground",
    done: "text-success",
    failed: "text-destructive",
    processing: "text-warning",
  };
  const statusLabels: Record<string, string> = {
    pending: "⏳ Pending",
    done: "✅ Done",
    failed: "❌ Failed",
    processing: "🔄 Processing...",
  };

  const PillToggle = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex gap-2 mt-1.5">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
            value === opt
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-muted-foreground hover:border-primary/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="h-12 flex items-center px-3 border-b border-border bg-background gap-2 text-xs shrink-0">
        <button onClick={() => navigate("/")} className="px-3 py-1 rounded-full border border-border text-muted-foreground hover:border-muted-foreground transition-all duration-200">
          ← Back
        </button>
        <span className="text-border">|</span>
        <span className="text-muted-foreground">Mode:</span>
        <span className="text-warning font-medium">Audio To Video</span>
        <span className="text-border">|</span>
        <span className="text-muted-foreground">Threads:</span>
        <select
          value={threads}
          onChange={e => setThreads(+e.target.value)}
          className="bg-secondary border border-border text-foreground rounded-full px-2 py-0.5 text-xs focus:outline-none"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <span className="text-muted-foreground">Output:</span>
        <input
          value={outputPath}
          onChange={e => setOutputPath(e.target.value)}
          className="bg-input border border-border rounded-full px-3 py-0.5 text-foreground text-xs flex-1 max-w-[200px] focus:outline-none focus:border-primary"
        />
        <button className="px-3 py-1 rounded-full border border-primary text-primary text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-200">
          Browse
        </button>
        <span className="text-border">|</span>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs" style={{ background: "rgba(35,209,96,0.15)", color: "#23d160" }}>
          ● Connected
        </span>
        <button onClick={() => navigate("/")} className="px-3 py-1 rounded-full border border-destructive text-destructive text-xs hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 ml-auto">
          Exit
        </button>
      </header>

      {/* Two Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-[280px] shrink-0 bg-card border-r border-border flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Input Files */}
            <div>
              <div className="border-l-[3px] border-primary pl-2.5 mb-3">
                <h3 className="text-sm font-bold text-foreground">Input Files</h3>
              </div>

              {/* Images Folder */}
              <label className="text-xs text-muted-foreground">📁 Images Folder</label>
              <div className="flex gap-1.5 mt-1">
                <input value={imagesFolder} onChange={e => setImagesFolder(e.target.value)} className="flex-1 bg-input border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary" />
                <button className="px-2.5 py-1 rounded-full border border-primary text-primary text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-200">Browse</button>
              </div>
              <div className="mt-2 border border-dashed border-border rounded-lg p-2.5 text-center" style={{ background: "rgba(45,140,240,0.05)" }}>
                <p className="text-xs text-muted-foreground">Drag & drop folder here</p>
              </div>

              {/* Audio File */}
              <label className="text-xs text-muted-foreground mt-3 block">🎵 Audio File</label>
              <div className="flex gap-1.5 mt-1">
                <input value={audioFile} onChange={e => setAudioFile(e.target.value)} className="flex-1 bg-input border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary" />
                <button className="px-2.5 py-1 rounded-full border border-primary text-primary text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-200">Browse</button>
              </div>
              <div className="mt-2 border border-dashed border-border rounded-lg p-2.5 text-center" style={{ background: "rgba(45,140,240,0.05)" }}>
                <p className="text-xs text-muted-foreground">Drag & drop folder here</p>
              </div>

              {/* Output Folder */}
              <label className="text-xs text-muted-foreground mt-3 block">📤 Output Folder</label>
              <div className="flex gap-1.5 mt-1">
                <input value={outputFolder} onChange={e => setOutputFolder(e.target.value)} className="flex-1 bg-input border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary" />
                <button className="px-2.5 py-1 rounded-full border border-primary text-primary text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-200">Browse</button>
              </div>
            </div>

            {/* Scene Settings */}
            <div>
              <div className="border-l-[3px] border-primary pl-2.5 mb-3">
                <h3 className="text-sm font-bold text-foreground">Scene Settings</h3>
              </div>
              <label className="text-xs text-muted-foreground">Number of Scenes</label>
              <div className="flex items-center mt-1.5 border border-border rounded-lg overflow-hidden">
                <button onClick={() => setNumScenes(Math.max(1, numScenes - 1))} className="px-3 py-1.5 text-muted-foreground hover:text-foreground bg-secondary transition-colors">-</button>
                <input value={numScenes} onChange={e => setNumScenes(Math.max(1, +e.target.value || 1))} className="flex-1 bg-input text-center text-sm text-foreground py-1.5 focus:outline-none" />
                <button onClick={() => setNumScenes(numScenes + 1)} className="px-3 py-1.5 text-muted-foreground hover:text-foreground bg-secondary transition-colors">+</button>
              </div>
              <p className="text-[11px] text-muted-foreground italic mt-1.5">AI will naturally cut audio into this many scenes</p>
            </div>

            {/* Effects */}
            <div>
              <div className="border-l-[3px] border-primary pl-2.5 mb-3">
                <h3 className="text-sm font-bold text-foreground">Effects</h3>
              </div>
              <label className="text-xs text-muted-foreground">Transition</label>
              <PillToggle options={["Fade", "Cross Dissolve"]} value={transition} onChange={setTransition} />
              <label className="text-xs text-muted-foreground mt-3 block">Zoom Effect</label>
              <PillToggle options={["None", "Zoom In", "Zoom Out", "Mix"]} value={zoomEffect} onChange={setZoomEffect} />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-background border-t border-border px-4 py-2 grid grid-cols-4 gap-1 text-center">
            <div><span className="text-sm font-bold text-primary">0</span><br /><span className="text-[10px] text-muted-foreground">Total</span></div>
            <div><span className="text-sm font-bold text-muted-foreground">0</span><br /><span className="text-[10px] text-muted-foreground">Scenes</span></div>
            <div><span className="text-sm font-bold text-success">0</span><br /><span className="text-[10px] text-muted-foreground">Done</span></div>
            <div><span className="text-sm font-bold text-destructive">0</span><br /><span className="text-[10px] text-muted-foreground">Failed</span></div>
          </div>

          {/* Action Buttons */}
          <div className="p-3 space-y-2">
            <button className="w-full py-3.5 rounded-lg bg-success text-success-foreground font-bold text-sm transition-all duration-200 hover:brightness-110">
              ▶ START GENERATION
            </button>
            <button className="w-full py-3 rounded-lg bg-warning text-warning-foreground font-bold text-sm transition-all duration-200 hover:brightness-110">
              ⏸ RESUME PROJECT
            </button>
            <button className="w-full py-3 rounded-lg bg-destructive text-destructive-foreground font-bold text-sm transition-all duration-200 hover:brightness-110">
              ⏹ STOP
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border px-4">
            {(["progress", "logs", "scenes"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "progress" ? "Progress" : tab === "logs" ? "Logs" : "Scenes"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "progress" && (
              <div>
                {/* Overall Progress */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-foreground">Overall Progress</span>
                  <span className="text-sm font-bold text-primary">0%</span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: "0%" }} />
                </div>

                {/* Steps */}
                <div className="space-y-3 mb-6">
                  {steps.map((step, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm text-foreground">{step.emoji} {step.name}</span>
                      <span className={`text-xs ${statusColors[step.status]}`}>{statusLabels[step.status]}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border my-4" />

                {/* Scene Table */}
                {scenes.length > 0 ? (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-muted-foreground">
                        <th className="text-left py-1.5">#</th>
                        <th className="text-left py-1.5">Scene</th>
                        <th className="text-left py-1.5">Start</th>
                        <th className="text-left py-1.5">End</th>
                        <th className="text-left py-1.5">Duration</th>
                        <th className="text-left py-1.5">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenes.map((s, i) => (
                        <tr key={s.id} className={i % 2 === 0 ? "bg-background" : "bg-card"}>
                          <td className="py-1.5 text-foreground">{s.id}</td>
                          <td className="py-1.5 text-foreground">Scene {s.id}</td>
                          <td className="py-1.5 text-muted-foreground">{s.start}</td>
                          <td className="py-1.5 text-muted-foreground">{s.end}</td>
                          <td className="py-1.5 text-primary">{s.duration}</td>
                          <td className="py-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                              s.status === "done" ? "bg-success/15 text-success" :
                              s.status === "failed" ? "bg-destructive/15 text-destructive" :
                              "bg-muted text-muted-foreground"
                            }`}>{s.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <span className="text-5xl mb-4">🎬</span>
                    <p className="text-base text-foreground">No project started yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Select files and click Start Generation</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground text-center mt-6">Estimated: -- mins remaining</p>
              </div>
            )}

            {activeTab === "logs" && (
              <div className="flex flex-col h-full">
                <div className="flex justify-end mb-2">
                  <button onClick={() => setLogs([{ time: "00:00", message: "Ready to start...", type: "default" }])} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Clear
                  </button>
                </div>
                <div className="flex-1 bg-black rounded-lg p-3 font-mono text-[13px] overflow-y-auto min-h-[300px]">
                  {logs.map((log, i) => (
                    <div key={i} className="leading-6">
                      <span className="text-muted-foreground">[{log.time}]</span>{" "}
                      <span className={
                        log.type === "success" ? "text-success" :
                        log.type === "error" ? "text-destructive" :
                        log.type === "processing" ? "text-warning" :
                        log.type === "info" ? "text-primary" :
                        "text-foreground"
                      }>{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "scenes" && (
              <div>
                {scenes.length > 0 ? (
                  <div className="space-y-0">
                    {scenes.map((s, i) => (
                      <div key={s.id} className={`flex items-center justify-between py-2.5 px-3 border-b border-border ${i % 2 === 0 ? "bg-background" : "bg-card"}`}>
                        <span className="text-sm text-foreground">Scene {s.id}</span>
                        <span className="text-xs text-muted-foreground">{s.start} → {s.end}</span>
                        <span className="text-xs text-primary">{s.duration}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          s.status === "done" ? "bg-success/15 text-success" :
                          s.status === "failed" ? "bg-destructive/15 text-destructive" :
                          "bg-muted text-muted-foreground"
                        }`}>{s.status === "done" ? "✅" : s.status === "failed" ? "❌" : "⏳"} {s.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <p className="text-base text-foreground">No scenes yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Start processing to see scene list</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
