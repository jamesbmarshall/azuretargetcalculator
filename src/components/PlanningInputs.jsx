import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TrendingUp, DollarSign } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

/**
 * ----------------------------------------------------------------------------
 *  Professional & reusable planning-inputs component
 *  -------------------------------------------------
 *  - React-Hook-Form + Zod for robust validation / UX.
 *  - Tailwind for consistent styling (same palette as the rest of the app).
 *  - Radix-UI Tooltip for accessible, lightweight helpers.
 * ----------------------------------------------------------------------------
 */

const schema = z.object({
  ramp: z
    .number({ invalid_type_error: "Ramp-up period is required" })
    .min(1, "Must be at least 1 month"),
  growth: z
    .number({ invalid_type_error: "Growth rate is required" })
    .min(0, "Cannot be negative"),
  churn: z
    .number({ invalid_type_error: "Churn rate is required" })
    .min(0, "Cannot be negative"),
  baseline: z
    .number({ invalid_type_error: "Baseline revenue is required" })
    .min(0, "Cannot be negative"),
});

/** Tooltip-enabled input ---------------------------------------------------*/
const InputField = ({
  id,
  label,
  icon: Icon,
  suffix,
  helper,
  register,
  error,
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
      {Icon && <Icon className="w-4 h-4 text-blue-600" />}
      <label htmlFor={id}>{label}</label>

      {helper && (
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <span className="ml-1 cursor-help text-gray-400">❔</span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={4}
              className="max-w-xs rounded-lg bg-gray-900 p-3 text-sm text-white shadow-lg"
            >
              {helper}
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      )}
    </div>

    <div className="relative">
      <input
        id={id}
        type="number"
        {...register(id, { valueAsNumber: true })}
        className={`peer w-full rounded-xl border-2 py-3 pl-4 ${
          suffix ? "pr-12" : "pr-4"
        } transition-all focus:ring-4 focus:ring-blue-500/20 ${
          error ? "border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-blue-500"
        }`}
        step="any"
        min="0"
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-blue-600">
          {suffix}
        </span>
      )}
    </div>

    {error && <p className="text-sm text-red-600">{error.message}</p>}
  </div>
);

/** Main component ----------------------------------------------------------*/
const PlanningInputs = ({ defaultValues, onNext }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Tooltip.Provider delayDuration={0} skipDelayDuration={200}>
      <form onSubmit={handleSubmit(onNext)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <InputField
            id="ramp"
            label="Ramp-up period (months)"
            icon={TrendingUp}
            helper="How many months until a new customer reaches target spend?"
            register={register}
            error={errors.ramp}
          />

          <InputField
            id="growth"
            label="Organic growth rate (%)"
            icon={TrendingUp}
            helper="Average MoM revenue growth without proactive engagement"
            suffix="%"
            register={register}
            error={errors.growth}
          />

          <InputField
            id="churn"
            label="Revenue churn rate (%)"
            icon={TrendingUp}
            helper="Average MoM revenue loss from churn"
            suffix="%"
            register={register}
            error={errors.churn}
          />

          <InputField
            id="baseline"
            label="Baseline monthly revenue"
            icon={DollarSign}
            helper="Current MRR before executing your plan"
            register={register}
            error={errors.baseline}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!isValid}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </Tooltip.Provider>
  );
};

export default PlanningInputs;