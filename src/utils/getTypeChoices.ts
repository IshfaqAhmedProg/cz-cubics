import pad from "pad";
import type {
  CZCubicsCommitType,
  ResolvedCZCubicsConfig,
} from "../config.type";

export interface TypeChoice {
  name: string;
  value: {
    emoji: string;
    name: string;
  };
}

export default function getTypeChoices(
  config: ResolvedCZCubicsConfig,
): TypeChoice[] {
  const maxNameLength = config.types.reduce(
    (maxLength, type) => Math.max(maxLength, type.name.length),
    0,
  );

  function renderEmoji({ emoji = "" }: CZCubicsCommitType): string {
    return emoji ? `${emoji} ` : "";
  }

  return config.types.map((choice) => ({
    name: `${renderEmoji(choice)} ${pad(choice.name, maxNameLength)} ${choice.description}`,
    value: {
      emoji: renderEmoji(choice),
      name: choice.name,
    },
  }));
}
