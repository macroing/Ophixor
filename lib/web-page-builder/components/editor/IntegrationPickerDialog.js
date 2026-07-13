// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { DarkDialog } from "../dialog/Dialog";
import { DarkButton } from "../button/Button";
import Heading from "../heading/Heading";

export default function IntegrationPickerDialog(props) {
  const integrations = props.integrations;
  const isOpen = props.isOpen;
  const onClose = props.onClose;
  const onSelect = props.onSelect;
  const setIntegrations = props.setIntegrations;
  const website = props.website;

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    async function load() {
      try {
        const { data } = await axios.get("/api/website-integration?websiteId=" + website._id.toString());

        if (data.websiteIntegrations) {
          setIntegrations(data.websiteIntegrations);
        } else {
          setIntegrations([]);
        }
      } catch (error) {
        setIntegrations([]);
      }
    }

    load();
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const selected = integrations.find((i) => i._id === selectedId);

  return (
    <DarkDialog>
      {{
        slots: {
          header: [<Heading key="1" level="5" text="Select Integration" />],
          body: [
            <div key="1" style={{ display: "grid", gap: "0.5rem" }}>
              {integrations.map((integration) => (
                <div
                  key={integration._id}
                  onClick={() => setSelectedId(integration._id)}
                  style={{
                    border: selectedId === integration._id ? "1px solid #2563eb" : "1px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: "0.75rem",
                  }}
                >
                  <strong>{integration.name}</strong>
                  <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>{integration.description}</div>
                </div>
              ))}
            </div>,
          ],
          footer: [
            <DarkButton key="cancel" onClick={onClose}>
              Cancel
            </DarkButton>,
            <DarkButton
              key="select"
              theme="primary"
              disabled={!selected}
              onClick={() => {
                onSelect(selected);
              }}
            >
              Select
            </DarkButton>,
          ],
        },
      }}
    </DarkDialog>
  );
}
