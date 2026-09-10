import { AIInfluencer, SocialMetaConfig } from "../types";

/**
 * Utilitas injeksi dan sinkronisasi Open Graph serta Twitter Card Meta Tags ke document.head
 */

export function buildDefaultSocialMeta(
  influencer: AIInfluencer,
  currentUrl?: string
): SocialMetaConfig {
  const host =
    currentUrl ||
    (typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "https://ai-influencer-builder.app");

  const cleanHandle = influencer.handle.replace(/^@/, "");
  const avatar =
    influencer.avatarUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&h=630&q=80";

  // Pastikan deskripsi ringkas, alami, dan tanpa em-dash
  const sanitizedTagline = influencer.tagline.replace(/[—–]/g, ",");
  const description = `${sanitizedTagline}. Profil kreator ${influencer.niche} asal ${influencer.demographics.baseLocation}. Arketipe ${influencer.personalityProfile.archetype} dengan gaya bahasa ${influencer.personalityProfile.toneOfVoice}.`;

  return {
    title: `${influencer.name} (@${cleanHandle}) • AI Influencer Persona`,
    description: description.slice(0, 200),
    imageUrl: avatar,
    pageUrl: host,
    siteName: "AI Influencer Builder Studio",
    cardType: "summary_large_image",
    creatorHandle: `@${cleanHandle}`,
    locale: "id_ID",
    type: "profile",
  };
}

function updateOrCreateMeta(
  attrName: "property" | "name",
  attrValue: string,
  content: string
): HTMLElement {
  if (typeof document === "undefined") return {} as HTMLElement;

  let element = document.querySelector<HTMLMetaElement>(
    `meta[${attrName}="${attrValue}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
  return element;
}

export function injectOpenGraphMetaTags(config: SocialMetaConfig): {
  success: boolean;
  injectedCount: number;
  tags: Array<{ key: string; isProperty: boolean; content: string }>;
} {
  if (typeof document === "undefined") {
    return { success: false, injectedCount: 0, tags: [] };
  }

  // 1. Update document title
  document.title = config.title;

  const tagList: Array<{ key: string; isProperty: boolean; content: string }> = [
    // Standard SEO
    { key: "description", isProperty: false, content: config.description },
    { key: "author", isProperty: false, content: config.creatorHandle },

    // Open Graph / Facebook / LinkedIn
    { key: "og:site_name", isProperty: true, content: config.siteName },
    { key: "og:type", isProperty: true, content: config.type },
    { key: "og:title", isProperty: true, content: config.title },
    { key: "og:description", isProperty: true, content: config.description },
    { key: "og:image", isProperty: true, content: config.imageUrl },
    { key: "og:url", isProperty: true, content: config.pageUrl },
    { key: "og:locale", isProperty: true, content: config.locale },
    {
      key: "profile:username",
      isProperty: true,
      content: config.creatorHandle.replace(/^@/, ""),
    },

    // Twitter / X Cards
    { key: "twitter:card", isProperty: false, content: config.cardType },
    { key: "twitter:title", isProperty: false, content: config.title },
    { key: "twitter:description", isProperty: false, content: config.description },
    { key: "twitter:image", isProperty: false, content: config.imageUrl },
    { key: "twitter:creator", isProperty: false, content: config.creatorHandle },
    { key: "twitter:site", isProperty: false, content: "@AIInfluencerApp" },
  ];

  tagList.forEach(({ key, isProperty, content }) => {
    updateOrCreateMeta(isProperty ? "property" : "name", key, content);
  });

  return {
    success: true,
    injectedCount: tagList.length,
    tags: tagList,
  };
}

export function readLiveHeadMetaTags(): Array<{
  key: string;
  isProperty: boolean;
  content: string;
}> {
  if (typeof document === "undefined") return [];

  const results: Array<{ key: string; isProperty: boolean; content: string }> = [];
  const metaElements = document.querySelectorAll<HTMLMetaElement>("head meta");

  metaElements.forEach((el) => {
    const prop = el.getAttribute("property");
    const name = el.getAttribute("name");
    const content = el.getAttribute("content") || "";

    if (prop && (prop.startsWith("og:") || prop.startsWith("profile:"))) {
      results.push({ key: prop, isProperty: true, content });
    } else if (name && (name.startsWith("twitter:") || name === "description")) {
      results.push({ key: name, isProperty: false, content });
    }
  });

  return results;
}

export function generateRawMetaHtml(config: SocialMetaConfig): string {
  return `<!-- Open Graph / Facebook / LinkedIn / WhatsApp -->
<meta property="og:type" content="${config.type}" />
<meta property="og:site_name" content="${config.siteName}" />
<meta property="og:title" content="${config.title}" />
<meta property="og:description" content="${config.description}" />
<meta property="og:image" content="${config.imageUrl}" />
<meta property="og:url" content="${config.pageUrl}" />
<meta property="og:locale" content="${config.locale}" />
<meta property="profile:username" content="${config.creatorHandle.replace(/^@/, "")}" />

<!-- Twitter / X Card -->
<meta name="twitter:card" content="${config.cardType}" />
<meta name="twitter:title" content="${config.title}" />
<meta name="twitter:description" content="${config.description}" />
<meta name="twitter:image" content="${config.imageUrl}" />
<meta name="twitter:creator" content="${config.creatorHandle}" />
<meta name="twitter:site" content="@AIInfluencerApp" />

<!-- Standard SEO -->
<title>${config.title}</title>
<meta name="description" content="${config.description}" />`;
}
