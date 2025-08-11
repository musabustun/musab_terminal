import React, { useState, useEffect, useRef } from 'react';
import { Terminal, User, Folder, Mail, HelpCircle, Code, Briefcase, Sun, Moon } from 'lucide-react';

interface Command {
  input: string;
  output: string[];
}

const App: React.FC = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentDir, setCurrentDir] = useState<string[]>([]); // relative to basePath
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const asciiArt = `
    ███╗   ███╗██╗   ██╗███████╗ █████╗ ██████╗ 
    ████╗ ████║██║   ██║██╔════╝██╔══██╗██╔══██╗
    ██╔████╔██║██║   ██║███████╗███████║██████╔╝
    ██║╚██╔╝██║██║   ██║╚════██║██╔══██║██╔══██╗
    ██║ ╚═╝ ██║╚██████╔╝███████║██║  ██║██████╔╝
    ╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝ 
                                                
    
    Welcome to Musab Ustun's Portfolio Terminal
    Type 'help' to explore available commands
  `;

  const commands = {
    help: {
      description: "Show available commands",
      output: [
        "Available commands:",
        "",
        "  help          Show this help message",
        "  about         Learn about Musab Ustun",
        "  skills        View technical expertise",
        "  projects      Browse portfolio projects",
        "  experience    Professional background",
        "  contact       Get in touch",
        "  resume        Download CV/Resume",
        "  github        Open GitHub profile",
        "  linkedin      Open LinkedIn profile",
        "  clear         Clear terminal screen",
        "  whoami        Current user info",
        "  date          Show current date",
        "  pwd           Show current directory",
        "  ls            List directory contents",
        "",
        "Click command buttons above or type directly!"
      ]
    },
    about: {
      description: "Learn about Musab Ustun",
      output: [
        "$ cat about.txt",
        "",
        "Name: Musab Ustun",
        "Title: Senior Software Engineer",
        "Location: Turkey",
        "Focus: Full-Stack Development & System Architecture",
        "",
        "Passionate software engineer with expertise in modern",
        "web technologies and scalable system design.",
        "Specialized in creating efficient, maintainable",
        "solutions that drive business growth.",
        "",
        "Always learning, always building, always improving.",
        "Committed to writing clean code and delivering",
        "exceptional user experiences."
      ]
    },
    skills: {
      description: "View technical expertise",
      output: [
        "$ grep -r \"skills\" ./expertise.json",
        "",
        "Frontend Development:",
        "  ├── React / Next.js        ████████████ Expert",
        "  ├── TypeScript             ███████████  Advanced",
        "  ├── Modern CSS / Tailwind  ████████████ Expert",
        "  └── Vue.js / Nuxt          ██████████   Advanced",
        "",
        "Backend Development:",
        "  ├── Node.js / Express      ███████████  Advanced",
        "  ├── Python / Django        ██████████   Advanced",
        "  ├── Database Design        ███████████  Advanced",
        "  └── API Development        ████████████ Expert",
        "",
        "DevOps & Tools:",
        "  ├── Git / GitHub           ████████████ Expert",
        "  ├── Docker / Kubernetes    ██████████   Advanced",
        "  ├── AWS / Cloud Services   ██████████   Advanced",
        "  └── CI/CD Pipelines        ███████████  Advanced"
      ]
    },
    projects: {
      description: "Browse portfolio projects",
      output: [
        "$ ls -la projects/",
        "",
        "📁 E-Commerce Platform",
        "   ├── Tech: React, Node.js, PostgreSQL",
        "   ├── Features: Payment integration, admin panel",
        "   └── Impact: 40% increase in conversion rates",
        "",
        "📁 Real-Time Analytics Dashboard",
        "   ├── Tech: Vue.js, Python, Redis",
        "   ├── Features: Live data visualization, alerts",
        "   └── Impact: Reduced response time by 60%",
        "",
        "📁 Mobile-First SaaS Application",
        "   ├── Tech: Next.js, TypeScript, Prisma",
        "   ├── Features: Multi-tenant, responsive design",
        "   └── Impact: Served 10k+ active users",
        "",
        "📁 Open Source Contributions",
        "   ├── Various React libraries and tools",
        "   ├── Documentation improvements",
        "   └── Community engagement and mentoring",
        "",
        "Visit GitHub for detailed project information!"
      ]
    },
    experience: {
      description: "Professional background",
      output: [
        "$ cat experience.md",
        "",
        "Professional Experience:",
        "",
        "Senior Software Engineer | Current",
        "├── Leading full-stack development projects",
        "├── Mentoring junior developers",
        "├── Architecture design and code reviews",
        "└── Performance optimization initiatives",
        "",
        "Full-Stack Developer | 2+ years",
        "├── Built scalable web applications",
        "├── Implemented CI/CD pipelines",
        "├── Database design and optimization",
        "└── Cross-functional team collaboration",
        "",
        "Key Achievements:",
        "• Improved application performance by 50%",
        "• Led migration to microservices architecture",
        "• Reduced deployment time from hours to minutes",
        "• Mentored 5+ junior developers"
      ]
    },
    contact: {
      description: "Get in touch",
      output: [
        "$ contact --info",
        "",
        "📧 Email:     musab.ustun@example.com",
        "🐙 GitHub:    github.com/musabustun",
        "💼 LinkedIn:  linkedin.com/in/musabustun",
        "🌐 Website:   musabustun.dev",
        "📱 Phone:     +90 XXX XXX XX XX",
        "",
        "Available for:",
        "• Full-time opportunities",
        "• Freelance projects",
        "• Technical consulting",
        "• Open source collaboration",
        "",
        "Let's build something amazing together!"
      ]
    },
    resume: {
      description: "Download CV/Resume",
      output: [
        "$ wget https://musabustun.dev/resume.pdf",
        "",
        "📄 Resume Download",
        "├── Format: PDF",
        "├── Size: 2.3 MB",
        "├── Last Updated: January 2025",
        "└── Languages: Turkish, English",
        "",
        "Opening resume in new tab...",
        "",
        "Note: Resume contains detailed information about:",
        "• Professional experience and achievements",
        "• Technical skills and certifications",
        "• Education and training background",
        "• Project portfolio and case studies"
      ]
    },
    github: {
      description: "Open GitHub profile",
      output: [
        "$ open https://github.com/musabustun",
        "",
        "🐙 Opening GitHub profile...",
        "",
        "Repository highlights:",
        "├── 50+ public repositories",
        "├── 1000+ contributions this year",
        "├── Active in open source projects",
        "└── Regular code commits and updates",
        "",
        "Redirecting to GitHub..."
      ]
    },
    linkedin: {
      description: "Open LinkedIn profile",
      output: [
        "$ open https://linkedin.com/in/musabustun",
        "",
        "💼 Opening LinkedIn profile...",
        "",
        "Professional network:",
        "├── 500+ connections",
        "├── Software engineering focus",
        "├── Industry insights and articles",
        "└── Professional recommendations",
        "",
        "Redirecting to LinkedIn..."
      ]
    },
    whoami: {
      description: "Current user info",
      output: [
        "musab@portfolio:~$ whoami", 
        "musab",
        "",
        "Senior Software Engineer passionate about",
        "creating innovative digital solutions."
      ]
    },
    clear: {
      description: "Clear terminal screen",
      output: []
    }
  };

  const typeWriter = (
    lines: string[],
    options?: { charDelayMs?: number; lineDelayMs?: number; inputOverride?: string }
  ) => {
    const { charDelayMs = 0, lineDelayMs = 10, inputOverride } = options || {};
    setIsTyping(true);
    const newCommand: Command = {
      input: inputOverride ?? currentInput,
      output: []
    };

    let currentLine = 0;
    let currentChar = 0;

    const tick = () => {
      if (currentLine >= lines.length) {
        setIsTyping(false);
        return;
      }

      const line = lines[currentLine];
      if (charDelayMs > 0 && currentChar < line.length) {
        newCommand.output[currentLine] = (newCommand.output[currentLine] || '') + line[currentChar];
        currentChar++;
        setCommandHistory(prev => [...prev.slice(0, -1), newCommand]);
        setTimeout(tick, charDelayMs);
        return;
      }

      // Write whole line at once (fast terminal)
      newCommand.output[currentLine] = line;
      setCommandHistory(prev => [...prev.slice(0, -1), newCommand]);
      currentLine++;
      currentChar = 0;
      setTimeout(tick, lineDelayMs);
    };

    setCommandHistory(prev => [...prev, newCommand]);
    tick();
  };

  const basePath = '/home/musab/portfolio';
  const getPwd = () => basePath + (currentDir.length ? `/${currentDir.join('/')}` : '');

  const directoryListings: Record<string, { files: string[]; dirs: string[] }> = {
    '': { dirs: ['about', 'projects', 'skills'], files: ['resume.pdf', 'contact.txt', 'README.md'] },
    'projects': { dirs: ['ecommerce', 'analytics', 'saas'], files: [] },
    'about': { dirs: [], files: [] },
    'skills': { dirs: [], files: [] },
    'projects/ecommerce': { dirs: [], files: [] },
    'projects/analytics': { dirs: [], files: [] },
    'projects/saas': { dirs: [], files: [] },
  };

  // Theme: default dark, persist to localStorage, toggle html.dark class
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const initial = stored === 'light' ? 'light' : 'dark';
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const executeCommand = (cmd: string) => {
    const raw = cmd;
    const trimmed = raw.trim();
    if (!trimmed) {
      setCommandHistory(prev => [...prev, { input: '', output: [] }]);
      return;
    }
    const [name, ...args] = trimmed.split(/\s+/);
    const lowered = name.toLowerCase();

    // clear
    if (lowered === 'clear') {
      setCommandHistory([]);
      return;
    }

    // theme
    if (lowered === 'theme') {
      const arg = (args[0] || 'toggle').toLowerCase();
      if (arg === 'toggle') toggleTheme();
      else if (arg === 'dark') {
        if (theme !== 'dark') toggleTheme();
      } else if (arg === 'light') {
        if (theme !== 'light') toggleTheme();
      } else {
        return typeWriter([
          'Usage: theme [dark|light|toggle]'
        ], { charDelayMs: 0, lineDelayMs: 10 });
      }
      return typeWriter([`Theme: ${arg === 'toggle' ? theme === 'dark' ? 'light' : 'dark' : arg}`], { charDelayMs: 0, lineDelayMs: 10 });
    }

    // open
    if (lowered === 'open' && args[0]) {
      const url = args[0];
      if (/^https?:\/\//i.test(url)) {
        window.open(url, '_blank');
        return typeWriter([
          `$ open ${url}`,
          '',
          'Opening in new tab...'
        ], { charDelayMs: 0, lineDelayMs: 10 });
      }
      return typeWriter([`open: invalid url: ${url}`], { charDelayMs: 0, lineDelayMs: 10 });
    }

    // echo
    if (lowered === 'echo') {
      return typeWriter([args.join(' ')], { charDelayMs: 0, lineDelayMs: 10 });
    }

    // history
    if (lowered === 'history') {
      const lines = commandHistory
        .filter(h => h.input)
        .map((h, i) => `${i + 1}  ${h.input}`);
      return typeWriter(lines.length ? lines : ['(empty)'], { charDelayMs: 0, lineDelayMs: 5 });
    }

    // banner
    if (lowered === 'banner') {
      return typeWriter(asciiArt.split('\n'), { charDelayMs: 0, lineDelayMs: 5 });
    }

    // github/linkedin/resume
    if (lowered === 'github') {
      window.open('https://github.com/musabustun', '_blank');
      return typeWriter(commands.github.output, { charDelayMs: 0, lineDelayMs: 10 });
    }
    if (lowered === 'linkedin') {
      window.open('https://linkedin.com/in/musabustun', '_blank');
      return typeWriter(commands.linkedin.output, { charDelayMs: 0, lineDelayMs: 10 });
    }
    if (lowered === 'resume') {
      window.open('https://musabustun.dev/resume.pdf', '_blank');
      return typeWriter(commands.resume.output, { charDelayMs: 0, lineDelayMs: 10 });
    }

    // date
    if (lowered === 'date') {
      const now = new Date().toLocaleString('tr-TR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
      return typeWriter([now], { charDelayMs: 0, lineDelayMs: 10 });
    }

    // pwd
    if (lowered === 'pwd') {
      return typeWriter([getPwd()], { charDelayMs: 0, lineDelayMs: 10 });
    }

    // ls
    if (lowered === 'ls') {
      const rel = args[0] === '/' ? '' : args[0] ? [...currentDir, args[0]].join('/') : currentDir.join('/');
      const key = rel;
      const entry = directoryListings[key in directoryListings ? key : ''];
      const items = [
        ...entry.dirs.map(d => `${d}/`),
        ...entry.files
      ];
      return typeWriter(items.length ? items : ['(empty)'], { charDelayMs: 0, lineDelayMs: 5 });
    }

    // cd
    if (lowered === 'cd') {
      const target = args[0] || '';
      if (!target || target === '~') {
        setCurrentDir([]);
        return typeWriter([], { charDelayMs: 0, lineDelayMs: 0 });
      }
      if (target === '/') {
        setCurrentDir([]);
        return typeWriter([], { charDelayMs: 0, lineDelayMs: 0 });
      }
      if (target === '..') {
        setCurrentDir(prev => prev.slice(0, -1));
        return typeWriter([], { charDelayMs: 0, lineDelayMs: 0 });
      }
      const next = [...currentDir, target].join('/');
      if (directoryListings[next]) {
        setCurrentDir(prev => [...prev, target]);
        return typeWriter([], { charDelayMs: 0, lineDelayMs: 0 });
      }
      return typeWriter([`cd: no such file or directory: ${target}`], { charDelayMs: 0, lineDelayMs: 10 });
    }

    // help
    if (lowered === 'help') {
      const helpLines = [
        'Available commands:',
        '',
        '  help            Show this help message',
        '  banner          Show ASCII banner',
        '  about           Learn about Musab Ustun',
        '  skills          View technical expertise',
        '  projects        Browse portfolio projects',
        '  experience      Professional background',
        '  contact         Get in touch',
        '  resume          Download CV/Resume',
        '  github          Open GitHub profile',
        '  linkedin        Open LinkedIn profile',
        '  theme [opt]     Switch theme (dark|light|toggle)',
        '  echo [text]     Print text',
        '  pwd             Show current directory',
        '  ls [path]       List directory contents',
        '  cd [path]       Change directory',
        '  date            Show current date',
        '  whoami          Current user info',
        '  open <url>      Open URL in new tab',
        '  clear           Clear terminal screen',
        '',
        'Click command buttons above or type directly!'
      ];
      return typeWriter(helpLines, { charDelayMs: 0, lineDelayMs: 5 });
    }

    // static info commands (about, skills, projects, experience, contact)
    if (commands[lowered as keyof typeof commands]) {
      return typeWriter(commands[lowered as keyof typeof commands].output, { charDelayMs: 0, lineDelayMs: 10 });
    }

    // default: not found
    return setCommandHistory(prev => [
      ...prev,
      { input: raw, output: [`zsh: command not found: ${raw}`, "Type 'help' to see available commands."] }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isTyping) {
      executeCommand(currentInput);
      setCurrentInput('');
    }
  };

  const handleCommandClick = (command: string) => {
    if (!isTyping) {
      setCurrentInput(command);
      executeCommand(command);
      setCurrentInput('');
    }
  };

  useEffect(() => {
    if (commandHistory.length === 0) {
      setTimeout(() => {
        typeWriter(asciiArt.split('\n'), { charDelayMs: 0, lineDelayMs: 5 });
      }, 200);
    }
  }, []);

  useEffect(() => {
    if (inputRef.current && !isTyping) {
      inputRef.current.focus();
    }
  }, [isTyping, commandHistory]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const handleTerminalClick = () => {
    if (inputRef.current && !isTyping) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 font-mono text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Terminal Window */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* macOS Window Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer"></div>
              </div>
              <Terminal className="w-4 h-4 text-gray-600 dark:text-gray-200 ml-2" />
              <span className="text-gray-700 dark:text-gray-100 text-sm font-medium">musab@portfolio — zsh — 80×24</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>

          {/* Command Shortcuts */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <div className="flex flex-wrap gap-2">
              {Object.keys(commands).filter(cmd => !['clear', 'date', 'pwd', 'ls'].includes(cmd)).map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleCommandClick(cmd)}
                  disabled={isTyping}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
                >
                  {cmd === 'about' && <User className="w-3 h-3" />}
                  {cmd === 'projects' && <Folder className="w-3 h-3" />}
                  {cmd === 'contact' && <Mail className="w-3 h-3" />}
                  {cmd === 'skills' && <Code className="w-3 h-3" />}
                  {cmd === 'experience' && <Briefcase className="w-3 h-3" />}
                  {cmd === 'help' && <HelpCircle className="w-3 h-3" />}
                  <span>{cmd}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Content */}
          <div 
            ref={terminalRef}
            className="h-96 sm:h-[500px] overflow-y-auto p-4 cursor-text bg-white dark:bg-gray-900"
            onClick={handleTerminalClick}
          >
            {/* Command History */}
            {commandHistory.map((cmd, index) => (
              <div key={index} className="mb-2">
                {cmd.input && (
                  <div className="flex items-center text-gray-800 dark:text-gray-100">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">musab@portfolio</span>
                    <span className="text-gray-400 dark:text-gray-400 mx-1">:</span>
                    <span className="text-gray-600 dark:text-gray-300">~</span>
                    <span className="text-gray-400 dark:text-gray-400 mx-1">$</span>
                    <span className="ml-1">{cmd.input}</span>
                  </div>
                )}
                {cmd.output.map((line, lineIndex) => (
                  <div key={lineIndex} className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {line}
                  </div>
                ))}
              </div>
            ))}

            {/* Current Input */}
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="text-gray-600 dark:text-gray-300 font-medium">musab@portfolio</span>
              <span className="text-gray-400 dark:text-gray-400 mx-1">:</span>
              <span className="text-gray-600 dark:text-gray-300">~</span>
              <span className="text-gray-400 dark:text-gray-400 mx-1">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                disabled={isTyping}
                className="ml-2 bg-transparent outline-none flex-1 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                placeholder={isTyping ? "Processing..." : "Enter command..."}
              />
              {!isTyping && (
                <div className="animate-pulse">
                  <span className="text-gray-800 dark:text-gray-100">█</span>
                </div>
              )}
            </form>
          </div>

          {/* Status Bar */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 text-xs text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <span>Ready — Type 'help' for available commands</span>
              <span>Lines: {commandHistory.reduce((acc, cmd) => acc + cmd.output.length, 0)}</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2025 Musab Ustun — Built with React & TypeScript</p>
        </div>
      </div>
    </div>
  );
};

export default App;