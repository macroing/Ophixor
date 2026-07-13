// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import platform from "./platform.json" with { type: "json" };
import platformMarketing from "./platform-marketing.json" with { type: "json" };

export function generateJsonLdPlatformGraph({ description, language, name, url }) {
  const base = platform.url;

  /*
   * Potentially add offers in the future. Something like the following:
   *
   * offers: {
   *   "@type": "Offer",
   *   price: "0",
   *   priceCurrency: "USD",
   *   description: "Free plan available",
   * }
   */

  const schema = {
    "@context": "https://schema.org",
    "@graph": [],
  };

  if (base === "https://ophixor.com") {
    const person = {
      "@type": "Person",
      "@id": `${base}/#founder`,
      name: "Jörgen Lundgren",
      url: "https://www.linkedin.com/in/jörgen-lundgren-7b049520",
      jobTitle: "Founder & Developer",
      worksFor: {
        "@id": `${base}/#organization`,
      },
      sameAs: ["https://www.linkedin.com/in/jörgen-lundgren-7b049520", "https://jörgenlundgren.se", "https://macroing.org/users/joergen"],
    };

    schema["@graph"].push(person);
  }

  const organization = {
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: platform.name,
    url: base,
    email: platform.email,
    logo: {
      "@type": "ImageObject",
      url: platform.logo,
      width: platform.logoWidth,
      height: platform.logoHeight,
    },
  };

  if (base === "https://ophixor.com") {
    organization.foundingDate = "2026";
    organization.founder = {
      "@id": `${base}/#founder`,
    };
  }

  schema["@graph"].push(organization);

  const webSite = {
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: platform.name,
    url: base,
    publisher: {
      "@id": `${base}/#organization`,
    },
  };

  schema["@graph"].push(webSite);

  const softwareApplication = {
    "@type": "SoftwareApplication",
    "@id": `${base}/#product`,
    name: platform.name,
    url: base,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Website Builder",
    operatingSystem: "Web",
    description: platformMarketing.marketing.home.metadata.description[language],
    featureList: platformMarketing.marketing.home.features.items.map((f) => f.title[language]),
    audience: {
      "@type": "BusinessAudience",
      audienceType: platformMarketing.marketing.audience[language],
    },
    isSourceCodeOf: {
      "@type": "SoftwareSourceCode",
      codeRepository: "https://github.com/macroing/Ophixor",
      programmingLanguage: "JavaScript",
      runtimePlatform: "Next.js",
      license: "https://spdx.org/licenses/AGPL-3.0-only.html",
    },
  };

  schema["@graph"].push(softwareApplication);

  const webPage = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: {
      "@id": `${base}/#website`,
    },
    about: {
      "@id": `${base}/#product`,
    },
    provider: {
      "@id": `${base}/#organization`,
    },
    inLanguage: language,
  };

  schema["@graph"].push(webPage);

  return schema;
}
