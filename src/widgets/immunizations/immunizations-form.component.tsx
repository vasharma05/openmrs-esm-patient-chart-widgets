import React, { useEffect, useState, useRef } from "react";
import { useRouteMatch } from "react-router-dom";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./immunizations-form.css";
import { DataCaptureComponentProps } from "../shared-utils";

export function ImmunizationsForm(props: ImmunizationsFormProps) {
  const [immunizationName, setImmunizationName] = useState("");
  const [immunizationUuid, setImmunizationUuid] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState(null);
  const [seriesOn, setIsSeriesFlag] = useState(true);
  const [series, setSeries] = useState("");
  const [vaccinationExpiration, setVaccinationExpiration] = useState(null);
  const [lotNumber, setLotNumber] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [enableCreateButtons, setEnableCreateButtons] = useState(false);
  const [enableEditButtons, setEnableEditButtons] = useState(true);
  const [viewEditForm, setViewEditForm] = useState(true);
  const [inactiveStatus, setInactiveStatus] = useState(false);
  const [inactivityDate, setInactivityDate] = useState("");
  const [formChanged, setFormChanged] = useState<Boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const match = useRouteMatch();

  useEffect(() => {
    if (vaccinationDate) {
      setEnableCreateButtons(true);
    } else {
      setEnableCreateButtons(false);
    }
  }, [vaccinationDate]);

  useEffect(() => {
    if (viewEditForm && formChanged) {
      setEnableEditButtons(false);
    } else {
      setEnableEditButtons(true);
    }
  }, [viewEditForm, formChanged]);

  useEffect(() => {
    if (props.match.params) {
      const {
        immunizationUuid,
        immunizationName,
        manufacturer,
        expirationDate,
        vaccinationDate,
        lotNumber,
        isSeries,
        series
      }: Immunization = props.match.params[0];
      if (immunizationName && vaccinationDate) {
        setViewEditForm(true);
        setImmunizationUuid(immunizationUuid);
        setImmunizationName(immunizationName);
        setManufacturer(manufacturer);
        setVaccinationDate(vaccinationDate);
        setVaccinationExpiration(expirationDate);
        setLotNumber(lotNumber);
        setIsSeriesFlag(isSeries);
        setSeries(series);
      } else {
        setViewEditForm(false);
        setImmunizationUuid(immunizationUuid);
        setImmunizationName(immunizationName);
        setManufacturer(manufacturer);
        setVaccinationExpiration(expirationDate);
        setIsSeriesFlag(isSeries);
      }
    }
  }, [props.match.params]);

  const handleCreateFormSubmit = event => {
    event.preventDefault();
  };

  function createForm() {
    const header = "Add Vaccine: " + immunizationName;
    return (
      <form
        onSubmit={handleCreateFormSubmit}
        onChange={() => {
          setFormChanged(true);
          return props.entryStarted();
        }}
        ref={formRef}
      >
        <SummaryCard
          name={header}
          styles={{
            width: "100%",
            background: "var(--omrs-color-bg-medium-contrast)",
            height: "auto"
          }}
        >
          <div className={styles.immunizationsContainerWrapper}>
            <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
              {seriesOn && (
                <div className={styles.immunizationsInputContainer}>
                  <label htmlFor="series">Series</label>
                  <div className="omrs-dropdown">
                    {/* TODO replace with reading from JSON */}
                    <select
                      id="series"
                      name="series"
                      defaultValue={series}
                      className={`immunizationSeriesSelect`}
                      required
                    >
                      <option value="DEFAULT">Please select</option>
                      <option value="2 Months">2 months</option>
                      <option value="4 Months">4 months</option>
                      <option value="6 Months">6 months</option>
                      <option value="1 Year">1 Year</option>
                    </select>
                  </div>
                </div>
              )}
              <div className={styles.immunizationsInputContainer}>
                <label htmlFor="vaccinationDate">Vaccination Date</label>
                <div className="omrs-datepicker">
                  <input
                    type="date"
                    name="vaccinationDate"
                    required
                    onChange={evt => setVaccinationDate(evt.target.value)}
                  />
                  <svg className="omrs-icon" role="img">
                    <use xlinkHref="#omrs-icon-calendar"></use>
                  </svg>
                </div>
              </div>
              <div className={styles.immunizationsInputContainer}>
                <label htmlFor="vaccinationExpiration">Expiration Date</label>
                <div className="omrs-datepicker">
                  <input
                    type="date"
                    name="vaccinationExpiration"
                    onChange={evt => setVaccinationExpiration(evt.target.value)}
                  />
                  <svg className="omrs-icon" role="img">
                    <use xlinkHref="#omrs-icon-calendar"></use>
                  </svg>
                </div>
              </div>
              <div className={styles.immunizationsInputContainer}>
                <label htmlFor="lotNumber">Lot number</label>
                <div className="omrs-input-group">
                  <input
                    className="omrs-input-outlined"
                    type="text"
                    style={{ height: "2.75rem" }}
                    onChange={evt => setLotNumber(evt.target.value)}
                  />
                </div>
              </div>
              <div className={styles.immunizationsInputContainer}>
                <label htmlFor="manufacturer">Manufacturer</label>
                <div className="omrs-input-group">
                  <input
                    className="omrs-input-outlined"
                    type="text"
                    style={{ height: "2.75rem" }}
                    onChange={evt => setManufacturer(evt.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </SummaryCard>
        <div
          className={
            enableCreateButtons
              ? `${styles.buttonStyles} ${styles.buttonStylesBorder}`
              : styles.buttonStyles
          }
        >
          <button
            type="button"
            className="omrs-btn omrs-outlined-neutral omrs-rounded"
            style={{ width: "50%" }}
            onClick={closeForm}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ width: "50%" }}
            className={
              enableCreateButtons
                ? "omrs-btn omrs-filled-action omrs-rounded"
                : "omrs-btn omrs-outlined omrs-rounded"
            }
            disabled={!enableCreateButtons}
          >
            Sign & Save
          </button>
        </div>
      </form>
    );
  }

  const closeForm = event => {
    let userConfirmed: boolean = false;
    if (formChanged) {
      userConfirmed = confirm(
        "There is ongoing work, are you sure you want to close this tab?"
      );
    }

    if (userConfirmed && formChanged) {
      props.entryCancelled();
      props.closeComponent();
    } else if (!formChanged) {
      props.entryCancelled();
      props.closeComponent();
    }
  };

  const handleEditSubmit = event => {
    event.preventDefault();
  };

  function editForm() {
    const header = "Edit Vaccine: " + immunizationName;
    return (
      <>
        {immunizationName && vaccinationDate && (
          <form
            onChange={() => {
              setFormChanged(true);
              return props.entryStarted();
            }}
            onSubmit={handleEditSubmit}
            className={styles.immunizationsForm}
            ref={formRef}
          >
            <SummaryCard
              name={header}
              styles={{
                width: "100%",
                backgroundColor: "var(--omrs-color-bg-medium-contrast)",
                height: "auto"
              }}
            >
              <div className={styles.immunizationsContainerWrapper}>
                <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
                  {seriesOn && (
                    <div className={styles.immunizationsInputContainer}>
                      <label htmlFor="series">Series</label>
                      <div className="omrs-dropdown">
                        <select
                          id="series"
                          name="series"
                          defaultValue={series}
                          required
                        >
                          <option value="DEFAULT">Please select</option>
                          <option value="2 Months">2 Months</option>
                          <option value="4 Months">4 Months</option>
                          <option value="6 Months">6 Months</option>
                          <option value="1 Year">1 Year</option>
                        </select>
                      </div>
                    </div>
                  )}
                  <div className={styles.immunizationsInputContainer}>
                    <label htmlFor="onsetDate">Vaccination Date</label>
                    <div className="omrs-datepicker">
                      <input
                        type="date"
                        id="vaccinationDate"
                        name="vaccinationDate"
                        defaultValue={vaccinationDate}
                      />
                      <svg className="omrs-icon" role="img">
                        <use xlinkHref="#omrs-icon-calendar"></use>
                      </svg>
                    </div>
                  </div>
                  <div className={styles.immunizationsInputContainer}>
                    <label htmlFor="onsetDate">Expiration Date</label>
                    <div className="omrs-datepicker">
                      <input
                        type="date"
                        id="vaccinationExpiration"
                        name="vaccinationExpiration"
                        defaultValue={vaccinationExpiration}
                      />
                      <svg className="omrs-icon" role="img">
                        <use xlinkHref="#omrs-icon-calendar"></use>
                      </svg>
                    </div>
                  </div>
                  <div className={styles.immunizationsInputContainer}>
                    <label htmlFor="lotNumber">Lot Number</label>
                    <div className="omrs-input-group">
                      <input
                        className="omrs-input-outlined"
                        type="text"
                        style={{ height: "2.75rem" }}
                        id="lotNumber"
                        name="lotNumber"
                        defaultValue={lotNumber}
                      />
                    </div>
                  </div>
                  <div className={styles.immunizationsInputContainer}>
                    <label htmlFor="manufacturer">Manufacturer</label>
                    <div className="omrs-input-group">
                      <input
                        className="omrs-input-outlined"
                        type="text"
                        style={{ height: "2.75rem" }}
                        id="manufacturer"
                        name="manufacturer"
                        defaultValue={manufacturer}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SummaryCard>
            <div
              className={
                enableEditButtons
                  ? styles.buttonStyles
                  : `${styles.buttonStyles} ${styles.buttonStylesBorder}`
              }
            >
              <button
                type="submit"
                className="omrs-btn omrs-outlined-neutral omrs-rounded"
                style={{ width: "20%" }}
              >
                Delete
              </button>
              <button
                type="button"
                className="omrs-btn omrs-outlined-neutral omrs-rounded"
                onClick={closeForm}
                style={{ width: "30%" }}
              >
                Cancel changes
              </button>
              <button
                type="submit"
                className={
                  enableEditButtons
                    ? "omrs-btn omrs-outlined omrs-rounded"
                    : "omrs-btn omrs-filled-action omrs-rounded"
                }
                disabled={enableEditButtons}
                style={{ width: "50%" }}
              >
                Sign & Save
              </button>
            </div>
          </form>
        )}
      </>
    );
  }

  return <div>{viewEditForm ? editForm() : createForm()}</div>;
}

ImmunizationsForm.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};

type ImmunizationsFormProps = DataCaptureComponentProps & {
  match: any;
};

type Immunization = {
  immunizationUuid: string;
  immunizationName: string;
  manufacturer: string;
  expirationDate: string;
  vaccinationDate: string;
  lotNumber: string;
  isSeries: boolean;
  series: string;
};
