import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import shelterVaultLogo from "../../../assets/ShelterVault.png";
import CopyButton from "../CopyButton";

type PasswordGeneratorToolProps = {
  onToast: () => void;
};

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-={}[]:;,.?";

const pickRandomChar = (charset: string) => {
  const randomIndex =
    crypto.getRandomValues(new Uint32Array(1))[0] % charset.length;
  return charset[randomIndex];
};

const generatePassword = (length: number, charset: string) => {
  const chars: string[] = [];
  for (let index = 0; index < length; index += 1) {
    chars.push(pickRandomChar(charset));
  }
  return chars.join("");
};

export default function PasswordGeneratorTool({
  onToast,
}: PasswordGeneratorToolProps) {
  const [length, setLength] = useState(12);
  const [count, setCount] = useState(1);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [result, setResult] = useState("");
  const [errorText, setErrorText] = useState("");

  const charset = useMemo(() => {
    let aggregate = "";
    if (useLowercase) aggregate += LOWERCASE;
    if (useUppercase) aggregate += UPPERCASE;
    if (useDigits) aggregate += DIGITS;
    if (useSymbols) aggregate += SYMBOLS;
    return aggregate;
  }, [useLowercase, useUppercase, useDigits, useSymbols]);

  const handleGenerate = () => {
    const safeLength = Math.max(4, Math.min(128, Math.trunc(length)));
    const safeCount = Math.max(1, Math.min(50, Math.trunc(count)));

    if (!charset) {
      setErrorText("Select at least one character group.");
      return;
    }

    const generated: string[] = [];
    for (let index = 0; index < safeCount; index += 1) {
      generated.push(generatePassword(safeLength, charset));
    }

    setResult(generated.join("\n"));
    setErrorText("");
  };

  return (
    <section className="tool-card tool-result-pop full-height">
      <header className="tool-header stagger-1">
        <h2>Password Generator</h2>
        <p>Generate secure random passwords with custom rules.</p>
      </header>

      <div className="guid-option-row stagger-2">
        <div className="option-card">
          <label className="field-label option-label" htmlFor="passwordLength">
            Password length
          </label>
          <input
            id="passwordLength"
            className="compact-input"
            type="number"
            min={4}
            max={128}
            value={length}
            onChange={(event) => setLength(Number(event.target.value || 12))}
          />
        </div>

        <div className="option-card">
          <label className="field-label option-label" htmlFor="passwordCount">
            Password count
          </label>
          <input
            id="passwordCount"
            className="compact-input"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(event) => setCount(Number(event.target.value || 1))}
          />
        </div>

        <label className="check-row check-card">
          <input
            type="checkbox"
            checked={useLowercase}
            onChange={(event) => setUseLowercase(event.target.checked)}
          />
          Lowercase
        </label>

        <label className="check-row check-card">
          <input
            type="checkbox"
            checked={useUppercase}
            onChange={(event) => setUseUppercase(event.target.checked)}
          />
          Uppercase
        </label>

        <label className="check-row check-card">
          <input
            type="checkbox"
            checked={useDigits}
            onChange={(event) => setUseDigits(event.target.checked)}
          />
          Digits
        </label>

        <label className="check-row check-card">
          <input
            type="checkbox"
            checked={useSymbols}
            onChange={(event) => setUseSymbols(event.target.checked)}
          />
          Symbols
        </label>
      </div>

      <div className="tool-actions stagger-3">
        <button
          type="button"
          className="action-button primary"
          onClick={handleGenerate}
        >
          <Icon icon="tabler:key" width="16" />
          Generate Passwords
        </button>
      </div>

      <div className="output-head stagger-4">
        <label className="field-label" htmlFor="passwordOutput">
          Output
        </label>
        <CopyButton value={result} onCopied={onToast} disabled={!result} />
      </div>

      <textarea
        id="passwordOutput"
        className="result-area full-height-area"
        readOnly
        value={result}
        placeholder="Generated passwords appear here"
      />

      {errorText ? <p className="error-meta">{errorText}</p> : null}

      <a
        className="shelter-link"
        href="https://apps.microsoft.com/detail/9nhvsnjsx74g?hl=en-US&gl=BB"
        target="_blank"
        rel="noreferrer"
      >
        <img src={shelterVaultLogo.src} alt="ShelterVault logo" />
        <span>
          Recommended password manager: <strong>ShelterVault</strong>
        </span>
      </a>
    </section>
  );
}
