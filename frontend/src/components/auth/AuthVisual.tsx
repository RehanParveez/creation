type Feature = {
  number: string;
  title: string;
  subtitle: string;
};

type Detail = {
  icon: "chart" | "check" | "shield";
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    number: "01",
    title: "Visibility",
    subtitle: "Cost & progress",
  },
  {
    number: "02",
    title: "Control",
    subtitle: "Approvals & workflow",
  },
  {
    number: "03",
    title: "Traceability",
    subtitle: "Every project event",
  },
];

const details: Detail[] = [
  {
    icon: "chart",
    title: "Live reporting",
    description: "Understand project performance as it changes.",
  },
  {
    icon: "check",
    title: "Clear approvals",
    description: "Keep decisions documented and visible.",
  },
  {
    icon: "shield",
    title: "Protected data",
    description: "Keep operational information organized.",
  },
];

function DetailIcon({ type }: { type: Detail["icon"] }) {
  if (type === "chart") {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2.5 11.75V7.75M6.25 11.75V4.75M10 11.75V2.75"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M1.75 12.25H12.75"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "check") {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3.25 7.7L6.15 10.35L11.8 4.7"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 2.15L11.45 4.4V8.85L7.5 11.1L3.55 8.85V4.4L7.5 2.15Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M5.8 7.5L7.05 8.7L9.45 6.25"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AuthVisual() {
  return (
    <section
      aria-label="ConstructPro platform overview"
      className="relative isolate h-full min-h-0 w-full overflow-hidden bg-[#f5f8f2] text-[#17231b]"
    >
    
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 72% 20%, rgba(215,232,207,.72) 0%, rgba(231,240,226,.42) 30%, rgba(245,248,242,0) 62%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(82,119,87,.11) 1px, transparent 1px), linear-gradient(to bottom, rgba(82,119,87,.10) 1px, transparent 1px)",
            backgroundSize: "80px 100%",
          }}
        />

        <div
          className="absolute inset-y-0 left-[12%] w-px bg-[#6f956b]/15"
        />
        <div
          className="absolute inset-y-0 left-[45%] w-px bg-[#6f956b]/15"
        />
        <div
          className="absolute inset-y-0 left-[78%] w-px bg-[#6f956b]/15"
        />

        <div className="absolute inset-x-0 top-[23%] h-px bg-[#6f956b]/10" />
        <div className="absolute inset-x-0 top-[65%] h-px bg-[#6f956b]/10" />
        <div className="absolute inset-x-0 bottom-[11%] h-px bg-[#6f956b]/10" />
      </div>

      <header className="absolute left-0 right-0 top-0 z-20 flex h-[76px] items-start justify-between px-[22px] pt-[19px]">
        <div className="flex items-start gap-3">
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#17231b] text-white shadow-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 12.75L9 4.25L14 12.75"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.2 10.1H11.8"
                stroke="currentColor"
                strokeWidth="1.45"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="pt-[1px]">
            <div className="text-[17px] font-semibold leading-[20px] tracking-[-0.03em] text-[#17231b]">
              ConstructPro
            </div>

            <div className="mt-[4px] text-[8px] font-medium uppercase tracking-[0.24em] text-[#789078]">
              AI Construction Management
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pr-[2px] pt-[2px] text-[9px] font-medium uppercase tracking-[0.24em] text-[#668165]">
          <span className="h-[6px] w-[6px] rounded-full bg-[#7ca36f]" />
          <span>Systems operational</span>
        </div>
      </header>

      <div className="relative z-10 flex h-full min-h-0 w-full items-center px-[11%] pb-[2%] pt-[76px]">
        <div className="w-full max-w-[850px]">
          <div className="mb-[18px] flex items-center gap-[14px]">
            <span className="h-px w-[40px] bg-[#78a16f]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.27em] text-[#668165]">
              Project control platform
            </span>
          </div>

          <h1 className="m-0 max-w-[850px] text-[clamp(48px,5.2vw,78px)] font-semibold leading-[0.91] tracking-[-0.065em] text-[#17231b]">
            <span className="block">Construction</span>
            <span className="block">control,</span>

            <span className="block text-[#9aaf96]">
              without the blind spots.
            </span>
          </h1>

          <p className="mt-[22px] max-w-[760px] text-[16px] font-normal leading-[1.55] tracking-[-0.01em] text-[#648078]">
            Bring approved budgets, site progress, materials, procurement,
            deliveries and expenses into one operational picture.
          </p>

          <div className="mt-[18px] grid grid-cols-3 border-t border-[#9ab19a]/35">
            {features.map((feature, index) => (
              <div
                key={feature.number}
                className={[
                  "min-w-0 py-[12px]",
                  index !== 0
                    ? "border-l border-[#9ab19a]/35 pl-[18px]"
                    : "pr-[18px]",
                ].join(" ")}
              >
                <div className="text-[8px] font-semibold tracking-[0.2em] text-[#789c70]">
                  {feature.number}
                </div>

                <div className="mt-[4px] text-[14px] font-semibold leading-[17px] text-[#17231b]">
                  {feature.title}
                </div>

                <div className="mt-[2px] text-[9px] leading-[13px] text-[#799087]">
                  {feature.subtitle}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[15px] grid grid-cols-3 border-t border-[#9ab19a]/35">
            {details.map((detail, index) => (
              <div
                key={detail.title}
                className={[
                  "flex min-w-0 items-start gap-[10px] py-[12px]",
                  index !== 0
                    ? "border-l border-[#9ab19a]/35 pl-[18px]"
                    : "pr-[18px]",
                ].join(" ")}
              >
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] border border-[#9ab19a]/40 bg-white/40 text-[#7ba171]">
                  <DetailIcon type={detail.icon} />
                </div>

                <div className="min-w-0">
                  <div className="text-[11px] font-semibold leading-[14px] text-[#24342a]">
                    {detail.title}
                  </div>

                  <div className="mt-[2px] max-w-[190px] text-[8px] leading-[12px] text-[#7a9186]">
                    {detail.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="absolute bottom-[14px] left-[22px] right-[22px] z-20 flex items-end justify-between">
        <div className="flex items-center gap-[8px] text-[8px] font-medium uppercase tracking-[0.18em] text-[#769078]">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 8.2C3.05 8.2 3.05 5.3 4.1 5.3C5.15 5.3 5.15 10.1 6.2 10.1C7.25 10.1 7.25 4 8.3 4C9.35 4 9.35 8.2 10.4 8.2C11.45 8.2 11.45 6.8 13 6.8"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>

          <span>Operational layer</span>

          <span className="normal-case tracking-normal text-[#8a9b90]">
            Budget · Site · Procurement · Cost
          </span>
        </div>

        <div className="text-[8px] font-medium uppercase tracking-[0.18em] text-[#789078]">
          ConstructPro / 01
        </div>
      </footer>
    </section>
  );
}