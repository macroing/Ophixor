// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Dialog from "@/lib/web-page-builder/components/dialog/Dialog";
import Form from "@/lib/web-page-builder/components/form/Form";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Input from "@/lib/web-page-builder/components/input/Input";
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Select from "@/lib/web-page-builder/components/select/Select";
import Switch from "@/lib/web-page-builder/components/switch/Switch";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useVisitedPlatformUser } from "@/context/visited-platform-user";
import { PLANS } from "@/definitions/plan-definitions";

import platform from "@/definitions/platform-admin.json" with { type: "json" };

export default function PlatformUserPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const dialogRef = useRef();

  const { setVisitedPlatformUser, visitedPlatformUser } = useVisitedPlatformUser();

  const router = useRouter();

  const [activateMessage, setActivateMessage] = useState("");
  const [activateMessageStatus, setActivateMessageStatus] = useState("");
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(visitedPlatformUser?.isPlatformAdmin || false);
  const [isShowingDialog, setIsShowingDialog] = useState(false);
  const [isSubmittingActivate, setIsSubmittingActivate] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  const [isSubmittingPlatformAdmin, setIsSubmittingPlatformAdmin] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageStatus, setPasswordMessageStatus] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordNewConfirm, setPasswordNewConfirm] = useState("");
  const [plan, setPlan] = useState(visitedPlatformUser?.plan || "");
  const [planMessage, setPlanMessage] = useState("");
  const [planMessageStatus, setPlanMessageStatus] = useState("");
  const [platformAdminMessage, setPlatformAdminMessage] = useState("");
  const [platformAdminMessageStatus, setPlatformAdminMessageStatus] = useState("");

  const isPasswordFormDisabled = !(passwordNew.trim().length >= 6 && passwordNew.trim() === passwordNewConfirm.trim());
  const isPlanFormDisabled = plan === visitedPlatformUser?.plan;
  const isPlatformAdminFormDisabled = isPlatformAdmin === visitedPlatformUser?.isPlatformAdmin;

  const isSelf = visitedPlatformUser?._id?.toString() === platformUser?._id?.toString();

  function onClickCancel(e) {
    setIsShowingDialog(false);
  }

  async function onClickDelete(e) {
    try {
      setIsShowingDialog(false);

      const { data } = await axios.delete("/api/platform-user/" + visitedPlatformUser?._id?.toString());

      if (isSelf) {
        signOut({ callbackUrl: "/" });
      } else {
        router.push("/admin/users");
      }
    } catch (error) {}
  }

  function onSubmitDelete(e) {
    e.preventDefault();

    setIsShowingDialog(true);
  }

  async function onSubmitActivate(e) {
    try {
      e.preventDefault();

      setIsSubmittingActivate(true);

      const { data } = await axios.put("/api/platform-user/" + visitedPlatformUser?._id?.toString(), { activate: true });

      if (data.platformUser) {
        setVisitedPlatformUser(data.platformUser);
      }

      setActivateMessage(data.message || "");
      setActivateMessageStatus("success");
    } catch (error) {
      setActivateMessage(error?.response?.data?.message || "");
      setActivateMessageStatus("failure");
    } finally {
      setIsSubmittingActivate(false);
    }
  }

  async function onSubmitUpdatePassword(e) {
    try {
      e.preventDefault();

      setIsSubmittingPassword(true);

      const { data } = await axios.put("/api/platform-user/" + visitedPlatformUser?._id?.toString(), { passwordNew });

      if (data.platformUser) {
        setVisitedPlatformUser(data.platformUser);
      }

      setPasswordNew("");
      setPasswordNewConfirm("");

      setPasswordMessage(data.message || "");
      setPasswordMessageStatus("success");
    } catch (error) {
      setPasswordMessage(error?.response?.data?.message || "");
      setPasswordMessageStatus("failure");
    } finally {
      setIsSubmittingPassword(false);
    }
  }

  async function onSubmitUpdatePlan(e) {
    try {
      e.preventDefault();

      setIsSubmittingPlan(true);

      const { data } = await axios.put("/api/platform-user/" + visitedPlatformUser?._id?.toString(), { plan });

      if (data.platformUser) {
        setVisitedPlatformUser(data.platformUser);
      }

      setPlanMessage(data.message || "");
      setPlanMessageStatus("success");
    } catch (error) {
      setPlanMessage(error?.response?.data?.message || "");
      setPlanMessageStatus("failure");
    } finally {
      setIsSubmittingPlan(false);
    }
  }

  async function onSubmitUpdatePlatformAdmin(e) {
    try {
      e.preventDefault();

      setIsSubmittingPlatformAdmin(true);

      const { data } = await axios.put("/api/platform-user/" + visitedPlatformUser?._id?.toString(), { isPlatformAdmin });

      if (data.platformUser) {
        setVisitedPlatformUser(data.platformUser);
      }

      setPlatformAdminMessage(data.message || "");
      setPlatformAdminMessageStatus("success");

      if (isSelf && data.platformUser && !data.platformUser.isPlatformAdmin) {
        router.push("/");
      }
    } catch (error) {
      setPlatformAdminMessage(error?.response?.data?.message || "");
      setPlatformAdminMessageStatus("failure");
    } finally {
      setIsSubmittingPlatformAdmin(false);
    }
  }

  useEffect(() => {
    if (isShowingDialog) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [isShowingDialog]);

  useEffect(() => {
    setIsPlatformAdmin(visitedPlatformUser?.isPlatformAdmin || false);
    setPlan(visitedPlatformUser?.plan || "");
  }, [visitedPlatformUser]);

  return (
    <Section flexDirection="column" gap="2rem" padding="2rem">
      <Section alignItems="center" flexDirection="row" justifyContent="space-between" padding="0px">
        <Heading color="#1e293b" level="3" text={platform.admin.user.title[language]} />
        <Text color="#64748b" text={visitedPlatformUser?.email || ""} />
      </Section>
      <Section flexDirection="column" gap="2rem" padding="0px" width="100%">
        <Card element="form" gapBody="1rem" maxWidth="400px" onSubmit={onSubmitActivate}>
          {{
            slots: {
              header: [],
              body: [
                <Heading color="#1e293b" level="4" key="1" text={platform.admin.user.accountInformation[language]} />,
                <Section flexDirection="column" gap="0.5rem" key="2" overflow="hidden" padding="0px">
                  <Text color="#64748b" text={platform.admin.user.email[language]} />
                  <Text color="#1e293b" overflowWrap="anywhere" text={visitedPlatformUser?.email || ""} />
                  <Text color="#64748b" text={platform.admin.user.administrator[language]} />
                  <Text color="#1e293b" text={visitedPlatformUser?.isPlatformAdmin ? platform.admin.user.yes[language] : platform.admin.user.no[language]} />
                  <Text color="#64748b" text={platform.admin.user.plan[language]} />
                  <Text color="#1e293b" text={visitedPlatformUser?.plan || ""} />
                  <Text color="#64748b" text={platform.admin.user.createdAt[language]} />
                  <Text color="#1e293b" text={new Date(visitedPlatformUser.createdAt).toLocaleString("sv-SE")} />
                  <Text color="#64748b" text={platform.admin.user.updatedAt[language]} />
                  <Text color="#1e293b" text={new Date(visitedPlatformUser.updatedAt).toLocaleString("sv-SE")} />
                  {visitedPlatformUser?.activatedAt && (
                    <>
                      <Text color="#64748b" text={platform.admin.user.activatedAt[language]} />
                      <Text color="#1e293b" text={new Date(visitedPlatformUser.activatedAt).toLocaleString("sv-SE")} />
                    </>
                  )}
                  {activateMessage && (
                    <Alert theme={activateMessageStatus === "failure" ? "error" : activateMessageStatus === "success" ? "success" : undefined}>
                      <Text text={activateMessage} textAlign="center" />
                    </Alert>
                  )}
                  {!visitedPlatformUser?.activatedAt && <Button disabled={isSubmittingActivate} text={platform.admin.user.activate[language]} theme="primary" />}
                </Section>,
              ],
              footer: [],
            },
          }}
        </Card>
        <Card gapBody="1rem" maxWidth="400px">
          {{
            slots: {
              header: [],
              body: [
                <Heading color="#1e293b" level="4" key="1" text={platform.admin.user.changePasswordTitle[language]} />,
                <Form backgroundColor="transparent" borderColor="transparent" boxShadow="none" gap="1rem" key="2" onSubmit={onSubmitUpdatePassword} padding="0px">
                  <Section flexDirection="column" gap="0.5rem" padding="0px">
                    <Label htmlFor="new-password" text={platform.admin.user.newPassword[language]} />
                    <Input id="new-password" onChange={(e) => setPasswordNew(e.target.value)} type="password" value={passwordNew} />
                  </Section>
                  <Section flexDirection="column" gap="0.5rem" padding="0px">
                    <Label htmlFor="confirm-new-password" text={platform.admin.user.newPasswordConfirm[language]} />
                    <Input id="confirm-new-password" onChange={(e) => setPasswordNewConfirm(e.target.value)} type="password" value={passwordNewConfirm} />
                  </Section>
                  {passwordMessage && (
                    <Alert theme={passwordMessageStatus === "failure" ? "error" : passwordMessageStatus === "success" ? "success" : undefined}>
                      <Text text={passwordMessage} textAlign="center" />
                    </Alert>
                  )}
                  <Button disabled={isPasswordFormDisabled || isSubmittingPassword} text={platform.admin.user.changePasswordSubmit[language]} theme="primary" />
                </Form>,
              ],
              footer: [],
            },
          }}
        </Card>
        <Card gapBody="1rem" maxWidth="400px">
          {{
            slots: {
              header: [],
              body: [
                <Heading color="#1e293b" level="4" key="1" text={platform.admin.user.changeAdministratorTitle[language]} />,
                <Form backgroundColor="transparent" borderColor="transparent" boxShadow="none" gap="1rem" key="2" onSubmit={onSubmitUpdatePlatformAdmin} padding="0px">
                  <Section flexDirection="column" gap="0.5rem" padding="0px">
                    <Label htmlFor="administrator" text={platform.admin.user.administrator[language]} />
                    <Switch checked={isPlatformAdmin} id="administrator" onChange={(e) => setIsPlatformAdmin(e.target.checked)} />
                  </Section>
                  {platformAdminMessage && (
                    <Alert theme={platformAdminMessageStatus === "failure" ? "error" : platformAdminMessageStatus === "success" ? "success" : undefined}>
                      <Text text={platformAdminMessage} textAlign="center" />
                    </Alert>
                  )}
                  <Button disabled={isPlatformAdminFormDisabled || isSubmittingPlatformAdmin} text={platform.admin.user.changeAdministratorSubmit[language]} theme="primary" />
                </Form>,
              ],
              footer: [],
            },
          }}
        </Card>
        <Card gapBody="1rem" maxWidth="400px">
          {{
            slots: {
              header: [],
              body: [
                <Heading color="#1e293b" level="4" key="1" text={platform.admin.user.changePlanTitle[language]} />,
                <Form backgroundColor="transparent" borderColor="transparent" boxShadow="none" gap="1rem" key="2" onSubmit={onSubmitUpdatePlan} padding="0px">
                  <Section flexDirection="column" gap="0.5rem" padding="0px">
                    <Label htmlFor="plan" text={platform.admin.user.plan[language]} />
                    <Select id="plan" onChange={(e) => setPlan(e.target.value)} options={PLANS.map((plan) => ({ label: plan, value: plan }))} value={plan} />
                  </Section>
                  {planMessage && (
                    <Alert theme={planMessageStatus === "failure" ? "error" : planMessageStatus === "success" ? "success" : undefined}>
                      <Text text={planMessage} textAlign="center" />
                    </Alert>
                  )}
                  <Button disabled={isPlanFormDisabled || isSubmittingPlan} text={platform.admin.user.changePlanSubmit[language]} theme="primary" />
                </Form>,
              ],
              footer: [],
            },
          }}
        </Card>
        <Card borderColor="#fecaca" borderColorHover="#fecaca" element="form" gapBody="1rem" maxWidth="400px" onSubmit={onSubmitDelete}>
          {{
            slots: {
              header: [],
              body: [<Heading color="#b91c1c" key="1" level="4" text={platform.admin.user.deleteAccountTitle[language]} />, <Text color="#b91c1c" fontSize="1rem" key="2" text={isSelf ? platform.admin.user.deleteAccountText[language] : platform.admin.user.deleteAccountTextAlternative[language]} />, <Button disabled={isShowingDialog} key="3" text={platform.admin.user.deleteAccountButton[language]} theme="danger" />],
              footer: [],
            },
          }}
        </Card>
        {isShowingDialog && (
          <Dialog dialogRef={dialogRef}>
            {{
              slots: {
                header: [<Heading color="#0f172a" key="1" level="5" text={platform.admin.user.deleteAccountDialogTitle[language]} />],
                body: [<Text color="#1e293b" key="1" text={isSelf ? platform.admin.user.deleteAccountDialogText[language] : platform.admin.user.deleteAccountDialogTextAlternative[language]} />],
                footer: [
                  <Button key="1" onClick={onClickCancel}>
                    {platform.admin.user.deleteAccountDialogCancel[language]}
                  </Button>,
                  <Button key="2" onClick={onClickDelete} theme="danger">
                    {platform.admin.user.deleteAccountDialogDelete[language]}
                  </Button>,
                ],
              },
            }}
          </Dialog>
        )}
      </Section>
    </Section>
  );
}
