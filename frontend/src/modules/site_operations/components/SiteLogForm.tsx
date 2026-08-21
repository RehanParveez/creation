import {useEffect, useState,
} from "react";
import type {SiteLog, SiteLogCreateInput, SiteLogUpdateInput,
} from "../types/siteOperations.types";
import {WEATHER_OPTIONS,
} from "../types/siteOperations.types";

interface Props {
  open: boolean;
  siteLog?: SiteLog;
  loading?: boolean;
  onClose: () => void;
  onCreate: (
    payload: SiteLogCreateInput,
  ) => void;
  onUpdate: (
    payload: SiteLogUpdateInput,
  ) => void;
}

export function SiteLogForm({
  open,
  siteLog,
  loading = false,
  onClose,
  onCreate,
  onUpdate,
}: Props) {
  const editing = Boolean(siteLog);

  const [
    reportDate,
    setReportDate,
  ] = useState("");

  const [
    weather,
    setWeather,
  ] = useState("");

  const [
    weatherNotes,
    setWeatherNotes,
  ] = useState("");

  const [
    workersCount,
    setWorkersCount,
  ] = useState("0");

  const [
    workCompleted,
    setWorkCompleted,
  ] = useState("");

  const [
    materialSummary,
    setMaterialSummary,
  ] = useState("");

  const [
    equipmentSummary,
    setEquipmentSummary,
  ] = useState("");

  const [
    progressPercent,
    setProgressPercent,
  ] = useState("0");

  const [
    blockers,
    setBlockers,
  ] = useState("");

  const [
    errors,
    setErrors,
  ] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (!open) return;

    setReportDate(
      siteLog?.report_date ??
        new Date()
          .toISOString()
          .slice(0, 10),
    );

    setWeather(
      siteLog?.weather ?? "",
    );

    setWeatherNotes(
      siteLog?.weather_notes ?? "",
    );

    setWorkersCount(
      String(
        siteLog?.workers_count ?? 0,
      ),
    );

    setWorkCompleted(
      siteLog?.work_completed ?? "",
    );

    setMaterialSummary(
      siteLog?.material_summary ?? "",
    );

    setEquipmentSummary(
      siteLog?.equipment_summary ?? "",
    );

    setProgressPercent(
      String(
        siteLog?.progress_percent ?? 0,
      ),
    );

    setBlockers(
      siteLog?.blockers ?? "",
    );

    setErrors({});
  }, [open, siteLog]);

  if (!open) return null;

  function validate() {
    const next: Record<
      string,
      string
    > = {};

    if (!editing && !reportDate) {
      next.reportDate =
        "Report date is required.";
    }

    const workers = Number(
      workersCount,
    );

    if (
      !Number.isFinite(workers) ||
      workers < 0
    ) {
      next.workersCount =
        "Workers count cannot be negative.";
    }

    const progress = Number(
      progressPercent,
    );

    if (
      !Number.isFinite(progress) ||
      progress < 0 ||
      progress > 100
    ) {
      next.progressPercent =
        "Progress must be between 0 and 100.";
    }

    setErrors(next);

    return (
      Object.keys(next).length === 0
    );
  }

  function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!validate()) return;

    if (editing) {
      onUpdate({
        weather:
          weather
            ? (weather as SiteLog["weather"])
            : null,
        weather_notes:
          weatherNotes.trim() || null,
        workers_count:
          Number(workersCount),
        work_completed:
          workCompleted.trim() || null,
        material_summary:
          materialSummary.trim() || null,
        equipment_summary:
          equipmentSummary.trim() || null,
        progress_percent:
          Number(progressPercent),
        blockers:
          blockers.trim() || null,
      });

      return;
    }

    onCreate({
      report_date: reportDate,
      weather:
        weather
          ? (weather as SiteLog["weather"])
          : null,
      weather_notes:
        weatherNotes.trim() || null,
      workers_count:
        Number(workersCount),
      work_completed:
        workCompleted.trim() || null,
      material_summary:
        materialSummary.trim() || null,
      equipment_summary:
        equipmentSummary.trim() || null,
      progress_percent:
        Number(progressPercent),
      blockers:
        blockers.trim() || null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {editing
                ? "Edit Site Report"
                : "Create Site Report"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Record daily site conditions,
              work progress, resources and
              blockers.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-xl text-muted-foreground"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          {!editing && (
            <div>
              <label className="text-sm font-medium">
                Report Date
              </label>

              <input
                type="date"
                value={reportDate}
                onChange={(e) =>
                  setReportDate(
                    e.target.value,
                  )
                }
                className="mt-2 w-full rounded-lg border px-3 py-2"
              />

              {errors.reportDate && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.reportDate}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">
                Weather
              </label>

              <select
                value={weather}
                onChange={(e) =>
                  setWeather(
                    e.target.value,
                  )
                }
                className="mt-2 w-full rounded-lg border px-3 py-2"
              >
                <option value="">
                  Select weather
                </option>

                {WEATHER_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Workers Present
              </label>

              <input
                type="number"
                min="0"
                value={workersCount}
                onChange={(e) =>
                  setWorkersCount(
                    e.target.value,
                  )
                }
                className="mt-2 w-full rounded-lg border px-3 py-2"
              />

              {errors.workersCount && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.workersCount}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Weather Notes
            </label>

            <textarea
              value={weatherNotes}
              onChange={(e) =>
                setWeatherNotes(
                  e.target.value,
                )
              }
              rows={2}
              className="mt-2 w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Work Completed
            </label>

            <textarea
              value={workCompleted}
              onChange={(e) =>
                setWorkCompleted(
                  e.target.value,
                )
              }
              rows={4}
              className="mt-2 w-full rounded-lg border px-3 py-2"
              placeholder="Describe work completed today..."
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">
                Material Summary
              </label>

              <textarea
                value={materialSummary}
                onChange={(e) =>
                  setMaterialSummary(
                    e.target.value,
                  )
                }
                rows={4}
                className="mt-2 w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Equipment Summary
              </label>

              <textarea
                value={equipmentSummary}
                onChange={(e) =>
                  setEquipmentSummary(
                    e.target.value,
                  )
                }
                rows={4}
                className="mt-2 w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium">
                Overall Progress
              </label>

              <span className="text-sm font-semibold">
                {progressPercent}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progressPercent}
              onChange={(e) =>
                setProgressPercent(
                  e.target.value,
                )
              }
              className="mt-3 w-full"
            />

            {errors.progressPercent && (
              <p className="mt-1 text-sm text-destructive">
                {errors.progressPercent}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Blockers
            </label>

            <textarea
              value={blockers}
              onChange={(e) =>
                setBlockers(
                  e.target.value,
                )
              }
              rows={3}
              className="mt-2 w-full rounded-lg border px-3 py-2"
              placeholder="Delays, dependencies or blockers..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
            >
              {loading
                ? "Saving..."
                : editing
                  ? "Save Changes"
                  : "Create Site Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}