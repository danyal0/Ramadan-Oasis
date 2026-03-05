"use client";

import { useState } from "react";
import { PaletteProvider } from "@/components/palette-provider";
import { SiteFrame } from "@/components/site-frame";

type Notice = { type: "error" | "success"; text: string } | null;
type ResourceItem = { title: string; description: string; href: string };
type SiteContent = {
  home: {
    orientationPoints: string[];
    supportPoints: string[];
    experiencePoints: string[];
    audiencePoints: string[];
    offeringSummary: string;
    offeringMeta: string[];
    credibilityLine: string;
  };
  ramadanOasis: {
    invocation: string;
    whoItsFor: string[];
    experiences: string[];
    outcomes: string[];
  };
  resources: {
    title: string;
    description: string;
    items: ResourceItem[];
  };
  curation: {
    enabled: boolean;
    pinnedBySection: Record<string, string[]>;
  };
};

const defaultContent: SiteContent = {
  home: {
    orientationPoints: [],
    supportPoints: [],
    experiencePoints: [],
    audiencePoints: [],
    offeringSummary: "",
    offeringMeta: [],
    credibilityLine: "",
  },
  ramadanOasis: {
    invocation: "",
    whoItsFor: [],
    experiences: [],
    outcomes: [],
  },
  resources: {
    title: "",
    description: "",
    items: [],
  },
  curation: {
    enabled: false,
    pinnedBySection: {},
  },
};

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(value: string[]) {
  return value.join("\n");
}

export default function AdminContentPage() {
  const [token, setToken] = useState("");
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [isLoaded, setIsLoaded] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(false);

  async function loadContent() {
    setLoading(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/content", {
        cache: "no-store",
        headers: {
          "x-admin-token": token,
        },
      });
      const data = (await response.json()) as unknown;
      if (!response.ok) {
        setNotice({ type: "error", text: "Could not load content JSON." });
        return;
      }
      setContent(data as SiteContent);
      setIsLoaded(true);
    } catch {
      setNotice({ type: "error", text: "Network issue while loading content." });
    } finally {
      setLoading(false);
    }
  }

  async function saveContent() {
    setLoading(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setNotice({ type: "error", text: body.error ?? "Save failed." });
        return;
      }

      setNotice({ type: "success", text: "Content saved." });
    } catch {
      setNotice({ type: "error", text: "Save failed." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PaletteProvider>
      <SiteFrame>
        <main className="mx-auto max-w-5xl space-y-5 py-2 text-[var(--ink)]">
          <h1 className="font-serif-display text-4xl">Content Admin</h1>
          <p className="text-[var(--muted)]">
            Lightweight JSON-backed content layer. Edit copy, resources, schedule-related text, and curation pins without touching
            code.
          </p>

          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Admin edit token"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
            />
            <button
              type="button"
              onClick={loadContent}
              disabled={loading}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 hover:text-[var(--accent)] disabled:opacity-70"
            >
              Load
            </button>
            <button
              type="button"
              onClick={saveContent}
              disabled={loading || !isLoaded}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 hover:text-[var(--accent)] disabled:opacity-70"
            >
              Save
            </button>
          </div>

          <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-serif-display text-3xl">Home Page Content</h2>
            <label className="grid gap-2">
              <span className="text-sm text-[var(--muted)]">Offering Summary</span>
              <textarea
                value={content.home.offeringSummary}
                onChange={(event) =>
                  setContent((prev) => ({ ...prev, home: { ...prev.home, offeringSummary: event.target.value } }))
                }
                className="min-h-24 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-[var(--muted)]">Credibility Line</span>
              <input
                value={content.home.credibilityLine}
                onChange={(event) =>
                  setContent((prev) => ({ ...prev, home: { ...prev.home, credibilityLine: event.target.value } }))
                }
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm text-[var(--muted)]">Orientation Points (one per line)</span>
                <textarea
                  value={arrayToLines(content.home.orientationPoints)}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      home: { ...prev.home, orientationPoints: linesToArray(event.target.value) },
                    }))
                  }
                  className="min-h-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-[var(--muted)]">Support Points (one per line)</span>
                <textarea
                  value={arrayToLines(content.home.supportPoints)}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      home: { ...prev.home, supportPoints: linesToArray(event.target.value) },
                    }))
                  }
                  className="min-h-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-[var(--muted)]">Experience Points (one per line)</span>
                <textarea
                  value={arrayToLines(content.home.experiencePoints)}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      home: { ...prev.home, experiencePoints: linesToArray(event.target.value) },
                    }))
                  }
                  className="min-h-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-[var(--muted)]">Audience Points (one per line)</span>
                <textarea
                  value={arrayToLines(content.home.audiencePoints)}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      home: { ...prev.home, audiencePoints: linesToArray(event.target.value) },
                    }))
                  }
                  className="min-h-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-sm text-[var(--muted)]">Offering Meta (one per line)</span>
              <textarea
                value={arrayToLines(content.home.offeringMeta)}
                onChange={(event) =>
                  setContent((prev) => ({ ...prev, home: { ...prev.home, offeringMeta: linesToArray(event.target.value) } }))
                }
                className="min-h-24 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
              />
            </label>
          </section>

          <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-serif-display text-3xl">Ramadan Oasis Page Content</h2>
            <label className="grid gap-2">
              <span className="text-sm text-[var(--muted)]">Invocation</span>
              <textarea
                value={content.ramadanOasis.invocation}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    ramadanOasis: { ...prev.ramadanOasis, invocation: event.target.value },
                  }))
                }
                className="min-h-24 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm text-[var(--muted)]">Who This Is For</span>
                <textarea
                  value={arrayToLines(content.ramadanOasis.whoItsFor)}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      ramadanOasis: { ...prev.ramadanOasis, whoItsFor: linesToArray(event.target.value) },
                    }))
                  }
                  className="min-h-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-[var(--muted)]">What You&apos;ll Experience</span>
                <textarea
                  value={arrayToLines(content.ramadanOasis.experiences)}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      ramadanOasis: { ...prev.ramadanOasis, experiences: linesToArray(event.target.value) },
                    }))
                  }
                  className="min-h-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-[var(--muted)]">Outcomes</span>
                <textarea
                  value={arrayToLines(content.ramadanOasis.outcomes)}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      ramadanOasis: { ...prev.ramadanOasis, outcomes: linesToArray(event.target.value) },
                    }))
                  }
                  className="min-h-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                />
              </label>
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-serif-display text-3xl">Resources Page</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm text-[var(--muted)]">Resources Title</span>
                <input
                  value={content.resources.title}
                  onChange={(event) =>
                    setContent((prev) => ({ ...prev, resources: { ...prev.resources, title: event.target.value } }))
                  }
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-[var(--muted)]">Resources Description</span>
                <input
                  value={content.resources.description}
                  onChange={(event) =>
                    setContent((prev) => ({ ...prev, resources: { ...prev.resources, description: event.target.value } }))
                  }
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                />
              </label>
            </div>
            <div className="space-y-3">
              {content.resources.items.map((item, index) => (
                <div key={`${item.title}-${index}`} className="grid gap-3 rounded-xl border border-[var(--border)] p-4 md:grid-cols-3">
                  <input
                    value={item.title}
                    onChange={(event) =>
                      setContent((prev) => ({
                        ...prev,
                        resources: {
                          ...prev.resources,
                          items: prev.resources.items.map((resource, i) =>
                            i === index ? { ...resource, title: event.target.value } : resource,
                          ),
                        },
                      }))
                    }
                    placeholder="Card title"
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                  />
                  <input
                    value={item.description}
                    onChange={(event) =>
                      setContent((prev) => ({
                        ...prev,
                        resources: {
                          ...prev.resources,
                          items: prev.resources.items.map((resource, i) =>
                            i === index ? { ...resource, description: event.target.value } : resource,
                          ),
                        },
                      }))
                    }
                    placeholder="Card description"
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                  />
                  <div className="flex gap-2">
                    <input
                      value={item.href}
                      onChange={(event) =>
                        setContent((prev) => ({
                          ...prev,
                          resources: {
                            ...prev.resources,
                            items: prev.resources.items.map((resource, i) =>
                              i === index ? { ...resource, href: event.target.value } : resource,
                            ),
                          },
                        }))
                      }
                      placeholder="Link"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => ({
                          ...prev,
                          resources: {
                            ...prev.resources,
                            items: prev.resources.items.filter((_, i) => i !== index),
                          },
                        }))
                      }
                      className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    resources: {
                      ...prev.resources,
                      items: [...prev.resources.items, { title: "New item", description: "", href: "#" }],
                    },
                  }))
                }
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm hover:text-[var(--accent)]"
              >
                Add resource item
              </button>
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-serif-display text-3xl">Curation Mode</h2>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={content.curation.enabled}
                onChange={(event) =>
                  setContent((prev) => ({ ...prev, curation: { ...prev.curation, enabled: event.target.checked } }))
                }
              />
              <span className="text-sm text-[var(--muted)]">Enable pinned image order for sliders</span>
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(content.curation.pinnedBySection).map(([sectionKey, pinned]) => (
                <label key={sectionKey} className="grid gap-2">
                  <span className="text-sm text-[var(--muted)]">{sectionKey} (one image path per line)</span>
                  <textarea
                    value={arrayToLines(pinned)}
                    onChange={(event) =>
                      setContent((prev) => ({
                        ...prev,
                        curation: {
                          ...prev.curation,
                          pinnedBySection: {
                            ...prev.curation.pinnedBySection,
                            [sectionKey]: linesToArray(event.target.value),
                          },
                        },
                      }))
                    }
                    className="min-h-24 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 font-mono text-xs"
                  />
                </label>
              ))}
            </div>
          </section>

          {notice ? (
            <p className={notice.type === "error" ? "text-red-700" : "text-[var(--muted)]"}>{notice.text}</p>
          ) : null}
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
