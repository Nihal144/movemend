import { POSE_FIGURES, POSE_TONES, type PoseKey } from "@/components/pose-avatar";
import { exerciseFor } from "@/lib/exercises";

/**
 * The demo panel at the top of the player. Real looping footage is used when an
 * exercise declares `media`; otherwise the pose illustration animates in place,
 * so a session is fully usable offline with no video assets shipped.
 */
export function ExerciseMedia({ pose }: { pose: PoseKey }) {
  const exercise = exerciseFor(pose);
  const tone = POSE_TONES[pose];

  if (exercise.media) {
    const isVideo = /\.(mp4|webm)$/i.test(exercise.media);
    return (
      <div className={`${tone.bg} aspect-square w-full overflow-hidden rounded-card`}>
        {isVideo ? (
          <video
            src={exercise.media}
            className="size-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            aria-label={`${exercise.name} demonstration`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- animated GIF; next/image would freeze it
          <img
            src={exercise.media}
            alt={`${exercise.name} demonstration`}
            className="size-full object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`${tone.bg} grid aspect-square w-full place-items-center rounded-card`}
      role="img"
      aria-label={`${exercise.name} illustration`}
    >
      <svg
        viewBox="0 0 48 48"
        className={`${tone.ink} pose-breathe size-2/5 fill-none`}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {POSE_FIGURES[pose]}
      </svg>
    </div>
  );
}
