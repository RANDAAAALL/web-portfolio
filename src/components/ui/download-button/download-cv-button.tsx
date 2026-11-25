import { Download } from "lucide-react";

export default function DownloadCVButton() {
  return (
    <a className="expand-action" href="/Andig_2026_CV.pdf" download="LesterAndig_CV.pdf" aria-label="Download CV">
      <Download size={16} aria-hidden="true" />
      <span className="action-label" aria-hidden="true">download cv</span>
    </a>
  );
}
