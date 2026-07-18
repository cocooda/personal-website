import type { ProjectContent } from "@/lib/content/schemas";

const hanoiWorld = {
  slug: "hanoiworld",
  title: "HanoiWorld",
  shortTitle: "HanoiWorld",
  hierarchy: "secondary",
  status: "shipped",
  statusLabel: "Secondary technical / research project",
  featured: true,
  visibility: "public",
  priority: 20,
  oneLineSummary:
    "A JEPA-based world model project for autonomous driving simulation.",
  productDescription:
    "HanoiWorld explores representation-level prediction for autonomous driving scenes, connecting ML research depth to planning-oriented evaluation.",
  problem:
    "Autonomous driving agents need compact representations of scene dynamics that can support planning behavior without relying only on pixel-level reconstruction.",
  role:
    "ML contributor in a group project",
  teamContext:
    "Group project supported by the formal CV and a public GitHub repository.",
  contributionBoundary:
    "The public copy describes implemented and contributed work only; it does not claim solo ownership or numeric performance results.",
  proofPoint:
    "Implemented JEPA-style observation encoding modules used by RSSM latent dynamics and actor-critic control.",
  visual: {
    src: "/projects/hanoiworld/roundabout-simulation.png",
    alt: "Roundabout driving simulation environment from the public HanoiWorld project repository.",
    caption: "Factual driving-simulation figure from the public HanoiWorld repository.",
    kind: "simulation",
  },
  contributions: [
    "Implemented JEPA-style observation encoding modules for compact driving-scene representations.",
    "Contributed to architecture planning, preprocessing, training pipeline setup, model training logic, and experiments.",
    "Evaluated driving behavior using collision rate, episode reward, and scenario-level planning metrics.",
  ],
  outcomes: [
    "Public GitHub repository resolves and is linked from the project page.",
    "Case study avoids unsupported numeric performance claims.",
  ],
  metrics: [],
  technologies: [
    "Python",
    "PyTorch",
    "DreamerV3",
    "JEPA",
    "V-JEPA",
    "RSSM",
    "Actor-Critic Control",
  ],
  gallery: [
    {
      src: "/projects/hanoiworld/world-model.svg",
      alt: "HanoiWorld world-model loop from observations to latent dynamics and policy evaluation.",
      caption: "Labelled system diagram for the JEPA, RSSM, actor-critic, and scenario-evaluation loop.",
      kind: "diagram",
    },
  ],
  repositoryUrl: "https://github.com/CS-3331-Fundamental-of-AI/WorldModel-Self-Driving-Car",
  caseStudyUrl: "/work/hanoiworld",
  lastUpdated: "2026-07-16",
  confidentialityNote:
    "No local experiment logs were used for public numeric claims, so the case study stays qualitative.",
  sections: [
    {
      id: "overview",
      title: "Overview",
      eyebrow: "Research-to-product depth",
      body: [
        "HanoiWorld is a group project around a JEPA-based world model for autonomous driving simulation. It demonstrates representation learning and planning-oriented evaluation rather than a deployed user-facing product.",
        "The public treatment is intentionally lean: it shows technical depth while avoiding unsupported ownership or performance claims.",
      ],
      bullets: [
        "Group project.",
        "Focus: JEPA-style observation encoding and world-model training pipeline contribution.",
        "Public GitHub repository is available.",
      ],
    },
    {
      id: "contribution",
      title: "Contribution",
      eyebrow: "Supported by CV",
      body: [
        "The CV supports work on JEPA-style observation encoding modules, preprocessing, training pipeline setup, model training logic, and experiments across highway, merge, and roundabout simulations.",
        "The project uses evaluation dimensions such as collision rate, episode reward, and scenario-level planning metrics, but this site does not publish numeric results because they were not verified from local experiment evidence.",
      ],
      bullets: [
        "Implemented observation encoding modules.",
        "Contributed to training and experiment setup.",
        "Evaluated behavior through planning-oriented metric types.",
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      eyebrow: "World-model loop",
      body: [
        "The project direction combines observation encoding, RSSM latent dynamics, and actor-critic control. That makes it useful evidence for applied AI work that spans representation learning and downstream behavior.",
      ],
      bullets: [
        "Representation-level prediction instead of pixel-level reconstruction as the central framing.",
        "Latent dynamics connected to control.",
        "Simulation scenarios used for behavioral evaluation.",
      ],
    },
  ],
} satisfies ProjectContent;

export default hanoiWorld;
