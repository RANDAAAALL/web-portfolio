import type { ReactNode } from "react";
import { Signature } from "@/components/ui/signature/signature";
import { Navigation } from "@/components/ui/navigation/navigation";
import { SocialLinks } from "@/components/ui/socials/social-links";
import { Footer } from "@/components/ui/footer/all-rights-reserved";
import { PageIntro } from "@/components/ui/heading/page-intro";
import { pageIntros } from "@/lib/values/page-intros";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top/scroll-to-top-button";
import { ScrollSpotlight } from "@/components/ui/layout/scroll-spotlight";

export function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <div className="portfolio-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="portfolio-header">
        <Signature />
        <div className="identity-row">
          <div className="identity-details">
            <h1 id="portfolio-name" tabIndex={-1}>Lester Andig</h1>
            <p className="identity-role">lstrndg</p>
          </div>
          <SocialLinks />
        </div>
        <PageIntro pages={pageIntros} />
        <Navigation />
      </header>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
      <ScrollToTopButton />
      <ScrollSpotlight />
    </div>
  );
}
