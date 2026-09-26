"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import { siteContent } from "@/content/site";
import { useMotionCapabilities } from "./MotionCapabilities";

/** Заголовок первого экрана: слова появляются по очереди снизу вверх (всего до 1,5 с). */
export function AnimatedHeroTitle() {
  const { title, ownerName } = siteContent;
  const { reducedMotion } = useMotionCapabilities();
  const lead = title.slice(0, title.length - ownerName.length).trim();
  const leadWords = lead.split(" ");
  const ownerWords = ownerName.split(" ");

  const renderWord = (word: string, index: number) => {
    if (reducedMotion) return <span className="inline-block">{word}</span>;
    return (
      <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
        <motion.span
          className="inline-block"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      </span>
    );
  };

  return (
    <h1 className="font-display font-bold tracking-tight">
      <span className="block text-[clamp(2.25rem,7vw,5.25rem)] leading-[1.02]">
        {leadWords.map((word, i) => (
          <Fragment key={`l${i}`}>
            {renderWord(word, i)}
            {i < leadWords.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>{" "}
      <span className="mt-3 block text-[clamp(1.25rem,3.2vw,2.25rem)] leading-tight text-accent">
        {ownerWords.map((word, i) => (
          <Fragment key={`o${i}`}>
            {renderWord(word, leadWords.length + i)}
            {i < ownerWords.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </h1>
  );
}
