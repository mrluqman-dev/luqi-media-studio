import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AdvancedSettings {
  apiThreads: number;
  ffmpegThreads: number;
  resolution: string;
  fps: string;
  quality: string;
  videoCodec: string;
  pixelFormat: string;
  encodingPreset: string;
  hwAcceleration: boolean;
  outputPath: string;
  filenameFormat: string;
  autoOpenExport: boolean;
  keepTempFiles: boolean;
}

const defaultAdvanced: AdvancedSettings = {
  apiThreads: 3,
  ffmpegThreads: 4,
  resolution: "1080p",
  fps: "30",
  quality: "Balanced CRF17",
  videoCodec: "H.264",
  pixelFormat: "yuv420p",
  encodingPreset: "slow",
  hwAcceleration: false,
  outputPath: "",
  filenameFormat: "output_{date}_{time}",
  autoOpenExport: false,
  keepTempFiles: false,
};

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AdvancedSettings>(() => {
    const saved = localStorage.getItem("luqi-advanced-settings");
    return saved ? { ...defaultAdvanced, ...JSON.parse(saved) } : defaultAdvanced;
  });
  const [activePreset, setActivePreset] = useState<string | null>(null);

  useEffect(() => {
    if (settings.apiThreads === 2 && settings.ffmpegThreads === 2) setActivePreset("safe");
    else if (settings.apiThreads === 3 && settings.ffmpegThreads === 4) setActivePreset("balanced");
    else if (settings.apiThreads === 5 && settings.ffmpegThreads === 8) setActivePreset("max");
    else setActivePreset(null);
  }, [settings.apiThreads, settings.ffmpegThreads]);

  const handleSave = () => {
    localStorage.setItem("luqi-advanced-settings", JSON.stringify(settings));
  };

  const handleReset = () => {
    setSettings(defaultAdvanced);
  };

  const applyPreset = (preset: string) => {
    if (preset === "safe") setSettings(s => ({ ...s, apiThreads: 2, ffmpegThreads: 2 }));
    else if (preset === "balanced") setSettings(s => ({ ...s, apiThreads: 3, ffmpegThreads: 4 }));
    else if (preset === "max") setSettings(s => ({ ...s, apiThreads: 5, ffmpegThreads: 8 }));
  };

  const PillToggle = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex gap-2 mt-1.5 flex-wrap">
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

  const ToggleSwitch = ({ label, checked, onChange, note }: { label: string; checked: boolean; onChange: (v: boolean) => void; note?: string }) => (
    <div className="py-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted-foreground">{label}</span>
        <button
          onClick={() => onChange(!checked)}
          className={`w-10 h-5 rounded-full transition-all duration-200 relative ${checked ? "bg-primary" : "bg-secondary"}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform duration-200 ${checked ? "left-[22px]" : "left-0.5"}`} />
        </button>
      </div>
      {note && <p className="text-[11px] text-muted-foreground mt-1 italic">{note}</p>}
    </div>
  );

  const now = new Date();
  const exampleFilename = `output_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}_${String(now.getHours()).padStart(2,"0")}-${String(now.getMinutes()).padStart(2,"0")}.mp4`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background">
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1.5 rounded-full border border-border text-muted-foreground text-xs transition-all duration-200 hover:border-muted-foreground"
        >
          ← Back
        </button>
        <span className="text-base font-bold text-foreground">Advanced Settings</span>
        <span className="text-sm text-muted-foreground">Luqi Automation v1.0</span>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 p-6 gap-0">
        {/* Left Column */}
        <div className="w-[50%] pr-6">
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
                style={{ accentColor: "hsl(211 89% 55%)" }}
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
                style={{ accentColor: "hsl(211 89% 55%)" }}
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
            <label className="text-xs text-muted-foreground mt-3 block">Quality Mode</label>
            <PillToggle options={["Max CRF15", "Balanced CRF17", "Compressed CRF20"]} value={settings.quality} onChange={v => setSettings(s => ({ ...s, quality: v }))} />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-[50%] pl-6">
          {/* FFmpeg Settings */}
          <div className="mb-6">
            <div className="border-l-[3px] border-primary pl-2.5 mb-4">
              <h3 className="text-sm font-bold text-foreground">FFmpeg Settings</h3>
            </div>
            <label className="text-xs text-muted-foreground">Video Codec</label>
            <PillToggle options={["H.264", "H.265"]} value={settings.videoCodec} onChange={v => setSettings(s => ({ ...s, videoCodec: v }))} />
            <p className="text-[11px] text-muted-foreground mt-1 italic">H.264 recommended for compatibility</p>

            <label className="text-xs text-muted-foreground mt-3 block">Pixel Format</label>
            <PillToggle options={["yuv420p", "yuv444p"]} value={settings.pixelFormat} onChange={v => setSettings(s => ({ ...s, pixelFormat: v }))} />

            <label className="text-xs text-muted-foreground mt-3 block">Encoding Preset</label>
            <PillToggle options={["ultrafast", "fast", "medium", "slow"]} value={settings.encodingPreset} onChange={v => setSettings(s => ({ ...s, encodingPreset: v }))} />
            <p className="text-[11px] text-muted-foreground mt-1 italic">Slower = smaller file size</p>

            <div className="mt-3">
              <ToggleSwitch label="Hardware Acceleration" checked={settings.hwAcceleration} onChange={v => setSettings(s => ({ ...s, hwAcceleration: v }))} note="Enable if you have dedicated GPU" />
            </div>
          </div>

          {/* Output Settings */}
          <div className="mb-6">
            <div className="border-l-[3px] border-primary pl-2.5 mb-4">
              <h3 className="text-sm font-bold text-foreground">Output Settings</h3>
            </div>
            <label className="text-xs text-muted-foreground">Default Output Path</label>
            <div className="flex gap-2 mt-1.5">
              <input
                type="text"
                value={settings.outputPath}
                onChange={e => setSettings(s => ({ ...s, outputPath: e.target.value }))}
                placeholder="Select output folder..."
                className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <button className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs transition-all duration-200 hover:bg-primary hover:text-primary-foreground">
                Browse
              </button>
            </div>

            <label className="text-xs text-muted-foreground mt-3 block">Filename Format</label>
            <input
              type="text"
              value={settings.filenameFormat}
              onChange={e => setSettings(s => ({ ...s, filenameFormat: e.target.value }))}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground mt-1.5 focus:outline-none focus:border-primary"
            />
            <p className="text-[11px] text-muted-foreground mt-1">Example: {exampleFilename}</p>

            <div className="mt-2">
              <ToggleSwitch label="Auto Open After Export" checked={settings.autoOpenExport} onChange={v => setSettings(s => ({ ...s, autoOpenExport: v }))} />
              <ToggleSwitch label="Keep Temp Files" checked={settings.keepTempFiles} onChange={v => setSettings(s => ({ ...s, keepTempFiles: v }))} note="Keep intermediate files for debugging" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="px-6 pb-4">
        <button onClick={handleSave} className="w-full py-3 rounded-lg bg-success text-success-foreground font-bold text-sm transition-all duration-200 hover:brightness-110">
          💾 Save Advanced Settings
        </button>
        <button onClick={handleReset} className="w-full py-3 rounded-lg border border-border text-muted-foreground text-sm mt-2 transition-all duration-200 hover:border-muted-foreground">
          🔄 Reset to Defaults
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-3 text-center text-sm text-muted-foreground">
        Luqi Automation v1.0 — Developed by Luqman
      </footer>
    </div>
  );
};

export default Settings;
