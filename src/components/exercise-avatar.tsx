import { POSE_FIGURES } from "@/components/pose-avatar";
import { exerciseFor, exerciseTone, type ExerciseKey } from "@/lib/exercises";

/** List-sized badge for any exercise — pose figure or breathing mark. */
export function ExerciseAvatar({
  exercise: key,
  className = "size-14",
}: {
  exercise: ExerciseKey;
  className?: string;
}) {
  const exercise = exerciseFor(key);
  const tone = exerciseTone(key);

  return (
    <span
      className={`${tone.bg} ${className} inline-flex shrink-0 items-center justify-center rounded-full`}
    >
      <svg
        viewBox="0 0 48 48"
        className={`${tone.ink} size-[70%] fill-none`}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {exercise.pose ? (
          POSE_FIGURES[exercise.pose]
        ) : (
          // Concentric arcs read as breath moving in and out.
          <>
            <circle cx="24" cy="24" r="5" />
            <path d="M13 15a15 15 0 0 0 0 18M35 15a15 15 0 0 1 0 18" />
          </>
        )}
      </svg>
    </span>
  );
}
