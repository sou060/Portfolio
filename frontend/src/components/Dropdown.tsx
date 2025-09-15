import React, { memo, useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts';

interface DropdownItem {
  id: string;
  label: string;
  value: any;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  trigger: ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  maxHeight?: string;
  onSelect?: (item: DropdownItem) => void;
  onOpen?: () => void;
  onClose?: () => void;
  closeOnSelect?: boolean;
  closeOnOutsideClick?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

const Dropdown: React.FC<DropdownProps> = memo(({
  items,
  trigger,
  placement = 'bottom-start',
  size = 'md',
  variant = 'default',
  disabled = false,
  className = '',
  triggerClassName = '',
  contentClassName = '',
  itemClassName = '',
  maxHeight = '300px',
  onSelect,
  onOpen,
  onClose,
  closeOnSelect = true,
  closeOnOutsideClick = true,
  searchable = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No items found',
}) => {
  const { state: themeState } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate dropdown position
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let x = 0;
    let y = 0;

    // Calculate base position based on placement
    switch (placement) {
      case 'bottom-start':
        x = triggerRect.left;
        y = triggerRect.bottom + 8;
        break;
      case 'bottom-end':
        x = triggerRect.right - contentRect.width;
        y = triggerRect.bottom + 8;
        break;
      case 'top-start':
        x = triggerRect.left;
        y = triggerRect.top - contentRect.height - 8;
        break;
      case 'top-end':
        x = triggerRect.right - contentRect.width;
        y = triggerRect.top - contentRect.height - 8;
        break;
      case 'left-start':
        x = triggerRect.left - contentRect.width - 8;
        y = triggerRect.top;
        break;
      case 'left-end':
        x = triggerRect.left - contentRect.width - 8;
        y = triggerRect.bottom - contentRect.height;
        break;
      case 'right-start':
        x = triggerRect.right + 8;
        y = triggerRect.top;
        break;
      case 'right-end':
        x = triggerRect.right + 8;
        y = triggerRect.bottom - contentRect.height;
        break;
    }

    // Keep dropdown within viewport
    if (x < 8) x = 8;
    if (x + contentRect.width > viewport.width - 8) {
      x = viewport.width - contentRect.width - 8;
    }
    if (y < 8) y = 8;
    if (y + contentRect.height > viewport.height - 8) {
      y = viewport.height - contentRect.height - 8;
    }

    setPosition({ x, y });
  }, [placement]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        closeOnOutsideClick
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnOutsideClick]);

  // Update position when dropdown opens
  useEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen, calculatePosition]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Toggle dropdown
  const toggleDropdown = useCallback(() => {
    if (disabled) return;

    if (isOpen) {
      setIsOpen(false);
      onClose?.();
    } else {
      setIsOpen(true);
      onOpen?.();
    }
  }, [disabled, isOpen, onOpen, onClose]);

  // Handle item selection
  const handleItemClick = useCallback((item: DropdownItem) => {
    if (item.disabled) return;

    item.onClick?.();
    onSelect?.(item);

    if (closeOnSelect) {
      setIsOpen(false);
      onClose?.();
    }
  }, [onSelect, closeOnSelect, onClose]);

  // Handle search input
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  // Get size classes
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'dropdown-sm';
      case 'md': return 'dropdown-md';
      case 'lg': return 'dropdown-lg';
      default: return 'dropdown-md';
    }
  };

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: placement.startsWith('top') ? 10 : placement.startsWith('bottom') ? -10 : 0,
      x: placement.startsWith('left') ? 10 : placement.startsWith('right') ? -10 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.2,
      }
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`dropdown-container ${getSizeClass()} ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Trigger */}
      <div
        ref={triggerRef}
        className={`dropdown-trigger ${triggerClassName}`}
        onClick={toggleDropdown}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {trigger}
      </div>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contentRef}
            className={`dropdown-content ${contentClassName}`}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex: 1000,
              backgroundColor: themeState.resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
              border: `1px solid ${themeState.resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}`,
              borderRadius: '0.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              minWidth: '200px',
              maxHeight,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Search Input */}
            {searchable && (
              <div style={{ padding: '0.75rem', borderBottom: `1px solid ${themeState.resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}` }}>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${themeState.resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '0.375rem',
                    backgroundColor: themeState.resolvedTheme === 'dark' ? '#0f172a' : '#f8fafc',
                    color: themeState.resolvedTheme === 'dark' ? '#f1f5f9' : '#1e293b',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22c55e';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = themeState.resolvedTheme === 'dark' ? '#334155' : '#e2e8f0';
                  }}
                />
              </div>
            )}

            {/* Items List */}
            <div style={{ overflow: 'auto', flex: 1 }}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div key={item.id}>
                    {item.divider && (
                      <div
                        style={{
                          height: '1px',
                          backgroundColor: themeState.resolvedTheme === 'dark' ? '#334155' : '#e2e8f0',
                          margin: '0.5rem 0',
                        }}
                      />
                    )}
                    <div
                      className={`dropdown-item ${itemClassName}`}
                      onClick={() => handleItemClick(item)}
                      style={{
                        padding: '0.75rem 1rem',
                        cursor: item.disabled ? 'not-allowed' : 'pointer',
                        opacity: item.disabled ? 0.6 : 1,
                        color: themeState.resolvedTheme === 'dark' ? '#f1f5f9' : '#1e293b',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'background-color 0.2s ease',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!item.disabled) {
                          e.currentTarget.style.backgroundColor = themeState.resolvedTheme === 'dark' ? '#334155' : '#f1f5f9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {item.icon && (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    color: themeState.resolvedTheme === 'dark' ? '#94a3b8' : '#64748b',
                    fontSize: '0.875rem',
                  }}
                >
                  {emptyMessage}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;
