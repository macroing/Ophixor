// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { generateId } from "../identity/generateId";

export function createDefaultComponentTemplates() {
  return {
    ContactForm: createComponentTemplateContactForm(),
    SignInForm: createComponentTemplateSignInForm(),
    SignOutForm: createComponentTemplateSignOutForm(),
    SignUpForm: createComponentTemplateSignUpForm(),
    Hero: createComponentTemplateHero(),
    BackgroundSection: createComponentTemplateBackgroundSection(),
    CenteredSection: createComponentTemplateCenteredSection(),
    ContentSection: createComponentTemplateContentSection(),
    FeaturesSection: createComponentTemplateFeaturesSection(),
    FullWidthSection: createComponentTemplateFullWidthSection(),
    HeaderSection: createComponentTemplateHeaderSection(),
    HighlightedSection: createComponentTemplateHighlightedSection(),
    MenuBarSection: createComponentTemplateMenuBarSection(),
  };
}

function createComponentTemplateBackgroundSection() {
  return {
    component: {
      props: {
        backgroundImage: "radial-gradient(1200px 600px at 80% -100px, rgba(59, 130, 246, 0.18), transparent), radial-gradient(800px 400px at 0% 0%, rgba(37, 99, 235, 0.12), transparent), linear-gradient(180deg, #f8fbff 0%, #eef2f7 100%)",
        borderWidth: "0px",
        flexDirection: "column",
        flexWrap: "wrap",
        minHeight: "100vh",
        padding: "0px",
        width: "100%",
      },
      slots: {
        body: [],
      },
      type: "Section",
    },
    isDefault: true,
    label: "Background section",
    plan: "Personal",
    type: "BackgroundSection",
  };
}

function createComponentTemplateCenteredSection() {
  return {
    component: {
      props: {
        borderWidth: "0px",
        flexDirection: "column",
        gap: "1.5rem",
        justifyContent: "flex-start",
        margin: "0 auto",
        maxWidth: "1200px",
        padding: "2rem 1rem",
      },
      slots: {
        body: [],
      },
      type: "Section",
    },
    isDefault: true,
    label: "Centered section",
    plan: "Personal",
    type: "CenteredSection",
  };
}

function createComponentTemplateContactForm() {
  return {
    component: {
      props: {
        gap: "2rem",
        maxWidth: "600px",
      },
      slots: {
        body: [
          {
            props: {
              level: "3",
              text: (language) => (language === "sv" ? "Kontakt" : "Contact"),
            },
            slots: {},
            type: "Heading",
          },
          {
            props: {
              text: "",
            },
            slots: {
              body: [
                {
                  props: {
                    element: "span",
                    text: (language) => (language === "sv" ? "Om du behöver kontakta oss kan du göra detta via detta formulär. Fyll i ditt namn, din e-post och ditt meddelande i fälten nedan och klicka på " : "If you need to contact us you can do so via this form. Fill in your name, your e-mail and your message in the fields below and click on "),
                  },
                  slots: {
                    body: [],
                  },
                  type: "Text",
                },
                {
                  props: {
                    color: "#475569",
                    element: "span",
                    fontWeight: "600",
                    text: (language) => (language === "sv" ? "Skicka meddelande" : "Send message"),
                  },
                  slots: {
                    body: [],
                  },
                  type: "Text",
                },
                {
                  props: {
                    element: "span",
                    text: (language) => (language === "sv" ? ". Vi hör normalt sett av oss inom 24 timmar." : ". We will normally respond within 24 hours."),
                  },
                  slots: {
                    body: [],
                  },
                  type: "Text",
                },
              ],
            },
            type: "Text",
          },
          {
            props: {
              borderColor: "transparent",
              flexDirection: "column",
              gap: "0.5rem",
              padding: "0px",
            },
            slots: {
              body: [
                {
                  props: {
                    htmlFor: "contact-form-name",
                    text: (language) => (language === "sv" ? "Namn" : "Name"),
                  },
                  slots: {},
                  type: "Label",
                },
                {
                  props: {
                    id: "contact-form-name",
                    placeholder: (language) => (language === "sv" ? "T.ex. Sven Svensson" : "For example John Doe"),
                  },
                  slots: {},
                  type: "Input",
                },
              ],
            },
            type: "Section",
          },
          {
            props: {
              borderColor: "transparent",
              flexDirection: "column",
              gap: "0.5rem",
              padding: "0px",
            },
            slots: {
              body: [
                {
                  props: {
                    htmlFor: "contact-form-email",
                    text: (language) => (language === "sv" ? "E-post" : "E-mail"),
                  },
                  slots: {},
                  type: "Label",
                },
                {
                  props: {
                    id: "contact-form-email",
                    placeholder: (language) => (language === "sv" ? "T.ex. sven.svensson@exempel.se" : "For example john.doe@example.com"),
                  },
                  slots: {},
                  type: "Input",
                },
              ],
            },
            type: "Section",
          },
          {
            props: {
              borderColor: "transparent",
              flexDirection: "column",
              gap: "0.5rem",
              padding: "0px",
            },
            slots: {
              body: [
                {
                  props: {
                    htmlFor: "contact-form-message",
                    text: (language) => (language === "sv" ? "Meddelande" : "Message"),
                  },
                  slots: {},
                  type: "Label",
                },
                {
                  props: {
                    id: "contact-form-message",
                    placeholder: (language) => (language === "sv" ? "Skriv ditt meddelande här..." : "Type your message here..."),
                    rows: "4",
                  },
                  slots: {},
                  type: "TextArea",
                },
              ],
            },
            type: "Section",
          },
          {
            props: {
              borderColor: "transparent",
              gap: "0.5rem",
              justifyContent: "flex-start",
              padding: "0px",
            },
            slots: {
              body: [
                {
                  props: {
                    text: (language) => (language === "sv" ? "Skicka meddelande" : "Send message"),
                    theme: "primary",
                  },
                  slots: {
                    body: {},
                  },
                  type: "Button",
                },
              ],
            },
            type: "Section",
          },
        ],
      },
      type: "Form",
    },
    isDefault: true,
    label: "Contact form",
    plan: "Personal",
    type: "ContactForm",
  };
}

function createComponentTemplateContentSection() {
  return {
    component: {
      props: {
        borderWidth: "0px",
        flexDirection: "column",
        gap: "1.25rem",
        margin: "0 auto",
        maxWidth: "720px",
      },
      slots: {
        body: [],
      },
      type: "Section",
    },
    isDefault: true,
    label: "Content section",
    plan: "Personal",
    type: "ContentSection",
  };
}

function createComponentTemplateFeaturesSection() {
  return {
    component: {
      props: {
        borderWidth: "0px",
        flexWrap: "wrap",
        gap: "2rem",
        justifyContent: "space-between",
      },
      slots: {
        body: [],
      },
      type: "Section",
    },
    isDefault: true,
    label: "Features section",
    plan: "Personal",
    type: "FeaturesSection",
  };
}

function createComponentTemplateFullWidthSection() {
  return {
    component: {
      props: {
        borderWidth: "0px",
        padding: "3rem 2rem",
      },
      slots: {
        body: [],
      },
      type: "Section",
    },
    isDefault: true,
    label: "Full width section",
    plan: "Personal",
    type: "FullWidthSection",
  };
}

function createComponentTemplateHero() {
  return {
    component: {
      props: {
        backgroundImage: "linear-gradient(180deg, #f8fafc, #eef2ff)",
        borderColor: "transparent",
        element: "section",
        flexDirection: "column",
      },
      slots: {
        body: [
          {
            props: {
              backgroundImage: "linear-gradient(180deg, #f8fafc, #eef2ff)",
              borderColor: "transparent",
              gap: "2.5rem",
              gridTemplateColumns: { desktop: "1.1fr 0.9fr", mobile: "1fr", tablet: "1.1fr 0.9fr" },
              margin: "auto",
              maxWidth: "1200px",
              padding: "5.5rem 1.5rem",
            },
            slots: {
              body: [
                {
                  props: {
                    alignItems: "flex-start",
                    borderColor: "transparent",
                    flexDirection: "column",
                    gap: "2rem",
                    justifyContent: "flex-start",
                  },
                  slots: {
                    body: [
                      {
                        props: {
                          text: "Lorem ipsum",
                        },
                        slots: {},
                        type: "Badge",
                      },
                      {
                        props: {
                          level: "1",
                          text: "Lorem ipsum dolor sit amet",
                        },
                        slots: {},
                        type: "Heading",
                      },
                      {
                        props: {
                          element: "p",
                          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nibh risus, efficitur ac erat non, mattis aliquam nulla.",
                        },
                        slots: {
                          body: [],
                        },
                        type: "Text",
                      },
                      {
                        props: {
                          text: "Lorem ipsum",
                          theme: "primary",
                        },
                        slots: {
                          body: [],
                        },
                        type: "Button",
                      },
                    ],
                  },
                  type: "Section",
                },
                {
                  props: {
                    alignSelf: "center",
                    alt: "Lorem ipsum",
                    justifySelf: "center",
                    src: "/images/hero.webp",
                  },
                  slots: {},
                  type: "Image",
                },
              ],
            },
            type: "Grid",
          },
        ],
      },
      type: "Section",
    },
    isDefault: true,
    label: "Hero",
    plan: "Personal",
    type: "Hero",
  };
}

function createComponentTemplateHeaderSection() {
  return {
    component: {
      props: {
        backgroundColor: "#f6f6f6",
        border: "1px solid #dddddd",
        borderRadius: "5px",
        boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.12)",
        flexDirection: "column",
        margin: "0px auto 0px auto",
        maxWidth: "1200px",
        overflow: "hidden",
        padding: "0px",
        width: "100%",
      },
      slots: {
        body: [
          {
            props: {
              borderWidth: "0px",
              boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.12)",
              height: "100%",
              padding: "0px",
              position: "relative",
              width: "100%",
            },
            slots: {
              body: [
                {
                  props: {
                    alt: (language) => (language === "sv" ? "Bakgrundsbild" : "Background image"),
                    backgroundColor: "transparent",
                    borderRadius: "0px",
                    borderWidth: "0px",
                    height: "auto",
                    objectFit: "cover",
                    src: "/images/hero.webp",
                    width: "100%",
                  },
                  slots: {},
                  type: "Image",
                },
                {
                  props: {
                    borderWidth: "0px",
                    bottom: "20px",
                    height: "50px",
                    padding: "0px",
                    position: "absolute",
                    right: "20px",
                    width: "50px",
                    zIndex: "2",
                  },
                  slots: {
                    body: [
                      {
                        props: {
                          borderRadius: "50%",
                          boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.12)",
                          boxShadowHover: "0 5px 8px 0 rgba(0, 0, 0, 0.12)",
                          height: "48px",
                          opacity: "0.9",
                          text: "✏️",
                          width: "48px",
                        },
                        slots: {
                          body: [],
                        },
                        type: "Button",
                      },
                    ],
                  },
                  type: "Section",
                },
              ],
            },
            type: "Section",
          },
          {
            props: {
              alignItems: { desktop: "flex-start", mobile: "center", tablet: "flex-start" },
              borderWidth: "0px",
              flexDirection: { desktop: "row", mobile: "column", tablet: "row" },
              justifyContent: "flex-start",
              margin: { desktop: "0px 0px 0px 50px", mobile: "0px auto 0px auto", tablet: "0px 0px 0px 50px" },
              padding: "0px",
              width: "100%",
            },
            slots: {
              body: [
                {
                  props: {
                    alignItems: { desktop: "flex-start", mobile: "center", tablet: "flex-start" },
                    borderWidth: "0px",
                    flexDirection: { desktop: "row", mobile: "column", tablet: "row" },
                    gap: "1rem",
                    justifyContent: "flex-start",
                    minHeight: "calc(192px - 32px + 40px)",
                    padding: "0px",
                    width: "100%",
                  },
                  slots: {
                    body: [
                      {
                        props: {
                          alignItems: { desktop: "flex-start", mobile: "center", tablet: "flex-start" },
                          borderWidth: "0px",
                          flexDirection: { desktop: "row", mobile: "column", tablet: "row" },
                          height: "calc(192px - 32px)",
                          justifyContent: "flex-start",
                          minWidth: "192px",
                          padding: "0px",
                          position: "relative",
                          width: "192px",
                          zIndex: "1",
                        },
                        slots: {
                          body: [
                            {
                              props: {
                                alt: "Image",
                                aspectRatio: "1",
                                backgroundColor: "#ffffff",
                                borderRadius: "50%",
                                boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.12)",
                                height: "192px",
                                maxHeight: "192px",
                                maxWidth: "192px",
                                objectFit: "cover",
                                position: "absolute",
                                right: "0px",
                                src: "/images/logo.webp",
                                top: "-32px",
                                width: "192px",
                              },
                              slots: {
                                body: [],
                              },
                              type: "Image",
                            },
                            {
                              props: {
                                borderWidth: "0px",
                                bottom: "8px",
                                flexDirection: { desktop: "row", mobile: "column", tablet: "row" },
                                height: "50px",
                                padding: "0px",
                                position: "absolute",
                                right: "0px",
                                width: "50px",
                                zIndex: "2",
                              },
                              slots: {
                                body: [
                                  {
                                    props: {
                                      borderRadius: "50%",
                                      boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.12)",
                                      boxShadowHover: "0 5px 8px 0 rgba(0, 0, 0, 0.12)",
                                      height: "48px",
                                      opacity: "0.9",
                                      text: "✏️",
                                      width: "48px",
                                    },
                                    slots: {
                                      body: [],
                                    },
                                    type: "Button",
                                  },
                                ],
                              },
                              type: "Section",
                            },
                          ],
                        },
                        type: "Section",
                      },
                      {
                        props: {
                          alignItems: "flex-start",
                          borderWidth: "0px",
                          justifyContent: "flex-start",
                          padding: "0px",
                          width: "100%",
                        },
                        slots: {
                          body: [
                            {
                              props: {
                                alignItems: { desktop: "flex-start", mobile: "center", tablet: "flex-start" },
                                borderWidth: "0px",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                padding: "1rem",
                                width: "100%",
                              },
                              slots: {
                                body: [
                                  {
                                    props: {
                                      level: "3",
                                      text: "Lorem ipsum",
                                    },
                                    slots: {
                                      body: [],
                                    },
                                    type: "Heading",
                                  },
                                  ,
                                  {
                                    props: {
                                      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
                        type: "Section",
                      },
                    ],
                  },
                  type: "Section",
                },
              ],
            },
            type: "Section",
          },
        ],
      },
      type: "Section",
    },
    isDefault: true,
    label: "Header section",
    plan: "Personal",
    type: "HeaderSection",
  };
}

function createComponentTemplateHighlightedSection() {
  return {
    component: {
      props: {
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        borderWidth: "0px",
        padding: "2rem",
      },
      slots: {
        body: [],
      },
      type: "Section",
    },
    isDefault: true,
    label: "Highlighted section",
    plan: "Personal",
    type: "HighlightedSection",
  };
}

function createComponentTemplateMenuBarSection() {
  return {
    component: {
      props: {
        alignItems: "center",
        borderWidth: "0px",
        element: "nav",
        gap: "1rem",
        justifyContent: "space-between",
        padding: "0.5rem",
      },
      slots: {
        body: [
          {
            props: {
              href: "/",
              text: (language) => (language === "sv" ? "Företag" : "Company"),
            },
            slots: {
              body: [],
            },
            type: "Link",
          },
          {
            props: {
              flexDirection: "row",
              gap: "1rem",
              listStyleType: "none",
              padding: "0px",
              paddingInlineStart: "0px",
            },
            slots: {
              body: [
                {
                  props: {
                    color: "#0f172a",
                    colorHover: "#60a5fa",
                    cursorHover: "pointer",
                    display: "flex",
                  },
                  slots: {
                    body: [
                      {
                        props: {
                          color: "inherit",
                          colorHover: "inherit",
                          href: "/",
                          text: (language) => (language === "sv" ? "Länk 1" : "Link 1"),
                          textDecoration: "inherit",
                          textDecorationHover: "inherit",
                        },
                        slots: {
                          body: [],
                        },
                        type: "Link",
                      },
                    ],
                  },
                  type: "ListItem",
                },
                {
                  props: {
                    color: "#0f172a",
                    colorHover: "#60a5fa",
                    cursorHover: "pointer",
                    display: "flex",
                  },
                  slots: {
                    body: [
                      {
                        props: {
                          color: "inherit",
                          colorHover: "inherit",
                          href: "/",
                          text: (language) => (language === "sv" ? "Länk 2" : "Link 2"),
                          textDecoration: "inherit",
                          textDecorationHover: "inherit",
                        },
                        slots: {
                          body: [],
                        },
                        type: "Link",
                      },
                    ],
                  },
                  type: "ListItem",
                },
                {
                  props: {
                    color: "#0f172a",
                    colorHover: "#60a5fa",
                    cursorHover: "pointer",
                    display: "flex",
                  },
                  slots: {
                    body: [
                      {
                        props: {
                          color: "inherit",
                          colorHover: "inherit",
                          href: "/",
                          text: (language) => (language === "sv" ? "Länk 3" : "Link 3"),
                          textDecoration: "inherit",
                          textDecorationHover: "inherit",
                        },
                        slots: {
                          body: [],
                        },
                        type: "Link",
                      },
                    ],
                  },
                  type: "ListItem",
                },
              ],
            },
            type: "List",
          },
        ],
      },
      type: "Section",
    },
    isDefault: true,
    label: "Menu bar section",
    plan: "Personal",
    type: "MenuBarSection",
  };
}

export function createComponentTemplateSignInForm() {
  const idComponentForm = generateId("form");
  const idComponentHeading = generateId("heading");
  const idComponentLabelEmail = generateId("label");
  const idComponentInputEmail = generateId("input");
  const idComponentLabelPassword = generateId("label");
  const idComponentInputPassword = generateId("input");
  const idComponentButton = generateId("button");
  const idComponentText = generateId("text");

  const idActionUserSignIn = generateId("action");
  const idActionSetStateValueSuccess = generateId("action");
  const idActionSetStateValueFailure = generateId("action");

  const idExpressionUserSignInEmail = generateId("expression");
  const idExpressionUserSignInPassword = generateId("expression");
  const idExpressionSetStateValueSuccessObject = generateId("expression");
  const idExpressionSetStateValueSuccessObjectColor = generateId("expression");
  const idExpressionSetStateValueSuccessObjectMessage = generateId("expression");
  const idExpressionSetStateValueSuccessObjectUser = generateId("expression");
  const idExpressionSetStateValueSuccessObjectIsVisible = generateId("expression");
  const idExpressionSetStateValueFailureObject = generateId("expression");
  const idExpressionSetStateValueFailureObjectColor = generateId("expression");
  const idExpressionSetStateValueFailureObjectMessage = generateId("expression");
  const idExpressionSetStateValueFailureObjectIsVisible = generateId("expression");
  const idExpressionOr = generateId("expression");
  const idExpressionOr0 = generateId("expression");
  const idExpressionOr0L = generateId("expression");
  const idExpressionOr0LV = generateId("expression");
  const idExpressionOr0R = generateId("expression");
  const idExpressionOr1 = generateId("expression");
  const idExpressionOr1V = generateId("expression");
  const idExpressionOr1VV = generateId("expression");
  const idExpressionToString = generateId("expression");
  const idExpressionToStringValue = generateId("expression");
  const idExpressionToBoolean = generateId("expression");
  const idExpressionToBooleanValue = generateId("expression");
  const idExpressionToString2 = generateId("expression");
  const idExpressionToString2Value = generateId("expression");
  const idExpressionNot = generateId("expression");
  const idExpressionNotValue = generateId("expression");

  return {
    component: {
      id: idComponentForm,
      label: "Form",
      props: {
        isVisible: {
          type: "expression",
          expression: {
            id: idExpressionNot,
            type: "not",
            value: {
              id: idExpressionNotValue,
              type: "isUserAuthenticated",
            },
          },
          fallback: true,
        },
        onSubmit: {
          type: "userSignIn",
          config: {
            email: {
              type: "expression",
              expression: {
                id: idExpressionUserSignInEmail,
                type: "prop",
                componentId: idComponentInputEmail,
                prop: "value",
              },
              fallback: "",
            },
            password: {
              type: "expression",
              expression: {
                id: idExpressionUserSignInPassword,
                type: "prop",
                componentId: idComponentInputPassword,
                prop: "value",
              },
              fallback: "",
            },
            id: idActionUserSignIn,
          },
          conditions: [],
          runAfter: [
            {
              type: "setStateValue",
              config: {
                path: "signIn",
                value: {
                  type: "expression",
                  expression: {
                    id: idExpressionSetStateValueSuccessObject,
                    type: "object",
                    fields: {
                      color: {
                        id: idExpressionSetStateValueSuccessObjectColor,
                        type: "literal",
                        value: "var(--pc-semantic-status-success-text)",
                      },
                      message: {
                        id: idExpressionSetStateValueSuccessObjectMessage,
                        type: "state",
                        value: "runtime.signIn.message",
                      },
                      user: {
                        id: idExpressionSetStateValueSuccessObjectUser,
                        type: "state",
                        value: "runtime.signIn.user",
                      },
                      isVisible: {
                        id: idExpressionSetStateValueSuccessObjectIsVisible,
                        type: "literal",
                        value: true,
                      },
                    },
                  },
                  fallback: "",
                },
                id: idActionSetStateValueSuccess,
              },
              conditions: [],
              runAfter: [],
            },
            {
              type: "setStateValue",
              config: {
                path: "signIn",
                value: {
                  type: "expression",
                  expression: {
                    id: idExpressionSetStateValueFailureObject,
                    type: "object",
                    fields: {
                      color: {
                        id: idExpressionSetStateValueFailureObjectColor,
                        type: "literal",
                        value: "var(--pc-semantic-status-danger-text)",
                      },
                      message: {
                        id: idExpressionSetStateValueFailureObjectMessage,
                        type: "state",
                        value: "runtime.signIn.message",
                      },
                      isVisible: {
                        id: idExpressionSetStateValueFailureObjectIsVisible,
                        type: "literal",
                        value: true,
                      },
                    },
                  },
                  fallback: "",
                },
                id: idActionSetStateValueFailure,
              },
              conditions: [],
              runAfter: [],
            },
          ],
        },
        selectors: [],
      },
      type: "Form",
      slots: {
        body: [
          {
            id: idComponentHeading,
            label: "Heading",
            props: {
              text: (language) => (language === "sv" ? "Logga in" : "Sign in"),
              level: "3",
              selectors: [],
            },
            type: "Heading",
            slots: {
              body: [],
            },
          },
          {
            id: idComponentLabelEmail,
            label: "Label",
            props: {
              text: (language) => (language === "sv" ? "E-post" : "E-mail"),
              htmlFor: "sign-in-e-mail",
              selectors: [],
            },
            type: "Label",
            slots: {},
          },
          {
            id: idComponentInputEmail,
            label: "Input",
            props: {
              value: "",
              placeholder: (language) => (language === "sv" ? "sven.svensson@exempel.se" : "john.doe@example.com"),
              id: "sign-in-e-mail",
              name: "sign-in-e-mail",
              disabled: false,
              readOnly: false,
              spellCheck: "",
              type: "email",
              selectors: [],
            },
            type: "Input",
            slots: {},
          },
          {
            id: idComponentLabelPassword,
            label: "Label",
            props: {
              text: (language) => (language === "sv" ? "Lösenord" : "Password"),
              htmlFor: "sign-in-password",
              selectors: [],
            },
            type: "Label",
            slots: {},
          },
          {
            id: idComponentInputPassword,
            label: "Input",
            props: {
              value: "",
              placeholder: "",
              id: "sign-in-password",
              name: "sign-in-password",
              disabled: false,
              readOnly: false,
              spellCheck: "",
              type: "password",
              selectors: [],
            },
            type: "Input",
            slots: {},
          },
          {
            id: idComponentButton,
            label: "Button",
            props: {
              text: (language) => (language === "sv" ? "Logga in" : "Sign in"),
              href: "",
              id: "",
              type: "submit",
              theme: "primary",
              onClick: "",
              disabled: {
                type: "expression",
                expression: {
                  id: idExpressionOr,
                  type: "or",
                  values: [
                    {
                      id: idExpressionOr0,
                      type: "lessThan",
                      left: {
                        id: idExpressionOr0L,
                        type: "stringLength",
                        value: {
                          id: idExpressionOr0LV,
                          type: "prop",
                          componentId: idComponentInputPassword,
                          prop: "value",
                        },
                      },
                      right: {
                        id: idExpressionOr0R,
                        type: "literal",
                        value: 6,
                      },
                    },
                    {
                      id: idExpressionOr1,
                      type: "not",
                      value: {
                        id: idExpressionOr1V,
                        type: "isEmail",
                        value: {
                          id: idExpressionOr1VV,
                          type: "prop",
                          componentId: idComponentInputEmail,
                          prop: "value",
                        },
                      },
                    },
                  ],
                },
                fallback: false,
              },
              target: "",
              rel: "",
              isVisible: true,
              selectors: [],
              alignSelf: "flex-end",
            },
            type: "Button",
            slots: {
              body: [],
            },
          },
          {
            id: idComponentText,
            label: "Text",
            props: {
              text: {
                type: "expression",
                expression: {
                  id: idExpressionToString,
                  type: "toString",
                  value: {
                    id: idExpressionToStringValue,
                    type: "state",
                    value: "signIn.message",
                  },
                },
                fallback: "",
              },
              title: "",
              element: "p",
              isVisible: {
                type: "expression",
                expression: {
                  id: idExpressionToBoolean,
                  type: "toBoolean",
                  value: {
                    id: idExpressionToBooleanValue,
                    type: "state",
                    value: "signIn.isVisible",
                  },
                },
                fallback: true,
              },
              selectors: [],
              color: {
                type: "expression",
                expression: {
                  id: idExpressionToString2,
                  type: "toString",
                  value: {
                    id: idExpressionToString2Value,
                    type: "state",
                    value: "signIn.color",
                  },
                },
                fallback: "inherit",
              },
            },
            type: "Text",
            slots: {
              body: [],
            },
          },
        ],
      },
    },
    isDefault: true,
    label: "Sign in form",
    plan: "Pro Gold",
    type: "SignInForm",
  };
}

export function createComponentTemplateSignOutForm() {
  const idComponentForm = generateId("form");
  const idComponentButton = generateId("button");
  const idComponentText = generateId("text");
  const idComponentTextName = generateId("text");

  const idActionUserSignOut = generateId("action");

  const idExpressionIsVisible = generateId("expression");
  const idExpressionText = generateId("expression");

  return {
    component: {
      id: idComponentForm,
      label: "Form",
      props: {
        onSubmit: {
          type: "userSignOut",
          config: {
            id: idActionUserSignOut,
          },
          conditions: [],
          runAfter: [],
        },
        isVisible: {
          type: "expression",
          expression: {
            id: idExpressionIsVisible,
            type: "isUserAuthenticated",
          },
          fallback: true,
        },
        selectors: [],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      type: "Form",
      slots: {
        body: [
          {
            id: idComponentText,
            label: "Text",
            props: {
              text: (language) => (language === "sv" ? "Inloggad som: " : "Signed in as: "),
              title: "",
              element: "p",
              isVisible: true,
              selectors: [],
            },
            type: "Text",
            slots: {
              body: [
                {
                  id: idComponentTextName,
                  label: "Text",
                  props: {
                    text: {
                      type: "expression",
                      expression: {
                        id: idExpressionText,
                        type: "userName",
                      },
                      fallback: "",
                    },
                    title: "",
                    element: "span",
                    isVisible: true,
                    selectors: [],
                    fontWeight: "600",
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
            id: idComponentButton,
            label: "Button",
            props: {
              text: (language) => (language === "sv" ? "Logga ut" : "Sign out"),
              href: "",
              id: "",
              type: "submit",
              theme: "danger",
              onClick: "",
              disabled: false,
              target: "",
              rel: "",
              isVisible: true,
              selectors: [],
            },
            type: "Button",
            slots: {
              body: [],
            },
          },
        ],
      },
    },
    isDefault: true,
    label: "Sign out form",
    plan: "Pro Gold",
    type: "SignOutForm",
  };
}

export function createComponentTemplateSignUpForm() {
  const idComponentForm = generateId("form");
  const idComponentHeading = generateId("heading");
  const idComponentLabelEmail = generateId("label");
  const idComponentInputEmail = generateId("input");
  const idComponentLabelPassword = generateId("label");
  const idComponentInputPassword = generateId("input");
  const idComponentLabelPasswordConfirm = generateId("label");
  const idComponentInputPasswordConfirm = generateId("input");
  const idComponentLabelName = generateId("label");
  const idComponentInputName = generateId("input");
  const idComponentButton = generateId("button");
  const idComponentText = generateId("text");

  const idActionUserSignUp = generateId("action");
  const idActionSetStateValueSuccess = generateId("action");
  const idActionSetStateValueFailure = generateId("action");

  const idExpressionUserSignUpEmail = generateId("expression");
  const idExpressionUserSignUpPassword = generateId("expression");
  const idExpressionUserSignUpName = generateId("expression");
  const idExpressionSetStateValueSuccessObject = generateId("expression");
  const idExpressionSetStateValueSuccessObjectColor = generateId("expression");
  const idExpressionSetStateValueSuccessObjectMessage = generateId("expression");
  const idExpressionSetStateValueSuccessObjectUser = generateId("expression");
  const idExpressionSetStateValueSuccessObjectIsVisible = generateId("expression");
  const idExpressionSetStateValueFailureObject = generateId("expression");
  const idExpressionSetStateValueFailureObjectColor = generateId("expression");
  const idExpressionSetStateValueFailureObjectMessage = generateId("expression");
  const idExpressionSetStateValueFailureObjectIsVisible = generateId("expression");
  const idExpressionOr = generateId("expression");
  const idExpressionOr0 = generateId("expression");
  const idExpressionOr0L = generateId("expression");
  const idExpressionOr0LV = generateId("expression");
  const idExpressionOr0R = generateId("expression");
  const idExpressionOr1 = generateId("expression");
  const idExpressionOr1L = generateId("expression");
  const idExpressionOr1LV = generateId("expression");
  const idExpressionOr1R = generateId("expression");
  const idExpressionOr2 = generateId("expression");
  const idExpressionOr2V = generateId("expression");
  const idExpressionOr2VL = generateId("expression");
  const idExpressionOr2VR = generateId("expression");
  const idExpressionOr3 = generateId("expression");
  const idExpressionOr3V = generateId("expression");
  const idExpressionOr3VV = generateId("expression");
  const idExpressionToString = generateId("expression");
  const idExpressionToStringValue = generateId("expression");
  const idExpressionToBoolean = generateId("expression");
  const idExpressionToBooleanValue = generateId("expression");
  const idExpressionToString2 = generateId("expression");
  const idExpressionToString2Value = generateId("expression");
  const idExpressionNot = generateId("expression");
  const idExpressionNotValue = generateId("expression");

  return {
    component: {
      id: idComponentForm,
      label: "Form",
      props: {
        isVisible: {
          type: "expression",
          expression: {
            id: idExpressionNot,
            type: "not",
            value: {
              id: idExpressionNotValue,
              type: "isUserAuthenticated",
            },
          },
          fallback: true,
        },
        onSubmit: {
          type: "userSignUp",
          config: {
            email: {
              type: "expression",
              expression: {
                id: idExpressionUserSignUpEmail,
                type: "prop",
                componentId: idComponentInputEmail,
                prop: "value",
              },
              fallback: "",
            },
            password: {
              type: "expression",
              expression: {
                id: idExpressionUserSignUpPassword,
                type: "prop",
                componentId: idComponentInputPassword,
                prop: "value",
              },
              fallback: "",
            },
            name: {
              type: "expression",
              expression: {
                id: idExpressionUserSignUpName,
                type: "prop",
                componentId: idComponentInputName,
                prop: "value",
              },
              fallback: "",
            },
            code: "",
            id: idActionUserSignUp,
          },
          conditions: [],
          runAfter: [
            {
              type: "setStateValue",
              config: {
                path: "signUp",
                value: {
                  type: "expression",
                  expression: {
                    id: idExpressionSetStateValueSuccessObject,
                    type: "object",
                    fields: {
                      color: {
                        id: idExpressionSetStateValueSuccessObjectColor,
                        type: "literal",
                        value: "var(--pc-semantic-status-success-text)",
                      },
                      message: {
                        id: idExpressionSetStateValueSuccessObjectMessage,
                        type: "state",
                        value: "runtime.signUp.message",
                      },
                      user: {
                        id: idExpressionSetStateValueSuccessObjectUser,
                        type: "state",
                        value: "runtime.signUp.user",
                      },
                      isVisible: {
                        id: idExpressionSetStateValueSuccessObjectIsVisible,
                        type: "literal",
                        value: true,
                      },
                    },
                  },
                  fallback: "",
                },
                id: idActionSetStateValueSuccess,
              },
              conditions: [],
              runAfter: [],
            },
            {
              type: "setStateValue",
              config: {
                path: "signUp",
                value: {
                  type: "expression",
                  expression: {
                    id: idExpressionSetStateValueFailureObject,
                    type: "object",
                    fields: {
                      color: {
                        id: idExpressionSetStateValueFailureObjectColor,
                        type: "literal",
                        value: "var(--pc-semantic-status-danger-text)",
                      },
                      message: {
                        id: idExpressionSetStateValueFailureObjectMessage,
                        type: "state",
                        value: "runtime.signUp.message",
                      },
                      isVisible: {
                        id: idExpressionSetStateValueFailureObjectIsVisible,
                        type: "literal",
                        value: true,
                      },
                    },
                  },
                  fallback: "",
                },
                id: idActionSetStateValueFailure,
              },
              conditions: [],
              runAfter: [],
            },
          ],
        },
        selectors: [],
      },
      type: "Form",
      slots: {
        body: [
          {
            id: idComponentHeading,
            label: "Heading",
            props: {
              text: (language) => (language === "sv" ? "Registrera" : "Sign up"),
              level: "3",
              selectors: [],
            },
            type: "Heading",
            slots: {
              body: [],
            },
          },
          {
            id: idComponentLabelName,
            label: "Label",
            props: {
              text: (language) => (language === "sv" ? "Namn" : "Name"),
              htmlFor: "sign-up-name",
              selectors: [],
            },
            type: "Label",
            slots: {},
          },
          {
            id: idComponentInputName,
            label: "Input",
            props: {
              value: "",
              placeholder: (language) => (language === "sv" ? "Sven Svensson" : "John Doe"),
              id: "sign-up-name",
              name: "sign-up-name",
              disabled: false,
              readOnly: false,
              spellCheck: "",
              type: "text",
              selectors: [],
            },
            type: "Input",
            slots: {},
          },
          {
            id: idComponentLabelEmail,
            label: "Label",
            props: {
              text: (language) => (language === "sv" ? "E-post" : "E-mail"),
              htmlFor: "sign-up-e-mail",
              selectors: [],
            },
            type: "Label",
            slots: {},
          },
          {
            id: idComponentInputEmail,
            label: "Input",
            props: {
              value: "",
              placeholder: (language) => (language === "sv" ? "sven.svensson@exempel.se" : "john.doe@example.com"),
              id: "sign-up-e-mail",
              name: "sign-up-e-mail",
              disabled: false,
              readOnly: false,
              spellCheck: "",
              type: "email",
              selectors: [],
            },
            type: "Input",
            slots: {},
          },
          {
            id: idComponentLabelPassword,
            label: "Label",
            props: {
              text: (language) => (language === "sv" ? "Lösenord" : "Password"),
              htmlFor: "sign-up-password",
              selectors: [],
            },
            type: "Label",
            slots: {},
          },
          {
            id: idComponentInputPassword,
            label: "Input",
            props: {
              value: "",
              placeholder: "",
              id: "sign-up-password",
              name: "sign-up-password",
              disabled: false,
              readOnly: false,
              spellCheck: "",
              type: "password",
              selectors: [],
            },
            type: "Input",
            slots: {},
          },
          {
            id: idComponentLabelPasswordConfirm,
            label: "Label",
            props: {
              text: (language) => (language === "sv" ? "Lösenord (bekräfta)" : "Password (confirm)"),
              htmlFor: "sign-up-password-confirm",
              selectors: [],
            },
            type: "Label",
            slots: {},
          },
          {
            id: idComponentInputPasswordConfirm,
            label: "Input",
            props: {
              value: "",
              placeholder: "",
              id: "sign-up-password-confirm",
              name: "sign-up-password-confirm",
              disabled: false,
              readOnly: false,
              spellCheck: "",
              type: "password",
              selectors: [],
            },
            type: "Input",
            slots: {},
          },
          {
            id: idComponentButton,
            label: "Button",
            props: {
              text: (language) => (language === "sv" ? "Registrera" : "Sign up"),
              href: "",
              id: "",
              type: "submit",
              theme: "primary",
              onClick: "",
              disabled: {
                type: "expression",
                expression: {
                  id: idExpressionOr,
                  type: "or",
                  values: [
                    {
                      id: idExpressionOr0,
                      type: "equals",
                      left: {
                        id: idExpressionOr0L,
                        type: "trim",
                        value: {
                          id: idExpressionOr0LV,
                          type: "prop",
                          componentId: idComponentInputName,
                          prop: "value",
                        },
                      },
                      right: {
                        id: idExpressionOr0R,
                        type: "literal",
                        value: "",
                      },
                    },
                    {
                      id: idExpressionOr1,
                      type: "lessThan",
                      left: {
                        id: idExpressionOr1L,
                        type: "stringLength",
                        value: {
                          id: idExpressionOr1LV,
                          type: "prop",
                          componentId: idComponentInputPassword,
                          prop: "value",
                        },
                      },
                      right: {
                        id: idExpressionOr1R,
                        type: "literal",
                        value: 6,
                      },
                    },
                    {
                      id: idExpressionOr2,
                      type: "not",
                      value: {
                        id: idExpressionOr2V,
                        type: "equals",
                        left: {
                          id: idExpressionOr2VL,
                          type: "prop",
                          componentId: idComponentInputPassword,
                          prop: "value",
                        },
                        right: {
                          id: idExpressionOr2VR,
                          type: "prop",
                          componentId: idComponentInputPasswordConfirm,
                          prop: "value",
                        },
                      },
                    },
                    {
                      id: idExpressionOr3,
                      type: "not",
                      value: {
                        id: idExpressionOr3V,
                        type: "isEmail",
                        value: {
                          id: idExpressionOr3VV,
                          type: "prop",
                          componentId: idComponentInputEmail,
                          prop: "value",
                        },
                      },
                    },
                  ],
                },
                fallback: false,
              },
              target: "",
              rel: "",
              isVisible: true,
              selectors: [],
              alignSelf: "flex-end",
            },
            type: "Button",
            slots: {
              body: [],
            },
          },
          {
            id: idComponentText,
            label: "Text",
            props: {
              text: {
                type: "expression",
                expression: {
                  id: idExpressionToString,
                  type: "toString",
                  value: {
                    id: idExpressionToStringValue,
                    type: "state",
                    value: "signUp.message",
                  },
                },
                fallback: "",
              },
              title: "",
              element: "p",
              isVisible: {
                type: "expression",
                expression: {
                  id: idExpressionToBoolean,
                  type: "toBoolean",
                  value: {
                    id: idExpressionToBooleanValue,
                    type: "state",
                    value: "signUp.isVisible",
                  },
                },
                fallback: true,
              },
              selectors: [],
              color: {
                type: "expression",
                expression: {
                  id: idExpressionToString2,
                  type: "toString",
                  value: {
                    id: idExpressionToString2Value,
                    type: "state",
                    value: "signUp.color",
                  },
                },
                fallback: "inherit",
              },
            },
            type: "Text",
            slots: {
              body: [],
            },
          },
        ],
      },
    },
    isDefault: true,
    label: "Sign up form",
    plan: "Pro Gold",
    type: "SignUpForm",
  };
}
