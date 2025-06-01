import React from "react";
import Button from "../ui/Button";

interface PrivacyPolicyDialogProps {
  onClose: () => void;
}

const PrivacyPolicyDialog: React.FC<PrivacyPolicyDialogProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-opacity-1 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0f172a] text-white rounded-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-8 border border-white/10 shadow-xl space-y-8">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-2xl font-semibold">Terms of Service</h2>
          <Button variant="secondary" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
        <p className="text-sm mb-2 italic">Effective Date: May 30, 2025</p>

        <div className="space-y-4 text-sm">
          <p>
            This Privacy Policy explains how [YourAppName] collects, uses, and
            protects your personal information when you use our website or
            services.
          </p>

          <h3 className="font-semibold">1. Information We Collect</h3>
          <ul className="list-disc pl-6">
            <li>
              <strong>Personal Information:</strong> Name, email address,
              account credentials, etc.
            </li>
            <li>
              <strong>Usage Data:</strong> Pages visited, links clicked, time
              spent on pages.
            </li>
            <li>
              <strong>Cookies:</strong> For functionality and analytics
              purposes.
            </li>
          </ul>

          <h3 className="font-semibold">2. How We Use Your Information</h3>
          <ul className="list-disc pl-6">
            <li>To provide and maintain our services.</li>
            <li>To personalize your user experience.</li>
            <li>To send you service-related communications.</li>
            <li>To analyze usage for improving our services.</li>
          </ul>

          <h3 className="font-semibold">3. Sharing Your Information</h3>
          <p>
            We do not sell or rent your personal data. We may share your
            information with:
          </p>
          <ul className="list-disc pl-6">
            <li>
              Service providers (under strict confidentiality agreements).
            </li>
            <li>Legal authorities when required by law.</li>
          </ul>

          <h3 className="font-semibold">
            4. Cookies and Tracking Technologies
          </h3>
          <p>
            We use cookies and similar technologies to understand user behavior
            and improve your experience. You can manage cookies through your
            browser settings.
          </p>

          <h3 className="font-semibold">5. Data Security</h3>
          <p>
            We take appropriate measures to protect your personal information,
            but no system is completely secure.
          </p>

          <h3 className="font-semibold">6. Your Rights</h3>
          <ul className="list-disc pl-6">
            <li>Access your personal data</li>
            <li>Request correction or deletion</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h3 className="font-semibold">7. Third-Party Services</h3>
          <p>
            We may link to third-party sites or use third-party services. This
            policy does not apply to their practices.
          </p>

          <h3 className="font-semibold">8. Children's Privacy</h3>
          <p>
            We do not knowingly collect data from children under 13. Contact us
            if you believe this has occurred.
          </p>

          <h3 className="font-semibold">9. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy occasionally. Updates will be
            posted here with a revised effective date.
          </p>

          <h3 className="font-semibold">10. Contact Us</h3>
          <p>
            If you have questions, contact us at{" "}
            <a
              href="mailto:privacy@yourapp.com"
              className="underline text-blue-500">
              privacy@yourapp.com
            </a>
          </p>

          <p className="pt-4">
            By using our services, you agree to this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyDialog;
