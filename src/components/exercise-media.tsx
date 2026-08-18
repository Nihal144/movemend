"use client";

import { BreathPacer } from "@/components/breath-pacer";
import { POSE_FIGURES } from "@/components/pose-avatar";
import { exerciseFor, exerciseTone, mediaFor, type ExerciseKey } from "@/lib/exercises";

/**
 * The demo panel at the top of the player. Breathing exercises get a live
 * pacer, pose exercises an animated illustration, and either is replaced by
 * real looping footage when the exercise declares `media`.
 */
export function ExerciseMedia({ exercise: key, paused }: { exercise: ExerciseKey; paused: boolean }) {
  const exercise = exerciseFor(key);
  const tone = exerciseTone(key);

  const media = mediaFor(key);

  if (media) {
    const isVideo = /\.(mp4|webm)$/i.test(media);
    return (
      <div className={`${tone.bg} aspect-square w-full overflow-hidden rounded-card`}>
        {isVideo ? (
          <video
            src={media}
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
            src={media}
            alt={`${exercise.name} demonstration`}
            className="size-full object-cover"
          />
        )}
      </div>
    );
  }

  if (exercise.breath) {
    return <BreathPacer phases={exercise.breath} paused={paused} tone={tone} />;
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
        {exercise.pose && POSE_FIGURES[exercise.pose]}
      </svg>
    </div>
  );
}
