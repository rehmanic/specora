"use client";

import LandingModal from "./LandingModal";

/**
 * A modal displaying the Privacy Policy.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {Function} props.onClose - Function to call when closing the modal.
 */
export default function PrivacyModal({ isOpen, onClose }) {
  return (
    <LandingModal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
      <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
        <p>
          At Specora, we take your project data seriously. Here is how we handle
          your information:
        </p>
        <div>
          <h4 className="text-white font-medium mb-1">1. Data Security</h4>
          <p>
            All requirement data is encrypted both in transit and at rest. We
            use enterprise-grade security protocols to ensure your intellectual
            property remains confidential.
          </p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-1">2. AI Processing</h4>
          <p>
            We process data through secure AI gateways. Your project data is not
            used to train public Large Language Models without explicit, opt-in
            consent at the enterprise level.
          </p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-1">3. Third-Party Sharing</h4>
          <p>
            Specora does not sell your data to third parties. We only share
            necessary metadata with integrated services (e.g., Jira, GitHub)
            that you explicitly authorize.
          </p>
        </div>
      </div>
    </LandingModal>
  );
}
