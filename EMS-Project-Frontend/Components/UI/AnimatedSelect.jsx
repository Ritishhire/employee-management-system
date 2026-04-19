import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

/**
 * A modern, beautifully animated dropdown component.
 * Supports dark mode, smooth transitions, and tactile feedback.
 */
const AnimatedSelect = ({ 
    options = [], 
    value, 
    onChange, 
    placeholder = "Select option", 
    label,
    icon: Icon,
    className = "" 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className={`space-y-1.5 ${className}`} ref={containerRef}>
            {label && (
                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">
                    {label}
                </label>
            )}
            
            <div className="relative">
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-flex flex items-center justify-between w-full 
                        bg-slate-50 dark:bg-slate-800 border-none rounded-xl 
                        px-4 py-3 text-sm font-semibold transition-all
                        ${isOpen ? 'ring-2 ring-teal-500/20' : ''}
                        text-slate-700 dark:text-slate-200
                    `}
                >
                    <div className="flex items-center gap-3">
                        {Icon && <Icon size={16} className="text-slate-400" />}
                        <span className={!selectedOption ? "text-slate-400 dark:text-slate-500" : ""}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                    </div>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown size={16} className="text-slate-400" />
                    </motion.div>
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 4, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute z-50 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto">
                                {options.map((option) => (
                                    <motion.button
                                        key={option.value}
                                        type="button"
                                        whileHover={{ backgroundColor: "rgba(20, 184, 166, 0.05)" }}
                                        onClick={() => handleSelect(option.value)}
                                        className={`
                                            w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors
                                            ${value === option.value 
                                                ? "text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-900/20" 
                                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                            }
                                        `}
                                    >
                                        {option.label}
                                        {value === option.value && <Check size={14} />}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AnimatedSelect;
