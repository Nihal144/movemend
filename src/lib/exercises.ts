import type { PoseKey } from "@/components/pose-avatar";

export type Exercise = {
  name: string;
  description: string;
  /**
   * Optional looping demo (GIF/MP4) served from /public. When absent the
   * player falls back to the animated pose illustration.
   */
  media?: string;
};

export const EXERCISES: Record<PoseKey, Exercise> = {
  child: {
    name: "Child's Pose",
    description:
      "Kneel and sit back toward your heels with your arms stretched forward. Let your chest sink and breathe wide into your lower back.",
  },
  downdog: {
    name: "Downward Dog",
    description:
      "Hands and feet on the floor, hips lifted high. Press the floor away and let your heels drift down without locking your knees.",
  },
  fold: {
    name: "Standing Forward Fold",
    description:
      "Feet hip-width apart, hinge from the hips and let your head hang heavy. Keep a soft bend in the knees throughout.",
  },
  cobra: {
    name: "Cobra",
    description:
      "Lie face down with hands under your shoulders. Press up gently until you feel a stretch across the front of your hips, not a pinch in your back.",
  },
  bridge: {
    name: "Glute Bridge",
    description:
      "On your back with knees bent, push through your heels and lift your hips until your body makes a straight line from knee to shoulder.",
  },
  reach: {
    name: "Overhead Reach",
    description:
      "Stand tall and reach both arms overhead. Lengthen through your sides and keep your ribs down rather than arching your lower back.",
  },
  lunge: {
    name: "Low Lunge",
    description:
      "Step one foot forward and lower the back knee. Ease your hips forward to open the front of the back thigh. Swap sides halfway.",
  },
  twist: {
    name: "Supine Twist",
    description:
      "On your back, drop both knees to one side and turn your head the other way. Keep both shoulders on the floor. Swap sides halfway.",
  },
  seated: {
    name: "Seated Forward Bend",
    description:
      "Sit with your legs extended and hinge forward from the hips. Reach toward your feet without forcing your spine to round.",
  },
  supine: {
    name: "Constructive Rest",
    description:
      "Lie on your back with knees bent and feet flat. Let your whole spine settle into the floor and slow your breathing down.",
  },
};

export function exerciseFor(pose: PoseKey): Exercise {
  return EXERCISES[pose];
}
