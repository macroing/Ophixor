// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export const ACTIONS = [
  {
    type: "print",
    config: {
      id: "action-bcab5c29-9d75-422b-97c1-e00045a243b3",
      data: {
        my_field: {
          type: "expression",
          expression: {
            id: "expression-25ca2d46-7e29-4fa7-b558-c28da3c9c520",
            type: "prop",
            componentId: "textarea-86d95b30-142f-48da-aa9d-aa03cea4db4e",
            prop: "value",
          },
          fallback: "",
        },
      },
    },
    conditions: [],
    runAfter: [
      {
        type: "updateComponent",
        config: {
          id: "action-b394fb0d-9173-4ab6-9490-383d44a2983b",
          componentId: "alert-068a7943-24cd-418e-b409-8a4a4353d710",
          data: {
            isVisible: {
              type: "expression",
              expression: {
                id: "expression-3e051051-57bf-421d-9749-e8676d3e41cb",
                type: "literal",
                value: true,
              },
              fallback: "",
            },
          },
        },
        conditions: [],
        runAfter: [],
      },
      {
        type: "wait",
        config: {
          id: "action-be707763-b7a4-4602-9622-7d6ab89a293e",
          delay: 2000,
        },
        conditions: [],
        runAfter: [
          {
            type: "updateComponent",
            config: {
              id: "action-a12c90e3-f543-4b43-8d35-6aaea84a2bbe",
              componentId: "alert-068a7943-24cd-418e-b409-8a4a4353d710",
              data: {
                isVisible: {
                  type: "expression",
                  expression: {
                    id: "expression-81fd9ab8-3aa6-4d3b-bfe4-ef5a4c4654f8",
                    type: "literal",
                    value: false,
                  },
                  fallback: "",
                },
              },
            },
            conditions: [],
            runAfter: [],
          },
        ],
      },
    ],
  },
];
