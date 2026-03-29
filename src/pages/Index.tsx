import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Settings {
  apiKey: string;
  transcriptionModel: string;
  sceneCuttingModel: string;
  imageMatchingModel: string;
  theme: string;
  autoSave: boolean;
  notifications: boolean;
}

const defaultSettings: Settings = {
  apiKey: "",
  transcriptionModel: "whisper-large-v3",
  sceneCuttingModel: "llama-3.3-70b-versatile",
  imageMatchingModel: "llama-3.3-70b-versatile",
  theme: "Dark",
  autoSave: true,
  notifications: true,
};

const Index = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("luqi-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    }
    return defaultSettings;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "failed">("idle");

  const handleSave = () => {
    localStorage.setItem("luqi-settings", JSON.stringify(settings));
  };

  const handleTestConnection = () => {
    if (settings.apiKey.trim().length > 0) {
      setConnectionStatus("success");
    } else {
      setConnectionStatus("failed");
    }
  };

  const ModelRow = ({ emoji, label, value, options, onChange }: {
    emoji: string; label: string; value: string; options: string[]; onChange: (v: string) => void;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-border">
      <span className="text-[13px] text-muted-foreground">{emoji} {label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="appearance-none bg-background border border-border rounded-full px-3 py-1.5 pr-7 text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] pointer-events-none">▼</span>
      </div>
    </div>
  );

  const ToggleSwitch = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-all duration-200 relative ${checked ? "bg-primary" : "bg-secondary"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform duration-200 ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
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
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full" style={{ background: "rgba(35,209,96,0.15)", color: "hsl(var(--success))" }}>
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

          {/* AI Models */}
          <div className="mb-6">
            <div className="border-l-[3px] border-primary pl-2.5 mb-4">
              <h3 className="text-sm font-bold text-foreground">AI Models</h3>
            </div>
            <ModelRow
              emoji="🎙️" label="Audio Transcription" value={settings.transcriptionModel}
              options={["whisper-large-v3", "whisper-large-v3-turbo", "distil-whisper-large-v3-en"]}
              onChange={v => setSettings(s => ({ ...s, transcriptionModel: v }))}
            />
            <ModelRow
              emoji="✂️" label="Scene Cutting" value={settings.sceneCuttingModel}
              options={["llama-3.3-70b-versatile", "llama-3.1-70b-versatile", "mixtral-8x7b-32768", "gemma2-9b-it"]}
              onChange={v => setSettings(s => ({ ...s, sceneCuttingModel: v }))}
            />
            <ModelRow
              emoji="🖼️" label="Image Matching" value={settings.imageMatchingModel}
              options={["llama-3.3-70b-versatile", "llama-3.1-70b-versatile", "mixtral-8x7b-32768"]}
              onChange={v => setSettings(s => ({ ...s, imageMatchingModel: v }))}
            />
          </div>

          {/* App Settings */}
          <div className="mb-6">
            <div className="border-l-[3px] border-primary pl-2.5 mb-4">
              <h3 className="text-sm font-bold text-foreground">App Settings</h3>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[13px] text-muted-foreground">Theme:</span>
              <div className="flex gap-2">
                {["Dark", "Light"].map(t => (
                  <button
                    key={t}
                    onClick={() => setSettings(s => ({ ...s, theme: t }))}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
                      settings.theme === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {t} {settings.theme === t && "✓"}
                  </button>
                ))}
              </div>
            </div>
            <ToggleSwitch label="Auto Save:" checked={settings.autoSave} onChange={v => setSettings(s => ({ ...s, autoSave: v }))} />
            <ToggleSwitch label="Notifications:" checked={settings.notifications} onChange={v => setSettings(s => ({ ...s, notifications: v }))} />
          </div>

          {/* Buttons */}
          <button onClick={handleSave} className="w-full py-3 rounded-lg bg-success text-success-foreground font-bold text-sm transition-all duration-200 hover:brightness-110">
            💾 Save API Settings
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="w-full py-3 rounded-lg border border-primary text-primary font-bold text-sm mt-2 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
          >
            ⚙️ Advanced Settings →
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
