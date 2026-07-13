// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { CURRENT_VERSION } from "../../constants/version";
import { createAlertSchema } from "../alert/AlertSchema";
import { createBadgeSchema } from "../badge/BadgeSchema";
import { createButtonSchema } from "../button/ButtonSchema";
import { createCanvasSchema } from "../canvas/CanvasSchema";
import { createCardSchema } from "../card/CardSchema";
import { createCheckboxSchema } from "../checkbox/CheckboxSchema";
import { createDialogSchema } from "../dialog/DialogSchema";
import { createDividerSchema } from "../divider/DividerSchema";
import { createElementSchema } from "../element/ElementSchema";
import { createFooterSchema } from "../footer/FooterSchema";
import { createFormSchema } from "../form/FormSchema";
import { createGridSchema } from "../grid/GridSchema";
import { createHeadingSchema } from "../heading/HeadingSchema";
import { createImageSchema } from "../image/ImageSchema";
import { createInputSchema } from "../input/InputSchema";
import { createLabelSchema } from "../label/LabelSchema";
import { createLinkSchema } from "../link/LinkSchema";
import { createListItemSchema } from "../list-item/ListItemSchema";
import { createListSchema } from "../list/ListSchema";
import { createMapSchema } from "../map/MapSchema";
import { createMenuBarSchema } from "../menu-bar/MenuBarSchema";
import { createRadioGroupSchema } from "../radio-group/RadioGroupSchema";
import { createRichTextSchema } from "../rich-text/RichTextSchema";
import { createSectionSchema } from "../section/SectionSchema";
import { createSelectSchema } from "../select/SelectSchema";
import { createSideBarSchema } from "../side-bar/SideBarSchema";
import { createSpacerSchema } from "../spacer/SpacerSchema";
import { createSpinnerSchema } from "../spinner/SpinnerSchema";
import { createSwitchSchema } from "../switch/SwitchSchema";
import { createTableDataSchema } from "../table-data/TableDataSchema";
import { createTableHeaderSchema } from "../table-header/TableHeaderSchema";
import { createTableRowSchema } from "../table-row/TableRowSchema";
import { createTableSchema } from "../table/TableSchema";
import { createTextSchema } from "../text/TextSchema";
import { createTextAreaSchema } from "../text-area/TextAreaSchema";
import { buildSelectorsCSS } from "../runtime/style/buildSelectorsCSS";
import { collectResolvedComponents, renderComponentTree } from "../runtime/export/renderComponentTree";
import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createDefaultPage(websiteName, websitePageName, language = "en") {
  return {
    id: "page-root",
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    },
    props: {
      flexDirection: "column",
      gap: "0px",
      padding: "0px",
    },
    slots: {
      body: [
        {
          id: "section-1",
          props: {
            borderColor: "transparent",
            borderWidth: "0px",
            flexDirection: "column",
            gap: "1.25rem",
            justifyContent: "flex-start",
            margin: "0px auto 0px auto",
            maxWidth: "720px",
          },
          slots: {
            body: [
              {
                id: "heading-1",
                props: {
                  level: "1",
                  text: language === "sv" ? `Välkommen${websiteName || "" ? " till " + websiteName : ""}!` : `Welcome${websiteName || "" ? " to " + websiteName : ""}!`,
                },
                slots: {},
                type: "Heading",
              },
              {
                id: "text-1",
                props: {
                  text: language === "sv" ? `Detta är ${websitePageName || "huvud"}sidan för din webbsida.` : `This is the ${websitePageName || "default"} page for your website.`,
                },
                slots: {
                  body: [],
                },
                type: "Text",
              },
            ],
          },
          type: "Section",
        },
      ],
    },
    type: "Page",
  };
}

export function createInitialPage() {
  return {
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    },
    props: {
      flexDirection: "column",
      gap: "0px",
      padding: "0px",
    },
    slots: {
      body: [
        {
          props: {
            borderColor: "transparent",
            borderWidth: "0px",
            flexDirection: "column",
            gap: "1.25rem",
            justifyContent: "flex-start",
            margin: "0px auto 0px auto",
            maxWidth: "720px",
          },
          slots: {
            body: [
              {
                props: {
                  level: "1",
                  text: "Välkommen till vår hemsidebyggare!",
                },
                slots: {},
                type: "Heading",
              },
              {
                props: {
                  text: "Vår hemsidebyggare tillåter dig att skapa en hemsida i din webbläsare. När du känner dig färdig med hemsidan kan du exportera den till en HTML-fil på din dator. Vill du kunna fortsätta med hemsidan vid ett senare tillfälle, kan du även exportera den till en JSON-fil. Denna JSON-fil kan du sedan importera för att fortsätta där du var.",
                },
                slots: {
                  body: [],
                },
                type: "Text",
              },
              {
                props: {
                  text: "I menyn på sidan finner du först operationer för att ångra det du gjort och göra om det du tidigare ångrat. Sedan kommer våra komponenter, indelade i grupper. Grupperna är layout, innehåll, interaktion, formulär samt feed-back och status. Nedanför komponenterna finner du mallar. Mallarna är egentligen bara komponenter vars inställningar konfigurerats på ett specifikt sätt. Du kan även importera mallar från datorn. Efter mallarna kommer import och export.",
                },
                slots: {
                  body: [],
                },
                type: "Text",
              },
              {
                props: {
                  text: "Knapparna med komponenter och mallar går att klicka på, men dem går även att dra med musen. Klickar du på en knapp läggs komponenten eller mallen till längst ner på sidan, om det är tillåtet. Drar du en knapp kan du själv välja var du ska placera komponenten eller mallen. Komponenter som redan finns på hemsidan går också att flytta runt. Du kan dra dem från en komponent till en annan. Vill du flytta dem inom en viss komponent kan du högerklicka på komponenten med musen och välja att flytta fram eller flytta bak komponenten i menyn som visas. Du kan även redigera komponentens inställningar eller ta bort den via menyn. I menyn får du även tillgång till att kopiera en komponent och klistra in en kopia på ett annat ställe, samt att skapa en mall från en komponent.",
                },
                slots: {
                  body: [],
                },
                type: "Text",
              },
            ],
          },
          type: "Section",
        },
      ],
    },
    type: "Page",
  };
}

export function createLandingPage(language = "en") {
  return {
    id: "page-cd0b6dd0-fc6c-4cd8-bd2f-e92b108682b6",
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    },
    props: {
      title: "",
      description: "",
      keywords: "",
      selectors: [],
      flexDirection: "column",
      gap: "0px",
      padding: "0px",
    },
    slots: {
      body: [
        {
          id: "menubar-0619a83c-58af-45a9-8607-8c5479e662a2",
          props: {
            title: "Ophixor",
            iconImageAlt: "",
            iconImageSrc: "",
            iconLetter: "P",
            items: [
              {
                href: "/docs",
                items: [],
                label: (language) => (language === "sv" ? "Dokumentation" : "Documentation"),
                type: "link",
                id: "item-e84f9858-afa9-4e24-9247-dfa4c569a509",
              },
              {
                href: "/changelog",
                items: [],
                label: (language) => (language === "sv" ? "Loggbok" : "Changelog"),
                type: "link",
                id: "item-fe56ce5d-1920-4c49-9128-85f077434bfe",
              },
              {
                items: [
                  {
                    href: "/sign-in",
                    items: [],
                    label: (language) => (language === "sv" ? "Logga in" : "Sign in"),
                    type: "link",
                    id: "item-bd836a08-f73c-4875-945b-c2408e435a0c",
                  },
                  {
                    href: "/sign-up",
                    items: [],
                    label: (language) => (language === "sv" ? "Registrera" : "Sign up"),
                    type: "link",
                    id: "item-36a4d8b1-cfe0-4bf0-bd8d-491620a73a36",
                  },
                ],
                label: (language) => (language === "sv" ? "Konto" : "Account"),
                id: "item-d8a77912-7ce9-41b9-a88f-8adc4ce5f21c",
              },
            ],
            selectors: [],
            backgroundColor: "rgba(0, 0, 255, 0.75)",
            backgroundImage: "linear-gradient(180deg, #2563eb99, #1e40af99)",
            backdropFilter: "blur(16px)",
            borderColor: "rgba(0, 0, 200, 0.75)",
            backgroundColorIconLetter: "rgba(0, 0, 255, 0.75)",
            colorIconLetter: "rgba(200, 200, 255, 0.75)",
            colorItem: "rgba(200, 200, 255, 0.75)",
            colorItemHover: "rgba(200, 200, 255, 0.85)",
            backgroundColorItemPrimary: "rgba(0, 0, 200, 0.75)",
            backgroundColorItemPrimaryHover: "rgba(0, 0, 255, 0.75)",
            colorItemPrimary: "rgba(200, 200, 255, 0.75)",
            colorItemPrimaryHover: "rgba(200, 200, 255, 0.85)",
            backgroundColorLineHover: "transparent",
            backgroundColorSubMenu: "rgba(0, 0, 200, 1)",
            backgroundColorSubMenuItemHover: "rgba(0, 0, 150, 1)",
            backgroundColorSubMenuItemPrimary: "rgba(0, 0, 200, 0.75)",
            backgroundColorSubMenuItemPrimaryHover: "rgba(0, 0, 255, 0.75)",
            colorSubMenuItem: "rgba(200, 200, 255, 0.75)",
            colorSubMenuItemHover: "rgba(200, 200, 255, 0.85)",
            colorSubMenuItemPrimary: "rgba(200, 200, 255, 0.75)",
            colorSubMenuItemPrimaryHover: "rgba(200, 200, 255, 0.85)",
            backgroundColorMobileMenu: "rgba(0, 0, 255, 0.75)",
            backgroundImageMobileMenu: "linear-gradient(180deg, #2563eb99, #1e40af99)",
            color: "rgba(200, 200, 255, 0.75)",
            colorHover: "rgba(200, 200, 255, 0.85)",
            position: "fixed",
            top: "auto",
          },
          type: "MenuBar",
          slots: {},
        },
        {
          id: "hero-wrapper",
          type: "Section",
          props: {
            element: "div",
            flexDirection: "column",
            minHeight: "100vh",
            width: "100%",
            position: "relative",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            selectors: [],
            padding: "calc(65px + 2rem) 2rem 2rem 2rem",
            backgroundColor: "transparent",
          },
          slots: {
            body: [
              {
                id: "hero-bg-image",
                type: "Image",
                props: {
                  src: "/images/sky.webp",
                  alt: "",
                  role: "background",
                  fill: true,
                  priority: true,
                  loading: "eager",
                  fetchPriority: "high",
                  decoding: "async",
                  objectFit: "cover",
                  objectPosition: "center",
                  opacity: "1",
                  position: "absolute",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  zIndex: "0",
                  selectors: [],
                  borderRadius: "0px",
                  borderWidth: "0px",
                },
                slots: {},
              },
              {
                id: "section-5fa26fd6-694d-4dc2-a2d6-65409a1f8b5f",
                label: "Section",
                props: {
                  element: "div",
                  isVisible: true,
                  selectors: [],
                  borderWidth: "1px",
                  flexDirection: { desktop: "row", mobile: "column", tablet: "column" },
                  gap: "1.5rem",
                  justifyContent: "flex-start",
                  margin: "0 auto",
                  maxWidth: "1200px",
                  padding: "4rem 2rem",
                  background: "none",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 30px 90px rgba(15, 23, 42, 0.25)",
                  borderColor: "rgba(15, 23, 42, 0.25)",
                  borderRadius: "16px",
                  position: "relative",
                },
                type: "Section",
                slots: {
                  body: [
                    {
                      id: "section-fda9b641-3be2-4ff3-92e3-facf7e55597d",
                      label: "Section",
                      props: {
                        element: "div",
                        isVisible: true,
                        selectors: [],
                        borderColor: "transparent",
                        borderWidth: "0px",
                        padding: "0px",
                        gap: "2rem",
                        alignContent: "normal",
                        alignItems: "stretch",
                        justifyContent: "flex-start",
                        containerType: "inline-size",
                      },
                      type: "Section",
                      slots: {
                        body: [
                          {
                            id: "heading-365460da-83cb-48c6-9fd1-2adc095051cc",
                            label: "Heading",
                            props: {
                              text: "Ophixor",
                              level: "1",
                              selectors: [],
                              color: "#60a5fa",
                              textAlign: "left",
                              textShadow: "0 -1px 0 #1e40af, 0 1px 1px #2563eb, 0 4px 6px rgba(0, 0, 0, 0.6)",
                              fontSizeLevel1: "clamp(2.25rem, 5cqw, 3.5rem)",
                              fontSizeLevel2: "clamp(1.875rem, 4cqw, 2.75rem)",
                              fontSizeLevel3: "clamp(1.5rem, 3cqw, 2.125rem)",
                              fontSizeLevel4: "clamp(1.25rem, 2.2cqw, 1.625rem)",
                              fontSizeLevel5: "clamp(1.125rem, 1.8cqw, 1.375rem)",
                              fontSizeLevel6: "clamp(1rem, 1.4cqw, 1.125rem)",
                              fontWeightLevel1: "800",
                              fontWeightLevel2: "700",
                              fontWeightLevel3: "600",
                              fontWeightLevel4: "600",
                              fontWeightLevel5: "500",
                              fontWeightLevel6: "500",
                              lineHeightLevel1: "1.1",
                              lineHeightLevel2: "1.15",
                              lineHeightLevel3: "1.2",
                              lineHeightLevel4: "1.3",
                              lineHeightLevel5: "1.35",
                              lineHeightLevel6: "1.4",
                              letterSpacingLevel1: "-0.025em",
                              letterSpacingLevel2: "-0.02em",
                              letterSpacingLevel3: "-0.01em",
                              letterSpacingLevel4: "0em",
                              letterSpacingLevel5: "0em",
                              letterSpacingLevel6: "0.02em",
                              margin: "0px",
                            },
                            type: "Heading",
                            slots: {
                              body: [],
                            },
                          },
                          {
                            id: "text-531e6dc0-9e95-442e-9603-24e6539353c9",
                            label: "Text",
                            props: {
                              text: (language) => (language === "sv" ? `Experimentera med tillgång till hela editorn för att se om ${process.env.NEXT_PUBLIC_PLATFORM_NAME} är något för dig. Det finns några begränsningar att ta hänsyn till. Du kan inte publicera sidan, ladda upp bilder, hantera modeller och data eller använda integrationer.` : `Experiment with the full editor to see if ${process.env.NEXT_PUBLIC_PLATFORM_NAME} is something for you. There are some limitations though. You can't publish the page, upload images, manage models and data or use integrations.`),
                              title: "",
                              element: "p",
                              selectors: [],
                              fontFamily: "inherit",
                              fontSize: "clamp(1rem, 5cqw, 1.5rem)",
                              fontWeight: "600",
                              fontStyle: "normal",
                              lineHeight: "1.65",
                              textDecoration: "none",
                              color: "#dbeafe",
                              textShadow: "0 -1px 0 #1e40af, 0 1px 1px #2563eb, 0 4px 6px rgba(0, 0, 0, 0.6)",
                              textAlign: "left",
                              overflow: "visible",
                              overflowWrap: "normal",
                              wordBreak: "normal",
                              textOverflow: "clip",
                              backgroundColor: "transparent",
                              cursor: "auto",
                              borderWidth: "0px",
                              borderColor: "transparent",
                              borderRadius: "0px",
                              width: "auto",
                              minWidth: "0px",
                              maxWidth: "none",
                              height: "auto",
                              minHeight: "0px",
                              maxHeight: "none",
                              display: "inline-block",
                              margin: "0px",
                              padding: "0px",
                              whiteSpace: "normal",
                            },
                            type: "Text",
                            slots: {
                              body: [],
                            },
                          },
                        ],
                      },
                    },
                    {
                      id: "section-2a28f3ae-f616-4c51-8dae-56903bcd0aee",
                      label: "Section",
                      props: {
                        element: "div",
                        isVisible: true,
                        selectors: [],
                        borderColor: "transparent",
                        borderWidth: "0px",
                        maxWidth: "300px",
                        padding: "0px",
                      },
                      type: "Section",
                      slots: {
                        body: [
                          {
                            id: "image-47ceaf6a-236e-416d-bb22-f7cdf84d34df",
                            label: "Image",
                            props: {
                              src: "/images/logo.webp",
                              alt: "",
                              role: "hero",
                              fill: false,
                              sizes: "100vw",
                              quality: 75,
                              priority: true,
                              loading: "lazy",
                              fetchPriority: "auto",
                              decoding: "async",
                              placeholder: "empty",
                              blurDataURL: "",
                              referrerPolicy: "no-referrer",
                              unoptimized: false,
                              isVisible: true,
                              selectors: [],
                              width: { desktop: "300px", mobile: "200px", tablet: "300px" },
                              maxWidth: "100%",
                              height: { desktop: "300px", mobile: "200px", tablet: "300px" },
                              maxHeight: "100%",
                              flexGrow: "1",
                              alignSelf: "auto",
                              justifySelf: "auto",
                              position: "relative",
                              top: "auto",
                              right: "auto",
                              bottom: "auto",
                              left: "auto",
                              zIndex: "auto",
                              aspectRatio: "auto",
                              objectFit: "contain",
                              objectPosition: "center",
                              backgroundColor: "transparent",
                              cursor: "auto",
                              opacity: "1",
                              borderColor: "var(--pc-semantic-border-secondary)",
                              borderWidth: "5px",
                              borderRadius: "50%",
                              boxShadow: "var(--pc-semantic-shadow-sm)",
                            },
                            type: "Image",
                            slots: {},
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    type: "Page",
  };
}

export function createPageSchema() {
  return {
    componentGroups: [
      {
        componentTypes: ["Section", "Grid", "Card", "Divider", "Spacer", "MenuBar", "SideBar", "Footer"],
        label: "Layout",
      },
      {
        componentTypes: ["Heading", "Text", "RichText", "Image", "Badge", "List", "ListItem", "Table", "TableRow", "TableHeader", "TableData"],
        label: "Content",
      },
      {
        componentTypes: ["Button", "Link", "Map", "Canvas"],
        label: "Interaction",
      },
      {
        componentTypes: ["Form", "Input", "TextArea", "Select", "Checkbox", "Switch", "RadioGroup", "Label"],
        label: "Forms",
      },
      {
        componentTypes: ["Alert", "Dialog", "Spinner"],
        label: "Feedback and status",
      },
      {
        componentTypes: ["Element"],
        label: "Advanced",
      },
    ],
    componentSchemas: {
      Alert: createAlertSchema(),
      Badge: createBadgeSchema(),
      Button: createButtonSchema(),
      Canvas: createCanvasSchema(),
      Card: createCardSchema(),
      Checkbox: createCheckboxSchema(),
      Dialog: createDialogSchema(),
      Divider: createDividerSchema(),
      Element: createElementSchema(),
      Footer: createFooterSchema(),
      Form: createFormSchema(),
      Grid: createGridSchema(),
      Heading: createHeadingSchema(),
      Image: createImageSchema(),
      Input: createInputSchema(),
      Label: createLabelSchema(),
      Link: createLinkSchema(),
      List: createListSchema(),
      ListItem: createListItemSchema(),
      Map: createMapSchema(),
      MenuBar: createMenuBarSchema(),
      RadioGroup: createRadioGroupSchema(),
      RichText: createRichTextSchema(),
      Section: createSectionSchema(),
      Select: createSelectSchema(),
      SideBar: createSideBarSchema(),
      Spacer: createSpacerSchema(),
      Spinner: createSpinnerSchema(),
      Switch: createSwitchSchema(),
      Table: createTableSchema(),
      TableData: createTableDataSchema(),
      TableHeader: createTableHeaderSchema(),
      TableRow: createTableRowSchema(),
      Text: createTextSchema(),
      TextArea: createTextAreaSchema(),
    },
    defaultSlots: {
      body: [],
    },
    description: "A container of the whole page.",
    editor: {
      defaultOpenGroups: {
        action: [],
        content: ["SEO"],
        layout: ["Structure"],
        selectors: [],
        styling: [],
      },
      roleGroupOrder: {
        action: ["Action"],
        content: ["SEO"],
        layout: ["Structure", "Spacing", "Size"],
        selectors: ["Selectors"],
        styling: ["Background"],
      },
      roleOrder: ["content", "layout", "styling", "action", "selectors"],
    },
    exportCSS: (page = null, pageSchema = null) => {
      if (page && pageSchema) {
        const props = exportCSSFromProps(page, pageSchema);

        if (props.length > 0) {
          return `
      .${page.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .page {
        --page-align-items: stretch;
        --page-background: none;
        --page-background-blend-mode: normal;
        --page-background-color: var(--pc-semantic-surface-page);
        --page-background-image: none;
        --page-background-position: center;
        --page-background-repeat: repeat;
        --page-background-size: auto;
        --page-flex-direction: row;
        --page-gap: 2rem;
        --page-height: auto;
        --page-justify-content: stretch;
        --page-padding: 2rem;
        --page-width: auto;

        background: var(--page-background);
        background-blend-mode: var(--page-background-blend-mode);
        background-color: var(--page-background-color);
        background-image: var(--page-background-image);
        background-position: var(--page-background-position);
        background-repeat: var(--page-background-repeat);
        background-size: var(--page-background-size);
        height: var(--page-height);
        overflow-y: auto;
        padding: 0px;
        width: var(--page-width);
      }

      .page > .page-content {
        align-items: var(--page-align-items);
        display: flex;
        flex-direction: var(--page-flex-direction);
        flex-wrap: wrap;
        gap: var(--page-gap);
        height: var(--page-height);
        justify-content: var(--page-justify-content);
        padding: var(--page-padding);
        width: var(--page-width);
      }
`;
      }
    },
    exportHTML: async (page, pageSchema, componentIndex = {}, models = {}, pageData = {}, relationIndexes = {}, nowTick, platformUser, socketDataArray, socketStatus, state, user, viewport, website, isMinified = false) => {
      const components = collectResolvedComponents({
        component: page,
        context: {
          componentIndex,
          modelScope: pageData,
          nowTick,
          pageData,
          platformUser,
          socketDataArray,
          socketStatus,
          state,
          user,
          viewport,
          website,
        },
        models,
        pageData,
        pageSchema,
        relationIndexes,
        scope: pageData,
      });

      const componentSchemas = { ...(pageSchema?.componentSchemas || {}) };

      Object.entries(componentSchemas).forEach(([key, componentSchema]) => {
        componentSchemas[key] = 0;
      });

      components.forEach((component) => {
        const type = component?.type;

        if (type && type in componentSchemas) {
          const oldCount = componentSchemas[type];
          const newCount = oldCount + 1;

          componentSchemas[type] = newCount;
        }
      });

      Object.entries(componentSchemas).forEach(([key, componentSchemaCount]) => {
        if (componentSchemas[key] === 0) {
          delete componentSchemas[key];
        }
      });

      let hasJS = false;

      Object.entries(componentSchemas).forEach(([type, componentSchemaCount]) => {
        const componentSchema = pageSchema?.componentSchemas?.[type];

        if (componentSchema?.exportJS && typeof componentSchema.exportJS === "function") {
          hasJS = true;
        }

        componentSchemas[type] = componentSchema;
      });

      const seen = new Set();

      const bodyCss = components
        .filter((component) => {
          const key = component.id + JSON.stringify(component.props);

          if (seen.has(key)) {
            return false;
          }

          seen.add(key);

          return true;
        })
        .map((component) => (component.type === "Page" ? pageSchema : pageSchema.componentSchemas[component.type]).exportCSS(component, component.type === "Page" ? pageSchema : pageSchema.componentSchemas[component.type]))
        .join("");

      const initialBodyHtml = await Promise.all(
        (page.slots.body || []).map((component) =>
          renderComponentTree({
            component,
            context: {
              componentIndex,
              modelScope: pageData,
              nowTick,
              pageData,
              platformUser,
              socketDataArray,
              socketStatus,
              state,
              user,
              viewport,
              website,
            },
            indentation: "        ",
            models,
            pageData,
            pageSchema,
            relationIndexes,
            scope: pageData,
          }),
        ),
      );

      const selectorsCSS = buildSelectorsCSS(page, "      ");

      const bodyHtml = initialBodyHtml.join("");

      const html = `<!DOCTYPE html>
<html lang="sv">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <meta name="description" content="${page?.props?.description || website?.description || ""}">
    <meta name="keywords" content="${page?.props?.keywords || website?.keywords || ""}">
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link crossorigin href="https://fonts.gstatic.com" rel="preconnect" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <title>${page?.props?.title || website?.name || ""}</title>
    <style>
      :root {
        --font-inter: Inter;

        --pc-foundation-color-white: #ffffff;
        --pc-foundation-color-black: #000000;

        --pc-foundation-color-gray-50: #f9fafb;
        --pc-foundation-color-gray-100: #f3f4f6;
        --pc-foundation-color-gray-200: #e5e7eb;
        --pc-foundation-color-gray-300: #d1d5db;
        --pc-foundation-color-gray-400: #9ca3af;
        --pc-foundation-color-gray-500: #6b7280;
        --pc-foundation-color-gray-600: #4b5563;
        --pc-foundation-color-gray-700: #374151;
        --pc-foundation-color-gray-800: #1f2937;
        --pc-foundation-color-gray-900: #111827;
        --pc-foundation-color-gray-950: #030712;

        --pc-foundation-color-slate-50: #f8fafc;
        --pc-foundation-color-slate-100: #f1f5f9;
        --pc-foundation-color-slate-200: #e2e8f0;
        --pc-foundation-color-slate-300: #cbd5e1;
        --pc-foundation-color-slate-400: #94a3b8;
        --pc-foundation-color-slate-500: #64748b;
        --pc-foundation-color-slate-600: #475569;
        --pc-foundation-color-slate-700: #334155;
        --pc-foundation-color-slate-800: #1e293b;
        --pc-foundation-color-slate-900: #0f172a;
        --pc-foundation-color-slate-950: #020617;

        --pc-foundation-color-primary-50: #eff6ff;
        --pc-foundation-color-primary-100: #dbeafe;
        --pc-foundation-color-primary-200: #bfdbfe;
        --pc-foundation-color-primary-300: #93c5fd;
        --pc-foundation-color-primary-400: #60a5fa;
        --pc-foundation-color-primary-500: #3b82f6;
        --pc-foundation-color-primary-600: #2563eb;
        --pc-foundation-color-primary-700: #1d4ed8;
        --pc-foundation-color-primary-800: #1e40af;
        --pc-foundation-color-primary-900: #1e3a8a;
        --pc-foundation-color-primary-950: #172554;

        --pc-foundation-color-primary-bg: color-mix(in srgb, var(--pc-foundation-color-primary-500) 10%, transparent);
        --pc-foundation-color-primary-bg-2: color-mix(in srgb, var(--pc-foundation-color-primary-600) 5%, transparent);

        --pc-foundation-color-success-50: #f0fdf4;
        --pc-foundation-color-success-100: #dcfce7;
        --pc-foundation-color-success-200: #bbf7d0;
        --pc-foundation-color-success-300: #86efac;
        --pc-foundation-color-success-400: #4ade80;
        --pc-foundation-color-success-500: #22c55e;
        --pc-foundation-color-success-600: #16a34a;
        --pc-foundation-color-success-700: #15803d;
        --pc-foundation-color-success-800: #166534;
        --pc-foundation-color-success-900: #14532d;
        --pc-foundation-color-success-950: #052e16;

        --pc-foundation-color-success-bg: color-mix(in srgb, var(--pc-foundation-color-success-500) 10%, transparent);

        --pc-foundation-color-warning-50: #fefce8;
        --pc-foundation-color-warning-100: #fef9c3;
        --pc-foundation-color-warning-200: #fef08a;
        --pc-foundation-color-warning-300: #fde047;
        --pc-foundation-color-warning-400: #facc15;
        --pc-foundation-color-warning-500: #eab308;
        --pc-foundation-color-warning-600: #ca8a04;
        --pc-foundation-color-warning-700: #a16207;
        --pc-foundation-color-warning-800: #854d0e;
        --pc-foundation-color-warning-900: #713f12;
        --pc-foundation-color-warning-950: #422006;

        --pc-foundation-color-warning-bg: color-mix(in srgb, var(--pc-foundation-color-warning-500) 10%, transparent);

        --pc-foundation-color-danger-50: #fef2f2;
        --pc-foundation-color-danger-100: #fee2e2;
        --pc-foundation-color-danger-200: #fecaca;
        --pc-foundation-color-danger-300: #fca5a5;
        --pc-foundation-color-danger-400: #f87171;
        --pc-foundation-color-danger-500: #ef4444;
        --pc-foundation-color-danger-600: #dc2626;
        --pc-foundation-color-danger-700: #b91c1c;
        --pc-foundation-color-danger-800: #991b1b;
        --pc-foundation-color-danger-900: #7f1d1d;
        --pc-foundation-color-danger-950: #450a0a;

        --pc-foundation-color-danger-bg: color-mix(in srgb, var(--pc-foundation-color-danger-500) 10%, transparent);

        --pc-semantic-surface-page: var(--pc-foundation-color-slate-50);
        --pc-semantic-surface-base: var(--pc-foundation-color-white);
        --pc-semantic-surface-base-secondary: var(--pc-foundation-color-slate-900);
        --pc-semantic-surface-overlay: rgba(255, 255, 255, 0.9);
        --pc-semantic-surface-overlay-2: rgba(255, 255, 255, 0.6);
        --pc-semantic-surface-primary: var(--pc-foundation-color-primary-bg-2);

        --pc-semantic-text-primary: var(--pc-foundation-color-slate-900);
        --pc-semantic-text-secondary: var(--pc-foundation-color-slate-600);
        --pc-semantic-text-tertiary: var(--pc-foundation-color-gray-200);
        --pc-semantic-text-muted: var(--pc-foundation-color-slate-400);
        --pc-semantic-text-inverse: var(--pc-foundation-color-white);

        --pc-semantic-border-default: var(--pc-foundation-color-gray-200);
        --pc-semantic-border-secondary: var(--pc-foundation-color-white);
        --pc-semantic-border-tertiary: rgba(255, 255, 255, 0.1);
        --pc-semantic-border-transparent: transparent;

        --pc-semantic-interactive-link-hover: var(--pc-foundation-color-primary-400);
        --pc-semantic-interactive-primary: var(--pc-foundation-color-primary-600);
        --pc-semantic-interactive-primary-hover: var(--pc-foundation-color-primary-700);

        --pc-semantic-status-primary: var(--pc-foundation-color-primary-500);
        --pc-semantic-status-primary-bg: var(--pc-foundation-color-primary-bg);
        --pc-semantic-status-primary-soft: var(--pc-foundation-color-primary-100);
        --pc-semantic-status-primary-text: var(--pc-foundation-color-primary-800);

        --pc-semantic-status-success: var(--pc-foundation-color-success-500);
        --pc-semantic-status-success-bg: var(--pc-foundation-color-success-bg);
        --pc-semantic-status-success-soft: var(--pc-foundation-color-success-100);
        --pc-semantic-status-success-text: var(--pc-foundation-color-success-800);

        --pc-semantic-status-warning: var(--pc-foundation-color-warning-500);
        --pc-semantic-status-warning-bg: var(--pc-foundation-color-warning-bg);
        --pc-semantic-status-warning-soft: var(--pc-foundation-color-warning-100);
        --pc-semantic-status-warning-text: var(--pc-foundation-color-warning-800);

        --pc-semantic-status-danger: var(--pc-foundation-color-danger-600);
        --pc-semantic-status-danger-bg: var(--pc-foundation-color-danger-bg);
        --pc-semantic-status-danger-soft: var(--pc-foundation-color-danger-100);
        --pc-semantic-status-danger-text: var(--pc-foundation-color-danger-800);

        --pc-semantic-focus-ring: 0 0 0 3px rgba(37, 99, 235, 0.25);

        --pc-semantic-shadow-sm: 0 8px 24px rgba(15, 23, 42, 0.08);
        --pc-semantic-shadow-lg: 0 30px 90px rgba(0, 0, 0, 0.25);

        --pc-semantic-backdrop: rgb(var(--pc-foundation-color-slate-900) / 45%);
      }

      * {
        box-sizing: border-box;
        font-family: var(--font-inter);
        padding: 0;
        margin: 0;
      }

      html, body {
        max-width: 100vw;
        overflow-x: hidden;
      }

      body {
        background-color: ${page?.props?.backgroundColor || "#eef2f7"};
        display: grid;
        grid-template-columns: 1fr;
        line-height: 1.6;
        min-height: 100vh;
      }

      a {
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-inter);
      }
${pageSchema.exportCSS(null, null)}${Object.entries(componentSchemas || {})
        .map(([key, value]) => value?.exportCSS(null, null))
        .join("")}${bodyCss}${selectorsCSS}    </style>${
        hasJS
          ? `\n    <script>${Object.entries(componentSchemas || {})
              .map(([key, value]) => (typeof value?.exportJS === "function" ? value?.exportJS("      ") : ""))
              .join("")}\n    </script>`
          : ""
      }
  </head>
  <body>
    <main class="page ${page?.id}" data-pc-id="${page?.id || ""}">
      <div class="page-content">
${bodyHtml}      </div>
    </main>
  </body>
</html>`;

      if (isMinified) {
        const htmlMinified = html.replaceAll(/\n\s*/g, "");

        return htmlMinified;
      }

      return html;
    },
    label: "Page",
    plan: "Personal",
    props: {
      title: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Title",
        role: "content",
        roleGroup: "SEO",
        schemaType: "string",
        type: "text",
      },
      description: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Description",
        role: "content",
        roleGroup: "SEO",
        schemaType: "string",
        type: "text",
      },
      keywords: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Keywords",
        role: "content",
        roleGroup: "SEO",
        schemaType: "string",
        type: "text",
      },
      flexDirection: {
        cssProperty: "flex-direction",
        cssVariableName: "--page-flex-direction",
        defaultValue: "row",
        label: "Flexbox direction",
        options: [
          { label: "Column", value: "column" },
          { label: "Row", value: "row" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      alignItems: {
        cssProperty: "align-items",
        cssVariableName: "--page-align-items",
        defaultValue: "stretch",
        label: "Align items",
        options: [
          { label: "Stretch", value: "stretch" },
          { label: "Center", value: "center" },
          { label: "Flexbox start", value: "flex-start" },
          { label: "Flexbox end", value: "flex-end" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      justifyContent: {
        cssProperty: "justify-content",
        cssVariableName: "--page-justify-content",
        defaultValue: "stretch",
        label: "Justify content",
        options: [
          { label: "Stretch", value: "stretch" },
          { label: "Center", value: "center" },
          { label: "Flexbox start", value: "flex-start" },
          { label: "Flexbox end", value: "flex-end" },
          { label: "Space between", value: "space-between" },
          { label: "Space around", value: "space-around" },
          { label: "Space evenly", value: "space-evenly" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      gap: {
        cssProperty: "gap",
        cssVariableName: "--page-gap",
        defaultValue: "2rem",
        label: "Gap",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--page-padding",
        defaultValue: "2rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--page-width",
        defaultValue: "auto",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--page-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      background: {
        cssProperty: "background",
        cssVariableName: "--page-background",
        defaultValue: "none",
        label: "Background",
        role: "styling",
        roleGroup: "Background",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--page-background-color",
        defaultValue: "var(--pc-semantic-surface-page)",
        label: "Background color",
        role: "styling",
        roleGroup: "Background",
        schemaType: "string",
        type: "color",
      },
      backgroundImage: {
        cssProperty: "background-image",
        cssVariableName: "--page-background-image",
        defaultValue: "none",
        label: "Background image",
        role: "styling",
        roleGroup: "Background",
        schemaType: "string",
        type: "text",
      },
      backgroundSize: {
        cssProperty: "background-size",
        cssVariableName: "--page-background-size",
        defaultValue: "auto",
        label: "Background size",
        role: "styling",
        roleGroup: "Background",
        schemaType: "string",
        type: "text",
      },
      backgroundPosition: {
        cssProperty: "background-position",
        cssVariableName: "--page-background-position",
        defaultValue: "center",
        label: "Background position",
        role: "styling",
        roleGroup: "Background",
        schemaType: "string",
        type: "text",
      },
      backgroundRepeat: {
        cssProperty: "background-repeat",
        cssVariableName: "--page-background-repeat",
        defaultValue: "repeat",
        label: "Background repeat",
        role: "styling",
        roleGroup: "Background",
        schemaType: "string",
        type: "text",
      },
      backgroundBlendMode: {
        cssProperty: "background-blend-mode",
        cssVariableName: "--page-background-blend-mode",
        defaultValue: "normal",
        label: "Background blend mode",
        role: "styling",
        roleGroup: "Background",
        schemaType: "string",
        type: "text",
      },
      onBroadcast: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: null,
        label: "On broadcast",
        role: "action",
        roleGroup: "Action",
        schemaType: "object",
        type: "action",
      },
      onEmit: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: null,
        label: "On emit",
        role: "action",
        roleGroup: "Action",
        schemaType: "object",
        type: "action",
      },
      selectors: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: [],
        label: "Selectors",
        role: "selectors",
        roleGroup: "Selectors",
        schemaType: "array",
        type: "selectors",
      },
    },
    slots: {
      body: {
        allowedChildComponents: ["Canvas", "Card", "Dialog", "Divider", "Element", "Footer", "Form", "Grid", "Map", "MenuBar", "RichText", "Section", "SideBar", "Spacer", "Spinner"],
      },
    },
  };
}
