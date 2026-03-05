import Link from "next/link";
import { LoginPanel } from "@/components/login-panel";
import { PageSection } from "@/components/page-section";
import { PaletteProvider } from "@/components/palette-provider";
import { SiteFrame } from "@/components/site-frame";

export default function LoginPage() {
  return (
    <PaletteProvider>
      <SiteFrame>
        <main className="mx-auto max-w-3xl">
          <PageSection label="Secure Access" title="Member Login">
            <p>Access your participant dashboard, recordings, and resources.</p>
            <LoginPanel />
            <p className="text-sm text-[var(--muted)]">
              Need help with access? <Link href="mailto:support@oumnur.com">support@oumnur.com</Link>
            </p>
          </PageSection>
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
