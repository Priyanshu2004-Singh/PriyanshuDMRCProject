import React, { useEffect, useState } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import api from '../services/api';

interface CaptchaProps {
  onCaptchaChange: (captchaId: string, captchaText: string) => void;
  error?: string;
}

const IS_DEV = (import.meta as any).env?.DEV ?? true;

export const Captcha: React.FC<CaptchaProps> = ({ onCaptchaChange, error }) => {
  const [captchaSvg, setCaptchaSvg] = useState<string>('');
  const [captchaId, setCaptchaId] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [devAnswer, setDevAnswer] = useState<string>('');
  const [showDevHint, setShowDevHint] = useState<boolean>(false);

  const fetchCaptcha = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/captcha');
      setCaptchaSvg(res.data.captchaSvg);
      setCaptchaId(res.data.captchaId);
      // In dev mode, backend can optionally send the answer for testing
      if (res.data.devAnswer) {
        setDevAnswer(res.data.devAnswer);
      }
      setInputText('');
      onCaptchaChange(res.data.captchaId, '');
    } catch (err) {
      console.error('Failed to load CAPTCHA', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    onCaptchaChange(captchaId, val);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        Security Verification (CAPTCHA) <span className="text-dmrc-red">*</span>
      </label>

      <div className="flex items-center space-x-4">
        {captchaSvg ? (
          <div
            className="bg-white border border-slate-300 rounded-lg p-1.5 shadow-inner cursor-pointer select-none"
            dangerouslySetInnerHTML={{ __html: captchaSvg }}
            onClick={fetchCaptcha}
            title="Click to refresh CAPTCHA"
          />
        ) : (
          <div className="w-36 h-12 bg-slate-200 animate-pulse rounded-lg" />
        )}

        <button
          type="button"
          onClick={fetchCaptcha}
          disabled={loading}
          className="p-2 text-slate-600 hover:text-dmrc-red hover:bg-slate-200 rounded-lg transition-colors"
          title="Refresh CAPTCHA"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={inputText}
          onChange={handleChange}
          placeholder="Type the characters shown in the image above"
          autoComplete="off"
          spellCheck={false}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-dmrc-red/20 focus:border-dmrc-red outline-none transition-all ${
            error ? 'border-red-500 bg-red-50' : 'border-slate-300'
          }`}
        />
      </div>

      {/* Dev mode: show hint */}
      {IS_DEV && (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowDevHint(!showDevHint)}
            className="flex items-center space-x-1 text-[11px] font-bold text-slate-400 hover:text-slate-600"
          >
            <Eye className="w-3 h-3" />
            <span>[DEV] {showDevHint ? 'Hide' : 'Show'} CAPTCHA answer</span>
          </button>
          {showDevHint && devAnswer && (
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              {devAnswer}
            </span>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
