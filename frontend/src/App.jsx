"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import {
  Send,
  Plus,
  Bot,
  User,
  Trash2,
  ExternalLink,
  Sparkles,
  Command,
  Settings,
  Moon,
  Sun,
  Zap,
  MessageSquare,
  Loader2,
  Copy,
} from "lucide-react"
import { cn } from "../lib/utils"
import "./App.css"
import "./index.css"

export default function ChatApp() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(crypto.randomUUID())
  const [audioPlayer] = useState(new Audio())
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const [darkMode, setDarkMode] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipContent, setTooltipContent] = useState("")
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Add keyboard shortcut for sending messages
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        document.getElementById("message-input")?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    try {
      setLoading(true)
      const userMessage = input
      setInput("")
      setMessages((prev) => [...prev, { type: "user", content: userMessage }])

      const response = await axios.post("http://localhost:3000/api/chat", {
        message: userMessage,
        sessionId,
      })

      setMessages((prev) => [...prev, { type: "assistant", content: response.data.response }])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [...prev, { type: "error", content: "An error occurred. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  const startNewChat = () => {
    setMessages([])
    setMenuOpen(false)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const showCopyTooltip = (text, x, y) => {
    navigator.clipboard.writeText(text)
    setTooltipContent("Copied to clipboard!")
    setTooltipPosition({ x, y })
    setShowTooltip(true)
    setTimeout(() => setShowTooltip(false), 2000)
  }

  // Define suggestion items
  const suggestionItems = [
    { icon: Zap, title: "Explain quantum computing in simple terms" },
    { icon: Settings, title: "How do I optimize my website for SEO?" },
    { icon: Sparkles, title: "Write a poem about artificial intelligence" },
  ]

  return (
    <div
      className={cn(
        "flex h-screen w-screen overflow-hidden transition-colors duration-300",
        darkMode ? "bg-[#0a0a16] text-white" : "bg-[#f0f4f8]",
      )}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/20 via-violet-900/10 to-purple-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          {darkMode && (
            <>
              <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vh] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse-slow"></div>
              <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vh] rounded-full bg-violet-600/10 blur-[100px] animate-pulse-slow animation-delay-2000"></div>
              <div className="absolute top-[40%] right-[30%] w-[20vw] h-[20vh] rounded-full bg-purple-600/10 blur-[100px] animate-pulse-slow animation-delay-4000"></div>
            </>
          )}
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg pointer-events-none transition-opacity duration-200"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 30}px`,
            opacity: showTooltip ? 1 : 0,
          }}
        >
          {tooltipContent}
        </div>
      )}

      {/* Mobile menu overlay */}
      {menuOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMenuOpen(false)}></div>}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-50 h-full w-[280px] transition-all duration-300 ease-in-out transform",
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          darkMode
            ? "bg-[#0f0f1a]/80 backdrop-blur-xl border-r border-indigo-500/10"
            : "bg-white/80 backdrop-blur-xl border-r border-gray-200",
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg"></div>
                <div className="absolute inset-[2px] bg-[#0f0f1a] rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <h1 className={cn("text-xl font-bold", darkMode ? "text-white" : "text-gray-900")}>Metaldness</h1>
            </div>
            <button
              className={cn(
                "p-2 rounded-lg hover:bg-gray-800/10",
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900",
              )}
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={startNewChat}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg p-2 transition-all duration-200 mb-6",
              darkMode
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white"
                : "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white",
            )}
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 py-4">
            <div
              className={cn(
                "flex items-center px-2 py-1.5 text-xs font-semibold uppercase tracking-wider",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              <MessageSquare className="w-3.5 h-3.5 mr-2" />
              Recent Chats
            </div>

            {/* This would be populated with actual chat history */}
            <div className={cn("px-2 py-1 text-sm", darkMode ? "text-gray-500" : "text-gray-400")}>No recent chats</div>
          </div>

          <div
            className={cn(
              "mt-auto pt-4 border-t text-xs",
              darkMode ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-400",
            )}
          >
            <div className="flex items-center justify-between">
              <span>Made by</span>
              <a
                href="https://github.com/DavidAdeboye/"
                className={cn(
                  "flex items-center gap-1 transition-colors",
                  darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-500 hover:text-indigo-400",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Metaldness <ExternalLink size={12} />
              </a>
            </div>
            <div className="flex items-center mt-2 text-[10px] opacity-70">
              <Command size={10} className="mr-1" /> + / to focus input
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden relative">
        {/* Mobile header */}
        <div
          className={cn(
            "md:hidden flex items-center justify-between p-4 border-b",
            darkMode ? "border-gray-800" : "border-gray-200",
          )}
        >
          <button
            className={cn(
              "p-2 rounded-lg",
              darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900",
            )}
            onClick={() => setMenuOpen(true)}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <h1 className={cn("text-lg font-bold", darkMode ? "text-white" : "text-gray-900")}>Metaldness AI</h1>
          <button
            className={cn(
              "p-2 rounded-lg",
              darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900",
            )}
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Chat Messages */}
        <div
          className={cn("flex-1 overflow-y-auto p-4 md:p-6 space-y-6", darkMode ? "scrollbar-dark" : "scrollbar-light")}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 animate-pulse-slow"></div>
                <div
                  className={cn(
                    "absolute inset-[2px] rounded-full flex items-center justify-center",
                    darkMode ? "bg-[#0a0a16]" : "bg-white",
                  )}
                >
                  <Bot size={40} className={cn(darkMode ? "text-indigo-400" : "text-indigo-500")} />
                </div>
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse-slow"></div>
              </div>

              <h1
                className={cn(
                  "text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 mb-4",
                  "animate-shimmer",
                )}
              >
                Metaldness AI
              </h1>

              <p className={cn("max-w-md mb-8", darkMode ? "text-gray-400" : "text-gray-600")}>
                Your advanced AI assistant powered by cutting-edge technology. Ask me anything and I'll do my best to
                assist you.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl">
                {suggestionItems.map((suggestion, index) => (
                  <button
                    key={index}
                    className={cn(
                      "flex items-center p-3 rounded-xl text-left text-sm transition-all duration-200",
                      darkMode
                        ? "bg-gray-800/30 border border-gray-700/30 hover:border-indigo-500/50 hover:bg-gray-800/50"
                        : "bg-gray-100/80 border border-gray-200 hover:border-indigo-300 hover:bg-gray-100",
                    )}
                    onClick={() => {
                      setInput(suggestion.title)
                      document.getElementById("message-input")?.focus()
                    }}
                  >
                    <suggestion.icon
                      className={cn("w-4 h-4 mr-2 flex-shrink-0", darkMode ? "text-indigo-400" : "text-indigo-500")}
                    />
                    <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{suggestion.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "group flex items-start gap-3 max-w-3xl mx-auto",
                    message.type === "user" ? "flex-row-reverse" : "",
                  )}
                >
                  <div
                    className={cn(
                      "relative flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                      message.type === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600"
                        : message.type === "error"
                          ? "bg-gradient-to-r from-red-600 to-pink-600"
                          : "bg-gradient-to-r from-violet-600 to-indigo-600",
                    )}
                  >
                    {message.type === "user" ? (
                      <User size={16} className="text-white" />
                    ) : message.type === "error" ? (
                      <Trash2 size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}

                    <div
                      className={cn(
                        "absolute -inset-0.5 rounded-lg opacity-0 transition-opacity duration-200",
                        message.type === "user"
                          ? "bg-gradient-to-r from-indigo-400 to-violet-400 group-hover:opacity-100"
                          : message.type === "error"
                            ? "bg-gradient-to-r from-red-400 to-pink-400 group-hover:opacity-100"
                            : "bg-gradient-to-r from-violet-400 to-indigo-400 group-hover:opacity-100",
                        "blur-sm",
                      )}
                    ></div>
                  </div>

                  <div
                    className={cn(
                      "relative rounded-2xl p-4 max-w-[85%] transition-all duration-200",
                      message.type === "user"
                        ? darkMode
                          ? "bg-indigo-600/10 border border-indigo-500/20 hover:border-indigo-500/30"
                          : "bg-indigo-50 border border-indigo-100 hover:border-indigo-200"
                        : message.type === "error"
                          ? darkMode
                            ? "bg-red-900/10 border border-red-500/20 hover:border-red-500/30"
                            : "bg-red-50 border border-red-100 hover:border-red-200"
                          : darkMode
                            ? "bg-gray-800/40 border border-gray-700/40 hover:border-gray-700/60"
                            : "bg-white border border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <div
                      className={cn(
                        "prose max-w-none",
                        darkMode
                          ? "prose-invert prose-pre:bg-gray-900/50 prose-pre:border prose-pre:border-gray-700/50"
                          : "prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200",
                      )}
                    >
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>

                    <button
                      className={cn(
                        "absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                        darkMode
                          ? "hover:bg-gray-700/50 text-gray-400 hover:text-white"
                          : "hover:bg-gray-100 text-gray-500 hover:text-gray-900",
                      )}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        showCopyTooltip(message.content, rect.left, rect.top)
                      }}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3 max-w-3xl mx-auto">
                  <div className="relative flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0 blur-sm"></div>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl p-4",
                      darkMode ? "bg-gray-800/40 border border-gray-700/40" : "bg-white border border-gray-200",
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          darkMode ? "bg-indigo-400" : "bg-indigo-500",
                        )}
                      ></div>
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full animate-pulse animation-delay-200",
                          darkMode ? "bg-indigo-400" : "bg-indigo-500",
                        )}
                      ></div>
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full animate-pulse animation-delay-500",
                          darkMode ? "bg-indigo-400" : "bg-indigo-500",
                        )}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className={cn(
            "border-t p-4",
            darkMode
              ? "border-gray-800 bg-[#0f0f1a]/80 backdrop-blur-sm"
              : "border-gray-200 bg-white/80 backdrop-blur-sm",
          )}
        >
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
            <div
              className={cn(
                "relative rounded-xl overflow-hidden transition-all duration-200 focus-within:ring-2",
                darkMode
                  ? "bg-gray-800/50 border border-gray-700/50 focus-within:ring-indigo-500/50"
                  : "bg-gray-50 border border-gray-200 focus-within:ring-indigo-500/30",
              )}
            >
              <textarea
                id="message-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Virdict AI..."
                className={cn(
                  "w-full py-3 pl-4 pr-12 resize-none focus:outline-none",
                  darkMode
                    ? "bg-transparent text-white placeholder:text-gray-500"
                    : "bg-transparent text-gray-900 placeholder:text-gray-500",
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                rows={1}
                style={{ minHeight: "56px", maxHeight: "200px" }}
              />

              <div className="absolute right-2 bottom-2 flex items-center">
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    darkMode
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>

              {/* Glowing effect on focus */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none",
                  input ? "opacity-10" : "opacity-0",
                  darkMode ? "bg-indigo-500 blur-md" : "bg-indigo-300 blur-md",
                )}
              ></div>
            </div>

            <div
              className={cn(
                "flex items-center justify-center mt-2 text-xs",
                darkMode ? "text-white/70" : "text-gray-400",
              )}
            >
              <Command size={12} className="mr-1" /> + / to focus • Press Enter to send, Shift+Enter for a new line
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}