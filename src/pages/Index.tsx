import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Settings {
  apiKey: string;
  apiThreads: number;
  ffmpegThreads: number;
  resolution: string;
  fps: string;
  quality: string;
}

const defaultSettings: Settings = {
  apiKey: "",
  apiThreads: 3,
  ffmpegThreads: 4,
  resolution: "1080p",
  fps: "30",
  quality: "Balanced CRF17",
};

const Index = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("luqi-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "failed">("idle");
  const [activePreset, setActivePreset] = useState<string | null>(null);

  useEffect(() => {
    if (settings.apiThreads === 2 && settings.ffmpegThreads === 2) setActivePreset("safe");
    else if (settings.apiThreads === 3 && settings.ffmpegThreads === 4) setActivePreset("balanced");
    else if (settings.apiThreads === 5 && settings.ffmpegThreads === 8) setActivePreset("max");
    else setActivePreset(null);
  }, [settings.apiThreads, settings.ffmpegThreads]);

  const handleSave = () => {
    localStorage.setItem("luqi-settings", JSON.stringify(settings));
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setConnectionStatus("idle");
  };

  const handleTestConnection = () => {
    if (settings.apiKey.trim().length > 0) {
      setConnectionStatus("success");
    } else {
      setConnectionStatus("failed");
    }
  };

  const applyPreset = (preset: string) => {
    if (preset === "safe") setSettings(s => ({ ...s, apiThreads: 2, ffmpegThreads: 2 }));
    else if (preset === "balanced") setSettings(s => ({ ...s, apiThreads: 3, ffmpegThreads: 4 }));
    else if (preset === "max") setSettings(s => ({ ...s, apiThreads: 5, ffmpegThreads: 8 }));
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="text-xl font-bold text-foreground">LUQI</span>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">AUTOMATION</span>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">v1.0</span>
        </div>
        <span className="text-sm text-muted-foreground">Developed by Luqman</span>
      </header>

      {/* Info Bar */}
      <div className="h-9 flex items-center px-4 bg-card border-b border-border text-xs gap-3">
        <span className="text-muted-foreground">Status:</span>
        <span className="text-foreground">Ready</span>
        <span className="w-2 h-2 rounded-full bg-success inline-block" />
        <span className="text-border mx-1">|</span>
        <span className="text-muted-foreground">API:</span>
        <span className="text-success">Connected</span>
        <span className="w-2 h-2 rounded-full bg-success inline-block" />
        <span className="text-border mx-1">|</span>
        <span className="text-muted-foreground">Model: Groq Whisper</span>
        <span className="text-border mx-1">|</span>
        <span className="text-muted-foreground">Version: v1.0</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 p-6 gap-0">
        {/* Left Column */}
        <div className="w-[38%]">
          <h2 className="text-base font-bold text-foreground text-center">Select Mode</h2>
          <p className="text-sm text-muted-foreground text-center mt-1">Choose a mode to begin</p>
          <div
            className="mt-5 bg-card border border-border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-[0_0_12px_rgba(45,140,240,0.3)]"
            onClick={() => navigate("/editor")}
          >
            <span className="text-5xl">🎬</span>
            <h3 className="text-lg font-bold text-foreground mt-3">Audio To Video</h3>
            <p className="text-sm text-muted-foreground mt-2">AI Video Generation from Images + Audio</p>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full" style={{ background: "rgba(35,209,96,0.15)", color: "#23d160" }}>
                ● Available
              </span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-[62%] pl-8">
          <h2 className="text-base font-bold text-foreground mb-4">⚙️ Settings</h2>

          {/* API Configuration */}
          <div className="mb-6">
            <div className="border-l-[3px] border-primary pl-2.5 mb-4">
              <h3 className="text-sm font-bold text-foreground">API Configuration</h3>
            </div>
            <label className="text-xs text-muted-foreground">Groq API Key</label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                value={settings.apiKey}
                onChange={e => setSettings(s => ({ ...s, apiKey: e.target.value }))}
                placeholder="Enter your Groq API key..."
                className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                👁
              </button>
            </div>
            <button
              onClick={handleTestConnection}
              className="mt-2.5 px-4 py-1.5 rounded-full border border-primary text-primary text-xs transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
            >
              Test Connection
            </button>
            {connectionStatus === "success" && <p className="text-xs text-success mt-1.5">✅ Connected successfully</p>}
            {connectionStatus === "failed" && <p className="text-xs text-destructive mt-1.5">❌ Connection failed</p>}
          </div>

          {/* Performance */}
          <div className="mb-6">
            <div className="border-l-[3px] border-primary pl-2.5 mb-4">
              <h3 className="text-sm font-bold text-foreground">Performance</h3>
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs text-muted-foreground">API Threads</label>
                <span className="text-xs bg-secondary text-foreground px-2 py-0.5 rounded-full">{settings.apiThreads}</span>
              </div>
              <input
                type="range" min={1} max={5} value={settings.apiThreads}
                onChange={e => setSettings(s => ({ ...s, apiThreads: +e.target.value }))}
                className="w-full accent-primary h-1.5"
                style={{ accentColor: "#2d8cf0" }}
              />
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs text-muted-foreground">FFmpeg Threads</label>
                <span className="text-xs bg-secondary text-foreground px-2 py-0.5 rounded-full">{settings.ffmpegThreads}</span>
              </div>
              <input
                type="range" min={1} max={8} value={settings.ffmpegThreads}
                onChange={e => setSettings(s => ({ ...s, ffmpegThreads: +e.target.value }))}
                className="w-full h-1.5"
                style={{ accentColor: "#2d8cf0" }}
              />
            </div>
            <div className="flex gap-2">
              {[
                { key: "safe", label: "🐢 Safe" },
                { key: "balanced", label: "⚡ Balanced" },
                { key: "max", label: "🚀 Max" },
              ].map(p => (
                <button
                  key={p.key}
                  onClick={() => applyPreset(p.key)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
                    activePreset === p.key
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Video Defaults */}
          <div className="mb-6">
            <div className="border-l-[3px] border-primary pl-2.5 mb-4">
              <h3 className="text-sm font-bold text-foreground">Video Defaults</h3>
            </div>
            <label className="text-xs text-muted-foreground">Resolution</label>
            <PillToggle options={["720p", "1080p", "4K"]} value={settings.resolution} onChange={v => setSettings(s => ({ ...s, resolution: v }))} />
            <label className="text-xs text-muted-foreground mt-3 block">FPS</label>
            <PillToggle options={["24", "30", "60"]} value={settings.fps} onChange={v => setSettings(s => ({ ...s, fps: v }))} />
            <label className="text-xs text-muted-foreground mt-3 block">Quality</label>
            <PillToggle options={["Max CRF15", "Balanced CRF17", "Compressed CRF20"]} value={settings.quality} onChange={v => setSettings(s => ({ ...s, quality: v }))} />
          </div>

          {/* Save Buttons */}
          <button onClick={handleSave} className="w-full py-3 rounded-lg bg-success text-success-foreground font-bold text-sm transition-all duration-200 hover:brightness-110">
            💾 Save Settings
          </button>
          <button onClick={handleReset} className="w-full py-3 rounded-lg border border-border text-muted-foreground text-sm mt-2 transition-all duration-200 hover:border-muted-foreground">
            🔄 Reset Defaults
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-3 text-center text-sm text-muted-foreground">
        Luqi Automation v1.0 — Developed by Luqman
      </footer>
    </div>
  );
};

export default Index;
