import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Scan, RotateCcw, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface MessageInputProps {
  onAnalyze: (message: string) => void;
  onReset: () => void;
  isAnalyzing: boolean;
  hasResult: boolean;
  isAuthenticated?: boolean;
}

const sampleMessages = [
  {
    label: "Safe OTP",
    message: "Your OTP for SBI Bank transaction is 482193. Do not share it with anyone.",
  },
  {
    label: "Delivery Update",
    message: "Your Amazon package has been shipped! Track your order: Order #123-456789. Expected delivery: Jan 25",
  },
  {
    label: "Scam Alert",
    message: "Congratulations! You are selected for Google job. Pay ₹1999 immediately. Click here: bit.ly/job",
  },
  {
    label: "Phishing",
    message: "URGENT: Your bank account will be blocked. Click here to verify: http://fakbank.xyz/verify",
  },
  {
    label: "Suspicious URL",
    message: "https://tinyurl.com/free-security-check",
  },
];

export function MessageInput({
  onAnalyze,
  onReset,
  isAnalyzing,
  hasResult,
  isAuthenticated = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim()) {
      onAnalyze(message);
    }
  };

  const handleSampleClick = (sampleMessage: string) => {
    setMessage(sampleMessage);
    onReset();
  };

  const handleReset = () => {
    setMessage("");
    onReset();
  };

  return (
    <div className="space-y-4">
      {/* Input Area */}
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste or type suspicious text, email content, or a URL here for analysis..."
          className="min-h-[170px] resize-none border-border bg-secondary/50 font-mono text-sm focus:border-primary"
          disabled={isAnalyzing}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>{isAuthenticated ? "Saved to your dashboard and history" : "Login required to continue"}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          disabled={isAnalyzing || !message.trim()}
          size="lg"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-semibold"
        >
          <Scan className="w-5 h-5 mr-2" />
          {isAnalyzing ? "ANALYZING..." : "ANALYZE URL / TEXT"}
        </Button>
        
        {hasResult && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="font-mono border-border hover:bg-secondary"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            NEW SCAN
          </Button>
        )}
      </div>

      {/* Sample Messages */}
      <div className="space-y-2">
        <p className="text-xs font-mono text-muted-foreground">TRY SAMPLE MESSAGES:</p>
        <div className="flex flex-wrap gap-2">
          {sampleMessages.map((sample, index) => (
            <motion.button
              key={index}
              onClick={() => handleSampleClick(sample.message)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-1.5 text-xs font-mono rounded-lg bg-secondary/50 border border-border hover:border-primary/50 hover:bg-secondary transition-colors"
            >
              {sample.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
