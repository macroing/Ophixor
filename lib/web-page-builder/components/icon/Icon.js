// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faAdd, faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faArrowRight, faBackward, faBolt, faBracketsCurly, faBrowser, faBug, faCalculator, faCancel, faCheck, faChevronCircleLeft, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faCircle, faClock, faClockRotateLeft, faClose, faCloud, faCode, faCodeBranch, faCog, faCookie, faCopy, faCrop, faCubes, faDashboard, faDatabase, faDiagramProject, faDivide, faDown, faEdit, faExchange, faEye, faFileContract, faFileExport, faFileHtml, faFileLines, faFont, faForward, faGauge, faGaugeHigh, faGlobe, faHandshake, faImage, faImages, faLayerGroup, faLinkSlash, faMobileScreen, faMultiply, faObjectGroup, faPage, faPalette, faPaste, faPlus, faPuzzlePiece, faQuestion, faRandom, faRedo, faRectangle, faRefresh, faRightLeft, faRocketLaunch, faSave, faServer, faShapes, faShield, faSignIn, faSignOut, faSparkles, faSquareRoot, faSquareRootVariable, faSubtract, faTable, faTableCellsLarge, faTableLayout, faTowerBroadcast, faTrash, faTriangleExclamation, faUndo, faUp, faUpload, faUser, faUserGear, faUsers, faWrench } from "@fortawesome/pro-solid-svg-icons";

import { classNames } from "../runtime/style/classNames";
import { createIconSchema } from "./IconSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Icon.module.css";

const SCHEMA = createIconSchema();

export default function Icon({ componentId, editor, icon, isVisible, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "icon", true);
  const editorProps = getEditorProps(editor, true);

  const safeIcon = getIcon(icon);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <span className={classNames(styles.icon, styles.icon_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </span>
      );
    }

    return null;
  }

  return <FontAwesomeIcon className={classNames(styles.icon, ...editorClasses)} data-pc-id={componentId} icon={safeIcon} style={style} {...editorProps} />;
}

function getIcon(icon) {
  if (typeof icon === "string") {
    switch (icon) {
      case "fa-add":
        return faAdd;
      case "fa-align-center":
        return faAlignCenter;
      case "fa-align-justify":
        return faAlignJustify;
      case "fa-align-left":
        return faAlignLeft;
      case "fa-align-right":
        return faAlignRight;
      case "fa-arrow-right":
        return faArrowRight;
      case "fa-backward":
        return faBackward;
      case "fa-bolt":
        return faBolt;
      case "fa-brackets-curly":
        return faBracketsCurly;
      case "fa-browser":
        return faBrowser;
      case "fa-bug":
        return faBug;
      case "fa-calculator":
        return faCalculator;
      case "fa-cancel":
        return faCancel;
      case "fa-check":
        return faCheck;
      case "fa-chevron-circle-left":
        return faChevronCircleLeft;
      case "fa-chevron-down":
        return faChevronDown;
      case "fa-chevron-left":
        return faChevronLeft;
      case "fa-chevron-right":
        return faChevronRight;
      case "fa-chevron-up":
        return faChevronUp;
      case "fa-circle":
        return faCircle;
      case "fa-clock":
        return faClock;
      case "fa-clock-rotate-left":
        return faClockRotateLeft;
      case "fa-close":
        return faClose;
      case "fa-cloud":
        return faCloud;
      case "fa-code":
        return faCode;
      case "fa-code-branch":
        return faCodeBranch;
      case "fa-cog":
        return faCog;
      case "fa-cookie":
        return faCookie;
      case "fa-copy":
        return faCopy;
      case "fa-crop":
        return faCrop;
      case "fa-cubes":
        return faCubes;
      case "fa-dashboard":
        return faDashboard;
      case "fa-database":
        return faDatabase;
      case "fa-diagram-project":
        return faDiagramProject;
      case "fa-divide":
        return faDivide;
      case "fa-down":
        return faDown;
      case "fa-edit":
        return faEdit;
      case "fa-exchange":
        return faExchange;
      case "fa-eye":
        return faEye;
      case "fa-file-contract":
        return faFileContract;
      case "fa-file-export":
        return faFileExport;
      case "fa-file-html":
        return faFileHtml;
      case "fa-file-lines":
        return faFileLines;
      case "fa-font":
        return faFont;
      case "fa-forward":
        return faForward;
      case "fa-gauge":
        return faGauge;
      case "fa-gauge-high":
        return faGaugeHigh;
      case "fa-github":
        return faGithub;
      case "fa-globe":
        return faGlobe;
      case "fa-handshake":
        return faHandshake;
      case "fa-image":
        return faImage;
      case "fa-images":
        return faImages;
      case "fa-layer-group":
        return faLayerGroup;
      case "fa-link-slash":
        return faLinkSlash;
      case "fa-mobile-screen":
        return faMobileScreen;
      case "fa-multiply":
        return faMultiply;
      case "fa-object-group":
        return faObjectGroup;
      case "fa-page":
        return faPage;
      case "fa-palette":
        return faPalette;
      case "fa-paste":
        return faPaste;
      case "fa-plus":
        return faPlus;
      case "fa-puzzle-piece":
        return faPuzzlePiece;
      case "fa-question":
        return faQuestion;
      case "fa-random":
        return faRandom;
      case "fa-redo":
        return faRedo;
      case "fa-rectangle":
        return faRectangle;
      case "fa-refresh":
        return faRefresh;
      case "fa-right-left":
        return faRightLeft;
      case "fa-rocket-launch":
        return faRocketLaunch;
      case "fa-save":
        return faSave;
      case "fa-server":
        return faServer;
      case "fa-shapes":
        return faShapes;
      case "fa-shield":
        return faShield;
      case "fa-sign-in":
        return faSignIn;
      case "fa-sign-out":
        return faSignOut;
      case "fa-sparkles":
        return faSparkles;
      case "fa-square-root":
        return faSquareRoot;
      case "fa-square-root-variable":
        return faSquareRootVariable;
      case "fa-subtract":
        return faSubtract;
      case "fa-table":
        return faTable;
      case "fa-table-cells-large":
        return faTableCellsLarge;
      case "fa-table-layout":
        return faTableLayout;
      case "fa-tower-broadcast":
        return faTowerBroadcast;
      case "fa-trash":
        return faTrash;
      case "fa-triangle-exclamation":
        return faTriangleExclamation;
      case "fa-undo":
        return faUndo;
      case "fa-up":
        return faUp;
      case "fa-upload":
        return faUpload;
      case "fa-user":
        return faUser;
      case "fa-user-gear":
        return faUserGear;
      case "fa-users":
        return faUsers;
      case "fa-wrench":
        return faWrench;
      default:
        return faQuestion;
    }
  } else {
    return faQuestion;
  }
}
