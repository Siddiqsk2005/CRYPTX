import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, LoaderCircle, Lock, Mail, ShieldAlert, Smartphone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

type IdentifierMode = "username" | "email" | "mobile";

type CountryOption = {
  label: string;
  code: string;
  digits: number;
};

const fieldClassName =
  "h-14 rounded-2xl border-cyan-300/18 bg-[#071c29]/85 pl-14 pr-12 text-base text-white placeholder:text-cyan-50/35 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.02)] transition focus-visible:border-cyan-300/35 focus-visible:ring-cyan-300/35";

const countryOptions: CountryOption[] = [
  { label: "India", code: "+91", digits: 10 },
  { label: "United States", code: "+1", digits: 10 },
  { label: "United Kingdom", code: "+44", digits: 10 },
  { label: "United Arab Emirates", code: "+971", digits: 9 },
  { label: "Australia", code: "+61", digits: 9 },
];

function getIdentifierIcon(mode: IdentifierMode) {
  if (mode === "username") {
    return UserRound;
  }

  if (mode === "mobile") {
    return Smartphone;
  }

  return Mail;
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const { requestOtp, signIn, verifyOtp } = useAuth();
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [identifierMode, setIdentifierMode] = useState<IdentifierMode>("username");
  const [countryCode, setCountryCode] = useState(countryOptions[0].code);
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sentOtpPreview, setSentOtpPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCountry = useMemo(
    () => countryOptions.find((country) => country.code === countryCode) ?? countryOptions[0],
    [countryCode],
  );

  const resolvedIdentifier = useMemo(() => {
    const trimmedIdentifier = identifier.trim();

    if (identifierMode === "mobile") {
      return `${selectedCountry.code}${trimmedIdentifier}`;
    }

    return trimmedIdentifier;
  }, [identifier, identifierMode, selectedCountry.code]);

  const identifierPlaceholder = {
    username: "Enter username",
    email: "Enter email address",
    mobile: `Enter ${selectedCountry.digits}-digit mobile number`,
  }[identifierMode];

  const identifierHelp = {
    username: "You can sign in with any username here.",
    email: "You can sign in with any email address here.",
    mobile: `${selectedCountry.label} mobile numbers are limited to ${selectedCountry.digits} digits.`,
  }[identifierMode];

  const resetOtpFlow = () => {
    setOtpSent(false);
    setOtpCode("");
    setSentOtpPreview("");
  };

  const handleIdentifierChange = (value: string) => {
    if (identifierMode === "mobile") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, selectedCountry.digits);
      setIdentifier(digitsOnly);
    } else {
      setIdentifier(value);
    }

    if (otpSent) {
      resetOtpFlow();
    }
  };

  const handleSendOtp = async () => {
    if (!resolvedIdentifier) {
      toast.error(`Enter your ${identifierMode} first.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const { code } = await requestOtp({
        mode,
        identifier: resolvedIdentifier,
        username,
        password,
      });

      setOtpSent(true);
      setSentOtpPreview(code);
      toast.success("OTP sent");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to generate OTP.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!resolvedIdentifier) {
      toast.error(`Enter your ${identifierMode} first.`);
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn({
        identifier: resolvedIdentifier,
        username: identifierMode === "username" ? identifier : username,
        password,
      });
      toast.success("Login successfully");
      navigate("/analyzer");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!resolvedIdentifier) {
      toast.error(`Enter your ${identifierMode} first.`);
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyOtp({
        mode,
        identifier: resolvedIdentifier,
        code: otpCode,
        username: identifierMode === "username" ? identifier : username,
        password,
      });
      toast.success(mode === "login" ? "OTP verified" : "Registered successfully");
      navigate("/analyzer");
    } catch (error) {
      const message = error instanceof Error ? error.message : "OTP verification failed.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const IdentifierIcon = getIdentifierIcon(identifierMode);

  return (
    <div className="space-y-5 text-left">
      {mode === "login" ? (
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-cyan-300/16 bg-cyan-400/5 p-1">
          <button
            type="button"
            className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
              authMethod === "password" ? "bg-cyan-300 text-slate-950" : "text-cyan-50/75 hover:text-white"
            }`}
            onClick={() => {
              setAuthMethod("password");
              resetOtpFlow();
            }}
          >
            Password Login
          </button>
          <button
            type="button"
            className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
              authMethod === "otp" ? "bg-cyan-300 text-slate-950" : "text-cyan-50/75 hover:text-white"
            }`}
            onClick={() => {
              setAuthMethod("otp");
              resetOtpFlow();
            }}
          >
            OTP Login
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-cyan-300/16 bg-cyan-400/5 p-1">
        {(["username", "email", "mobile"] as IdentifierMode[]).map((value) => (
          <button
            key={value}
            type="button"
            className={`rounded-xl px-3 py-3 text-sm font-medium capitalize transition ${
              identifierMode === value ? "bg-cyan-300 text-slate-950" : "text-cyan-50/75 hover:text-white"
            }`}
            onClick={() => {
              setIdentifierMode(value);
              setIdentifier("");
              resetOtpFlow();
            }}
          >
            {value}
          </button>
        ))}
      </div>

      {mode === "register" ? (
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-100/65" />
          <Input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Create display username"
            className={fieldClassName}
          />
        </div>
      ) : null}

      {identifierMode === "mobile" ? (
        <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
          <Select
            value={countryCode}
            onValueChange={(value) => {
              setCountryCode(value);
              setIdentifier((current) => current.slice(0, (countryOptions.find((country) => country.code === value) ?? countryOptions[0]).digits));
              resetOtpFlow();
            }}
          >
            <SelectTrigger className="h-14 rounded-2xl border-cyan-300/18 bg-[#071c29]/85 text-white">
              <SelectValue placeholder="Country code" />
            </SelectTrigger>
            <SelectContent className="border-cyan-300/18 bg-[#071c29] text-white">
              {countryOptions.map((country) => (
                <SelectItem key={country.code} value={country.code} className="focus:bg-cyan-300/10 focus:text-white">
                  {country.label} ({country.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Smartphone className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-100/65" />
            <Input
              value={identifier}
              onChange={(event) => handleIdentifierChange(event.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={selectedCountry.digits}
              placeholder={identifierPlaceholder}
              className={fieldClassName}
            />
          </div>
        </div>
      ) : (
        <div className="relative">
          <IdentifierIcon className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-100/65" />
          <Input
            value={identifier}
            onChange={(event) => handleIdentifierChange(event.target.value)}
            type={identifierMode === "email" ? "email" : "text"}
            autoComplete="username"
            placeholder={identifierPlaceholder}
            className={fieldClassName}
          />
        </div>
      )}

      <p className="px-1 text-xs text-cyan-50/65">{identifierHelp}</p>

      {mode === "login" && authMethod === "password" ? (
        <>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-100/65" />
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={fieldClassName}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-100/65 transition hover:text-cyan-100"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm text-cyan-50/68">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-cyan-300/55 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-slate-950"
              />
              <span>Remember me</span>
            </label>
            <Link to="/register" className="transition hover:text-cyan-100">
              Need an account?
            </Link>
          </div>

          <Button
            type="button"
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 text-lg font-semibold tracking-wide text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.32)] transition hover:brightness-110"
            disabled={isSubmitting}
            onClick={handlePasswordLogin}
          >
            {isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : null}
            LOGIN WITH PASSWORD
          </Button>
        </>
      ) : null}

      {mode === "register" ? (
        <div className="relative">
          <Lock className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-100/65" />
          <Input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Create password"
            className={fieldClassName}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-100/65 transition hover:text-cyan-100"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      ) : null}

      {(mode === "register" || authMethod === "otp") ? (
        <div className="space-y-3 rounded-2xl border border-cyan-300/16 bg-cyan-400/5 p-4">
          {!otpSent ? (
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-2xl border-cyan-300/24 bg-transparent text-cyan-100 hover:bg-cyan-300/10 hover:text-white"
              disabled={isSubmitting}
              onClick={handleSendOtp}
            >
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              SEND OTP
            </Button>
          ) : (
            <>
              <div className="relative">
                <ShieldAlert className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-100/65" />
                <Input
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  className={fieldClassName}
                />
              </div>
              <Button
                type="button"
                className="h-12 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 text-base font-semibold tracking-wide text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.32)] transition hover:brightness-110"
                disabled={isSubmitting}
                onClick={handleOtpVerification}
              >
                {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                {mode === "login" ? "VERIFY OTP & LOGIN" : "VERIFY OTP & REGISTER"}
              </Button>
            </>
          )}

          {sentOtpPreview ? (
            <div className="rounded-2xl border border-cyan-300/14 bg-[#071c29]/70 px-4 py-3 text-center font-mono text-xs leading-6 text-cyan-100/80">
              Verification code: <span className="text-cyan-200">{sentOtpPreview}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-2xl border border-cyan-300/16 bg-cyan-400/5 px-4 py-3 text-center font-mono text-xs leading-6 text-cyan-100/78">
        Username, email, and mobile sign-in are supported here. Mobile input is limited by the selected country code.
      </div>
    </div>
  );
}
