import { motion } from "framer-motion";
import {
  Brain,
  Puzzle,
  Server,
  Cpu,
  ShieldAlert,
  BookOpen,
  Layers,
  FileText,
} from "lucide-react";

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

interface Guide {
  number: string;
  title: string;
  description: string;
  tags: string[];
}

interface Category {
  name: string;
  color: string;
  colorRgb: string;
  icon: React.ElementType;
  guides: Guide[];
}

// ───────────────────────────────────────────────
// Guide Data — 11 guides across 5 categories
// ───────────────────────────────────────────────

const categories: Category[] = [
  {
    name: "LLM Provider Integration",
    color: "#3B82F6",
    colorRgb: "59, 130, 246",
    icon: Brain,
    guides: [
      {
        number: "01",
        title: "Integrating Gemini Local Models",
        description:
          "Run Google Gemini (Gemma 7B) locally via Ollama for enhanced privacy, reduced costs, and offline capability. Includes Express 5.1 backend integration and React 19 frontend setup.",
        tags: ["Ollama", "Gemma", "Privacy"],
      },
      {
        number: "02",
        title: "Claude Local Setup",
        description:
          "Configure local Anthropic Claude instance for development. Containerized setup with Docker, port 8000, API key integration.",
        tags: ["Anthropic", "Docker", "Local-Dev"],
      },
      {
        number: "03",
        title: "Codex Local Setup",
        description:
          "Run OpenAI Codex locally for code generation. Refactored from docs/adapters to docs/guides. Step-by-step with git mv, nav updates.",
        tags: ["OpenAI", "Codex", "Code-Gen"],
      },
      {
        number: "04",
        title: "External Adapters",
        description:
          "Integrate external systems and services into Valtheron. Covers git mv, nav config updates, link fixes, enterprise compliance.",
        tags: ["Integration", "External-API", "Enterprise"],
      },
    ],
  },
  {
    name: "Adapter System",
    color: "#8B5CF6",
    colorRgb: "139, 92, 246",
    icon: Puzzle,
    guides: [
      {
        number: "05",
        title: "Adapters Overview",
        description:
          "High-level conceptual guide explaining docs/guides vs docs/adapters structure. Covers documentation hierarchy, enterprise compliance, React 19 nav updates.",
        tags: ["Architecture", "Docs-Structure", "Modularity"],
      },
      {
        number: "06",
        title: "Creating an Adapter",
        description:
          "Step-by-step guide for building production-ready adapters. CrmServiceAdapter example with TypeScript interfaces, dependency injection, audit trailing.",
        tags: ["TypeScript", "CRM-Example", "DI"],
      },
      {
        number: "07",
        title: "Adapter UI Parser Contract",
        description:
          "Declarative UI system for adapters. IAdapterUIElement, IAdapterUIConfig, component registry, type-safe rendering.",
        tags: ["UI-Contract", "Declarative", "Type-Safe"],
      },
    ],
  },
  {
    name: "Core Infrastructure",
    color: "#14B8A6",
    colorRgb: "20, 184, 166",
    icon: Server,
    guides: [
      {
        number: "08",
        title: "Core HTTP Client",
        description:
          "Secure and auditable HTTP communication utility. Auto JWT injection, AES-256-GCM encryption, MFA awareness, audit trailing, error handling.",
        tags: ["HTTP", "Security", "Encryption"],
      },
      {
        number: "09",
        title: "Process Adapter",
        description:
          "Execute external processes safely. child_process wrapper with argument sanitization, output capture, timeout management, audit logging.",
        tags: ["Process", "child_process", "Sandbox"],
      },
    ],
  },
  {
    name: "Agent Runtime",
    color: "#F5A623",
    colorRgb: "245, 166, 35",
    icon: Cpu,
    guides: [
      {
        number: "10",
        title: "Agent Runtime Guide",
        description:
          "Understanding agent lifecycle and execution. User-facing guide covering how agents operate, runtime configuration, and interaction patterns.",
        tags: ["Lifecycle", "Execution", "Config"],
      },
    ],
  },
  {
    name: "Control Plane",
    color: "#EF4444",
    colorRgb: "239, 68, 68",
    icon: ShieldAlert,
    guides: [
      {
        number: "11",
        title: "Control-Plane Commands",
        description:
          "Admin/system management commands. Highly privileged operations requiring MFA. User role management, system configuration, comprehensive audit logging.",
        tags: ["Admin", "MFA-Required", "RBAC"],
      },
    ],
  },
];

// ───────────────────────────────────────────────
// Animation Variants
// ───────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const EASE_DEFAULT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE_DEFAULT,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: EASE_DEFAULT,
    },
  },
};

// ───────────────────────────────────────────────
// Components
// ───────────────────────────────────────────────

function PageHeader() {
  return (
    <motion.section
      className="mb-14"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_DEFAULT }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-[#4A5568]">
        <BookOpen size={14} />
        <span className="hover:text-[#3DDC97] transition-colors duration-200 cursor-pointer">
          Documentation
        </span>
        <span className="text-[#4A5568]">/</span>
        <span className="text-[#F0F2F5]">Guides</span>
      </div>

      {/* Title */}
      <h1
        className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: "#F0F2F5",
        }}
      >
        Documentation Guides
      </h1>

      {/* Subtitle */}
      <p
        className="text-lg md:text-xl mb-8 max-w-3xl leading-relaxed"
        style={{ color: "#4A5568" }}
      >
        11 comprehensive guides for the Valtheron ecosystem
      </p>

      {/* Stats Bar */}
      <div
        className="flex flex-wrap items-center gap-6 px-6 py-4 rounded-xl border"
        style={{
          backgroundColor: "#0C1117",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <Layers
            size={18}
            style={{ color: "#3DDC97" }}
            className="shrink-0"
          />
          <span className="text-[#F0F2F5] font-semibold text-sm">5</span>
          <span className="text-[#4A5568] text-sm">Categories</span>
        </div>

        <div
          className="w-px h-5"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        />

        <div className="flex items-center gap-2.5">
          <FileText
            size={18}
            style={{ color: "#3DDC97" }}
            className="shrink-0"
          />
          <span className="text-[#F0F2F5] font-semibold text-sm">11</span>
          <span className="text-[#4A5568] text-sm">Guides</span>
        </div>

        <div
          className="w-px h-5"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        />

        <div className="flex items-center gap-2.5">
          <Server
            size={18}
            style={{ color: "#3DDC97" }}
            className="shrink-0"
          />
          <span className="text-[#F0F2F5] font-semibold text-sm">
            Express 5.1
          </span>
          <span className="text-[#4A5568] text-sm">+</span>
          <span className="text-[#F0F2F5] font-semibold text-sm">React 19</span>
        </div>
      </div>
    </motion.section>
  );
}

function GuideCard({
  guide,
  color,
}: {
  guide: Guide;
  color: string;
}) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -5,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className="group relative flex flex-col rounded-xl border p-6 cursor-pointer transition-all duration-300"
      style={{
        backgroundColor: "#0C1117",
        borderColor: "rgba(255,255,255,0.06)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = color;
        el.style.boxShadow = `0 0 20px rgba(${color
          .replace("#", "")
          .match(/[0-9a-f]{2}/gi)!
          .map((c) => parseInt(c, 16))
          .join(", ")}, 0.12)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(255,255,255,0.06)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Top row: number + icon */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-2xl font-bold tracking-tight"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color,
          }}
        >
          {guide.number}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: `${color}18` }}
        >
          <FileText size={14} style={{ color }} />
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-base font-semibold mb-2.5 leading-snug group-hover:transition-colors duration-300"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "#F0F2F5",
        }}
      >
        {guide.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed mb-5 flex-grow"
        style={{ color: "#4A5568" }}
      >
        {guide.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {guide.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
            style={{
              backgroundColor: `${color}14`,
              color,
              border: `1px solid ${color}22`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom accent bar on hover */}
      <div
        className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}55`,
        }}
      />
    </motion.article>
  );
}

function CategorySection({ category }: { category: Category }) {
  const Icon = category.icon;

  return (
    <motion.section variants={sectionVariants} className="mb-16">
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${category.color}18` }}
        >
          <Icon size={20} style={{ color: category.color }} />
        </div>
        <div className="flex-1">
          <h2
            className="text-xl md:text-2xl font-bold tracking-tight"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "#F0F2F5",
            }}
          >
            {category.name}
          </h2>
        </div>
        {/* Colored accent line */}
        <div
          className="hidden md:block flex-1 h-[2px] rounded-full"
          style={{
            background: `linear-gradient(to right, rgba(${category.colorRgb}, 0.35), transparent)`,
          }}
        />
        {/* Guide count badge */}
        <div
          className="flex items-center justify-center min-w-[32px] h-7 rounded-full px-2.5 text-xs font-bold"
          style={{
            backgroundColor: `${category.color}18`,
            color: category.color,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {category.guides.length}
        </div>
      </div>

      {/* Guides Grid — responsive columns */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {category.guides.map((guide) => (
          <GuideCard key={guide.number} guide={guide} color={category.color} />
        ))}
      </motion.div>
    </motion.section>
  );
}

// ───────────────────────────────────────────────
// Main Page Component
// ───────────────────────────────────────────────

export default function Guides() {
  return (
    <div
      className="min-h-screen px-6 md:px-10 lg:px-16 py-10 md:py-14"
      style={{ backgroundColor: "#070A0E" }}
    >
      <div className="max-w-6xl mx-auto">
        <PageHeader />

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <CategorySection key={category.name} category={category} />
          ))}
        </motion.main>

        {/* Footer note */}
        <motion.footer
          className="mt-10 pt-8 border-t text-center"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <p className="text-sm" style={{ color: "#4A5568" }}>
            Valtheron Agentic Workspace — Documentation v2.0
          </p>
          <p className="text-xs mt-1.5" style={{ color: "#4A5568" }}>
            Built with Express 5.1 + React 19 + TypeScript
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
