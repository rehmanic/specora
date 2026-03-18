"use client";

import LandingModal from "./LandingModal";

/**
 * A modal displaying the Terms of Service.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {Function} props.onClose - Function to call when closing the modal.
 */
export default function TermsModal({ isOpen, onClose }) {
  return (
    <LandingModal isOpen={isOpen} onClose={onClose} title="Terms of Service">
      <div className="space-y-4 text-sm leading-relaxed text-slate-400">
        <p>
          Welcome to Specora. By using our AI-powered requirements engineering platform, you agree to the following
          terms:
        </p>
        <div>
          <h4 className="mb-1 font-medium text-white">1. AI Usage & Accuracy</h4>
          <p>
            Specora utilizes advanced Large Language Models to assist in generating and refining requirements. While we
            strive for high accuracy (current &gt;97%), AI outputs should be verified by human stakeholders. We are not
            liable for errors in final specifications.
          </p>
        </div>
        <div>
          <h4 className="mb-1 font-medium text-white">2. Intellectual Property</h4>
          <p>
            Any original requirements submitted remain your property. Specora grants you a full license to use, modify,
            and export AI-generated modifications and refinements for your own business purposes.
          </p>
        </div>
        <div>
          <h4 className="mb-1 font-medium text-white">3. Acceptable Use</h4>
          <p>
            Users must not use Specora for generating malicious content or attempting to reverse-engineer our
            proprietary AI analysis workflows.
          </p>
        </div>
      </div>
    </LandingModal>
  );
}
