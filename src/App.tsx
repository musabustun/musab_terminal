import React, { useState, useEffect, useRef } from 'react';
import { Terminal, User, Folder, Mail, HelpCircle, Code, Briefcase, Sun, Moon } from 'lucide-react';

interface Command {
  input: string;
  output: string[];
  cwd: string;
  isChat?: boolean;
}

const App: React.FC = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentDir, setCurrentDir] = useState<string[]>([]); // relative to basePath
  const [awaitingPassword, setAwaitingPassword] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // AI chat session state
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const N8N_WEBHOOK_URL: string | undefined = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

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
    ai: {
      description: "Start AI chat with n8n agent",
      output: [
        "$ ai",
        "",
        "Starting AI chat session...",
        "Type your messages to chat with the agent.",
        "Use '/bye' to exit."
      ]
    },
    chat: {
      description: "Alias of 'ai' command",
      output: [
        "$ chat",
        "",
        "Starting AI chat session...",
        "Type your messages to chat with the agent.",
        "Use '/bye' to exit."
      ]
    },
    help: {
      description: "Show available commands",
      output: [
        "Available commands:",
        "",
        "  help          Show this help message",
        "  ai            Start AI chat (n8n agent)",
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
        "📧 Email:     musabyusufustun@outlook.com",
        "🐙 GitHub:    @https://github.com/musabustun",
        "💼 LinkedIn:  @https://www.linkedin.com/in/musabustun/",
        "📸 Instagram: @https://www.instagram.com/musabust",
        "🌐 Website:   musabustun.xyz",
        "📱 Phone:     +90 (544) 720 43 65",
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
        "$ wget https://musabustun.xyz/resume.pdf",
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
        "$ open https://www.linkedin.com/in/musabustun/",
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
    options?: { charDelayMs?: number; lineDelayMs?: number; inputOverride?: string; isChat?: boolean }
  ) => {
    const { charDelayMs = 0, lineDelayMs = 10, inputOverride, isChat = false } = options || {};
    setIsTyping(true);
    const newCommand: Command = {
      input: inputOverride ?? currentInput,
      output: [],
      cwd: displayPath(),
      isChat,
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

  const fileContents: Record<string, string[]> = {
    'contact.txt': [
      'Contact Information',
      '',
      'Email: musab.ustun@example.com',
      'GitHub: https://github.com/musabustun',
      'LinkedIn: https://linkedin.com/in/musabustun',
      'Website: https://musabustun.dev',
    ],
    'README.md': [
      '# Portfolio Terminal',
      '',
      'Interactive portfolio terminal built with React, TypeScript, and TailwindCSS.',
      '',
      'Commands: help, about, skills, projects, experience, contact, resume, github, linkedin, theme, echo, history, banner, pwd, ls, cd, date, whoami, open, clear, cat, sudo',
    ],
    // Example project readmes (optional)
    'projects/ecommerce/README.md': ['E-Commerce Platform', 'Tech: React, Node.js, PostgreSQL'],
  };

  const displayPath = () => `~${currentDir.length ? '/' + currentDir.join('/') : ''}`;
  const normalizeRelativePath = (pathStr: string, baseSegments: string[]): string => {
    const raw = pathStr.trim();
    if (!raw || raw === '~' || raw === '/') return '';
    const tokens = raw.startsWith('/') ? raw.slice(1).split('/') : [...baseSegments, ...raw.split('/')];
    const stack: string[] = [];
    for (const token of tokens) {
      if (!token || token === '.') continue;
      if (token === '..') {
        if (stack.length) stack.pop();
        continue;
      }
      stack.push(token);
    }
    return stack.join('/');
  };
  const resolvePath = (arg?: string): string => {
    if (arg === undefined) return currentDir.join('/');
    return normalizeRelativePath(arg, currentDir);
  };
  const getListing = (relPath: string) => directoryListings[relPath];
  const getNamesForPath = (relPath: string) => {
    const entry = getListing(relPath);
    if (!entry) return [] as string[];
    return [...entry.dirs.map(d => `${d}/`), ...entry.files];
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
      setCommandHistory(prev => [...prev, { input: '', output: [], cwd: displayPath() }]);
      return;
    }
    const [name, ...args] = trimmed.split(/\s+/);
    const lowered = name.toLowerCase();

    // clear
    if (lowered === 'clear') {
      setCommandHistory([]);
      return;
    }

    // sudo (disabled)
    if (lowered === 'sudo') {
      return typeWriter(['sudo: işlem red edildi'], { charDelayMs: 0, lineDelayMs: 10, inputOverride: raw });
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

    // ai / chat: start AI chat session via n8n webhook
    if (lowered === 'ai' || lowered === 'chat') {
      if (!N8N_WEBHOOK_URL) {
        return typeWriter([
          'AI chat unavailable: VITE_N8N_WEBHOOK_URL is not set.',
          'Set it in your .env file and rebuild the project.'
        ], { charDelayMs: 0, lineDelayMs: 10 });
      }
      const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      setIsChatting(true);
      setChatSessionId(id);
      setChatHistory([]);
      return typeWriter([
        'mAI chat session started.',
        "Type your message. Use '/bye' to exit.",
      ], { charDelayMs: 0, lineDelayMs: 10, isChat: true });
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
      window.open('https://musabustun.xyz/resume.pdf', '_blank');
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
      const rel = args[0] ? resolvePath(args[0]) : currentDir.join('/');
      const entry = getListing(rel);
      if (!entry) {
        return typeWriter([`ls: ${args[0] || '.'}: No such file or directory`], { charDelayMs: 0, lineDelayMs: 10 });
      }
      const items = [...entry.dirs.map(d => `${d}/`), ...entry.files];
      return typeWriter(items.length ? items : ['(empty)'], { charDelayMs: 0, lineDelayMs: 5 });
    }

    // cd
    if (lowered === 'cd') {
      const target = args[0];
      const next = resolvePath(target);
      if (next === '') {
        setCurrentDir([]);
        return typeWriter([], { charDelayMs: 0, lineDelayMs: 0 });
      }
      if (directoryListings[next]) {
        setCurrentDir(next.split('/'));
        return typeWriter([], { charDelayMs: 0, lineDelayMs: 0 });
      }
      return typeWriter([`cd: no such file or directory: ${target ?? ''}`], { charDelayMs: 0, lineDelayMs: 10 });
    }

    // cat
    if (lowered === 'cat') {
      if (!args[0]) return typeWriter(['usage: cat <file>'], { charDelayMs: 0, lineDelayMs: 10 });
      const rel = resolvePath(args[0]);
      const isDir = !!getListing(rel);
      if (isDir) return typeWriter([`cat: ${args[0]}: Is a directory`], { charDelayMs: 0, lineDelayMs: 10 });
      const content = fileContents[rel] || fileContents[args[0]] || fileContents[`${rel}.txt`] || fileContents[`${rel}.md`];
      if (!content) {
        if (rel.endsWith('.pdf')) return typeWriter([`cat: ${args[0]}: binary file (use 'open ${args[0]}')`], { charDelayMs: 0, lineDelayMs: 10 });
        return typeWriter([`cat: ${args[0]}: No such file or directory`], { charDelayMs: 0, lineDelayMs: 10 });
      }
      return typeWriter(content, { charDelayMs: 0, lineDelayMs: 5 });
    }

    // help
    if (lowered === 'help') {
      const helpLines = [
        'Available commands:',
        '',
        '  help            Show this help message',
        '  ai              Start AI chat (n8n agent)',
        '  banner          Show ASCII banner',
        '  about           Learn about Musab Ustun',
        '  skills          View technical expertise',
        '  projects        Browse portfolio projects',
        '  experience      Professional background',
        '  contact         Get in touch',
        '  resume          Download CV/Resume',
        '  github          Open GitHub profile',
        '  linkedin        Open LinkedIn profile',
        '  cat <file>      Print file content (.txt/.md)',
        "  sudo <cmd>      Run a command as superuser",
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
      { input: raw, output: [`zsh: command not found: ${raw}`, "Type 'help' to see available commands."], cwd: displayPath() }
    ]);
  };

  // Call n8n webhook and return assistant reply text
  const callN8nAgent = async (message: string): Promise<string> => {
    if (!N8N_WEBHOOK_URL) {
      return 'AI chat error: webhook URL is not configured.';
    }
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain;q=0.9,*/*;q=0.8',
        },
        body: JSON.stringify({
          sessionId: chatSessionId,
          message,
          history: chatHistory,
        }),
      });
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        return `AI chat error: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`;
      }
      if (contentType.includes('application/json')) {
        const data = await response.json();
        const reply = data.output ?? data.reply ?? data.text ?? data.message ?? JSON.stringify(data);
        return String(reply);
      }
      const text = await response.text();
      return text || '(empty response)';
    } catch (err) {
      return `AI chat error: ${(err as Error).message}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isTyping) {
      // sudo password prompt flow disabled; ignore awaitingPassword
      if (awaitingPassword) {
        setCurrentInput('');
        setAwaitingPassword(false);
        
        typeWriter(['sudo: işlem red edildi'], { charDelayMs: 0, lineDelayMs: 10, inputOverride: '' });
        return;
      }

      // AI chat session handling
      if (isChatting) {
        const message = currentInput;
        setCurrentInput('');
        // Exit chat on /bye
        if (message.trim() === '/bye') {
          setIsChatting(false);
          setChatSessionId(null);
          setChatHistory([]);
          typeWriter(['Chat session ended.'], { charDelayMs: 0, lineDelayMs: 10, inputOverride: '' });
          return;
        }

        // Show the user message as a prompt entry
        setCommandHistory(prev => [
          ...prev,
          { input: message, output: [], cwd: displayPath(), isChat: true }
        ]);

        // Persist to chat history
        setChatHistory(prev => [...prev, { role: 'user', content: message }]);

        // Disable input until response arrives
        setIsTyping(true);

        // Call n8n agent and show assistant reply
        const reply = await callN8nAgent(message);
        setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
        const replyLines = reply.split('\n').map(line => line);
        typeWriter(replyLines, { charDelayMs: 1, lineDelayMs: 5, inputOverride: '', isChat: true });
        return;
      }

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

  // Tab completion for commands and paths
  const allCommands = [
    'help','banner','ai','chat','about','skills','projects','experience','contact','resume','github','linkedin','theme','echo','pwd','ls','cd','date','whoami','open','clear','cat','sudo'
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTyping) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      const value = currentInput;
      if (!value.trim()) return;
      const [first, ...rest] = value.split(/\s+/);
      // complete command
      if (rest.length === 0) {
        const matches = allCommands.filter(c => c.startsWith(first));
        if (matches.length === 1) setCurrentInput(matches[0] + ' ');
        else if (matches.length > 1) typeWriter(matches, { charDelayMs: 0, lineDelayMs: 5, inputOverride: value });
        return;
      }
      // path completion for ls/cd/cat/open
      // const cmd = first.toLowerCase(); // currently not used; reserved for future command-specific completion
      const joinRest = rest.join(' ');
      const beforeCursor = joinRest; // simple case
      const token = beforeCursor.split(' ').pop() || '';
      const base = token.includes('/') ? token.slice(0, token.lastIndexOf('/')) : '';
      const relBase = resolvePath(base || '.');
      const names = getNamesForPath(relBase);
      const partial = token.includes('/') ? token.slice(token.lastIndexOf('/') + 1) : token;
      const candidates = names.filter(n => n.startsWith(partial));
      if (candidates.length === 1) {
        const completed = (base ? base + '/' : '') + candidates[0];
        const newValue = value.replace(/\s+[^\s]*$/, ' ' + completed + (candidates[0].endsWith('/') ? '' : ''));
        setCurrentInput(newValue);
      } else if (candidates.length > 1) {
        typeWriter(candidates, { charDelayMs: 0, lineDelayMs: 5, inputOverride: value });
      }
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
    <div className="min-h-dvh bg-gray-100 dark:bg-gray-900 p-4 pt-safe pb-safe font-mono text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Terminal Window */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden terminal-window">
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
                className="flex items-center gap-1 px-3 py-2 md:px-2 md:py-1 rounded-md text-sm md:text-xs font-medium border border-gray-200 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>

          {/* Command Shortcuts */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600 overflow-x-auto no-scrollbar" aria-label="Command shortcuts">
            <div className="flex flex-nowrap gap-2 min-w-full pr-2">
              {Object.keys(commands).filter(cmd => !['clear', 'date', 'pwd', 'ls'].includes(cmd)).map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleCommandClick(cmd)}
                  disabled={isTyping}
                  className="flex items-center space-x-1 px-3 py-2 md:py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm md:text-xs font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
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
            className="h-[65dvh] md:h-[500px] overflow-y-auto no-scrollbar p-4 cursor-text bg-white dark:bg-gray-900"
            role="log"
            aria-live="polite"
            onClick={handleTerminalClick}
          >
            {/* Command History */}
            {commandHistory.map((cmd, index) => (
              <div key={index} className="mb-2">
                {cmd.input && (
                  <div className="flex items-center text-gray-800 dark:text-gray-100">
                    {cmd.isChat ? (
                      <>
                        <span className="text-green-500 mr-2">&gt;&gt;&gt;</span>
                        <span>{cmd.input}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-600 dark:text-gray-300 font-medium">musab@portfolio</span>
                        <span className="text-gray-400 dark:text-gray-400 mx-1 hidden sm:inline">:</span>
                        <span className="text-gray-600 dark:text-gray-300 hidden sm:inline">{cmd.cwd}</span>
                        <span className="text-gray-400 dark:text-gray-400 mx-1">$</span>
                        <span className="ml-1">{cmd.input}</span>
                      </>
                    )}
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
              {isChatting ? (
                <span className="text-green-500">&gt;&gt;&gt;</span>
              ) : (
                <>
                  <span className="text-gray-600 dark:text-gray-300 font-medium">musab@portfolio</span>
                  <span className="text-gray-400 dark:text-gray-400 mx-1 hidden sm:inline">:</span>
                  <span className="text-gray-600 dark:text-gray-300 hidden sm:inline">{displayPath()}</span>
                  <span className="text-gray-400 dark:text-gray-400 mx-1">$</span>
                </>
              )}
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="ml-2 bg-transparent outline-none flex-1 text-base md:text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                inputMode="text"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint={isChatting ? 'send' : 'go'}
                placeholder={isTyping ? "Processing..." : (isChatting ? "Type your message... (/bye to exit)" : "Enter command...")}
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