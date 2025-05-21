import React from "react";

interface Props {
  preferences: string;
  setPreferences: (v: string) => void;
  onSubmit: () => void;
}

const PreferenceSetupPanel: React.FC<Props> = ({
  preferences,
  setPreferences,
  onSubmit,
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
    className="space-y-5">
    <div>
      <label className="block text-sm mb-1">Preferences</label>
      <input
        type="text"
        placeholder="Your preferences..."
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-orange-500"
      />
    </div>
    <button
      type="submit"
      className="w-full py-2 bg-orange-500 hover:bg-orange-600 transition rounded text-white font-semibold">
      Submit Registration
    </button>
  </form>
);

export default PreferenceSetupPanel;
