interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { n: 1, label: "Profile" },
  { n: 2, label: "Knowledge base" },
  { n: 3, label: "Review" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {STEPS.map(({ n, label }, i) => (
        <div key={n} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === n
                  ? "bg-indigo-600 text-white"
                  : currentStep > n
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {n}
            </div>
            <span
              className={`text-sm font-medium ${
                currentStep === n ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && <div className="w-8 h-px bg-gray-200" />}
        </div>
      ))}
    </div>
  );
}
