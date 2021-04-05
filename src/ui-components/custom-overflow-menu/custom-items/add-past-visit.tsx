import React from "react";
import CustomOverflowMenuItem from "../overflow-menu-item.component";
import { useTranslation } from "react-i18next";
import { openVisitDashboard } from "../../../widgets/visit/visit-button.component";

export default function AddPastVisitOverflowMenuItem() {
  const { t } = useTranslation();
  return (
    <button
      className="bx--overflow-menu-options__btn"
      role="menuitem"
      title={t("Add Past Visit", "Add Past Visit")}
      data-floating-menu-primary-focus
      onClick={() =>
        openVisitDashboard(`${t("visitDashboard", "Visit Dashboard")}`)
      }
      style={{
        maxWidth: "100vw"
      }}
    >
      <span className="bx--overflow-menu-options__option-content">
        {t("Add Past Visit", "Add Past Visit")}
      </span>
    </button>
  );
}