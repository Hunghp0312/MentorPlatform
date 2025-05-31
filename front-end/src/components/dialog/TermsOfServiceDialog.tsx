import React from "react";
import Button from "../ui/Button";

interface TermsDialogProps {
  onClose: () => void;
}

const termsData = [
  {
    title: "Acceptance of Terms",
    value:
      "By using our Services, you agree to be bound by these Terms and our Privacy Policy.",
  },
  {
    title: "Modifications",
    value:
      "We may update these Terms from time to time. Your continued use constitutes acceptance.",
  },
  {
    title: "Eligibility",
    value: "You must be at least 13 years old to use our Services.",
  },
  {
    title: "User Accounts",
    value:
      "Keep your login credentials secure. You're responsible for your account.",
  },
  {
    title: "Acceptable Use",
    value: (
      <ul className="list-disc pl-6 space-y-1">
        <li>Don't break the law.</li>
        <li>No spam or malicious content.</li>
        <li>Respect other users and their privacy.</li>
      </ul>
    ),
  },
  {
    title: "Intellectual Property",
    value: "All content is the property of [YourAppName] or its licensors.",
  },
  {
    title: "Third-Party Links",
    value:
      "We're not responsible for third-party sites accessed via our platform.",
  },
  {
    title: "Termination",
    value: "We may suspend or terminate your access for Terms violations.",
  },
  {
    title: "Disclaimers",
    value: 'We provide Services "as-is" without warranties of any kind.',
  },
  {
    title: "Limitation of Liability",
    value: "We're not liable for indirect or consequential damages.",
  },
  {
    title: "Governing Law",
    value: "These Terms are governed by the laws of [Your Country/State].",
  },
  {
    title: "Contact",
    value: (
      <>
        For questions, email us at{" "}
        <a
          href="mailto:support@yourapp.com"
          className="underline text-blue-400 hover:text-blue-300">
          test@gmail.com
        </a>
        .
      </>
    ),
  },
];

const TermsDialog: React.FC<TermsDialogProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-opacity-1 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0f172a] text-white rounded-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-8 border border-white/10 shadow-xl space-y-8">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-2xl font-semibold">Terms of Service</h2>
          <Button variant="secondary" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <p className="text-sm italic text-gray-300">
          Effective Date: May 30, 2025
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
          {termsData.map((item, index) => (
            <div key={index}>
              <div className="text-gray-400">{item.title}</div>
              <div className="text-gray-200 mt-1">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsDialog;
