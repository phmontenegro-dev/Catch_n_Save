'use client';

import { useRef } from 'react';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function useScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();

      /*
       * ============================================================
       * DESKTOP
       * ============================================================
       */

      mm.add('(min-width: 1024px)', () => {
        const ctx = containerRef.current!;

        const heroContent = ctx.querySelector('[data-anim="hero-content"]');

        const cardBack = ctx.querySelector('[data-anim="card-back"]');

        const cardArt = ctx.querySelector('[data-anim="card-art"]');

        const cardFront = ctx.querySelector('[data-anim="card-front"]');

        const cardFrontInner = ctx.querySelector('[data-anim="card-front-inner"]');

        const dashboardFront = ctx.querySelector('[data-anim="dashboard-front"]');

        const dashboardIntro = ctx.querySelector('[data-anim="dashboard-intro"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ctx,

            start: 'top top',

            end: '+=1800',

            scrub: 1,

            pin: true,

            pinSpacing: true,

            anticipatePin: 1,
          },
        });

        /*
         * ==========================================================
         * ATO 1 → 2
         *
         * Hero desaparece e cartas laterais saem.
         * ==========================================================
         */

        /*
         * ==========================================================
         * ESTADO INICIAL — força elementos ocultos antes do scroll
         * ==========================================================
         */

        tl.set(dashboardFront, { opacity: 0 });
        tl.set(dashboardIntro, { opacity: 0 });

        tl.to(
          heroContent,
          {
            opacity: 0,
            y: -40,
            duration: 1,
            ease: 'power2.inOut',
          },
          0,
        )

          .to(
            cardBack,
            {
              opacity: 0,
              x: -100,
              rotate: -20,
              duration: 0.8,
            },
            0,
          )

          .to(
            cardArt,
            {
              opacity: 0,
              x: 100,
              rotate: 15,
              duration: 0.8,
            },
            0,
          );

        /*
         * ==========================================================
         * CONTEÚDO ORIGINAL DA CARTA
         * ==========================================================
         */

        tl.to(
          cardFrontInner,
          {
            opacity: 0,
            duration: 0.5,
          },
          0.2,
        );

        /*
         * ==========================================================
         * MOLDURA TOMBA
         *
         * Rotaciona -90 graus e cresce para virar o dashboard.
         * ==========================================================
         */

        tl.to(
          cardFront,
          {
            rotation: -90,

            scaleX: 1.3,

            scaleY: 1.4,

            x: '-5vw',

            y: '-5vh',

            duration: 1.8,

            ease: 'power2.inOut',
          },
          0.4,
        );

        /*
         * ==========================================================
         * DASHBOARD APARECE
         * ==========================================================
         */

        tl.to(
          dashboardFront,
          {
            opacity: 1,

            duration: 0.7,

            ease: 'power2.out',
          },
          1.8,
        );

        /*
         * ==========================================================
         * TEXTO INTRODUTÓRIO
         * ==========================================================
         */

        tl.from(
          dashboardIntro,
          {
            opacity: 0,

            x: 0,

            y: 0,

            duration: 0.6,
          },
          1.6,
        );
      });

      /*
       * ============================================================
       * MOBILE
       * ============================================================
       */

      mm.add('(max-width: 1023px)', () => {
        const dashboardFront = containerRef.current!.querySelector('[data-anim="dashboard-front"]');

        if (dashboardFront) {
          const element = dashboardFront as HTMLElement;

          element.style.opacity = '1';
        }
      });

      return () => {
        mm.revert();
      };
    },
    {
      scope: containerRef,
    },
  );

  return containerRef;
}
