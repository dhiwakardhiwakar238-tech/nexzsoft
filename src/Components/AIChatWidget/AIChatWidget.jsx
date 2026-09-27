import { useEffect, useRef, useState } from "react";
import "./AIChatWidget.css";
import miniRobot from "../../assets/mini-robot.jpeg";

function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [dragging, setDragging] = useState(false);

  const dragRef = useRef({
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    moved: false,
  });

  // --------------------------------------------------
  // Initial position
  // --------------------------------------------------

  useEffect(() => {
    const saved = localStorage.getItem("nexzsoft-mini-position");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        setPosition({
          left: Math.min(
            Math.max(parsed.left, 10),
            window.innerWidth - 80
          ),
          top: Math.min(
            Math.max(parsed.top, 10),
            window.innerHeight - 80
          ),
        });

        return;
      } catch {
        // Ignore invalid saved position
      }
    }

    // Default: bottom-right
    setPosition({
      left: window.innerWidth - 92,
      top: window.innerHeight - 92,
    });
  }, []);

  // --------------------------------------------------
  // Keep widget inside viewport when screen resizes
  // --------------------------------------------------

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => {
        if (!current) return current;

        const size = 70;

        return {
          left: Math.min(
            Math.max(current.left, 10),
            window.innerWidth - size - 10
          ),
          top: Math.min(
            Math.max(current.top, 10),
            window.innerHeight - size - 10
          ),
        };
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // --------------------------------------------------
  // Fullscreen protection
  // --------------------------------------------------

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("chat-fullscreen")) {
        setOpen(false);
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // --------------------------------------------------
  // Drag start
  // --------------------------------------------------

  const handlePointerDown = (event) => {
    // Only allow primary mouse button
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (!position) return;

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startLeft: position.left,
      startTop: position.top,
      moved: false,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);

    setDragging(true);
  };

  // --------------------------------------------------
  // Drag movement
  // --------------------------------------------------

  const handlePointerMove = (event) => {
    if (!dragging || !position) return;

    const deltaX =
      event.clientX - dragRef.current.startX;

    const deltaY =
      event.clientY - dragRef.current.startY;

    // Small movement shouldn't count as drag
    if (
      Math.abs(deltaX) > 5 ||
      Math.abs(deltaY) > 5
    ) {
      dragRef.current.moved = true;
    }

    const widgetSize = 70;

    const newLeft = Math.min(
      Math.max(
        10,
        dragRef.current.startLeft + deltaX
      ),
      window.innerWidth - widgetSize - 10
    );

    const newTop = Math.min(
      Math.max(
        10,
        dragRef.current.startTop + deltaY
      ),
      window.innerHeight - widgetSize - 10
    );

    setPosition({
      left: newLeft,
      top: newTop,
    });
  };

  // --------------------------------------------------
  // Drag end
  // --------------------------------------------------

  const handlePointerUp = (event) => {
    if (!dragging) return;

    setDragging(false);

    event.currentTarget.releasePointerCapture?.(
      event.pointerId
    );

    if (position) {
      localStorage.setItem(
        "nexzsoft-mini-position",
        JSON.stringify(position)
      );
    }

    // If user actually dragged, don't open chat
    if (dragRef.current.moved) {
      return;
    }

    setOpen((current) => !current);
  };

  // --------------------------------------------------
  // Reset position
  // --------------------------------------------------

  const resetPosition = () => {
    const defaultPosition = {
      left: window.innerWidth - 92,
      top: window.innerHeight - 92,
    };

    setPosition(defaultPosition);

    localStorage.setItem(
      "nexzsoft-mini-position",
      JSON.stringify(defaultPosition)
    );
  };

  // --------------------------------------------------
  // Don't render during fullscreen
  // --------------------------------------------------

  if (
    document.body.classList.contains(
      "chat-fullscreen"
    )
  ) {
    return null;
  }

  if (!position) {
    return null;
  }

  return (
    <div
      className={`mini-widget ${
        dragging ? "is-dragging" : ""
      } ${open ? "is-open" : ""}`}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
    >
      {/* =========================================
          CHAT WINDOW
          ========================================= */}

      {open && (
        <div className="mini-chat-box">

          {/* Header */}
          <div className="mini-chat-header">

            <div
              className="mini-brand"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <div className="mini-avatar">
                <img
                  src={miniRobot}
                  alt="Mini AI"
                />
              </div>

              <div className="mini-brand-info">
                <div className="mini-name">
                  Mini
                </div>

                <div className="mini-status">
                  <span />
                  Online
                </div>
              </div>
            </div>

            <div className="mini-header-actions">

              {/* Drag indicator */}
              <button
                className="mini-drag-button"
                title="Drag Mini"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </button>

              {/* Minimize */}
              <button
                className="mini-control"
                onClick={() => setOpen(false)}
                aria-label="Minimize"
              >
                −
              </button>

              {/* Close */}
              <button
                className="mini-control"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>

            </div>
          </div>

          {/* Body */}
          <div className="mini-chat-body">

            <div className="mini-message">

              <div className="mini-message-avatar">
                <img
                  src={miniRobot}
                  alt=""
                />
              </div>

              <div className="mini-message-content">
                <div className="mini-message-bubble">

                  <strong>
                    Hi there! 👋
                  </strong>

                  <p>
                    I'm Mini, your AI assistant.
                    How can I help you today?
                  </p>

                </div>
              </div>

            </div>

            {/* Suggested actions */}
            <div className="mini-suggestions">

              {/*<button>
                Pricing
              </button>

              <button>
                Book a Demo
              </button>

              <button>
                Product Info
              </button>

              <button>
                Support
              </button>*/}

            </div>

            {/* Main CTA */}
            <a
              href="https://wa.me/917904009090"
              target="_blank"
              rel="noreferrer"
              className="mini-contact-button"
            >

              <div className="mini-contact-icon">
                ↗
              </div>

              <div className="mini-contact-text">

                <strong>
                  Chat with us
                </strong>

                <span>
                  Get help from our team
                </span>

              </div>

              <div className="mini-contact-arrow">
                →
              </div>

            </a>

            <div className="mini-response-time">
              <span>✦</span>
              Usually replies instantly
            </div>

          </div>

          {/* Footer */}
          <div className="mini-footer">
            Powered by <strong>Nexzsoft AI</strong>
          </div>

        </div>
      )}

      {/* =========================================
          MINI FLOATING BUTTON
          ========================================= */}

      {!open && (
        <div
          className="mini-launcher"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          title="Drag Mini or click to chat"
        >

          <div className="mini-launcher-ring" />

          <div className="mini-launcher-image">
            <img
              src={miniRobot}
              alt="Mini"
              draggable="false"
            />
          </div>

          <div className="mini-online-dot" />

          <div className="mini-label">
            Mini
          </div>

        </div>
      )}

      {/* =========================================
          RESET POSITION
          ========================================= */}

      {open && (
        <button
          className="mini-reset-position"
          onClick={resetPosition}
          title="Reset Mini position"
        >
          ↔
        </button>
      )}

    </div>
  );
}

export default AIChatWidget;
